function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/CustomScript-3AswJAW7.js","assets/postscribe-xOrHPg2m.js","assets/@popperjs-NtRVqJeX.js","assets/vue-TuAqirzV.js","assets/@vue-1lttQfaj.js","assets/aos-pc3J11IJ.js","assets/lodash.throttle-D6-4U_1b.js","assets/lodash.debounce-qMaUl166.js","assets/dom-slider-_ojymFDI.js","assets/lodash-ScgP-jpX.js","assets/vanilla-lazyload-12OIww4J.js","assets/vue-scrollto-DAbD7NhE.js","assets/vue3-i18n-R1xQAJpo.js","assets/bootstrap-ujtJ-9R9.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
import{a as h}from"./aos-pc3J11IJ.js";import"./dom-slider-_ojymFDI.js";import"./lodash-ScgP-jpX.js";import{L as w}from"./vanilla-lazyload-12OIww4J.js";import"./vue-TuAqirzV.js";import{V as g}from"./vue-scrollto-DAbD7NhE.js";import{o as v}from"./vue3-i18n-R1xQAJpo.js";import{D as y}from"./bootstrap-ujtJ-9R9.js";import{d as L,b as p,o as S,f as b,g as E,n as _,h as k,j as O,k as A}from"./@vue-1lttQfaj.js";import"./lodash.throttle-D6-4U_1b.js";import"./@popperjs-NtRVqJeX.js";import"./lodash.debounce-qMaUl166.js";const T="modulepreload",N=function(e){return"/wp-content/themes/template/resources/Public/Build/"+e},m={},P=function(r,t,n){let i=Promise.resolve();if(t&&t.length>0){const l=document.getElementsByTagName("link");i=Promise.all(t.map(o=>{if(o=N(o),o in m)return;m[o]=!0;const s=o.endsWith(".css"),a=s?'[rel="stylesheet"]':"";if(!!n)for(let c=l.length-1;c>=0;c--){const f=l[c];if(f.href===o&&(!s||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${a}`))return;const d=document.createElement("link");if(d.rel=s?"stylesheet":T,s||(d.as="script",d.crossOrigin=""),d.href=o,document.head.appendChild(d),s)return new Promise((c,f)=>{d.addEventListener("load",c),d.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${o}`)))})}))}return i.then(()=>r()).catch(l=>{const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=l,window.dispatchEvent(o),!o.defaultPrevented)throw l})},q={en:{cookies:{button:{accept:"Accept",close:"Close"},info:{disabled:"Please enable cookies to view this content"}}}};v({locale:"en",messages:q});const C=50,z=L({data(){return{isSearchOpened:!1}},setup(){let e=p(!1),r=window.pageYOffset;const t=p();window.addEventListener("scroll",()=>{window.pageYOffset>=0&&Math.abs(window.pageYOffset-r)>=C&&(e.value=window.pageYOffset>=r,r=window.pageYOffset)});function n(){let o=document.querySelector(".mobile-nav");if(o)if(document.body.classList.toggle("mobile-nav-opened"),document.body.classList.contains("mobile-nav-opened")){const s=[];Array.from(o.querySelectorAll("a.active")).forEach(a=>{const u=a.parentElement;u&&u.classList.contains("sub")&&s.push(u)}),s.forEach(a=>{a.classList.add("js-opened"),window.domSlider.slideDown({element:a.querySelector("nav")})})}else Array.from(o.querySelectorAll(".js-opened")).forEach(s=>{s.classList.remove("js-opened"),window.domSlider.slideUp({element:s.querySelector("nav")})})}function i(o){const a=o.target.parentElement;a!=null&&a.classList.contains("sub")&&(o.preventDefault(),a.classList.toggle("js-opened"),window.domSlider.slideToggle({element:a.querySelector("nav")}))}function l(){let o=document.querySelector(".header-search");if(o){o.classList.add("opened");let s=document.querySelector(".header-search-input");s&&s.setAttribute("autofocus","autofocus")}}return S(()=>{let o=t.value?Array.from(t.value.querySelectorAll('[data-bs-toggle="dropdown"]')):[];o.length&&o.map(s=>new y(s))}),{isHidden:e,toggleMobileNav:n,toggleSubNav:i,showSearch:l,root:t}}}),H=(e,r)=>{const t=e.__vccOpts||e;for(const[n,i]of r)t[n]=i;return t};function j(e,r,t,n,i,l){return k(),b("header",{ref:"root",class:_({"header--hidden":e.isHidden})},[E(e.$slots,"default",{isSearchOpen:e.isSearchOpened,toggleMobileNav:e.toggleMobileNav,toggleSubNav:e.toggleSubNav,showSearch:e.showSearch})],2)}const D=H(z,[["render",j]]),R=A(()=>P(()=>import("./CustomScript-3AswJAW7.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]))),$=[".ajax",".download","#scroll-to-top","[download]","[href^=\\#]","[href*=ajax]","[href^=javascript]","[href^=mailto]","[href^=tel]","[href*=tx_typoscriptrendering]","[target^=_blank]"],B=64,U=768,Y={components:{CustomScript:R,AjaxList,PageHeader:D},delimiters:["<%","%>"],directives:{"scroll-to":g},computed:{scrollOffset(){let e=-B;return this.header&&this.header.value&&(e-=this.header.value.offsetHeight),e}},provide(){return{lazyLoad:this.lazyLoad,scrollOffset:this.scrollOffset}},setup(){const e=p(null),r=new w({threshold:0,elements_selector:"[lazy]",class_loading:"lazy-loading",class_loaded:"lazy-loaded",class_applied:"lazy-bg-loaded",class_error:"lazy-error"});return{header:e,lazyLoad:r}},created(){window.addEventListener("load",this.onLoad),window.addEventListener("scroll",this.onScroll),window.addEventListener("beforeunload",this.beforeUnloadListener),this.createdHook()},mounted(){h.init({duration:900,once:!0,disable:window.innerWidth<U}),this.lazyLoad.update(),document.body.classList.add("loaded"),this.mountedHook()},methods:{createdHook(){},loadedHook(){},mountedHook(){},initUnload(){let e="a";$.forEach(r=>{e+=`:not(${r})`}),document.querySelectorAll(e).forEach(r=>{r.addEventListener("click",t=>{const n=t.currentTarget;return t.ctrlKey||t.shiftKey||t.metaKey||t.button===1||(n==null?void 0:n.pathname)===window.location.pathname?!0:(n==null?void 0:n.getAttribute("id"))==="history-back"?(t.preventDefault(),window.history.length>1&&window.history.back(),!1):(document.body.classList.remove("loaded"),!0)})})},onLoad(){document.body.classList.add("loaded"),this.initUnload(),this.loadedHook()},onScroll(){const e=document.querySelector(".page-return-top");e&&(window.scrollY>=200?e.classList.add("active"):e.classList.remove("active"))},scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}}};window.addEventListener("pagehide",e=>{e.persisted},!1);window.onpageshow=e=>{e.persisted&&window.location.reload()};const K=O(Y);K.mount("#page");export{H as _};
