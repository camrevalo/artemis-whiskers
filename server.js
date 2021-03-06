var app = require('express')();
var bodyParser  = require('body-parser');
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var port = process.env.PORT || 8080;

var token = "EAAEe2ztWUL4BAPLZAEZAeHG0rNWiasTtP4TMVg690i68rHS1s2BFb4EQ2R8VKjYImjtaRZBDHEfUxWnRMl2SKWkcbxL4w0NUwEzdd7KxTHreDxQSRuKZANrFpO4KxP4uvGNUIJl8DhYBtBWN4nlCMZC4ZBYGZA6ZBd9bXL1yyTYx2wZDZD";


app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'artemis_token_2009') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

var  math = require('mathjs');

function replyToSender(sender, text) {
  messageData = {
    text : text
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token : token },
    method: 'POST',
    json: {
       recipient: { id : sender },
       message: messageData,
    }
  }, function(error, response, body) {
       if (error) {
         console.log('Error sending message: ', error);
       } else if (response.body.error) {
         console.log('Error: ', response.body.error);
       }
     });
};


app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      replyToSender(sender, text);
      //replyToSender(sender, math.eval(text));
    }
  }
  res.sendStatus(200);
});

app.get('/', function (req, res) {
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log('The webhook is running on port ' + port);
});
