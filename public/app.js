/* global qrcodelib otplib*/
(function() {
var secret = '';
var step = 30;
var timing;

function toggleTabs(evt) {
  document.querySelectorAll('.tab-item').forEach(function(tab) {
    tab.classList.remove('is-active');
  });

  var clicked = evt.target || evt.srcElement;
  var parent = clicked.parentElement;
  parent.classList.add('is-active');

  var tabClass = parent.getAttribute('data-tab-id');
  document.querySelectorAll('.tab-item.' + tabClass).forEach(function(tab) {
    tab.classList.add('is-active');
  });
}

function createSecret() {
  secret = otplib.authenticator.generateSecret();
  startCountdown();

  var otpauth = otplib.authenticator.keyuri('demo', 'otplib', secret);

  document.querySelector('.otp-secret').innerHTML = secret;

  qrcodelib.toDataURL(otpauth, function(err, url) {
    var container = document.querySelector('.otp-qrcode .qrcode');
    if (err) {
      container.innerHTML = 'Error generating QR Code';
      return;
    }
    container.innerHTML = '<img src="' + url + '" alt="" />';
  });
}

function setToken(token) {
  document.querySelector('.otp-token').innerHTML = token;
}

function setTimeLeft(timeLeft) {
  document.querySelector('.otp-countdown').innerHTML = timeLeft + 's';
}

function generator() {
  if (!secret) {
    window.clearInterval(timing);
    return;
  }

  const epoch = Math.floor(new Date().getTime() / 1000);
  const count = epoch % 30;

  if (count === 0) {
    setToken(otplib.authenticator.generate(secret));
  }
  setTimeLeft(step - count);
}

function startCountdown() {
  window.setTimeout(() => {
    if (secret) {
      setToken(otplib.authenticator.generate(secret));
    }
    timing = window.setInterval(generator, 1000);
  }, 2000);
}

function initVerify() {
  document.querySelector('.otp-verify-send')
      .addEventListener('click', function() {
        var inputValue = document.querySelector('.otp-verify-input').value;
        // TODO: move OTP check to server
        var isValid = otplib.authenticator.check(inputValue, secret);

        var text = document.querySelector('.otp-verify-result .text');
        var icon = document.querySelector('.otp-verify-result .fa');

        if (isValid) {
          icon.classList.add('fa-check');
          icon.classList.remove('fa-times');
          text.innerHTML = 'Verified token';
          return;
        }

        icon.classList.add('fa-times');
        icon.classList.remove('fa-check');
        text.innerHTML = 'Cannot verify token.';
        post(isValid, {});
      });
}

function post(path, params) {
  method = 'post';  // Set method to post by default if not specified.

  // The rest of this code assumes you are not using a library.
  // It can be made less wordy if you use one.
  var form = document.createElement('form');
  form.setAttribute('method', method);
  form.setAttribute('action', path);

  for (var key in params) {
    console.log('Key:' + key);
    console.log('hasOwnProperty:' + params.hasOwnProperty(key));
    if (!params.hasOwnProperty(key)) {
      continue;
    }

    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);

    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  form.submit();
}

window.addEventListener('load', function() {
  document.querySelectorAll('.tabs .tab-item').forEach(function(tab) {
    tab.addEventListener('click', toggleTabs);
  });

  createSecret();
  initVerify();
});
})();