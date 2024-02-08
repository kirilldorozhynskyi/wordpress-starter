import{g as F,r as q,b as z,d as R,e as G,c as K,f as W,i as Y,h as j,j as U,k as Q,V as J,_ as Z,o as k,l as X,w as x,T as ee,a as te,m as T,n as A,p as se,q as ie}from"./main-NKoIlOHY.js";var S={exports:{}};/*!
  * Bootstrap collapse.js v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */(function(t,r){(function(n,l){t.exports=l(q(),z(),R(),G())})(K,function(n,l,i,u){const a="collapse",f=".bs.collapse",b=".data-api",v=`show${f}`,w=`shown${f}`,D=`hide${f}`,N=`hidden${f}`,y=`click${f}${b}`,C="show",d="collapse",_="collapsing",$="collapsed",I=`:scope .${d} .${d}`,M="collapse-horizontal",O="width",P="height",H=".collapse.show, .collapse.collapsing",E='[data-bs-toggle="collapse"]',V={parent:null,toggle:!0},B={parent:"(null|element)",toggle:"boolean"};class p extends n{constructor(e,o){super(e,o),this._isTransitioning=!1,this._triggerArray=[];const s=i.find(E);for(const c of s){const g=i.getSelectorFromElement(c),L=i.find(g).filter(h=>h===this._element);g!==null&&L.length&&this._triggerArray.push(c)}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return V}static get DefaultType(){return B}static get NAME(){return a}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let e=[];if(this._config.parent&&(e=this._getFirstLevelChildren(H).filter(h=>h!==this._element).map(h=>p.getOrCreateInstance(h,{toggle:!1}))),e.length&&e[0]._isTransitioning||l.trigger(this._element,v).defaultPrevented)return;for(const h of e)h.hide();const s=this._getDimension();this._element.classList.remove(d),this._element.classList.add(_),this._element.style[s]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const c=()=>{this._isTransitioning=!1,this._element.classList.remove(_),this._element.classList.add(d,C),this._element.style[s]="",l.trigger(this._element,w)},L=`scroll${s[0].toUpperCase()+s.slice(1)}`;this._queueCallback(c,this._element,!0),this._element.style[s]=`${this._element[L]}px`}hide(){if(this._isTransitioning||!this._isShown()||l.trigger(this._element,D).defaultPrevented)return;const o=this._getDimension();this._element.style[o]=`${this._element.getBoundingClientRect()[o]}px`,u.reflow(this._element),this._element.classList.add(_),this._element.classList.remove(d,C);for(const c of this._triggerArray){const g=i.getElementFromSelector(c);g&&!this._isShown(g)&&this._addAriaAndCollapsedClass([c],!1)}this._isTransitioning=!0;const s=()=>{this._isTransitioning=!1,this._element.classList.remove(_),this._element.classList.add(d),l.trigger(this._element,N)};this._element.style[o]="",this._queueCallback(s,this._element,!0)}_isShown(e=this._element){return e.classList.contains(C)}_configAfterMerge(e){return e.toggle=!!e.toggle,e.parent=u.getElement(e.parent),e}_getDimension(){return this._element.classList.contains(M)?O:P}_initializeChildren(){if(!this._config.parent)return;const e=this._getFirstLevelChildren(E);for(const o of e){const s=i.getElementFromSelector(o);s&&this._addAriaAndCollapsedClass([o],this._isShown(s))}}_getFirstLevelChildren(e){const o=i.find(I,this._config.parent);return i.find(e,this._config.parent).filter(s=>!o.includes(s))}_addAriaAndCollapsedClass(e,o){if(e.length)for(const s of e)s.classList.toggle($,!o),s.setAttribute("aria-expanded",o)}static jQueryInterface(e){const o={};return typeof e=="string"&&/show|hide/.test(e)&&(o.toggle=!1),this.each(function(){const s=p.getOrCreateInstance(this,o);if(typeof e=="string"){if(typeof s[e]>"u")throw new TypeError(`No method named "${e}"`);s[e]()}})}}return l.on(document,y,E,function(m){(m.target.tagName==="A"||m.delegateTarget&&m.delegateTarget.tagName==="A")&&m.preventDefault();for(const e of i.getMultipleElementsFromSelector(this))p.getOrCreateInstance(e,{toggle:!1}).toggle()}),u.defineJQueryPlugin(p),p})})(S);var oe=S.exports;const ne=F(oe),le=W({props:{acceptLabel:{type:String,default:"Confirm selection"},acceptAllLabel:{type:String,default:"Accept all"},isCookiePage:{type:Boolean,default:!1}},setup(t){const r=Y("cookies"),n=j();if(!r)return;const l=()=>{var i;J.scrollTo(n.value,700,{container:(i=n.value)==null?void 0:i.parentElement})};return U(()=>{var i;n.value&&(new ne(n.value,{toggle:!1}),(i=n.value)==null||i.addEventListener("shown.bs.collapse",l))}),Q(()=>{var i;n.value&&((i=n.value)==null||i.removeEventListener("shown.bs.collapse",l))}),{cookies:r,details:n,props:t}}}),ae={class:"d-grid d-sm-block text-end"},re=["innerHTML"],ce=["innerHTML"],he={class:"collapse info-panel-details",id:"cookie-info-box-collapse",ref:"details"};function de(t,r,n,l,i,u){return k(),X(ee,{name:"fade"},{default:x(()=>[!t.cookies.closed.value||t.props.isCookiePage?(k(),te("div",{key:0,class:se({"cookies-info-box":!0,"info-panel":!t.props.isCookiePage,"cookies-info-box--page":t.props.isCookiePage})},[T(t.$slots,"default",{accept:a=>t.cookies.accept(a),acceptAll:()=>t.cookies.acceptAll(),close:()=>t.cookies.close(),categories:t.cookies.categories}),T(t.$slots,"actions",{accept:a=>t.cookies.accept(a),acceptAll:()=>t.cookies.acceptAll(),close:()=>t.cookies.close(),categories:t.cookies.categories},()=>[A("div",ae,[A("button",{type:"button",class:"btn btn-outline-white mb-half",onClick:r[0]||(r[0]=(...a)=>t.cookies.accept&&t.cookies.accept(...a)),innerHTML:`${t.acceptLabel}`},null,8,re),A("button",{type:"button",class:"btn btn-white ms-sm-1 mb-half",onClick:r[1]||(r[1]=(...a)=>t.cookies.acceptAll&&t.cookies.acceptAll(...a)),innerHTML:`${t.acceptAllLabel}`},null,8,ce)])]),A("div",he,[T(t.$slots,"details")],512)],2)):ie("",!0)]),_:3})}const fe=Z(le,[["render",de]]);export{fe as default};
