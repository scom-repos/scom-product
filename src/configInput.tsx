import {
    customElements,
    ControlElement,
    Styles,
    Module,
    Input,
    ComboBox,
    application,
} from '@ijstech/components';
import { ICommunityProductInfo, SocialDataManager } from '@scom/scom-social-sdk';
import { fetchCommunityProducts, extractCommunityUri } from './utils';

const Theme = Styles.Theme.ThemeVars;

interface IProductConfig {
    communityUri?: string;
    productId?: string;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-product--config-input']: ControlElement;
        }
    }
}

@customElements('i-scom-product--config-input')
export class ScomProductConfigInput extends Module {
    private edtCommunityUri: Input;
    private comboProductId: ComboBox;
    private timeout: any;
    private products: ICommunityProductInfo[] = [];

    getData() {
        return {
            communityUri: this.edtCommunityUri?.value || "",
            productId: this.comboProductId?.selectedItem?.value || ""
        }
    }

    async setData(data: IProductConfig) {
        if (this.edtCommunityUri) {
            this.edtCommunityUri.value = data.communityUri || "";
            if (data.communityUri) {
                await this.fetchCommunityProducts(data.communityUri);
                this.comboProductId.selectedItem = this.comboProductId.items.find(product => product.value === data.productId);
            }
        }
    }

    private async fetchCommunityProducts(communityUri: string) {
        const { creatorId, communityId } = extractCommunityUri(communityUri);
        this.products = await fetchCommunityProducts(creatorId, communityId);
        this.comboProductId.items = this.products.map(product => ({
            label: product.name || product.id,
            value: product.id
        }));
    }

    private handleCommunityUriChanged() {
        if (this['onChanged']) this['onChanged']();
        if (this.timeout) clearTimeout(this.timeout);
        const communityUri = this.edtCommunityUri.value;
        this.comboProductId.items = [];
        this.comboProductId.selectedItem = undefined;
        if (!communityUri.includes('/npub')) return;
        this.timeout = setTimeout(() => this.fetchCommunityProducts(communityUri), 500)
    }

    private handleProductIdChanged() {
        if (this['onChanged']) this['onChanged']();
    }

    init() {
        super.init();
        this.fetchCommunityProducts = this.fetchCommunityProducts.bind(this);
    }

    render() {
        return (
            <i-stack direction="vertical">
                <i-input
                    id="edtCommunityUri"
                    width="100%"
                    height={42}
                    padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                    border={{ radius: '0.625rem' }}
                    placeholder="Community Id/Creator's npub"
                    onChanged={this.handleCommunityUriChanged}
                ></i-input>
                <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" justifyContent="center" gap={5}>
                        <i-stack direction="horizontal" width="100%" alignItems="center" gap={2}>
                            <i-label caption="$product"></i-label>
                        </i-stack>
                        <i-combo-box
                            id="comboProductId"
                            width="100%"
                            height={42}
                            icon={{ name: 'caret-down' }}
                            border={{ radius: '0.625rem' }}
                            onChanged={this.handleProductIdChanged}
                        ></i-combo-box>
                    </i-stack>
                </i-panel>
            </i-stack>
        )
    }
}