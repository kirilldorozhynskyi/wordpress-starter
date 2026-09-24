import { t as vue_exports } from "./vue-D80rEydT.js";
import { i as server_renderer_exports } from "../ssr.mjs";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Radio.vue
var _sfc_main = {
	__name: "Radio",
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
		const id = (0, vue_exports.useId)();
		const model = (0, vue_exports.useModel)(__props, "modelValue");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<fieldset${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field.cssClass, "flex min-w-0 flex-col gap-2"] }, _attrs))}><legend class="text-pretty">${__props.field.label ?? ""}</legend><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.field.choices, (option, index) => {
				_push(`<label${(0, server_renderer_exports.ssrRenderAttr)("for", `${(0, vue_exports.unref)(id)}-${index}`)} class="flex items-center gap-2 text-pretty"><input${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(model.value, option.value)) ? " checked" : ""}${(0, server_renderer_exports.ssrRenderAttr)("id", `${(0, vue_exports.unref)(id)}-${index}`)}${(0, server_renderer_exports.ssrRenderAttr)("name", (0, vue_exports.unref)(id))} type="radio"${(0, server_renderer_exports.ssrRenderAttr)("value", option.value)}${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.field.isRequired) ? " required" : ""}${(0, server_renderer_exports.ssrRenderAttr)("aria-invalid", !!__props.error)}${(0, server_renderer_exports.ssrRenderAttr)("aria-describedby", __props.error ? `${(0, vue_exports.unref)(id)}-error` : void 0)}><span>${(0, server_renderer_exports.ssrInterpolate)(option.text)}</span></label>`);
			});
			_push(`<!--]-->`);
			if (__props.error) _push(`<p${(0, server_renderer_exports.ssrRenderAttr)("id", `${(0, vue_exports.unref)(id)}-error`)} class="text-pretty">${(0, server_renderer_exports.ssrInterpolate)(__props.error)}</p>`);
			else _push(`<!---->`);
			_push(`</fieldset>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Radio.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
