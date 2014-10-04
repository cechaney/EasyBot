
exports.easybot = EasyBot;

var fs = require("fs");
var irc = require("irc");
var S = require("string");
var dateFormat = require("dateformat");
var uuid = require('uuid');

function EasyBot(admin, mainChan, channels, server, botnick){

	var self = this;

	this.config = {
        admin: admin,
		mainChan: mainChan,
		channels: channels,
		server: server,
		botnick: botnick
        };

	this.client = null;
        
        this.ircModules = {};

	this.boot = function(){

            self.client = new irc.Client(
                    self.config.server, 
                    self.config.botnick, 
                    {autoConnect: false}
            );
            
            self.client.connect(function(){
            	
            	self.client.join(self.config.mainChan);
            	
                var ircModFiles = fs.readdirSync("./irc_modules");

                if(ircModFiles && ircModFiles.length > 0){

                    for(var element in ircModFiles){

                        var ircModName = ircModFiles[element];
                        var ircMod = require("./irc_modules/" + ircModName);
                        var id = uuid.v1();
                        var mod = new ircMod.ircModule(
                            id,
                            self.client,
                            self.config.admin, 
                            self.config.mainChan,
                            self.config,
                            self.renderText);

                        self.ircModules[id] = mod;
                        self.ircModules[id].start();
                    }
                }
                
                console.log("BOT - Connect and join finised with nick: " + self.client.nick + " in " + self.config.mainChan);
                console.log("");
                console.log("BOT - Modules loaded....");

                for(var moduleName in self.ircModules){
                    console.log("    " + moduleName + " " + self.ircModules[moduleName].name);
                }            	
            	
            });

	};
	
	this.renderText = function(text){
		return irc.colors.wrap("red",text);
	};

};




