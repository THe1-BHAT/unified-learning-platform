(() => {
  "use strict";

  const api = "/api/learner-overview";
  let latest = null;
  let requestPending = false;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);

  const formatCount = (value) => Number(value || 0).toLocaleString("en-IN");
  const formatWatchTime = (seconds) => {
    const total = Math.max(0, Number(seconds) || 0);
    if (total < 3600) return `${Math.floor(total / 60)}m`;
    const hours = total / 3600;
    return `${hours.toFixed(hours < 10 ? 1 : 0)}h`;
  };

  function overviewMarkup(data) {
    const entries = Array.isArray(data.leaderboard) ? data.leaderboard : [];
    const leaderboard = entries.length
      ? `<ol class="learner-leaderboard-list">${entries.map((entry) => `
          <li class="${entry.user_id === data.user_id ? "is-you" : ""}">
            <span class="learner-rank">${escapeHtml(entry.rank)}</span>
            <span class="learner-leader-name">${escapeHtml(entry.display_name)}</span>
            <strong>${formatCount(entry.coins)} <small>coins</small></strong>
          </li>`).join("")}</ol>`
      : `<div class="learner-leaderboard-empty"><span class="leaderboard-empty-mark">✦</span><p>Be the first to join the learning leaderboard.</p></div>`;

    return `
      <section class="learner-overview" id="learner-overview" aria-label="Your learning overview">
        <div class="learner-overview-main">
          <div class="learner-overview-heading">
            <div><div class="eyebrow">YOUR LEARNING SNAPSHOT</div><h2>Your momentum</h2></div>
            <span class="learner-live-badge"><i></i> SYNCED TO YOUR ACCOUNT</span>
          </div>
          <div class="learner-metric-grid">
            <article class="learner-metric learner-metric-coins">
              <span class="learner-metric-icon" aria-hidden="true">✦</span>
              <div><strong>${formatCount(data.balance)}</strong><span>Total coins</span></div>
              <small>+50 joining bonus included</small>
            </article>
            <article class="learner-metric learner-metric-watch">
              <span class="learner-metric-icon" aria-hidden="true">▷</span>
              <div><strong>${formatWatchTime(data.watch_seconds)}</strong><span>Video study time</span></div>
              <small>Foreground watch-time estimate</small>
            </article>
            <article class="learner-metric learner-metric-tests">
              <span class="learner-metric-icon" aria-hidden="true">✓</span>
              <div><strong>${formatCount(data.tests_taken)}</strong><span>Checks attempted</span></div>
              <small>Unique knowledge checks</small>
            </article>
          </div>
        </div>
        <aside class="learner-leaderboard" aria-labelledby="learner-leaderboard-title">
          <div class="learner-leaderboard-head">
            <div><div class="eyebrow">LEARN TOGETHER</div><h3 id="learner-leaderboard-title">Coin leaderboard</h3></div>
            <span class="learner-trophy" aria-hidden="true">♛</span>
          </div>
          ${leaderboard}
          <button type="button" class="learner-leaderboard-toggle" data-leaderboard-optin="${data.show_on_leaderboard ? "false" : "true"}">
            ${data.show_on_leaderboard ? "Leave leaderboard" : "Join the leaderboard"}<span aria-hidden="true">→</span>
          </button>
          <p class="learner-leaderboard-privacy">Your name appears only while you choose to participate.</p>
        </aside>
      </section>`;
  }

  function renderOverview() {
    const hero = document.querySelector(".unified-hero");
    if (!hero) return;
    document.querySelector("#learner-overview")?.remove();
    if (latest) hero.insertAdjacentHTML("afterend", overviewMarkup(latest));
  }

  async function postActivity(payload) {
    try {
      const response = await fetch(api, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return;
      const result = await response.json();
      if (latest && typeof result.watch_seconds === "number") {
        latest.watch_seconds = result.watch_seconds;
        latest.tests_taken = result.tests_taken;
        renderOverview();
      }
    } catch {
      // A temporary network issue should not interrupt the learning activity.
    }
  }

  async function loadOverview() {
    if (requestPending) return;
    requestPending = true;
    try {
      const response = await fetch(api, { credentials: "same-origin", cache: "no-store" });
      if (!response.ok) return;
      latest = await response.json();
      renderOverview();
      if (!latest.welcome_seen) showWelcome();
    } catch {
      // The rest of the learning studio remains usable if overview data is unavailable.
    } finally {
      requestPending = false;
    }
  }

  function showWelcome() {
    if (document.querySelector("#welcome-bonus")) return;
    const firstName = String(latest?.name || "Learner").trim().split(/\s+/)[0];
    const dialog = document.createElement("dialog");
    dialog.id = "welcome-bonus";
    dialog.className = "welcome-bonus-dialog";
    dialog.setAttribute("aria-labelledby", "welcome-bonus-title");
    dialog.innerHTML = `
      <div class="welcome-bonus-card">
        <button class="welcome-bonus-close" type="button" aria-label="Close welcome message">×</button>
        <div class="welcome-logo-wrap"><img src="/studio/assets/nxgenvarsity-logo.png" alt="NxGenVarsity" /></div>
        <span class="welcome-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2 id="welcome-bonus-title">Welcome, ${escapeHtml(firstName)}!</h2>
        <p>Your learning journey begins with a little extra momentum.</p>
        <div class="welcome-reward"><span aria-hidden="true">✦</span><strong>+50</strong><span>joining coins</span></div>
        <p class="welcome-note">Your joining bonus is already in your wallet. Earn more as you learn and complete checks.</p>
        <button class="welcome-bonus-continue" type="button">Start learning <span aria-hidden="true">→</span></button>
      </div>`;
    document.body.append(dialog);
    const close = () => { if (dialog.open) dialog.close(); };
    dialog.querySelector(".welcome-bonus-close").addEventListener("click", close);
    dialog.querySelector(".welcome-bonus-continue").addEventListener("click", close);
    dialog.addEventListener("close", () => {
      if (latest) latest.welcome_seen = true;
      void postActivity({ mark_welcome_seen: true });
    }, { once: true });
    dialog.showModal();
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const answer = target?.closest("[data-answer], [data-bank-answer]");
    if (answer) {
      const activityKey = answer.hasAttribute("data-bank-answer")
        ? `quiz:${answer.dataset.bankModule}:${answer.dataset.bankIndex}`
        : `check:${answer.dataset.module}:${answer.dataset.lesson}`;
      void postActivity({ activity_key: activityKey });
      return;
    }

    const toggle = target?.closest("[data-leaderboard-optin]");
    if (toggle) {
      toggle.disabled = true;
      void postActivity({ show_on_leaderboard: toggle.dataset.leaderboardOptin === "true" })
        .then(() => loadOverview());
    }
  }, true);

  let watchTick = Date.now();
  window.setInterval(() => {
    const now = Date.now();
    const isWatching = document.visibilityState === "visible"
      && Boolean(document.querySelector("#modal[open] .video-frame"));
    const seconds = isWatching ? Math.min(30, Math.floor((now - watchTick) / 1000)) : 0;
    watchTick = now;
    if (seconds > 0) void postActivity({ watch_seconds: seconds });
  }, 10000);

  window.addEventListener("hashchange", () => window.setTimeout(() => {
    renderOverview();
    if (!latest) void loadOverview();
  }, 0));

  void loadOverview();
})();
