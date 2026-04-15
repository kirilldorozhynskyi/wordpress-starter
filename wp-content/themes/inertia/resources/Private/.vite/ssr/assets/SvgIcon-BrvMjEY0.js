import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { i as usePage } from "./dist-C9WztoGj.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/SvgIcon.vue?vue&type=script&setup=true&lang.ts
var SvgIcon_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "SvgIcon",
	__ssrInlineRender: true,
	props: {
		name: {},
		label: { default: null },
		decorative: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const page = usePage();
		const symbolId = (0, vue_exports.computed)(() => `icon-${props.name}`);
		const iconHref = (0, vue_exports.computed)(() => `${page.props.sprite ?? ""}#${symbolId.value}`);
		const iconClasses = (0, vue_exports.computed)(() => [symbolId.value, props.name]);
		const ariaLabel = (0, vue_exports.computed)(() => props.decorative ? void 0 : props.label ?? props.name);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<svg${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				class: ["sprite-icon", iconClasses.value],
				"aria-hidden": __props.decorative,
				"aria-label": ariaLabel.value,
				role: __props.decorative ? void 0 : "img",
				focusable: "false"
			}, _attrs))}><use${(0, server_renderer_exports.ssrRenderAttr)("xlink:href", iconHref.value)}></use></svg>`);
		};
	}
});
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/SvgIcon.vue
var _sfc_setup = SvgIcon_vue_vue_type_script_setup_true_lang_default.setup;
SvgIcon_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Utils/SvgIcon.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var SvgIcon_default = SvgIcon_vue_vue_type_script_setup_true_lang_default;
//#endregion
export { SvgIcon_default as default };
