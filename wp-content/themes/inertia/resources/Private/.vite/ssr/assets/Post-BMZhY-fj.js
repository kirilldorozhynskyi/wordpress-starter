import { t as vue_exports } from "./vue-Cqm1d2TX.js";
import { n as head_default } from "./dist-C9WztoGj.js";
import { t as server_renderer_exports } from "./server-renderer-BcpEk759.js";
//#region wp-content/themes/inertia/resources/Private/js/pages/Post.vue
var _sfc_main = {
	__name: "Post",
	__ssrInlineRender: true,
	props: { post: {
		type: Object,
		default: () => ({})
	} },
	setup(__props) {
		const props = __props;
		const publishedDate = (0, vue_exports.computed)(() => {
			return new Date(props.post.createdAt).toLocaleString(void 0, {
				dateStyle: "long",
				timeStyle: "medium"
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), { title: __props.post.title }, null, _parent));
			_push(`<main class="flex-centre"><h1>${(0, server_renderer_exports.ssrInterpolate)(__props.post.title)}</h1>`);
			if (__props.post.featuredImage) _push(`<img id="featured-image"${(0, server_renderer_exports.ssrRenderAttr)("src", __props.post.featuredImage.sizes.full.url)}${(0, server_renderer_exports.ssrRenderAttr)("alt", __props.post.featuredImage.metadata?.alt || __props.post.title)}>`);
			else _push(`<!---->`);
			_push(`<div>${__props.post.content ?? ""}</div><div>Written by ${(0, server_renderer_exports.ssrInterpolate)(__props.post.author.name)} on ${(0, server_renderer_exports.ssrInterpolate)(publishedDate.value)}</div></main><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/pages/Post.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
export { _sfc_main as default };
