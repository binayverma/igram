var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({origin: true});
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var serviceAccount = require("./igram-d265e-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://igram-d265e.firebaseio.com/'
});

exports.storePostData = functions.https.onRequest(function(request, response) {
  cors(request, response, function() {
    admin.database().ref('posts').push({
      id: request.body.id,
      title: request.body.title,
      location: request.body.location,
      image: request.body.image
    })
      .then(function() {
        webpush.setVapidDetails('mailto:vnayverma@gmail.com',
        'BMR42y5FYba4RtFXlhsIBRzxyUC2aHtWMboazXEsmOtNU-wOH99436TJQzt3fVmMQaMqlBedgFgRhLIa-Lw53HU',
        'LHi4fjdtc2FqjARpz5jQVWYzgT4XXzAN-SkAmWJN6_s');
        return admin.database().ref('subscriptions').once('value');
      })
      .then(function (subscriptions) {
        subscriptions.forEach(function (sub) {
          var pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          };
          webpush.sendNotification(pushConfig, JSON.stringify({
            titile: 'New Post',
            content: 'New Post added!',
            openUrl: '/help'
          }))
            .catch(function(err) {
              console.log(err);
            })
        });
        response.status(201).json({message: 'Data Stored', id: request.body.id});
      })
      .catch(function(err) {
        response.status(500).json({error: err});
      });
  });
 });
