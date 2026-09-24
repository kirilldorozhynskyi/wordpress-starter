import { t as vue_exports } from "./vue-D80rEydT.js";
import { i as server_renderer_exports } from "../ssr.mjs";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/MultiChoice.vue
var _sfc_main = {
	__name: "MultiChoice",
	__ssrInlineRender: true,
	props: {
		modelValue: {
			type: Array,
			default: () => []
		},
		field: {
			type: Object,
			required: true
		},
		form: {
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
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-DNUx1j8i.js"));
		const Checkbox = (0, vue_exports.defineAsyncComponent)(() => import("./checkbox-CzUEl3jE.js"));
		const id = (0, vue_exports.useId)();
		const props = __props;
		const emit = __emit;
		const model = (0, vue_exports.computed)({
			get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
			set: (value) => emit("update:modelValue", value)
		});
		const inputId = (0, vue_exports.computed)(() => `${id}-${props.field?.key || "multichoice"}`);
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<fieldset${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: ["flex w-full flex-col gap-2", __props.field?.cssClass] }, _attrs))}><legend class="text-pretty">${__props.field.label ?? ""}</legend><div class="flex flex-col gap-2"><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(__props.field.choices, (choice) => {
				_push(`<label class="${(0, server_renderer_exports.ssrRenderClass)([model.value.includes(choice.value) ? "border-gray-500 bg-gray-100" : "border-gray-300 hover:bg-gray-50", "flex items-center gap-2 rounded border p-3 text-pretty"])}"${(0, server_renderer_exports.ssrRenderAttr)("for", `${inputId.value}-${choice.value}`)}>`);
				_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Checkbox), {
					inputId: `${inputId.value}-${choice.value}`,
					value: choice.value,
					modelValue: model.value,
					"onUpdate:modelValue": ($event) => model.value = $event,
					"aria-invalid": !!__props.error,
					"aria-describedby": __props.error ? inputId.value + "-error" : void 0
				}, null, _parent));
				_push(`<div class="cursor-pointer pt-0.5 text-sm">${(0, server_renderer_exports.ssrInterpolate)(choice.text)}</div></label>`);
			});
			_push(`<!--]--></div>`);
			if (__props.error) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Message), {
				id: inputId.value + "-error",
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
			_push(`</fieldset>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/MultiChoice.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
