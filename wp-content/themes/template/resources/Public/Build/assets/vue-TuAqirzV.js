import{r as a,i as d,N as u,e as E,c as g,a as h,E as f}from"./@vue-1lttQfaj.js";/**
* vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const l=new WeakMap;function C(e){let n=l.get(e??f);return n||(n=Object.create(null),l.set(e??f,n)),n}function T(e,n){if(!d(e))if(e.nodeType)e=e.innerHTML;else return u;const o=e,t=C(n),i=t[o];if(i)return i;if(e[0]==="#"){const c=document.querySelector(e);e=c?c.innerHTML:""}const r=E({hoistStatic:!0,onError:void 0,onWarn:u},n);!r.isCustomElement&&typeof customElements<"u"&&(r.isCustomElement=c=>!!customElements.get(c));const{code:m}=g(e,r),s=new Function("Vue",m)(h);return s._rc=!0,t[o]=s}a(T);
