(function(){var p={};D(),b();function D(){var t=document.createElement("style");t.id="dom-slider",t.innerHTML=`
      .DOM-slider-hidden {
        height: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        border-top-width: 0 !important;
        border-bottom-width: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        overflow: hidden !important;
      }
    `,document.head.appendChild(t);function e(i){var l=i.element,a=i.slideSpeed,o=i.easing,s=i.delay,n=i.visibleDisplayValue;return y({element:l,slideSpeed:a,direction:"down",easing:o,delay:s,visibleDisplayValue:n})}function d(i){var l=i.element,a=i.slideSpeed,o=i.easing,s=i.delay;return y({element:l,slideSpeed:a,direction:"up",easing:o,delay:s})}function r(i){var l=i.element,a=i.slideSpeed,o=i.easing,s=i.delay,n=i.visibleDisplayValue;return y({element:l,slideSpeed:a,easing:o,delay:s,visibleDisplayValue:n})}window.domSlider={slideDown:e,slideUp:d,slideToggle:r}}function y(t){var e=t.element,d=t.slideSpeed,r=t.direction,i=t.easing,l=t.delay,a=l===void 0?0:l,o=t.visibleDisplayValue,s=o===void 0?"block":o,n=e.dataset.domSliderId||(Date.now()*Math.random()).toFixed(0);e.dataset.domSliderId||(e.dataset.domSliderId=n),p[n]||(p[n]={});var v=p[n],m=window.getComputedStyle(e),h=m.getPropertyValue("display")==="none",c=r||(h||e.classList.contains("DOM-slider-hidden")?"down":"up"),w=d||(d===0?0:300),S=m.getPropertyValue("box-sizing"),f=parseInt(m.getPropertyValue("padding-top").split("px")[0]),M=parseInt(m.getPropertyValue("padding-bottom").split("px")[0]),u=Math.max(e.scrollHeight-f-M,0);return S==="border-box"&&(u=Math.max(e.scrollHeight,0)),e.dataset.sliding||c==="down"&&!h&&!e.classList.contains("DOM-slider-hidden")||c==="up"&&e.classList.contains("DOM-slider-hidden")?Promise.resolve(e):(e.dataset.sliding=!0,e.setAttribute("aria-hidden",c==="down"?"false":"true"),c==="down"&&h&&(e.classList.add("DOM-slider-hidden"),e.style.display=s,u=e.scrollHeight),e.style.height="".concat(v.height?v.height:u,"px"),e.style.transition="all ".concat(w,"ms ").concat(i||""),e.style.overflow="hidden",new Promise(function(g){setTimeout(function(){e.classList.toggle("DOM-slider-hidden"),g()},+a>20?+a:20)}).then(function(){return new Promise(function(g){setTimeout(function(){e.style.removeProperty("height"),e.style.removeProperty("transition"),e.style.removeProperty("overflow"),e.removeAttribute("data-sliding"),p[n].height=u,g(e)},w)})}))}function b(){var t;function e(){t=document.querySelectorAll(".DOM-slider-hidden"),t.forEach(function(i){i.classList.remove("DOM-slider-hidden")})}function d(){t.forEach(function(i){i.classList.add("DOM-slider-hidden")})}window.onbeforeprint=e,window.onafterprint=d;var r=window.matchMedia("print");r.addListener(function(i){i.matches&&(e(),setTimeout(d,500))})}})();