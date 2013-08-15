var mwcCore = require('mwc_kernel'),
  express = require('express'),
  path = require('path');

//setting up the config
var MWC = mwcCore({
  'hostUrl':'http://vvv.msk0.ru/',//'http://mwcwelcome.herokuapp.com/',
  'secret': ((process.env.secret)?(process.env.secret):'lAAAAalalala1'),
  'mongoUrl':'mongodb://localhost/mwc_dev',
  'emailConfig':((process.env.emailConfig)?(process.env.emailConfig):'myemail@gmail.com:1234567'),
  "passport":{
    "GITHUB_CLIENT_ID":"2673b55b727c2ebb0c93",
    "GITHUB_CLIENT_SECRET": "74aedc65c9f3aff8250abe9087c30d368566810e",
    "TWITTER_CONSUMER_KEY":"--insert-twitter-consumer-key-here--",
    "TWITTER_CONSUMER_SECRET": "--insert-twitter-consumer-secret-here--",
    "FACEBOOK_APP_ID":"--insert-facebook-app-id-here--",
    "FACEBOOK_APP_SECRET":"--insert-facebook-app-secret-here--"
  }
});

MWC.extendApp(function(core){
  core.app.locals.delimiters = '[[ ]]';
});
MWC.usePlugin(require('mwc_plugin_notify_by_email'));
MWC.usePlugin(require('mwc_plugin_hogan_express'));
MWC.usePlugin(require('mwc_plugin_my_profile'));


MWC.extendMiddleware(function(core){
  return express.static(path.join(__dirname, 'public'));
});

MWC.usePlugin(require('./../index.js'));
MWC.extendRoutes(function (core) {
  core.app.get('/', function (request, response) {
    response.render('index',{userAgent:request.headers['user-agent'], title: 'Welcome!'})
  });

  core.app.get('/team', function (request, response) {
    request.model.Users.find({}, function (err, users) {
      if (err) {
        throw err;
      }
      if (request.query['json']) {
        response.json(users);
      } else {
        response.render('team', {users: users});
      }
    });
  });
});
MWC.start();

MWC.on('notify:email',console.log);