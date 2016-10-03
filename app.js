var builder = require('botbuilder');
var restify = require('restify');
var request = require('request');
var cheerio = require('cheerio');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.matches(/^njaluk link/i, [
    function (session) {
        session.beginDialog('/jpnn');
    },
    function (session, results) {
        var url = 'http://www.jpnn.com/index.php?mib=tag&keyword=mesum';
        var linkNum = results.response;
        if(linkNum==null||linkNum=='')
            {linkNum=1;}else
            {
                linkNum= parseInt(linkNum, 10);
                if(linkNum>10) {linkNum=10;}
            }
        request(url, function(err, resp, body){
            $ = cheerio.load(body);
            links = $('a[href*="read"]') //jquery get all hyperlinks
            var exlinks=[];
            for (i = 0; i < linkNum; i++) {
                exlinks.push($(links[i].text() + ':\n  ' + $(links[i])).attr('href'));
            }
            session.send(exlinks.toString());
        });
     }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
 //           session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
   //     session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/jpnn', [
    function (session) {
        builder.Prompts.text(session, 'piro lik?');
    },
    function (session, results) {
        session.userData.url = results.response;
        session.endDialog();
    }
]);

function parseJpnn(situs){
    var url = 'http://www.jpnn.com/index.php?mib=tag&keyword=mesum';
    request(url, function(err, resp, body){
    $ = cheerio.load(body);
    links = $('a[href*="read"]') //jquery get all hyperlinks
    var exlinks=[];
    $(links).each(function(i, link){
       exlinks.push($(link).text() + ':\n  ' + $(link).attr('href'));
    });
    console.log(exlinks[0]);
    return exlinks;
});
}