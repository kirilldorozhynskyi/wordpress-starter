import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/Components/Utils/ImageWP.vue
var _sfc_main = {
	__name: "ImageWP",
	__ssrInlineRender: true,
	props: {
		image: {
			type: [Object, Boolean],
			required: true,
			default: false
		},
		alt: {
			type: String,
			default: ""
		},
		width: {
			type: Number,
			default: null
		},
		height: {
			type: Number,
			default: null
		},
		size: {
			type: String,
			default: null
		},
		size_retina: {
			type: String,
			default: null
		},
		imgClass: {
			type: String,
			default: ""
		},
		lazy: {
			type: Boolean,
			default: true
		},
		loading: {
			type: String,
			default: null
		},
		fetchPriority: {
			type: String,
			default: null
		},
		decoding: {
			type: String,
			default: "async"
		},
		media: {
			type: Object,
			default: () => ({})
		}
	},
	setup(__props) {
		const lazyLoad = (0, vue_exports.inject)("lazyLoad");
		const props = __props;
		const hasImage = (0, vue_exports.computed)(() => Boolean(props.image && !Array.isArray(props.image) && typeof props.image === "object"));
		const shouldLazyLoad = (0, vue_exports.computed)(() => props.lazy !== false);
		const loadingAttr = (0, vue_exports.computed)(() => props.loading || (shouldLazyLoad.value ? "lazy" : "eager"));
		const resolvedAlt = (0, vue_exports.computed)(() => props.alt || props.image?.alt || props.image?.metadata?.alt || "");
		const resolvedWidth = (0, vue_exports.computed)(() => Number(props.width ?? props.image?.width) || void 0);
		const resolvedHeight = (0, vue_exports.computed)(() => Number(props.height ?? props.image?.height) || void 0);
		const resolvedSrc = (0, vue_exports.computed)(() => {
			const img = hasImage.value ? props.image : null;
			if (!img) return "";
			const sizes = img.sizes || {};
			return props.size && sizes[props.size] || img.url || "";
		});
		const svgPlaceholder = (0, vue_exports.computed)(() => {
			const width = resolvedWidth.value || 1;
			const height = resolvedHeight.value || 1;
			return [
				`data:image/svg+xml,%3Csvg height='${height}' viewBox='0 0 ${width} ${height}'`,
				` width='${width}' xmlns='http://www.w3.org/2000/svg'%3E`,
				`%3Cpath fill='none' d='M0 0h${width}v${height}H0z'/%3E%3C/svg%3E`
			].join("");
		});
		const placeholderSrc = (0, vue_exports.computed)(() => {
			if (!shouldLazyLoad.value) return resolvedSrc.value || svgPlaceholder.value;
			return svgPlaceholder.value;
		});
		const jpegSrcset = (0, vue_exports.computed)(() => {
			const img = hasImage.value ? props.image : null;
			if (!img) return "";
			const sizes = img.sizes || {};
			const sizeKey = props.size;
			const retinaKey = props.size_retina || (sizeKey ? `${sizeKey}2x` : void 0);
			const oneX = sizeKey && sizes[sizeKey] ? sizes[sizeKey] : img.url || "";
			const twoX = retinaKey && sizes[retinaKey] ? sizes[retinaKey] : oneX;
			return oneX ? `${oneX} 1x, ${twoX} 2x` : "";
		});
		const parsedMedia = (0, vue_exports.computed)(() => {
			if (!props.media || typeof props.media !== "object") return null;
			const sizes = (hasImage.value ? props.image : null)?.sizes || {};
			return Object.keys(props.media).reduce((acc, breakpoint) => {
				const size = props.media[breakpoint];
				if (size?.size && sizes[size.size]) {
					const retinaCandidateKey = size.size_retina || `${size.size}2x`;
					acc[breakpoint] = {
						size: sizes[size.size],
						size_retina: retinaCandidateKey && sizes[retinaCandidateKey] ? sizes[retinaCandidateKey] : sizes[size.size]
					};
				}
				return acc;
			}, {});
		});
		const hasResponsiveSources = (0, vue_exports.computed)(() => Boolean(parsedMedia.value && Object.keys(parsedMedia.value).length));
		const getSrcset = (size, retinaSize) => {
			if (!size) return "";
			return `${size} 1x, ${retinaSize ?? size} 2x`;
		};
		const updateLazyLoad = () => {
			if (shouldLazyLoad.value) lazyLoad?.update();
		};
		(0, vue_exports.onMounted)(() => {
			updateLazyLoad();
		});
		(0, vue_exports.watch)([
			resolvedSrc,
			jpegSrcset,
			hasResponsiveSources,
			() => props.lazy
		], async () => {
			await (0, vue_exports.nextTick)();
			updateLazyLoad();
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (hasImage.value) {
				_push(`<picture${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "picture bg-green-400" }, _attrs))}>`);
				if (hasResponsiveSources.value) {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(parsedMedia.value, (size, breakpoint) => {
						_push(`<source${(0, server_renderer_exports.ssrRenderAttr)("media", `(max-width: ${breakpoint}px)`)}${(0, server_renderer_exports.ssrRenderAttr)("srcset", getSrcset(size.size, size.size_retina))}>`);
					});
					_push(`<!--]-->`);
				} else _push(`<!---->`);
				_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", placeholderSrc.value)} class="${(0, server_renderer_exports.ssrRenderClass)(__props.imgClass)}"${(0, server_renderer_exports.ssrRenderAttr)("loading", loadingAttr.value)}${(0, server_renderer_exports.ssrRenderAttr)("fetchpriority", __props.fetchPriority)}${(0, server_renderer_exports.ssrRenderAttr)("decoding", __props.decoding)}${(0, server_renderer_exports.ssrRenderAttr)("data-src", shouldLazyLoad.value ? resolvedSrc.value : null)}${(0, server_renderer_exports.ssrRenderAttr)("data-srcset", shouldLazyLoad.value ? jpegSrcset.value : null)}${(0, server_renderer_exports.ssrRenderAttr)("srcset", shouldLazyLoad.value ? null : jpegSrcset.value || null)}${(0, server_renderer_exports.ssrRenderAttr)("width", resolvedWidth.value)}${(0, server_renderer_exports.ssrRenderAttr)("height", resolvedHeight.value)}${(0, server_renderer_exports.ssrRenderAttr)("alt", resolvedAlt.value)}${(0, server_renderer_exports.ssrRenderAttr)("lazy", shouldLazyLoad.value ? "" : null)}></picture>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/Components/Utils/ImageWP.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
