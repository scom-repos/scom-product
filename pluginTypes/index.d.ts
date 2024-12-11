/// <reference path="@scom/scom-social-sdk/index.d.ts" />
/// <amd-module name="@scom/scom-product/index.css.ts" />
declare module "@scom/scom-product/index.css.ts" {
    export const imageStyle: string;
    export const cardStyle: string;
    export const numberInputStyle: string;
    export const imageListStyle: string;
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
    export function fetchCommunityStalls(creatorId: string, communityId: string): Promise<import("@scom/scom-social-sdk").ICommunityStallInfo[]>;
    export function fetchCommunityProducts(creatorId?: string, communityId?: string, stallId?: string): Promise<import("@scom/scom-social-sdk").ICommunityProductInfo[]>;
}
/// <amd-module name="@scom/scom-product/translations.json.ts" />
declare module "@scom/scom-product/translations.json.ts" {
    const _default: {
        en: {
            stock: string;
            community: string;
            product: string;
            stall: string;
            "community_id/creator's_npub_or_ens_name": string;
        };
        "zh-hant": {
            stock: string;
            community: string;
            product: string;
            stall: string;
            "community_id/creator's_npub_or_ens_name": string;
        };
        vi: {
            stock: string;
            community: string;
            product: string;
            stall: string;
            "community_id/creator's_npub_or_ens_name": string;
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
        private edtCommunityUri;
        private comboStallId;
        private comboProductId;
        private timeout;
        private config;
        getData(): {
            creatorId: string;
            communityId: string;
            stallId: string;
            productId: string;
        };
        setData(data: IProductConfig): Promise<void>;
        private fetchCommunityStalls;
        private fetchCommunityProducts;
        private handleCommunityUriChanged;
        private handleStallIdChanged;
        private handleProductIdChanged;
        init(): void;
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
    }
}
/// <amd-module name="@scom/scom-product/productDetail.tsx" />
declare module "@scom/scom-product/productDetail.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { ProductModel } from "@scom/scom-product/model.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-product--detail']: ControlElement;
            }
        }
    }
    export class ScomProductDetail extends Module {
        private lblName;
        private pnlImageListWrapper;
        private pnlImages;
        private imgProduct;
        private lblDescription;
        private pnlStock;
        private lblStock;
        private lblPrice;
        private edtQuantity;
        private iconMinus;
        private iconPlus;
        private btnAddToCart;
        private activeImage;
        private _model;
        onProductAdded: (stallId: string) => void;
        get model(): ProductModel;
        set model(value: ProductModel);
        private get quantity();
        private getStockQuantity;
        show(): void;
        clear(): void;
        private addImage;
        private selectImage;
        private updateQuantity;
        private increaseQuantity;
        private decreaseQuantity;
        private handleQuantityChanged;
        private handleAddToCart;
        init(): void;
        render(): any;
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
        private imgProduct;
        private lblName;
        private lblDescription;
        private lblPrice;
        private btnAddToCart;
        private model;
        private detailModule;
        onProductAdded: (stallId: string) => void;
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
        private handleProductClick;
        private handleAddToCart;
        init(): void;
        render(): any;
    }
}
