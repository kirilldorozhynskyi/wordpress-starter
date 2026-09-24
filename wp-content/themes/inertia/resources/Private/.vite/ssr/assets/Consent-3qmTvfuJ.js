import { t as vue_exports } from "./vue-D80rEydT.js";
import { i as server_renderer_exports } from "../ssr.mjs";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Consent.vue
var _sfc_main = {
	__name: "Consent",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ (0, vue_exports.mergeModels)({
		field: {
			type: Object,
			required: true
		},
		error: {
			type: [String, Boolean],
			default: false
		}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const Checkbox = (0, vue_exports.defineAsyncComponent)(() => import("./checkbox-CzUEl3jE.js"));
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-DNUx1j8i.js"));
		const inputId = (0, vue_exports.useId)();
		const model = (0, vue_exports.useModel)(__props, "modelValue");
		const localValue = (0, vue_exports.computed)({
			get: () => model.value === true || model.value === 1 || model.value === "1",
			set: (value) => {
				model.value = value ? 1 : "";
			}
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field?.cssClass, "md:col-span-2"] }, _attrs))}>`);
			if (__props.field?.description) _push(`<div class="mb-2">${__props.field?.description ?? ""}</div>`);
			else _push(`<!---->`);
			_push(`<div class="flex items-start gap-4">`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Checkbox), {
				modelValue: localValue.value,
				"onUpdate:modelValue": ($event) => localValue.value = $event,
				inputId: (0, vue_exports.unref)(inputId),
				binary: "",
				required: __props.field?.isRequired,
				class: [{ "is-invalid": __props.error }, "mt-0.5 rounded-none"],
				invalid: !!__props.error,
				"aria-invalid": !!__props.error,
				"aria-describedby": __props.error ? (0, vue_exports.unref)(inputId) + "-error" : void 0
			}, null, _parent));
			_push(`<label class="cursor-pointer text-pretty"${(0, server_renderer_exports.ssrRenderAttr)("for", (0, vue_exports.unref)(inputId))}>${__props.field?.checkboxLabel ?? ""}</label></div>`);
			if (__props.error) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Message), {
				id: (0, vue_exports.unref)(inputId) + "-error",
				severity: "error",
				size: "small",
				class: "h-inherit flex",
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Consent.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
