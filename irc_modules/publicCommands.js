
    exports.ircModule = PublicCommands;
    
    var S = require("string");
    var irc = require("irc");

    function PublicCommands(bot, client, admin, channel, config){
        
        var self = this;
        
        this.name = "PublicCommands";
        
        this.bot = bot;
        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.commands = {};

        this.trc =  function(text){
            return irc.colors.wrap("orange",text);
        };        
        
        this.start = function(){
            self.client.addListener("message", this.parseMessage);
            console.log(this.name + " module started.");
            return true;
        };
        
        this.stop = function(){
            self.client.removeListener("message", this.parseMessage);
            console.log(this.name + " module stopped.");
            return true;
        };          
        
        this.parseMessage = function(from, to, message){

            var cmd = message.toUpperCase().split(" ");
            
            if(cmd[0] === config.botnick){
                if(self.commands && self.commands[cmd[1]]){
                    self.commands[cmd[1]](cmd, message);
                }
            }

        };
        
        this.commands["TIME"] = function(cmd, message){
            var now = new Date();
            var prettyDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

            self.client.say(self.channel, self.trc(prettyDate));
        };
        
        this.commands["SAY"] = function(cmd, message){
            if(cmd[2] === "HELLO"){
                self.client.say(self.channel, self.trc("Hello everyone.  I am EasyBot!"));
            }            
        };
        
        this.commands["WHO"] = function(cmd, message){
            if(cmd[2] === "ARE" && cmd[3] === "YOU"){
                self.client.say(self.channel, self.trc("I am EasyBot. A node.js based IRC bot newly born."));
            }            
        };
        
        this.commands["EAT"] = function(cmd, message){
            self.client.say(self.channel, self.trc("Om nom nom"));
        };
        
        this.commands["MAKE"] = function(cmd, message){
            if(cmd[2] === "SANDWICH"){
                self.client.say(self.channel, self.trc("A philly cheesesteak sandwich? http://phillycheesesteak.com/"));
            }
        };
        
        this.commands["SHOW"] = function(cmd, message){
            if(cmd[2] === "KITTENS"){
                var imageSize = Math.floor(Math.random() * (1000 - 200) + 200);
                self.client.say(self.channel, self.trc("http://placekitten.com/g/" + imageSize + "/" + imageSize));
            }            
        };
        
        this.commands["NIGHTDRIVE"] = function(cmd, message){
            self.client.say(self.channel, self.trc("==="));
            self.client.say(self.channel, self.trc("===There's something inside you...==="));
            self.client.say(self.channel, self.trc("===It's hard to explain...==="));
            self.client.say(self.channel, self.trc("===They're talking about you boy...==="));
            self.client.say(self.channel, self.trc("===But you're still the same.==="));
            self.client.say(self.channel, self.trc("=== --Kavinsky \"Nightdrive\"==="));
            self.client.say(self.channel, self.trc("==="));            
        };

    };
