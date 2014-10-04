
    exports.ircModule = JoinListener;

    function JoinListener(id, client, admin, channel, config, textRenderCallback){
        
        var self = this;
        
        this.id = id;
        this.name = "JoinListener";

        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.trc = textRenderCallback;
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