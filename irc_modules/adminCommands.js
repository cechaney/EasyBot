exports.ircModule = AdminCommands;

var S = require("string");
var irc = require("irc");

function AdminCommands(bot, client, admin, channel, config) {

    var self = this;

    this.name = "AdminCommands";

    this.bot = bot;
    this.client = client;
    this.admin = admin;
    this.channel = channel;
    this.config = config;
    this.commands = {};

    this.trc = function(text) {
        return irc.colors.wrap("orange", text);
    };

    this.start = function() {
        self.client.addListener("message", this.parseMessage);
        console.log(this.name + " module started.");
        return true;
    };

    this.stop = function() {
        self.client.removeListener("message", this.parseMessage);
        console.log(this.name + " module stopped.");
        return true;
    };

    this.parseMessage = function(nick, to, message) {

        if (nick === self.admin && to === self.client.nick) {

            var cmdline = message.toUpperCase().split(" ");
            var cmd = cmdline[0];
            var params = message.split(" ");

            if (self.commands && self.commands[cmd]) {
                self.commands[cmd](cmd, params, message);
            }

        }

    };

    this.commands["SAY"] = function(cmd, params, message) {
        self.client.say(self.admin, self.trc(S(message).right(
                message.length - 4).s));
    };

    this.commands["LEAVE"] = function(cmd, params, message) {
        self.client.part(self.channel);
    };

    this.commands["JOIN"] = function(cmd, params, message) {
        self.client.join(self.channel);
    };

    this.commands["QUIT"] = function(cmd, params, message) {
        process.exit(0);
    };

    this.commands["LOAD"] = function(cmd, params, message) {

        var ircModName = params[1];

        self.client.say(self.admin, self.trc("Attempting to load " + ircModName));

        var result = self.bot.loadModule(ircModName);

        switch (result) {

        case "NOT_FOUND":
            self.client.say(self.admin, self.trc("Module " + ircModName
                    + " not found."));
            break;

        case "EXISTING":
            self.client.say(self.admin, self.trc("Module " + ircModName
                    + " already loaded."));
            break;

        case "SUCCESS":
            self.client.say(self.admin, self.trc("Module " + ircModName
                    + " successfully loaded."));
            break;

        default:
            self.client.say(self.admin, self.trc("Module " + ircModName
                    + " load produced unknown result."));
            break;
        }

    };

    this.commands["UNLOAD"] = function(cmd, params, message) {

        var ircModName = params[1];

        self.client.say(self.admin, self.trc("Attempting to load " + ircModName));

        var result = self.bot.unloadModule(ircModName);

        switch (result) {

        case "NOT_FOUND":
            self.client.say(self.admin, self.trc("Module " + ircModName + " not found."));
            break;

        case "SUCCESS":
            self.client.say(self.admin, self.trc("Module " + ircModName + " successfully unloaded."));
            break;

        default:
            self.client.say(self.admin, self.trc("Module " + ircModName + " unload produced unknown result."));
            break;
        }

    };

    this.commands["SHUTDOWN"] = function(cmd, params, message) {

        self.client.say(self.admin, self.trc("Attempting to shutdown all modules..."));

        if(self.bot.shutdown() === true){
            self.client.say(self.admin, self.trc("Shutdown successful."));
        }
        else{
            self.client.say(self.admin, self.trc("Shutdown failed."));
        }

    };
    
    this.commands["RESTART"] = function(cmd, params, message) {


        self.client.say(self.admin, self.trc("Attempting to restart all modules..."));

        if(self.bot.reloadAllModules() === true){
            self.client.say(self.admin, self.trc("Restart successful."));
        }
        else{
            self.client.say(self.admin, self.trc("Restart failed."));
        }

    };  

};