import { t as vue_exports } from "./vue-D80rEydT.js";
import { i as server_renderer_exports, s as usePage } from "../ssr.mjs";
//#region wp-content/themes/inertia/resources/Private/js/util/JDplugins.ts
var checkLink = (btn, siteUrl) => {
	const url = btn?.url?.trim();
	if (!url || btn?.target && btn.target !== "_self" || url.startsWith("#")) return false;
	if (/^(?:mailto|tel|sms|javascript|data):/i.test(url)) return false;
	if (!siteUrl) return !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url);
	try {
		const site = new URL(siteUrl);
		const link = new URL(url, site);
		return ["https:", "http:"].includes(link.protocol) && link.origin === site.origin && !link.hash;
	} catch {
		return false;
	}
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/Button.vue?vue&type=script&setup=true&lang.ts
var Button_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "Button",
	__ssrInlineRender: true,
	props: {
		btn: {},
		icon: { type: [String, Boolean] }
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const internal = (0, vue_exports.computed)(() => checkLink(props.btn, page.props.wp?.homeUrl));
		const tag = (0, vue_exports.computed)(() => internal.value ? (0, vue_exports.resolveComponent)("Link") : "a");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_SvgIcon = (0, vue_exports.resolveComponent)("SvgIcon");
			if (__props.btn) (0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(tag.value), (0, vue_exports.mergeProps)({
				href: __props.btn.url,
				target: __props.btn.target,
				"aria-label": __props.btn.title ?? __props.btn.name,
				prefetch: internal.value ? true : void 0,
				rel: __props.btn.target === "_blank" ? "noopener noreferrer" : void 0
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, () => {
						_push(`<span${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(__props.btn.title ?? __props.btn.name)}</span>`);
						if (__props.icon) _push((0, server_renderer_exports.ssrRenderComponent)(_component_SvgIcon, { name: __props.icon }, null, _parent, _scopeId));
						else _push(`<!---->`);
					}, _push, _parent, _scopeId);
					else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [(0, vue_exports.createVNode)("span", null, (0, vue_exports.toDisplayString)(__props.btn.title ?? __props.btn.name), 1), __props.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_SvgIcon, {
						key: 0,
						name: __props.icon
					}, null, 8, ["name"])) : (0, vue_exports.createCommentVNode)("", true)])];
				}),
				_: 3
			}), _parent);
			else _push(`<!---->`);
		};
	}
});
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/Button.vue
var _sfc_setup = Button_vue_vue_type_script_setup_true_lang_default.setup;
Button_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Utils/Button.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Button_default = Button_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { Button_default as default };
