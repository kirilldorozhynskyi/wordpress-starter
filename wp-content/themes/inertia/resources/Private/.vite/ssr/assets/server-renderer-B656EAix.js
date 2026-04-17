import { a as __commonJSMin, c as __toESM, i as require_shared_cjs_prod, n as require_vue_cjs_prod, o as __exportAll, r as require_compiler_dom_cjs_prod, s as __reExport } from "./vue-CfOZE8S3.js";
//#region node_modules/@vue/compiler-ssr/dist/compiler-ssr.cjs.js
/**
* @vue/compiler-ssr v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var require_compiler_ssr_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var compilerDom = require_compiler_dom_cjs_prod();
	var shared = require_shared_cjs_prod();
	var SSR_INTERPOLATE = /* @__PURE__ */ Symbol(`ssrInterpolate`);
	var SSR_RENDER_VNODE = /* @__PURE__ */ Symbol(`ssrRenderVNode`);
	var SSR_RENDER_COMPONENT = /* @__PURE__ */ Symbol(`ssrRenderComponent`);
	var SSR_RENDER_SLOT = /* @__PURE__ */ Symbol(`ssrRenderSlot`);
	var SSR_RENDER_SLOT_INNER = /* @__PURE__ */ Symbol(`ssrRenderSlotInner`);
	var SSR_RENDER_CLASS = /* @__PURE__ */ Symbol(`ssrRenderClass`);
	var SSR_RENDER_STYLE = /* @__PURE__ */ Symbol(`ssrRenderStyle`);
	var SSR_RENDER_ATTRS = /* @__PURE__ */ Symbol(`ssrRenderAttrs`);
	var SSR_RENDER_ATTR = /* @__PURE__ */ Symbol(`ssrRenderAttr`);
	var SSR_RENDER_DYNAMIC_ATTR = /* @__PURE__ */ Symbol(`ssrRenderDynamicAttr`);
	var SSR_RENDER_LIST = /* @__PURE__ */ Symbol(`ssrRenderList`);
	var SSR_INCLUDE_BOOLEAN_ATTR = /* @__PURE__ */ Symbol(`ssrIncludeBooleanAttr`);
	var SSR_LOOSE_EQUAL = /* @__PURE__ */ Symbol(`ssrLooseEqual`);
	var SSR_LOOSE_CONTAIN = /* @__PURE__ */ Symbol(`ssrLooseContain`);
	var SSR_RENDER_DYNAMIC_MODEL = /* @__PURE__ */ Symbol(`ssrRenderDynamicModel`);
	var SSR_GET_DYNAMIC_MODEL_PROPS = /* @__PURE__ */ Symbol(`ssrGetDynamicModelProps`);
	var SSR_RENDER_TELEPORT = /* @__PURE__ */ Symbol(`ssrRenderTeleport`);
	var SSR_RENDER_SUSPENSE = /* @__PURE__ */ Symbol(`ssrRenderSuspense`);
	var SSR_GET_DIRECTIVE_PROPS = /* @__PURE__ */ Symbol(`ssrGetDirectiveProps`);
	var ssrHelpers = {
		[SSR_INTERPOLATE]: `ssrInterpolate`,
		[SSR_RENDER_VNODE]: `ssrRenderVNode`,
		[SSR_RENDER_COMPONENT]: `ssrRenderComponent`,
		[SSR_RENDER_SLOT]: `ssrRenderSlot`,
		[SSR_RENDER_SLOT_INNER]: `ssrRenderSlotInner`,
		[SSR_RENDER_CLASS]: `ssrRenderClass`,
		[SSR_RENDER_STYLE]: `ssrRenderStyle`,
		[SSR_RENDER_ATTRS]: `ssrRenderAttrs`,
		[SSR_RENDER_ATTR]: `ssrRenderAttr`,
		[SSR_RENDER_DYNAMIC_ATTR]: `ssrRenderDynamicAttr`,
		[SSR_RENDER_LIST]: `ssrRenderList`,
		[SSR_INCLUDE_BOOLEAN_ATTR]: `ssrIncludeBooleanAttr`,
		[SSR_LOOSE_EQUAL]: `ssrLooseEqual`,
		[SSR_LOOSE_CONTAIN]: `ssrLooseContain`,
		[SSR_RENDER_DYNAMIC_MODEL]: `ssrRenderDynamicModel`,
		[SSR_GET_DYNAMIC_MODEL_PROPS]: `ssrGetDynamicModelProps`,
		[SSR_RENDER_TELEPORT]: `ssrRenderTeleport`,
		[SSR_RENDER_SUSPENSE]: `ssrRenderSuspense`,
		[SSR_GET_DIRECTIVE_PROPS]: `ssrGetDirectiveProps`
	};
	compilerDom.registerRuntimeHelpers(ssrHelpers);
	var ssrTransformIf = compilerDom.createStructuralDirectiveTransform(/^(?:if|else|else-if)$/, compilerDom.processIf);
	function ssrProcessIf(node, context, disableNestedFragments = false, disableComment = false) {
		const [rootBranch] = node.branches;
		const ifStatement = compilerDom.createIfStatement(rootBranch.condition, processIfBranch(rootBranch, context, disableNestedFragments));
		context.pushStatement(ifStatement);
		let currentIf = ifStatement;
		for (let i = 1; i < node.branches.length; i++) {
			const branch = node.branches[i];
			const branchBlockStatement = processIfBranch(branch, context, disableNestedFragments);
			if (branch.condition) currentIf = currentIf.alternate = compilerDom.createIfStatement(branch.condition, branchBlockStatement);
			else currentIf.alternate = branchBlockStatement;
		}
		if (!currentIf.alternate && !disableComment) currentIf.alternate = compilerDom.createBlockStatement([compilerDom.createCallExpression(`_push`, ["`<!---->`"])]);
	}
	function processIfBranch(branch, context, disableNestedFragments = false) {
		const { children } = branch;
		return processChildrenAsStatement(branch, context, !disableNestedFragments && (children.length !== 1 || children[0].type !== 1) && !(children.length === 1 && children[0].type === 11));
	}
	var ssrTransformFor = compilerDom.createStructuralDirectiveTransform("for", compilerDom.processFor);
	function ssrProcessFor(node, context, disableNestedFragments = false) {
		const needFragmentWrapper = !disableNestedFragments && (node.children.length !== 1 || node.children[0].type !== 1);
		const renderLoop = compilerDom.createFunctionExpression(compilerDom.createForLoopParams(node.parseResult));
		renderLoop.body = processChildrenAsStatement(node, context, needFragmentWrapper);
		if (!disableNestedFragments) context.pushStringPart(`<!--[-->`);
		context.pushStatement(compilerDom.createCallExpression(context.helper(SSR_RENDER_LIST), [node.source, renderLoop]));
		if (!disableNestedFragments) context.pushStringPart(`<!--]-->`);
	}
	var ssrTransformSlotOutlet = (node, context) => {
		if (compilerDom.isSlotOutlet(node)) {
			const { slotName, slotProps } = compilerDom.processSlotOutlet(node, context);
			const args = [
				`_ctx.$slots`,
				slotName,
				slotProps || `{}`,
				`null`,
				`_push`,
				`_parent`
			];
			if (context.scopeId && context.slotted !== false) args.push(`"${context.scopeId}-s"`);
			let method = SSR_RENDER_SLOT;
			let parent = context.parent;
			if (parent) {
				const children = parent.children;
				if (parent.type === 10) parent = context.grandParent;
				let componentType;
				if (parent.type === 1 && parent.tagType === 1 && ((componentType = compilerDom.resolveComponentType(parent, context, true)) === compilerDom.TRANSITION || componentType === compilerDom.TRANSITION_GROUP) && children.filter((c) => c.type === 1).length === 1) {
					method = SSR_RENDER_SLOT_INNER;
					if (!(context.scopeId && context.slotted !== false)) args.push("null");
					args.push("true");
				}
			}
			node.ssrCodegenNode = compilerDom.createCallExpression(context.helper(method), args);
		}
	};
	function ssrProcessSlotOutlet(node, context) {
		const renderCall = node.ssrCodegenNode;
		if (node.children.length) {
			const fallbackRenderFn = compilerDom.createFunctionExpression([]);
			fallbackRenderFn.body = processChildrenAsStatement(node, context);
			renderCall.arguments[3] = fallbackRenderFn;
		}
		if (context.withSlotScopeId) {
			const slotScopeId = renderCall.arguments[6];
			renderCall.arguments[6] = slotScopeId ? `${slotScopeId} + _scopeId` : `_scopeId`;
		}
		context.pushStatement(node.ssrCodegenNode);
	}
	function createSSRCompilerError(code, loc) {
		return compilerDom.createCompilerError(code, loc, SSRErrorMessages);
	}
	var SSRErrorMessages = {
		[65]: `Unsafe attribute name for SSR.`,
		[66]: `Missing the 'to' prop on teleport element.`,
		[67]: `Invalid AST node during SSR transform.`
	};
	function ssrProcessTeleport(node, context) {
		const targetProp = compilerDom.findProp(node, "to");
		if (!targetProp) {
			context.onError(createSSRCompilerError(66, node.loc));
			return;
		}
		let target;
		if (targetProp.type === 6) target = targetProp.value && compilerDom.createSimpleExpression(targetProp.value.content, true);
		else target = targetProp.exp;
		if (!target) {
			context.onError(createSSRCompilerError(66, targetProp.loc));
			return;
		}
		const disabledProp = compilerDom.findProp(node, "disabled", false, true);
		const disabled = disabledProp ? disabledProp.type === 6 ? `true` : disabledProp.exp || `false` : `false`;
		const contentRenderFn = compilerDom.createFunctionExpression([`_push`], void 0, true, false, node.loc);
		contentRenderFn.body = processChildrenAsStatement(node, context);
		context.pushStatement(compilerDom.createCallExpression(context.helper(SSR_RENDER_TELEPORT), [
			`_push`,
			contentRenderFn,
			target,
			disabled,
			`_parent`
		]));
	}
	var wipMap$3 = /* @__PURE__ */ new WeakMap();
	function ssrTransformSuspense(node, context) {
		return () => {
			if (node.children.length) {
				const wipEntry = {
					slotsExp: null,
					wipSlots: []
				};
				wipMap$3.set(node, wipEntry);
				wipEntry.slotsExp = compilerDom.buildSlots(node, context, (_props, _vForExp, children, loc) => {
					const fn = compilerDom.createFunctionExpression([], void 0, true, false, loc);
					wipEntry.wipSlots.push({
						fn,
						children
					});
					return fn;
				}).slots;
			}
		};
	}
	function ssrProcessSuspense(node, context) {
		const wipEntry = wipMap$3.get(node);
		if (!wipEntry) return;
		const { slotsExp, wipSlots } = wipEntry;
		for (let i = 0; i < wipSlots.length; i++) {
			const slot = wipSlots[i];
			slot.fn.body = processChildrenAsStatement(slot, context);
		}
		context.pushStatement(compilerDom.createCallExpression(context.helper(SSR_RENDER_SUSPENSE), [`_push`, slotsExp]));
	}
	var rawChildrenMap = /* @__PURE__ */ new WeakMap();
	var ssrTransformElement = (node, context) => {
		if (node.type !== 1 || node.tagType !== 0) return;
		return function ssrPostTransformElement() {
			const openTag = [`<${node.tag}`];
			const needTagForRuntime = node.tag === "textarea" || node.tag.indexOf("-") > 0;
			const hasDynamicVBind = compilerDom.hasDynamicKeyVBind(node);
			const hasCustomDir = node.props.some((p) => p.type === 7 && !shared.isBuiltInDirective(p.name));
			const vShowPropIndex = node.props.findIndex((i) => i.type === 7 && i.name === "show");
			if (vShowPropIndex !== -1) {
				const vShowProp = node.props[vShowPropIndex];
				node.props.splice(vShowPropIndex, 1);
				node.props.push(vShowProp);
			}
			const needMergeProps = hasDynamicVBind || hasCustomDir;
			if (needMergeProps) {
				const { props, directives } = compilerDom.buildProps(node, context, node.props, false, false, true);
				if (props || directives.length) {
					const mergedProps = buildSSRProps(props, directives, context);
					const propsExp = compilerDom.createCallExpression(context.helper(SSR_RENDER_ATTRS), [mergedProps]);
					if (node.tag === "textarea") {
						const existingText = node.children[0];
						if (!hasContentOverrideDirective(node) && (!existingText || existingText.type !== 5)) {
							const tempId = `_temp${context.temps++}`;
							propsExp.arguments = [compilerDom.createAssignmentExpression(compilerDom.createSimpleExpression(tempId, false), mergedProps)];
							rawChildrenMap.set(node, compilerDom.createCallExpression(context.helper(SSR_INTERPOLATE), [compilerDom.createConditionalExpression(compilerDom.createSimpleExpression(`"value" in ${tempId}`, false), compilerDom.createSimpleExpression(`${tempId}.value`, false), compilerDom.createSimpleExpression(existingText ? existingText.content : ``, true), false)]));
						}
					} else if (node.tag === "input") {
						const vModel = findVModel(node);
						if (vModel) {
							const tempId = `_temp${context.temps++}`;
							const tempExp = compilerDom.createSimpleExpression(tempId, false);
							propsExp.arguments = [compilerDom.createSequenceExpression([compilerDom.createAssignmentExpression(tempExp, mergedProps), compilerDom.createCallExpression(context.helper(compilerDom.MERGE_PROPS), [tempExp, compilerDom.createCallExpression(context.helper(SSR_GET_DYNAMIC_MODEL_PROPS), [tempExp, vModel.exp])])])];
						}
					} else if (directives.length && !node.children.length) {
						if (!hasContentOverrideDirective(node)) {
							const tempId = `_temp${context.temps++}`;
							propsExp.arguments = [compilerDom.createAssignmentExpression(compilerDom.createSimpleExpression(tempId, false), mergedProps)];
							rawChildrenMap.set(node, compilerDom.createConditionalExpression(compilerDom.createSimpleExpression(`"textContent" in ${tempId}`, false), compilerDom.createCallExpression(context.helper(SSR_INTERPOLATE), [compilerDom.createSimpleExpression(`${tempId}.textContent`, false)]), compilerDom.createSimpleExpression(`${tempId}.innerHTML ?? ''`, false), false));
						}
					}
					if (needTagForRuntime) propsExp.arguments.push(`"${node.tag}"`);
					openTag.push(propsExp);
				}
			}
			let dynamicClassBinding = void 0;
			let staticClassBinding = void 0;
			let dynamicStyleBinding = void 0;
			for (let i = 0; i < node.props.length; i++) {
				const prop = node.props[i];
				if (node.tag === "input" && isTrueFalseValue(prop)) continue;
				if (prop.type === 7) {
					if (prop.name === "html" && prop.exp) rawChildrenMap.set(node, compilerDom.createCompoundExpression([
						`(`,
						prop.exp,
						`) ?? ''`
					]));
					else if (prop.name === "text" && prop.exp) node.children = [compilerDom.createInterpolation(prop.exp, prop.loc)];
					else if (prop.name === "slot") context.onError(compilerDom.createCompilerError(40, prop.loc));
					else if (isTextareaWithValue(node, prop) && prop.exp) {
						if (!needMergeProps) node.children = [compilerDom.createInterpolation(prop.exp, prop.loc)];
					} else if (!needMergeProps && prop.name !== "on") {
						const directiveTransform = context.directiveTransforms[prop.name];
						if (directiveTransform) {
							const { props, ssrTagParts } = directiveTransform(prop, node, context);
							if (ssrTagParts) openTag.push(...ssrTagParts);
							for (let j = 0; j < props.length; j++) {
								const { key, value } = props[j];
								if (compilerDom.isStaticExp(key)) {
									let attrName = key.content;
									if (attrName === "key" || attrName === "ref") continue;
									if (attrName === "class") openTag.push(` class="`, dynamicClassBinding = compilerDom.createCallExpression(context.helper(SSR_RENDER_CLASS), [value]), `"`);
									else if (attrName === "style") if (dynamicStyleBinding) mergeCall(dynamicStyleBinding, value);
									else openTag.push(` style="`, dynamicStyleBinding = compilerDom.createCallExpression(context.helper(SSR_RENDER_STYLE), [value]), `"`);
									else {
										attrName = node.tag.indexOf("-") > 0 ? attrName : shared.propsToAttrMap[attrName] || attrName.toLowerCase();
										if (shared.isBooleanAttr(attrName)) openTag.push(compilerDom.createConditionalExpression(compilerDom.createCallExpression(context.helper(SSR_INCLUDE_BOOLEAN_ATTR), [value]), compilerDom.createSimpleExpression(" " + attrName, true), compilerDom.createSimpleExpression("", true), false));
										else if (shared.isSSRSafeAttrName(attrName)) openTag.push(compilerDom.createCallExpression(context.helper(SSR_RENDER_ATTR), [key, value]));
										else context.onError(createSSRCompilerError(65, key.loc));
									}
								} else {
									const args = [key, value];
									if (needTagForRuntime) args.push(`"${node.tag}"`);
									openTag.push(compilerDom.createCallExpression(context.helper(SSR_RENDER_DYNAMIC_ATTR), args));
								}
							}
						}
					}
				} else {
					const name = prop.name;
					if (node.tag === "textarea" && name === "value" && prop.value) rawChildrenMap.set(node, shared.escapeHtml(prop.value.content));
					else if (!needMergeProps) {
						if (name === "key" || name === "ref") continue;
						if (name === "class" && prop.value) staticClassBinding = JSON.stringify(prop.value.content);
						openTag.push(` ${prop.name}` + (prop.value ? `="${shared.escapeHtml(prop.value.content)}"` : ``));
					}
				}
			}
			if (dynamicClassBinding && staticClassBinding) {
				mergeCall(dynamicClassBinding, staticClassBinding);
				removeStaticBinding(openTag, "class");
			}
			if (context.scopeId) openTag.push(` ${context.scopeId}`);
			node.ssrCodegenNode = compilerDom.createTemplateLiteral(openTag);
		};
	};
	function buildSSRProps(props, directives, context) {
		let mergePropsArgs = [];
		if (props) if (props.type === 14) mergePropsArgs = props.arguments;
		else mergePropsArgs.push(props);
		if (directives.length) for (const dir of directives) mergePropsArgs.push(compilerDom.createCallExpression(context.helper(SSR_GET_DIRECTIVE_PROPS), [`_ctx`, ...compilerDom.buildDirectiveArgs(dir, context).elements]));
		return mergePropsArgs.length > 1 ? compilerDom.createCallExpression(context.helper(compilerDom.MERGE_PROPS), mergePropsArgs) : mergePropsArgs[0];
	}
	function isTrueFalseValue(prop) {
		if (prop.type === 7) return prop.name === "bind" && prop.arg && compilerDom.isStaticExp(prop.arg) && (prop.arg.content === "true-value" || prop.arg.content === "false-value");
		else return prop.name === "true-value" || prop.name === "false-value";
	}
	function isTextareaWithValue(node, prop) {
		return !!(node.tag === "textarea" && prop.name === "bind" && compilerDom.isStaticArgOf(prop.arg, "value"));
	}
	function mergeCall(call, arg) {
		const existing = call.arguments[0];
		if (existing.type === 17) existing.elements.push(arg);
		else call.arguments[0] = compilerDom.createArrayExpression([existing, arg]);
	}
	function removeStaticBinding(tag, binding) {
		const regExp = new RegExp(`^ ${binding}=".+"$`);
		const i = tag.findIndex((e) => typeof e === "string" && regExp.test(e));
		if (i > -1) tag.splice(i, 1);
	}
	function findVModel(node) {
		return node.props.find((p) => p.type === 7 && p.name === "model" && p.exp);
	}
	function hasContentOverrideDirective(node) {
		return !!compilerDom.findDir(node, "text") || !!compilerDom.findDir(node, "html");
	}
	function ssrProcessElement(node, context) {
		const isVoidTag = context.options.isVoidTag || shared.NO;
		const elementsToAdd = node.ssrCodegenNode.elements;
		for (let j = 0; j < elementsToAdd.length; j++) context.pushStringPart(elementsToAdd[j]);
		if (context.withSlotScopeId) context.pushStringPart(compilerDom.createSimpleExpression(`_scopeId`, false));
		context.pushStringPart(`>`);
		const rawChildren = rawChildrenMap.get(node);
		if (rawChildren) context.pushStringPart(rawChildren);
		else if (node.children.length) processChildren(node, context);
		if (!isVoidTag(node.tag)) context.pushStringPart(`</${node.tag}>`);
	}
	var wipMap$2 = /* @__PURE__ */ new WeakMap();
	function ssrTransformTransitionGroup(node, context) {
		return () => {
			const tag = compilerDom.findProp(node, "tag");
			if (tag) {
				const otherProps = node.props.filter((p) => p !== tag);
				const { props, directives } = compilerDom.buildProps(node, context, otherProps, true, false, true);
				let propsExp = null;
				if (props || directives.length) propsExp = compilerDom.createCallExpression(context.helper(SSR_RENDER_ATTRS), [buildSSRProps(props, directives, context)]);
				wipMap$2.set(node, {
					tag,
					propsExp,
					scopeId: context.scopeId || null
				});
			}
		};
	}
	function ssrProcessTransitionGroup(node, context) {
		const entry = wipMap$2.get(node);
		if (entry) {
			const { tag, propsExp, scopeId } = entry;
			if (tag.type === 7) {
				context.pushStringPart(`<`);
				context.pushStringPart(tag.exp);
				if (propsExp) context.pushStringPart(propsExp);
				if (scopeId) context.pushStringPart(` ${scopeId}`);
				context.pushStringPart(`>`);
				processChildren(
					node,
					context,
					false,
					/**
					* TransitionGroup has the special runtime behavior of flattening and
					* concatenating all children into a single fragment (in order for them to
					* be patched using the same key map) so we need to account for that here
					* by disabling nested fragment wrappers from being generated.
					*/
					true,
					/**
					* TransitionGroup filters out comment children at runtime and thus
					* doesn't expect comments to be present during hydration. We need to
					* account for that by disabling the empty comment that is otherwise
					* rendered for a falsy v-if that has no v-else specified. (#6715)
					*/
					true
				);
				context.pushStringPart(`</`);
				context.pushStringPart(tag.exp);
				context.pushStringPart(`>`);
			} else {
				context.pushStringPart(`<${tag.value.content}`);
				if (propsExp) context.pushStringPart(propsExp);
				if (scopeId) context.pushStringPart(` ${scopeId}`);
				context.pushStringPart(`>`);
				processChildren(node, context, false, true, true);
				context.pushStringPart(`</${tag.value.content}>`);
			}
		} else processChildren(node, context, true, true, true);
	}
	var wipMap$1 = /* @__PURE__ */ new WeakMap();
	function ssrTransformTransition(node, context) {
		return () => {
			const appear = compilerDom.findProp(node, "appear", false, true);
			wipMap$1.set(node, !!appear);
		};
	}
	function ssrProcessTransition(node, context) {
		node.children = node.children.filter((c) => c.type !== 3);
		if (wipMap$1.get(node)) {
			context.pushStringPart(`<template>`);
			processChildren(node, context, false, true);
			context.pushStringPart(`</template>`);
		} else processChildren(node, context, false, true);
	}
	var wipMap = /* @__PURE__ */ new WeakMap();
	var WIP_SLOT = /* @__PURE__ */ Symbol();
	var componentTypeMap = /* @__PURE__ */ new WeakMap();
	var ssrTransformComponent = (node, context) => {
		if (node.type !== 1 || node.tagType !== 1) return;
		const component = compilerDom.resolveComponentType(node, context, true);
		const isDynamicComponent = shared.isObject(component) && component.callee === compilerDom.RESOLVE_DYNAMIC_COMPONENT;
		componentTypeMap.set(node, component);
		if (shared.isSymbol(component)) {
			if (component === compilerDom.SUSPENSE) return ssrTransformSuspense(node, context);
			else if (component === compilerDom.TRANSITION_GROUP) return ssrTransformTransitionGroup(node, context);
			else if (component === compilerDom.TRANSITION) return ssrTransformTransition(node);
			return;
		}
		const vnodeBranches = [];
		const clonedNode = clone(node);
		return function ssrPostTransformComponent() {
			if (clonedNode.children.length) compilerDom.buildSlots(clonedNode, context, (props, vFor, children) => {
				vnodeBranches.push(createVNodeSlotBranch(props, vFor, children, context));
				return compilerDom.createFunctionExpression(void 0);
			});
			let propsExp = `null`;
			if (node.props.length) {
				const { props, directives } = compilerDom.buildProps(node, context, void 0, true, isDynamicComponent);
				if (props || directives.length) propsExp = buildSSRProps(props, directives, context);
			}
			const wipEntries = [];
			wipMap.set(node, wipEntries);
			const buildSSRSlotFn = (props, _vForExp, children, loc) => {
				const param0 = props && compilerDom.stringifyExpression(props) || `_`;
				const fn = compilerDom.createFunctionExpression([
					param0,
					`_push`,
					`_parent`,
					`_scopeId`
				], void 0, true, true, loc);
				wipEntries.push({
					type: WIP_SLOT,
					fn,
					children,
					vnodeBranch: vnodeBranches[wipEntries.length]
				});
				return fn;
			};
			const slots = node.children.length ? compilerDom.buildSlots(node, context, buildSSRSlotFn).slots : `null`;
			if (typeof component !== "string") node.ssrCodegenNode = compilerDom.createCallExpression(context.helper(SSR_RENDER_VNODE), [
				`_push`,
				compilerDom.createCallExpression(context.helper(compilerDom.CREATE_VNODE), [
					component,
					propsExp,
					slots
				]),
				`_parent`
			]);
			else node.ssrCodegenNode = compilerDom.createCallExpression(context.helper(SSR_RENDER_COMPONENT), [
				component,
				propsExp,
				slots,
				`_parent`
			]);
		};
	};
	function ssrProcessComponent(node, context, parent) {
		const component = componentTypeMap.get(node);
		if (!node.ssrCodegenNode) if (component === compilerDom.TELEPORT) return ssrProcessTeleport(node, context);
		else if (component === compilerDom.SUSPENSE) return ssrProcessSuspense(node, context);
		else if (component === compilerDom.TRANSITION_GROUP) return ssrProcessTransitionGroup(node, context);
		else {
			if (parent.type === WIP_SLOT) context.pushStringPart(``);
			if (component === compilerDom.TRANSITION) return ssrProcessTransition(node, context);
			processChildren(node, context);
		}
		else {
			const wipEntries = wipMap.get(node) || [];
			for (let i = 0; i < wipEntries.length; i++) {
				const { fn, vnodeBranch } = wipEntries[i];
				fn.body = compilerDom.createIfStatement(compilerDom.createSimpleExpression(`_push`, false), processChildrenAsStatement(wipEntries[i], context, false, true), vnodeBranch);
			}
			if (context.withSlotScopeId) node.ssrCodegenNode.arguments.push(`_scopeId`);
			if (typeof component === "string") context.pushStatement(compilerDom.createCallExpression(`_push`, [node.ssrCodegenNode]));
			else context.pushStatement(node.ssrCodegenNode);
		}
	}
	var rawOptionsMap = /* @__PURE__ */ new WeakMap();
	var [baseNodeTransforms, baseDirectiveTransforms] = compilerDom.getBaseTransformPreset(true);
	var vnodeNodeTransforms = [...baseNodeTransforms, ...compilerDom.DOMNodeTransforms];
	var vnodeDirectiveTransforms = {
		...baseDirectiveTransforms,
		...compilerDom.DOMDirectiveTransforms
	};
	function createVNodeSlotBranch(slotProps, vFor, children, parentContext) {
		const rawOptions = rawOptionsMap.get(parentContext.root);
		const subOptions = {
			...rawOptions,
			nodeTransforms: [...vnodeNodeTransforms, ...rawOptions.nodeTransforms || []],
			directiveTransforms: {
				...vnodeDirectiveTransforms,
				...rawOptions.directiveTransforms || {}
			}
		};
		const wrapperProps = [];
		if (slotProps) wrapperProps.push({
			type: 7,
			name: "slot",
			exp: slotProps,
			arg: void 0,
			modifiers: [],
			loc: compilerDom.locStub
		});
		if (vFor) wrapperProps.push(shared.extend({}, vFor));
		subTransform({
			type: 1,
			ns: 0,
			tag: "template",
			tagType: 3,
			props: wrapperProps,
			children,
			loc: compilerDom.locStub,
			codegenNode: void 0
		}, subOptions, parentContext);
		return compilerDom.createReturnStatement(children);
	}
	function subTransform(node, options, parentContext) {
		const childRoot = compilerDom.createRoot([node]);
		const childContext = compilerDom.createTransformContext(childRoot, options);
		childContext.ssr = false;
		childContext.scopes = { ...parentContext.scopes };
		childContext.identifiers = { ...parentContext.identifiers };
		childContext.imports = parentContext.imports;
		compilerDom.traverseNode(childRoot, childContext);
		[
			"helpers",
			"components",
			"directives"
		].forEach((key) => {
			childContext[key].forEach((value, helperKey) => {
				if (key === "helpers") {
					const parentCount = parentContext.helpers.get(helperKey);
					if (parentCount === void 0) parentContext.helpers.set(helperKey, value);
					else parentContext.helpers.set(helperKey, value + parentCount);
				} else parentContext[key].add(value);
			});
		});
	}
	function clone(v) {
		if (shared.isArray(v)) return v.map(clone);
		else if (shared.isPlainObject(v)) {
			const res = {};
			for (const key in v) res[key] = clone(v[key]);
			return res;
		} else return v;
	}
	function ssrCodegenTransform(ast, options) {
		const context = createSSRTransformContext(ast, options);
		if (options.ssrCssVars) {
			const cssContext = compilerDom.createTransformContext(compilerDom.createRoot([]), options);
			const varsExp = compilerDom.processExpression(compilerDom.createSimpleExpression(options.ssrCssVars, false), cssContext);
			context.body.push(compilerDom.createCompoundExpression([
				`const _cssVars = { style: `,
				varsExp,
				`}`
			]));
			Array.from(cssContext.helpers.keys()).forEach((helper) => {
				ast.helpers.add(helper);
			});
		}
		processChildren(ast, context, ast.children.length > 1 && ast.children.some((c) => !compilerDom.isText(c)));
		ast.codegenNode = compilerDom.createBlockStatement(context.body);
		ast.ssrHelpers = Array.from(/* @__PURE__ */ new Set([...Array.from(ast.helpers).filter((h) => h in ssrHelpers), ...context.helpers]));
		ast.helpers = new Set(Array.from(ast.helpers).filter((h) => !(h in ssrHelpers)));
	}
	function createSSRTransformContext(root, options, helpers = /* @__PURE__ */ new Set(), withSlotScopeId = false) {
		const body = [];
		let currentString = null;
		return {
			root,
			options,
			body,
			helpers,
			withSlotScopeId,
			onError: options.onError || ((e) => {
				throw e;
			}),
			helper(name) {
				helpers.add(name);
				return name;
			},
			pushStringPart(part) {
				if (!currentString) {
					const currentCall = compilerDom.createCallExpression(`_push`);
					body.push(currentCall);
					currentString = compilerDom.createTemplateLiteral([]);
					currentCall.arguments.push(currentString);
				}
				const bufferedElements = currentString.elements;
				const lastItem = bufferedElements[bufferedElements.length - 1];
				if (shared.isString(part) && shared.isString(lastItem)) bufferedElements[bufferedElements.length - 1] += part;
				else bufferedElements.push(part);
			},
			pushStatement(statement) {
				currentString = null;
				body.push(statement);
			}
		};
	}
	function createChildContext(parent, withSlotScopeId = parent.withSlotScopeId) {
		return createSSRTransformContext(parent.root, parent.options, parent.helpers, withSlotScopeId);
	}
	function processChildren(parent, context, asFragment = false, disableNestedFragments = false, disableComment = false) {
		if (asFragment) context.pushStringPart(`<!--[-->`);
		const { children } = parent;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			switch (child.type) {
				case 1:
					switch (child.tagType) {
						case 0:
							ssrProcessElement(child, context);
							break;
						case 1:
							ssrProcessComponent(child, context, parent);
							break;
						case 2:
							ssrProcessSlotOutlet(child, context);
							break;
						case 3: break;
						default:
							context.onError(createSSRCompilerError(67, child.loc));
							return child;
					}
					break;
				case 2:
					context.pushStringPart(shared.escapeHtml(child.content));
					break;
				case 3:
					if (!disableComment) context.pushStringPart(`<!--${child.content}-->`);
					break;
				case 5:
					context.pushStringPart(compilerDom.createCallExpression(context.helper(SSR_INTERPOLATE), [child.content]));
					break;
				case 9:
					ssrProcessIf(child, context, disableNestedFragments, disableComment);
					break;
				case 11:
					ssrProcessFor(child, context, disableNestedFragments);
					break;
				case 10: break;
				case 12:
				case 8: break;
				default:
					context.onError(createSSRCompilerError(67, child.loc));
					return child;
			}
		}
		if (asFragment) context.pushStringPart(`<!--]-->`);
	}
	function processChildrenAsStatement(parent, parentContext, asFragment = false, withSlotScopeId = parentContext.withSlotScopeId) {
		const childContext = createChildContext(parentContext, withSlotScopeId);
		processChildren(parent, childContext, asFragment);
		return compilerDom.createBlockStatement(childContext.body);
	}
	var ssrTransformModel = (dir, node, context) => {
		const model = dir.exp;
		function checkDuplicatedValue() {
			const value = compilerDom.findProp(node, "value");
			if (value) context.onError(compilerDom.createDOMCompilerError(61, value.loc));
		}
		const processSelectChildren = (children) => {
			children.forEach((child) => {
				if (child.type === 1) processOption(child);
				else if (child.type === 11) processSelectChildren(child.children);
				else if (child.type === 9) child.branches.forEach((b) => processSelectChildren(b.children));
			});
		};
		function processOption(plainNode) {
			if (plainNode.tag === "option") {
				if (plainNode.props.findIndex((p) => p.name === "selected") === -1) {
					const value = findValueBinding(plainNode);
					plainNode.ssrCodegenNode.elements.push(compilerDom.createConditionalExpression(compilerDom.createCallExpression(context.helper(SSR_INCLUDE_BOOLEAN_ATTR), [compilerDom.createConditionalExpression(compilerDom.createCallExpression(`Array.isArray`, [model]), compilerDom.createCallExpression(context.helper(SSR_LOOSE_CONTAIN), [model, value]), compilerDom.createCallExpression(context.helper(SSR_LOOSE_EQUAL), [model, value]))]), compilerDom.createSimpleExpression(" selected", true), compilerDom.createSimpleExpression("", true), false));
				}
			} else if (plainNode.tag === "optgroup") processSelectChildren(plainNode.children);
		}
		if (node.tagType === 0) {
			const res = { props: [] };
			if (node.tag === "input") {
				const defaultProps = [compilerDom.createObjectProperty(`value`, model)];
				const type = compilerDom.findProp(node, "type");
				if (type) {
					const value = findValueBinding(node);
					if (type.type === 7) res.ssrTagParts = [compilerDom.createCallExpression(context.helper(SSR_RENDER_DYNAMIC_MODEL), [
						type.exp,
						model,
						value
					])];
					else if (type.value) switch (type.value.content) {
						case "radio":
							res.props = [compilerDom.createObjectProperty(`checked`, compilerDom.createCallExpression(context.helper(SSR_LOOSE_EQUAL), [model, value]))];
							break;
						case "checkbox":
							const trueValueBinding = compilerDom.findProp(node, "true-value");
							if (trueValueBinding) {
								const trueValue = trueValueBinding.type === 6 ? JSON.stringify(trueValueBinding.value.content) : trueValueBinding.exp;
								res.props = [compilerDom.createObjectProperty(`checked`, compilerDom.createCallExpression(context.helper(SSR_LOOSE_EQUAL), [model, trueValue]))];
							} else res.props = [compilerDom.createObjectProperty(`checked`, compilerDom.createConditionalExpression(compilerDom.createCallExpression(`Array.isArray`, [model]), compilerDom.createCallExpression(context.helper(SSR_LOOSE_CONTAIN), [model, value]), model))];
							break;
						case "file":
							context.onError(compilerDom.createDOMCompilerError(60, dir.loc));
							break;
						default:
							checkDuplicatedValue();
							res.props = defaultProps;
							break;
					}
				} else if (compilerDom.hasDynamicKeyVBind(node));
				else {
					checkDuplicatedValue();
					res.props = defaultProps;
				}
			} else if (node.tag === "textarea") {
				checkDuplicatedValue();
				node.children = [compilerDom.createInterpolation(model, model.loc)];
			} else if (node.tag === "select") processSelectChildren(node.children);
			else context.onError(compilerDom.createDOMCompilerError(58, dir.loc));
			return res;
		} else return compilerDom.transformModel(dir, node, context);
	};
	function findValueBinding(node) {
		const valueBinding = compilerDom.findProp(node, "value");
		return valueBinding ? valueBinding.type === 7 ? valueBinding.exp : compilerDom.createSimpleExpression(valueBinding.value.content, true) : compilerDom.createSimpleExpression(`null`, false);
	}
	var ssrTransformShow = (dir, node, context) => {
		if (!dir.exp) context.onError(compilerDom.createDOMCompilerError(62));
		return { props: [compilerDom.createObjectProperty(`style`, compilerDom.createConditionalExpression(dir.exp, compilerDom.createSimpleExpression(`null`, false), compilerDom.createObjectExpression([compilerDom.createObjectProperty(`display`, compilerDom.createSimpleExpression(`none`, true))]), false))] };
	};
	var filterChild = (node) => node.children.filter((n) => !compilerDom.isCommentOrWhitespace(n));
	var hasSingleChild = (node) => filterChild(node).length === 1;
	var ssrInjectFallthroughAttrs = (node, context) => {
		if (node.type === 0) context.identifiers._attrs = 1;
		if (node.type === 1 && node.tagType === 1 && (node.tag === "transition" || node.tag === "Transition" || node.tag === "KeepAlive" || node.tag === "keep-alive")) {
			const rootChildren = filterChild(context.root);
			if (rootChildren.length === 1 && rootChildren[0] === node) {
				if (hasSingleChild(node)) injectFallthroughAttrs(node.children[0]);
				return;
			}
		}
		const parent = context.parent;
		if (!parent || parent.type !== 0) return;
		if (node.type === 10 && hasSingleChild(node)) {
			let hasEncounteredIf = false;
			for (const c of filterChild(parent)) if (c.type === 9 || c.type === 1 && compilerDom.findDir(c, "if")) {
				if (hasEncounteredIf) return;
				hasEncounteredIf = true;
			} else if (!hasEncounteredIf || !(c.type === 1 && compilerDom.findDir(c, /else/, true))) return;
			injectFallthroughAttrs(node.children[0]);
		} else if (hasSingleChild(parent)) injectFallthroughAttrs(node);
	};
	function injectFallthroughAttrs(node) {
		if (node.type === 1 && (node.tagType === 0 || node.tagType === 1) && !compilerDom.findDir(node, "for")) node.props.push({
			type: 7,
			name: "bind",
			arg: void 0,
			exp: compilerDom.createSimpleExpression(`_attrs`, false),
			modifiers: [],
			loc: compilerDom.locStub
		});
	}
	var ssrInjectCssVars = (node, context) => {
		if (!context.ssrCssVars) return;
		if (node.type === 0) context.identifiers._cssVars = 1;
		const parent = context.parent;
		if (!parent || parent.type !== 0) return;
		if (node.type === 10) for (const child of node.children) injectCssVars(child);
		else injectCssVars(node);
	};
	function injectCssVars(node) {
		if (node.type === 1 && (node.tagType === 0 || node.tagType === 1) && !compilerDom.findDir(node, "for")) if (node.tag === "suspense" || node.tag === "Suspense") for (const child of node.children) if (child.type === 1 && child.tagType === 3) child.children.forEach(injectCssVars);
		else injectCssVars(child);
		else node.props.push({
			type: 7,
			name: "bind",
			arg: void 0,
			exp: compilerDom.createSimpleExpression(`_cssVars`, false),
			modifiers: [],
			loc: compilerDom.locStub
		});
	}
	function compile(source, options = {}) {
		options = {
			...options,
			...compilerDom.parserOptions,
			ssr: true,
			inSSR: true,
			scopeId: options.mode === "function" ? null : options.scopeId,
			prefixIdentifiers: true,
			cacheHandlers: false,
			hoistStatic: false
		};
		const ast = typeof source === "string" ? compilerDom.baseParse(source, options) : source;
		rawOptionsMap.set(ast, options);
		compilerDom.transform(ast, {
			...options,
			hoistStatic: false,
			nodeTransforms: [
				compilerDom.transformVBindShorthand,
				ssrTransformIf,
				ssrTransformFor,
				compilerDom.trackVForSlotScopes,
				compilerDom.transformExpression,
				ssrTransformSlotOutlet,
				ssrInjectFallthroughAttrs,
				ssrInjectCssVars,
				ssrTransformElement,
				ssrTransformComponent,
				compilerDom.trackSlotScopes,
				compilerDom.transformStyle,
				...options.nodeTransforms || []
			],
			directiveTransforms: {
				bind: compilerDom.transformBind,
				on: compilerDom.transformOn,
				model: ssrTransformModel,
				show: ssrTransformShow,
				cloak: compilerDom.noopDirectiveTransform,
				once: compilerDom.noopDirectiveTransform,
				memo: compilerDom.noopDirectiveTransform,
				...options.directiveTransforms || {}
			}
		});
		ssrCodegenTransform(ast, options);
		return compilerDom.generate(ast, options);
	}
	exports.compile = compile;
}));
//#endregion
//#region node_modules/@vue/server-renderer/dist/server-renderer.cjs.prod.js
/**
* @vue/server-renderer v3.5.32
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var require_server_renderer_cjs_prod = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var Vue = require_vue_cjs_prod();
	var shared = require_shared_cjs_prod();
	var compilerSsr = require_compiler_ssr_cjs();
	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) for (var k in e) n[k] = e[k];
		n.default = e;
		return Object.freeze(n);
	}
	var Vue__namespace = /* @__PURE__ */ _interopNamespaceDefault(Vue);
	var shouldIgnoreProp = /* @__PURE__ */ shared.makeMap(`,key,ref,innerHTML,textContent,ref_key,ref_for`);
	function ssrRenderAttrs(props, tag) {
		let ret = "";
		for (let key in props) {
			if (shouldIgnoreProp(key) || shared.isOn(key) || tag === "textarea" && key === "value" || key.startsWith(".")) continue;
			const value = props[key];
			if (key.startsWith("^")) key = key.slice(1);
			if (key === "class") ret += ` class="${ssrRenderClass(value)}"`;
			else if (key === "style") ret += ` style="${ssrRenderStyle(value)}"`;
			else if (key === "className") {
				if (value != null) ret += ` class="${shared.escapeHtml(String(value))}"`;
			} else ret += ssrRenderDynamicAttr(key, value, tag);
		}
		return ret;
	}
	function ssrRenderDynamicAttr(key, value, tag) {
		if (!shared.isRenderableAttrValue(value)) return ``;
		const attrKey = tag && (tag.indexOf("-") > 0 || shared.isSVGTag(tag)) ? key : shared.propsToAttrMap[key] || key.toLowerCase();
		if (shared.isBooleanAttr(attrKey)) return shared.includeBooleanAttr(value) ? ` ${attrKey}` : ``;
		else if (shared.isSSRSafeAttrName(attrKey)) return value === "" ? ` ${attrKey}` : ` ${attrKey}="${shared.escapeHtml(value)}"`;
		else {
			console.warn(`[@vue/server-renderer] Skipped rendering unsafe attribute name: ${attrKey}`);
			return ``;
		}
	}
	function ssrRenderAttr(key, value) {
		if (!shared.isRenderableAttrValue(value)) return ``;
		return ` ${key}="${shared.escapeHtml(value)}"`;
	}
	function ssrRenderClass(raw) {
		return shared.escapeHtml(shared.normalizeClass(raw));
	}
	function ssrRenderStyle(raw) {
		if (!raw) return "";
		if (shared.isString(raw)) return shared.escapeHtml(raw);
		const styles = shared.normalizeStyle(ssrResetCssVars(raw));
		return shared.escapeHtml(shared.stringifyStyle(styles));
	}
	function ssrResetCssVars(raw) {
		if (!shared.isArray(raw) && shared.isObject(raw)) {
			const res = {};
			for (const key in raw) if (key.startsWith(":--")) res[key.slice(1)] = shared.normalizeCssVarValue(raw[key]);
			else res[key] = raw[key];
			return res;
		}
		return raw;
	}
	function ssrRenderComponent(comp, props = null, children = null, parentComponent = null, slotScopeId) {
		return renderComponentVNode(Vue.createVNode(comp, props, children), parentComponent, slotScopeId);
	}
	var { ensureValidVNode } = Vue.ssrUtils;
	function ssrRenderSlot(slots, slotName, slotProps, fallbackRenderFn, push, parentComponent, slotScopeId) {
		push(`<!--[-->`);
		ssrRenderSlotInner(slots, slotName, slotProps, fallbackRenderFn, push, parentComponent, slotScopeId);
		push(`<!--]-->`);
	}
	function ssrRenderSlotInner(slots, slotName, slotProps, fallbackRenderFn, push, parentComponent, slotScopeId, transition) {
		const slotFn = slots[slotName];
		if (slotFn) {
			const slotBuffer = [];
			const bufferedPush = (item) => {
				slotBuffer.push(item);
			};
			const ret = slotFn(slotProps, bufferedPush, parentComponent, slotScopeId ? " " + slotScopeId : "");
			if (shared.isArray(ret)) {
				const validSlotContent = ensureValidVNode(ret);
				if (validSlotContent) renderVNodeChildren(push, validSlotContent, parentComponent, slotScopeId);
				else if (fallbackRenderFn) fallbackRenderFn();
				else if (transition) push(`<!---->`);
			} else {
				let isEmptySlot = true;
				if (transition) isEmptySlot = false;
				else for (let i = 0; i < slotBuffer.length; i++) if (!isComment(slotBuffer[i])) {
					isEmptySlot = false;
					break;
				}
				if (isEmptySlot) {
					if (fallbackRenderFn) fallbackRenderFn();
				} else {
					let start = 0;
					let end = slotBuffer.length;
					if (transition && slotBuffer[0] === "<!--[-->" && slotBuffer[end - 1] === "<!--]-->") {
						start++;
						end--;
					}
					if (start < end) for (let i = start; i < end; i++) push(slotBuffer[i]);
					else if (transition) push(`<!---->`);
				}
			}
		} else if (fallbackRenderFn) fallbackRenderFn();
		else if (transition) push(`<!---->`);
	}
	var commentTestRE = /^<!--[\s\S]*-->$/;
	var commentRE = /<!--[^]*?-->/gm;
	function isComment(item) {
		if (typeof item !== "string" || !commentTestRE.test(item)) return false;
		if (item.length <= 8) return true;
		return !item.replace(commentRE, "").trim();
	}
	function ssrRenderTeleport(parentPush, contentRenderFn, target, disabled, parentComponent) {
		parentPush("<!--teleport start-->");
		const context = parentComponent.appContext.provides[Vue.ssrContextKey];
		const teleportBuffers = context.__teleportBuffers || (context.__teleportBuffers = {});
		const targetBuffer = teleportBuffers[target] || (teleportBuffers[target] = []);
		const bufferIndex = targetBuffer.length;
		let teleportContent;
		if (disabled) {
			contentRenderFn(parentPush);
			teleportContent = `<!--teleport start anchor--><!--teleport anchor-->`;
		} else {
			const { getBuffer, push } = createBuffer();
			push(`<!--teleport start anchor-->`);
			contentRenderFn(push);
			push(`<!--teleport anchor-->`);
			teleportContent = getBuffer();
		}
		targetBuffer.splice(bufferIndex, 0, teleportContent);
		parentPush("<!--teleport end-->");
	}
	function ssrInterpolate(value) {
		return shared.escapeHtml(shared.toDisplayString(value));
	}
	function ssrRenderList(source, renderItem) {
		if (shared.isArray(source) || shared.isString(source)) for (let i = 0, l = source.length; i < l; i++) renderItem(source[i], i);
		else if (typeof source === "number") for (let i = 0; i < source; i++) renderItem(i + 1, i);
		else if (shared.isObject(source)) if (source[Symbol.iterator]) {
			const arr = Array.from(source);
			for (let i = 0, l = arr.length; i < l; i++) renderItem(arr[i], i);
		} else {
			const keys = Object.keys(source);
			for (let i = 0, l = keys.length; i < l; i++) {
				const key = keys[i];
				renderItem(source[key], key, i);
			}
		}
	}
	async function ssrRenderSuspense(push, { default: renderContent }) {
		if (renderContent) renderContent();
		else push(`<!---->`);
	}
	function ssrGetDirectiveProps(instance, dir, value, arg, modifiers = {}) {
		if (typeof dir !== "function" && dir.getSSRProps) return dir.getSSRProps({
			dir,
			instance: Vue.ssrUtils.getComponentPublicInstance(instance.$),
			value,
			oldValue: void 0,
			arg,
			modifiers
		}, null) || {};
		return {};
	}
	var ssrLooseEqual = shared.looseEqual;
	function ssrLooseContain(arr, value) {
		return shared.looseIndexOf(arr, value) > -1;
	}
	function ssrRenderDynamicModel(type, model, value) {
		switch (type) {
			case "radio": return shared.looseEqual(model, value) ? " checked" : "";
			case "checkbox": return (shared.isArray(model) ? ssrLooseContain(model, value) : model) ? " checked" : "";
			default: return ssrRenderAttr("value", model);
		}
	}
	function ssrGetDynamicModelProps(existingProps = {}, model) {
		const { type, value } = existingProps;
		switch (type) {
			case "radio": return shared.looseEqual(model, value) ? { checked: true } : null;
			case "checkbox": return (shared.isArray(model) ? ssrLooseContain(model, value) : model) ? { checked: true } : null;
			default: return { value: model };
		}
	}
	var helpers = /* @__PURE__ */ Object.freeze({
		__proto__: null,
		ssrGetDirectiveProps,
		ssrGetDynamicModelProps,
		ssrIncludeBooleanAttr: shared.includeBooleanAttr,
		ssrInterpolate,
		ssrLooseContain,
		ssrLooseEqual,
		ssrRenderAttr,
		ssrRenderAttrs,
		ssrRenderClass,
		ssrRenderComponent,
		ssrRenderDynamicAttr,
		ssrRenderDynamicModel,
		ssrRenderList,
		ssrRenderSlot,
		ssrRenderSlotInner,
		ssrRenderStyle,
		ssrRenderSuspense,
		ssrRenderTeleport,
		ssrRenderVNode: renderVNode
	});
	var compileCache = /* @__PURE__ */ Object.create(null);
	function ssrCompile(template, instance) {
		const Component = instance.type;
		const { isCustomElement, compilerOptions } = instance.appContext.config;
		const { delimiters, compilerOptions: componentCompilerOptions } = Component;
		const finalCompilerOptions = shared.extend(shared.extend({
			isCustomElement,
			delimiters
		}, compilerOptions), componentCompilerOptions);
		finalCompilerOptions.isCustomElement = finalCompilerOptions.isCustomElement || shared.NO;
		finalCompilerOptions.isNativeTag = finalCompilerOptions.isNativeTag || shared.NO;
		const cacheKey = JSON.stringify({
			template,
			compilerOptions: finalCompilerOptions
		}, (key, value) => {
			return shared.isFunction(value) ? value.toString() : value;
		});
		const cached = compileCache[cacheKey];
		if (cached) return cached;
		finalCompilerOptions.onError = (err) => {
			throw err;
		};
		const { code } = compilerSsr.compile(template, finalCompilerOptions);
		const requireMap = {
			vue: Vue__namespace,
			"vue/server-renderer": helpers
		};
		const fakeRequire = (id) => requireMap[id];
		return compileCache[cacheKey] = Function("require", code)(fakeRequire);
	}
	var { createComponentInstance, setCurrentRenderingInstance, setupComponent, renderComponentRoot, normalizeVNode, pushWarningContext, popWarningContext } = Vue.ssrUtils;
	function createBuffer() {
		let appendable = false;
		const buffer = [];
		return {
			getBuffer() {
				return buffer;
			},
			push(item) {
				const isStringItem = shared.isString(item);
				if (appendable && isStringItem) {
					buffer[buffer.length - 1] += item;
					return;
				}
				buffer.push(item);
				appendable = isStringItem;
				if (shared.isPromise(item) || shared.isArray(item) && item.hasAsync) buffer.hasAsync = true;
			}
		};
	}
	function renderComponentVNode(vnode, parentComponent = null, slotScopeId) {
		const instance = vnode.component = createComponentInstance(vnode, parentComponent, null);
		const res = setupComponent(instance, true);
		const hasAsyncSetup = shared.isPromise(res);
		let prefetches = instance.sp;
		if (hasAsyncSetup || prefetches) return Promise.resolve(res).then(() => {
			if (hasAsyncSetup) prefetches = instance.sp;
			if (prefetches) return Promise.all(prefetches.map((prefetch) => prefetch.call(instance.proxy)));
		}).catch(shared.NOOP).then(() => renderComponentSubTree(instance, slotScopeId));
		else return renderComponentSubTree(instance, slotScopeId);
	}
	function renderComponentSubTree(instance, slotScopeId) {
		const comp = instance.type;
		const { getBuffer, push } = createBuffer();
		if (shared.isFunction(comp)) {
			let root = renderComponentRoot(instance);
			if (!comp.props) {
				for (const key in instance.attrs) if (key.startsWith(`data-v-`)) (root.props || (root.props = {}))[key] = ``;
			}
			renderVNode(push, instance.subTree = root, instance, slotScopeId);
		} else {
			if ((!instance.render || instance.render === shared.NOOP) && !instance.ssrRender && !comp.ssrRender && shared.isString(comp.template)) comp.ssrRender = ssrCompile(comp.template, instance);
			const ssrRender = instance.ssrRender || comp.ssrRender;
			if (ssrRender) {
				let attrs = instance.inheritAttrs !== false ? instance.attrs : void 0;
				let hasCloned = false;
				let cur = instance;
				while (true) {
					const scopeId = cur.vnode.scopeId;
					if (scopeId) {
						if (!hasCloned) {
							attrs = { ...attrs };
							hasCloned = true;
						}
						attrs[scopeId] = "";
					}
					const parent = cur.parent;
					if (parent && parent.subTree && parent.subTree === cur.vnode) cur = parent;
					else break;
				}
				if (slotScopeId) {
					if (!hasCloned) attrs = { ...attrs };
					const slotScopeIdList = slotScopeId.trim().split(" ");
					for (let i = 0; i < slotScopeIdList.length; i++) attrs[slotScopeIdList[i]] = "";
				}
				const prev = setCurrentRenderingInstance(instance);
				try {
					ssrRender(instance.proxy, push, instance, attrs, instance.props, instance.setupState, instance.data, instance.ctx);
				} finally {
					setCurrentRenderingInstance(prev);
				}
			} else if (instance.render && instance.render !== shared.NOOP) renderVNode(push, instance.subTree = renderComponentRoot(instance), instance, slotScopeId);
			else {
				const componentName = comp.name || comp.__file || `<Anonymous>`;
				Vue.warn(`Component ${componentName} is missing template or render function.`);
				push(`<!---->`);
			}
		}
		return getBuffer();
	}
	function renderVNode(push, vnode, parentComponent, slotScopeId) {
		const { type, shapeFlag, children, dirs, props } = vnode;
		if (dirs) vnode.props = applySSRDirectives(vnode, props, dirs);
		switch (type) {
			case Vue.Text:
				push(shared.escapeHtml(children));
				break;
			case Vue.Comment:
				push(children ? `<!--${shared.escapeHtmlComment(children)}-->` : `<!---->`);
				break;
			case Vue.Static:
				push(children);
				break;
			case Vue.Fragment:
				if (vnode.slotScopeIds) slotScopeId = (slotScopeId ? slotScopeId + " " : "") + vnode.slotScopeIds.join(" ");
				push(`<!--[-->`);
				renderVNodeChildren(push, children, parentComponent, slotScopeId);
				push(`<!--]-->`);
				break;
			default: if (shapeFlag & 1) renderElementVNode(push, vnode, parentComponent, slotScopeId);
			else if (shapeFlag & 6) push(renderComponentVNode(vnode, parentComponent, slotScopeId));
			else if (shapeFlag & 64) renderTeleportVNode(push, vnode, parentComponent, slotScopeId);
			else if (shapeFlag & 128) renderVNode(push, vnode.ssContent, parentComponent, slotScopeId);
			else Vue.warn("[@vue/server-renderer] Invalid VNode type:", type, `(${typeof type})`);
		}
	}
	function renderVNodeChildren(push, children, parentComponent, slotScopeId) {
		for (let i = 0; i < children.length; i++) renderVNode(push, normalizeVNode(children[i]), parentComponent, slotScopeId);
	}
	function renderElementVNode(push, vnode, parentComponent, slotScopeId) {
		const tag = vnode.type;
		let { props, children, shapeFlag, scopeId } = vnode;
		let openTag = `<${tag}`;
		if (props) openTag += ssrRenderAttrs(props, tag);
		if (scopeId) openTag += ` ${scopeId}`;
		let curParent = parentComponent;
		let curVnode = vnode;
		while (curParent && curVnode === curParent.subTree) {
			curVnode = curParent.vnode;
			if (curVnode.scopeId) openTag += ` ${curVnode.scopeId}`;
			curParent = curParent.parent;
		}
		if (slotScopeId) openTag += ` ${slotScopeId}`;
		push(openTag + `>`);
		if (!shared.isVoidTag(tag)) {
			let hasChildrenOverride = false;
			if (props) {
				if (props.innerHTML) {
					hasChildrenOverride = true;
					push(props.innerHTML);
				} else if (props.textContent) {
					hasChildrenOverride = true;
					push(shared.escapeHtml(props.textContent));
				} else if (tag === "textarea" && props.value) {
					hasChildrenOverride = true;
					push(shared.escapeHtml(props.value));
				}
			}
			if (!hasChildrenOverride) {
				if (shapeFlag & 8) push(shared.escapeHtml(children));
				else if (shapeFlag & 16) renderVNodeChildren(push, children, parentComponent, slotScopeId);
			}
			push(`</${tag}>`);
		}
	}
	function applySSRDirectives(vnode, rawProps, dirs) {
		const toMerge = [];
		for (let i = 0; i < dirs.length; i++) {
			const binding = dirs[i];
			const { dir: { getSSRProps } } = binding;
			if (getSSRProps) {
				const props = getSSRProps(binding, vnode);
				if (props) toMerge.push(props);
			}
		}
		return Vue.mergeProps(rawProps || {}, ...toMerge);
	}
	function renderTeleportVNode(push, vnode, parentComponent, slotScopeId) {
		const target = vnode.props && vnode.props.to;
		const disabled = vnode.props && vnode.props.disabled;
		if (!target) {
			if (!disabled) Vue.warn(`[@vue/server-renderer] Teleport is missing target prop.`);
			return [];
		}
		if (!shared.isString(target)) {
			Vue.warn(`[@vue/server-renderer] Teleport target must be a query selector string.`);
			return [];
		}
		ssrRenderTeleport(push, (push2) => {
			renderVNodeChildren(push2, vnode.children, parentComponent, slotScopeId);
		}, target, disabled || disabled === "", parentComponent);
	}
	var { isVNode: isVNode$1 } = Vue.ssrUtils;
	function nestedUnrollBuffer(buffer, parentRet, startIndex) {
		if (!buffer.hasAsync) return parentRet + unrollBufferSync$1(buffer);
		let ret = parentRet;
		for (let i = startIndex; i < buffer.length; i += 1) {
			const item = buffer[i];
			if (shared.isString(item)) {
				ret += item;
				continue;
			}
			if (shared.isPromise(item)) return item.then((nestedItem) => {
				buffer[i] = nestedItem;
				return nestedUnrollBuffer(buffer, ret, i);
			});
			const result = nestedUnrollBuffer(item, ret, 0);
			if (shared.isPromise(result)) return result.then((nestedItem) => {
				buffer[i] = nestedItem;
				return nestedUnrollBuffer(buffer, "", i);
			});
			ret = result;
		}
		return ret;
	}
	function unrollBuffer$1(buffer) {
		return nestedUnrollBuffer(buffer, "", 0);
	}
	function unrollBufferSync$1(buffer) {
		let ret = "";
		for (let i = 0; i < buffer.length; i++) {
			let item = buffer[i];
			if (shared.isString(item)) ret += item;
			else ret += unrollBufferSync$1(item);
		}
		return ret;
	}
	async function renderToString(input, context = {}) {
		if (isVNode$1(input)) return renderToString(Vue.createApp({ render: () => input }), context);
		const vnode = Vue.createVNode(input._component, input._props);
		vnode.appContext = input._context;
		input.provide(Vue.ssrContextKey, context);
		const result = await unrollBuffer$1(await renderComponentVNode(vnode));
		await resolveTeleports(context);
		if (context.__watcherHandles) for (const unwatch of context.__watcherHandles) unwatch();
		return result;
	}
	async function resolveTeleports(context) {
		if (context.__teleportBuffers) {
			context.teleports = context.teleports || {};
			for (const key in context.__teleportBuffers) context.teleports[key] = await unrollBuffer$1(await Promise.all([context.__teleportBuffers[key]]));
		}
	}
	var { isVNode } = Vue.ssrUtils;
	Vue.initDirectivesForSSR();
	exports.ssrIncludeBooleanAttr = shared.includeBooleanAttr;
	exports.renderToString = renderToString;
	exports.ssrInterpolate = ssrInterpolate;
	exports.ssrLooseEqual = ssrLooseEqual;
	exports.ssrRenderAttr = ssrRenderAttr;
	exports.ssrRenderAttrs = ssrRenderAttrs;
	exports.ssrRenderClass = ssrRenderClass;
	exports.ssrRenderComponent = ssrRenderComponent;
	exports.ssrRenderList = ssrRenderList;
	exports.ssrRenderSlot = ssrRenderSlot;
	exports.ssrRenderStyle = ssrRenderStyle;
	exports.ssrRenderVNode = renderVNode;
}));
//#endregion
//#region node_modules/vue/server-renderer/index.mjs
var server_renderer_exports = /* @__PURE__ */ __exportAll({});
__reExport(server_renderer_exports, /* @__PURE__ */ __toESM(require_server_renderer_cjs_prod(), 1));
//#endregion
export { require_server_renderer_cjs_prod as n, server_renderer_exports as t };
