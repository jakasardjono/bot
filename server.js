var restify = require('restify');
var builder = require('botbuilder');
var fs =require('fs');

//=========================================================
// Bot Setup
//=========================================================
 var https_options = {
        key: fs.readFileSync('./ca.key2'), //on current folder
        certificate: fs.readFileSync('./ca.cer')
    };

    
    var https_server = restify.createServer(https_options);

// Setup Restify Server
//var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
// });
https_server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', https_server.name, https_server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
https_server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send("Hello World");
});