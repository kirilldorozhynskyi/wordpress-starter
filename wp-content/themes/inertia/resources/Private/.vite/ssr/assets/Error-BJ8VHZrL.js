import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/pages/Error.vue
var _sfc_main = {
	__name: "Error",
	__ssrInlineRender: true,
	props: { error: {
		type: Number,
		default: 500
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)}>Error: ${(0, server_renderer_exports.ssrInterpolate)(__props.error)}</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/pages/Error.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
