import Utils from "../utils/Utils";

const clientSystem = client.registerSystem(0, 0);

const globals = {
    playerData: null
};


// Setup which events to listen for
clientSystem.initialize = function () {
    this.listenForEvent(
        "minecraft:client_entered_world",
        (eventData) => this.onClientEnteredWorld(eventData)
    );
    this.listenForEvent("minecraft:ui_event", (eventData) => this.onUIMessage(eventData));
    this.registerEventData("my_events:start_game", {});
    this.listenForEvent(
        "guitutorial:player_show_skelly_hint",
        (eventData) => this.onShowSkellyHint(eventData));

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


clientSystem.onClientEnteredWorld = function(eventData) {
    globals.playerData = eventData.data.player;
    let loadEventData = this.createEventData("minecraft:load_ui");
    loadEventData.data.path = "hello.html";
    loadEventData.data.options.is_showing_menu = true;
    this.broadcastEvent("minecraft:load_ui", loadEventData);
    Utils.broadcastOnChat(this, "Bienvenid@ a minecraft!");
};

clientSystem.onShowSkellyHint = function(eventData) {
    if (isPlayerEqual(globals.playerData, eventData.data.playerData)) {
        let loadEventData = this.createEventData("minecraft:load_ui");
        loadEventData.data.path = "skelly.html";
        loadEventData.data.options.is_showing_menu = true;
        this.broadcastEvent("minecraft:load_ui", loadEventData);
    }
};

clientSystem.onUIMessage = function(eventData) {
    const uiMessage = JSON.parse(eventData.data);

    if (uiMessage.id === "StartPressed") {
        this.unloadUI("hello.html");
        this.sendStartGameEvent();
    } else if (uiMessage.id === "SkellySetName") {
        this.unloadUI("skelly.html");
    }
};

clientSystem.sendStartGameEvent = function() {
    let startEventData = this.createEventData("my_events:start_game");
    this.broadcastEvent("my_events:start_game", startEventData);
};

clientSystem.unloadUI = function(uiName) {
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

