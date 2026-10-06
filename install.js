/* LingoPop landing: platform detection + install flow. The game itself is NOT reachable from here. */
(function () {
  'use strict';
  var ua = navigator.userAgent || '';
  var $ = function (id) { return document.getElementById(id); };
  var show = function (id, on) { var el = $(id); if (el) el.hidden = !on; };

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  if (isStandalone()) { location.replace('game.html?source=pwa'); return; }

  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  // In-app browsers cannot install a PWA. iOS web views omit the "Safari" token.
  var isInApp = /FBAN|FBAV|Instagram|Line\/|MicroMessenger|TikTok|Snapchat|Twitter|; wv\)/i.test(ua) ||
                (isIOS && !/Safari/i.test(ua));
  var isMobile = isIOS || isAndroid;
  var deferred = null;

  var cta = $('cta');
  function setCta(label) { if (cta) { cta.textContent = label; cta.hidden = false; } }

  function render() {
    show('state-inapp', false); show('state-desktop', false); show('guide-ios', false); show('guide-android', false);
    if (cta) cta.hidden = true;
    if (!isMobile) {
      show('state-desktop', true);
      var u = $('desktop-url'); if (u) u.textContent = location.origin + location.pathname;
    } else if (isInApp) {
      show('state-inapp', true);
      var b = $('inapp-browser'); if (b) b.textContent = isIOS ? 'Safari' : 'Chrome';
    } else if (isIOS) {
      setCta('הוספה למסך הבית');
    } else {
      setCta('התקנת האפליקציה');
    }
  }

  if (cta) cta.addEventListener('click', function () {
    if (isIOS) { show('guide-ios', true); $('guide-ios').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (deferred) {
      deferred.prompt();
      deferred.userChoice.finally(function () { deferred = null; });
    } else {
      show('guide-android', true); $('guide-android').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; });
  window.addEventListener('appinstalled', function () {
    deferred = null;
    if (cta) cta.hidden = true;
    show('guide-android', false); show('state-installed', true);
  });

  var copy = $('copy-link');
  if (copy) copy.addEventListener('click', function () {
    var url = location.origin + location.pathname;
    var done = function () { show('copy-done', true); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else done();
  });

  render();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
