(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";var _Utils = _interopRequireDefault(require("../utils/Utils"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const clientSystem = client.registerSystem(0, 0);

const globals = {
  playerData: null };



// Setup which events to listen for
clientSystem.initialize = function () {
  this.listenForEvent(
  "minecraft:client_entered_world",
  eventData => this.onClientEnteredWorld(eventData));

  this.listenForEvent("minecraft:ui_event", eventData => this.onUIMessage(eventData));
  this.registerEventData("my_events:start_game", {});
  this.listenForEvent(
  "guitutorial:player_show_skelly_hint",
  eventData => this.onShowSkellyHint(eventData));

  const scriptLoggerConfig = this.createEventData("minecraft:script_logger_config");
  scriptLoggerConfig.data.log_errors = true;
  scriptLoggerConfig.data.log_information = true;
  scriptLoggerConfig.data.log_warnings = true;
  this.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);
};

// per-tick updates
clientSystem.update = function () {
  // Any logic that needs to happen every tick on the client.
};


clientSystem.onClientEnteredWorld = function (eventData) {
  globals.playerData = eventData.data.player;
  let loadEventData = this.createEventData("minecraft:load_ui");
  loadEventData.data.path = "hello.html";
  loadEventData.data.options.is_showing_menu = true;
  this.broadcastEvent("minecraft:load_ui", loadEventData);
  _Utils.default.broadcastOnChat(this, "Bienvenid@ a minecraft!");
};

clientSystem.onShowSkellyHint = function (eventData) {
  if (isPlayerEqual(globals.playerData, eventData.data.playerData)) {
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "skelly.html";
    loadEventData.data.options.is_showing_menu = true;
    this.broadcastEvent("minecraft:load_ui", loadEventData);
  }
};

clientSystem.onUIMessage = function (eventData) {
  const uiMessage = JSON.parse(eventData.data);

  if (uiMessage.id === "StartPressed") {
    this.unloadUI("hello.html");
    this.sendStartGameEvent();
  } else if (uiMessage.id === "SkellySetName") {
    this.unloadUI("skelly.html");
  }
};

clientSystem.sendStartGameEvent = function () {
  let startEventData = this.createEventData("my_events:start_game");
  this.broadcastEvent("my_events:start_game", startEventData);
};

clientSystem.unloadUI = function (uiName) {
  const unloadEventData = this.createEventData("minecraft:unload_ui");
  unloadEventData.data.path = uiName;
  this.broadcastEvent("minecraft:unload_ui", unloadEventData);
};

function isPlayerEqual(playerData1, playerData2) {
  return areUniqueIdEqual(playerData1.__unique_id__, playerData2.__unique_id__);
}

function areUniqueIdEqual(uniqueId1, uniqueId2) {
  return uniqueId1["64bit_low"] == uniqueId2["64bit_low"] &&
  uniqueId1["64bit_high"] == uniqueId2["64bit_high"];
}

},{"../utils/Utils":2}],2:[function(require,module,exports){
"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
function broadcastOnChat(manager, message) {
  let chatEventData = manager.createEventData("minecraft:display_chat_event");
  chatEventData.data.message = message;

  manager.broadcastEvent("minecraft:display_chat_event", chatEventData);
}var _default =

{
  broadcastOnChat: broadcastOnChat };exports.default = _default;

},{}]},{},[1]);
