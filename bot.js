require('dotenv').load();

var Botkit = require('botkit');

var controller = Botkit.slackbot();

var bot = controller.spawn({
    token: process.env.slack_token
});
console.log("env");
console.log(process.env.slack_token);
bot.startRTM(function(err,  bot, payload){
    if(err){
        throw new Error('Could now connect to Slack');
    }
});

setTimeout(bot.destroy.bind(bot),  10000);

controller.setupWebserver(process.env.port, function(err, webserver){
    controller.createWebhookEndpoints(controller.webserver);
});

controller.on('slash_command', function(bot, message){
    bot.replyPublic(message, "Everyone can see the results of this slash command");
});

controller.hears('interactive', 'direct_message', function(bot, message){
    bot.startConversation(message, function(err, convo) {
        
            convo.ask({
                attachments:[
                    {
                        title: 'Do you want to proceed?',
                        callback_id: '123',
                        attachment_type: 'default',
                        actions: [
                            {
                                "name":"yes",
                                "text": "Yes",
                                "value": "yes",
                                "type": "button",
                            },
                            {
                                "name":"no",
                                "text": "No",
                                "value": "no",
                                "type": "button",
                            }
                        ]
                    }
                ]
            },[
                {
                    pattern: "yes",
                    callback: function(reply, convo) {
                        convo.say('FABULOUS!');
                        convo.next();
                        // do something awesome here.
                    }
                },
                {
                    pattern: "no",
                    callback: function(reply, convo) {
                        convo.say('Too bad');
                        convo.next();
                    }
                },
                {
                    default: true,
                    callback: function(reply, convo) {
                        // do nothing
                    }
                }
            ]);
        });
});
