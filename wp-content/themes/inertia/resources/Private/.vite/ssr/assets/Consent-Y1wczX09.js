import { t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Consent.vue
var _sfc_main = {
	__name: "Consent",
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
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const Checkbox = (0, vue_exports.defineAsyncComponent)(() => import("./checkbox-B_xAYZDO.js"));
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-zCkatRph.js"));
		const props = __props;
		const emit = __emit;
		const normalizeConsentValue = (value) => value === true || value === 1 || value === "1";
		const localValue = (0, vue_exports.ref)(normalizeConsentValue(props.modelValue));
		(0, vue_exports.watch)(() => props.modelValue, (newValue) => {
			localValue.value = normalizeConsentValue(newValue);
		});
		(0, vue_exports.watch)(localValue, (newValue) => {
			emit("update:modelValue", newValue ? 1 : "");
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field?.cssClass, "mt-8"] }, _attrs))}>`);
			if (__props.field?.description) _push(`<div class="mb-2">${__props.field?.description ?? ""}</div>`);
			else _push(`<!---->`);
			_push(`<div class="flex items-start gap-4">`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Checkbox), {
				modelValue: localValue.value,
				"onUpdate:modelValue": ($event) => localValue.value = $event,
				inputId: __props.field?.key,
				binary: "",
				required: __props.field?.isRequired,
				class: [{ "is-invalid": __props.error }, "mt-0.5 rounded-none"],
				invalid: __props.error
			}, null, _parent));
			_push(`<label class="text-mob cursor-pointer leading-[1.4] tracking-[0.5px]"${(0, server_renderer_exports.ssrRenderAttr)("for", __props.field?.key)}>${__props.field?.checkboxLabel ?? ""}</label></div>`);
			if (__props.error) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Message), {
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
