
    exports.ircModule = PublicReactions;
    
    var S = require("string");
    var irc = require("irc");

    function PublicReactions(bot, client, admin, channel, config){
        
        var self = this;
        
        this.name = "PublicReactions";

        this.bot = bot;
        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.reactions = {};
        
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
        
        this.parseMessage = function(from, to, message){

            if(message !== null){

                    message = message.toUpperCase();
                    
                    for(var key in self.reactions){

                        if(S(message).contains(key)){
                            
                            if(self.reactions && self.reactions[key]){
                                self.reactions[key](message);
                            }

                        }				
                    }

            }            
        };

        this.reactions["I'M HUNGRY"] = function(message){
            self.client.say(
                self.channel, 
                self.trc("Hello Hungry, I'm EasyBot.  Nice to meet you!"));
        };

    };