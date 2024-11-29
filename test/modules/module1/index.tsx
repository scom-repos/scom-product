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
                communityUri: 'Dummy/npub12t6avlcy0lxm69tar8fz5cqsu7f4axe7zmkp3wfak00v9gy0n4yq25yh2m',
                productId: "b7d71742-c8cc-e91f-8a96-dcf915121619"
            },
            // product: {
            //     id: IdUtils.generateUUID(),
            //     stallId: IdUtils.generateUUID(),
            //     name: "Dog Headwear - Christmas (Test)",
            //     description: "Complete your dog's outfit with this red and white striped santa hat",
            //     images: [
            //         'https://images.unsplash.com/photo-1608096275182-337284e623bd?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            //         'https://images.unsplash.com/photo-1608096275202-85fd2fc2e4d9?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            //         'https://images.unsplash.com/photo-1583513702439-2e611c58e93d?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            //         'https://images.unsplash.com/photo-1608096275263-1667980c4dc2?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            //         'https://images.unsplash.com/photo-1583513702411-9dade5d3cb12?q=80&w=2576&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            //     ],
            //     currency: "Sats",
            //     price: 23750,
            //     quantity: undefined,
            //     shipping: [
            //         {
            //             id: IdUtils.generateUUID(),
            //             name: 'US',
            //             cost: 2000,
            //             regions: ['US']
            //         }
            //     ]
            // }
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