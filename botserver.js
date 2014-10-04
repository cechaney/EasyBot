
var eb = require("./easybot.js");

var easybot = new eb.EasyBot("admin", "#chan1", ["#chan1"], "irc.server.net", "easybot");

easybot.boot();