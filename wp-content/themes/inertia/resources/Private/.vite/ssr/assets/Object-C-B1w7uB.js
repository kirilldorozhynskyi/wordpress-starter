import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/Object.vue
var _sfc_main = {
	__name: "Object",
	__ssrInlineRender: true,
	props: { src: {
		type: String,
		required: true
	} },
	setup(__props) {
		const lazyLoad = (0, vue_exports.inject)("lazyLoad");
		(0, vue_exports.onMounted)(() => {
			lazyLoad?.update();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<object${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				lazy: "",
				type: "image/svg+xml",
				"data-src": __props.src
			}, _attrs))}></object>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Utils/Object.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
