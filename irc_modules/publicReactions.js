
    exports.ircModule = PublicReactions;
    
    var S = require("string");

    function PublicReactions(id, client, admin, channel, config, textRenderCallback){
        
        var self = this;
        
        this.id = id;
        this.name = "PublicReactions";

        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.trc = textRenderCallback;
        this.reactions = {};
        
        this.start = function(){

            self.client.addListener("message" + self.channel, function(nick, text, message){
                self.parseMessage(nick, text, message);
            });

        };
        
        this.parseMessage = function(nick, text, message){

            if(text !== null){

                    text = text.toUpperCase();
                    
                    for(var key in self.reactions){

                        if(S(text).contains(key)){
                            
                            if(self.reactions && self.reactions[key]){
                                self.reactions[key](text);
                            }

                        }				
                    }

            }            
        };

        this.reactions["I'M HUNGRY"] = function(text){
            self.client.say(
                self.channel, 
                self.trc("Hello Hungry, I'm EasyBot.  Nice to meet you!"));
        };

    };