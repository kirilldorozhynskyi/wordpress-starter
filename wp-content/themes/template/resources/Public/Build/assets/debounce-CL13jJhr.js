import{g as x}from"./@popperjs-ZR8ENQL4.js";var a={exports:{}};function g(u,i=100,s={}){if(typeof u!="function")throw new TypeError(`Expected the first parameter to be a function, got \`${typeof u}\`.`);if(i<0)throw new RangeError("`wait` must not be negative.");const{immediate:l}=typeof s=="boolean"?{immediate:s}:s;let n,c,e,m,r;function d(){const t=n,f=c;return n=void 0,c=void 0,r=u.apply(t,f),r}function p(){const t=Date.now()-m;t<i&&t>=0?e=setTimeout(p,i-t):(e=void 0,l||(r=d()))}const o=function(...t){if(n&&this!==n)throw new Error("Debounced method called with different contexts.");n=this,c=t,m=Date.now();const f=l&&!e;return e||(e=setTimeout(p,i)),f&&(r=d()),r};return o.clear=()=>{e&&(clearTimeout(e),e=void 0)},o.flush=()=>{e&&o.trigger()},o.trigger=()=>{r=d(),o.clear()},o}a.exports.debounce=g;a.exports=g;var b=a.exports;const w=x(b);export{w as d};
