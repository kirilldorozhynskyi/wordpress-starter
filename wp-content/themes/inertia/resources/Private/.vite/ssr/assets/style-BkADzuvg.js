import { t as vue_exports } from "./vue-D80rEydT.js";
//#region node_modules/@primeuix/utils/dist/object/index.mjs
var ie$1 = Object.defineProperty;
var K$1 = Object.getOwnPropertySymbols;
var se = Object.prototype.hasOwnProperty;
var ae$1 = Object.prototype.propertyIsEnumerable;
var N$1 = (e, t, n) => t in e ? ie$1(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n;
var d = (e, t) => {
	for (var n in t || (t = {})) se.call(t, n) && N$1(e, n, t[n]);
	if (K$1) for (var n of K$1(t)) ae$1.call(t, n) && N$1(e, n, t[n]);
	return e;
};
function l(e) {
	return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function b$2(e, t, n = /* @__PURE__ */ new WeakSet()) {
	if (e === t) return !0;
	if (!e || !t || typeof e != "object" || typeof t != "object" || n.has(e) || n.has(t)) return !1;
	n.add(e).add(t);
	let o = Array.isArray(e), r = Array.isArray(t), u, f, T;
	if (o && r) {
		if (f = e.length, f != t.length) return !1;
		for (u = f; u-- !== 0;) if (!b$2(e[u], t[u], n)) return !1;
		return !0;
	}
	if (o != r) return !1;
	let S = e instanceof Date, A = t instanceof Date;
	if (S != A) return !1;
	if (S && A) return e.getTime() == t.getTime();
	let I = e instanceof RegExp, L = t instanceof RegExp;
	if (I != L) return !1;
	if (I && L) return e.toString() == t.toString();
	let R = Object.keys(e);
	if (f = R.length, f !== Object.keys(t).length) return !1;
	for (u = f; u-- !== 0;) if (!Object.prototype.hasOwnProperty.call(t, R[u])) return !1;
	for (u = f; u-- !== 0;) if (T = R[u], !b$2(e[T], t[T], n)) return !1;
	return !0;
}
function y$1(e, t) {
	return b$2(e, t);
}
function c$1(e) {
	return typeof e == "function" && "call" in e && "apply" in e;
}
function s$1(e) {
	return !l(e);
}
function p(e, t) {
	if (!e || !t) return null;
	try {
		let n = e[t];
		if (s$1(n)) return n;
	} catch (n) {}
	if (Object.keys(e).length) {
		if (c$1(t)) return t(e);
		if (t.indexOf(".") === -1) return e[t];
		{
			let n = t.split("."), o = e;
			for (let r = 0, u = n.length; r < u; ++r) {
				if (o == null) return null;
				o = o[n[r]];
			}
			return o;
		}
	}
	return null;
}
function k$2(e, t, n) {
	return n ? p(e, n) === p(t, n) : y$1(e, t);
}
function q(e, t) {
	if (e != null && t && t.length) {
		for (let n of t) if (k$2(e, n)) return !0;
	}
	return !1;
}
function i(e, t = !0) {
	return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function $$2(e = {}, t = {}) {
	let n = d({}, e);
	return Object.keys(t).forEach((o) => {
		let r = o;
		i(t[r]) && r in e && i(e[r]) ? n[r] = $$2(e[r], t[r]) : n[r] = t[r];
	}), n;
}
function w$1(...e) {
	return e.reduce((t, n, o) => o === 0 ? n : $$2(t, n), {});
}
function M$1(e, t) {
	let n = -1;
	if (s$1(e)) try {
		n = e.findLastIndex(t);
	} catch (o) {
		n = e.lastIndexOf([...e].reverse().find(t));
	}
	return n;
}
function m(e, ...t) {
	return c$1(e) ? e(...t) : e;
}
function a(e, t = !0) {
	return typeof e == "string" && (t || e !== "");
}
function g(e) {
	return a(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function F$1(e, t = "", n = {}) {
	let o = g(t).split("."), r = o.shift();
	if (r) {
		if (i(e)) return F$1(m(e[Object.keys(e).find((f) => g(f) === r) || ""], n), o.join("."), n);
		return;
	}
	return m(e, n);
}
function C$2(e, t = !0) {
	return Array.isArray(e) && (t || e.length !== 0);
}
function z$1(e) {
	return s$1(e) && !isNaN(e);
}
function J(e = "") {
	return s$1(e) && e.length === 1 && !!e.match(/\S| /);
}
function G(e, t) {
	if (t) {
		let n = t.test(e);
		return t.lastIndex = 0, n;
	}
	return !1;
}
function H(...e) {
	return w$1(...e);
}
function Y$2(e) {
	return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function X(e) {
	if (e && /[\xC0-\xFF\u0100-\u017E]/.test(e)) {
		let n = {
			A: /[\xC0-\xC5\u0100\u0102\u0104]/g,
			AE: /[\xC6]/g,
			C: /[\xC7\u0106\u0108\u010A\u010C]/g,
			D: /[\xD0\u010E\u0110]/g,
			E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g,
			G: /[\u011C\u011E\u0120\u0122]/g,
			H: /[\u0124\u0126]/g,
			I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g,
			IJ: /[\u0132]/g,
			J: /[\u0134]/g,
			K: /[\u0136]/g,
			L: /[\u0139\u013B\u013D\u013F\u0141]/g,
			N: /[\xD1\u0143\u0145\u0147\u014A]/g,
			O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g,
			OE: /[\u0152]/g,
			R: /[\u0154\u0156\u0158]/g,
			S: /[\u015A\u015C\u015E\u0160]/g,
			T: /[\u0162\u0164\u0166]/g,
			U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g,
			W: /[\u0174]/g,
			Y: /[\xDD\u0176\u0178]/g,
			Z: /[\u0179\u017B\u017D]/g,
			a: /[\xE0-\xE5\u0101\u0103\u0105]/g,
			ae: /[\xE6]/g,
			c: /[\xE7\u0107\u0109\u010B\u010D]/g,
			d: /[\u010F\u0111]/g,
			e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g,
			g: /[\u011D\u011F\u0121\u0123]/g,
			i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g,
			ij: /[\u0133]/g,
			j: /[\u0135]/g,
			k: /[\u0137,\u0138]/g,
			l: /[\u013A\u013C\u013E\u0140\u0142]/g,
			n: /[\xF1\u0144\u0146\u0148\u014B]/g,
			p: /[\xFE]/g,
			o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g,
			oe: /[\u0153]/g,
			r: /[\u0155\u0157\u0159]/g,
			s: /[\u015B\u015D\u015F\u0161]/g,
			t: /[\u0163\u0165\u0167]/g,
			u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g,
			w: /[\u0175]/g,
			y: /[\xFD\xFF\u0177]/g,
			z: /[\u017A\u017C\u017E]/g
		};
		for (let o in n) e = e.replace(n[o], o);
	}
	return e;
}
function ne$1(e) {
	return a(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function re(e) {
	return a(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
//#endregion
//#region node_modules/@primeuix/utils/dist/eventbus/index.mjs
function s() {
	let r = /* @__PURE__ */ new Map();
	return {
		on(e, t) {
			let n = r.get(e);
			return n ? n.push(t) : n = [t], r.set(e, n), this;
		},
		off(e, t) {
			let n = r.get(e);
			return n && n.splice(n.indexOf(t) >>> 0, 1), this;
		},
		emit(e, t) {
			let n = r.get(e);
			n && n.forEach((i) => {
				i(t);
			});
		},
		clear() {
			r.clear();
		}
	};
}
//#endregion
//#region node_modules/@primeuix/utils/dist/dom/index.mjs
function R(t, e) {
	return t ? t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className) : !1;
}
function W(t, e) {
	if (t && e) {
		let o = (n) => {
			R(t, n) || (t.classList ? t.classList.add(n) : t.className += " " + n);
		};
		[e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
	}
}
function P(t, e) {
	if (t && e) {
		let o = (n) => {
			t.classList ? t.classList.remove(n) : t.className = t.className.replace(new RegExp("(^|\\b)" + n.split(" ").join("|") + "(\\b|$)", "gi"), " ");
		};
		[e].flat().filter(Boolean).forEach((n) => n.split(" ").forEach(o));
	}
}
function x(t) {
	for (let e of document == null ? void 0 : document.styleSheets) try {
		for (let o of e == null ? void 0 : e.cssRules) for (let n of o == null ? void 0 : o.style) if (t.test(n)) return {
			name: n,
			value: o.style.getPropertyValue(n).trim()
		};
	} catch (o) {}
	return null;
}
function w(t) {
	let e = {
		width: 0,
		height: 0
	};
	if (t) {
		let [o, n] = [t.style.visibility, t.style.display], r = t.getBoundingClientRect();
		t.style.visibility = "hidden", t.style.display = "block", e.width = r.width || t.offsetWidth, e.height = r.height || t.offsetHeight, t.style.display = n, t.style.visibility = o;
	}
	return e;
}
function h$1() {
	let t = window, e = document, o = e.documentElement, n = e.getElementsByTagName("body")[0];
	return {
		width: t.innerWidth || o.clientWidth || n.clientWidth,
		height: t.innerHeight || o.clientHeight || n.clientHeight
	};
}
function E$1(t) {
	return t ? Math.abs(t.scrollLeft) : 0;
}
function k$1() {
	let t = document.documentElement;
	return (window.pageXOffset || E$1(t)) - (t.clientLeft || 0);
}
function $$1() {
	let t = document.documentElement;
	return (window.pageYOffset || t.scrollTop) - (t.clientTop || 0);
}
function V(t) {
	return t ? getComputedStyle(t).direction === "rtl" : !1;
}
function D(t, e, o = !0) {
	var n, r, i, l;
	if (t) {
		let d = t.offsetParent ? {
			width: t.offsetWidth,
			height: t.offsetHeight
		} : w(t), s = d.height, a = d.width, u = e.offsetHeight, p = e.offsetWidth, f = e.getBoundingClientRect(), g = $$1(), it = k$1(), lt = h$1(), L, N, ot = "top";
		f.top + u + s > lt.height ? (L = f.top + g - s, ot = "bottom", L < 0 && (L = g)) : L = u + f.top + g, f.left + a > lt.width ? N = Math.max(0, f.left + it + p - a) : N = f.left + it, V(t) ? t.style.insetInlineEnd = N + "px" : t.style.insetInlineStart = N + "px", t.style.top = L + "px", t.style.transformOrigin = ot, o && (t.style.marginTop = ot === "bottom" ? `calc(${(r = (n = x(/-anchor-gutter$/)) == null ? void 0 : n.value) != null ? r : "2px"} * -1)` : (l = (i = x(/-anchor-gutter$/)) == null ? void 0 : i.value) != null ? l : "");
	}
}
function S$1(t, e) {
	t && (typeof e == "string" ? t.style.cssText = e : Object.entries(e || {}).forEach(([o, n]) => t.style[o] = n));
}
function v$1(t, e) {
	if (t instanceof HTMLElement) {
		let o = t.offsetWidth;
		if (e) {
			let n = getComputedStyle(t);
			o += parseFloat(n.marginLeft) + parseFloat(n.marginRight);
		}
		return o;
	}
	return 0;
}
function I(t, e, o = !0, n = void 0) {
	var r;
	if (t) {
		let i = t.offsetParent ? {
			width: t.offsetWidth,
			height: t.offsetHeight
		} : w(t), l = e.offsetHeight, d = e.getBoundingClientRect(), s = h$1(), a, u, p = n != null ? n : "top";
		if (!n && d.top + l + i.height > s.height ? (a = -1 * i.height, p = "bottom", d.top + a < 0 && (a = -1 * d.top)) : a = l, i.width > s.width ? u = d.left * -1 : d.left + i.width > s.width ? u = (d.left + i.width - s.width) * -1 : u = 0, t.style.top = a + "px", t.style.insetInlineStart = u + "px", t.style.transformOrigin = p, o) {
			let f = (r = x(/-anchor-gutter$/)) == null ? void 0 : r.value;
			t.style.marginTop = p === "bottom" ? `calc(${f != null ? f : "2px"} * -1)` : f != null ? f : "";
		}
	}
}
function y(t) {
	if (t) {
		let e = t.parentNode;
		return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
	}
	return null;
}
function T(t) {
	return !!(t !== null && typeof t != "undefined" && t.nodeName && y(t));
}
function c(t) {
	return typeof Element != "undefined" ? t instanceof Element : t !== null && typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
}
function A(t, e = {}) {
	if (c(t)) {
		let o = (n, r) => {
			var l, d;
			let i = (l = t == null ? void 0 : t.$attrs) != null && l[n] ? [(d = t == null ? void 0 : t.$attrs) == null ? void 0 : d[n]] : [];
			return [r].flat().reduce((s, a) => {
				if (a != null) {
					let u = typeof a;
					if (u === "string" || u === "number") s.push(a);
					else if (u === "object") {
						let p = Array.isArray(a) ? o(n, a) : Object.entries(a).map(([f, g]) => n === "style" && (g || g === 0) ? `${f.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${g}` : g ? f : void 0);
						s = p.length ? s.concat(p.filter((f) => !!f)) : s;
					}
				}
				return s;
			}, i);
		};
		Object.entries(e).forEach(([n, r]) => {
			if (r != null) {
				let i = n.match(/^on(.+)/);
				i ? t.addEventListener(i[1].toLowerCase(), r) : n === "p-bind" || n === "pBind" ? A(t, r) : (r = n === "class" ? [...new Set(o("class", r))].join(" ").trim() : n === "style" ? o("style", r).join(";").trim() : r, (t.$attrs = t.$attrs || {}) && (t.$attrs[n] = r), t.setAttribute(n, r));
			}
		});
	}
}
function U(t, e = {}, ...o) {
	if (t) {
		let n = document.createElement(t);
		return A(n, e), n.append(...o), n;
	}
}
function Y$1(t, e) {
	return c(t) ? Array.from(t.querySelectorAll(e)) : [];
}
function z(t, e) {
	return c(t) ? t.matches(e) ? t : t.querySelector(e) : null;
}
function bt(t, e) {
	t && document.activeElement !== t && t.focus(e);
}
function Q$1(t, e) {
	if (c(t)) {
		let o = t.getAttribute(e);
		return isNaN(o) ? o === "true" || o === "false" ? o === "true" : o : +o;
	}
}
function b$1(t, e = "") {
	let o = Y$1(t, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`), n = [];
	for (let r of o) getComputedStyle(r).display != "none" && getComputedStyle(r).visibility != "hidden" && n.push(r);
	return n;
}
function vt(t, e) {
	let o = b$1(t, e);
	return o.length > 0 ? o[0] : null;
}
function Tt(t) {
	if (t) {
		let e = t.offsetHeight, o = getComputedStyle(t);
		return e -= parseFloat(o.paddingTop) + parseFloat(o.paddingBottom) + parseFloat(o.borderTopWidth) + parseFloat(o.borderBottomWidth), e;
	}
	return 0;
}
function Lt(t, e) {
	let o = b$1(t, e);
	return o.length > 0 ? o[o.length - 1] : null;
}
function K(t) {
	if (t) {
		let e = t.getBoundingClientRect();
		return {
			top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0),
			left: e.left + (window.pageXOffset || E$1(document.documentElement) || E$1(document.body) || 0)
		};
	}
	return {
		top: "auto",
		left: "auto"
	};
}
function C$1(t, e) {
	if (t) {
		let o = t.offsetHeight;
		if (e) {
			let n = getComputedStyle(t);
			o += parseFloat(n.marginTop) + parseFloat(n.marginBottom);
		}
		return o;
	}
	return 0;
}
function M(t, e = []) {
	let o = y(t);
	return o === null ? e : M(o, e.concat([o]));
}
function At(t) {
	let e = [];
	if (t) {
		let o = M(t), n = /(auto|scroll)/, r = (i) => {
			try {
				let l = window.getComputedStyle(i, null);
				return n.test(l.getPropertyValue("overflow")) || n.test(l.getPropertyValue("overflowX")) || n.test(l.getPropertyValue("overflowY"));
			} catch (l) {
				return !1;
			}
		};
		for (let i of o) {
			let l = i.nodeType === 1 && i.dataset.scrollselectors;
			if (l) {
				let d = l.split(",");
				for (let s of d) {
					let a = z(i, s);
					a && r(a) && e.push(a);
				}
			}
			i.nodeType !== 9 && r(i) && e.push(i);
		}
	}
	return e;
}
function Rt(t) {
	if (t) {
		let e = t.offsetWidth, o = getComputedStyle(t);
		return e -= parseFloat(o.paddingLeft) + parseFloat(o.paddingRight) + parseFloat(o.borderLeftWidth) + parseFloat(o.borderRightWidth), e;
	}
	return 0;
}
function $t() {
	return /(android)/i.test(navigator.userAgent);
}
function tt() {
	return !!(typeof window != "undefined" && window.document && window.document.createElement);
}
function et(t) {
	return !!(t && t.offsetParent != null);
}
function Yt() {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function _t(t, e = "", o) {
	c(t) && o !== null && o !== void 0 && t.setAttribute(e, o);
}
//#endregion
//#region node_modules/@primeuix/styled/dist/index.mjs
var rt = Object.defineProperty;
var st = Object.defineProperties;
var nt = Object.getOwnPropertyDescriptors;
var F = Object.getOwnPropertySymbols;
var xe = Object.prototype.hasOwnProperty;
var be = Object.prototype.propertyIsEnumerable;
var _e = (e, t, r) => t in e ? rt(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: r
}) : e[t] = r;
var h = (e, t) => {
	for (var r in t || (t = {})) xe.call(t, r) && _e(e, r, t[r]);
	if (F) for (var r of F(t)) be.call(t, r) && _e(e, r, t[r]);
	return e;
};
var $ = (e, t) => st(e, nt(t));
var v = (e, t) => {
	var r = {};
	for (var s in e) xe.call(e, s) && t.indexOf(s) < 0 && (r[s] = e[s]);
	if (e != null && F) for (var s of F(e)) t.indexOf(s) < 0 && be.call(e, s) && (r[s] = e[s]);
	return r;
};
function ke(...e) {
	return w$1(...e);
}
var N = s();
var k = /{([^}]*)}/g;
var ne = /(\d+\s+[\+\-\*\/]\s+\d+)/g;
var ie = /var\([^)]+\)/g;
function oe(e) {
	return a(e) ? e.replace(/[A-Z]/g, (t, r) => r === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function ve(e) {
	return i(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function dt(e) {
	return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Q(e = "", t = "") {
	return dt(`${a(e, !1) && a(t, !1) ? `${e}-` : e}${t}`);
}
function ae(e = "", t = "") {
	return `--${Q(e, t)}`;
}
function ht(e = "") {
	return ((e.match(/{/g) || []).length + (e.match(/}/g) || []).length) % 2 !== 0;
}
function Y(e, t = "", r = "", s = [], i) {
	if (a(e)) {
		let a = e.trim();
		if (ht(a)) return;
		if (G(a, k)) {
			let n = a.replaceAll(k, (l) => {
				return `var(${ae(r, re(l.replace(/{|}/g, "").split(".").filter((m) => !s.some((d) => G(m, d))).join("-")))}${s$1(i) ? `, ${i}` : ""})`;
			});
			return G(n.replace(ie, "0"), ne) ? `calc(${n})` : n;
		}
		return a;
	} else if (z$1(e)) return e;
}
function Re(e, t, r) {
	a(t, !1) && e.push(`${t}:${r};`);
}
function C(e, t) {
	return e ? `${e}{${t}}` : "";
}
function le(e, t) {
	if (e.indexOf("dt(") === -1) return e;
	function r(n, l) {
		let o = [], c = 0, m = "", d = null, u = 0;
		for (; c <= n.length;) {
			let g = n[c];
			if ((g === "\"" || g === "'" || g === "`") && n[c - 1] !== "\\" && (d = d === g ? null : g), !d && (g === "(" && u++, g === ")" && u--, (g === "," || c === n.length) && u === 0)) {
				let f = m.trim();
				f.startsWith("dt(") ? o.push(le(f, l)) : o.push(s(f)), m = "", c++;
				continue;
			}
			g !== void 0 && (m += g), c++;
		}
		return o;
	}
	function s(n) {
		let l = n[0];
		if ((l === "\"" || l === "'" || l === "`") && n[n.length - 1] === l) return n.slice(1, -1);
		let o = Number(n);
		return isNaN(o) ? n : o;
	}
	let i = [], a = [];
	for (let n = 0; n < e.length; n++) if (e[n] === "d" && e.slice(n, n + 3) === "dt(") a.push(n), n += 2;
	else if (e[n] === ")" && a.length > 0) {
		let l = a.pop();
		a.length === 0 && i.push([l, n]);
	}
	if (!i.length) return e;
	for (let n = i.length - 1; n >= 0; n--) {
		let [l, o] = i[n], d = t(...r(e.slice(l + 3, o), t));
		e = e.slice(0, l) + d + e.slice(o + 1);
	}
	return e;
}
var E = (...e) => ue(S.getTheme(), ...e);
var ue = (e = {}, t, r, s) => {
	if (t) {
		let { variable: i, options: a } = S.defaults || {}, { prefix: n, transform: l$2 } = (e == null ? void 0 : e.options) || a || {}, o = G(t, k) ? t : `{${t}}`;
		return s === "value" || l(s) && l$2 === "strict" ? S.getTokenValue(t) : Y(o, void 0, n, [i.excludedKeyRegex], r);
	}
	return "";
};
function ar(e, ...t) {
	if (e instanceof Array) return le(e.reduce((s, i, a) => {
		var n;
		return s + i + ((n = m(t[a], { dt: E })) != null ? n : "");
	}, ""), E);
	return m(e, { dt: E });
}
function de(e, t = {}) {
	let r = S.defaults.variable, { prefix: s = r.prefix, selector: i$4 = r.selector, excludedKeyRegex: a = r.excludedKeyRegex } = t, n = [], l = [], o = [{
		node: e,
		path: s
	}];
	for (; o.length;) {
		let { node: m, path: d } = o.pop();
		for (let u in m) {
			let g = m[u], f = ve(g), p = G(u, a) ? Q(d) : Q(d, re(u));
			if (i(f)) o.push({
				node: f,
				path: p
			});
			else {
				Re(l, ae(p), Y(f, p, s, [a]));
				let T = p;
				s && T.startsWith(s + "-") && (T = T.slice(s.length + 1)), n.push(T.replace(/-/g, "."));
			}
		}
	}
	let c = l.join("");
	return {
		value: l,
		tokens: n,
		declarations: c,
		css: C(i$4, c)
	};
}
var b = {
	regex: {
		rules: {
			class: {
				pattern: /^\.([a-zA-Z][\w-]*)$/,
				resolve(e) {
					return {
						type: "class",
						selector: e,
						matched: this.pattern.test(e.trim())
					};
				}
			},
			attr: {
				pattern: /^\[(.*)\]$/,
				resolve(e) {
					return {
						type: "attr",
						selector: `:root${e},:host${e}`,
						matched: this.pattern.test(e.trim())
					};
				}
			},
			media: {
				pattern: /^@media (.*)$/,
				resolve(e) {
					return {
						type: "media",
						selector: e,
						matched: this.pattern.test(e.trim())
					};
				}
			},
			system: {
				pattern: /^system$/,
				resolve(e) {
					return {
						type: "system",
						selector: "@media (prefers-color-scheme: dark)",
						matched: this.pattern.test(e.trim())
					};
				}
			},
			custom: { resolve(e) {
				return {
					type: "custom",
					selector: e,
					matched: !0
				};
			} }
		},
		resolve(e) {
			let t = Object.keys(this.rules).filter((r) => r !== "custom").map((r) => this.rules[r]);
			return [e].flat().map((r) => {
				var s;
				return (s = t.map((i) => i.resolve(r)).find((i) => i.matched)) != null ? s : this.rules.custom.resolve(r);
			});
		}
	},
	_toVariables(e, t) {
		return de(e, { prefix: t == null ? void 0 : t.prefix });
	},
	getCommon({ name: e = "", theme: t = {}, params: r, set: s, defaults: i }) {
		var R, T, j, O, M, z, V;
		let { preset: a, options: n } = t, l, o, c, m$1, d, u, g;
		if (s$1(a) && n.transform !== "strict") {
			let { primitive: L, semantic: te, extend: re } = a, f = te || {}, { colorScheme: K } = f, A = v(f, ["colorScheme"]), x = re || {}, { colorScheme: X } = x, G = v(x, ["colorScheme"]), p = K || {}, { dark: U } = p, B = v(p, ["dark"]), y = X || {}, { dark: I } = y, H = v(y, ["dark"]), W = s$1(L) ? this._toVariables({ primitive: L }, n) : {}, q = s$1(A) ? this._toVariables({ semantic: A }, n) : {}, Z = s$1(B) ? this._toVariables({ light: B }, n) : {}, pe = s$1(U) ? this._toVariables({ dark: U }, n) : {}, fe = s$1(G) ? this._toVariables({ semantic: G }, n) : {}, ye = s$1(H) ? this._toVariables({ light: H }, n) : {}, Se = s$1(I) ? this._toVariables({ dark: I }, n) : {}, [Me, ze] = [(R = W.declarations) != null ? R : "", W.tokens], [Ke, Xe] = [(T = q.declarations) != null ? T : "", q.tokens || []], [Ge, Ue] = [(j = Z.declarations) != null ? j : "", Z.tokens || []], [Be, Ie] = [(O = pe.declarations) != null ? O : "", pe.tokens || []], [He, We] = [(M = fe.declarations) != null ? M : "", fe.tokens || []], [qe, Ze] = [(z = ye.declarations) != null ? z : "", ye.tokens || []], [Fe, Je] = [(V = Se.declarations) != null ? V : "", Se.tokens || []];
			l = this.transformCSS(e, Me, "light", "variable", n, s, i), o = ze;
			c = `${this.transformCSS(e, `${Ke}${Ge}`, "light", "variable", n, s, i)}${this.transformCSS(e, `${Be}`, "dark", "variable", n, s, i)}`, m$1 = [.../* @__PURE__ */ new Set([
				...Xe,
				...Ue,
				...Ie
			])];
			d = `${this.transformCSS(e, `${He}${qe}color-scheme:light`, "light", "variable", n, s, i)}${this.transformCSS(e, `${Fe}color-scheme:dark`, "dark", "variable", n, s, i)}`, u = [.../* @__PURE__ */ new Set([
				...We,
				...Ze,
				...Je
			])], g = m(a.css, { dt: E });
		}
		return {
			primitive: {
				css: l,
				tokens: o
			},
			semantic: {
				css: c,
				tokens: m$1
			},
			global: {
				css: d,
				tokens: u
			},
			style: g
		};
	},
	getPreset({ name: e = "", preset: t = {}, options: r, params: s, set: i, defaults: a, selector: n }) {
		var f, x, p;
		let l, o, c;
		if (s$1(t) && r.transform !== "strict") {
			let y = e.replace("-directive", ""), m$2 = t, { colorScheme: R, extend: T, css: j } = m$2, O = v(m$2, [
				"colorScheme",
				"extend",
				"css"
			]), d = T || {}, { colorScheme: M } = d, z = v(d, ["colorScheme"]), u = R || {}, { dark: V } = u, L = v(u, ["dark"]), g = M || {}, { dark: te } = g, re = v(g, ["dark"]), K = s$1(O) ? this._toVariables({ [y]: h(h({}, O), z) }, r) : {}, A = s$1(L) ? this._toVariables({ [y]: h(h({}, L), re) }, r) : {}, X = s$1(V) ? this._toVariables({ [y]: h(h({}, V), te) }, r) : {}, [G, U] = [(f = K.declarations) != null ? f : "", K.tokens || []], [B, I] = [(x = A.declarations) != null ? x : "", A.tokens || []], [H, W] = [(p = X.declarations) != null ? p : "", X.tokens || []];
			l = `${this.transformCSS(y, `${G}${B}`, "light", "variable", r, i, a, n)}${this.transformCSS(y, H, "dark", "variable", r, i, a, n)}`, o = [.../* @__PURE__ */ new Set([
				...U,
				...I,
				...W
			])], c = m(j, { dt: E });
		}
		return {
			css: l,
			tokens: o,
			style: c
		};
	},
	getPresetC({ name: e = "", theme: t = {}, params: r, set: s, defaults: i }) {
		var o;
		let { preset: a, options: n } = t, l = (o = a == null ? void 0 : a.components) == null ? void 0 : o[e];
		return this.getPreset({
			name: e,
			preset: l,
			options: n,
			params: r,
			set: s,
			defaults: i
		});
	},
	getPresetD({ name: e = "", theme: t = {}, params: r, set: s, defaults: i }) {
		var c, m;
		let a = e.replace("-directive", ""), { preset: n, options: l } = t, o = ((c = n == null ? void 0 : n.components) == null ? void 0 : c[a]) || ((m = n == null ? void 0 : n.directives) == null ? void 0 : m[a]);
		return this.getPreset({
			name: a,
			preset: o,
			options: l,
			params: r,
			set: s,
			defaults: i
		});
	},
	applyDarkColorScheme(e) {
		return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
	},
	getColorSchemeOption(e, t) {
		var r;
		return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (r = e.darkModeSelector) != null ? r : t.options.darkModeSelector) : [];
	},
	getLayerOrder(e, t = {}, r, s) {
		let { cssLayer: i } = t;
		return i ? `@layer ${m(i.order || i.name || "primeui", r)}` : "";
	},
	getCommonStyleSheet({ name: e = "", theme: t = {}, params: r, props: s = {}, set: i$1, defaults: a }) {
		let n = this.getCommon({
			name: e,
			theme: t,
			params: r,
			set: i$1,
			defaults: a
		}), l = Object.entries(s).reduce((o, [c, m]) => o.push(`${c}="${m}"`) && o, []).join(" ");
		return Object.entries(n || {}).reduce((o, [c, m]) => {
			if (i(m) && Object.hasOwn(m, "css")) {
				let d = Y$2(m.css), u = `${c}-variables`;
				o.push(`<style type="text/css" data-primevue-style-id="${u}" ${l}>${d}</style>`);
			}
			return o;
		}, []).join("");
	},
	getStyleSheet({ name: e = "", theme: t = {}, params: r, props: s = {}, set: i, defaults: a }) {
		var c;
		let n = {
			name: e,
			theme: t,
			params: r,
			set: i,
			defaults: a
		}, l = (c = e.includes("-directive") ? this.getPresetD(n) : this.getPresetC(n)) == null ? void 0 : c.css, o = Object.entries(s).reduce((m, [d, u]) => m.push(`${d}="${u}"`) && m, []).join(" ");
		return l ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${o}>${Y$2(l)}</style>` : "";
	},
	createTokens(e = {}, t, r = "", s = "", i$2 = {}) {
		let a = function(l$1, o = {}, c = []) {
			if (c.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), {
				colorScheme: l$1,
				path: this.path,
				paths: o,
				value: void 0
			};
			c.push(this.path), o.name = this.path, o.binding || (o.binding = {});
			let m = this.value;
			if (typeof this.value == "string" && k.test(this.value)) {
				let u = this.value.trim().replace(k, (g) => {
					var y;
					let f = g.slice(1, -1), x = this.tokens[f];
					if (!x) return console.warn(`Token not found for path: ${f}`), "__UNRESOLVED__";
					let p = x.computed(l$1, o, c);
					return Array.isArray(p) && p.length === 2 ? `light-dark(${p[0].value},${p[1].value})` : (y = p == null ? void 0 : p.value) != null ? y : "__UNRESOLVED__";
				});
				m = ne.test(u.replace(ie, "0")) ? `calc(${u})` : u;
			}
			return l(o.binding) && delete o.binding, c.pop(), {
				colorScheme: l$1,
				path: this.path,
				paths: o,
				value: m.includes("__UNRESOLVED__") ? void 0 : m
			};
		}, n = (l, o, c) => {
			Object.entries(l).forEach(([m, d]) => {
				let u = G(m, t.variable.excludedKeyRegex) ? o : o ? `${o}.${oe(m)}` : oe(m), g = c ? `${c}.${m}` : m;
				i(d) ? n(d, u, g) : (i$2[u] || (i$2[u] = {
					paths: [],
					computed: (f, x = {}, p = []) => {
						if (i$2[u].paths.length === 1) return i$2[u].paths[0].computed(i$2[u].paths[0].scheme, x.binding, p);
						if (f && f !== "none") for (let y = 0; y < i$2[u].paths.length; y++) {
							let R = i$2[u].paths[y];
							if (R.scheme === f) return R.computed(f, x.binding, p);
						}
						return i$2[u].paths.map((y) => y.computed(y.scheme, x[y.scheme], p));
					}
				}), i$2[u].paths.push({
					path: g,
					value: d,
					scheme: g.includes("colorScheme.light") ? "light" : g.includes("colorScheme.dark") ? "dark" : "none",
					computed: a,
					tokens: i$2
				}));
			});
		};
		return n(e, r, s), i$2;
	},
	getTokenValue(e, t, r) {
		var l;
		let i = ((o) => o.split(".").filter((m) => !G(m.toLowerCase(), r.variable.excludedKeyRegex)).join("."))(t), a = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, n = [(l = e[i]) == null ? void 0 : l.computed(a)].flat().filter((o) => o);
		return n.length === 1 ? n[0].value : n.reduce((o = {}, c) => {
			let u = c, { colorScheme: m } = u;
			return o[m] = v(u, ["colorScheme"]), o;
		}, void 0);
	},
	getSelectorRule(e, t, r, s) {
		return r === "class" || r === "attr" ? C(s$1(t) ? `${e}${t},${e} ${t}` : e, s) : C(e, C(t != null ? t : ":root,:host", s));
	},
	transformCSS(e, t, r, s, i$3 = {}, a, n, l) {
		if (s$1(t)) {
			let { cssLayer: o } = i$3;
			if (s !== "style") {
				let c = this.getColorSchemeOption(i$3, n);
				t = r === "dark" ? c.reduce((m, { type: d, selector: u }) => (s$1(u) && (m += u.includes("[CSS]") ? u.replace("[CSS]", t) : this.getSelectorRule(u, l, d, t)), m), "") : C(l != null ? l : ":root,:host", t);
			}
			if (o) {
				let c = {
					name: "primeui",
					order: "primeui"
				};
				i(o) && (c.name = m(o.name, {
					name: e,
					type: s
				})), s$1(c.name) && (t = C(`@layer ${c.name}`, t), a?.layerNames(c.name));
			}
			return t;
		}
		return "";
	}
};
var S = {
	defaults: {
		variable: {
			prefix: "p",
			selector: ":root,:host",
			excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi
		},
		options: {
			prefix: "p",
			darkModeSelector: "system",
			cssLayer: !1
		}
	},
	_theme: void 0,
	_layerNames: /* @__PURE__ */ new Set(),
	_loadedStyleNames: /* @__PURE__ */ new Set(),
	_loadingStyles: /* @__PURE__ */ new Set(),
	_tokens: {},
	update(e = {}) {
		let { theme: t } = e;
		t && (this._theme = $(h({}, t), { options: h(h({}, this.defaults.options), t.options) }), this._tokens = b.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
	},
	get theme() {
		return this._theme;
	},
	get preset() {
		var e;
		return ((e = this.theme) == null ? void 0 : e.preset) || {};
	},
	get options() {
		var e;
		return ((e = this.theme) == null ? void 0 : e.options) || {};
	},
	get tokens() {
		return this._tokens;
	},
	getTheme() {
		return this.theme;
	},
	setTheme(e) {
		this.update({ theme: e }), N.emit("theme:change", e);
	},
	getPreset() {
		return this.preset;
	},
	setPreset(e) {
		this._theme = $(h({}, this.theme), { preset: e }), this._tokens = b.createTokens(e, this.defaults), this.clearLoadedStyleNames(), N.emit("preset:change", e), N.emit("theme:change", this.theme);
	},
	getOptions() {
		return this.options;
	},
	setOptions(e) {
		this._theme = $(h({}, this.theme), { options: e }), this.clearLoadedStyleNames(), N.emit("options:change", e), N.emit("theme:change", this.theme);
	},
	getLayerNames() {
		return [...this._layerNames];
	},
	setLayerNames(e) {
		this._layerNames.add(e);
	},
	getLoadedStyleNames() {
		return this._loadedStyleNames;
	},
	isStyleNameLoaded(e) {
		return this._loadedStyleNames.has(e);
	},
	setLoadedStyleName(e) {
		this._loadedStyleNames.add(e);
	},
	deleteLoadedStyleName(e) {
		this._loadedStyleNames.delete(e);
	},
	clearLoadedStyleNames() {
		this._loadedStyleNames.clear();
	},
	getTokenValue(e) {
		return b.getTokenValue(this.tokens, e, this.defaults);
	},
	getCommon(e = "", t) {
		return b.getCommon({
			name: e,
			theme: this.theme,
			params: t,
			defaults: this.defaults,
			set: { layerNames: this.setLayerNames.bind(this) }
		});
	},
	getComponent(e = "", t) {
		let r = {
			name: e,
			theme: this.theme,
			params: t,
			defaults: this.defaults,
			set: { layerNames: this.setLayerNames.bind(this) }
		};
		return b.getPresetC(r);
	},
	getDirective(e = "", t) {
		let r = {
			name: e,
			theme: this.theme,
			params: t,
			defaults: this.defaults,
			set: { layerNames: this.setLayerNames.bind(this) }
		};
		return b.getPresetD(r);
	},
	getCustomPreset(e = "", t, r, s) {
		let i = {
			name: e,
			preset: t,
			options: this.options,
			selector: r,
			params: s,
			defaults: this.defaults,
			set: { layerNames: this.setLayerNames.bind(this) }
		};
		return b.getPreset(i);
	},
	getLayerOrderCSS(e = "") {
		return b.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
	},
	transformCSS(e = "", t, r = "style", s) {
		return b.transformCSS(e, t, s, r, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
	},
	getCommonStyleSheet(e = "", t, r = {}) {
		return b.getCommonStyleSheet({
			name: e,
			theme: this.theme,
			params: t,
			props: r,
			defaults: this.defaults,
			set: { layerNames: this.setLayerNames.bind(this) }
		});
	},
	getStyleSheet(e, t, r = {}) {
		return b.getStyleSheet({
			name: e,
			theme: this.theme,
			params: t,
			props: r,
			defaults: this.defaults,
			set: { layerNames: this.setLayerNames.bind(this) }
		});
	},
	onStyleMounted(e) {
		this._loadingStyles.add(e);
	},
	onStyleUpdated(e) {
		this._loadingStyles.add(e);
	},
	onStyleLoaded(e, { name: t }) {
		this._loadingStyles.size && (this._loadingStyles.delete(t), N.emit(`theme:${t}:load`, e), !this._loadingStyles.size && N.emit("theme:load"));
	}
};
//#endregion
//#region node_modules/@primeuix/styles/dist/base/index.mjs
var style = "\n    *,\n    ::before,\n    ::after {\n        box-sizing: border-box;\n    }\n\n    .p-collapsible-enter-active {\n        animation: p-animate-collapsible-expand 0.2s ease-out;\n        overflow: hidden;\n    }\n\n    .p-collapsible-leave-active {\n        animation: p-animate-collapsible-collapse 0.2s ease-out;\n        overflow: hidden;\n    }\n\n    @keyframes p-animate-collapsible-expand {\n        from {\n            grid-template-rows: 0fr;\n        }\n        to {\n            grid-template-rows: 1fr;\n        }\n    }\n\n    @keyframes p-animate-collapsible-collapse {\n        from {\n            grid-template-rows: 1fr;\n        }\n        to {\n            grid-template-rows: 0fr;\n        }\n    }\n\n    .p-disabled,\n    .p-disabled * {\n        cursor: default;\n        pointer-events: none;\n        user-select: none;\n    }\n\n    .p-disabled,\n    .p-component:disabled {\n        opacity: dt('disabled.opacity');\n    }\n\n    .pi {\n        font-size: dt('icon.size');\n    }\n\n    .p-icon {\n        width: dt('icon.size');\n        height: dt('icon.size');\n    }\n\n    .p-overlay-mask {\n        background: var(--px-mask-background, dt('mask.background'));\n        color: dt('mask.color');\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n    }\n\n    .p-overlay-mask-enter-active {\n        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;\n    }\n\n    .p-overlay-mask-leave-active {\n        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;\n    }\n\n    @keyframes p-animate-overlay-mask-enter {\n        from {\n            background: transparent;\n        }\n        to {\n            background: var(--px-mask-background, dt('mask.background'));\n        }\n    }\n    @keyframes p-animate-overlay-mask-leave {\n        from {\n            background: var(--px-mask-background, dt('mask.background'));\n        }\n        to {\n            background: transparent;\n        }\n    }\n\n    .p-anchored-overlay-enter-active {\n        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);\n    }\n\n    .p-anchored-overlay-leave-active {\n        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);\n    }\n\n    @keyframes p-animate-anchored-overlay-enter {\n        from {\n            opacity: 0;\n            transform: scale(0.93);\n        }\n    }\n\n    @keyframes p-animate-anchored-overlay-leave {\n        to {\n            opacity: 0;\n            transform: scale(0.93);\n        }\n    }\n";
//#endregion
//#region node_modules/@primevue/core/usestyle/index.mjs
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$1(o);
}
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), true).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$1(e, r, t) {
	return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: true,
		configurable: true,
		writable: true
	}) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == _typeof$1(i) ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != _typeof$1(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r);
		if ("object" != _typeof$1(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function tryOnMounted(fn) {
	var sync = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
	if ((0, vue_exports.getCurrentInstance)() && (0, vue_exports.getCurrentInstance)().components) (0, vue_exports.onMounted)(fn);
	else if (sync) fn();
	else (0, vue_exports.nextTick)(fn);
}
var _id = 0;
function useStyle(css) {
	var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var isLoaded = (0, vue_exports.ref)(false);
	var cssRef = (0, vue_exports.ref)(css);
	var styleRef = (0, vue_exports.ref)(null);
	var defaultDocument = tt() ? window.document : void 0;
	var _options$document = options.document, document = _options$document === void 0 ? defaultDocument : _options$document, _options$immediate = options.immediate, immediate = _options$immediate === void 0 ? true : _options$immediate, _options$manual = options.manual, manual = _options$manual === void 0 ? false : _options$manual, _options$name = options.name, name = _options$name === void 0 ? "style_".concat(++_id) : _options$name, _options$id = options.id, id = _options$id === void 0 ? void 0 : _options$id, _options$media = options.media, media = _options$media === void 0 ? void 0 : _options$media, _options$nonce = options.nonce, nonce = _options$nonce === void 0 ? void 0 : _options$nonce, _options$first = options.first, first = _options$first === void 0 ? false : _options$first, _options$onMounted = options.onMounted, onStyleMounted = _options$onMounted === void 0 ? void 0 : _options$onMounted, _options$onUpdated = options.onUpdated, onStyleUpdated = _options$onUpdated === void 0 ? void 0 : _options$onUpdated, _options$onLoad = options.onLoad, onStyleLoaded = _options$onLoad === void 0 ? void 0 : _options$onLoad, _options$props = options.props, props = _options$props === void 0 ? {} : _options$props;
	var stop = function stop() {};
	var load = function load(_css) {
		var _props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		if (!document) return;
		var _styleProps = _objectSpread$1(_objectSpread$1({}, props), _props);
		var _name = _styleProps.name || name, _id = _styleProps.id || id, _nonce = _styleProps.nonce || nonce;
		styleRef.value = document.querySelector("style[data-primevue-style-id=\"".concat(_name, "\"]")) || document.getElementById(_id) || document.createElement("style");
		if (!styleRef.value.isConnected) {
			cssRef.value = _css || css;
			A(styleRef.value, {
				type: "text/css",
				id: _id,
				media,
				nonce: _nonce
			});
			first ? document.head.prepend(styleRef.value) : document.head.appendChild(styleRef.value);
			_t(styleRef.value, "data-primevue-style-id", _name);
			A(styleRef.value, _styleProps);
			styleRef.value.onload = function(event) {
				return onStyleLoaded === null || onStyleLoaded === void 0 ? void 0 : onStyleLoaded(event, { name: _name });
			};
			onStyleMounted === null || onStyleMounted === void 0 || onStyleMounted(_name);
		}
		if (isLoaded.value) return;
		stop = (0, vue_exports.watch)(cssRef, function(value) {
			styleRef.value.textContent = value;
			onStyleUpdated === null || onStyleUpdated === void 0 || onStyleUpdated(_name);
		}, { immediate: true });
		isLoaded.value = true;
	};
	var unload = function unload() {
		if (!document || !isLoaded.value) return;
		stop();
		T(styleRef.value) && document.head.removeChild(styleRef.value);
		isLoaded.value = false;
		styleRef.value = null;
	};
	if (immediate && !manual) tryOnMounted(load);
	return {
		id,
		name,
		el: styleRef,
		css: cssRef,
		unload,
		load,
		isLoaded: (0, vue_exports.readonly)(isLoaded)
	};
}
//#endregion
//#region node_modules/@primevue/core/base/style/index.mjs
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
var _templateObject;
var _templateObject2;
var _templateObject3;
var _templateObject4;
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = true, o = false;
		try {
			if (i = (t = t.call(r)).next, 0 === l);
			else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = true, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), true).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: true,
		configurable: true,
		writable: true
	}) : e[r] = t, e;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r);
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _taggedTemplateLiteral(e, t) {
	return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var BaseStyle = {
	name: "base",
	css: function css(_ref) {
		var dt = _ref.dt;
		return "\n.p-hidden-accessible {\n    border: 0;\n    clip: rect(0 0 0 0);\n    height: 1px;\n    margin: -1px;\n    opacity: 0;\n    overflow: hidden;\n    padding: 0;\n    pointer-events: none;\n    position: absolute;\n    white-space: nowrap;\n    width: 1px;\n}\n\n.p-overflow-hidden {\n    overflow: hidden;\n    padding-right: ".concat(dt("scrollbar.width"), ";\n}\n");
	},
	style,
	classes: {},
	inlineStyles: {},
	load: function load(style) {
		var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var computedStyle = (arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(cs) {
			return cs;
		})(ar(_templateObject || (_templateObject = _taggedTemplateLiteral(["", ""])), style));
		return s$1(computedStyle) ? useStyle(Y$2(computedStyle), _objectSpread({ name: this.name }, options)) : {};
	},
	loadCSS: function loadCSS() {
		var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		return this.load(this.css, options);
	},
	loadStyle: function loadStyle() {
		var _this = this;
		var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		var style = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
		return this.load(this.style, options, function() {
			var computedStyle = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
			return S.transformCSS(options.name || _this.name, "".concat(computedStyle).concat(ar(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["", ""])), style)));
		});
	},
	getCommonTheme: function getCommonTheme(params) {
		return S.getCommon(this.name, params);
	},
	getComponentTheme: function getComponentTheme(params) {
		return S.getComponent(this.name, params);
	},
	getDirectiveTheme: function getDirectiveTheme(params) {
		return S.getDirective(this.name, params);
	},
	getPresetTheme: function getPresetTheme(preset, selector, params) {
		return S.getCustomPreset(this.name, preset, selector, params);
	},
	getLayerOrderThemeCSS: function getLayerOrderThemeCSS() {
		return S.getLayerOrderCSS(this.name);
	},
	getStyleSheet: function getStyleSheet() {
		var extendedCSS = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
		var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		if (this.css) {
			var _css = m(this.css, { dt: E }) || "";
			var _style = Y$2(ar(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral([
				"",
				"",
				""
			])), _css, extendedCSS));
			var _props = Object.entries(props).reduce(function(acc, _ref2) {
				var _ref3 = _slicedToArray(_ref2, 2), k = _ref3[0], v = _ref3[1];
				return acc.push("".concat(k, "=\"").concat(v, "\"")) && acc;
			}, []).join(" ");
			return s$1(_style) ? "<style type=\"text/css\" data-primevue-style-id=\"".concat(this.name, "\" ").concat(_props, ">").concat(_style, "</style>") : "";
		}
		return "";
	},
	getCommonThemeStyleSheet: function getCommonThemeStyleSheet(params) {
		var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		return S.getCommonStyleSheet(this.name, params, props);
	},
	getThemeStyleSheet: function getThemeStyleSheet(params) {
		var props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		var css = [S.getStyleSheet(this.name, params, props)];
		if (this.style) {
			var name = this.name === "base" ? "global-style" : "".concat(this.name, "-style");
			var _css = ar(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["", ""])), m(this.style, { dt: E }));
			var _style = Y$2(S.transformCSS(name, _css));
			var _props = Object.entries(props).reduce(function(acc, _ref4) {
				var _ref5 = _slicedToArray(_ref4, 2), k = _ref5[0], v = _ref5[1];
				return acc.push("".concat(k, "=\"").concat(v, "\"")) && acc;
			}, []).join(" ");
			s$1(_style) && css.push("<style type=\"text/css\" data-primevue-style-id=\"".concat(name, "\" ").concat(_props, ">").concat(_style, "</style>"));
		}
		return css.join("");
	},
	extend: function extend(inStyle) {
		return _objectSpread(_objectSpread({}, this), {}, {
			css: void 0,
			style: void 0
		}, inStyle);
	}
};
//#endregion
export { F$1 as A, l as B, et as C, z as D, vt as E, a as F, s$1 as G, ne$1 as H, c$1 as I, g as L, J as M, M$1 as N, s as O, X as P, i as R, c as S, v$1 as T, p as U, m as V, q as W, U as _, $t as a, b$1 as b, D as c, Lt as d, P as f, Tt as g, S$1 as h, ke as i, H as j, C$2 as k, I as l, Rt as m, N as n, At as o, Q$1 as p, S as r, C$1 as s, BaseStyle as t, K as u, W as v, tt as w, bt as x, Yt as y, k$2 as z };
