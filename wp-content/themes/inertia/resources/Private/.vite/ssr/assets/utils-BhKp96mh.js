import { B as At } from "./dist-D3DM3lbw.js";
//#region node_modules/@primeuix/utils/dist/zindex/index.mjs
function g() {
	let r = [], i = (e, n, t = 999) => {
		let s = u(e, n, t), o = s.value + (s.key === e ? 0 : t) + 1;
		return r.push({
			key: e,
			value: o
		}), o;
	}, d = (e) => {
		r = r.filter((n) => n.value !== e);
	}, a = (e, n) => u(e, n).value, u = (e, n, t = 0) => [...r].reverse().find((s) => n ? !0 : s.key === e) || {
		key: e,
		value: t
	}, l = (e) => e && parseInt(e.style.zIndex, 10) || 0;
	return {
		get: l,
		set: (e, n, t) => {
			n && (n.style.zIndex = String(i(e, !0, t)));
		},
		clear: (e) => {
			e && (d(l(e)), e.style.zIndex = "");
		},
		getCurrent: (e) => a(e, !0)
	};
}
var x = g();
//#endregion
//#region node_modules/@primevue/core/utils/index.mjs
function _typeof$1(o) {
	"@babel/helpers - typeof";
	return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof$1(o);
}
function _classCallCheck$1(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties$1(e, r) {
	for (var t = 0; t < r.length; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey$1(o.key), o);
	}
}
function _createClass$1(e, r, t) {
	return r && _defineProperties$1(e.prototype, r), Object.defineProperty(e, "prototype", { writable: false }), e;
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
	return String(t);
}
var ConnectedOverlayScrollHandler = /* @__PURE__ */ function() {
	function ConnectedOverlayScrollHandler(element) {
		var listener = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {};
		_classCallCheck$1(this, ConnectedOverlayScrollHandler);
		this.element = element;
		this.listener = listener;
	}
	return _createClass$1(ConnectedOverlayScrollHandler, [
		{
			key: "bindScrollListener",
			value: function bindScrollListener() {
				this.scrollableParents = At(this.element);
				for (var i = 0; i < this.scrollableParents.length; i++) this.scrollableParents[i].addEventListener("scroll", this.listener);
			}
		},
		{
			key: "unbindScrollListener",
			value: function unbindScrollListener() {
				if (this.scrollableParents) for (var i = 0; i < this.scrollableParents.length; i++) this.scrollableParents[i].removeEventListener("scroll", this.listener);
			}
		},
		{
			key: "destroy",
			value: function destroy() {
				this.unbindScrollListener();
				this.element = null;
				this.listener = null;
				this.scrollableParents = null;
			}
		}
	]);
}();
//#endregion
export { x as n, ConnectedOverlayScrollHandler as t };
