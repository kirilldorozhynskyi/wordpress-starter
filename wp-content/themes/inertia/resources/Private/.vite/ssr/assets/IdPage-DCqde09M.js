import { t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/IdPage.vue
var _sfc_main = {
	__name: "IdPage",
	__ssrInlineRender: true,
	props: { ce: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			if (__props.ce?.add_to_submenu && __props.ce?.title_nav) _push(`<span${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				class: "absolute top-0 left-0",
				id: __props.ce.title_nav.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")
			}, _attrs))}></span>`);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Utils/IdPage.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
