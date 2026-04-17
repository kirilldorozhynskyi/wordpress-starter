import { t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-aKwAPbTZ.js";
//#region wp-content/themes/inertia/resources/Private/js/pages/Archive.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)}>Archive Page</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/pages/Archive.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Archive_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
//#endregion
export { Archive_default as default };
