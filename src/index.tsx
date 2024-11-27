import {
    ControlElement,
    customElements,
    Image,
    Label,
    Module,
    Styles,
} from '@ijstech/components';
import { cardStyle, imageStyle } from './index.css';
import { IProductInfo } from './interface';
import { ProductModel } from './model';

const Theme = Styles.Theme.ThemeVars;

interface ScomProductElement extends ControlElement { }

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-product']: ScomProductElement;
        }
    }
}

@customElements('i-scom-product')
export class ScomProduct extends Module {
    private imgProduct: Image;
    private lblName: Label;
    private lblPrice: Label;
    private model: ProductModel;

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
        const { images, name, price, currency } = this.getData() || {};
        this.imgProduct.url = images?.[0] || "";
        this.lblName.caption = name || "";
        this.lblPrice.caption = `${price || ""} ${currency || ""}`;
    }

    init() {
        super.init();
        this.model = new ProductModel();
        this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-stack
                    class={cardStyle}
                    direction="vertical"
                    width="24rem"
                    background={{ color: Theme.background.paper }}
                    margin={{ left: 'auto', right: 'auto' }}
                    border={{ radius: '0.75rem', width: '1px', style: 'solid', color: Theme.background.paper }}
                    overflow="hidden"
                    cursor='pointer'
                >
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
                        <i-label id="lblPrice" font={{ color: Theme.text.secondary, size: "0.875rem" }} lineHeight="1.25rem"></i-label>
                    </i-stack>
                </i-stack>
            </i-panel>
        )
    }
}