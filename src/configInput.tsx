import {
    customElements,
    ControlElement,
    Styles,
    Module,
    Input,
    ComboBox,
    StackLayout,
} from '@ijstech/components';
import { ICommunityProductInfo } from '@scom/scom-social-sdk';
import { IProductConfig } from './interface';
import { fetchCommunityProducts, fetchCommunityStalls } from './utils';

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
    private pnlStall: StackLayout;
    private comboStallId: ComboBox;
    private edtStallId: Input;
    private comboProductId: ComboBox;
    private timeout: any;
    private config: IProductConfig;
    private products: ICommunityProductInfo[] = [];

    getData() {
        return {
            creatorId: this.config?.creatorId,
            communityId: this.config?.communityId,
            stallId: this.comboStallId?.selectedItem?.value || this.edtStallId?.value || "",
            productId: this.comboProductId?.selectedItem?.value || ""
        }
    }

    async setData(data: IProductConfig) {
        this.config = data;
        if (this.edtStallId) {
            if (data.creatorId && data.communityId) {
                this.pnlStall.visible = true;
                const stalls = await fetchCommunityStalls(data.creatorId, data.communityId);
                this.comboStallId.items = stalls.map(stall => ({
                    label: stall.name || stall.id,
                    value: stall.id
                }));
                if (data.stallId) this.comboStallId.selectedItem = this.comboStallId.items.find(item => item.value === data.stallId);
            } else {
                this.pnlStall.visible = false;
                this.edtStallId.value = data.stallId || "";
            }
            if (data.creatorId && data.communityId || data.stallId) {
                await this.fetchCommunityProducts(data.creatorId, data.communityId, data.stallId);
                this.comboProductId.selectedItem = this.comboProductId.items.find(product => product.value === data.productId);
            }
        }
    }

    private async fetchCommunityProducts(creatorId?: string, communityId?: string, stallId?: string) {
        this.products = await fetchCommunityProducts(creatorId, communityId, stallId);
        this.comboProductId.items = this.products.map(product => ({
            label: product.name || product.id,
            value: product.id
        }));
    }

    private async handleStallIdChanged() {
        this.edtStallId.value = '';
        this.comboProductId.clear();
        this.comboProductId.items = [];
        if (this['onChanged']) this['onChanged']();
        const stallId = this.comboStallId.selectedItem.value;
        await this.fetchCommunityProducts(this.config.creatorId, this.config.communityId, stallId);
    }

    private async handleStallInputChanged() {
        this.comboStallId.clear();
        this.comboProductId.clear();
        this.comboProductId.items = [];
        if (this['onChanged']) this['onChanged']();
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.fetchCommunityProducts(undefined, undefined, this.edtStallId.value), 500)
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
                <i-panel padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack id="pnlStall" direction="vertical" width="100%" margin={{ bottom: 5 }} gap={5} visible={false}>
                        <i-combo-box
                            id="comboStallId"
                            width="100%"
                            height={42}
                            icon={{ name: 'caret-down' }}
                            border={{ radius: '0.625rem' }}
                            onChanged={this.handleStallIdChanged}
                        ></i-combo-box>
                        <i-stack direction="horizontal" alignItems="center" gap="0.5rem">
                            <i-panel
                                width="100%"
                                margin={{ top: 'auto', bottom: 'auto' }}
                                border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }}
                            ></i-panel>
                            <i-label caption="$or" font={{ size: '0.75rem', color: Theme.text.secondary }} stack={{ shrink: '0' }}></i-label>
                            <i-panel
                                width="100%"
                                margin={{ top: 'auto', bottom: 'auto' }}
                                border={{ bottom: { width: 1, style: 'solid', color: Theme.divider } }}
                            ></i-panel>
                        </i-stack>
                    </i-stack>
                    <i-input
                        id="edtStallId"
                        width="100%"
                        height={42}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                        border={{ radius: '0.625rem' }}
                        placeholder="Community Stall Id"
                        onChanged={this.handleStallInputChanged}
                    ></i-input>
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