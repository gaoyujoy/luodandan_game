/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	;(function () {
	    // var ws = new WebSocket('wss://lddgame.herokuapp.com/ws/chat');
	    var ws = new WebSocket('ws://localhost:3000/ws/chat');
	    ws.onmessage = function (event) {
	        var data = event.data;
	        var msg = JSON.parse(data);
	        // console.log(msg);
	        if (msg.type == 'msg') {
	            console.log(msg.msg);
	        } else {
	            if (!canvas.begin) {
	                if (msg.isbegin) {
	                    canvas.ctx.moveTo(msg.x, msg.y);
	                } else {
	                    canvas.ctx.lineTo(msg.x, msg.y);
	                    canvas.ctx.stroke();
	                    canvas.ctx.moveTo(msg.x, msg.y);
	                }
	            }
	        }
	    };
	    ws.onclose = function (evt) {
	        console.log(evt);
	        console.log('[closed] ' + evt.code);
	    };
	    ws.onerror = function (code, msg) {
	        console.log('[ERROR] ' + code + ': ' + msg);
	    };
	    var canvas = {
	        c: document.getElementById("canvas"),
	        ctx: null,
	        init: function init() {
	            canvas.c.width = canvas.c.clientWidth;
	            canvas.c.height = canvas.c.clientHeight;
	            canvas.ctx = canvas.c.getContext("2d");
	            canvas.binds();
	        },
	        binds: function binds() {
	            var _ = canvas;
	            $(_.c).on('touchstart', function (e) {
	                var point = {
	                    x: e.originalEvent.changedTouches[0].clientX,
	                    y: e.originalEvent.changedTouches[0].clientY,
	                    isbegin: true
	                };
	                _.ctx.moveTo(point.x, point.y);
	                ws.send(JSON.stringify(point));
	            }).on('touchmove', function (e) {
	                e.preventDefault();
	                _.begin = true;
	                var point = {
	                    x: e.originalEvent.changedTouches[0].clientX,
	                    y: e.originalEvent.changedTouches[0].clientY,
	                    isbegin: false
	                };
	                ws.send(JSON.stringify(point));
	                _.ctx.lineTo(point.x, point.y);
	                _.ctx.stroke();
	                _.ctx.moveTo(point.x, point.y);
	            }).on('touchend', function (e) {
	                _.begin = false;
	            });
	        }
	    };
	    canvas.init();
	})();

/***/ }
/******/ ]);