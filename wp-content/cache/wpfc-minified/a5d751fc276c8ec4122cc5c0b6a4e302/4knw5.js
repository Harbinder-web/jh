(function(jQuery, window, undefined){
jQuery.migrateVersion="1.4.1";
var warnedAbout={};
jQuery.migrateWarnings=[];
if(window.console&&window.console.log){
window.console.log("JQMIGRATE: Migrate is installed" +
(jQuery.migrateMute ? "":" with logging active") +
", version " + jQuery.migrateVersion);
}
if(jQuery.migrateTrace===undefined){
jQuery.migrateTrace=true;
}
jQuery.migrateReset=function(){
warnedAbout={};
jQuery.migrateWarnings.length=0;
};
function migrateWarn(msg){
var console=window.console;
if(!warnedAbout[ msg ]){
warnedAbout[ msg ]=true;
jQuery.migrateWarnings.push(msg);
if(console&&console.warn&&!jQuery.migrateMute){
console.warn("JQMIGRATE: " + msg);
if(jQuery.migrateTrace&&console.trace){
console.trace();
}}
}}
function migrateWarnProp(obj, prop, value, msg){
if(Object.defineProperty){
try {
Object.defineProperty(obj, prop, {
configurable: true,
enumerable: true,
get: function(){
migrateWarn(msg);
return value;
},
set: function(newValue){
migrateWarn(msg);
value=newValue;
}});
return;
} catch(err){
}}
jQuery._definePropertyBroken=true;
obj[ prop ]=value;
}
if(document.compatMode==="BackCompat"){
migrateWarn("jQuery is not compatible with Quirks Mode");
}
var attrFn=jQuery("<input/>", { size: 1 }).attr("size")&&jQuery.attrFn,
oldAttr=jQuery.attr,
valueAttrGet=jQuery.attrHooks.value&&jQuery.attrHooks.value.get ||
function(){ return null; },
valueAttrSet=jQuery.attrHooks.value&&jQuery.attrHooks.value.set ||
function(){ return undefined; },
rnoType=/^(?:input|button)$/i,
rnoAttrNodeType=/^[238]$/,
rboolean=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
ruseDefault=/^(?:checked|selected)$/i;
migrateWarnProp(jQuery, "attrFn", attrFn||{}, "jQuery.attrFn is deprecated");
jQuery.attr=function(elem, name, value, pass){
var lowerName=name.toLowerCase(),
nType=elem&&elem.nodeType;
if(pass){
if(oldAttr.length < 4){
migrateWarn("jQuery.fn.attr(props, pass) is deprecated");
}
if(elem&&!rnoAttrNodeType.test(nType) &&
(attrFn ? name in attrFn:jQuery.isFunction(jQuery.fn[name]))){
return jQuery(elem)[ name ](value);
}}
if(name==="type"&&value!==undefined&&rnoType.test(elem.nodeName)&&elem.parentNode){
migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
}
if(!jQuery.attrHooks[ lowerName ]&&rboolean.test(lowerName)){
jQuery.attrHooks[ lowerName ]={
get: function(elem, name){
var attrNode,
property=jQuery.prop(elem, name);
return property===true||typeof property!=="boolean" &&
(attrNode=elem.getAttributeNode(name))&&attrNode.nodeValue!==false ?
name.toLowerCase() :
undefined;
},
set: function(elem, value, name){
var propName;
if(value===false){
jQuery.removeAttr(elem, name);
}else{
propName=jQuery.propFix[ name ]||name;
if(propName in elem){
elem[ propName ]=true;
}
elem.setAttribute(name, name.toLowerCase());
}
return name;
}};
if(ruseDefault.test(lowerName)){
migrateWarn("jQuery.fn.attr('" + lowerName + "') might use property instead of attribute");
}}
return oldAttr.call(jQuery, elem, name, value);
};
jQuery.attrHooks.value={
get: function(elem, name){
var nodeName=(elem.nodeName||"").toLowerCase();
if(nodeName==="button"){
return valueAttrGet.apply(this, arguments);
}
if(nodeName!=="input"&&nodeName!=="option"){
migrateWarn("jQuery.fn.attr('value') no longer gets properties");
}
return name in elem ?
elem.value :
null;
},
set: function(elem, value){
var nodeName=(elem.nodeName||"").toLowerCase();
if(nodeName==="button"){
return valueAttrSet.apply(this, arguments);
}
if(nodeName!=="input"&&nodeName!=="option"){
migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
}
elem.value=value;
}};
var matched, browser,
oldInit=jQuery.fn.init,
oldFind=jQuery.find,
oldParseJSON=jQuery.parseJSON,
rspaceAngle=/^\s*</,
rattrHashTest=/\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,
rattrHashGlob=/\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g,
rquickExpr=/^([^<]*)(<[\w\W]+>)([^>]*)$/;
jQuery.fn.init=function(selector, context, rootjQuery){
var match, ret;
if(selector&&typeof selector==="string"){
if(!jQuery.isPlainObject(context) &&
(match=rquickExpr.exec(jQuery.trim(selector)))&&match[ 0 ]){
if(!rspaceAngle.test(selector)){
migrateWarn("$(html) HTML strings must start with '<' character");
}
if(match[ 3 ]){
migrateWarn("$(html) HTML text after last tag is ignored");
}
if(match[ 0 ].charAt(0)==="#"){
migrateWarn("HTML string cannot start with a '#' character");
jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
}
if(context&&context.context&&context.context.nodeType){
context=context.context;
}
if(jQuery.parseHTML){
return oldInit.call(this,
jQuery.parseHTML(match[ 2 ], context&&context.ownerDocument ||
context||document, true), context, rootjQuery);
}}
}
ret=oldInit.apply(this, arguments);
if(selector&&selector.selector!==undefined){
ret.selector=selector.selector;
ret.context=selector.context;
}else{
ret.selector=typeof selector==="string" ? selector:"";
if(selector){
ret.context=selector.nodeType? selector:context||document;
}}
return ret;
};
jQuery.fn.init.prototype=jQuery.fn;
jQuery.find=function(selector){
var args=Array.prototype.slice.call(arguments);
if(typeof selector==="string"&&rattrHashTest.test(selector)){
try {
document.querySelector(selector);
} catch(err1){
selector=selector.replace(rattrHashGlob, function(_, attr, op, value){
return "[" + attr + op + "\"" + value + "\"]";
});
try {
document.querySelector(selector);
migrateWarn("Attribute selector with '#' must be quoted: " + args[ 0 ]);
args[ 0 ]=selector;
} catch(err2){
migrateWarn("Attribute selector with '#' was not fixed: " + args[ 0 ]);
}}
}
return oldFind.apply(this, args);
};
var findProp;
for(findProp in oldFind){
if(Object.prototype.hasOwnProperty.call(oldFind, findProp)){
jQuery.find[ findProp ]=oldFind[ findProp ];
}}
jQuery.parseJSON=function(json){
if(!json){
migrateWarn("jQuery.parseJSON requires a valid JSON string");
return null;
}
return oldParseJSON.apply(this, arguments);
};
jQuery.uaMatch=function(ua){
ua=ua.toLowerCase();
var match=/(chrome)[ \/]([\w.]+)/.exec(ua) ||
/(webkit)[ \/]([\w.]+)/.exec(ua) ||
/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
/(msie) ([\w.]+)/.exec(ua) ||
ua.indexOf("compatible") < 0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
[];
return {
browser: match[ 1 ]||"",
version: match[ 2 ]||"0"
};};
if(!jQuery.browser){
matched=jQuery.uaMatch(navigator.userAgent);
browser={};
if(matched.browser){
browser[ matched.browser ]=true;
browser.version=matched.version;
}
if(browser.chrome){
browser.webkit=true;
}else if(browser.webkit){
browser.safari=true;
}
jQuery.browser=browser;
}
migrateWarnProp(jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated");
jQuery.boxModel=jQuery.support.boxModel=(document.compatMode==="CSS1Compat");
migrateWarnProp(jQuery, "boxModel", jQuery.boxModel, "jQuery.boxModel is deprecated");
migrateWarnProp(jQuery.support, "boxModel", jQuery.support.boxModel, "jQuery.support.boxModel is deprecated");
jQuery.sub=function(){
function jQuerySub(selector, context){
return new jQuerySub.fn.init(selector, context);
}
jQuery.extend(true, jQuerySub, this);
jQuerySub.superclass=this;
jQuerySub.fn=jQuerySub.prototype=this();
jQuerySub.fn.constructor=jQuerySub;
jQuerySub.sub=this.sub;
jQuerySub.fn.init=function init(selector, context){
var instance=jQuery.fn.init.call(this, selector, context, rootjQuerySub);
return instance instanceof jQuerySub ?
instance :
jQuerySub(instance);
};
jQuerySub.fn.init.prototype=jQuerySub.fn;
var rootjQuerySub=jQuerySub(document);
migrateWarn("jQuery.sub() is deprecated");
return jQuerySub;
};
jQuery.fn.size=function(){
migrateWarn("jQuery.fn.size() is deprecated; use the .length property");
return this.length;
};
var internalSwapCall=false;
if(jQuery.swap){
jQuery.each([ "height", "width", "reliableMarginRight" ], function(_, name){
var oldHook=jQuery.cssHooks[ name ]&&jQuery.cssHooks[ name ].get;
if(oldHook){
jQuery.cssHooks[ name ].get=function(){
var ret;
internalSwapCall=true;
ret=oldHook.apply(this, arguments);
internalSwapCall=false;
return ret;
};}});
}
jQuery.swap=function(elem, options, callback, args){
var ret, name,
old={};
if(!internalSwapCall){
migrateWarn("jQuery.swap() is undocumented and deprecated");
}
for(name in options){
old[ name ]=elem.style[ name ];
elem.style[ name ]=options[ name ];
}
ret=callback.apply(elem, args||[]);
for(name in options){
elem.style[ name ]=old[ name ];
}
return ret;
};
jQuery.ajaxSetup({
converters: {
"text json": jQuery.parseJSON
}});
var oldFnData=jQuery.fn.data;
jQuery.fn.data=function(name){
var ret, evt,
elem=this[0];
if(elem&&name==="events"&&arguments.length===1){
ret=jQuery.data(elem, name);
evt=jQuery._data(elem, name);
if(( ret===undefined||ret===evt)&&evt!==undefined){
migrateWarn("Use of jQuery.fn.data('events') is deprecated");
return evt;
}}
return oldFnData.apply(this, arguments);
};
var rscriptType=/\/(java|ecma)script/i;
if(!jQuery.clean){
jQuery.clean=function(elems, context, fragment, scripts){
context=context||document;
context = !context.nodeType&&context[0]||context;
context=context.ownerDocument||context;
migrateWarn("jQuery.clean() is deprecated");
var i, elem, handleScript, jsTags,
ret=[];
jQuery.merge(ret, jQuery.buildFragment(elems, context).childNodes);
if(fragment){
handleScript=function(elem){
if(!elem.type||rscriptType.test(elem.type)){
return scripts ?
scripts.push(elem.parentNode ? elem.parentNode.removeChild(elem):elem) :
fragment.appendChild(elem);
}};
for(i=0; (elem=ret[i])!=null; i++){
if(!(jQuery.nodeName(elem, "script")&&handleScript(elem))){
fragment.appendChild(elem);
if(typeof elem.getElementsByTagName!=="undefined"){
jsTags=jQuery.grep(jQuery.merge([], elem.getElementsByTagName("script")), handleScript);
ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
i +=jsTags.length;
}}
}}
return ret;
};}
var eventAdd=jQuery.event.add,
eventRemove=jQuery.event.remove,
eventTrigger=jQuery.event.trigger,
oldToggle=jQuery.fn.toggle,
oldLive=jQuery.fn.live,
oldDie=jQuery.fn.die,
oldLoad=jQuery.fn.load,
ajaxEvents="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
rajaxEvent=new RegExp("\\b(?:" + ajaxEvents + ")\\b"),
rhoverHack=/(?:^|\s)hover(\.\S+|)\b/,
hoverHack=function(events){
if(typeof(events)!=="string"||jQuery.event.special.hover){
return events;
}
if(rhoverHack.test(events)){
migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
}
return events&&events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
};
if(jQuery.event.props&&jQuery.event.props[ 0 ]!=="attrChange"){
jQuery.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement");
}
if(jQuery.event.dispatch){
migrateWarnProp(jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated");
}
jQuery.event.add=function(elem, types, handler, data, selector){
if(elem!==document&&rajaxEvent.test(types)){
migrateWarn("AJAX events should be attached to document: " + types);
}
eventAdd.call(this, elem, hoverHack(types||""), handler, data, selector);
};
jQuery.event.remove=function(elem, types, handler, selector, mappedTypes){
eventRemove.call(this, elem, hoverHack(types)||"", handler, selector, mappedTypes);
};
jQuery.each([ "load", "unload", "error" ], function(_, name){
jQuery.fn[ name ]=function(){
var args=Array.prototype.slice.call(arguments, 0);
if(name==="load"&&typeof args[ 0 ]==="string"){
return oldLoad.apply(this, args);
}
migrateWarn("jQuery.fn." + name + "() is deprecated");
args.splice(0, 0, name);
if(arguments.length){
return this.bind.apply(this, args);
}
this.triggerHandler.apply(this, args);
return this;
};});
jQuery.fn.toggle=function(fn, fn2){
if(!jQuery.isFunction(fn)||!jQuery.isFunction(fn2)){
return oldToggle.apply(this, arguments);
}
migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");
var args=arguments,
guid=fn.guid||jQuery.guid++,
i=0,
toggler=function(event){
var lastToggle=(jQuery._data(this, "lastToggle" + fn.guid)||0) % i;
jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);
event.preventDefault();
return args[ lastToggle ].apply(this, arguments)||false;
};
toggler.guid=guid;
while(i < args.length){
args[ i++ ].guid=guid;
}
return this.click(toggler);
};
jQuery.fn.live=function(types, data, fn){
migrateWarn("jQuery.fn.live() is deprecated");
if(oldLive){
return oldLive.apply(this, arguments);
}
jQuery(this.context).on(types, this.selector, data, fn);
return this;
};
jQuery.fn.die=function(types, fn){
migrateWarn("jQuery.fn.die() is deprecated");
if(oldDie){
return oldDie.apply(this, arguments);
}
jQuery(this.context).off(types, this.selector||"**", fn);
return this;
};
jQuery.event.trigger=function(event, data, elem, onlyHandlers){
if(!elem&&!rajaxEvent.test(event)){
migrateWarn("Global events are undocumented and deprecated");
}
return eventTrigger.call(this,  event, data, elem||document, onlyHandlers);
};
jQuery.each(ajaxEvents.split("|"),
function(_, name){
jQuery.event.special[ name ]={
setup: function(){
var elem=this;
if(elem!==document){
jQuery.event.add(document, name + "." + jQuery.guid, function(){
jQuery.event.trigger(name, Array.prototype.slice.call(arguments, 1), elem, true);
});
jQuery._data(this, name, jQuery.guid++);
}
return false;
},
teardown: function(){
if(this!==document){
jQuery.event.remove(document, name + "." + jQuery._data(this, name));
}
return false;
}};}
);
jQuery.event.special.ready={
setup: function(){
if(this===document){
migrateWarn("'ready' event is deprecated");
}}
};
var oldSelf=jQuery.fn.andSelf||jQuery.fn.addBack,
oldFnFind=jQuery.fn.find;
jQuery.fn.andSelf=function(){
migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
return oldSelf.apply(this, arguments);
};
jQuery.fn.find=function(selector){
var ret=oldFnFind.apply(this, arguments);
ret.context=this.context;
ret.selector=this.selector ? this.selector + " " + selector:selector;
return ret;
};
if(jQuery.Callbacks){
var oldDeferred=jQuery.Deferred,
tuples=[
[ "resolve", "done", jQuery.Callbacks("once memory"),
jQuery.Callbacks("once memory"), "resolved" ],
[ "reject", "fail", jQuery.Callbacks("once memory"),
jQuery.Callbacks("once memory"), "rejected" ],
[ "notify", "progress", jQuery.Callbacks("memory"),
jQuery.Callbacks("memory") ]
];
jQuery.Deferred=function(func){
var deferred=oldDeferred(),
promise=deferred.promise();
deferred.pipe=promise.pipe=function(){
var fns=arguments;
migrateWarn("deferred.pipe() is deprecated");
return jQuery.Deferred(function(newDefer){
jQuery.each(tuples, function(i, tuple){
var fn=jQuery.isFunction(fns[ i ])&&fns[ i ];
deferred[ tuple[1] ](function(){
var returned=fn&&fn.apply(this, arguments);
if(returned&&jQuery.isFunction(returned.promise)){
returned.promise()
.done(newDefer.resolve)
.fail(newDefer.reject)
.progress(newDefer.notify);
}else{
newDefer[ tuple[ 0 ] + "With" ](
this===promise ? newDefer.promise():this,
fn ? [ returned ]:arguments
);
}});
});
fns=null;
}).promise();
};
deferred.isResolved=function(){
migrateWarn("deferred.isResolved is deprecated");
return deferred.state()==="resolved";
};
deferred.isRejected=function(){
migrateWarn("deferred.isRejected is deprecated");
return deferred.state()==="rejected";
};
if(func){
func.call(deferred, deferred);
}
return deferred;
};}})(jQuery, window);