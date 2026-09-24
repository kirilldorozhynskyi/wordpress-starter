import { t as vue_exports } from "./vue-D80rEydT.js";
import { a as useI18n, i as server_renderer_exports, t as ensurePrimeVue } from "../ssr.mjs";
import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
//#region \0@oxc-project+runtime@0.150.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.150.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.150.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.150.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/services/http.ts
var HttpError = class extends Error {
	constructor(status, data) {
		super(`Request failed with status ${status}`);
		_defineProperty(this, "status", void 0);
		_defineProperty(this, "data", void 0);
		this.status = status;
		this.data = data;
	}
};
async function fetchJson(url, options = {}) {
	const headers = new Headers(options.headers);
	headers.set("Accept", "application/json");
	const response = await fetch(url, {
		...options,
		headers
	});
	let data;
	try {
		data = await response.json();
	} catch {
		throw new HttpError(response.status, null);
	}
	if (!response.ok) throw new HttpError(response.status, data);
	if (!data || typeof data !== "object") throw new HttpError(response.status, null);
	return data;
}
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/features/forms/conditions.ts
function isFieldActive(field, values) {
	const logic = field.conditionalLogic;
	if (!logic || logic.enabled === false || !logic.rules?.length) return true;
	const results = logic.rules.map((rule) => {
		const value = values[`input_${rule.fieldId}`] ?? values[`input_${rule.fieldId}.1`] ?? "";
		const items = Array.isArray(value) ? value.map(String) : [String(value)];
		switch (rule.operator) {
			case "is": return items.includes(String(rule.value));
			case "isnot": return !items.includes(String(rule.value));
			case "contains": return items.some((item) => item.includes(rule.value));
			case "starts_with": return items.some((item) => item.startsWith(rule.value));
			case "ends_with": return items.some((item) => item.endsWith(rule.value));
			case "greater_than": return Number(value) > Number(rule.value);
			case "less_than": return Number(value) < Number(rule.value);
			default: return false;
		}
	});
	const passed = logic.logicType === "all" ? results.every(Boolean) : results.some(Boolean);
	return logic.actionType === "hide" ? !passed : passed;
}
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/features/forms/serialization.ts
var hasValue = (value) => {
	if (Array.isArray(value)) return value.length > 0;
	return value !== void 0 && value !== null && value !== "";
};
var getConsentInputKey = (field) => {
	const consentInput = Array.isArray(field?.inputs) ? field.inputs.find((input) => String(input?.id) === `${field.id}.1`) : null;
	return consentInput?.id ? `input_${consentInput.id}` : null;
};
var normalizeField = (field) => {
	if (field?.type !== "consent") return {
		...field,
		key: field.key || `input_${field.id}`
	};
	const consentKey = getConsentInputKey(field);
	return consentKey ? {
		...field,
		key: consentKey
	} : field;
};
var normalizeFormData = (data) => {
	if (!Array.isArray(data?.fields)) return data;
	return {
		...data,
		fields: data.fields.map(normalizeField)
	};
};
var appendConsentField = (fd, field, value) => {
	if (![
		true,
		1,
		"1"
	].includes(value)) return;
	const inputs = Array.isArray(field?.inputs) ? field.inputs : [];
	const consentInput = inputs.find((input) => String(input?.id).endsWith(".1"));
	const labelInput = inputs.find((input) => String(input?.id).endsWith(".2"));
	const revisionInput = inputs.find((input) => String(input?.id).endsWith(".3"));
	if (!consentInput?.id) return;
	fd.append(`input_${consentInput.id}`, "1");
	if (labelInput?.id && field?.checkboxLabel) fd.append(`input_${labelInput.id}`, field.checkboxLabel);
	if (revisionInput?.id && field?.consentRevisionId) fd.append(`input_${revisionInput.id}`, String(field.consentRevisionId));
};
var getInitialFieldValue = (field) => {
	const defaultValue = field?.defaultValue ?? field?.default_value;
	switch (field?.type) {
		case "checkbox":
		case "multi_choice":
			if (Array.isArray(defaultValue)) return defaultValue;
			return defaultValue ? [String(defaultValue)] : (field.choices ?? []).filter((choice) => choice.isSelected).map((choice) => choice.value);
		case "fileupload": return defaultValue ?? null;
		case "consent": return defaultValue === 1 || defaultValue === "1" || defaultValue === true ? 1 : "";
		default: return defaultValue ?? "";
	}
};
var buildInitialFormState = (fields = [], currentState = {}) => fields.reduce((state, field) => {
	if (!field?.key || state[field.key] !== void 0) return state;
	state[field.key] = getInitialFieldValue(field);
	return state;
}, { ...currentState });
var appendMultiChoiceField = (fd, field, value) => {
	const selected = new Set(value.map((item) => String(item)));
	const inputs = Array.isArray(field.inputs) ? field.inputs : [];
	const choices = Array.isArray(field.choices) ? field.choices : [];
	const inputsByKey = new Map(inputs.filter((input) => input?.key).map((input) => [input.key, input]));
	const choicesByKey = new Map(choices.filter((choice) => choice?.key).map((choice) => [choice.key, choice]));
	if (inputsByKey.size && choicesByKey.size) {
		inputsByKey.forEach((input, inputKey) => {
			const choice = choicesByKey.get(inputKey);
			if (choice && selected.has(String(choice.value))) fd.append(`input_${input.id}`, String(choice.value));
		});
		return;
	}
	const normalizeText = (input) => String(input ?? "").replace(/\s+/g, " ").trim();
	inputs.forEach((input, index) => {
		let choice = choices[index];
		if (!choice) choice = choices.find((item) => normalizeText(item.text) === normalizeText(input.label));
		if (choice && selected.has(String(choice.value))) fd.append(`input_${input.id}`, String(choice.value));
	});
};
var appendFieldValue = (fd, field, key, value) => {
	if (field.type === "consent") {
		appendConsentField(fd, field, value);
		return;
	}
	if (!hasValue(value)) return;
	if (["multi_choice", "checkbox"].includes(field.type) && Array.isArray(value)) {
		appendMultiChoiceField(fd, field, value);
		return;
	}
	if (field.type === "fileupload" && typeof File !== "undefined" && value instanceof File) {
		fd.append(key, value, value.name);
		return;
	}
	fd.append(key, String(value));
};
function serializeForm(fields, values) {
	const body = new FormData();
	for (const field of fields) {
		if (field.visibility === "administrative" || !isFieldActive(field, values)) continue;
		let value = values[field.key];
		if (field.type === "date" && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
			const [year, month, day] = value.split("-");
			const format = field.dateFormat || "mdy";
			const separator = format.includes(".") || format.includes("dot") ? "." : format.includes("-") || format.includes("dash") ? "-" : "/";
			value = (format.startsWith("ymd") ? [
				year,
				month,
				day
			] : format.startsWith("dmy") ? [
				day,
				month,
				year
			] : [
				month,
				day,
				year
			]).join(separator);
		}
		appendFieldValue(body, field, field.key, value);
	}
	return body;
}
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/features/forms/useGravityForm.ts
function useGravityForm(id, language) {
	const definition = (0, vue_exports.ref)(null);
	const values = (0, vue_exports.ref)({});
	const errors = (0, vue_exports.ref)({});
	const status = (0, vue_exports.ref)("idle");
	const submitError = (0, vue_exports.ref)(false);
	let request;
	let revision = 0;
	const visibleFields = (0, vue_exports.computed)(() => (definition.value?.fields ?? []).filter((field) => field.type !== "hidden" && field.visibility !== "hidden" && field.visibility !== "administrative" && isFieldActive(field, values.value)));
	async function load() {
		request?.abort();
		const current = ++revision;
		const controller = request = new AbortController();
		status.value = "loading";
		definition.value = null;
		values.value = {};
		errors.value = {};
		submitError.value = false;
		try {
			const query = new URLSearchParams({
				id: String(id()),
				lang: language()
			});
			const [data] = await Promise.all([fetchJson(`/wp-json/inertia/v1/get-form?${query}`, { signal: controller.signal }), /* @__PURE__ */ ensurePrimeVue()]);
			if (current !== revision) return;
			if (!Array.isArray(data.fields)) throw new Error("Invalid form definition");
			definition.value = normalizeFormData(data);
			values.value = buildInitialFormState(definition.value.fields);
			status.value = "ready";
		} catch {
			if (current === revision && !controller.signal.aborted) status.value = "load-error";
		}
	}
	async function submit() {
		if (status.value !== "ready" || !definition.value) return null;
		const current = revision;
		const controller = request = new AbortController();
		status.value = "submitting";
		errors.value = {};
		submitError.value = false;
		try {
			const data = await fetchJson(`/wp-json/gf/v2/forms/${encodeURIComponent(id())}/submissions`, {
				method: "POST",
				body: serializeForm(definition.value.fields, values.value),
				signal: controller.signal
			});
			if (current !== revision) return null;
			if (data.is_valid !== true) throw new HttpError(400, data);
			status.value = "success";
			return data;
		} catch (error) {
			if (current !== revision || controller.signal.aborted) return null;
			const data = error instanceof HttpError ? error.data : null;
			errors.value = data?.validation_messages && typeof data.validation_messages === "object" ? data.validation_messages : {};
			submitError.value = true;
			status.value = "ready";
			return null;
		}
	}
	(0, vue_exports.watch)([id, language], () => {
		if (status.value !== "idle") load();
	});
	(0, vue_exports.onScopeDispose)(() => {
		revision++;
		request?.abort();
	});
	return {
		definition,
		values,
		errors,
		status,
		submitError,
		visibleFields,
		load,
		submit
	};
}
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/Form/GForm.vue?vue&type=script&setup=true&lang.ts
var GForm_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "GForm",
	__ssrInlineRender: true,
	props: { id: {} },
	setup(__props) {
		const props = __props;
		const { t, locale } = useI18n();
		const root = (0, vue_exports.useTemplateRef)("root");
		(0, vue_exports.useTemplateRef)("confirmation");
		(0, vue_exports.useTemplateRef)("errorSummary");
		const { definition, values, errors, status, submitError, visibleFields, load, submit } = useGravityForm(() => props.id, () => locale.value);
		const fieldComponents = {
			consent: (0, vue_exports.defineAsyncComponent)(() => import("./Consent-3qmTvfuJ.js")),
			date: (0, vue_exports.defineAsyncComponent)(() => import("./Date-SsRguvqu.js")),
			fileupload: (0, vue_exports.defineAsyncComponent)(() => import("./File-vgoaSs1r.js")),
			html: (0, vue_exports.defineAsyncComponent)(() => import("./Html-DdgkWVHf.js")),
			input: (0, vue_exports.defineAsyncComponent)(() => import("./Input-2bEzkc_L.js")),
			multi_choice: (0, vue_exports.defineAsyncComponent)(() => import("./MultiChoice-i8E3QYcd.js")),
			phone: (0, vue_exports.defineAsyncComponent)(() => import("./Phone-BuN0s25v.js")),
			radio: (0, vue_exports.defineAsyncComponent)(() => import("./Radio-DH5786Ms.js")),
			select: (0, vue_exports.defineAsyncComponent)(() => import("./Select-CONxWkwT.js")),
			textarea: (0, vue_exports.defineAsyncComponent)(() => import("./Textarea-BZFUkIcj.js"))
		};
		const getFieldComponent = (type) => fieldComponents[type === "checkbox" ? "multi_choice" : type] || fieldComponents.input;
		let observer;
		(0, vue_exports.onMounted)(() => {
			if (!root.value || !("IntersectionObserver" in window)) {
				load();
				return;
			}
			observer = new IntersectionObserver((entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					observer?.disconnect();
					load();
				}
			}, { rootMargin: "320px 0px" });
			observer.observe(root.value);
		});
		(0, vue_exports.onBeforeUnmount)(() => observer?.disconnect());
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				ref_key: "root",
				ref: root,
				"aria-busy": (0, vue_exports.unref)(status) === "loading" || (0, vue_exports.unref)(status) === "submitting"
			}, _attrs))} data-v-14b13257>`);
			if ((0, vue_exports.unref)(status) === "idle") _push(`<div class="min-h-56 md:min-h-72" aria-hidden="true" data-v-14b13257></div>`);
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(status) === "loading") _push(`<p role="status" class="text-pretty" data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("form.loading"))}</p>`);
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(status) === "load-error") _push(`<div role="alert" class="flex flex-col items-start gap-4" data-v-14b13257><p class="text-pretty" data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("form.load_error"))}</p><button type="button" class="form-action" data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("form.retry"))}</button></div>`);
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(status) === "success") _push(`<div tabindex="-1" role="status" class="success-submit text-pretty" data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("form.success"))}</div>`);
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(status) === "ready" || (0, vue_exports.unref)(status) === "submitting") {
				_push(`<form data-v-14b13257><fieldset${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(status) === "submitting") ? " disabled" : ""} class="grid min-w-0 grid-cols-1 gap-4 border-0 p-0 font-normal md:grid-cols-2" data-v-14b13257><legend class="sr-only" data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("form.title"))}</legend><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(visibleFields), (field) => {
					(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(getFieldComponent(field.type)), {
						key: field.key,
						modelValue: (0, vue_exports.unref)(values)[field.key],
						"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(values)[field.key] = $event,
						form: (0, vue_exports.unref)(values),
						field,
						error: (0, vue_exports.unref)(errors)[field.id] || "",
						requiredIndicator: (0, vue_exports.unref)(definition)?.requiredIndicator
					}, null), _parent);
				});
				_push(`<!--]-->`);
				if ((0, vue_exports.unref)(submitError)) _push(`<p role="alert" tabindex="-1" class="text-pretty md:col-span-2" data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)(Object.keys((0, vue_exports.unref)(errors)).length ? (0, vue_exports.unref)(t)("form.validation_error") : (0, vue_exports.unref)(t)("form.submit_error"))}</p>`);
				else _push(`<!---->`);
				if ((0, vue_exports.unref)(definition)?.button) _push(`<div class="mt-4 flex md:col-span-2" data-v-14b13257><button type="submit" class="form-action"${(0, server_renderer_exports.ssrIncludeBooleanAttr)((0, vue_exports.unref)(status) === "submitting") ? " disabled" : ""} data-v-14b13257>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(status) === "submitting" ? (0, vue_exports.unref)(t)("form.sending") : (0, vue_exports.unref)(definition).button.text || (0, vue_exports.unref)(t)("form.send"))}</button></div>`);
				else _push(`<!---->`);
				_push(`</fieldset></form>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/Form/GForm.vue
var _sfc_setup$1 = GForm_vue_vue_type_script_setup_true_lang_default.setup;
GForm_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/GForm.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var GForm_default = /*#__PURE__*/ _plugin_vue_export_helper_default(GForm_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-14b13257"]]);
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/Acf/Flex/Contact.vue
var _sfc_main = {
	__name: "Contact",
	__ssrInlineRender: true,
	props: { ce: {
		type: Object,
		required: true
	} },
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)}><div class="container">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(GForm_default, { id: 1 }, null, _parent));
			_push(`</div></section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Acf/Flex/Contact.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
