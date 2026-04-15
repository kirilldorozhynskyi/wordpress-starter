import { t as vue_exports } from "./assets/vue-Cqm1d2TX.js";
import { a as router, i as usePage, n as head_default, r as link_default, t as createInertiaApp } from "./assets/dist-C9WztoGj.js";
import { n as require_server_renderer_cjs_prod, t as server_renderer_exports } from "./assets/server-renderer-BcpEk759.js";
import { t as createI18n } from "./assets/vue-i18n-6XnVerM2.js";
import { n as registerPrimeVueApp, r as createPrimeVueOptions } from "./assets/primevue-CXR9t6jb.js";
import { O as ke } from "./assets/dist-D3DM3lbw.js";
import { t as PrimeVue } from "./assets/config-D4ZX77Yd.js";
import { t as Qr } from "./assets/aura-DktPOngt.js";
import { createServer } from "http";
import cluster from "node:cluster";
import { existsSync, readFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import path from "node:path";
import * as process2 from "process";
//#region node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
	const c = chars.charCodeAt(i);
	intToChar[i] = c;
	charToInt[c] = i;
}
function decodeInteger(reader, relative) {
	let value = 0;
	let shift = 0;
	let integer = 0;
	do {
		integer = charToInt[reader.next()];
		value |= (integer & 31) << shift;
		shift += 5;
	} while (integer & 32);
	const shouldNegate = value & 1;
	value >>>= 1;
	if (shouldNegate) value = -2147483648 | -value;
	return relative + value;
}
function hasMoreVlq(reader, max) {
	if (reader.pos >= max) return false;
	return reader.peek() !== comma;
}
var StringReader = class {
	constructor(buffer) {
		this.pos = 0;
		this.buffer = buffer;
	}
	next() {
		return this.buffer.charCodeAt(this.pos++);
	}
	peek() {
		return this.buffer.charCodeAt(this.pos);
	}
	indexOf(char) {
		const { buffer, pos } = this;
		const idx = buffer.indexOf(char, pos);
		return idx === -1 ? buffer.length : idx;
	}
};
function decode(mappings) {
	const { length } = mappings;
	const reader = new StringReader(mappings);
	const decoded = [];
	let genColumn = 0;
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	do {
		const semi = reader.indexOf(";");
		const line = [];
		let sorted = true;
		let lastCol = 0;
		genColumn = 0;
		while (reader.pos < semi) {
			let seg;
			genColumn = decodeInteger(reader, genColumn);
			if (genColumn < lastCol) sorted = false;
			lastCol = genColumn;
			if (hasMoreVlq(reader, semi)) {
				sourcesIndex = decodeInteger(reader, sourcesIndex);
				sourceLine = decodeInteger(reader, sourceLine);
				sourceColumn = decodeInteger(reader, sourceColumn);
				if (hasMoreVlq(reader, semi)) {
					namesIndex = decodeInteger(reader, namesIndex);
					seg = [
						genColumn,
						sourcesIndex,
						sourceLine,
						sourceColumn,
						namesIndex
					];
				} else seg = [
					genColumn,
					sourcesIndex,
					sourceLine,
					sourceColumn
				];
			} else seg = [genColumn];
			line.push(seg);
			reader.pos++;
		}
		if (!sorted) sort(line);
		decoded.push(line);
		reader.pos = semi + 1;
	} while (reader.pos <= length);
	return decoded;
}
function sort(line) {
	line.sort(sortComparator$1);
}
function sortComparator$1(a, b) {
	return a[0] - b[0];
}
//#endregion
//#region node_modules/@jridgewell/resolve-uri/dist/resolve-uri.mjs
var schemeRegex = /^[\w+.-]+:\/\//;
/**
* Matches the parts of a URL:
* 1. Scheme, including ":", guaranteed.
* 2. User/password, including "@", optional.
* 3. Host, guaranteed.
* 4. Port, including ":", optional.
* 5. Path, including "/", optional.
* 6. Query, including "?", optional.
* 7. Hash, including "#", optional.
*/
var urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
/**
* File URLs are weird. They dont' need the regular `//` in the scheme, they may or may not start
* with a leading `/`, they can have a domain (but only if they don't start with a Windows drive).
*
* 1. Host, optional.
* 2. Path, which may include "/", guaranteed.
* 3. Query, including "?", optional.
* 4. Hash, including "#", optional.
*/
var fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
function isAbsoluteUrl(input) {
	return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
	return input.startsWith("//");
}
function isAbsolutePath(input) {
	return input.startsWith("/");
}
function isFileUrl(input) {
	return input.startsWith("file:");
}
function isRelative(input) {
	return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
	const match = urlRegex.exec(input);
	return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
}
function parseFileUrl(input) {
	const match = fileRegex.exec(input);
	const path = match[2];
	return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path) ? path : "/" + path, match[3] || "", match[4] || "");
}
function makeUrl(scheme, user, host, port, path, query, hash) {
	return {
		scheme,
		user,
		host,
		port,
		path,
		query,
		hash,
		type: 7
	};
}
function parseUrl(input) {
	if (isSchemeRelativeUrl(input)) {
		const url = parseAbsoluteUrl("http:" + input);
		url.scheme = "";
		url.type = 6;
		return url;
	}
	if (isAbsolutePath(input)) {
		const url = parseAbsoluteUrl("http://foo.com" + input);
		url.scheme = "";
		url.host = "";
		url.type = 5;
		return url;
	}
	if (isFileUrl(input)) return parseFileUrl(input);
	if (isAbsoluteUrl(input)) return parseAbsoluteUrl(input);
	const url = parseAbsoluteUrl("http://foo.com/" + input);
	url.scheme = "";
	url.host = "";
	url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
	return url;
}
function stripPathFilename(path) {
	if (path.endsWith("/..")) return path;
	const index = path.lastIndexOf("/");
	return path.slice(0, index + 1);
}
function mergePaths(url, base) {
	normalizePath(base, base.type);
	if (url.path === "/") url.path = base.path;
	else url.path = stripPathFilename(base.path) + url.path;
}
/**
* The path can have empty directories "//", unneeded parents "foo/..", or current directory
* "foo/.". We need to normalize to a standard representation.
*/
function normalizePath(url, type) {
	const rel = type <= 4;
	const pieces = url.path.split("/");
	let pointer = 1;
	let positive = 0;
	let addTrailingSlash = false;
	for (let i = 1; i < pieces.length; i++) {
		const piece = pieces[i];
		if (!piece) {
			addTrailingSlash = true;
			continue;
		}
		addTrailingSlash = false;
		if (piece === ".") continue;
		if (piece === "..") {
			if (positive) {
				addTrailingSlash = true;
				positive--;
				pointer--;
			} else if (rel) pieces[pointer++] = piece;
			continue;
		}
		pieces[pointer++] = piece;
		positive++;
	}
	let path = "";
	for (let i = 1; i < pointer; i++) path += "/" + pieces[i];
	if (!path || addTrailingSlash && !path.endsWith("/..")) path += "/";
	url.path = path;
}
/**
* Attempts to resolve `input` URL/path relative to `base`.
*/
function resolve(input, base) {
	if (!input && !base) return "";
	const url = parseUrl(input);
	let inputType = url.type;
	if (base && inputType !== 7) {
		const baseUrl = parseUrl(base);
		const baseType = baseUrl.type;
		switch (inputType) {
			case 1: url.hash = baseUrl.hash;
			case 2: url.query = baseUrl.query;
			case 3:
			case 4: mergePaths(url, baseUrl);
			case 5:
				url.user = baseUrl.user;
				url.host = baseUrl.host;
				url.port = baseUrl.port;
			case 6: url.scheme = baseUrl.scheme;
		}
		if (baseType > inputType) inputType = baseType;
	}
	normalizePath(url, inputType);
	const queryHash = url.query + url.hash;
	switch (inputType) {
		case 2:
		case 3: return queryHash;
		case 4: {
			const path = url.path.slice(1);
			if (!path) return queryHash || ".";
			if (isRelative(base || input) && !isRelative(path)) return "./" + path + queryHash;
			return path + queryHash;
		}
		case 5: return url.path + queryHash;
		default: return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
	}
}
//#endregion
//#region node_modules/@jridgewell/trace-mapping/dist/trace-mapping.mjs
function stripFilename(path) {
	if (!path) return "";
	const index = path.lastIndexOf("/");
	return path.slice(0, index + 1);
}
function resolver(mapUrl, sourceRoot) {
	const from = stripFilename(mapUrl);
	const prefix = sourceRoot ? sourceRoot + "/" : "";
	return (source) => resolve(prefix + (source || ""), from);
}
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;
function maybeSort(mappings, owned) {
	const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
	if (unsortedIndex === mappings.length) return mappings;
	if (!owned) mappings = mappings.slice();
	for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) mappings[i] = sortSegments(mappings[i], owned);
	return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
	for (let i = start; i < mappings.length; i++) if (!isSorted(mappings[i])) return i;
	return mappings.length;
}
function isSorted(line) {
	for (let j = 1; j < line.length; j++) if (line[j][COLUMN] < line[j - 1][COLUMN]) return false;
	return true;
}
function sortSegments(line, owned) {
	if (!owned) line = line.slice();
	return line.sort(sortComparator);
}
function sortComparator(a, b) {
	return a[COLUMN] - b[COLUMN];
}
var found = false;
function binarySearch(haystack, needle, low, high) {
	while (low <= high) {
		const mid = low + (high - low >> 1);
		const cmp = haystack[mid][COLUMN] - needle;
		if (cmp === 0) {
			found = true;
			return mid;
		}
		if (cmp < 0) low = mid + 1;
		else high = mid - 1;
	}
	found = false;
	return low - 1;
}
function upperBound(haystack, needle, index) {
	for (let i = index + 1; i < haystack.length; index = i++) if (haystack[i][COLUMN] !== needle) break;
	return index;
}
function lowerBound(haystack, needle, index) {
	for (let i = index - 1; i >= 0; index = i--) if (haystack[i][COLUMN] !== needle) break;
	return index;
}
function memoizedState() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
function memoizedBinarySearch(haystack, needle, state, key) {
	const { lastKey, lastNeedle, lastIndex } = state;
	let low = 0;
	let high = haystack.length - 1;
	if (key === lastKey) {
		if (needle === lastNeedle) {
			found = lastIndex !== -1 && haystack[lastIndex][COLUMN] === needle;
			return lastIndex;
		}
		if (needle >= lastNeedle) low = lastIndex === -1 ? 0 : lastIndex;
		else high = lastIndex;
	}
	state.lastKey = key;
	state.lastNeedle = needle;
	return state.lastIndex = binarySearch(haystack, needle, low, high);
}
function parse(map) {
	return typeof map === "string" ? JSON.parse(map) : map;
}
var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
var TraceMap = class {
	constructor(map, mapUrl) {
		const isString = typeof map === "string";
		if (!isString && map._decodedMemo) return map;
		const parsed = parse(map);
		const { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
		this.version = version;
		this.file = file;
		this.names = names || [];
		this.sourceRoot = sourceRoot;
		this.sources = sources;
		this.sourcesContent = sourcesContent;
		this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
		const resolve = resolver(mapUrl, sourceRoot);
		this.resolvedSources = sources.map(resolve);
		const { mappings } = parsed;
		if (typeof mappings === "string") {
			this._encoded = mappings;
			this._decoded = void 0;
		} else if (Array.isArray(mappings)) {
			this._encoded = void 0;
			this._decoded = maybeSort(mappings, isString);
		} else if (parsed.sections) throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
		else throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
		this._decodedMemo = memoizedState();
		this._bySources = void 0;
		this._bySourceMemos = void 0;
	}
};
function cast(map) {
	return map;
}
function decodedMappings(map) {
	var _a;
	return (_a = cast(map))._decoded || (_a._decoded = decode(cast(map)._encoded));
}
function originalPositionFor(map, needle) {
	let { line, column, bias } = needle;
	line--;
	if (line < 0) throw new Error(LINE_GTR_ZERO);
	if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
	const decoded = decodedMappings(map);
	if (line >= decoded.length) return OMapping(null, null, null, null);
	const segments = decoded[line];
	const index = traceSegmentInternal(segments, cast(map)._decodedMemo, line, column, bias || 1);
	if (index === -1) return OMapping(null, null, null, null);
	const segment = segments[index];
	if (segment.length === 1) return OMapping(null, null, null, null);
	const { names, resolvedSources } = map;
	return OMapping(resolvedSources[segment[SOURCES_INDEX]], segment[SOURCE_LINE] + 1, segment[SOURCE_COLUMN], segment.length === 5 ? names[segment[NAMES_INDEX]] : null);
}
function OMapping(source, line, column, name) {
	return {
		source,
		line,
		column,
		name
	};
}
function traceSegmentInternal(segments, memo, line, column, bias) {
	let index = memoizedBinarySearch(segments, column, memo, line);
	if (found) index = (bias === -1 ? upperBound : lowerBound)(segments, column, index);
	else if (bias === -1) index++;
	if (index === -1 || index === segments.length) return -1;
	return index;
}
//#endregion
//#region node_modules/@inertiajs/core/dist/server.js
var sourceMapResolver = null;
function setSourceMapResolver(resolver) {
	sourceMapResolver = resolver;
}
var BROWSER_APIS = {
	window: "The global window object",
	document: "The DOM document object",
	navigator: "The navigator object",
	location: "The location object",
	history: "The browser history API",
	screen: "The screen object",
	localStorage: "Browser local storage",
	sessionStorage: "Browser session storage",
	innerWidth: "Browser viewport width",
	innerHeight: "Browser viewport height",
	outerWidth: "Browser window width",
	outerHeight: "Browser window height",
	scrollX: "Horizontal scroll position",
	scrollY: "Vertical scroll position",
	devicePixelRatio: "The device pixel ratio",
	matchMedia: "The matchMedia function",
	IntersectionObserver: "The IntersectionObserver API",
	ResizeObserver: "The ResizeObserver API",
	MutationObserver: "The MutationObserver API",
	requestAnimationFrame: "The requestAnimationFrame function",
	requestIdleCallback: "The requestIdleCallback function",
	Image: "The Image constructor",
	Audio: "The Audio constructor",
	Worker: "The Worker constructor",
	BroadcastChannel: "The BroadcastChannel constructor",
	fetch: "The fetch API",
	XMLHttpRequest: "The XMLHttpRequest API"
};
function detectBrowserApi(error) {
	const message = error.message.toLowerCase();
	for (const api of Object.keys(BROWSER_APIS)) if ([
		`${api.toLowerCase()} is not defined`,
		`'${api.toLowerCase()}' is not defined`,
		`"${api.toLowerCase()}" is not defined`,
		`cannot read properties of undefined (reading '${api.toLowerCase()}')`,
		`cannot read property '${api.toLowerCase()}'`
	].some((pattern) => message.includes(pattern))) return api;
	return null;
}
function isComponentResolutionError(error) {
	const message = error.message.toLowerCase();
	return message.includes("cannot find module") || message.includes("failed to resolve") || message.includes("module not found") || message.includes("could not resolve");
}
var LIFECYCLE_HOOKS = "onMounted/useEffect/onMount";
function getBrowserApiHint(api) {
	const apiDescription = BROWSER_APIS[api] || `The "${api}" object`;
	if (["localStorage", "sessionStorage"].includes(api)) return `${apiDescription} doesn't exist in Node.js. Check "typeof ${api} !== 'undefined'" before using it, or move the code to a ${LIFECYCLE_HOOKS} lifecycle hook.`;
	if (["window", "document"].includes(api)) return `${apiDescription} doesn't exist in Node.js. Wrap browser-specific code in a ${LIFECYCLE_HOOKS} lifecycle hook, or check "typeof ${api} !== 'undefined'" before using it.`;
	if ([
		"IntersectionObserver",
		"ResizeObserver",
		"MutationObserver"
	].includes(api)) return `${apiDescription} doesn't exist in Node.js. Create observers inside a ${LIFECYCLE_HOOKS} lifecycle hook, not at the module level.`;
	if (["fetch", "XMLHttpRequest"].includes(api)) return `${apiDescription} may not be available in all Node.js versions. For SSR, ensure data fetching happens on the server (in your controller) and is passed as props, or use a ${LIFECYCLE_HOOKS} hook for client-side fetching.`;
	return `${apiDescription} doesn't exist in Node.js. Move this code to a ${LIFECYCLE_HOOKS} lifecycle hook, or guard it with "typeof ${api} !== 'undefined'".`;
}
function getComponentResolutionHint(component) {
	return `Could not resolve component${component ? ` "${component}"` : ""}. Check that the file exists and the path is correct. Ensure the component name matches the file name exactly (case-sensitive).`;
}
function getRenderErrorHint() {
	return "An error occurred while rendering the component. Check the component for browser-specific code that runs during initialization. Move any code that accesses browser APIs to a lifecycle hook.";
}
function extractSourceLocation(stack) {
	if (!stack) return;
	for (const line of stack.split("\n")) {
		if (!line.includes("at ")) continue;
		if (line.includes("node_modules") || line.includes("node:")) continue;
		let match = line.match(/\(([^)]+):(\d+):(\d+)\)/);
		if (!match) match = line.match(/at\s+(?:file:\/\/)?(.+):(\d+):(\d+)\s*$/);
		if (match) {
			const file = match[1].replace(/^file:\/\//, "");
			const lineNum = parseInt(match[2], 10);
			const colNum = parseInt(match[3], 10);
			if (sourceMapResolver) {
				const resolved = sourceMapResolver(file, lineNum, colNum);
				if (resolved) return `${resolved.file}:${resolved.line}:${resolved.column}`;
			}
			return `${file}:${lineNum}:${colNum}`;
		}
	}
}
function classifySSRError(error, component, url) {
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const base = {
		error: error.message,
		component,
		url,
		stack: error.stack,
		sourceLocation: extractSourceLocation(error.stack),
		timestamp
	};
	const browserApi = detectBrowserApi(error);
	if (browserApi) return {
		...base,
		type: "browser-api",
		browserApi,
		hint: getBrowserApiHint(browserApi)
	};
	if (isComponentResolutionError(error)) return {
		...base,
		type: "component-resolution",
		hint: getComponentResolutionHint(component)
	};
	return {
		...base,
		type: "render",
		hint: getRenderErrorHint()
	};
}
var colors = {
	reset: "\x1B[0m",
	red: "\x1B[31m",
	yellow: "\x1B[33m",
	cyan: "\x1B[36m",
	dim: "\x1B[2m",
	bold: "\x1B[1m",
	bgRed: "\x1B[41m",
	white: "\x1B[37m"
};
function makeRelative(path2, root) {
	const base = root ?? process.cwd();
	if (path2.startsWith(base + "/")) return path2.slice(base.length + 1);
	return path2;
}
function formatConsoleError(classified, root, formatErrors = true, suppressedWarnings = []) {
	if (!formatErrors) return `SSR Error ${classified.component ? `[${classified.component}]` : ""}: ${classified.error}`;
	const componentPart = classified.component ? `  ${colors.cyan}${classified.component}${colors.reset}` : "";
	const lines = [
		"",
		`  ${colors.bgRed}${colors.white}${colors.bold} SSR ERROR ${colors.reset}${componentPart}`,
		"",
		`  ${classified.error}`
	];
	if (classified.sourceLocation) {
		const relativePath = makeRelative(classified.sourceLocation, root);
		lines.push(`  ${colors.dim}Source: ${relativePath}${colors.reset}`);
	}
	if (classified.url) lines.push(`  ${colors.dim}URL: ${classified.url}${colors.reset}`);
	lines.push("", `  ${colors.yellow}Hint${colors.reset}  ${classified.hint}`, "");
	if (classified.stack) lines.push(`  ${colors.dim}${classified.stack.split("\n").join("\n  ")}${colors.reset}`, "");
	if (suppressedWarnings.length > 0) lines.push(`  ${colors.dim}Suppressed ${suppressedWarnings.length} framework warning(s).${colors.reset}`, "");
	return lines.join("\n");
}
var sourceMaps = /* @__PURE__ */ new Map();
setSourceMapResolver((file, line, column) => {
	if (!file.includes("/ssr/") || !file.endsWith(".js")) return null;
	const mapFile = file + ".map";
	if (!existsSync(mapFile)) return null;
	let traceMap = sourceMaps.get(mapFile);
	if (!traceMap) try {
		traceMap = new TraceMap(readFileSync(mapFile, "utf-8"));
		sourceMaps.set(mapFile, traceMap);
	} catch {
		return null;
	}
	const original = originalPositionFor(traceMap, {
		line,
		column
	});
	if (original.source) {
		const mapDir = path.dirname(mapFile);
		return {
			file: path.resolve(mapDir, original.source),
			line: original.line ?? line,
			column: original.column ?? column
		};
	}
	return null;
});
var readableToString = (readable) => new Promise((resolve, reject) => {
	let data = "";
	readable.on("data", (chunk) => data += chunk);
	readable.on("end", () => resolve(data));
	readable.on("error", (err) => reject(err));
});
var server_default = (render, options) => {
	const { port = 13714, cluster: useCluster = false, formatErrors = true } = (typeof options === "number" ? { port: options } : options) ?? {};
	const log = (message) => {
		console.log(useCluster && !cluster.isPrimary ? `[${cluster.worker?.id ?? "N/A"} / ${cluster.worker?.process?.pid ?? "N/A"}] ${message}` : message);
	};
	if (useCluster && cluster.isPrimary) {
		log("Primary Inertia SSR server process started...");
		for (let i = 0; i < availableParallelism(); i++) cluster.fork();
		cluster.on("message", (_worker, message) => {
			if (message === "shutdown") {
				for (const id in cluster.workers) cluster.workers[id]?.kill();
				process2.exit();
			}
		});
		return render;
	}
	const handleRender = async (request, response) => {
		const page = JSON.parse(await readableToString(request));
		const originalWarn = console.warn;
		if (formatErrors) console.warn = () => {};
		try {
			const result = await render(page);
			response.writeHead(200, {
				"Content-Type": "application/json",
				Server: "Inertia.js SSR"
			});
			response.write(JSON.stringify(result));
		} catch (e) {
			const error = e;
			if (!formatErrors) throw error;
			const classified = classifySSRError(error, page.component, page.url);
			console.error(formatConsoleError(classified));
			response.writeHead(500, {
				"Content-Type": "application/json",
				Server: "Inertia.js SSR"
			});
			response.write(JSON.stringify(classified));
		} finally {
			console.warn = originalWarn;
		}
	};
	const routes = {
		"/health": async () => ({
			status: "OK",
			timestamp: Date.now()
		}),
		"/shutdown": async () => {
			if (cluster.isWorker) process2.send?.("shutdown");
			process2.exit();
		},
		"/render": handleRender,
		"/404": async () => ({
			status: "NOT_FOUND",
			timestamp: Date.now()
		})
	};
	createServer(async (request, response) => {
		const result = await (routes[request.url] ?? routes["/404"])(request, response);
		if (!response.headersSent) {
			response.writeHead(200, {
				"Content-Type": "application/json",
				Server: "Inertia.js SSR"
			});
			response.write(JSON.stringify(result));
		}
		response.end();
	}).listen(port, () => log("Inertia SSR server started."));
	log(`Starting SSR server on port ${port}...`);
	return render;
};
//#endregion
//#region wp-content/plugins/inertia-wordpress/resources/plugins/shared/resolvePageTemplate.js
var import_server_renderer_cjs_prod = require_server_renderer_cjs_prod();
var resolvePageTemplate = async (templates, query, extension) => {
	if (!templates || !query) return null;
	const params = query ? new URLSearchParams(query) : null;
	const regex = extension ? new RegExp("." + extension + "$") : "";
	const template = params ? atob(params.get("template")).replace(regex, "") : null;
	let resolvedTemplate = templates[Object.keys(templates).find((key) => {
		return key.includes(template);
	})] ?? null;
	resolvedTemplate = resolvedTemplate && typeof resolvedTemplate === "function" ? await resolvedTemplate() : resolvedTemplate;
	const processedTemplate = resolvedTemplate?.default ?? resolvedTemplate;
	if (processedTemplate) processedTemplate._is_template = true;
	return processedTemplate;
};
//#endregion
//#region wp-content/plugins/inertia-wordpress/resources/plugins/shared/resolvePageLayout.js
var resolvePageLayout = (resolvedPage, layout, resolvedTemplate) => {
	let resolvedLayout = resolvedPage.default.layout || layout;
	if (!resolvedLayout) return null;
	resolvedLayout = Array.isArray(resolvedLayout) ? resolvedLayout : [resolvedLayout];
	resolvedLayout = resolvedLayout.filter((item) => item._is_template !== true);
	if (resolvedTemplate && resolvedLayout.includes(resolvedTemplate) === false) resolvedLayout.push(resolvedTemplate);
	return resolvedLayout.filter((item) => !!item);
};
//#endregion
//#region wp-content/plugins/inertia-wordpress/resources/plugins/vue/helpers/resolveInertiaPage.js
var resolveInertiaPage = (glob, layout = null, args = {}) => {
	if (typeof args === "function") {
		console.error("Third argument to resolveInertiaPage must now be an object. Check documentation for full details");
		return;
	}
	const { layoutCallback, templates } = args;
	return async function(name) {
		const [resolvedName, query] = name.split("?");
		const resolvedTemplate = await resolvePageTemplate(templates, query, "vue");
		let resolvedPage = glob[`./pages/${resolvedName}.vue`];
		if (!resolvedPage) {
			console.error(`[Inertia] Couldn't find page matching "${resolvedName}"`);
			return null;
		}
		if (typeof resolvedPage === "function") resolvedPage = await resolvedPage();
		if (layoutCallback) resolvedPage.default.layout = layoutCallback(resolvedName, resolvedPage, resolvedTemplate);
		else resolvedPage.default.layout = resolvePageLayout(resolvedPage, layout, resolvedTemplate);
		return resolvedPage;
	};
};
//#endregion
//#region wp-content/plugins/inertia-wordpress/resources/plugins/vue/components/TheSeoFramework.vue
var _sfc_main$4 = {
	__name: "TheSeoFramework",
	__ssrInlineRender: true,
	setup(__props) {
		const seo = (0, vue_exports.computed)(() => usePage().props.seo);
		const schema = (0, vue_exports.computed)(() => {
			return JSON.stringify({
				"@context": "https://schema.org",
				"@graph": seo.value.schema
			});
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), (0, vue_exports.mergeProps)({ title: seo.value.title }, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(seo.value.links, (link) => {
							_push(`<link${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ ref_for: true }, link))}${_scopeId}>`);
						});
						_push(`<!--]--><!--[-->`);
						(0, server_renderer_exports.ssrRenderList)(seo.value.meta, (meta) => {
							_push(`<meta${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ ref_for: true }, meta))}${_scopeId}>`);
						});
						_push(`<!--]-->`);
						(0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)("script"), { type: "application/ld+json" }, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(schema.value)}`);
								else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(schema.value), 1)];
							}),
							_: 1
						}), _parent, _scopeId);
					} else return [
						((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(seo.value.links, (link) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("link", (0, vue_exports.mergeProps)({ ref_for: true }, link), null, 16);
						}), 256)),
						((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(seo.value.meta, (meta) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("meta", (0, vue_exports.mergeProps)({ ref_for: true }, meta), null, 16);
						}), 256)),
						((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)("script"), { type: "application/ld+json" }, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(schema.value), 1)]),
							_: 1
						}))
					];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../plugins/inertia-wordpress/resources/plugins/vue/components/TheSeoFramework.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/layout/Footer.vue
var _sfc_main$3 = {
	__name: "Footer",
	__ssrInlineRender: true,
	props: { siteName: {
		type: String,
		default: ""
	} },
	setup(__props) {
		const year = (0, vue_exports.computed)(() => (/* @__PURE__ */ new Date()).getFullYear());
		return (_ctx, _push, _parent, _attrs) => {
			const _component_SvgIcon = (0, vue_exports.resolveComponent)("SvgIcon");
			_push(`<footer${(0, server_renderer_exports.ssrRenderAttrs)(_attrs)}>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_SvgIcon, { name: "angle" }, null, _parent));
			_push(`<div>© ${(0, server_renderer_exports.ssrInterpolate)(year.value)} ${(0, server_renderer_exports.ssrInterpolate)(__props.siteName)}</div></footer>`);
		};
	}
};
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/layout/Footer.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/layout/Navigation/HeaderNav.vue
var _sfc_main$2 = {
	__name: "HeaderNav",
	__ssrInlineRender: true,
	props: {
		menu: Object,
		header: Object,
		isStickyLick: Boolean
	},
	emits: ["update:menuOpened"],
	setup(__props, { emit: __emit }) {
		usePage();
		const emit = __emit;
		const menuOpened = (0, vue_exports.ref)(false);
		const setScrollLock = (locked) => {
			const lenis = typeof window !== "undefined" ? window.lenis : null;
			if (lenis && typeof lenis.stop === "function" && typeof lenis.start === "function") locked ? lenis.stop() : lenis.start();
		};
		const closeMenu = () => {
			menuOpened.value = false;
			emit("update:menuOpened", menuOpened.value);
			setScrollLock(false);
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Button = (0, vue_exports.resolveComponent)("Button");
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "" }, _attrs))}>`);
			if (menuOpened.value) _push(`<div class="fixed top-0 left-0 h-screen w-screen"></div>`);
			else _push(`<!---->`);
			_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([menuOpened.value ? "max-lg:translate-x-0" : "max-lg:translate-x-full", "transition-all duration-700 ease-in-out max-lg:fixed max-lg:top-0 max-lg:right-0 max-lg:h-screen max-lg:w-full max-lg:overflow-y-auto max-lg:bg-white max-lg:pt-24"])}"><div class="${(0, server_renderer_exports.ssrRenderClass)([menuOpened.value ? "text-primary" : "text-light", "max-lg:container max-lg:py-16"])}"><div class="flex items-start gap-10 max-lg:flex-wrap xl:gap-24">`);
			if (__props.menu?.items) {
				_push(`<ul class="flex items-start gap-8 max-lg:flex-col"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(__props.menu.items, (item) => {
					_push(`<li class="flex">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_Button, {
						btn: item,
						class: ["text-sm", item.current ? "link-underlined" : "link-hover-underlined"],
						onClick: ($event) => closeMenu()
					}, null, _parent));
					_push(`</li>`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			_push(`</div></div></div><button type="button" class="${(0, server_renderer_exports.ssrRenderClass)([menuOpened.value ? "text-dark-gold hover:text-dark-gold-100" : "dark:text-dark-gold-100 text-light hover:text-white/80", "relative flex size-6 cursor-pointer flex-col items-center justify-center gap-1 lg:hidden"])}"${(0, server_renderer_exports.ssrRenderAttr)("aria-label", menuOpened.value ? _ctx.$t("menu.close") : _ctx.$t("menu.toggle"))}><span class="${(0, server_renderer_exports.ssrRenderClass)([menuOpened.value ? "translate-y-0.75 rotate-45" : " ", "h-0.5 w-4.5 origin-center rounded-full bg-current transition"])}"></span><span class="${(0, server_renderer_exports.ssrRenderClass)([menuOpened.value ? "-translate-y-0.75 -rotate-45" : " ", "h-0.5 w-4.5 origin-center rounded-full bg-current transition"])}"></span></button></div>`);
		};
	}
};
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/layout/Navigation/HeaderNav.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/components/layout/Header.vue
var _sfc_main$1 = {
	__name: "Header",
	__ssrInlineRender: true,
	props: {
		homeUrl: {
			type: String,
			default: "/"
		},
		siteName: {
			type: String,
			default: ""
		},
		menu: Object,
		options: Object
	},
	setup(__props) {
		const headerEl = (0, vue_exports.ref)(null);
		const lastScrollTop = (0, vue_exports.ref)(0);
		const isStickyLick = (0, vue_exports.ref)(false);
		const isSticky = (0, vue_exports.ref)(false);
		const showTop = (0, vue_exports.ref)(false);
		const menuOpened = (0, vue_exports.ref)(false);
		const handleScroll = () => {
			const currentScrollTop = window.scrollY || 0;
			if (currentScrollTop > 200) {
				isStickyLick.value = true;
				if (currentScrollTop > 280) {
					isSticky.value = true;
					if (currentScrollTop > lastScrollTop.value) showTop.value = false;
					else showTop.value = true;
				} else showTop.value = false;
			} else {
				isSticky.value = false;
				isStickyLick.value = false;
				showTop.value = false;
			}
			lastScrollTop.value = currentScrollTop;
		};
		(0, vue_exports.onMounted)(() => {
			window.addEventListener("scroll", handleScroll, { passive: true });
			handleScroll();
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			window.removeEventListener("scroll", handleScroll);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Link = (0, vue_exports.resolveComponent)("Link");
			const _component_SvgObject = (0, vue_exports.resolveComponent)("SvgObject");
			_push(`<header${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({
				ref_key: "headerEl",
				ref: headerEl,
				class: ["absolute top-0 right-0 left-0 z-99", {
					"fixed -translate-y-full transform": isStickyLick.value,
					transit: isSticky.value,
					"-translate-y-26!": isSticky.value,
					"translate-y-0!": showTop.value
				}]
			}, _attrs))}><div class="${(0, server_renderer_exports.ssrRenderClass)({ "transit bg-primary": isStickyLick.value })}"><div class="relative z-20 container"><div class="${(0, server_renderer_exports.ssrRenderClass)([isStickyLick.value || menuOpened.value ? "text-green-400" : "text-light lg:py-6", "flex items-center justify-between py-4"])}">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_Link, {
				href: __props.homeUrl,
				"aria-label": __props.siteName,
				class: "relative z-20 inline-block w-fit",
				prefetch: ""
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_SvgObject, {
						class: "h-auto max-md:w-29",
						width: "135",
						height: "56",
						"aria-label": __props.siteName,
						src: `${_ctx.$page.props.theme.uri}/resources/Public/Images/logo.svg`
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_SvgObject, {
						class: "h-auto max-md:w-29",
						width: "135",
						height: "56",
						"aria-label": __props.siteName,
						src: `${_ctx.$page.props.theme.uri}/resources/Public/Images/logo.svg`
					}, null, 8, ["aria-label", "src"])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, {
				menu: __props.menu,
				isStickyLick: isStickyLick.value,
				"onUpdate:menuOpened": ($event) => menuOpened.value = $event
			}, null, _parent));
			_push(`</div></div></div></header>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/components/layout/Header.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/layouts/Layout.vue
var _sfc_main = {
	__name: "Layout",
	__ssrInlineRender: true,
	setup(__props) {
		const page = usePage();
		const pageTitle = (0, vue_exports.computed)(() => page.props?.seo?.title ?? page.props?.title ?? null);
		const logo = (0, vue_exports.computed)(() => page.props?.wp?.logo ?? null);
		const homeUrl = (0, vue_exports.computed)(() => page.props?.wp?.homeUrl ?? "/");
		const siteName = (0, vue_exports.computed)(() => page.props?.wp?.name ?? "");
		const headerMenu = (0, vue_exports.computed)(() => page.props?.menu?.header ?? null);
		const syncPageDataAttribute = () => {
			if (typeof document === "undefined") return;
			const appElement = document.getElementById("app");
			if (!appElement) return;
			try {
				appElement.setAttribute("data-page", JSON.stringify({
					component: page.component,
					props: page.props,
					url: page.url,
					version: page.version,
					clearHistory: page.clearHistory,
					deferredProps: page.deferredProps,
					mergeProps: page.mergeProps,
					prependProps: page.prependProps,
					deepMergeProps: page.deepMergeProps,
					matchPropsOn: page.matchPropsOn,
					rememberedState: page.rememberedState,
					encryptHistory: page.encryptHistory,
					scrollProps: page.scrollProps,
					flash: page.props?.flash ?? {}
				}));
			} catch (error) {
				console.error("[Inertia] Failed to sync legacy data-page payload.", error);
			}
		};
		let removeFinishListener = null;
		(0, vue_exports.onMounted)(() => {
			syncPageDataAttribute();
			removeFinishListener = router.on("finish", () => {
				syncPageDataAttribute();
			});
		});
		(0, vue_exports.onBeforeUnmount)(() => {
			removeFinishListener?.();
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			if (pageTitle.value) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(head_default), { title: pageTitle.value }, null, _parent));
			else _push(`<!---->`);
			_push(`<div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
				"home-url": homeUrl.value,
				logo: logo.value,
				"site-name": siteName.value,
				menu: headerMenu.value
			}, null, _parent));
			_push(`<main>`);
			(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, { "site-name": siteName.value }, null, _parent));
			_push(`</div><!--]-->`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/Private/js/layouts/Layout.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var en_default = {
	datetimeFormats: {
		"short": {
			"year": "numeric",
			"month": "2-digit",
			"day": "2-digit"
		},
		"long": {
			"year": "numeric",
			"month": "short",
			"day": "numeric",
			"hour": "numeric",
			"minute": "numeric"
		}
	},
	form: {
		"loading": "Loading...",
		"success": "Thank you for your interest. Our team will contact you soon.",
		"send": "Send"
	},
	menu: {
		"toggle": "Open menu",
		"close": "Close menu"
	}
};
var sk_default = {
	datetimeFormats: {
		"short": {
			"year": "numeric",
			"month": "2-digit",
			"day": "2-digit"
		},
		"long": {
			"year": "numeric",
			"month": "short",
			"day": "numeric",
			"hour": "numeric",
			"minute": "numeric"
		}
	},
	form: {
		"loading": "Načitava sa...",
		"success": "Ďakujeme za váš záujem. Náš tím vás bude čoskoro kontaktovať.",
		"send": "Odoslať"
	},
	menu: {
		"toggle": "Otvoriť menu",
		"close": "Zavrieť menu"
	}
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/util/i18n.ts
function customRule(choice) {
	if (choice === 0) return 0;
	if (choice === 1) return 1;
	if (choice >= 2 && choice <= 4) return 2;
	if (choice >= 5 && choice <= 21) return 3;
	if (choice >= 22 && choice <= 24) return 2;
	return 3;
}
var messages = {
	en: en_default,
	sk: sk_default
};
var normalizeLocale = (locale) => {
	if (!locale) return null;
	return locale.toLowerCase().split(/[-_]/)[0];
};
var resolveLocale = (locale) => {
	const normalizedLocale = normalizeLocale(locale);
	if (normalizedLocale && normalizedLocale in messages) return normalizedLocale;
	if (typeof document !== "undefined") {
		const documentLocale = normalizeLocale(document.documentElement.lang || "en");
		if (documentLocale && documentLocale in messages) return documentLocale;
	}
	return "en";
};
var createI18nConfig = (locale) => ({
	legacy: false,
	datetimeFormats: {
		en: en_default.datetimeFormats,
		sk: sk_default.datetimeFormats
	},
	pluralRules: { sk: customRule },
	locale: resolveLocale(locale),
	messages
});
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/inertia.ts
var Image = (0, vue_exports.defineAsyncComponent)(() => import("./assets/ImageWP-BXgMMBpx.js"));
var Button = (0, vue_exports.defineAsyncComponent)(() => import("./assets/Button-CZzc_wkt.js"));
var SvgIcon = (0, vue_exports.defineAsyncComponent)(() => import("./assets/SvgIcon-BrvMjEY0.js"));
var SvgObject = (0, vue_exports.defineAsyncComponent)(() => import("./assets/Object-C-B1w7uB.js"));
var IdPage = (0, vue_exports.defineAsyncComponent)(() => import("./assets/IdPage-D1Petkq8.js"));
var primeVueCriticalLayouts = /* @__PURE__ */ new Set([]);
var clientPages = /* @__PURE__ */ Object.assign({
	"./pages/Archive.vue": () => import("./assets/Archive-3X_VSlaQ.js"),
	"./pages/Error.vue": () => import("./assets/Error-BJ8VHZrL.js"),
	"./pages/Home.vue": () => import("./assets/Home-9Z2E0_NO.js"),
	"./pages/Post.vue": () => import("./assets/Post-BMZhY-fj.js")
});
var createNoopLazyLoad = () => ({
	update() {},
	loadAll() {},
	restoreAll() {}
});
var getPageLocale = (page) => page?.props?.locale || page?.props?.site?.language || page?.props?.wp?.language || null;
var resolvePage = resolveInertiaPage(clientPages, _sfc_main);
var needsPrimeVueOnFirstRender = (page) => {
	return (Array.isArray(page?.props?.fields?.flexible_content) ? page.props.fields.flexible_content : []).slice(0, 2).some((item) => primeVueCriticalLayouts.has(item?.acf_fc_layout));
};
var createInertiaVueApp = ({ App, props, plugin, page, lazyLoad, hydrate = false, ssr = false }) => {
	const vueApp = (ssr || hydrate ? vue_exports.createSSRApp : vue_exports.createApp)({ render: () => (0, vue_exports.h)(App, props) });
	registerPrimeVueApp(vueApp);
	vueApp.use(plugin).use(createI18n(createI18nConfig(getPageLocale(page)))).component("Link", link_default).component("Head", head_default).component("Image", Image).component("Button", Button).component("SvgIcon", SvgIcon).component("SvgObject", SvgObject).component("IdPage", IdPage).provide("lazyLoad", lazyLoad ?? createNoopLazyLoad());
	return vueApp;
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/util/primevue-ssr.ts
var installedApps = /* @__PURE__ */ new WeakSet();
var installPrimeVueSSR = (app) => {
	if (!app || installedApps.has(app)) return;
	app.use(PrimeVue, createPrimeVueOptions(ke, Qr));
	app.directive("tooltip", {});
	installedApps.add(app);
};
//#endregion
//#region wp-content/themes/inertia/resources/Private/js/ssr.ts
server_default((page) => createInertiaApp({
	page,
	render: import_server_renderer_cjs_prod.renderToString,
	resolve: resolvePage,
	setup({ App, props, plugin }) {
		const vueApp = createInertiaVueApp({
			App,
			props,
			plugin,
			page,
			lazyLoad: createNoopLazyLoad(),
			ssr: true
		});
		if (needsPrimeVueOnFirstRender(page)) installPrimeVueSSR(vueApp);
		return vueApp;
	}
}));
//#endregion
export {};
