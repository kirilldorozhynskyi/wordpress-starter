import { t as vue_exports } from "./vue-D80rEydT.js";
import { i as server_renderer_exports } from "../ssr.mjs";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/File.vue
var _sfc_main = {
	__name: "File",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ (0, vue_exports.mergeModels)({
		field: {
			type: Object,
			required: true
		},
		error: {
			type: [String, Boolean],
			default: ""
		}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const props = __props;
		const model = (0, vue_exports.useModel)(__props, "modelValue");
		const id = (0, vue_exports.useId)();
		const fileInput = (0, vue_exports.useTemplateRef)("fileInput");
		const accept = (0, vue_exports.computed)(() => (props.field.allowedExtensions || "").split(",").map((value) => value.trim()).filter(Boolean).map((value) => `.${value.replace(/^\./, "")}`).join(","));
		(0, vue_exports.watch)(model, (value) => {
			if (!value && fileInput.value) fileInput.value.value = "";
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field.cssClass, "flex min-w-0 flex-col gap-2"] }, _attrs))}><label${(0, server_renderer_exports.ssrRenderAttr)("for", (0, vue_exports.unref)(id))} class="text-pretty">${__props.field.label ?? ""}</label><input${(0, server_renderer_exports.ssrRenderAttr)("id", (0, vue_exports.unref)(id))}${(0, server_renderer_exports.ssrRenderAttr)("name", __props.field.key)} type="file"${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.field.isRequired) ? " required" : ""}${(0, server_renderer_exports.ssrRenderAttr)("accept", accept.value)}${(0, server_renderer_exports.ssrRenderAttr)("aria-invalid", !!__props.error)}${(0, server_renderer_exports.ssrRenderAttr)("aria-describedby", __props.error ? `${(0, vue_exports.unref)(id)}-error` : void 0)}>`);
			if (__props.error) _push(`<p${(0, server_renderer_exports.ssrRenderAttr)("id", `${(0, vue_exports.unref)(id)}-error`)} class="text-pretty">${(0, server_renderer_exports.ssrInterpolate)(__props.error)}</p>`);
			else _push(`<!---->`);
			if (model.value) _push(`<button type="button" class="self-start underline">${(0, server_renderer_exports.ssrInterpolate)(_ctx.$t("form.remove_file"))}</button>`);
			else _push(`<!---->`);
			_push(`</div>`);
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
