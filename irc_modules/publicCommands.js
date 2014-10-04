
    exports.ircModule = PublicCommands;
    
    var S = require("string");

    function PublicCommands(id, client, admin, channel, config, textRenderCallback){
        
        var self = this;
        
        this.id = id;
        this.name = "PiblicCommands";
        
        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.trc = textRenderCallback;
        this.commands = {};
        
        this.parseMessage = function(nick, text, message){

            var cmd = text.toUpperCase().split(" ");
            
            if(cmd[0] === config.botnick){
                if(self.commands && self.commands[cmd[1]]){
                    self.commands[cmd[1]](cmd, message);
                }
            }

        };
        
        this.start = function(){

            self.client.addListener("message" + self.channel, function(nick, text, message){
                self.parseMessage(nick, text, message);
            });

        };
        
        this.commands["TIME"] = function(cmd, text, message){
            var now = new Date();
            var prettyDate = dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

            self.client.say(self.channel, self.trc(prettyDate));
        };
        
        this.commands["SAY"] = function(cmd, text, message){
            if(cmd[2] === "HELLO"){
                self.client.say(self.channel, self.trc("Hello everyone.  I am EasyBot!"));
            }            
        };
        
        this.commands["WHO"] = function(cmd, text, message){
            if(cmd[2] === "ARE" && cmd[3] === "YOU"){
                self.client.say(self.channel, self.trc("I am EasyBot. A node.js based IRC bot newly born."));
            }            
        };
        
        this.commands["EAT"] = function(cmd, text, message){
            self.client.say(self.channel, self.trc("Om nom nom"));
        };
        
        this.commands["MAKE"] = function(cmd, text, message){
            if(cmd[2] === "SANDWICH"){
                self.client.say(self.channel, self.trc("A philly cheesesteak sandwich? http://phillycheesesteak.com/"));
            }
        };
        
        this.commands["SHOW"] = function(cmd, text, message){
            if(cmd[2] === "KITTENS"){
                var imageSize = Math.floor(Math.random() * (1000 - 200) + 200);
                self.client.say(self.channel, self.trc("http://placekitten.com/g/" + imageSize + "/" + imageSize));
            }            
        };
        
        this.commands["NIGHTDRIVE"] = function(cmd, text, message){
            self.client.say(self.channel, self.trc("==="));
            self.client.say(self.channel, self.trc("===There's something inside you...==="));
            self.client.say(self.channel, self.trc("===It's hard to explain...==="));
            self.client.say(self.channel, self.trc("===They're talking about you boy...==="));
            self.client.say(self.channel, self.trc("===But you're still the same.==="));
            self.client.say(self.channel, self.trc("=== --Kavinsky \"Nightdrive\"==="));
            self.client.say(self.channel, self.trc("==="));            
        };

    };