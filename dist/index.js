var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-product/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.markdownStyle = exports.imageListStyle = exports.numberInputStyle = exports.cardStyle = exports.imageStyle = void 0;
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
    exports.markdownStyle = components_1.Styles.style({
        overflowWrap: 'break-word'
    });
});
define("@scom/scom-product/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-product/utils.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fetchCommunityProducts = exports.fetchCommunityStalls = exports.fetchCommunities = exports.getLoggedInUserId = exports.getCommunityBasicInfoFromUri = void 0;
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
    function getLoggedInUserId() {
        const logginedUserStr = localStorage.getItem('loggedInUser');
        if (!logginedUserStr)
            return;
        const logginedUser = JSON.parse(logginedUserStr);
        return logginedUser.id;
    }
    exports.getLoggedInUserId = getLoggedInUserId;
    async function fetchCommunities() {
        const logginedUserId = getLoggedInUserId();
        if (!logginedUserId)
            return [];
        try {
            const dataManager = components_2.application.store?.mainDataManager;
            const communities = await dataManager.fetchMyCommunities(logginedUserId);
            return communities;
        }
        catch {
            return [];
        }
    }
    exports.fetchCommunities = fetchCommunities;
    async function fetchCommunityStalls(creatorId, communityId) {
        try {
            const dataManager = components_2.application.store?.mainDataManager;
            const stalls = await dataManager.fetchCommunityStalls(creatorId, communityId);
            return stalls;
        }
        catch {
            return [];
        }
    }
    exports.fetchCommunityStalls = fetchCommunityStalls;
    async function fetchCommunityProducts(creatorId, communityId, stallId) {
        try {
            const dataManager = components_2.application.store?.mainDataManager;
            const products = await dataManager.fetchCommunityProducts({
                creatorId,
                communityId,
                stallId
            });
            return products;
        }
        catch {
            return [];
        }
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
            "other_community": "Other Community",
            "other": "Other",
            "product": "Product",
            "stall": "Stall",
            "community_id/creator's_npub_or_ens_name": "Community Id/Creator's npub or ENS name",
            "add_to_cart": "Add to Cart",
            "buy_more": "Buy More",
            "already_in_cart": "You already have {{quantity}} in your cart",
        },
        "zh-hant": {
            "stock": "庫存",
            "community": "社群",
            "other_community": "其他社群",
            "other": "其他",
            "product": "產品",
            "stall": "攤位",
            "community_id/creator's_npub_or_ens_name": "社群 Id/創作者的 npub 或 ENS 名稱",
            "add_to_cart": "加入購物車",
            "buy_more": "購買更多",
            "already_in_cart": "您的購物車中已有{{quantity}}件",
        },
        "vi": {
            "stock": "số lượng hàng tồn kho",
            "community": "Cộng đồng",
            "other_community": "Cộng đồng khác",
            "other": "người khác",
            "product": "Sản phẩm",
            "stall": "Gian hàng",
            "community_id/creator's_npub_or_ens_name": "ID cộng đồng/npub của người tạo hoặc tên ENS",
            "add_to_cart": "Thêm vào giỏ hàng",
            "buy_more": "Mua thêm",
            "already_in_cart": "Bạn đã có {{quantity}} cái trong giỏ hàng"
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
                    }
                    else {
                        this.comboCommunity.selectedItem = options[options.length - 1];
                        this.pnlOtherCommunity.visible = true;
                        this.edtCommunityUri.value = communityUri;
                    }
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
        async getCommunityItems() {
            const logginedUserId = (0, utils_1.getLoggedInUserId)();
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
                this.communities = await (0, utils_1.fetchCommunities)();
            }
            const options = this.communities.map(c => ({
                label: c.communityId,
                value: `${c.communityId}/${c.creatorId}`
            }));
            return [...options, ...defaultItems];
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
        clearStall() {
            this.comboStallId.clear();
            this.comboStallId.items = [];
            this.comboStallId.enabled = false;
        }
        clearProduct() {
            this.comboProductId.clear();
            this.comboProductId.items = [];
            this.comboProductId.enabled = false;
        }
        async handleCommunityChanged() {
            this.clearStall();
            this.clearProduct();
            if (this['onChanged'])
                this['onChanged']();
            if (this.timeout)
                clearTimeout(this.timeout);
            const communityUri = this.comboCommunity.selectedItem.value;
            if (communityUri === 'other') {
                this.pnlOtherCommunity.visible = true;
                this.edtCommunityUri.value = "";
                this.config.creatorId = this.config.communityId = "";
            }
            else {
                this.pnlOtherCommunity.visible = false;
                const { creatorId, communityId } = (0, utils_1.getCommunityBasicInfoFromUri)(communityUri);
                this.config.creatorId = creatorId;
                this.config.communityId = communityId;
                this.timeout = setTimeout(() => this.fetchCommunityStalls(creatorId, communityId), 350);
            }
        }
        async handleCommunityUriChanged() {
            this.clearStall();
            this.clearProduct();
            if (this['onChanged'])
                this['onChanged']();
            if (this.timeout)
                clearTimeout(this.timeout);
            const communityUri = this.edtCommunityUri.value;
            if (!communityUri)
                return;
            const { creatorId, communityId } = (0, utils_1.getCommunityBasicInfoFromUri)(communityUri);
            if (!creatorId || !communityId)
                return;
            this.config.creatorId = creatorId;
            this.config.communityId = communityId;
            this.timeout = setTimeout(() => this.fetchCommunityStalls(creatorId, communityId), 350);
        }
        async handleStallIdChanged() {
            const stallId = this.comboStallId.selectedItem.value;
            this.clearProduct();
            if (this['onChanged'])
                this['onChanged']();
            await this.fetchCommunityProducts(this.config.creatorId, this.config.communityId, stallId);
        }
        handleProductIdChanged() {
            if (this['onChanged'])
                this['onChanged']();
        }
        async init() {
            this.i18n.init({ ...translations_json_1.default });
            super.init();
            this.fetchCommunityProducts = this.fetchCommunityProducts.bind(this);
            this.comboCommunity.items = await this.getCommunityItems();
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical" },
                this.$render("i-combo-box", { id: "comboCommunity", width: "100%", height: 42, icon: { name: 'caret-down' }, border: { radius: '0.625rem' }, margin: { bottom: 5 }, onChanged: this.handleCommunityChanged }),
                this.$render("i-panel", { id: "pnlOtherCommunity", padding: { top: 5, bottom: 5, left: 5, right: 5 }, visible: false },
                    this.$render("i-stack", { direction: "vertical", width: "100%", margin: { bottom: 5 }, gap: 5 },
                        this.$render("i-label", { caption: "$other_community" }),
                        this.$render("i-input", { id: "edtCommunityUri", width: "100%", height: 42, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, border: { radius: '0.625rem' }, placeholder: "$community_id/creator's_npub_or_ens_name", onChanged: this.handleCommunityUriChanged }))),
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
            const logginedUserId = (0, utils_2.getLoggedInUserId)();
            const { product, stall } = this.getData() || {};
            if (!logginedUserId || !product)
                return;
            const key = `shoppingCart/${logginedUserId}/${product.stallId}`;
            const productStr = localStorage.getItem(key);
            if (!productStr) {
                localStorage.setItem(key, JSON.stringify([{
                        id: product.id,
                        quantity: quantity,
                        stallId: product.stallId,
                        communityUri: product.communityUri
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
                        id: product.id,
                        quantity: quantity,
                        stallId: product.stallId,
                        communityUri: product.communityUri
                    });
                }
                localStorage.setItem(key, JSON.stringify(products));
            }
            if (callback)
                callback(product.stallId);
        }
        getItemCountInCart() {
            const logginedUserId = (0, utils_2.getLoggedInUserId)();
            const { product, stall } = this.getData() || {};
            if (!logginedUserId || !product)
                return;
            const key = `shoppingCart/${logginedUserId}/${product.stallId}`;
            const productStr = localStorage.getItem(key);
            if (productStr) {
                const products = JSON.parse(productStr) || [];
                const selectedProduct = products.find(p => p.id === product.id);
                return selectedProduct?.quantity || 0;
            }
            return 0;
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
                    this._data.stall = stalls?.find(stall => stall.id === this._data.product?.stallId);
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
        get isLoggedIn() {
            const loggedInUserStr = localStorage.getItem('loggedInUser');
            return !!loggedInUserStr;
        }
    }
    exports.ProductModel = ProductModel;
});
define("@scom/scom-product", ["require", "exports", "@ijstech/components", "@scom/scom-product/index.css.ts", "@scom/scom-product/model.ts", "@scom/scom-product/translations.json.ts"], function (require, exports, components_4, index_css_1, model_1, translations_json_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomProduct = void 0;
    const Theme = components_4.Styles.Theme.ThemeVars;
    let ScomProduct = class ScomProduct extends components_4.Module {
        constructor() {
            super(...arguments);
            this._isPreview = false;
        }
        get isPreview() {
            return this._isPreview;
        }
        set isPreview(value) {
            this._isPreview = value;
            if (this.pnlProduct)
                this.pnlProduct.cursor = value || !this.model.isLoggedIn ? "default" : "pointer";
            if (this.btnAddToCart)
                this.btnAddToCart.enabled = !value && this.model.isLoggedIn;
        }
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
            if (product?.description) {
                this.lblDescription.caption = await (0, components_4.markdownToPlainText)(product.description);
            }
            else {
                this.lblDescription.caption = "";
            }
            this.lblDescription.visible = !!product?.description;
            this.lblPrice.caption = `${product?.price || ""} ${product?.currency || ""}`;
            this.btnAddToCart.visible = !!product;
            this.updateCartButton();
        }
        updateCartButton() {
            const itemCount = this.model.getItemCountInCart();
            this.lblAlreadyInCart.visible = itemCount > 0;
            this.lblAlreadyInCart.caption = this.i18n.get('$already_in_cart', { quantity: itemCount });
            this.btnAddToCart.caption = this.i18n.get(itemCount > 0 ? "$buy_more" : "$add_to_cart");
        }
        async handleProductClick() {
            const { product } = this.getData() || {};
            if (this.isPreview || !product)
                return;
            window.location.assign(`#!/product-detail/${product.stallId}/${product.id}`);
        }
        handleAddToCart() {
            if (this.isPreview)
                return;
            this.btnAddToCart.rightIcon.spin = true;
            this.btnAddToCart.rightIcon.visible = true;
            this.btnAddToCart.caption = "";
            this.model.addToCart(1, async (stallId) => {
                await new Promise(resolve => setTimeout(resolve, 800));
                this.btnAddToCart.rightIcon.spin = false;
                this.btnAddToCart.rightIcon.visible = false;
                this.updateCartButton();
                if (this.onProductAdded)
                    this.onProductAdded(stallId);
            });
        }
        init() {
            this.i18n.init({ ...translations_json_2.default });
            super.init();
            this.model = new model_1.ProductModel();
            this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
            this.btnAddToCart.enabled = this.model.isLoggedIn;
            this.pnlProduct.cursor = this.model.isLoggedIn ? 'pointer' : 'default';
            const isPreview = this.getAttribute('isPreview', true);
            if (isPreview != null)
                this.isPreview = isPreview;
            const config = this.getAttribute('config', true);
            const product = this.getAttribute('product', true);
            if (config) {
                this.setData({ config, product });
            }
        }
        render() {
            return (this.$render("i-panel", { width: "100%", height: "100%" },
                this.$render("i-stack", { id: "pnlProduct", class: index_css_1.cardStyle, direction: "vertical", width: "100%", height: "100%", maxWidth: "24rem", background: { color: Theme.background.paper }, margin: { left: 'auto', right: 'auto' }, border: { radius: '0.75rem', width: '1px', style: 'solid', color: Theme.background.paper }, overflow: "hidden", cursor: 'pointer', onClick: this.handleProductClick },
                    this.$render("i-panel", null,
                        this.$render("i-stack", { direction: "horizontal", width: "100%", height: "100%", stack: { shrink: '0' }, overflow: "hidden" },
                            this.$render("i-panel", { width: "100%", height: 0, overflow: "hidden", padding: { bottom: "100%" }, background: { color: Theme.action.disabledBackground } },
                                this.$render("i-image", { id: "imgProduct", class: index_css_1.imageStyle, position: "absolute", display: "block", width: "100%", height: "100%", top: "100%", left: 0, objectFit: "cover" })))),
                    this.$render("i-stack", { direction: "vertical", alignItems: "center", padding: { top: '1rem', bottom: '1rem', left: '1.25rem', right: '1.25rem' }, gap: "0.5rem" },
                        this.$render("i-label", { id: "lblName", class: "text-center", font: { size: '1.25rem', weight: 500 }, wordBreak: "break-word", lineHeight: '1.5rem' }),
                        this.$render("i-label", { id: "lblDescription", width: "100%", class: "text-center", font: { size: '1rem' }, lineClamp: 2, lineHeight: '1.25rem', visible: false }),
                        this.$render("i-label", { id: "lblPrice", font: { color: Theme.text.secondary, size: "0.875rem", weight: 600 }, lineHeight: "1.25rem" }),
                        this.$render("i-label", { id: "lblAlreadyInCart", class: "text-center", font: { color: Theme.colors.success.main, size: '0.9375rem' }, visible: false })),
                    this.$render("i-button", { id: "btnAddToCart", minHeight: 40, width: "100%", caption: "$add_to_cart", margin: { top: 'auto' }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, font: { color: Theme.colors.primary.contrastText, bold: true }, onClick: this.handleAddToCart, visible: false }))));
        }
    };
    ScomProduct = __decorate([
        (0, components_4.customElements)('i-scom-product')
    ], ScomProduct);
    exports.ScomProduct = ScomProduct;
});
