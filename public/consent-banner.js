/*
 * Bandeau de consentement cookies (RGPD) pour marchepublic.be.
 * Couplé au Consent Mode v2 de GA4 : le consentement par défaut est "denied"
 * (défini dans le <head> de chaque page). Ce script n'affiche le bandeau que
 * tant que le visiteur n'a pas choisi, et met à jour le consentement.
 * Vanilla JS, partagé entre l'app (index.html) et les pages SEO statiques.
 * Réouverture possible depuis la page /cookies : window.mpOpenCookieSettings()
 */
(function () {
  var KEY = 'mp_cookie_consent';
  var ID = 'mp-cookie-banner';

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function decide(granted) {
    try { localStorage.setItem(KEY, granted ? 'granted' : 'denied'); } catch (e) { /* stockage indisponible */ }
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    }
    var el = document.getElementById(ID);
    if (el) el.remove();
  }

  function show() {
    if (document.getElementById(ID)) return;
    var box = document.createElement('div');
    box.id = ID;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', 'Consentement aux cookies');
    box.style.cssText = [
      'position:fixed', 'z-index:2147483000', 'left:16px', 'right:16px', 'bottom:16px',
      'max-width:380px', 'margin-left:auto', 'background:#2E2348', 'color:#fff',
      'border-radius:16px', 'padding:18px 18px 16px', 'box-shadow:0 12px 32px rgba(0,0,0,.28)',
      'font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'
    ].join(';');
    box.innerHTML =
      '<p style="margin:0 0 6px;font-weight:700;font-size:15px">Votre vie privée</p>' +
      '<p style="margin:0 0 14px;color:rgba(255,255,255,.75);font-size:13px">' +
      'Nous utilisons une mesure d’audience (Google Analytics) pour améliorer le site. ' +
      'Rien n’est déposé sans votre accord. ' +
      '<a href="/cookies" style="color:#fff;text-decoration:underline">En savoir plus</a></p>' +
      '<div style="display:flex;gap:8px">' +
      '<button type="button" data-c="1" style="flex:1;cursor:pointer;border:0;border-radius:10px;padding:10px 12px;background:#E63948;color:#fff;font-weight:700;font-size:14px">Accepter</button>' +
      '<button type="button" data-c="0" style="flex:1;cursor:pointer;border:1px solid rgba(255,255,255,.35);border-radius:10px;padding:10px 12px;background:transparent;color:#fff;font-weight:600;font-size:14px">Refuser</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.hasAttribute('data-c')) decide(t.getAttribute('data-c') === '1');
    });
    document.body.appendChild(box);
  }

  window.mpOpenCookieSettings = show;

  var c = getChoice();
  if (c !== 'granted' && c !== 'denied') {
    if (document.body) show();
    else document.addEventListener('DOMContentLoaded', show);
  }
})();
