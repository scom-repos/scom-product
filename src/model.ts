import formSchema from "./formSchema";
import { IProductInfo } from "./interface";
import { fetchCommunityProducts, fetchCommunityStalls } from "./utils";

export class ProductModel {
    private _data: IProductInfo = {};
    private _tag: any;
    public updateUIBySetData: () => Promise<void>;

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
        const { config, product } = this._data || {};
        if (config?.creatorId && config?.communityId) {
          if (!product) {
            const products = await fetchCommunityProducts(config.creatorId, config.communityId);
            this._data.product = products?.find(product => product.id === config.productId);
          }
          const stalls = await fetchCommunityStalls(config.creatorId, config.communityId);
          this._data.stall = stalls?.find(stall => stall.id === this._data.product.stallId);
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
}