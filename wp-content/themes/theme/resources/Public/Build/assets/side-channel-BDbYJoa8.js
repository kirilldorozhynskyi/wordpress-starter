import{g as c}from"./get-intrinsic-BKEvijrG.js";import{c as l}from"./call-bind-Bt3bzbWQ.js";import{o as m}from"./object-inspect-UJRbYJRM.js";import{t as M}from"./es-errors-DzOT6E3C.js";var v=c,o=l,$=m,x=M,i=v("%WeakMap%",!0),p=v("%Map%",!0),d=o("WeakMap.prototype.get",!0),h=o("WeakMap.prototype.set",!0),w=o("WeakMap.prototype.has",!0),g=o("Map.prototype.get",!0),G=o("Map.prototype.set",!0),S=o("Map.prototype.has",!0),u=function(a,n){for(var r=a,e;(e=r.next)!==null;r=e)if(e.key===n)return r.next=e.next,e.next=a.next,a.next=e,e},W=function(a,n){var r=u(a,n);return r&&r.value},H=function(a,n,r){var e=u(a,n);e?e.value=r:a.next={key:n,next:a.next,value:r}},I=function(a,n){return!!u(a,n)},E=function(){var n,r,e,s={assert:function(t){if(!s.has(t))throw new x("Side channel does not contain "+$(t))},get:function(t){if(i&&t&&(typeof t=="object"||typeof t=="function")){if(n)return d(n,t)}else if(p){if(r)return g(r,t)}else if(e)return W(e,t)},has:function(t){if(i&&t&&(typeof t=="object"||typeof t=="function")){if(n)return w(n,t)}else if(p){if(r)return S(r,t)}else if(e)return I(e,t);return!1},set:function(t,f){i&&t&&(typeof t=="object"||typeof t=="function")?(n||(n=new i),h(n,t,f)):p?(r||(r=new p),G(r,t,f)):(e||(e={key:{},next:null}),H(e,t,f))}};return s};export{E as s};
