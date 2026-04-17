import { t as vue_exports } from "./vue-CfOZE8S3.js";
import { t as server_renderer_exports } from "./server-renderer-B656EAix.js";
//#region wp-content/themes/inertia/resources/Private/js/components/Utils/ImgCdn.vue
var _sfc_main = {
	__name: "ImgCdn",
	__ssrInlineRender: true,
	props: {
		image: {
			type: [
				Object,
				String,
				Boolean
			],
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
		},
		cdnBase: {
			type: String,
			default: "https://cdn.monjoli.eu"
		},
		size: {
			type: String,
			default: "full"
		},
		transform: {
			type: String,
			default: null
		},
		resizeType: {
			type: String,
			default: null
		},
		transformWidth: {
			type: Number,
			default: null
		},
		transformHeight: {
			type: Number,
			default: null
		},
		format: {
			type: String,
			default: "webp"
		},
		quality: {
			type: Number,
			default: 80
		},
		gravity: {
			type: String,
			default: null
		},
		dpr: {
			type: Number,
			default: null
		},
		retina: {
			type: Boolean,
			default: true
		},
		retinaDpr: {
			type: Number,
			default: 2
		}
	},
	setup(__props) {
		const lazyLoad = (0, vue_exports.inject)("lazyLoad");
		const props = __props;
		const hasImage = (0, vue_exports.computed)(() => Boolean(props.image));
		const isObjectImage = (0, vue_exports.computed)(() => Boolean(props.image && typeof props.image === "object" && !Array.isArray(props.image)));
		const shouldLazyLoad = (0, vue_exports.computed)(() => props.lazy !== false);
		const loadingAttr = (0, vue_exports.computed)(() => props.loading || (shouldLazyLoad.value ? "lazy" : "eager"));
		const normalizeBase = (base) => String(base || "").replace(/\/+$/, "");
		const getHostname = (url) => {
			try {
				return new URL(url).hostname;
			} catch {
				return "";
			}
		};
		const cdnHost = (0, vue_exports.computed)(() => getHostname(normalizeBase(props.cdnBase)));
		const isCdnUrl = (url) => {
			try {
				return new URL(url).hostname === cdnHost.value;
			} catch {
				return false;
			}
		};
		const getPathFromUrl = (url) => {
			try {
				return new URL(url).pathname.replace(/^\/+/, "");
			} catch {
				return "";
			}
		};
		const resolvedAlt = (0, vue_exports.computed)(() => {
			if (props.alt) return props.alt;
			if (isObjectImage.value) return props.image?.alt || props.image?.metadata?.alt || "";
			return "";
		});
		const resolvedWidth = (0, vue_exports.computed)(() => Number(props.width ?? (isObjectImage.value ? props.image?.width : null)) || void 0);
		const resolvedHeight = (0, vue_exports.computed)(() => Number(props.height ?? (isObjectImage.value ? props.image?.height : null)) || void 0);
		const rawSourceUrl = (0, vue_exports.computed)(() => {
			if (!hasImage.value) return "";
			if (typeof props.image === "string") return props.image;
			if (!isObjectImage.value) return "";
			const sizes = props.image?.sizes || {};
			if (props.size && sizes[props.size]) return sizes[props.size];
			return props.image?.url || "";
		});
		const buildTransform = ({ transform = null, resizeType = null, width = null, height = null, format = null, quality = null, gravity = null, dpr = null } = {}) => {
			if (transform) return transform;
			const parts = [];
			if (resizeType && (width || height)) parts.push(`${resizeType}:${width || 0}:${height || 0}`);
			if (gravity) parts.push(`g:${gravity}`);
			if (format) parts.push(`f:${format}`);
			if (quality) parts.push(`q:${quality}`);
			if (dpr) parts.push(`dpr:${dpr}`);
			return parts.join("/");
		};
		const mainTransform = (0, vue_exports.computed)(() => buildTransform({
			transform: props.transform,
			resizeType: props.resizeType,
			width: props.transformWidth || props.width,
			height: props.transformHeight || props.height,
			format: props.format,
			quality: props.quality,
			gravity: props.gravity,
			dpr: props.dpr
		}));
		const retinaTransform = (0, vue_exports.computed)(() => {
			if (!props.retina) return "";
			return buildTransform({
				transform: props.transform,
				resizeType: props.resizeType,
				width: props.transformWidth || props.width,
				height: props.transformHeight || props.height,
				format: props.format,
				quality: props.quality,
				gravity: props.gravity,
				dpr: props.retinaDpr
			});
		});
		const buildCdnUrl = (path, tr = "") => {
			const base = normalizeBase(props.cdnBase);
			const cleanPath = String(path || "").replace(/^\/+/, "");
			if (!base || !cleanPath) return "";
			if (!tr) return `${base}/${cleanPath}`;
			return `${base}/${cleanPath}?tr=${tr}`;
		};
		const resolvedSrc = (0, vue_exports.computed)(() => {
			const url = rawSourceUrl.value;
			if (!url) return "";
			if (!isCdnUrl(url)) return url;
			const path = getPathFromUrl(url);
			if (!path) return url;
			if (!mainTransform.value) return url;
			return buildCdnUrl(path, mainTransform.value);
		});
		const finalSrcset = (0, vue_exports.computed)(() => {
			const url = rawSourceUrl.value;
			if (!url) return "";
			if (!isCdnUrl(url)) return "";
			const path = getPathFromUrl(url);
			if (!path) return "";
			const oneX = mainTransform.value ? buildCdnUrl(path, mainTransform.value) : buildCdnUrl(path);
			if (!props.retina || !retinaTransform.value) return oneX ? `${oneX} 1x` : "";
			return `${oneX} 1x, ${buildCdnUrl(path, retinaTransform.value)} 2x`;
		});
		const parsedMedia = (0, vue_exports.computed)(() => {
			const url = rawSourceUrl.value;
			if (!url || !isCdnUrl(url)) return null;
			if (!props.media || typeof props.media !== "object") return null;
			const path = getPathFromUrl(url);
			if (!path) return null;
			return Object.entries(props.media).reduce((acc, [breakpoint, config]) => {
				const src1x = buildCdnUrl(path, buildTransform({
					transform: config.transform || null,
					resizeType: config.resizeType || props.resizeType,
					width: config.width || null,
					height: config.height || null,
					format: config.format || props.format,
					quality: config.quality || props.quality,
					gravity: config.gravity || props.gravity,
					dpr: config.dpr || props.dpr
				}));
				if (props.retina) acc[breakpoint] = {
					srcset: `${src1x} 1x, ${buildCdnUrl(path, buildTransform({
						transform: config.transform || null,
						resizeType: config.resizeType || props.resizeType,
						width: config.width || null,
						height: config.height || null,
						format: config.format || props.format,
						quality: config.quality || props.quality,
						gravity: config.gravity || props.gravity,
						dpr: config.retinaDpr || props.retinaDpr
					}))} 2x`,
					type: config.format ? `image/${config.format}` : null
				};
				else acc[breakpoint] = {
					srcset: `${src1x} 1x`,
					type: config.format ? `image/${config.format}` : null
				};
				return acc;
			}, {});
		});
		const hasResponsiveSources = (0, vue_exports.computed)(() => Boolean(parsedMedia.value && Object.keys(parsedMedia.value).length));
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
		const updateLazyLoad = () => {
			if (shouldLazyLoad.value) lazyLoad?.update();
		};
		(0, vue_exports.onMounted)(() => {
			updateLazyLoad();
		});
		(0, vue_exports.watch)([
			resolvedSrc,
			finalSrcset,
			hasResponsiveSources,
			() => props.lazy
		], async () => {
			await (0, vue_exports.nextTick)();
			updateLazyLoad();
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (hasImage.value) {
				_push(`<picture${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "picture" }, _attrs))}>`);
				if (hasResponsiveSources.value) {
					_push(`<!--[-->`);
					(0, server_renderer_exports.ssrRenderList)(parsedMedia.value, (source, breakpoint) => {
						_push(`<source${(0, server_renderer_exports.ssrRenderAttr)("media", `(max-width: ${breakpoint}px)`)}${(0, server_renderer_exports.ssrRenderAttr)("srcset", source.srcset)}${(0, server_renderer_exports.ssrRenderAttr)("type", source.type || null)}>`);
					});
					_push(`<!--]-->`);
				} else _push(`<!---->`);
				_push(`<img${(0, server_renderer_exports.ssrRenderAttr)("src", placeholderSrc.value)} class="${(0, server_renderer_exports.ssrRenderClass)(__props.imgClass)}"${(0, server_renderer_exports.ssrRenderAttr)("loading", loadingAttr.value)}${(0, server_renderer_exports.ssrRenderAttr)("fetchpriority", __props.fetchPriority)}${(0, server_renderer_exports.ssrRenderAttr)("decoding", __props.decoding)}${(0, server_renderer_exports.ssrRenderAttr)("data-src", shouldLazyLoad.value ? resolvedSrc.value : null)}${(0, server_renderer_exports.ssrRenderAttr)("data-srcset", shouldLazyLoad.value ? finalSrcset.value : null)}${(0, server_renderer_exports.ssrRenderAttr)("srcset", shouldLazyLoad.value ? null : finalSrcset.value || null)}${(0, server_renderer_exports.ssrRenderAttr)("width", resolvedWidth.value)}${(0, server_renderer_exports.ssrRenderAttr)("height", resolvedHeight.value)}${(0, server_renderer_exports.ssrRenderAttr)("alt", resolvedAlt.value)}${(0, server_renderer_exports.ssrRenderAttr)("lazy", shouldLazyLoad.value ? "" : null)}></picture>`);
			} else _push(`<!---->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/Utils/ImgCdn.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
