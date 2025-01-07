import formSchema from "./formSchema";
import { IProductInfo } from "./interface";
import { fetchCommunityProducts, fetchCommunityStalls, getLoggedInUserId } from "./utils";

export class ProductModel {
  private _data: IProductInfo = {};
  private _tag: any;
  public updateUIBySetData: () => Promise<void>;

  addToCart(quantity: number, callback?: (stallId: string) => void) {
    const logginedUserId = getLoggedInUserId();
    if (!logginedUserId) return;
    const { product, stall } = this.getData() || {};
    const key = `shoppingCart/${logginedUserId}/${product.stallId}`;
    const productStr = localStorage.getItem(key);
    if (!productStr) {
      localStorage.setItem(key, JSON.stringify([{
        ...product,
        stallName: stall?.name || "",
        quantity: quantity,
        available: product.quantity
      }]));
    } else {
      const products = JSON.parse(productStr) || [];
      const selectedProduct = products.find(p => p.id === product.id);
      if (selectedProduct) {
        selectedProduct.quantity += quantity;
      } else {
        products.push({
          ...product,
          stallName: stall?.name || "",
          quantity: quantity,
          available: product.quantity
        });
      }
      localStorage.setItem(key, JSON.stringify(products));
    }
    if (callback) callback(product.stallId);
  }
  
  getItemCountInCart() {
    const logginedUserId = getLoggedInUserId();
    if (!logginedUserId) return;
    const { product, stall } = this.getData() || {};
    const key = `shoppingCart/${logginedUserId}/${product.stallId}`;
    const productStr = localStorage.getItem(key);
    if (productStr) {
      const products = JSON.parse(productStr) || [];
      const selectedProduct = products.find(p => p.id === product.id);
      return selectedProduct?.quantity || 0;
    }
    return 0;
  }

  getConfigurators() {
    return [
      {
        name: 'Editor',
        target: 'Editor',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  async setData(value: IProductInfo) {
    this._data = value;
    const { config, product, stall } = this._data || {};
    if (config?.creatorId && config?.communityId) {
      if (!product) {
        const products = await fetchCommunityProducts(config.creatorId, config.communityId);
        this._data.product = products?.find(product => product.id === config.productId);
      }
      if (!stall) {
        const stalls = await fetchCommunityStalls(config.creatorId, config.communityId);
        this._data.stall = stalls?.find(stall => stall.id === this._data.product?.stallId);
      }
    }
    if (this.updateUIBySetData) this.updateUIBySetData();
  }

  getData() {
    return this._data;
  }

  getTag() {
    return this._tag;
  }

  setTag(value: any) {
    this._tag = value;
  }

  private getActions() {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: IProductInfo = {};
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify(this._data));
              if (builder?.setData) builder.setData(userInputData);
            },
            undo: () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema,
        customControls: formSchema.customControls()
      }
    ]
    return actions;
  }

  get isLoggedIn() {
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    return !!loggedInUserStr;
  }
}