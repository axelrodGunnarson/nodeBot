var chall= require("./challenges.js")
// Get the lib
var irc = require("irc");
var fs = require("fs");

Object.prototype.isEmpty = function() {
    for(var key in this) {
        if(this.hasOwnProperty(key))
            return false;
    }
    return true;
}

var config = JSON.parse(fs.readFileSync("config.json"));
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  return out;
}

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels
});

var tasks={};

var cleanTasks = function(to, ob) {
    delete tasks[to][ob.def];
    if (isEmpty(tasks[to]))
        delete tasks[to];   
}
var endTimeout = function(to, ob) {
    bot.say(to,"Ouch! challenge not solved!");
    cleanTasks(to, ob);
}

// Listen for any message
//nick=nickname, to=channel; text=content
bot.addListener("message", function(nick, to, text, message) {
//	console.log("received message: "+message.args.slice(1));
//	console.log("received message: "+printObject(message));
//	console.log ("nick: "+nick);
//	console.log ("to: "+to);
//	console.log ("text: "+text);
    var arrText = text.split(" ");
//    console.log("received message: "+text+ " "+ arrText.length);
	if (arrText[0]=="@challenge") {
        if (arrText.length==1) {
            bot.say (to, "give me the name of a challenge!");
            return;
        }
        console.log("received challenge " + arrText[1]);
        if (!(arrText[1] in chall.challenges)) {
            bot.say (to, "not a challenge, you dumbass");
            return;
        }
//		console.log( "Challenge "+arrText[1]+":\n"+ob.chall);
        var ch_container = chall.challenges[arrText[1]];
        if (! tasks.hasOwnProperty(to)) {
            tasks[to]={}
        }
        if (tasks[to].hasOwnProperty(ch_container.def)) {
            bot.say(to, "Challenge already Launched\n"+ tasks[to][ch_container.def].ch.chall);
            return;
        }
        else {
            var ob = ch_container.chall();
		    bot.say(to, "Challenge "+arrText[1]+"\n"+ch_container.rules+"\n"+ob.chall);
            var timeoutID = setTimeout(endTimeout, ch_container.delay,to,ob);
            tasks[to][ch_container.def]={"timeout":timeoutID, "ch":ob, "base": ch_container};
            return;
        }
	}
    else if (arrText[0]==="@sol") {
        
        if (arrText.length!=3) {
            bot.say(to,"What you asked doesn't make sense");
            return;
        }
        if (tasks.hasOwnProperty(to)) {
            if (tasks[to].hasOwnProperty(arrText[1])) {
                var ch_try = tasks[to][arrText[1]];
                var ch_container = ch_try.base;
                if (arrText.length != 2+ch_container.num_sol) {
                    bot.say(to, "What you say does not make sense");
                    return;
                }
                var test = arrText.splice(2);
                var res = ch_try["ch"].res;
                if (ch_container.solver(test, res)) {
                    bot.say(to, "Good job "+ nick + " you win!");
                    clearTimeout(ch_try.timeout);
                    cleanTasks(to, ch_container);
                    //reward.give_reward();
                    return;
                }
                else {
                    bot.say("Stop embarassing yourself "+ nick);
                    return;
                }
            }
            else {
                bot.say(to, "Challenge not active");
                return;
            }   
        }
        else {
            bot.say(to, "Challenge not active");
            return;
        }
    }
    else if (arrText[0] == "@help") {
        var st = "I am the awesomeBot\nI accept the following commands:";
        st += "\nChallenges";
        for (c in chall.challenges) {
            st +="\n\t- "+ c +": "+chall.challenges[c]["description"];
        }
        st+="\nsay @sol <def> <solution> to give me a solution to a challenge";
        st+="\nsay @help for display this message";
        bot.say(to, st);
    }
//add an else if for doing something else    

});
