import{aa as l,i as m,N as u,ab as E,ac as g,ad as h,ae as a}from"./@vue-CmjbQV9c.js";/**
* vue v3.4.29
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/const f=new WeakMap;function C(e){let n=f.get(e??a);return n||(n=Object.create(null),f.set(e??a,n)),n}function T(e,n){if(!m(e))if(e.nodeType)e=e.innerHTML;else return u;const o=e,t=C(n),i=t[o];if(i)return i;if(e[0]==="#"){const c=document.querySelector(e);e=c?c.innerHTML:""}const r=E({hoistStatic:!0,onError:void 0,onWarn:u},n);!r.isCustomElement&&typeof customElements<"u"&&(r.isCustomElement=c=>!!customElements.get(c));const{code:d}=g(e,r),s=new Function("Vue",d)(h);return s._rc=!0,t[o]=s}l(T);
