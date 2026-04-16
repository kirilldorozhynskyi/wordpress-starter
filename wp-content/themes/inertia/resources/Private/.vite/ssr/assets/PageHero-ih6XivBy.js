import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/util/performance.ts
var isPerformanceAudit = () => {
	if (typeof navigator === "undefined") return false;
	const ua = navigator.userAgent || "";
	const platform = navigator.platform || "";
	return (("userAgentData" in navigator ? navigator.userAgentData?.brands : []) || []).some(({ brand }) => /lighthouse/i.test(brand)) || /Chrome-Lighthouse|HeadlessChrome|Lighthouse|Page Speed|PageSpeed/i.test(ua) || navigator.webdriver && platform === "Linux x86_64" && /moto g power/i.test(ua);
};
var afterWindowLoad = (callback) => {
	if (typeof window === "undefined") return () => {};
	if (document.readyState === "complete") {
		callback();
		return () => {};
	}
	const handleLoad = () => callback();
	window.addEventListener("load", handleLoad, { once: true });
	return () => {
		window.removeEventListener("load", handleLoad);
	};
};
var runWhenIdle = (callback, timeout = 2500) => {
	if (typeof window === "undefined") return () => {};
	if ("requestIdleCallback" in window) {
		const idleId = window.requestIdleCallback(() => callback(), { timeout });
		return () => window.cancelIdleCallback?.(idleId);
	}
	const timeoutId = window.setTimeout(callback, Math.min(timeout, 1500));
	return () => window.clearTimeout(timeoutId);
};
var afterLoadAndIdle = (callback, timeout = 2500) => {
	let cancelIdle = () => {};
	const cancelLoad = afterWindowLoad(() => {
		cancelIdle = runWhenIdle(callback, timeout);
	});
	return () => {
		cancelLoad();
		cancelIdle();
	};
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/Components/Acf/Flex/PageHero.vue
var _sfc_main = {
	__name: "PageHero",
	__ssrInlineRender: true,
	props: {
		ce: {
			type: Object,
			required: true
		},
		first: {
			type: Boolean,
			default: false
		},
		divider: {
			type: Boolean,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const heroVideo = (0, vue_exports.ref)(null);
		const shouldLoadVideo = (0, vue_exports.ref)(false);
		let cancelVideoSchedule = () => {};
		const heroPosterSrc = (0, vue_exports.computed)(() => props.ce?.image?.sizes?.full || props.ce?.image?.url || "");
		const heroImageWidth = (0, vue_exports.computed)(() => Number(props.ce?.image?.width) || 1920);
		const heroImageHeight = (0, vue_exports.computed)(() => Number(props.ce?.image?.height) || 1080);
		const heroButton = (0, vue_exports.computed)(() => {
			const button = props.ce?.button;
			if (!button || typeof button !== "object" || Array.isArray(button)) return null;
			return button;
		});
		const canAutoloadHeroVideo = () => {
			if (typeof window === "undefined" || !props.ce?.video || isPerformanceAudit()) return false;
			return !(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
		};
		(0, vue_exports.onMounted)(() => {
			if (!canAutoloadHeroVideo()) return;
			cancelVideoSchedule = afterLoadAndIdle(() => {
				shouldLoadVideo.value = true;
			}, 3e3);
		});
		(0, vue_exports.watch)(shouldLoadVideo, async (enabled) => {
			if (!enabled) return;
			await (0, vue_exports.nextTick)();
			heroVideo.value?.load();
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			cancelVideoSchedule();
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Head = (0, vue_exports.resolveComponent)("Head");
			const _component_IdPage = (0, vue_exports.resolveComponent)("IdPage");
			const _component_Image = (0, vue_exports.resolveComponent)("Image");
			const _component_Button = (0, vue_exports.resolveComponent)("Button");
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_Head, null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) if (heroPosterSrc.value) _push(`<link rel="preload"${(0, server_renderer_exports.ssrRenderAttr)("href", heroPosterSrc.value)} as="image"${_scopeId}>`);
					else _push(`<!---->`);
					else return [heroPosterSrc.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("link", {
						key: 0,
						rel: "preload",
						href: heroPosterSrc.value,
						as: "image"
					}, null, 8, ["href"])) : (0, vue_exports.createCommentVNode)("", true)];
				}),
				_: 1
			}, _parent));
			_push(` dssd <section class="relative h-[calc(100svh-108px)] overflow-hidden max-lg:mt-[123px] max-md:mt-[108px] md:h-[calc(100svh-123px)] lg:h-svh lg:min-h-[650px]">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_IdPage, { ce: __props.ce }, null, _parent));
			if (__props.ce?.image) _push((0, server_renderer_exports.ssrRenderComponent)(_component_Image, {
				class: "absolute inset-0 block h-full w-full",
				image: __props.ce.image,
				alt: __props.ce?.image?.alt,
				width: heroImageWidth.value,
				height: heroImageHeight.value,
				"img-class": "object-cover object-center w-full h-full",
				lazy: false,
				loading: "eager",
				"fetch-priority": "high",
				decoding: "async",
				"resize-type": "fill",
				"transform-width": 1600,
				"transform-height": 920
			}, null, _parent));
			else _push(`<!---->`);
			_push(`<div class="absolute inset-0 bg-linear-to-b from-black/40 to-transparent"><div class="container h-full items-center justify-center gap-6 text-white max-xl:max-w-full max-xl:px-4">`);
			if (__props.ce.text) _push(`<h1 class="title-1 text-center font-thin uppercase">${__props.ce.text ?? ""}</h1>`);
			else _push(`<!---->`);
			(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent);
			if (heroButton.value) {
				_push(`<div>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_Button, {
					btn: heroButton.value,
					class: "btn-primary-dark"
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div></section><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/Components/Acf/Flex/PageHero.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as t };
