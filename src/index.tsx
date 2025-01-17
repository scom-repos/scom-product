import {
    Button,
    ControlElement,
    customElements,
    Image,
    Label,
    Markdown,
    markdownToPlainText,
    Module,
    StackLayout,
    Styles,
} from '@ijstech/components';
import { ICommunityProductInfo, MarketplaceProductType } from '@scom/scom-social-sdk';
import { cardStyle, imageStyle } from './index.css';
import { IProductConfig, IProductInfo } from './interface';
import { ProductModel } from './model';
import translations from './translations.json';
import { isPurchasedProduct } from './utils';

const Theme = Styles.Theme.ThemeVars;

interface ScomProductElement extends ControlElement {
    config?: IProductConfig;
    product?: ICommunityProductInfo;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-product']: ScomProductElement;
        }
    }
}

@customElements('i-scom-product')
export class ScomProduct extends Module {
    private pnlProduct: StackLayout;
    private imgProduct: Image;
    private lblName: Label;
    private markdownDescription: Markdown;
    private lblPrice: Label;
    private lblMessage: Label;
    private btnAddToCart: Button;
    private model: ProductModel;
    private _isPreview = false;
    private isPurchased = false;
    onProductAdded: (stallId: string) => void;

    get isPreview() {
        return this._isPreview;
    }

    set isPreview(value: boolean) {
        this._isPreview = value;
        if (this.pnlProduct) this.pnlProduct.cursor = value || !this.model.isLoggedIn ? "default" : "pointer";
        if (this.btnAddToCart) this.btnAddToCart.enabled = !value && this.model.isLoggedIn;
    }

    getConfigurators() {
        return this.model.getConfigurators()
    }

    async setData(data: IProductInfo) {
        await this.model.setData(data);
    }

    getData() {
        return this.model.getData();
    }

    getTag() {
        return this.tag;
    }

    setTag(value: any) {
        this.model.setTag(value);
    }

    private async updateUIBySetData() {
        const { product } = this.getData() || {};
        this.imgProduct.url = product?.images?.[0] || "";
        this.lblName.caption = product?.name || "";
        if (product?.description) {
            const plainText = await this.markdownDescription.toPlainText(product.description);
            this.markdownDescription.load(plainText || "");
        } else {
            this.markdownDescription.load("");
        }
        this.markdownDescription.visible = !!product?.description;
        this.lblPrice.caption = `${product?.price || ""} ${product?.currency || ""}`;
        this.btnAddToCart.visible = !!product;
        if (product.productType === MarketplaceProductType.Digital) {
            this.isPurchased = await isPurchasedProduct(product.id, product.stallId);
        }
        this.updateCartButton();
    }

    private updateCartButton() {
        const itemCount = this.model.getItemCountInCart();
        this.lblMessage.visible = this.isPurchased || itemCount > 0;
        this.lblMessage.caption = this.isPurchased ? this.i18n.get("$purchased_message") : this.i18n.get('$already_in_cart', { quantity: itemCount });
        this.btnAddToCart.caption = this.i18n.get(this.isPurchased ? "$view_post_purchase_content" : itemCount > 0 ? "$buy_more" : "$add_to_cart");
    }

    private async handleProductClick() {
        const { product } = this.getData() || {};
        if (this.isPreview || !product) return;
        window.location.assign(`#!/product-detail/${product.stallId}/${product.id}`);
    }

    private handleButtonClick() {
        if (this.isPreview) return;
        if (this.isPurchased) {
            this.handleProductClick();
            return;
        }
        this.btnAddToCart.rightIcon.spin = true;
        this.btnAddToCart.rightIcon.visible = true;
        this.btnAddToCart.caption = "";
        this.model.addToCart(1, async (stallId: string) => {
            await new Promise(resolve => setTimeout(resolve, 800));
            this.btnAddToCart.rightIcon.spin = false;
            this.btnAddToCart.rightIcon.visible = false;
            this.updateCartButton();
            if (this.onProductAdded) this.onProductAdded(stallId);
        });
    }

    private initMarkdownStyle() {
        this.markdownDescription.style.display = '-webkit-box';
        this.markdownDescription.style.webkitLineClamp = `${2}`;
        this.markdownDescription.style.overflow = 'hidden';
        this.markdownDescription.style.webkitBoxOrient = 'vertical';
        this.markdownDescription.style.whiteSpace = '';
    }

    init() {
        this.i18n.init({ ...translations });
        super.init();
        this.model = new ProductModel();
        this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
        this.btnAddToCart.enabled = this.model.isLoggedIn;
        this.pnlProduct.cursor = this.model.isLoggedIn ? 'pointer' : 'default';
        this.initMarkdownStyle();
        const isPreview = this.getAttribute('isPreview', true);
        if (isPreview != null) this.isPreview = isPreview;
        const config = this.getAttribute('config', true);
        const product = this.getAttribute('product', true);
        if (config) {
            this.setData({ config, product });
        }
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-stack
                    id="pnlProduct"
                    class={cardStyle}
                    direction="vertical"
                    width="100%"
                    height="100%"
                    maxWidth="24rem"
                    background={{ color: Theme.background.paper }}
                    margin={{ left: 'auto', right: 'auto' }}
                    border={{ radius: '0.75rem', width: '1px', style: 'solid', color: Theme.background.paper }}
                    overflow="hidden"
                    cursor='pointer'
                    onClick={this.handleProductClick}
                >
                    <i-panel>
                        <i-stack
                            direction="horizontal"
                            width="100%"
                            height="100%"
                            stack={{ shrink: '0' }}
                            overflow="hidden"
                        >
                            <i-panel
                                width="100%"
                                height={0}
                                overflow="hidden"
                                padding={{ bottom: "100%" }}
                                background={{ color: Theme.action.disabledBackground }}
                            >
                                <i-image
                                    id="imgProduct"
                                    class={imageStyle}
                                    position="absolute"
                                    display="block"
                                    width="100%"
                                    height="100%"
                                    top="100%"
                                    left={0}
                                    objectFit="cover"
                                ></i-image>
                            </i-panel>
                        </i-stack>
                    </i-panel>
                    <i-stack
                        direction="vertical"
                        alignItems="center"
                        padding={{ top: '1rem', bottom: '1rem', left: '1.25rem', right: '1.25rem' }}
                        gap="0.5rem"
                    >
                        <i-label
                            id="lblName"
                            class="text-center"
                            font={{ size: '1.25rem', weight: 500 }}
                            wordBreak="break-word"
                            lineHeight={'1.5rem'}
                        ></i-label>
                        <i-markdown
                            id="markdownDescription"
                            width="100%"
                            class="text-center"
                            font={{ size: '1rem' }}
                            lineHeight={'1.25rem'}
                            overflow="hidden"
                            visible={false}
                        ></i-markdown>
                        <i-label id="lblPrice" font={{ color: Theme.text.secondary, size: "0.875rem", weight: 600 }} lineHeight="1.25rem"></i-label>
                        <i-label id="lblMessage" class="text-center" font={{ color: Theme.colors.success.main, size: '0.9375rem' }} visible={false}></i-label>
                    </i-stack>
                    <i-button
                        id="btnAddToCart"
                        class="text-center"
                        minHeight={40}
                        width="100%"
                        caption="$add_to_cart"
                        margin={{ top: 'auto' }}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        font={{ color: Theme.colors.primary.contrastText, bold: true }}
                        onClick={this.handleButtonClick}
                        visible={false}
                    ></i-button>
                </i-stack>
            </i-panel>
        )
    }
}