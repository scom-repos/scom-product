/// <reference path="@scom/scom-social-sdk/index.d.ts" />
/// <amd-module name="@scom/scom-product/index.css.ts" />
declare module "@scom/scom-product/index.css.ts" {
    export const imageStyle: string;
    export const cardStyle: string;
    export const numberInputStyle: string;
    export const imageListStyle: string;
    export const markdownStyle: string;
}
/// <amd-module name="@scom/scom-product/interface.ts" />
declare module "@scom/scom-product/interface.ts" {
    import { ICommunityProductInfo, ICommunityStallInfo } from '@scom/scom-social-sdk';
    export interface IProductConfig {
        creatorId?: string;
        communityId?: string;
        stallId?: string;
        productId?: string;
    }
    export interface IProductInfo {
        config?: IProductConfig;
        product?: ICommunityProductInfo;
        stall?: ICommunityStallInfo;
    }
}
/// <amd-module name="@scom/scom-product/utils.ts" />
declare module "@scom/scom-product/utils.ts" {
    export function getCommunityBasicInfoFromUri(communityUri: string): {
        creatorId?: string;
        communityId?: string;
    };
    export function getLoggedInUserId(): any;
    export function getUserPubkey(): any;
    export function fetchCommunities(): Promise<import("@scom/scom-social-sdk").ICommunity[]>;
    export function fetchCommunityStalls(creatorId: string, communityId: string): Promise<import("@scom/scom-social-sdk").ICommunityStallInfo[]>;
    export function fetchCommunityProducts(creatorId?: string, communityId?: string, stallId?: string): Promise<import("@scom/scom-social-sdk").ICommunityProductInfo[]>;
    export function fetchBuyerOrders(pubkey: string): Promise<import("@scom/scom-social-sdk").IRetrievedBuyerOrder[]>;
    export function isPurchasedProduct(productId: string, stallId: string): Promise<boolean>;
}
/// <amd-module name="@scom/scom-product/translations.json.ts" />
declare module "@scom/scom-product/translations.json.ts" {
    const _default: {
        en: {
            stock: string;
            community: string;
            other_community: string;
            other: string;
            product: string;
            stall: string;
            "community_id/creator's_npub_or_ens_name": string;
            add_to_cart: string;
            buy_more: string;
            already_in_cart: string;
            purchased_message: string;
            view_post_purchase_content: string;
        };
        "zh-hant": {
            stock: string;
            community: string;
            other_community: string;
            other: string;
            product: string;
            stall: string;
            "community_id/creator's_npub_or_ens_name": string;
            add_to_cart: string;
            buy_more: string;
            already_in_cart: string;
            purchased_message: string;
            view_post_purchase_content: string;
        };
        vi: {
            stock: string;
            community: string;
            other_community: string;
            other: string;
            product: string;
            stall: string;
            "community_id/creator's_npub_or_ens_name": string;
            add_to_cart: string;
            buy_more: string;
            already_in_cart: string;
            purchased_message: string;
            view_post_purchase_content: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-product/configInput.tsx" />
declare module "@scom/scom-product/configInput.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { IProductConfig } from "@scom/scom-product/interface.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-product--config-input']: ControlElement;
            }
        }
    }
    export class ScomProductConfigInput extends Module {
        private comboCommunity;
        private pnlOtherCommunity;
        private edtCommunityUri;
        private comboStallId;
        private comboProductId;
        private timeout;
        private config;
        private communities;
        getData(): {
            creatorId: string;
            communityId: string;
            stallId: string;
            productId: string;
        };
        setData(data: IProductConfig): Promise<void>;
        getCommunityItems(): Promise<{
            label: string;
            value: string;
        }[]>;
        private fetchCommunityStalls;
        private fetchCommunityProducts;
        private clearStall;
        private clearProduct;
        private handleCommunityChanged;
        private handleCommunityUriChanged;
        private handleStallIdChanged;
        private handleProductIdChanged;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-product/formSchema.ts" />
declare module "@scom/scom-product/formSchema.ts" {
    import { ScomProductConfigInput } from "@scom/scom-product/configInput.tsx";
    const _default_1: {
        dataSchema: {
            type: string;
            properties: {
                config: {
                    title: string;
                    type: string;
                    required: boolean;
                };
            };
        };
        uiSchema: {
            type: string;
            elements: {
                type: string;
                scope: string;
            }[];
        };
        customControls(): {
            "#/properties/config": {
                render: () => ScomProductConfigInput;
                getData: (control: ScomProductConfigInput) => {
                    creatorId: string;
                    communityId: string;
                    stallId: string;
                    productId: string;
                };
                setData: (control: ScomProductConfigInput, value: string, rowData: any) => Promise<void>;
            };
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-product/model.ts" />
declare module "@scom/scom-product/model.ts" {
    import { IProductInfo } from "@scom/scom-product/interface.ts";
    export class ProductModel {
        private _data;
        private _tag;
        updateUIBySetData: () => Promise<void>;
        addToCart(quantity: number, callback?: (stallId: string) => void): void;
        getItemCountInCart(): any;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        setData(value: IProductInfo): Promise<void>;
        getData(): IProductInfo;
        getTag(): any;
        setTag(value: any): void;
        private getActions;
        get isLoggedIn(): boolean;
    }
}
/// <amd-module name="@scom/scom-product" />
declare module "@scom/scom-product" {
    import { ControlElement, Module } from '@ijstech/components';
    import { ICommunityProductInfo } from '@scom/scom-social-sdk';
    import { IProductConfig, IProductInfo } from "@scom/scom-product/interface.ts";
    interface ScomProductElement extends ControlElement {
        config?: IProductConfig;
        product?: ICommunityProductInfo;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-product']: ScomProductElement;
            }
        }
    }
    export class ScomProduct extends Module {
        private pnlProduct;
        private imgProduct;
        private lblName;
        private lblDescription;
        private lblPrice;
        private lblMessage;
        private btnAddToCart;
        private model;
        private _isPreview;
        private isPurchased;
        onProductAdded: (stallId: string) => void;
        get isPreview(): boolean;
        set isPreview(value: boolean);
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        setData(data: IProductInfo): Promise<void>;
        getData(): IProductInfo;
        getTag(): any;
        setTag(value: any): void;
        private updateUIBySetData;
        private updateCartButton;
        private handleProductClick;
        private handleButtonClick;
        init(): void;
        render(): any;
    }
}
