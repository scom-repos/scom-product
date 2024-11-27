import {
    Button,
    ControlElement,
    customElements,
    Icon,
    Image,
    Input,
    Label,
    Module,
    Styles,
} from '@ijstech/components';
import { numberInputStyle } from './index.css';
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
    private imgProduct: Image;
    private lblDescription: Label;
    private lblStock: Label;
    private lblPrice: Label;
    private edtQuantity: Input;
    private iconMinus: Icon;
    private iconPlus: Icon;
    private btnAddToCart: Button;
    private _model: ProductModel;

    get model() {
        return this._model;
    }

    set model(value: ProductModel) {
        this._model = value;
    }

    private get quantity() {
        return Number(this.edtQuantity.value) || 1;
    }

    show() {
        const { name, description, images, quantity, price, currency } = this.model.getData() || {};
        this.lblName.caption = name || "";
        this.imgProduct.url = images?.[0] || "";
        this.lblDescription.caption = description || "";
        this.lblStock.caption = quantity != null ? "Stock: " + quantity : "";
        this.lblStock.visible = quantity != null;
        this.lblPrice.caption = `${price || ""} ${currency || ""}`;
        this.edtQuantity.value = 1;
        this.iconMinus.enabled = false;
        this.iconPlus.enabled = quantity == null || quantity > 1;
    }

    clear() {
        this.lblName.caption = "";
        this.imgProduct.url = "";
        this.lblDescription.caption = "";
        this.lblStock.caption = "";
        this.lblPrice.caption = "";
        this.edtQuantity.value = 1;
        this.iconMinus.enabled = false;
        this.iconPlus.enabled = false;
    }

    private updateQuantity(isIncremental: boolean) {
        const productInfo = this.model.getData();
        let quantity = Number.isInteger(this.quantity) ? this.quantity : Math.trunc(this.quantity);
        if (isIncremental) {
            if (productInfo.quantity == null || productInfo.quantity > quantity) {
                this.edtQuantity.value = ++quantity;
            }
        } else {
            if (quantity > 1) {
                this.edtQuantity.value = --quantity;
            }
        }
        this.iconMinus.enabled = quantity > 1;
        this.iconPlus.enabled = productInfo.quantity == null || productInfo.quantity > 1;
    }

    private increaseQuantity() {
        this.updateQuantity(true);
    }

    private decreaseQuantity() {
        this.updateQuantity(false);
    }

    private handleQuantityChanged() {
        const productInfo = this.model.getData();
        if (!Number.isInteger(this.quantity)) {
            this.edtQuantity.value = Math.trunc(this.quantity);
        }
        this.iconMinus.enabled = this.quantity > 1;
        this.iconPlus.enabled = productInfo.quantity == null || productInfo.quantity > 1;
    }

    private handleAddToCart() {}
    
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
                <i-stack direction="horizontal" width="100%" gap="1rem">
                    <i-panel
                        width="100%"
                        maxWidth="50%"
                        stack={{ grow: '1' }}
                        padding={{ right: '1rem' }}
                        border={{ right: { width: 1, style: 'solid', color: Theme.divider } }}
                    >
                        <i-image
                            id="imgProduct"
                            display="block"
                            width="100%"
                            height="auto"
                            border={{ radius: '0.75rem' }}
                            overflow="hidden"
                        ></i-image>
                    </i-panel>
                    <i-stack direction="vertical" width="100%" alignItems="center" gap="2rem">
                        <i-label id="lblDescription" class="text-center" font={{ size: '1.125rem' }}></i-label>
                        <i-stack direction="horizontal" justifyContent="center" gap="2rem">
                            <i-label id="lblStock" font={{ size: '1.5rem', color: Theme.text.secondary }}></i-label>
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
                            onClick={this.handleAddToCart}
                        ></i-button>
                    </i-stack>
                </i-stack>
            </i-stack>
        )
    }
}