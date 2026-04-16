import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Phone.vue
var _sfc_main = {
	__name: "Phone",
	__ssrInlineRender: true,
	props: {
		modelValue: { required: true },
		field: { type: Object },
		error: { type: String },
		requiredIndicator: { type: String }
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-DbWVQwe0.js"));
		const FloatLabel = (0, vue_exports.defineAsyncComponent)(() => import("./floatlabel-_S0BAsYb.js"));
		const InputText = (0, vue_exports.defineAsyncComponent)(() => import("./inputtext-Daf5l-2u.js"));
		const id = (0, vue_exports.useId)();
		const props = __props;
		const emit = __emit;
		const model = (0, vue_exports.computed)({
			get: () => props.modelValue,
			set: (value) => emit("update:modelValue", value)
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field?.cssClass, "w-full"] }, _attrs))}>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FloatLabel), { variant: "on" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(InputText), {
							class: "w-full",
							id: (0, vue_exports.unref)(id) + __props.field?.key,
							type: "tel",
							modelValue: model.value,
							"onUpdate:modelValue": ($event) => model.value = $event,
							autocomplete: __props.field?.autocompleteAttribute,
							name: __props.field?.autocompleteAttribute,
							invalid: !!__props.error,
							required: __props.field?.isRequired,
							inputmode: "tel"
						}, null, _parent, _scopeId));
						_push(`<label${(0, server_renderer_exports.ssrRenderAttr)("for", (0, vue_exports.unref)(id) + __props.field?.key)}${_scopeId}>${`${__props.field.label}${__props.field?.isRequired && __props.requiredIndicator == "asterisk" ? "*" : ""}`}</label>`);
					} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(InputText), {
						class: "w-full",
						id: (0, vue_exports.unref)(id) + __props.field?.key,
						type: "tel",
						modelValue: model.value,
						"onUpdate:modelValue": ($event) => model.value = $event,
						autocomplete: __props.field?.autocompleteAttribute,
						name: __props.field?.autocompleteAttribute,
						invalid: !!__props.error,
						required: __props.field?.isRequired,
						inputmode: "tel"
					}, null, 8, [
						"id",
						"modelValue",
						"onUpdate:modelValue",
						"autocomplete",
						"name",
						"invalid",
						"required"
					]), (0, vue_exports.createVNode)("label", {
						for: (0, vue_exports.unref)(id) + __props.field?.key,
						innerHTML: `${__props.field.label}${__props.field?.isRequired && __props.requiredIndicator == "asterisk" ? "*" : ""}`
					}, null, 8, ["for", "innerHTML"])];
				}),
				_: 1
			}, _parent));
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Phone.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
