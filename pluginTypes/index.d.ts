/// <amd-module name="@scom/scom-product/index.css.ts" />
declare module "@scom/scom-product/index.css.ts" {
    export const imageStyle: string;
    export const cardStyle: string;
}
/// <amd-module name="@scom/scom-product/interface.ts" />
declare module "@scom/scom-product/interface.ts" {
    export interface IShippingInfo {
        id: string;
        name?: string;
        cost: number;
        regions?: string[];
    }
    export interface IProductInfo {
        id: string;
        stallId: string;
        name: string;
        description?: string;
        images?: string[];
        currency: string;
        price: number;
        quantity: number;
        specs?: string[][];
        shipping?: IShippingInfo[];
        communityUri?: string;
        stallUri?: string;
    }
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
        init(): void;
        render(): any;
    }
}
