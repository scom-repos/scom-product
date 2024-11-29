/// <amd-module name="@scom/scom-product/index.css.ts" />
declare module "@scom/scom-product/index.css.ts" {
    export const imageStyle: string;
    export const cardStyle: string;
    export const numberInputStyle: string;
    export const imageListStyle: string;
}
/// <amd-module name="@scom/scom-product/interface.ts" />
declare module "@scom/scom-product/interface.ts" {
    import { ICommunityProductInfo } from '@scom/scom-social-sdk';
    export interface IProductInfo {
        config?: {
            communityUri: string;
            productId: string;
        };
        product?: ICommunityProductInfo;
    }
}
/// <amd-module name="@scom/scom-product/utils.ts" />
declare module "@scom/scom-product/utils.ts" {
    export function getCommunityBasicInfoFromUri(communityUri: string): {
        creatorId: string;
        communityId: string;
    };
    export function fetchCommunityStalls(creatorId: string, communityId: string): Promise<any>;
    export function fetchCommunityProducts(creatorId: string, communityId: string): Promise<any>;
}
/// <amd-module name="@scom/scom-product/configInput.tsx" />
declare module "@scom/scom-product/configInput.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    interface IProductConfig {
        communityUri?: string;
        productId?: string;
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-product--config-input']: ControlElement;
            }
        }
    }
    export class ScomProductConfigInput extends Module {
        private edtCommunityUri;
        private comboProductId;
        private timeout;
        private products;
        getData(): {
            communityUri: any;
            productId: string;
        };
        setData(data: IProductConfig): Promise<void>;
        private fetchCommunityProducts;
        private handleCommunityUriChanged;
        private handleProductIdChanged;
        init(): void;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-product/formSchema.ts" />
declare module "@scom/scom-product/formSchema.ts" {
    import { ScomProductConfigInput } from "@scom/scom-product/configInput.tsx";
    const _default: {
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
                    communityUri: any;
                    productId: string;
                };
                setData: (control: ScomProductConfigInput, value: string, rowData: any) => Promise<void>;
            };
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-product/model.ts" />
declare module "@scom/scom-product/model.ts" {
    import { IProductInfo } from "@scom/scom-product/interface.ts";
    export class ProductModel {
        private _data;
        private _tag;
        updateUIBySetData: () => Promise<void>;
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
        private lblStock;
        private lblPrice;
        private edtQuantity;
        private iconMinus;
        private iconPlus;
        private btnAddToCart;
        private activeImage;
        private _model;
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
    import { IProductInfo } from "@scom/scom-product/interface.ts";
    interface ScomProductElement extends ControlElement {
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
        private lblPrice;
        private model;
        private detailModule;
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
        init(): void;
        render(): any;
    }
}
