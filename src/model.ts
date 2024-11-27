import { Module } from "@ijstech/components";
import { IProductInfo } from "./interface";

export class ProductModel {
    private _data: IProductInfo;
    private _tag: any;
    public updateUIBySetData: () => Promise<void>;

    getConfigurators() {
        return [
            {
                name: 'Builder Configurator',
                target: 'Builders',
                getActions: this.getActions.bind(this),
                getData: this.getData.bind(this),
                setData: this.setData.bind(this),
                getTag: this.getTag.bind(this),
                setTag: this.setTag.bind(this)
            }
        ]
    }

    async setData(value: IProductInfo) {
        this._data = value;
        if (this.updateUIBySetData) this.updateUIBySetData();
    }

    getData() {
        return this._data;
    }

    getTag() {
        return this._tag;
    }

    setTag(value: any) {
        this._tag = value;
    }

    private getActions() {
        const actions = [];
        return actions;
    }
}