
// const Snoostorm = require('snoostorm');
const { InboxStream, CommentStream, SubmissionStream } = require('snoostorm');
const Snoowrap = require('snoowrap');
const Discord = require('discord.js');
const bot = new Discord.Client();
const titles = ["[CAN]", "[CAN-ON]", "[ONTARIO]", "[CANADA]", "Ontario", "Canada", "CAN-ON", "[CAN-"];

const creds = require("./creds.json");
const discordCreds = require("./discordCreds.json");

const client = new Snoowrap(creds);

var server, channel = false;
var otherChannel = false;
bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);

  const submissions = new SubmissionStream(client, { subreddit: "homelabsales", limit: 10, pollTime: 10000 });
  submissions.on("item", (data)=>{
    // console.log(data);
    if(channel != false) {
      if(data.link_flair_text == "CAN") {
        channel.send(data.title);
      }
      else
      {
        for(var title of titles)
        {
          if(data.title.toLowerCase().includes(title.toLowerCase()))
          {
            console.log(data.title);
            if(data.title.toLowerCase().includes("[FREE]".toLowerCase()))
            {
              channel.send("@everyone " + data.title);
              channel.send(data.url);
              return;
            }
            else
            {
              channel.send(data.title);
              channel.send(data.url);
              return;
            }
            break;
          }
        }
      }
      if(otherChannel != false) {
        otherChannel.send(data.title);
        otherChannel.send(data.url);
      }
    }
  });

});

bot.on('message', msg => {
    //console.log(msg);
    if(msg.content == "!join"){
      channel = msg.channel;
      console.log("Joining " + msg.channel.name + "!");
    }
    else if(msg.content == "!second") {
      otherChannel = msg.channel;
      console.log("Joining second channel: " + msg.channel.name + "!");
    }
});

bot.login(discordCreds.secret);
