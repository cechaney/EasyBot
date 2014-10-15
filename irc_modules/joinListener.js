
    exports.ircModule = JoinListener;

    var S = require("string");
    var irc = require("irc");

    function JoinListener(bot, client, admin, channel, config){
        
        var self = this;
        
        this.name = "JoinListener";

        this.bot = bot;
        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.joins = {};
        
        this.team = {
            member1: "member1",
            member2: "member2"
	};
        
        this.start = function(){

            self.client.addListener("join", function(channel, nick){
                self.handleJoin(channel, nick);
            });

        };

        this.handleJoin = function(channel, nick){
    
        	if(nick !== self.client.nick){

                if(self.joins && self.joins[nick]){
                    self.joins[nick](nick);
                }
                else{
                    self.joins["default"](nick);
                }

        	}

        }; 
        
        this.joins[self.client.nick] = function(nick){
            self.client.say(channel, self.trc("Ready to serve!"));
        };         
        
        this.joins[self.team.member1] = function(nick){
            self.client.say(channel, self.trc("Hello " + self.team.member1 + "!"));
        };
        
        this.joins[self.team.member1] = function(nick){
            self.client.say(channel, self.trc("Hello " + self.team.member2 + "!"));
        };
        
        this.joins["default"] = function(nick){
            self.client.say(channel, self.trc("Welcome back " + nick + "!"));	
        };        
        
    };