import { t as vue_exports } from "./vue-D80rEydT.js";
import { i as server_renderer_exports } from "../ssr.mjs";
//#region wp-content/themes/inertia/resources/Private/js/components/Form/Fields/Input.vue
var _sfc_main = {
	__name: "Input",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ (0, vue_exports.mergeModels)({
		field: {
			type: Object,
			default: null
		},
		error: {
			type: [String, Boolean],
			default: false
		},
		requiredIndicator: {
			type: String,
			default: ""
		}
	}, {
		"modelValue": { required: true },
		"modelModifiers": {}
	}),
	emits: ["update:modelValue"],
	setup(__props) {
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-DNUx1j8i.js"));
		const FloatLabel = (0, vue_exports.defineAsyncComponent)(() => import("./floatlabel-CAfcp74H.js"));
		const InputText = (0, vue_exports.defineAsyncComponent)(() => import("./inputtext-3mUhJx8c.js"));
		const id = (0, vue_exports.useId)();
		const model = (0, vue_exports.useModel)(__props, "modelValue");
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: [__props.field?.cssClass, "w-full"] }, _attrs))}>`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FloatLabel), { variant: "on" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(InputText), {
							class: "w-full",
							id: (0, vue_exports.unref)(id) + __props.field?.key,
							type: [
								"email",
								"number",
								"url",
								"password",
								"date"
							].includes(__props.field?.type) ? __props.field.type : "text",
							modelValue: model.value,
							"onUpdate:modelValue": ($event) => model.value = $event,
							autocomplete: __props.field?.autocompleteAttribute,
							name: __props.field?.key,
							invalid: !!__props.error,
							required: __props.field?.isRequired,
							"aria-invalid": !!__props.error,
							"aria-describedby": __props.error ? (0, vue_exports.unref)(id) + __props.field?.key + "-error" : void 0
						}, null, _parent, _scopeId));
						_push(`<label${(0, server_renderer_exports.ssrRenderAttr)("for", (0, vue_exports.unref)(id) + __props.field?.key)}${_scopeId}>${`${__props.field.label}${__props.field?.isRequired && __props.requiredIndicator == "asterisk" ? "*" : ""}`}</label>`);
					} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(InputText), {
						class: "w-full",
						id: (0, vue_exports.unref)(id) + __props.field?.key,
						type: [
							"email",
							"number",
							"url",
							"password",
							"date"
						].includes(__props.field?.type) ? __props.field.type : "text",
						modelValue: model.value,
						"onUpdate:modelValue": ($event) => model.value = $event,
						autocomplete: __props.field?.autocompleteAttribute,
						name: __props.field?.key,
						invalid: !!__props.error,
						required: __props.field?.isRequired,
						"aria-invalid": !!__props.error,
						"aria-describedby": __props.error ? (0, vue_exports.unref)(id) + __props.field?.key + "-error" : void 0
					}, null, 8, [
						"id",
						"type",
						"modelValue",
						"onUpdate:modelValue",
						"autocomplete",
						"name",
						"invalid",
						"required",
						"aria-invalid",
						"aria-describedby"
					]), (0, vue_exports.createVNode)("label", {
						for: (0, vue_exports.unref)(id) + __props.field?.key,
						innerHTML: `${__props.field.label}${__props.field?.isRequired && __props.requiredIndicator == "asterisk" ? "*" : ""}`
					}, null, 8, ["for", "innerHTML"])];
				}),
				_: 1
			}, _parent));
			if (__props.error) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Message), {
				id: (0, vue_exports.unref)(id) + __props.field?.key + "-error",
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/Fields/Input.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
