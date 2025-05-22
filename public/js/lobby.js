/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/lobby.ts":
/*!********************************!*\
  !*** ./src/client/js/lobby.ts ***!
  \********************************/
/***/ (() => {

eval("\nconst createGameButton = document.querySelector(\"#create-game\");\nconst createGameContainer = document.querySelector(\"#create-game-container\");\nconst closeButton = document.querySelector(\"#close-create-game-form\");\ncreateGameButton === null || createGameButton === void 0 ? void 0 : createGameButton.addEventListener(\"click\", (event) => {\n    console.log(\"clicked\");\n    event.preventDefault();\n    createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.classList.add(\"visible\");\n});\ncloseButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener(\"click\", (event) => {\n    event.preventDefault();\n    createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.classList.remove(\"visible\");\n});\ncreateGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.addEventListener(\"click\", (event) => {\n    if (createGameContainer !== event.target) {\n        return;\n    }\n    createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.classList.remove(\"visible\");\n});\n\n\n//# sourceURL=webpack://term-project-jkls/./src/client/js/lobby.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/lobby.ts"]();
/******/ 	
/******/ })()
;