import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/File.vue
var _sfc_main = {
	__name: "File",
	__ssrInlineRender: true,
	props: {
		modelValue: { required: true },
		field: { type: Object },
		error: { type: String }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const file = (0, vue_exports.ref)(null);
		(0, vue_exports.ref)(null);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: __props.field?.cssClass }, _attrs))}><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-invalid": __props.error }, "custom-file form-floating"])}"><input${(0, server_renderer_exports.ssrRenderAttr)("id", __props.field?.key)} type="file" class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-invalid": __props.error }, "form-control"])}"><label class="form-label"${(0, server_renderer_exports.ssrRenderAttr)("for", __props.field?.key)}>${__props.field.label ?? ""}</label><span class="invalid-feedback">${__props.error ?? ""}</span>`);
			if (file.value) _push(`<button class="btn-remove btn p-1 text-danger mt-2"></button>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/File.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
