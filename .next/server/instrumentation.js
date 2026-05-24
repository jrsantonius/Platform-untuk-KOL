"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "instrumentation";
exports.ids = ["instrumentation"];
exports.modules = {

/***/ "(instrument)/./instrumentation.ts":
/*!****************************!*\
  !*** ./instrumentation.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   register: () => (/* binding */ register)\n/* harmony export */ });\nasync function register() {\n    // Node.js 22+ adds a partial `localStorage` global without proper Web Storage methods.\n    // This breaks Next.js dev overlay during SSR. Remove it so typeof checks return 'undefined'.\n    if (typeof globalThis.localStorage !== \"undefined\") {\n        try {\n            delete globalThis.localStorage;\n        } catch  {\n            globalThis.localStorage = undefined;\n        }\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGluc3RydW1lbnQpLy4vaW5zdHJ1bWVudGF0aW9uLnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBTyxlQUFlQTtJQUNwQix1RkFBdUY7SUFDdkYsNkZBQTZGO0lBQzdGLElBQUksT0FBTyxXQUF3Q0UsWUFBWSxLQUFLLGFBQWE7UUFDL0UsSUFBSTtZQUNGLE9BQU8sV0FBd0NBLFlBQVk7UUFDN0QsRUFBRSxPQUFNO1lBQ0xELFdBQXVDQyxZQUFZLEdBQUdDO1FBQ3pEO0lBQ0Y7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2FudG9uaXVzeW9uYW5kYS9rb2wtcGxhdGZvcm0vaW5zdHJ1bWVudGF0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBhc3luYyBmdW5jdGlvbiByZWdpc3RlcigpIHtcbiAgLy8gTm9kZS5qcyAyMisgYWRkcyBhIHBhcnRpYWwgYGxvY2FsU3RvcmFnZWAgZ2xvYmFsIHdpdGhvdXQgcHJvcGVyIFdlYiBTdG9yYWdlIG1ldGhvZHMuXG4gIC8vIFRoaXMgYnJlYWtzIE5leHQuanMgZGV2IG92ZXJsYXkgZHVyaW5nIFNTUi4gUmVtb3ZlIGl0IHNvIHR5cGVvZiBjaGVja3MgcmV0dXJuICd1bmRlZmluZWQnLlxuICBpZiAodHlwZW9mIChnbG9iYWxUaGlzIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KS5sb2NhbFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB0cnkge1xuICAgICAgZGVsZXRlIChnbG9iYWxUaGlzIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KS5sb2NhbFN0b3JhZ2U7XG4gICAgfSBjYXRjaCB7XG4gICAgICAoZ2xvYmFsVGhpcyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikubG9jYWxTdG9yYWdlID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuIl0sIm5hbWVzIjpbInJlZ2lzdGVyIiwiZ2xvYmFsVGhpcyIsImxvY2FsU3RvcmFnZSIsInVuZGVmaW5lZCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(instrument)/./instrumentation.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(instrument)/./instrumentation.ts"));
module.exports = __webpack_exports__;

})();