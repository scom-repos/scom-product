var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-product/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.imageListStyle = exports.numberInputStyle = exports.cardStyle = exports.imageStyle = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    exports.imageStyle = components_1.Styles.style({
        transform: 'translateY(-100%)',
        $nest: {
            '&>img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
            }
        }
    });
    exports.cardStyle = components_1.Styles.style({
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        $nest: {
            '&:hover': {
                border: `1px solid ${Theme.divider} !important`
            }
        }
    });
    exports.numberInputStyle = components_1.Styles.style({
        $nest: {
            'input': {
                textAlign: 'center'
            }
        }
    });
    exports.imageListStyle = components_1.Styles.style({
        $nest: {
            'i-image.active img': {
                borderColor: Theme.colors.error.main
            }
        }
    });
});
define("@scom/scom-product/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-product/model.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductModel = void 0;
    class ProductModel {
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
            ];
        }
        async setData(value) {
            this._data = value;
            if (this.updateUIBySetData)
                this.updateUIBySetData();
        }
        getData() {
            return this._data;
        }
        getTag() {
            return this._tag;
        }
        setTag(value) {
            this._tag = value;
        }
        getActions() {
            const actions = [];
            return actions;
        }
    }
    exports.ProductModel = ProductModel;
});
define("@scom/scom-product/productDetail.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-product/index.css.ts"], function (require, exports, components_2, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomProductDetail = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    let ScomProductDetail = class ScomProductDetail extends components_2.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        get quantity() {
            return Number(this.edtQuantity.value) || 1;
        }
        show() {
            this.pnlImageListWrapper.visible = false;
            this.activeImage = undefined;
            this.pnlImages.clearInnerHTML();
            const { name, description, images, quantity, price, currency } = this.model.getData() || {};
            this.lblName.caption = name || "";
            this.imgProduct.url = images?.[0] || "";
            if (images?.length > 1) {
                for (let image of images) {
                    const imageElm = this.addImage(image);
                    if (!this.activeImage)
                        this.selectImage(imageElm);
                }
                this.pnlImageListWrapper.visible = true;
            }
            this.lblDescription.caption = description || "";
            this.lblStock.caption = quantity != null ? "Stock: " + quantity : "";
            this.lblStock.visible = quantity != null;
            this.lblPrice.caption = `${price || ""} ${currency || ""}`;
            this.edtQuantity.value = 1;
            this.iconMinus.enabled = false;
            this.iconPlus.enabled = quantity == null || quantity > 1;
        }
        clear() {
            this.lblName.caption = "";
            this.pnlImageListWrapper.visible = false;
            this.activeImage = undefined;
            this.pnlImages.clearInnerHTML();
            this.imgProduct.url = "";
            this.lblDescription.caption = "";
            this.lblStock.caption = "";
            this.lblPrice.caption = "";
            this.edtQuantity.value = 1;
            this.iconMinus.enabled = false;
            this.iconPlus.enabled = false;
        }
        addImage(image) {
            const imageElm = (this.$render("i-image", { display: "block", width: "100%", height: "auto", border: { radius: '0.75rem', width: 2, style: 'solid', color: 'transparent' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, url: image, cursor: "pointer", mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            stack: { grow: '1', shrink: '0', basis: '25%' }
                        }
                    }
                ], onClick: this.selectImage.bind(this) }));
            this.pnlImages.appendChild(imageElm);
            return imageElm;
        }
        selectImage(target) {
            if (this.activeImage) {
                this.activeImage.classList.remove('active');
            }
            this.activeImage = target;
            this.activeImage.classList.add('active');
            this.imgProduct.url = target.url;
        }
        updateQuantity(isIncremental) {
            const productInfo = this.model.getData();
            let quantity = Number.isInteger(this.quantity) ? this.quantity : Math.trunc(this.quantity);
            if (isIncremental) {
                if (productInfo.quantity == null || productInfo.quantity > quantity) {
                    this.edtQuantity.value = ++quantity;
                }
            }
            else {
                if (quantity > 1) {
                    this.edtQuantity.value = --quantity;
                }
            }
            this.iconMinus.enabled = quantity > 1;
            this.iconPlus.enabled = productInfo.quantity == null || productInfo.quantity > 1;
        }
        increaseQuantity() {
            this.updateQuantity(true);
        }
        decreaseQuantity() {
            this.updateQuantity(false);
        }
        handleQuantityChanged() {
            const productInfo = this.model.getData();
            if (!Number.isInteger(this.quantity)) {
                this.edtQuantity.value = Math.trunc(this.quantity);
            }
            this.iconMinus.enabled = this.quantity > 1;
            this.iconPlus.enabled = productInfo.quantity == null || productInfo.quantity > 1;
        }
        handleAddToCart() { }
        init() {
            super.init();
            this.updateQuantity = this.updateQuantity.bind(this);
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical", padding: { left: '1rem', right: '1rem', bottom: '2rem' }, lineHeight: 1.5 },
                this.$render("i-label", { id: "lblName", class: "text-center", font: { size: '1.875rem', weight: 700 }, padding: { top: '1rem', bottom: '2rem' } }),
                this.$render("i-stack", { direction: "horizontal", width: "100%", gap: "1rem", mediaQueries: [
                        {
                            maxWidth: '767px',
                            properties: {
                                direction: "vertical",
                            }
                        }
                    ] },
                    this.$render("i-stack", { direction: "horizontal", width: "100%", maxWidth: "50%", stack: { grow: '1' }, padding: { right: '1rem' }, border: { right: { width: 1, style: 'solid', color: Theme.divider } }, mediaQueries: [
                            {
                                maxWidth: '767px',
                                properties: {
                                    maxWidth: '100%',
                                    direction: "vertical",
                                    reverse: true,
                                    padding: { bottom: '1rem' },
                                    border: { width: '0 0 1px 0', style: 'solid', color: Theme.divider }
                                }
                            }
                        ] },
                        this.$render("i-stack", { id: "pnlImageListWrapper", width: "35%", direction: "horizontal", justifyContent: "center", stack: { shrink: '0' }, visible: false, mediaQueries: [
                                {
                                    maxWidth: '767px',
                                    properties: {
                                        width: '100%',
                                    }
                                }
                            ] },
                            this.$render("i-stack", { id: "pnlImages", class: index_css_1.imageListStyle, direction: "vertical", width: "10%", minWidth: 86, margin: { top: '-0.5rem' }, alignItems: "center", mediaQueries: [
                                    {
                                        maxWidth: '767px',
                                        properties: {
                                            direction: "horizontal",
                                            width: '100%',
                                            minWidth: 'unset',
                                            margin: {},
                                            padding: { top: '0.5rem' },
                                            overflow: { x: 'auto' }
                                        }
                                    }
                                ] })),
                        this.$render("i-image", { id: "imgProduct", display: "block", width: "100%", height: "auto", border: { radius: '0.75rem' }, overflow: "hidden" })),
                    this.$render("i-stack", { direction: "vertical", width: "100%", alignItems: "center", gap: "2rem" },
                        this.$render("i-label", { id: "lblDescription", class: "text-center", font: { size: '1.125rem' } }),
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "center", gap: "2rem" },
                            this.$render("i-label", { id: "lblStock", font: { size: '1.5rem', color: Theme.text.secondary } }),
                            this.$render("i-label", { id: "lblPrice", font: { size: '1.5rem', color: Theme.text.secondary } })),
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "center", gap: "0.25rem" },
                            this.$render("i-icon", { id: "iconMinus", width: '1.875rem', height: '1.875rem', name: 'minus-circle', padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, border: { radius: '50%' }, stack: { shrink: '0' }, fill: Theme.text.primary, enabled: false, cursor: 'pointer', onClick: this.decreaseQuantity }),
                            this.$render("i-input", { id: "edtQuantity", class: index_css_1.numberInputStyle, width: 100, height: '2rem', inputType: "number", padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, onChanged: this.handleQuantityChanged }),
                            this.$render("i-icon", { id: "iconPlus", width: '1.875rem', height: '1.875rem', name: 'plus-circle', padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, border: { radius: '50%' }, stack: { shrink: '0' }, fill: Theme.text.primary, enabled: false, cursor: 'pointer', onClick: this.increaseQuantity })),
                        this.$render("i-button", { id: "btnAddToCart", minHeight: 36, minWidth: 120, caption: "Add to Cart", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleAddToCart })))));
        }
    };
    ScomProductDetail = __decorate([
        (0, components_2.customElements)('i-scom-product--detail')
    ], ScomProductDetail);
    exports.ScomProductDetail = ScomProductDetail;
});
define("@scom/scom-product", ["require", "exports", "@ijstech/components", "@scom/scom-product/index.css.ts", "@scom/scom-product/model.ts", "@scom/scom-product/productDetail.tsx"], function (require, exports, components_3, index_css_2, model_1, productDetail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomProduct = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomProduct = class ScomProduct extends components_3.Module {
        getConfigurators() {
            return this.model.getConfigurators();
        }
        async setData(data) {
            await this.model.setData(data);
        }
        getData() {
            return this.model.getData();
        }
        getTag() {
            return this.tag;
        }
        setTag(value) {
            this.model.setTag(value);
        }
        async updateUIBySetData() {
            const { images, name, price, currency } = this.getData() || {};
            this.imgProduct.url = images?.[0] || "";
            this.lblName.caption = name || "";
            this.lblPrice.caption = `${price || ""} ${currency || ""}`;
        }
        async handleProductClick() {
            if (!this.detailModule) {
                this.detailModule = new productDetail_1.ScomProductDetail();
                this.detailModule.model = this.model;
            }
            const modal = this.detailModule.openModal({
                width: "90vw",
                height: "90vh",
                overflow: { y: 'auto' },
                popupPlacement: 'center',
                mediaQueries: [
                    {
                        maxWidth: '767px',
                        properties: {
                            width: "100vw",
                            height: '100vh',
                            maxHeight: '100vh'
                        }
                    }
                ]
            });
            await this.detailModule.ready();
            this.detailModule.show();
            modal.refresh();
        }
        init() {
            super.init();
            this.model = new model_1.ProductModel();
            this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%" },
                this.$render("i-stack", { class: index_css_2.cardStyle, direction: "vertical", width: "24rem", background: { color: Theme.background.paper }, margin: { left: 'auto', right: 'auto' }, border: { radius: '0.75rem', width: '1px', style: 'solid', color: Theme.background.paper }, overflow: "hidden", cursor: 'pointer', onClick: this.handleProductClick },
                    this.$render("i-stack", { direction: "horizontal", width: "100%", height: "100%", stack: { shrink: '0' }, overflow: "hidden" },
                        this.$render("i-panel", { width: "100%", height: 0, overflow: "hidden", padding: { bottom: "100%" }, background: { color: Theme.action.disabledBackground } },
                            this.$render("i-image", { id: "imgProduct", class: index_css_2.imageStyle, position: "absolute", display: "block", width: "100%", height: "100%", top: "100%", left: 0, objectFit: "cover" }))),
                    this.$render("i-stack", { direction: "vertical", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1.25rem', right: '1.25rem' }, gap: "0.5rem" },
                        this.$render("i-label", { id: "lblName", class: "text-center", font: { size: '1.25rem', weight: 500 }, wordBreak: "break-word", lineHeight: '1.5rem' }),
                        this.$render("i-label", { id: "lblPrice", font: { color: Theme.text.secondary, size: "0.875rem" }, lineHeight: "1.25rem" })))));
        }
    };
    ScomProduct = __decorate([
        (0, components_3.customElements)('i-scom-product')
    ], ScomProduct);
    exports.ScomProduct = ScomProduct;
});
