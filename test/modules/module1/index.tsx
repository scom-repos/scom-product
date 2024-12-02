import { Module, customModule, Container, IdUtils, application } from '@ijstech/components';
import { ScomProduct } from '@scom/scom-product';
import ScomWidgetTest from '@scom/scom-widget-test';
import { SocialDataManager } from '@scom/scom-social-sdk';

interface IRelayInfo {
    url: string;
    isPrivate?: boolean;
    userProfileExists?: boolean;
}

interface IInitSocialDataManagerOptions {
    readRelay: string;
    version: 1 | 2;
    writeRelays?: IRelayInfo[];
    mqttBrokerUrl?: string;
    mqttClientOptions?: any;
    mqttSubscriptions?: string[]
}

@customModule
export default class Module1 extends Module {
    private scomProduct: ScomProduct;
    private widgetModule: ScomWidgetTest;
    private dataManager: SocialDataManager;

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    private async onShowConfig() {
        const editor = this.scomProduct.getConfigurators().find(v => v.target === 'Editor');
        const widgetData = await editor.getData();
        if (!this.widgetModule) {
            this.widgetModule = await ScomWidgetTest.create({
                widgetName: 'scom-product',
                onConfirm: (data: any, tag: any) => {
                    editor.setData(data);
                    editor.setTag(tag);
                    this.widgetModule.closeModal();
                }
            });
        }
        this.widgetModule.openModal({
            width: '90%',
            maxWidth: '90rem',
            minHeight: 400,
            padding: { top: 0, bottom: 0, left: 0, right: 0 },
            closeOnBackdropClick: true,
            closeIcon: null
        });
        this.widgetModule.show(widgetData);
    }

    async _initMainSocialDataManager(options: IInitSocialDataManagerOptions) {
        let { readRelay, version, writeRelays } = options;
        const nostrOptions = this.options.nostr;
        if (!writeRelays) writeRelays = nostrOptions.writeRelays;
        if (this.dataManager) {
            await this.dataManager.dispose();
        }
        this.dataManager = new SocialDataManager(
            {
                writeRelays: writeRelays?.map(v => v.url),
                readRelay,
                publicIndexingRelay: nostrOptions.publicIndexingRelay,
                apiBaseUrl: nostrOptions.apiUrl,
                ipLocationServiceBaseUrl: nostrOptions.ipLocationServiceBaseUrl,
                mqttBrokerUrl: options.mqttBrokerUrl,
                mqttClientOptions: options.mqttClientOptions,
                mqttSubscriptions: options.mqttSubscriptions,
                mqttMessageCallback: (topic: string, message: string) => { },
                version: version,
                enableLightningWallet: true
            }
        );
        application.store.mainDataManager = this.dataManager;
    }

    async initializeSocialDataManager() {
        const nostrOptions = this.options.nostr;
        let options: IInitSocialDataManagerOptions = {
            readRelay: nostrOptions.publicIndexingRelay,
            version: nostrOptions.version,
        }
        await this._initMainSocialDataManager(options);
    }

    async init() {
        super.init();
        await this.initializeSocialDataManager();
        this.scomProduct.setData({
            config: {
                creatorId: "npub12t6avlcy0lxm69tar8fz5cqsu7f4axe7zmkp3wfak00v9gy0n4yq25yh2m",
                communityId: "Dummy",
                stallId: "4ca45aec-1e0f-3fa5-a2ac-b4bc18f02704",
                productId: "b7d71742-c8cc-e91f-8a96-dcf915121619"
            }
        });
    }

    render() {
        return (
            <i-panel width="100%" height="100%">
                <i-vstack padding={{ top: '1rem', left: '1rem', right: '1rem' }} gap="1rem">
                    <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
                    <i-scom-product id="scomProduct" />
                </i-vstack>
            </i-panel>
        )
    }
}