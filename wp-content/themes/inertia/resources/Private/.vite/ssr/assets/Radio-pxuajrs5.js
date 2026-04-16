import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Radio.vue
var _sfc_main = {
	__name: "Radio",
	__ssrInlineRender: true,
	props: {
		modelValue: { required: true },
		field: {
			type: Object,
			required: true
		},
		error: { type: String }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const localValue = (0, vue_exports.computed)({
			get() {
				return props.modelValue;
			},
			set(value) {
				emit("update:modelValue", value);
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: __props.field?.cssClass }, _attrs))}><p class="lead mb-1 fw-medium">${__props.field?.label ?? ""}</p><div class="${(0, server_renderer_exports.ssrRenderClass)([{ "is-invalid": __props.error }, "d-flex flex-wrap gap-half"])}"><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.field?.choices, (option, index) => {
				_push(`<div><input${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, server_renderer_exports.ssrLooseEqual)(localValue.value, option.value)) ? " checked" : ""}${(0, server_renderer_exports.ssrIncludeBooleanAttr)(__props.field?.isRequired) ? " required" : ""} type="radio" class="btn-check"${(0, server_renderer_exports.ssrRenderAttr)("name", `radio-${__props.field?.id}`)}${(0, server_renderer_exports.ssrRenderAttr)("id", `input-${__props.field?.id}-${index}`)}${(0, server_renderer_exports.ssrRenderAttr)("value", option.value)}><label class="btn btn-outline-light-pink btn-radio"${(0, server_renderer_exports.ssrRenderAttr)("for", `input-${__props.field?.id}-${index}`)}>${option.text ?? ""}</label></div>`);
			});
			_push(`<!--]--></div><span class="invalid-feedback">${__props.error ?? ""}</span></div>`);
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
