import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Textarea.vue
var _sfc_main = {
	__name: "Textarea",
	__ssrInlineRender: true,
	props: {
		modelValue: { required: true },
		field: { type: Object },
		error: {
			type: [String, Boolean],
			default: false
		},
		requiredIndicator: { type: String }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const Textarea = (0, vue_exports.defineAsyncComponent)(() => import("./textarea-jW2T_907.js"));
		(0, vue_exports.defineAsyncComponent)(() => import("./floatlabel-_S0BAsYb.js"));
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-DbWVQwe0.js"));
		const id = (0, vue_exports.useId)();
		const props = __props;
		const emit = __emit;
		const model = (0, vue_exports.computed)({
			get: () => props.modelValue,
			set: (value) => emit("update:modelValue", value)
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field?.cssClass, "mt-8 flex w-full"] }, _attrs))}>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Textarea), {
				class: "w-full",
				id: (0, vue_exports.unref)(id) + __props.field?.key,
				type: __props.field?.type,
				modelValue: model.value,
				"onUpdate:modelValue": ($event) => model.value = $event,
				autocomplete: __props.field?.autocompleteAttribute,
				invalid: __props.error,
				required: __props.field?.isRequired,
				placeholder: __props.field.label
			}, null, _parent));
			if (__props.error) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Message), {
				severity: "error",
				size: "small",
				variant: "simple"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(__props.error)}`);
					else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(__props.error), 1)];
				}),
				_: 1
			}, _parent));
			else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Textarea.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
