import { t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
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
		const Message = (0, vue_exports.defineAsyncComponent)(() => import("./message-zCkatRph.js"));
		const Checkbox = (0, vue_exports.defineAsyncComponent)(() => import("./checkbox-B_xAYZDO.js"));
		const id = (0, vue_exports.useId)();
		const props = __props;
		const emit = __emit;
		const model = (0, vue_exports.computed)({
			get: () => Array.isArray(props.modelValue) ? props.modelValue : [],
			set: (value) => emit("update:modelValue", value)
		});
		const inputId = (0, vue_exports.computed)(() => `${id}-${props.field?.key || "multichoice"}`);
		const shouldShow = (0, vue_exports.computed)(() => {
			const logic = props.field?.conditionalLogic;
			if (!logic || !logic.enabled) return true;
			const results = logic.rules.map((rule) => {
				const fieldKey = `input_${rule.fieldId}`;
				const currentValue = props.form[fieldKey];
				switch (rule.operator) {
					case "is": return currentValue === rule.value;
					case "isnot": return currentValue !== rule.value;
					case "contains": return String(currentValue || "").includes(rule.value);
					case "greater_than": return Number(currentValue) > Number(rule.value);
					case "less_than": return Number(currentValue) < Number(rule.value);
					default: return false;
				}
			});
			let passed = false;
			if (logic.logicType === "all") passed = results.every(Boolean);
			else passed = results.some(Boolean);
			return logic.actionType === "show" ? passed : !passed;
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (shouldShow.value) {
				_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: ["mt-8 flex w-full flex-col gap-2", __props.field?.cssClass] }, _attrs))}><p class="text-mob text-dark-gold leading-[1.4] tracking-[0.4px]">${__props.field.label ?? ""}</p><div class="flex flex-col gap-2"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.field.choices, (choice) => {
					_push(`<label class="${(0, server_renderer_exports.ssrRenderClass)([model.value.includes(choice.value) ? "border-grays-200 bg-grays-100" : "bg-lighter hover:bg-grays-100 border-grays-100", "transit hover:bg flex items-center gap-2 rounded-sm border p-4"])}"${(0, server_renderer_exports.ssrRenderAttr)("for", `${inputId.value}-${choice.value}`)}>`);
					_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Checkbox), {
						inputId: `${inputId.value}-${choice.value}`,
						value: choice.value,
						modelValue: model.value,
						"onUpdate:modelValue": ($event) => model.value = $event
					}, null, _parent));
					_push(`<div class="cursor-pointer pt-0.5 text-sm">${(0, server_renderer_exports.ssrInterpolate)(choice.text)}</div></label>`);
				});
				_push(`<!--]--></div>`);
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
			} else _push(`<!---->`);
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
