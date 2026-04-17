import { t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Html.vue
var _sfc_main = {
	__name: "Html",
	__ssrInlineRender: true,
	props: { field: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: ["mt-2 text-xs italic!", __props.field?.cssClass] }, _attrs))}>${__props.field?.content ?? ""}</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Html.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
