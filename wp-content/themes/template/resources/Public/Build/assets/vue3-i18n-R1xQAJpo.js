import"./vue-TuAqirzV.js";import{b as u}from"./@vue-1lttQfaj.js";const f=Symbol("i18n"),c=(n,o,l)=>{const t=n[0];if(~t.indexOf("[")){const[r,a]=t.split("["),e=parseInt(a.replace("]",""));if(e>-1){if(!o[r]&&o[r].length>0&&o[r][e]&&o[r][e]!=="")throw new Error("Not Found");return n.length===1?typeof o[r][e]=="string"?o[r][e]:"":c(n.slice(1),o[r][e],l)}throw new Error(`Not Found: ${t}`)}if(o[n[0]]||o[n[0]]===""){if(n.length===1){let r=typeof o[n[0]]=="string"?o[n[0]]:"";return l&&(r=((a,e)=>{const p=/{(\w*)}/g;let s,i=a;for(;(s=p.exec(a))!==null;){if(!Object.prototype.hasOwnProperty.call(e,s[1]))throw new Error(`Not Found Params: ${s[1]}`);i=i.replace(s[0],e[s[1]])}return i})(r,l)),r}return c(n.slice(1),o[n[0]],l)}throw new Error("Not Found")},w=n=>{const o=u(n.locale||"en"),l=n.messages;return{messages:l,t:(t,r)=>{const a=l[o.value]||l.en;if(typeof t!="string")return"";try{return c(t.split("."),a,r)}catch{return""}},setLocale:t=>{l[t],o.value=t},getLocale:()=>o.value,install(t){const r=this;t.provide(f,r),t.config.globalProperties.$t=r.t,t.config.globalProperties.$i18n=r}}};export{w as o};