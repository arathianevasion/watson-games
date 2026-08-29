/*
 * Watson Games portal SDK. Include in a game's index.html:
 *   <script src="/sdk/portal-sdk.js"></script>
 * Then:
 *   WatsonGames.onInit(function (info) { ... });   // info.user, info.leaderboard
 *   WatsonGames.reportScore(1234, { final: true }); // final => submitted to leaderboard
 * Mirrors src/lib/sdk-protocol.ts — keep in sync.
 */
(function () {
  var NS = "watson-games";
  var V = 1;
  var origin = window.location.origin;
  var embedded = window.parent && window.parent !== window;
  var initInfo = null;
  var initCbs = [];
  var ackCbs = [];

  function send(msg) {
    if (!embedded) return;
    msg.ns = NS;
    msg.v = V;
    window.parent.postMessage(msg, origin);
  }

  window.addEventListener("message", function (ev) {
    if (ev.origin !== origin || ev.source !== window.parent) return;
    var d = ev.data;
    if (!d || d.ns !== NS || d.v !== V) return;
    if (d.type === "init") {
      initInfo = d;
      initCbs.forEach(function (cb) { cb(d); });
    } else if (d.type === "score:ack") {
      ackCbs.forEach(function (cb) { cb(d); });
    } else if (d.type === "fullscreen") {
      window.dispatchEvent(new CustomEvent("wg:fullscreen", { detail: d.active }));
    }
  });

  window.WatsonGames = {
    embedded: embedded,
    ready: function () { send({ type: "ready" }); },
    reportScore: function (score, opts) {
      send({ type: "score", score: Number(score), final: !!(opts && opts.final) });
    },
    onInit: function (cb) { initCbs.push(cb); if (initInfo) cb(initInfo); },
    onScoreAck: function (cb) { ackCbs.push(cb); },
    error: function (message) { send({ type: "error", message: String(message) }); },
  };

  if (document.readyState === "complete") window.WatsonGames.ready();
  else window.addEventListener("load", function () { window.WatsonGames.ready(); });
})();
