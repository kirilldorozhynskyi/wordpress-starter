import{j as v,e as n,o as j,n as l,t as $,p as d,q as h,F as y,u as x,v as b}from"./@vue-Bb_NxA0R.js";const _={key:0,class:"picture"},B=["media","srcset"],S=["media","srcset"],A=["srcset"],C=["srcset"],N=["data-srcset","width","height","alt"],P="/wp-json/jdev/get-image/",M={__name:"Image",props:{image:{type:[Object,Boolean],required:!0,default:!1},alt:{type:String},width:{type:Number},height:{type:Number},imgClass:{type:String},media:{type:Object,default:()=>({})}},setup(i){const c=v("lazyLoad"),t=i,r=n(()=>`${P}${t.image.filename}/?id=${t.image.id}`),o=n(()=>{const a=[];return t.width&&a.push(`w=${t.width}`),t.height&&a.push(`h=${t.height}`),a.join("&")}),m=n(()=>{const a=[];let s=t.width?t.width*2:null,e=t.height?t.height*2:null;return s&&s>2560&&(e=t.height?Math.round(2560/t.width*t.height):null,s=2560),s&&a.push(`w=${s}`),e&&a.push(`h=${e}`),a.join("&")}),f=n(()=>`${r.value}&${o.value}&webp=true 1x, ${r.value}&${m.value}&webp=true 2x`),g=n(()=>`${r.value}&${o.value} 1x, ${r.value}&${m.value} 2x`),p=n(()=>!t.media||typeof t.media!="object"?null:Object.keys(t.media).reduce((a,s)=>{const e=t.media[s];return e!=null&&e.width&&(e!=null&&e.height)&&(a[s]=e),a},{})),w=(a,s,e)=>{const u=[`w=${a}`,`h=${s}`];return e&&u.push("webp=true"),`${r.value}&${u.join("&")} 1x, ${r.value}&w=${a*2}&h=${s*2}&${e?"webp=true":""} 2x`};return j(()=>{c==null||c.update()}),(a,s)=>i.image&&!Array.isArray(i.image)?(d(),l("picture",_,[p.value?(d(!0),l(y,{key:0},x(p.value,(e,u)=>(d(),l(y,{key:u},[h("source",{media:`(max-width: ${u}px)`,srcset:w(e.width,e.height,!0),type:"image/webp"},null,8,B),h("source",{media:`(max-width: ${u}px)`,srcset:w(e.width,e.height,!1),type:"image/jpeg"},null,8,S)],64))),128)):$("",!0),h("source",{srcset:f.value,type:"image/webp"},null,8,A),h("source",{srcset:g.value,type:"image/jpeg"},null,8,C),h("img",{class:b(i.imgClass),lazy:"","data-srcset":g.value,width:i.width,height:i.height,alt:i.alt},null,10,N)])):$("",!0)}};export{M as default};
