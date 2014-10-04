
    exports.ircModule = AdminCommands;
    
    var S = require("string");

    function AdminCommands(id, client, admin, channel, config, textRenderCallback){
        
        var self = this;
        
        this.id = id;
        this.name = "AdminCommands";
        
        this.client = client;
        this.admin = admin;
        this.channel = channel;
        this.config = config;
        this.trc = textRenderCallback;
        this.commands = {};
        
        this.start = function(){
            
            self.client.addListener("message", function(nick, to, text, message){
                self.parseMessage(nick, to, text, message);
            });            

        };         
        
        this.parseMessage = function(nick, to, text, message){

            if(nick === self.admin && to === self.client.nick){

                var cmdline = text.toUpperCase().split(" ");
                var cmd = cmdline[0];
                
                if(self.commands && self.commands[cmd]){
                    self.commands[cmd](cmd, text);
                }

            }

        };       

        this.commands["SAY"] = function(cmd, message){
            self.client.say(
                    self.channel, 
                    self.trc(S(message).right(message.length - 4).s));
        };

        this.commands["LEAVE"] = function(cmd, message){
            self.client.part(self.channel);
        };

        this.commands["JOIN"] = function(cmd, message){
            self.client.join(self.channel);
        };

        this.commands["QUIT"] = function(cmd, message){
            process.exit(0);
        };

    };