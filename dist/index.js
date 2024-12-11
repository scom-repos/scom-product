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
define("@scom/scom-product/utils.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchCommunityProducts = exports.fetchCommunityStalls = exports.getCommunityBasicInfoFromUri = void 0;
    function extractEnsName(name) {
        const result = {};
        const ensMap = components_2.application.store?.ensMap || {};
        const value = ensMap[name];
        if (!value)
            return result;
        const ids = value.split('/');
        const isCommunity = ids.length > 1;
        if (isCommunity) {
            result.communityId = ids[0];
            result.creatorId = ids[1];
        }
        return result;
    }
    function getCommunityBasicInfoFromUri(communityUri) {
        if (communityUri.includes('/')) {
            const parts = communityUri.split('/');
            return {
                creatorId: parts[1],
                communityId: parts[0]
            };
        }
        else {
            return extractEnsName(communityUri);
        }
    }
    exports.getCommunityBasicInfoFromUri = getCommunityBasicInfoFromUri;
    async function fetchCommunityStalls(creatorId, communityId) {
        const dataManager = components_2.application.store?.mainDataManager;
        const stalls = await dataManager.fetchCommunityStalls(creatorId, communityId);
        return stalls;
    }
    exports.fetchCommunityStalls = fetchCommunityStalls;
    async function fetchCommunityProducts(creatorId, communityId, stallId) {
        const dataManager = components_2.application.store?.mainDataManager;
        const products = await dataManager.fetchCommunityProducts(creatorId, communityId, stallId);
        return products;
    }
    exports.fetchCommunityProducts = fetchCommunityProducts;
});
define("@scom/scom-product/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-product/translations.json.ts'/> 
    exports.default = {
        "en": {
            "stock": "Stock",
            "community": "Community",
            "product": "Product",
            "stall": "Stall",
            "community_id/creator's_npub_or_ens_name": "Community Id/Creator's npub or ENS name",
        },
        "zh-hant": {
            "stock": "庫存",
            "community": "社群",
            "product": "產品",
            "stall": "攤位",
            "community_id/creator's_npub_or_ens_name": "社群 Id/創作者的 npub 或 ENS 名稱"
        },
        "vi": {
            "stock": "số lượng hàng tồn kho",
            "community": "Cộng đồng",
            "product": "Sản phẩm",
            "stall": "Gian hàng",
            "community_id/creator's_npub_or_ens_name": "ID cộng đồng/npub của người tạo hoặc tên ENS"
        }
    };
});
define("@scom/scom-product/configInput.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-product/utils.ts", "@scom/scom-product/translations.json.ts"], function (require, exports, components_3, utils_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomProductConfigInput = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    let ScomProductConfigInput = class ScomProductConfigInput extends components_3.Module {
        constructor() {
            super(...arguments);
            this.config = {};
        }
        getData() {
            const productId = this.comboProductId?.selectedItem?.value || "";
            if (!productId)
                return;
            return {
                creatorId: this.config?.creatorId,
                communityId: this.config?.communityId,
                stallId: this.comboStallId?.selectedItem?.value || "",
                productId: productId
            };
        }
        async setData(data) {
            this.config = data;
            if (this.edtCommunityUri) {
                if (data.creatorId && data.communityId) {
                    this.edtCommunityUri.value = `${data.communityId}/${data.creatorId}`;
                    await this.fetchCommunityStalls(data.creatorId, data.communityId);
                    if (data.stallId) {
                        this.comboStallId.selectedItem = this.comboStallId.items.find(item => item.value === data.stallId);
                        await this.fetchCommunityProducts(data.creatorId, data.communityId, data.stallId);
                        this.comboProductId.selectedItem = this.comboProductId.items.find(product => product.value === data.productId);
                    }
                    else {
                        this.comboStallId.clear();
                        this.comboProductId.clear();
                        this.comboProductId.items = [];
                    }
                }
                else {
                    this.edtCommunityUri.value = "";
                    this.comboStallId.clear();
                    this.comboStallId.items = [];
                    this.comboProductId.clear();
                    this.comboProductId.items = [];
                }
            }
        }
        async fetchCommunityStalls(creatorId, communityId) {
            const stalls = await (0, utils_1.fetchCommunityStalls)(creatorId, communityId);
            this.comboStallId.items = stalls.map(stall => ({
                label: stall.name || stall.id,
                value: stall.id
            }));
            this.comboStallId.enabled = true;
        }
        async fetchCommunityProducts(creatorId, communityId, stallId) {
            const products = await (0, utils_1.fetchCommunityProducts)(creatorId, communityId, stallId);
            this.comboProductId.items = products.map(product => ({
                label: product.name || product.id,
                value: product.id
            }));
            this.comboProductId.enabled = true;
        }
        async handleCommunityUriChanged() {
            this.comboStallId.clear();
            this.comboStallId.items = [];
            this.comboStallId.enabled = false;
            this.comboProductId.clear();
            this.comboProductId.items = [];
            this.comboProductId.enabled = false;
            if (this['onChanged'])
                this['onChanged']();
            if (this.timeout)
                clearTimeout(this.timeout);
            const communityUri = this.edtCommunityUri.value;
            if (!communityUri)
                return;
            const { creatorId, communityId } = (0, utils_1.getCommunityBasicInfoFromUri)(communityUri);
            this.config.creatorId = creatorId,
                this.config.communityId = communityId,
                this.timeout = setTimeout(() => this.fetchCommunityStalls(creatorId, communityId), 350);
        }
        async handleStallIdChanged() {
            const stallId = this.comboStallId.selectedItem.value;
            this.comboProductId.clear();
            this.comboProductId.items = [];
            this.comboProductId.enabled = false;
            if (this['onChanged'])
                this['onChanged']();
            await this.fetchCommunityProducts(this.config.creatorId, this.config.communityId, stallId);
        }
        handleProductIdChanged() {
            if (this['onChanged'])
                this['onChanged']();
        }
        init() {
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            this.fetchCommunityProducts = this.fetchCommunityProducts.bind(this);
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical" },
                this.$render("i-input", { id: "edtCommunityUri", width: "100%", height: 42, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, border: { radius: '0.625rem' }, placeholder: "$community_id/creator's_npub_or_ens_name", onChanged: this.handleCommunityUriChanged }),
                this.$render("i-panel", { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                    this.$render("i-stack", { direction: "vertical", width: "100%", margin: { bottom: 5 }, gap: 5 },
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                            this.$render("i-label", { caption: "$stall" }),
                            this.$render("i-label", { caption: " *", font: { color: Theme.colors.error.main } })),
                        this.$render("i-combo-box", { id: "comboStallId", width: "100%", height: 42, icon: { name: 'caret-down' }, border: { radius: '0.625rem' }, onChanged: this.handleStallIdChanged }))),
                this.$render("i-panel", { padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                    this.$render("i-stack", { direction: "vertical", width: "100%", justifyContent: "center", gap: 5 },
                        this.$render("i-stack", { direction: "horizontal", width: "100%", alignItems: "center", gap: 2 },
                            this.$render("i-label", { caption: "$product" }),
                            this.$render("i-label", { caption: " *", font: { color: Theme.colors.error.main } })),
                        this.$render("i-combo-box", { id: "comboProductId", width: "100%", height: 42, icon: { name: 'caret-down' }, border: { radius: '0.625rem' }, onChanged: this.handleProductIdChanged })))));
        }
    };
    ScomProductConfigInput = __decorate([
        (0, components_3.customElements)('i-scom-product--config-input')
    ], ScomProductConfigInput);
    exports.ScomProductConfigInput = ScomProductConfigInput;
});
define("@scom/scom-product/formSchema.ts", ["require", "exports", "@scom/scom-product/configInput.tsx"], function (require, exports, configInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                config: {
                    title: '$community',
                    type: "object",
                    required: true
                }
            }
        },
        uiSchema: {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/config"
                },
            ]
        },
        customControls() {
            return {
                "#/properties/config": {
                    render: () => {
                        const communityProductInput = new configInput_1.ScomProductConfigInput();
                        return communityProductInput;
                    },
                    getData: (control) => {
                        return control.getData();
                    },
                    setData: async (control, value, rowData) => {
                        await control.ready();
                        control.setData(rowData?.config);
                    }
                }
            };
        }
    };
});
define("@scom/scom-product/model.ts", ["require", "exports", "@scom/scom-product/formSchema.ts", "@scom/scom-product/utils.ts"], function (require, exports, formSchema_1, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProductModel = void 0;
    class ProductModel {
        constructor() {
            this._data = {};
        }
        addToCart(quantity, callback) {
            const logginedUserStr = localStorage.getItem('loggedInUser');
            if (!logginedUserStr)
                return;
            const logginedUser = JSON.parse(logginedUserStr);
            const { product, stall } = this.getData() || {};
            const key = `shoppingCart/${logginedUser.id}/${product.stallId}`;
            const productStr = localStorage.getItem(key);
            if (!productStr) {
                localStorage.setItem(key, JSON.stringify([{
                        ...product,
                        stallName: stall?.name || "",
                        quantity: quantity,
                        available: product.quantity
                    }]));
            }
            else {
                const products = JSON.parse(productStr) || [];
                const selectedProduct = products.find(p => p.id === product.id);
                if (selectedProduct) {
                    selectedProduct.quantity += quantity;
                }
                else {
                    products.push({
                        ...product,
                        stallName: stall?.name || "",
                        quantity: quantity,
                        available: product.quantity
                    });
                }
                localStorage.setItem(key, JSON.stringify(products));
            }
            if (callback)
                callback(product.stallId);
        }
        getConfigurators() {
            return [
                {
                    name: 'Editor',
                    target: 'Editor',
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
            const { config, product, stall } = this._data || {};
            if (config?.creatorId && config?.communityId) {
                if (!product) {
                    const products = await (0, utils_2.fetchCommunityProducts)(config.creatorId, config.communityId);
                    this._data.product = products?.find(product => product.id === config.productId);
                }
                if (!stall) {
                    const stalls = await (0, utils_2.fetchCommunityStalls)(config.creatorId, config.communityId);
                    this._data.stall = stalls?.find(stall => stall.id === this._data.product.stallId);
                }
            }
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
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {};
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify(this._data));
                                if (builder?.setData)
                                    builder.setData(userInputData);
                            },
                            undo: () => {
                                this._data = JSON.parse(JSON.stringify(oldData));
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema,
                    customControls: formSchema_1.default.customControls()
                }
            ];
            return actions;
        }
    }
    exports.ProductModel = ProductModel;
});
define("@scom/scom-product/productDetail.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-product/index.css.ts"], function (require, exports, components_4, index_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomProductDetail = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomProductDetail = class ScomProductDetail extends components_4.Module {
        get model() {
            return this._model;
        }
        set model(value) {
            this._model = value;
        }
        get quantity() {
            return Number(this.edtQuantity.value) || 1;
        }
        getStockQuantity() {
            const { product } = this.model.getData() || {};
            if (product?.quantity != null && product?.quantity.toString() != "" && product?.quantity >= 0) {
                return Number(product?.quantity);
            }
            return null;
        }
        show() {
            this.pnlImageListWrapper.visible = false;
            this.activeImage = undefined;
            this.pnlImages.clearInnerHTML();
            const { product } = this.model.getData() || {};
            this.lblName.caption = product?.name || "";
            this.imgProduct.url = product?.images?.[0] || "";
            if (product?.images?.length > 1) {
                for (let image of product?.images) {
                    const imageElm = this.addImage(image);
                    if (!this.activeImage)
                        this.selectImage(imageElm);
                }
                this.pnlImageListWrapper.visible = true;
            }
            this.lblDescription.caption = product?.description || "";
            const stockQuantity = this.getStockQuantity();
            this.lblStock.caption = stockQuantity ? ": " + stockQuantity : "";
            this.pnlStock.visible = stockQuantity > 1;
            this.lblPrice.caption = `${product?.price || ""} ${product?.currency || ""}`;
            this.edtQuantity.value = 1;
            this.iconMinus.enabled = false;
            this.iconPlus.enabled = stockQuantity == null || stockQuantity > 1;
            const logginedUserStr = localStorage.getItem('loggedInUser');
            this.btnAddToCart.enabled = !!logginedUserStr;
        }
        clear() {
            this.lblName.caption = "";
            this.pnlImageListWrapper.visible = false;
            this.activeImage = undefined;
            this.pnlImages.clearInnerHTML();
            this.imgProduct.url = "";
            this.lblDescription.caption = "";
            this.lblStock.caption = "";
            this.pnlStock.visible = false;
            this.lblPrice.caption = "";
            this.edtQuantity.value = 1;
            this.iconMinus.enabled = false;
            this.iconPlus.enabled = false;
            this.btnAddToCart.enabled = false;
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
            let quantity = Number.isInteger(this.quantity) ? this.quantity : Math.trunc(this.quantity);
            const stockQuantity = this.getStockQuantity();
            if (isIncremental) {
                if (stockQuantity == null || stockQuantity > quantity) {
                    this.edtQuantity.value = ++quantity;
                }
            }
            else {
                if (quantity > 1) {
                    this.edtQuantity.value = --quantity;
                }
            }
            this.iconMinus.enabled = quantity > 1;
            this.iconPlus.enabled = stockQuantity == null || stockQuantity > 1;
        }
        increaseQuantity() {
            this.updateQuantity(true);
        }
        decreaseQuantity() {
            this.updateQuantity(false);
        }
        handleQuantityChanged() {
            const stockQuantity = this.getStockQuantity();
            if (!Number.isInteger(this.quantity)) {
                this.edtQuantity.value = Math.trunc(this.quantity);
            }
            this.iconMinus.enabled = this.quantity > 1;
            this.iconPlus.enabled = stockQuantity == null || stockQuantity > 1;
        }
        async handleAddToCart() {
            this.btnAddToCart.rightIcon.spin = true;
            this.btnAddToCart.rightIcon.visible = true;
            this.btnAddToCart.caption = "";
            this.model.addToCart(this.quantity, async (stallId) => {
                await new Promise(resolve => setTimeout(resolve, 800));
                this.btnAddToCart.caption = "Add to Cart";
                this.btnAddToCart.rightIcon.spin = false;
                this.btnAddToCart.rightIcon.visible = false;
                if (this.onProductAdded)
                    this.onProductAdded(stallId);
            });
        }
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
                            this.$render("i-panel", { id: "pnlStock", visible: false },
                                this.$render("i-label", { display: "inline", caption: "$stock", font: { size: '1.5rem', color: Theme.text.secondary } }),
                                this.$render("i-label", { id: "lblStock", font: { size: '1.5rem', color: Theme.text.secondary } })),
                            this.$render("i-label", { id: "lblPrice", font: { size: '1.5rem', color: Theme.text.secondary } })),
                        this.$render("i-stack", { direction: "horizontal", justifyContent: "center", gap: "0.25rem" },
                            this.$render("i-icon", { id: "iconMinus", width: '1.875rem', height: '1.875rem', name: 'minus-circle', padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, border: { radius: '50%' }, stack: { shrink: '0' }, fill: Theme.text.primary, enabled: false, cursor: 'pointer', onClick: this.decreaseQuantity }),
                            this.$render("i-input", { id: "edtQuantity", class: index_css_1.numberInputStyle, width: 100, height: '2rem', inputType: "number", padding: { left: '0.5rem', right: '0.5rem' }, border: { radius: 5 }, onChanged: this.handleQuantityChanged }),
                            this.$render("i-icon", { id: "iconPlus", width: '1.875rem', height: '1.875rem', name: 'plus-circle', padding: { left: '0.1875rem', right: '0.1875rem', top: '0.1875rem', bottom: '0.1875rem' }, border: { radius: '50%' }, stack: { shrink: '0' }, fill: Theme.text.primary, enabled: false, cursor: 'pointer', onClick: this.increaseQuantity })),
                        this.$render("i-button", { id: "btnAddToCart", minHeight: 36, minWidth: 120, caption: "Add to Cart", border: { radius: 18 }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, enabled: false, onClick: this.handleAddToCart })))));
        }
    };
    ScomProductDetail = __decorate([
        (0, components_4.customElements)('i-scom-product--detail')
    ], ScomProductDetail);
    exports.ScomProductDetail = ScomProductDetail;
});
define("@scom/scom-product", ["require", "exports", "@ijstech/components", "@scom/scom-product/index.css.ts", "@scom/scom-product/model.ts", "@scom/scom-product/productDetail.tsx", "@scom/scom-product/translations.json.ts"], function (require, exports, components_5, index_css_2, model_1, productDetail_1, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomProduct = void 0;
    const Theme = components_5.Styles.Theme.ThemeVars;
    let ScomProduct = class ScomProduct extends components_5.Module {
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
            const { product } = this.getData() || {};
            this.imgProduct.url = product?.images?.[0] || "";
            this.lblName.caption = product?.name || "";
            this.lblDescription.caption = product?.description || "";
            this.lblDescription.visible = !!product?.description;
            this.lblPrice.caption = `${product?.price || ""} ${product?.currency || ""}`;
        }
        async handleProductClick() {
            if (!this.detailModule) {
                this.detailModule = new productDetail_1.ScomProductDetail();
                this.detailModule.model = this.model;
                this.detailModule.onProductAdded = (stallId) => {
                    this.detailModule.closeModal();
                    if (this.onProductAdded)
                        this.onProductAdded(stallId);
                };
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
        handleAddToCart() {
            this.btnAddToCart.rightIcon.spin = true;
            this.btnAddToCart.rightIcon.visible = true;
            this.btnAddToCart.caption = "";
            this.model.addToCart(1, async (stallId) => {
                await new Promise(resolve => setTimeout(resolve, 800));
                this.btnAddToCart.caption = "Add to Cart";
                this.btnAddToCart.rightIcon.spin = false;
                this.btnAddToCart.rightIcon.visible = false;
                if (this.onProductAdded)
                    this.onProductAdded(stallId);
            });
        }
        init() {
            this.i18n.init({ ...translations_json_2.default });
            super.init();
            this.model = new model_1.ProductModel();
            this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
            const config = this.getAttribute('config', true);
            const product = this.getAttribute('product', true);
            if (config) {
                this.setData({ config, product });
            }
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%" },
                this.$render("i-stack", { class: index_css_2.cardStyle, direction: "vertical", width: "100%", height: "100%", maxWidth: "24rem", background: { color: Theme.background.paper }, margin: { left: 'auto', right: 'auto' }, border: { radius: '0.75rem', width: '1px', style: 'solid', color: Theme.background.paper }, overflow: "hidden", cursor: 'pointer', onClick: this.handleProductClick },
                    this.$render("i-panel", null,
                        this.$render("i-stack", { direction: "horizontal", width: "100%", height: "100%", stack: { shrink: '0' }, overflow: "hidden" },
                            this.$render("i-panel", { width: "100%", height: 0, overflow: "hidden", padding: { bottom: "100%" }, background: { color: Theme.action.disabledBackground } },
                                this.$render("i-image", { id: "imgProduct", class: index_css_2.imageStyle, position: "absolute", display: "block", width: "100%", height: "100%", top: "100%", left: 0, objectFit: "cover" })))),
                    this.$render("i-stack", { direction: "vertical", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1.25rem', right: '1.25rem' }, gap: "0.5rem" },
                        this.$render("i-label", { id: "lblName", class: "text-center", font: { size: '1.25rem', weight: 500 }, wordBreak: "break-word", lineHeight: '1.5rem' }),
                        this.$render("i-label", { id: "lblDescription", width: "100%", class: "text-center", font: { size: '1rem' }, textOverflow: 'ellipsis', lineHeight: '1.25rem', visible: false }),
                        this.$render("i-label", { id: "lblPrice", font: { color: Theme.text.secondary, size: "0.875rem", weight: 600 }, lineHeight: "1.25rem" })),
                    this.$render("i-button", { id: "btnAddToCart", minHeight: 40, width: "100%", caption: "Add to Cart", margin: { top: 'auto' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleAddToCart }))));
        }
    };
    ScomProduct = __decorate([
        (0, components_5.customElements)('i-scom-product')
    ], ScomProduct);
    exports.ScomProduct = ScomProduct;
});
