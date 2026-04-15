import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Select.vue
var _sfc_main = {
	__name: "Select",
	__ssrInlineRender: true,
	props: {
		modelValue: { required: true },
		field: {
			type: Object,
			required: true
		},
		error: {
			type: [String, Boolean],
			default: false
		},
		requiredIndicator: {
			type: String,
			default: ""
		},
		full: {
			type: Boolean,
			default: false
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-DbWVQwe0.js"));
		const Select = (0, vue_exports.defineAsyncComponent)(() => import("./select-CSPVroOZ.js"));
		const id = (0, vue_exports.useId)();
		const props = __props;
		const emit = __emit;
		const model = (0, vue_exports.computed)({
			get: () => props.modelValue,
			set: (value) => emit("update:modelValue", value)
		});
		const inputId = (0, vue_exports.computed)(() => `${id}-${props.field?.key || "select"}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: ["mt-10 flex w-full flex-col gap-2", __props.field?.cssClass] }, _attrs))}><label class="text-xs leading-[1.4] tracking-[0.25px]"${(0, server_renderer_exports.ssrRenderAttr)("for", inputId.value)}>${`${__props.field.label}${__props.field?.isRequired && __props.requiredIndicator === "asterisk" ? "*" : ""}`}</label>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Select), {
				modelValue: model.value,
				"onUpdate:modelValue": ($event) => model.value = $event,
				options: __props.field.choices,
				optionValue: "value",
				optionLabel: "text",
				class: "w-full",
				required: __props.field?.isRequired,
				placeholder: __props.field?.placeholder,
				id: inputId.value,
				invalid: __props.error,
				inputId: inputId.value
			}, null, _parent));
			if (__props.error) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Message), {
				severity: "error",
				class: "h-inherit flex",
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Select.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
