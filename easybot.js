
exports.EasyBot = EasyBot;

var fs = require("fs");
var irc = require("irc");
var S = require("string");
var dateFormat = require("dateformat");

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
        
    this.adminModule = null;

    this.ircModules = {};

    this.boot = function(){

            self.client = new irc.Client(
                    self.config.server, 
                    self.config.botnick, 
                    {autoConnect: false}
            );
            
            self.client.connect(function(){
                
                self.client.join(self.config.mainChan);
     
                self.loadAdminModule();
                self.loadAllModules();
                
                console.log("PIPBOT - Connect and join finished with nick: " + self.client.nick + " in " + self.config.mainChan);
                
            });

    };
    
    this.loadAdminModule = function(){
        
        var modFilename = "adminCommands.js";

        if(self.adminModule !== null){
            self.unloadAdminModule();
        }
        
        var ircMod = require("./irc_modules/" + modFilename);
        
        if(ircMod === null){
            result = "NOT_FOUND";
            message = "Module " + modFilename + " not found."; 
        }else{
            
            var mod = new ircMod.ircModule(
                    self,
                    self.client, 
                    self.config.admin,
                    self.config.mainChan,
                    self.config,
                    self.renderText);
            
            if(mod !== null){
                
                self.adminModule = mod;

                if(self.adminModule["start"] !== undefined){
                    
                    if(self.adminModule.start() === true){
                        result = "SUCCESS";
                        message = "Module " + modFilename + " loading success."; 
                    }else{
                        result = "FAILURE";
                        message = "Module " + modFilename + " start failure.";                  
                    }
                    
                }else{
                    result = "FAILURE";
                    message = "Module " + modFilename + " loading failure.";                    
                }
                
            }

        }
        
        console.log(message);

        return result;

    };
    
    this.loadAllModules = function(){

        var ircModFiles = fs.readdirSync("./irc_modules");
        
        if(ircModFiles !== undefined && ircModFiles.length > 0){

            for(var element in ircModFiles){
                
                if(!S(ircModFiles[element]).startsWith(".")  && ircModFiles[element] !== "adminCommands.js"){
                    self.loadModule(ircModFiles[element]);
                }

            }
        }
        
        return true;
        
    };
    
    this.reloadAdminModule = function(){
        
        if(self.adminModule !== null){
            if(self.adminModule["stop"] !== undefined){
                self.adminModule.stop();
                self.adminModule = null;
            }
        }       
        
        self.loadModule("adminCommands.js");
        
        return true;
        
    };

    
    this.reloadAllModules = function(){

        self.shutdown();

        self.loadAllModules();
        
        return true;
    };

    
    this.findModule = function(modFilename){
        
        if(self.ircModules[modFilename] !== undefined){
            return self.ircModules[modFilename];
        }

    };
    
    this.loadModule = function(modFilename){
        
        var result;
        var message;

        var ircMod = require("./irc_modules/" + modFilename);
        
        if(ircMod === null){
            result = "NOT_FOUND";
            message = "Module " + modFilename + " not found."; 
        }else{
            
            var mod = new ircMod.ircModule(
                    self,
                    self.client, 
                    self.config.admin,
                    self.config.mainChan,
                    self.config,
                    self.renderText);
                
            if(self.ircModules[modFilename] !== undefined){
                result = "EXISTING";
                message = "Module " + modFilename + " previously loaded."; 
            }else{
                
                self.ircModules[modFilename] = mod;
                
                if(self.ircModules[modFilename]["start"] !== undefined){
                    
                    if(self.ircModules[modFilename].start() === true){
                        result = "SUCCESS";
                        message = "Module " + modFilename + " loading success."; 
                    }else{
                        result = "FAILURE";
                        message = "Module " + modFilename + " start failure.";                  
                    }
                }else{
                    result = "FAILURE";
                    message = "Module " + modFilename + " loading failure.";                    
                }

            }
        }
        
        console.log(message);
        
        return result;

    };
    
    this.unloadModule = function(modFilename){
        
        var result;
        var message;        

        var ircMod = this.findModule(modFilename);

        if(ircMod !== undefined){

            if(ircMod["stop"] !== undefined){
                ircMod.stop();
            }
            
            delete self.ircModules[modFilename];

            result = "SUCCESS";
            message = "Module " + modFilename + " unloaded.";

        } else {

            result = "NOT_FOUND";
            message = "Module " + modFilename + " not found.";

        }
        
        console.log(message);

        return result;      

    };
    
    this.shutdown = function(){
        
        for(var modFilename in self.ircModules){
            self.unloadModule(modFilename);
        }
        
        self.icModules = null;
        
        return true;

    };
    
};




