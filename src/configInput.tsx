import {
    customElements,
    ControlElement,
    Styles,
    Module,
    Input,
    ComboBox,
    Panel,
} from '@ijstech/components';
import { ICommunity, ICommunityProductInfo } from '@scom/scom-social-sdk';
import { IProductConfig } from './interface';
import { fetchCommunities, fetchCommunityProducts, fetchCommunityStalls, getCommunityBasicInfoFromUri, getLoggedInUserId } from './utils';
import translations from './translations.json';

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
    private comboCommunity: ComboBox;
    private pnlOtherCommunity: Panel;
    private edtCommunityUri: Input;
    private comboStallId: ComboBox;
    private comboProductId: ComboBox;
    private timeout: any;
    private config: IProductConfig = {};
    private communities: ICommunity[];

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
        this.comboCommunity.items = await this.getCommunityItems();
        if (this.edtCommunityUri) {
            if (data.creatorId && data.communityId) {
                const communityUri = `${data.communityId}/${data.creatorId}`;
                const options = this.comboCommunity.items;
                const selectedItem = options.find(opt => opt.value === communityUri);
                if (selectedItem) {
                    this.comboCommunity.selectedItem = selectedItem;
                    this.pnlOtherCommunity.visible = false;
                    this.edtCommunityUri.value = "";
                } else {
                    this.comboCommunity.selectedItem = options[options.length - 1];
                    this.pnlOtherCommunity.visible = true;
                    this.edtCommunityUri.value = communityUri;
                }
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

    async getCommunityItems() {
      const logginedUserId = getLoggedInUserId();
      const defaultItems = [
        {
          label: '$other',
          value: 'other'
        }
      ];
      if (!logginedUserId) {
        return defaultItems;
      }
      if (!this.communities?.length || this.communities[0].creatorId !== logginedUserId) {
        this.communities = await fetchCommunities();
      }
      const options = this.communities.map(c => ({
        label: c.communityId,
        value: `${c.communityId}/${c.creatorId}`
      }));
      return [...options, ...defaultItems];
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

    private clearStall() {
        this.comboStallId.clear();
        this.comboStallId.items = [];
        this.comboStallId.enabled = false;
    }

    private clearProduct() {
        this.comboProductId.clear();
        this.comboProductId.items = [];
        this.comboProductId.enabled = false;
    }

    private async handleCommunityChanged() {
        this.clearStall();
        this.clearProduct();
        if (this['onChanged']) this['onChanged']();
        if (this.timeout) clearTimeout(this.timeout);
        const communityUri = this.comboCommunity.selectedItem.value;
        if (communityUri === 'other') {
            this.pnlOtherCommunity.visible = true;
            this.edtCommunityUri.value = "";
            this.config.creatorId = this.config.communityId = "";
        } else {
            this.pnlOtherCommunity.visible = false;
            const { creatorId, communityId } = getCommunityBasicInfoFromUri(communityUri);
            this.config.creatorId = creatorId;
            this.config.communityId = communityId;
            this.timeout = setTimeout(() => this.fetchCommunityStalls(creatorId, communityId), 350);
        }
    }

    private async handleCommunityUriChanged() {
        this.clearStall();
        this.clearProduct();
        if (this['onChanged']) this['onChanged']();
        if (this.timeout) clearTimeout(this.timeout);
        const communityUri: string = this.edtCommunityUri.value;
        if (!communityUri) return;
        const { creatorId, communityId } = getCommunityBasicInfoFromUri(communityUri);
        if (!creatorId || !communityId) return;
        this.config.creatorId = creatorId;
        this.config.communityId = communityId;
        this.timeout = setTimeout(() => this.fetchCommunityStalls(creatorId, communityId), 350);
    }

    private async handleStallIdChanged() {
        const stallId = this.comboStallId.selectedItem.value;
        this.clearProduct();
        if (this['onChanged']) this['onChanged']();
        await this.fetchCommunityProducts(this.config.creatorId, this.config.communityId, stallId);
    }

    private handleProductIdChanged() {
        if (this['onChanged']) this['onChanged']();
    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
        this.fetchCommunityProducts = this.fetchCommunityProducts.bind(this);
        this.comboCommunity.items = await this.getCommunityItems();
    }

    render() {
        return (
            <i-stack direction="vertical">
                <i-combo-box
                    id="comboCommunity"
                    width="100%"
                    height={42}
                    icon={{ name: 'caret-down' }}
                    border={{ radius: '0.625rem' }}
                    margin={{ bottom: 5 }}
                    onChanged={this.handleCommunityChanged}
                ></i-combo-box>
                <i-panel id="pnlOtherCommunity" padding={{ top: 5, bottom: 5, left: 5, right: 5 }} visible={false}>
                    <i-stack direction="vertical" width="100%" margin={{ bottom: 5 }} gap={5}>
                        <i-label caption="$other_community"></i-label>
                        <i-input
                            id="edtCommunityUri"
                            width="100%"
                            height={42}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                            border={{ radius: '0.625rem' }}
                            placeholder="$community_id/creator's_npub_or_ens_name"
                            onChanged={this.handleCommunityUriChanged}
                        ></i-input>
                    </i-stack>
                </i-panel>
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