import { a as __commonJSMin, t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
import { n as useI18n } from "./vue-i18n-l17rBdCV.js";
import { t as ensurePrimeVue } from "./primevue-Dt6iK25i.js";
//#region \0rolldown_dynamic_import_helper.js
var _rolldown_dynamic_import_helper_default = (glob, path, segments) => {
	const query = path.lastIndexOf("?");
	const v = glob[query === -1 || query < path.lastIndexOf("/") ? path : path.slice(0, query)];
	if (v) return typeof v === "function" ? v() : Promise.resolve(v);
	return new Promise((_, reject) => {
		(typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path + (path.split("/").length !== segments ? ". Note that variables only represent file names one level deep." : ""))));
	});
};
(/* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* vue-scrollto v2.20.0
	* (c) 2019 Randjelovic Igor
	* @license MIT
	*/
	(function(global, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global["vue-scrollto"] = factory());
	})(exports, (function() {
		"use strict";
		function _typeof(obj) {
			"@babel/helpers - typeof";
			if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") _typeof = function(obj) {
				return typeof obj;
			};
			else _typeof = function(obj) {
				return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
			};
			return _typeof(obj);
		}
		function _extends() {
			_extends = Object.assign || function(target) {
				for (var i = 1; i < arguments.length; i++) {
					var source = arguments[i];
					for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
				}
				return target;
			};
			return _extends.apply(this, arguments);
		}
		/**
		* https://github.com/gre/bezier-easing
		* BezierEasing - use bezier curve for transition easing function
		* by Gaëtan Renaudeau 2014 - 2015 – MIT License
		*/
		var NEWTON_ITERATIONS = 4;
		var NEWTON_MIN_SLOPE = .001;
		var SUBDIVISION_PRECISION = 1e-7;
		var SUBDIVISION_MAX_ITERATIONS = 10;
		var kSplineTableSize = 11;
		var kSampleStepSize = 1 / (kSplineTableSize - 1);
		var float32ArraySupported = typeof Float32Array === "function";
		function A(aA1, aA2) {
			return 1 - 3 * aA2 + 3 * aA1;
		}
		function B(aA1, aA2) {
			return 3 * aA2 - 6 * aA1;
		}
		function C(aA1) {
			return 3 * aA1;
		}
		function calcBezier(aT, aA1, aA2) {
			return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
		}
		function getSlope(aT, aA1, aA2) {
			return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1);
		}
		function binarySubdivide(aX, aA, aB, mX1, mX2) {
			var currentX, currentT, i = 0;
			do {
				currentT = aA + (aB - aA) / 2;
				currentX = calcBezier(currentT, mX1, mX2) - aX;
				if (currentX > 0) aB = currentT;
				else aA = currentT;
			} while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
			return currentT;
		}
		function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
			for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
				var currentSlope = getSlope(aGuessT, mX1, mX2);
				if (currentSlope === 0) return aGuessT;
				var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
				aGuessT -= currentX / currentSlope;
			}
			return aGuessT;
		}
		function LinearEasing(x) {
			return x;
		}
		var src = function bezier(mX1, mY1, mX2, mY2) {
			if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) throw new Error("bezier x values must be in [0, 1] range");
			if (mX1 === mY1 && mX2 === mY2) return LinearEasing;
			var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
			for (var i = 0; i < kSplineTableSize; ++i) sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
			function getTForX(aX) {
				var intervalStart = 0;
				var currentSample = 1;
				var lastSample = kSplineTableSize - 1;
				for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) intervalStart += kSampleStepSize;
				--currentSample;
				var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
				var guessForT = intervalStart + dist * kSampleStepSize;
				var initialSlope = getSlope(guessForT, mX1, mX2);
				if (initialSlope >= NEWTON_MIN_SLOPE) return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
				else if (initialSlope === 0) return guessForT;
				else return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
			}
			return function BezierEasing(x) {
				if (x === 0) return 0;
				if (x === 1) return 1;
				return calcBezier(getTForX(x), mY1, mY2);
			};
		};
		var easings = {
			ease: [
				.25,
				.1,
				.25,
				1
			],
			linear: [
				0,
				0,
				1,
				1
			],
			"ease-in": [
				.42,
				0,
				1,
				1
			],
			"ease-out": [
				0,
				0,
				.58,
				1
			],
			"ease-in-out": [
				.42,
				0,
				.58,
				1
			]
		};
		var supportsPassive = false;
		try {
			var opts = Object.defineProperty({}, "passive", { get: function get() {
				supportsPassive = true;
			} });
			window.addEventListener("test", null, opts);
		} catch (e) {}
		var _ = {
			$: function $(selector) {
				if (typeof selector !== "string") return selector;
				return document.querySelector(selector);
			},
			on: function on(element, events, handler) {
				var opts = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : { passive: false };
				if (!(events instanceof Array)) events = [events];
				for (var i = 0; i < events.length; i++) element.addEventListener(events[i], handler, supportsPassive ? opts : false);
			},
			off: function off(element, events, handler) {
				if (!(events instanceof Array)) events = [events];
				for (var i = 0; i < events.length; i++) element.removeEventListener(events[i], handler);
			},
			cumulativeOffset: function cumulativeOffset(element) {
				var top = 0;
				var left = 0;
				do {
					top += element.offsetTop || 0;
					left += element.offsetLeft || 0;
					element = element.offsetParent;
				} while (element);
				return {
					top,
					left
				};
			}
		};
		var abortEvents = [
			"mousedown",
			"wheel",
			"DOMMouseScroll",
			"mousewheel",
			"keyup",
			"touchmove"
		];
		var defaults = {
			container: "body",
			duration: 500,
			lazy: true,
			easing: "ease",
			offset: 0,
			force: true,
			cancelable: true,
			onStart: false,
			onDone: false,
			onCancel: false,
			x: false,
			y: true
		};
		function setDefaults(options) {
			defaults = _extends({}, defaults, options);
		}
		var scroller = function scroller() {
			var element;
			var container;
			var duration;
			var easing;
			var lazy;
			var offset;
			var force;
			var cancelable;
			var onStart;
			var onDone;
			var onCancel;
			var x;
			var y;
			var initialX;
			var targetX;
			var initialY;
			var targetY;
			var diffX;
			var diffY;
			var abort;
			var cumulativeOffsetContainer;
			var cumulativeOffsetElement;
			var abortEv;
			var abortFn = function abortFn(e) {
				if (!cancelable) return;
				abortEv = e;
				abort = true;
			};
			var easingFn;
			var timeStart;
			var timeElapsed;
			var progress;
			function scrollTop(container) {
				var scrollTop = container.scrollTop;
				if (container.tagName.toLowerCase() === "body") scrollTop = scrollTop || document.documentElement.scrollTop;
				return scrollTop;
			}
			function scrollLeft(container) {
				var scrollLeft = container.scrollLeft;
				if (container.tagName.toLowerCase() === "body") scrollLeft = scrollLeft || document.documentElement.scrollLeft;
				return scrollLeft;
			}
			function recalculateTargets() {
				cumulativeOffsetContainer = _.cumulativeOffset(container);
				cumulativeOffsetElement = _.cumulativeOffset(element);
				if (x) {
					targetX = cumulativeOffsetElement.left - cumulativeOffsetContainer.left + offset;
					diffX = targetX - initialX;
				}
				if (y) {
					targetY = cumulativeOffsetElement.top - cumulativeOffsetContainer.top + offset;
					diffY = targetY - initialY;
				}
			}
			function step(timestamp) {
				if (abort) return done();
				if (!timeStart) timeStart = timestamp;
				if (!lazy) recalculateTargets();
				timeElapsed = timestamp - timeStart;
				progress = Math.min(timeElapsed / duration, 1);
				progress = easingFn(progress);
				topLeft(container, initialY + diffY * progress, initialX + diffX * progress);
				timeElapsed < duration ? window.requestAnimationFrame(step) : done();
			}
			function done() {
				if (!abort) topLeft(container, targetY, targetX);
				timeStart = false;
				_.off(container, abortEvents, abortFn);
				if (abort && onCancel) onCancel(abortEv, element);
				if (!abort && onDone) onDone(element);
			}
			function topLeft(element, top, left) {
				if (y) element.scrollTop = top;
				if (x) element.scrollLeft = left;
				if (element.tagName.toLowerCase() === "body") {
					if (y) document.documentElement.scrollTop = top;
					if (x) document.documentElement.scrollLeft = left;
				}
			}
			function scrollTo(target, _duration) {
				var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
				if (_typeof(_duration) === "object") options = _duration;
				else if (typeof _duration === "number") options.duration = _duration;
				element = _.$(target);
				if (!element) return console.warn("[vue-scrollto warn]: Trying to scroll to an element that is not on the page: " + target);
				container = _.$(options.container || defaults.container);
				duration = options.hasOwnProperty("duration") ? options.duration : defaults.duration;
				lazy = options.hasOwnProperty("lazy") ? options.lazy : defaults.lazy;
				easing = options.easing || defaults.easing;
				offset = options.hasOwnProperty("offset") ? options.offset : defaults.offset;
				force = options.hasOwnProperty("force") ? options.force !== false : defaults.force;
				cancelable = options.hasOwnProperty("cancelable") ? options.cancelable !== false : defaults.cancelable;
				onStart = options.onStart || defaults.onStart;
				onDone = options.onDone || defaults.onDone;
				onCancel = options.onCancel || defaults.onCancel;
				x = options.x === void 0 ? defaults.x : options.x;
				y = options.y === void 0 ? defaults.y : options.y;
				if (typeof offset === "function") offset = offset(element, container);
				initialX = scrollLeft(container);
				initialY = scrollTop(container);
				recalculateTargets();
				abort = false;
				if (!force) {
					var containerHeight = container.tagName.toLowerCase() === "body" ? document.documentElement.clientHeight || window.innerHeight : container.offsetHeight;
					var containerTop = initialY;
					var containerBottom = containerTop + containerHeight;
					var elementTop = targetY - offset;
					var elementBottom = elementTop + element.offsetHeight;
					if (elementTop >= containerTop && elementBottom <= containerBottom) {
						if (onDone) onDone(element);
						return;
					}
				}
				if (onStart) onStart(element);
				if (!diffY && !diffX) {
					if (onDone) onDone(element);
					return;
				}
				if (typeof easing === "string") easing = easings[easing] || easings["ease"];
				easingFn = src.apply(src, easing);
				_.on(container, abortEvents, abortFn, { passive: true });
				window.requestAnimationFrame(step);
				return function() {
					abortEv = null;
					abort = true;
				};
			}
			return scrollTo;
		};
		var _scroller = scroller();
		var bindings = [];
		function deleteBinding(el) {
			for (var i = 0; i < bindings.length; ++i) if (bindings[i].el === el) {
				bindings.splice(i, 1);
				return true;
			}
			return false;
		}
		function findBinding(el) {
			for (var i = 0; i < bindings.length; ++i) if (bindings[i].el === el) return bindings[i];
		}
		function getBinding(el) {
			var binding = findBinding(el);
			if (binding) return binding;
			bindings.push(binding = {
				el,
				binding: {}
			});
			return binding;
		}
		function handleClick(e) {
			var ctx = getBinding(this).binding;
			if (!ctx.value) return;
			e.preventDefault();
			if (typeof ctx.value === "string") return _scroller(ctx.value);
			_scroller(ctx.value.el || ctx.value.element, ctx.value);
		}
		var directiveHooks = {
			bind: function bind(el, binding) {
				getBinding(el).binding = binding;
				_.on(el, "click", handleClick);
			},
			unbind: function unbind(el) {
				deleteBinding(el);
				_.off(el, "click", handleClick);
			},
			update: function update(el, binding) {
				getBinding(el).binding = binding;
			}
		};
		var VueScrollTo = {
			bind: directiveHooks.bind,
			unbind: directiveHooks.unbind,
			update: directiveHooks.update,
			beforeMount: directiveHooks.bind,
			unmounted: directiveHooks.unbind,
			updated: directiveHooks.update,
			scrollTo: _scroller,
			bindings
		};
		var install = function install(Vue, options) {
			if (options) setDefaults(options);
			Vue.directive("scroll-to", VueScrollTo);
			var properties = Vue.config.globalProperties || Vue.prototype;
			properties.$scrollTo = VueScrollTo.scrollTo;
		};
		if (typeof window !== "undefined" && window.Vue) {
			window.VueScrollTo = VueScrollTo;
			window.VueScrollTo.setDefaults = setDefaults;
			window.VueScrollTo.scroller = scroller;
			if (window.Vue.use) window.Vue.use(install);
		}
		VueScrollTo.install = install;
		return VueScrollTo;
	}));
})))();
var FORM_GET_URL = "/wp-json/inertia/v1/get-form";
var _sfc_main$1 = {
	__name: "GForm",
	__ssrInlineRender: true,
	props: { id: {
		type: [Number, String],
		required: true
	} },
	setup(__props) {
		const loadFieldComponent = (name) => (0, vue_exports.defineAsyncComponent)(() => _rolldown_dynamic_import_helper_default(/* @__PURE__ */ Object.assign({
			"./Fields/Consent.vue": () => import("./Consent-Y1wczX09.js"),
			"./Fields/Date.vue": () => import("./Date-Dd1JTdDJ.js"),
			"./Fields/File.vue": () => import("./File-C6QvEKFM.js"),
			"./Fields/Html.vue": () => import("./Html-DQuGa8Mg.js"),
			"./Fields/Input.vue": () => import("./Input-DaupZ1jj.js"),
			"./Fields/MultiChoice.vue": () => import("./MultiChoice-Co5XDA6R.js"),
			"./Fields/Phone.vue": () => import("./Phone-CiQTQhFZ.js"),
			"./Fields/Radio.vue": () => import("./Radio-CmZPr0tQ.js"),
			"./Fields/Select.vue": () => import("./Select-BtMtGA_3.js"),
			"./Fields/Textarea.vue": () => import("./Textarea-3fgZM0hF.js")
		}), `./Fields/${name}.vue`, 3));
		const fieldComponents = {
			consent: loadFieldComponent("Consent"),
			date: loadFieldComponent("Date"),
			fileupload: loadFieldComponent("File"),
			html: loadFieldComponent("Html"),
			input: loadFieldComponent("Input"),
			multi_choice: loadFieldComponent("MultiChoice"),
			phone: loadFieldComponent("Phone"),
			radio: loadFieldComponent("Radio"),
			select: loadFieldComponent("Select"),
			textarea: loadFieldComponent("Textarea")
		};
		const props = __props;
		const isLoading = (0, vue_exports.ref)(true);
		const isSubmitting = (0, vue_exports.ref)(false);
		const isSubmitted = (0, vue_exports.ref)(false);
		const hasStartedLoading = (0, vue_exports.ref)(false);
		const errorData = (0, vue_exports.ref)({ validation_messages: {} });
		const form = (0, vue_exports.ref)({});
		const gForm = (0, vue_exports.ref)();
		const { locale } = useI18n();
		const formData = (0, vue_exports.ref)(null);
		let formObserver = null;
		let detachInteractionPrefetch = null;
		`${props.id}`;
		const VALIDATION_ERRORS = { validation_messages: {} };
		const parseJsonResponse = async (response) => {
			if (!(response.headers.get("content-type") || "").includes("application/json")) return null;
			try {
				const text = await response.text();
				if (!text.trim()) return null;
				return JSON.parse(text);
			} catch (error) {
				console.error("Failed to parse JSON response.", error);
				return null;
			}
		};
		const fetchJson = async (url, options = {}) => {
			const response = await fetch(url, {
				...options,
				headers: {
					Accept: "application/json",
					...options.headers || {}
				}
			});
			const data = await parseJsonResponse(response);
			if (!response.ok) {
				const requestError = /* @__PURE__ */ new Error(`Request failed with status ${response.status}`);
				requestError.response = {
					status: response.status,
					data
				};
				throw requestError;
			}
			return data;
		};
		const getDocumentLang = () => {
			if (typeof document === "undefined") return null;
			return document.documentElement.lang || null;
		};
		const visibleFields = (0, vue_exports.computed)(() => Array.isArray(formData.value?.fields) ? formData.value.fields.filter((field) => field?.visibility === "visible") : []);
		const getConsentInputKey = (field) => {
			const consentInput = Array.isArray(field?.inputs) ? field.inputs.find((input) => String(input?.id) === `${field.id}.1`) : null;
			return consentInput?.id ? `input_${consentInput.id}` : null;
		};
		const normalizeField = (field) => {
			if (field?.type !== "consent") return field;
			const consentKey = getConsentInputKey(field);
			return consentKey ? {
				...field,
				key: consentKey
			} : field;
		};
		const normalizeFormData = (data) => {
			if (!Array.isArray(data?.fields)) return data;
			return {
				...data,
				fields: data.fields.map(normalizeField)
			};
		};
		const getInitialFieldValue = (field) => {
			const defaultValue = field?.defaultValue ?? field?.default_value;
			switch (field?.type) {
				case "multi_choice":
					if (Array.isArray(defaultValue)) return defaultValue;
					return defaultValue ? [defaultValue] : [];
				case "fileupload": return defaultValue ?? null;
				case "consent": return defaultValue === 1 || defaultValue === "1" || defaultValue === true ? 1 : "";
				default: return defaultValue ?? "";
			}
		};
		const buildInitialFormState = (fields = [], currentState = {}) => fields.reduce((state, field) => {
			if (!field?.key || state[field.key] !== void 0) return state;
			state[field.key] = getInitialFieldValue(field);
			return state;
		}, { ...currentState });
		const fetchFormData = async () => {
			isLoading.value = true;
			try {
				const query = new URLSearchParams({ id: String(props.id) });
				const lang = getDocumentLang();
				if (lang) query.set("lang", lang);
				const [response] = await Promise.all([fetchJson(`${FORM_GET_URL}?${query.toString()}`), ensurePrimeVue()]);
				formData.value = normalizeFormData(response);
				form.value = buildInitialFormState(formData.value?.fields, form.value);
				errorData.value = { ...VALIDATION_ERRORS };
			} catch (error) {
				console.error("Error fetching form data:", error);
				formData.value = null;
			} finally {
				isLoading.value = false;
			}
		};
		const disconnectFormObserver = () => {
			formObserver?.disconnect();
			formObserver = null;
		};
		const disconnectInteractionPrefetch = () => {
			detachInteractionPrefetch?.();
			detachInteractionPrefetch = null;
		};
		const startFormLoad = () => {
			if (hasStartedLoading.value) return;
			hasStartedLoading.value = true;
			disconnectFormObserver();
			disconnectInteractionPrefetch();
			fetchFormData();
		};
		const attachInteractionPrefetch = () => {
			if (typeof window === "undefined" || detachInteractionPrefetch) return;
			const startOnInteraction = () => {
				startFormLoad();
			};
			const events = [
				"scroll",
				"wheel",
				"touchmove"
			];
			events.forEach((eventName) => {
				window.addEventListener(eventName, startOnInteraction, {
					once: true,
					passive: true
				});
			});
			detachInteractionPrefetch = () => {
				events.forEach((eventName) => {
					window.removeEventListener(eventName, startOnInteraction);
				});
			};
		};
		const isNearViewport = () => {
			if (typeof window === "undefined" || !gForm.value?.getBoundingClientRect) return true;
			return gForm.value.getBoundingClientRect().top <= window.innerHeight + 320;
		};
		(0, vue_exports.onMounted)(() => {
			if (typeof window === "undefined" || !gForm.value || isNearViewport()) {
				startFormLoad();
				return;
			}
			attachInteractionPrefetch();
			if (!("IntersectionObserver" in window)) return;
			formObserver = new IntersectionObserver((entries) => {
				if (entries.some((entry) => entry.isIntersecting)) startFormLoad();
			}, { rootMargin: "320px 0px" });
			formObserver.observe(gForm.value);
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			disconnectFormObserver();
			disconnectInteractionPrefetch();
		});
		const getFieldComponent = (type) => fieldComponents[type] || fieldComponents.input;
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ name: "fade" }, _attrs))}><div>`);
			if (!hasStartedLoading.value) _push(`<div class="min-h-56 md:min-h-72" aria-hidden="true"></div>`);
			else _push(`<!---->`);
			_push(`<div class="spinner-loader" role="status" style="${(0, server_renderer_exports.ssrRenderStyle)(hasStartedLoading.value && isLoading.value ? null : { display: "none" })}"><span class="visually-hidden">${(0, server_renderer_exports.ssrInterpolate)(_ctx.$t("form.loading"))}</span></div>`);
			if (hasStartedLoading.value && isSubmitted.value) _push(`<div id="confirmation" class="wpcf7-response-output success-submit">${_ctx.$t("form.success") ?? ""}</div>`);
			else _push(`<!---->`);
			if (hasStartedLoading.value && !isLoading.value && !isSubmitted.value) {
				_push(`<form class="${(0, server_renderer_exports.ssrRenderClass)([{ disabled: isSubmitting.value }, "grid grid-cols-1 gap-4 font-normal md:grid-cols-2"])}"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(visibleFields.value, (item) => {
					(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(getFieldComponent(item.type)), {
						modelValue: form.value[item.key],
						"onUpdate:modelValue": ($event) => form.value[item.key] = $event,
						form: form.value,
						field: item,
						error: errorData.value.validation_messages[item.id],
						requiredIndicator: formData.value?.requiredIndicator
					}, null), _parent);
				});
				_push(`<!--]-->`);
				if (formData.value?.button) {
					_push(`<div class="mt-8 flex md:col-span-2">`);
					if (!isSubmitted.value) _push(`<button${(0, server_renderer_exports.ssrIncludeBooleanAttr)(isSubmitting.value) ? " disabled" : ""} type="submit" class="${(0, server_renderer_exports.ssrRenderClass)([{ "disabled loading": isSubmitting.value }, "btn-primary-dark"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", _ctx.$t("form.send"))}><span>${(0, server_renderer_exports.ssrInterpolate)(_ctx.$t("form.send"))}</span></button>`);
					else _push(`<!---->`);
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`</form>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Form/GForm.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
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
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, { id: 1 }, null, _parent));
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
