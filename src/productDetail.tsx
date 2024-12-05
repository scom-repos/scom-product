import {
    Button,
    ControlElement,
    customElements,
    Icon,
    Image,
    Input,
    Label,
    Module,
    Panel,
    StackLayout,
    Styles,
} from '@ijstech/components';
import { imageListStyle, numberInputStyle } from './index.css';
import { ProductModel } from './model';

const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-product--detail']: ControlElement;
        }
    }
}

@customElements('i-scom-product--detail')
export class ScomProductDetail extends Module {
    private lblName: Label;
    private pnlImageListWrapper: StackLayout;
    private pnlImages: StackLayout;
    private imgProduct: Image;
    private lblDescription: Label;
    private pnlStock: Panel;
    private lblStock: Label;
    private lblPrice: Label;
    private edtQuantity: Input;
    private iconMinus: Icon;
    private iconPlus: Icon;
    private btnAddToCart: Button;
    private activeImage: Image;
    private _model: ProductModel;
    public onProductAdded: (stallId: string) => void;

    get model() {
        return this._model;
    }

    set model(value: ProductModel) {
        this._model = value;
    }

    private get quantity() {
        return Number(this.edtQuantity.value) || 1;
    }

    private getStockQuantity() {
        const { product } = this.model.getData() || {};
        if (product?.quantity != null && product?.quantity.toString() != "" && product?.quantity >= 0) {
            return Number(product?.quantity);
        }
        return null;
    }

    show() {
        this.pnlImageListWrapper.visible = false;
        this.activeImage = undefined;
        this.pnlImages.clearInnerHTML();
        const { product } = this.model.getData() || {};
        this.lblName.caption = product?.name || "";
        this.imgProduct.url = product?.images?.[0] || "";
        if (product?.images?.length > 1) {
            for (let image of product?.images) {
                const imageElm = this.addImage(image);
                if (!this.activeImage) this.selectImage(imageElm);
            }
            this.pnlImageListWrapper.visible = true;
        }
        this.lblDescription.caption = product?.description || "";
        const stockQuantity = this.getStockQuantity();
        this.lblStock.caption = stockQuantity ? ": " + stockQuantity : "";
        this.pnlStock.visible = stockQuantity > 1;
        this.lblPrice.caption = `${product?.price || ""} ${product?.currency || ""}`;
        this.edtQuantity.value = 1;
        this.iconMinus.enabled = false;
        this.iconPlus.enabled = stockQuantity == null || stockQuantity > 1;
        const logginedUserStr = localStorage.getItem('loggedInUser');
        this.btnAddToCart.enabled = !!logginedUserStr;
    }

    clear() {
        this.lblName.caption = "";
        this.pnlImageListWrapper.visible = false;
        this.activeImage = undefined;
        this.pnlImages.clearInnerHTML();
        this.imgProduct.url = "";
        this.lblDescription.caption = "";
        this.lblStock.caption = "";
        this.pnlStock.visible = false;
        this.lblPrice.caption = "";
        this.edtQuantity.value = 1;
        this.iconMinus.enabled = false;
        this.iconPlus.enabled = false;
        this.btnAddToCart.enabled = false;
    }

    private addImage(image: string) {
        const imageElm = (
            <i-image
                display="block"
                width="100%"
                height="auto"
                border={{ radius: '0.75rem', width: 2, style: 'solid', color: 'transparent' }}
                padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }}
                url={image}
                cursor="pointer"
                mediaQueries={[
                    {
                        maxWidth: '767px',
                        properties: {
                            stack: { grow: '1', shrink: '0', basis: '25%' }
                        }
                    }
                ]}
                onClick={this.selectImage.bind(this)}
            ></i-image>
        );
        this.pnlImages.appendChild(imageElm);
        return imageElm;
    }

    private selectImage(target: Image) {
        if (this.activeImage) {
            this.activeImage.classList.remove('active');
        }
        this.activeImage = target;
        this.activeImage.classList.add('active');
        this.imgProduct.url = target.url;
    }

    private updateQuantity(isIncremental: boolean) {
        let quantity = Number.isInteger(this.quantity) ? this.quantity : Math.trunc(this.quantity);
        const stockQuantity = this.getStockQuantity();
        if (isIncremental) {
            if (stockQuantity == null || stockQuantity > quantity) {
                this.edtQuantity.value = ++quantity;
            }
        } else {
            if (quantity > 1) {
                this.edtQuantity.value = --quantity;
            }
        }
        this.iconMinus.enabled = quantity > 1;
        this.iconPlus.enabled = stockQuantity == null || stockQuantity > 1;
    }

    private increaseQuantity() {
        this.updateQuantity(true);
    }

    private decreaseQuantity() {
        this.updateQuantity(false);
    }

    private handleQuantityChanged() {
        const stockQuantity = this.getStockQuantity();
        if (!Number.isInteger(this.quantity)) {
            this.edtQuantity.value = Math.trunc(this.quantity);
        }
        this.iconMinus.enabled = this.quantity > 1;
        this.iconPlus.enabled = stockQuantity == null || stockQuantity > 1;
    }

    private handleAddToCart() {
        const logginedUserStr = localStorage.getItem('loggedInUser');
        if (!logginedUserStr) return;
        const logginedUser = JSON.parse(logginedUserStr);
        const { product, stall } = this.model.getData() || {};
        const key = `shoppingCart/${logginedUser.id}/${product.stallId}`;
        const productStr = localStorage.getItem(key);
        if (!productStr) {
            localStorage.setItem(key, JSON.stringify([{
                ...product,
                stallName: stall.name,
                quantity: this.quantity,
                available: product.quantity
            }]));
        } else {
            const products = JSON.parse(productStr) || [];
            const selectedProduct = products.find(p => p.id === product.id);
            if (selectedProduct) {
                selectedProduct.quantity += this.quantity;
            } else {
                products.push({
                    ...product,
                    stallName: stall.name,
                    quantity: this.quantity,
                    available: product.quantity
                });
            }
            localStorage.setItem(key, JSON.stringify(products));
        }
        if (this.onProductAdded) this.onProductAdded(product.stallId);
    }

    init() {
        super.init();
        this.updateQuantity = this.updateQuantity.bind(this);
    }

    render() {
        return (
            <i-stack
                direction="vertical"
                padding={{ left: '1rem', right: '1rem', bottom: '2rem' }}
                lineHeight={1.5}
            >
                <i-label
                    id="lblName"
                    class="text-center"
                    font={{ size: '1.875rem', weight: 700 }}
                    padding={{ top: '1rem', bottom: '2rem' }}
                />
                <i-stack
                    direction="horizontal"
                    width="100%"
                    gap="1rem"
                    mediaQueries={[
                        {
                            maxWidth: '767px',
                            properties: {
                                direction: "vertical",
                            }
                        }
                    ]}
                >
                    <i-stack
                        direction="horizontal"
                        width="100%"
                        maxWidth="50%"
                        stack={{ grow: '1' }}
                        padding={{ right: '1rem' }}
                        border={{ right: { width: 1, style: 'solid', color: Theme.divider } }}
                        mediaQueries={[
                            {
                                maxWidth: '767px',
                                properties: {
                                    maxWidth: '100%',
                                    direction: "vertical",
                                    reverse: true,
                                    padding: { bottom: '1rem' },
                                    border: { width: '0 0 1px 0', style: 'solid', color: Theme.divider }
                                }
                            }
                        ]}
                    >
                        <i-stack
                            id="pnlImageListWrapper"
                            width="35%"
                            direction="horizontal"
                            justifyContent="center"
                            stack={{ shrink: '0' }}
                            visible={false}
                            mediaQueries={[
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        width: '100%',
                                    }
                                }
                            ]}
                        >
                            <i-stack
                                id="pnlImages"
                                class={imageListStyle}
                                direction="vertical"
                                width="10%"
                                minWidth={86}
                                margin={{ top: '-0.5rem' }}
                                alignItems="center"
                                mediaQueries={[
                                    {
                                        maxWidth: '767px',
                                        properties: {
                                            direction: "horizontal",
                                            width: '100%',
                                            minWidth: 'unset',
                                            margin: {},
                                            padding: { top: '0.5rem' },
                                            overflow: { x: 'auto' }
                                        }
                                    }
                                ]}
                            ></i-stack>
                        </i-stack>
                        <i-image
                            id="imgProduct"
                            display="block"
                            width="100%"
                            height="auto"
                            border={{ radius: '0.75rem' }}
                            overflow="hidden"
                        ></i-image>
                    </i-stack>
                    <i-stack direction="vertical" width="100%" alignItems="center" gap="2rem">
                        <i-label id="lblDescription" class="text-center" font={{ size: '1.125rem' }}></i-label>
                        <i-stack direction="horizontal" justifyContent="center" gap="2rem">
                            <i-panel id="pnlStock" visible={false}>
                                <i-label display="inline" caption="$stock" font={{ size: '1.5rem', color: Theme.text.secondary }}></i-label>
                                <i-label id="lblStock" font={{ size: '1.5rem', color: Theme.text.secondary }}></i-label>
                            </i-panel>
                            <i-label id="lblPrice" font={{ size: '1.5rem', color: Theme.text.secondary }}></i-label>
                        </i-stack>
                        <i-stack direction="horizontal" justifyContent="center" gap="0.25rem">
                            <i-icon
                                id="iconMinus"
                                width='1.875rem'
                                height='1.875rem'
                                name='minus-circle'
                                padding={{ left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }}
                                border={{ radius: '50%' }}
                                stack={{ shrink: '0' }}
                                fill={Theme.text.primary}
                                enabled={false}
                                cursor='pointer'
                                onClick={this.decreaseQuantity}
                            ></i-icon>
                            <i-input
                                id="edtQuantity"
                                class={numberInputStyle}
                                width={100}
                                height='2rem'
                                inputType="number"
                                padding={{ left: '0.5rem', right: '0.5rem' }}
                                border={{ radius: 5 }}
                                onChanged={this.handleQuantityChanged}
                            ></i-input>
                            <i-icon
                                id="iconPlus"
                                width='1.875rem'
                                height='1.875rem'
                                name='plus-circle'
                                padding={{ left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }}
                                border={{ radius: '50%' }}
                                stack={{ shrink: '0' }}
                                fill={Theme.text.primary}
                                enabled={false}
                                cursor='pointer'
                                onClick={this.increaseQuantity}
                            ></i-icon>
                        </i-stack>
                        <i-button
                            id="btnAddToCart"
                            minHeight={36}
                            minWidth={120}
                            caption="Add to Cart"
                            border={{ radius: 18 }}
                            padding={{ top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }}
                            font={{ color: Theme.colors.primary.contrastText, bold: true }}
                            enabled={false}
                            onClick={this.handleAddToCart}
                        ></i-button>
                    </i-stack>
                </i-stack>
            </i-stack>
        )
    }
}