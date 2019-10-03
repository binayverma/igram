
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function() {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmationNotification() {
  var options = {
    body: 'You successfully subscribed to our Notification service!',
    icon: '/src/images/icons/app-icon-96x96.png',
    image: '/src/images/sf-boat.jpg',
    dir: 'ltr',
    lang: 'en-US', // BCP 47
    vibrate: [100, 50, 200],
    badge: '/src/images/icons/app-icon-96x96.png',
    tag: 'confirm-notification',
    renotify: true,
    actions: [
      {action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png'},
      {action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png'},
    ]
  };
  if('serviceWorker' in navigator) {
    // using serviceWorker
    navigator.serviceWorker.ready
      .then(swreg => {
        swreg.showNotification('Successfully subscribed!(sw)', options)
      })
  }else {
    // using Notification API
    new Notification('Successfully subscribed!', options)
  }
}

function configurePushSub() {
  if(!('serviceWorker' in navigator)) {
    return;
  }
  var reg;
  navigator.serviceWorker.ready
    .then(swreg => {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(sub => {
      if(sub === null) {
        // create new subscription
        let vapidPublicKey = 'BEJcyIjtD_s-b4YO8IidkCH9LebQJ8QnqVblBlsx656EQZjLBpOuysZfoyO_qsyf_ucSraN9kiEZ0tLYvikE-N8';
        let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      }else {
        // already have subscription
      }
    })
    .then(newSub => {
      return fetch('https://igram-d265e.firebaseio.com/subscription.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(res => {
      if(res.ok) {
        displayConfirmationNotification
      }
    })
    .catch(err => {
      console.log(err)
    })
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result)
    if(result !== 'granted') {
      console.log('No Notification permission granted!');
    }else {
      configurePushSub();
      // displayConfirmationNotification();
    }
  });
}

if('Notification' in window && 'serviceWorker' in navigator) {
  for(var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}