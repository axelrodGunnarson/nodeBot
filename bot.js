// Create the configuration
var config = JSON.parse(fs.readFileSync("config.json"));

// Get the lib
var irc = require("irc");

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  return out;
}

var binary = function() {
    var 
    var num1=Math.floor(Math.random()*4294967295);
    var num2=Math.floor(Math.random()*4294967295);
    
}

var challenges = {
    "binary": binary,
    "hex": hex,
}

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});



// Listen for any message
//nick=nickname, to=channel; text=content
bot.addListener("message", function(nick, to, text, message) {
//	console.log("received message: "+message.args.slice(1));
//	console.log("received message: "+printObject(message));
//	console.log ("nick: "+nick);
//	console.log ("to: "+to);
//	console.log ("text: "+text);
	if (text=="@challenge") {
		bot.say(config.channels, "You said: "+text);
	
	}
});

