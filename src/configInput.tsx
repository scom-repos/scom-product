import {
    customElements,
    ControlElement,
    Styles,
    Module,
    Input,
    ComboBox,
    StackLayout,
    Button,
    application,
} from '@ijstech/components';
import { ICommunityProductInfo } from '@scom/scom-social-sdk';
import { IProductConfig } from './interface';
import { fetchCommunityProducts, fetchCommunityStalls, getCommunityBasicInfoFromUri } from './utils';

const Theme = Styles.Theme.ThemeVars;

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
    private comboStallId: ComboBox;
    private comboProductId: ComboBox;
    private timeout: any;
    private config: IProductConfig = {};

    getData() {
        const productId = this.comboProductId?.selectedItem?.value || "";
        if (!productId) return;
        return {
            creatorId: this.config?.creatorId,
            communityId: this.config?.communityId,
            stallId: this.comboStallId?.selectedItem?.value || "",
            productId: productId
        }
    }

    async setData(data: IProductConfig) {
        this.config = data;
        if (this.edtCommunityUri) {
            if (data.creatorId && data.communityId) {
                this.edtCommunityUri.value = `${data.communityId}/${data.creatorId}`;
                await this.fetchCommunityStalls(data.creatorId, data.communityId);
                if (data.stallId) {
                    this.comboStallId.selectedItem = this.comboStallId.items.find(item => item.value === data.stallId);
                    await this.fetchCommunityProducts(data.creatorId, data.communityId, data.stallId);
                    this.comboProductId.selectedItem = this.comboProductId.items.find(product => product.value === data.productId);
                } else {
                    this.comboStallId.clear();
                    this.comboProductId.clear();
                    this.comboProductId.items = [];
                }
            } else {
                this.edtCommunityUri.value = "";
                this.comboStallId.clear();
                this.comboStallId.items = [];
                this.comboProductId.clear();
                this.comboProductId.items = [];
            }
        }
    }

    private async fetchCommunityStalls(creatorId: string, communityId: string) {
        const stalls = await fetchCommunityStalls(creatorId, communityId);
        this.comboStallId.items = stalls.map(stall => ({
            label: stall.name || stall.id,
            value: stall.id
        }));
        this.comboStallId.enabled = true;
    }

    private async fetchCommunityProducts(creatorId: string, communityId: string, stallId?: string) {
        const products = await fetchCommunityProducts(creatorId, communityId, stallId);
        this.comboProductId.items = products.map(product => ({
            label: product.name || product.id,
            value: product.id
        }));
        this.comboProductId.enabled = true;
    }

    private async handleCommunityUriChanged() {
        this.comboStallId.clear();
        this.comboStallId.items = [];
        this.comboStallId.enabled = false;
        this.comboProductId.clear();
        this.comboProductId.items = [];
        this.comboProductId.enabled = false;
        if (this['onChanged']) this['onChanged']();
        const communityUri: string = this.edtCommunityUri.value;
        if (!communityUri) return;
        const { creatorId, communityId } = getCommunityBasicInfoFromUri(communityUri);
        this.config.creatorId = creatorId,
        this.config.communityId = communityId,
        await this.fetchCommunityStalls(creatorId, communityId);
    }

    private async handleStallIdChanged() {
        const stallId = this.comboStallId.selectedItem.value;
        this.comboProductId.clear();
        this.comboProductId.items = [];
        this.comboProductId.enabled = false;
        if (this['onChanged']) this['onChanged']();
        await this.fetchCommunityProducts(this.config.creatorId, this.config.communityId, stallId);
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
                    placeholder="Community Id/Creator's npub or ENS name"
                    onChanged={this.handleCommunityUriChanged}
                ></i-input>
                <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" margin={{ bottom: 5 }} gap={5}>
                        <i-stack direction="horizontal" width="100%" alignItems="center" gap={2}>
                            <i-label caption="$stall"></i-label>
                            <i-label caption=" *" font={{ color: Theme.colors.error.main }}></i-label>
                        </i-stack>
                        <i-combo-box
                            id="comboStallId"
                            width="100%"
                            height={42}
                            icon={{ name: 'caret-down' }}
                            border={{ radius: '0.625rem' }}
                            onChanged={this.handleStallIdChanged}
                        ></i-combo-box>
                    </i-stack>
                </i-panel>
                <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" justifyContent="center" gap={5}>
                        <i-stack direction="horizontal" width="100%" alignItems="center" gap={2}>
                            <i-label caption="$product"></i-label>
                            <i-label caption=" *" font={{ color: Theme.colors.error.main }}></i-label>
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