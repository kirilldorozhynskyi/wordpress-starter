import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { a as router } from "./dist-C9WztoGj.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
import { t as ensurePrimeVue } from "./primevue-CXR9t6jb.js";
import { t as _sfc_main$2 } from "./PageHero-CUfsbFC9.js";
//#region wp-content/themes/inertia/resources/Private/js/Components/Acf/FlexibleContent.vue
var _sfc_main$1 = {
	__name: "FlexibleContent",
	__ssrInlineRender: true,
	props: {
		fields: {
			type: [Object, Boolean],
			required: true
		},
		offset: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const modules = /* @__PURE__ */ Object.assign({
			"/resources/Private/js/Components/Acf/Flex/Contact.vue": () => import("./Contact-1kGCzqVh.js"),
			"/resources/Private/js/Components/Acf/Flex/PageHero.vue": () => import("./PageHero-CMLd3upK.js")
		});
		const primeVueFlexComponents = /* @__PURE__ */ new Set([]);
		const eagerComponents = { PageHero: _sfc_main$2 };
		const asyncComponents = {};
		const resolveComponentName = (type) => type.split("_").map((word) => word[0].toUpperCase() + word.slice(1)).join("");
		const getAsyncComponent = (componentName) => {
			if (asyncComponents[componentName]) return asyncComponents[componentName];
			const moduleKey = Object.keys(modules).find((key) => key.endsWith(`/Flex/${componentName}.vue`));
			if (!moduleKey) return eagerComponents.Content;
			asyncComponents[componentName] = (0, vue_exports.defineAsyncComponent)(async () => {
				if (primeVueFlexComponents.has(componentName)) await ensurePrimeVue();
				const module = await modules[moduleKey]();
				return module.default ?? module;
			});
			return asyncComponents[componentName];
		};
		const getAcfComponent = (type) => {
			const componentName = resolveComponentName(type);
			return eagerComponents[componentName] || getAsyncComponent(componentName);
		};
		const getItemComponent = (item) => getAcfComponent(item.acf_fc_layout);
		router.on("navigate", () => {
			if (window.location.hash) {
				const id = window.location.hash.slice(1);
				(0, vue_exports.nextTick)(() => {
					const el = document.getElementById(id);
					if (el) el.scrollIntoView();
				});
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "flex flex-col" }, _attrs))}><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.fields, (item, index) => {
				(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(getItemComponent(item)), {
					ce: item,
					first: index == 0
				}, null), _parent);
			});
			_push(`<!--]--></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/Components/Acf/FlexibleContent.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/pages/Home.vue
var _sfc_main = {
	__name: "Home",
	__ssrInlineRender: true,
	props: { fields: {
		type: [Object, Boolean],
		required: false,
		default: () => ({})
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)}>`);
			if (__props.fields.flexible_content) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, { fields: __props.fields.flexible_content }, null, _parent));
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/pages/Home.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
