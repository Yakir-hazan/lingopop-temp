/* LingoPop – app shell: router + storage + screen wiring.
   Structure: index.html holds all screens as <section data-screen="...">.
   This file: (1) LP core, (2) original screen micro-interactions, (3) navigation hooks, (4) boot. */
(function () {
  'use strict';

  // ---------- 1. Core ----------
  var SCREENS = ['welcome', 'age', 'home', 'lesson', 'practice', 'sentence', 'progress', 'parent'];
  var NAV_SCREENS = ['home', 'progress', 'parent'];
  var NAV_ROUTE = { 'home': 'home', 'learn-topics': 'lesson', 'progress': 'progress', 'parent-zone': 'parent' };
  var NAV_ACTIVE = ['text-primary', 'bg-primary-fixed/40', 'font-bold'];
  var NAV_ACTIVE_ICON = { home: 'home', progress: 'progress', parent: 'parent-zone' };

  // localStorage can throw (private mode / storage full) – never let it break the app
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('lp.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem('lp.' + k, JSON.stringify(v)); return true; } catch (e) { return false; }
    }
  };

  function defaultScreen() { return store.get('age', null) ? 'home' : 'welcome'; }
  function currentFromHash() {
    var h = location.hash.replace(/^#\/?/, '');
    return SCREENS.indexOf(h) > -1 ? h : null;
  }

  function show(name) {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
    SCREENS.forEach(function (s) {
      var el = document.getElementById('screen-' + s);
      var on = s === name;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    var nav = document.getElementById('app-nav');
    var showNav = NAV_SCREENS.indexOf(name) > -1;
    nav.classList.toggle('is-visible', showNav);
    if (showNav) {
      nav.querySelectorAll('a[data-path]').forEach(function (a) {
        var active = a.getAttribute('data-path') === NAV_ACTIVE_ICON[name];
        NAV_ACTIVE.forEach(function (c) { a.classList.toggle(c, active); });
        a.classList.toggle('text-on-surface-variant', !active);
        var icon = a.querySelector('.material-symbols-outlined');
        if (icon) icon.style.fontVariationSettings = active ? "'FILL' 1" : "'FILL' 0";
      });
    }
    window.scrollTo(0, 0);
    store.set('last', name);
  }

  function go(name, opts) {
    var url = location.pathname + location.search + '#/' + name;
    if (opts && opts.replace) location.replace(url); else location.hash = '#/' + name;
  }
  function back() {
    if (history.length > 1) history.back(); else go('home', { replace: true });
  }

  window.LP = { go: go, back: back, store: store, show: show };

  // ---------- 2. Original screen scripts (from the Stitch export) ----------
  // ---- screen: welcome ----
  (function(){
  (function() {
      const btn = document.getElementById('startBtn');
      if (btn) {
        btn.addEventListener('click', function() {
          btn.classList.add('scale-95');
          setTimeout(() => btn.classList.remove('scale-95'), 120);
        });
      }
  
      const badge = document.getElementById('logoBadge');
      if (badge) {
        badge.addEventListener('click', function() {
          badge.classList.add('rotate-6');
          setTimeout(() => badge.classList.remove('rotate-6'), 200);
        });
      }
    })();
  })();
  // ---- screen: age ----
  (function(){
  let selectedAge = '5-6';
  
    function selectAgeCard(cardId, age) {
      selectedAge = age;
      const isFiveSix = age === '5-6';
  
      const card56 = document.getElementById('card-age-5-6');
      const card78 = document.getElementById('card-age-7-8');
      const bg56 = document.getElementById('bg-active-5-6');
      const bg78 = document.getElementById('bg-active-7-8');
      const check56 = document.getElementById('check-5-6');
      const check78 = document.getElementById('check-7-8');
      const lip56 = document.getElementById('lip-5-6');
      const lip78 = document.getElementById('lip-7-8');
      const tag78 = document.getElementById('badge-tag-7-8');
  
      if (isFiveSix) {
        // 5-6 Active
        card56.setAttribute('aria-checked', 'true');
        card56.classList.remove('opacity-90');
        bg56.classList.remove('bg-primary/0');
        bg56.classList.add('bg-primary/5');
        check56.className = 'w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm transition-transform duration-200 scale-100';
        lip56.className = 'absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-b-lg';
  
        // 7-8 Inactive
        card78.setAttribute('aria-checked', 'false');
        card78.classList.add('opacity-90');
        bg78.classList.remove('bg-primary/5');
        bg78.classList.add('bg-primary/0');
        check78.className = 'w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline-variant shadow-none transition-transform duration-200 scale-90';
        lip78.className = 'absolute bottom-0 left-0 right-0 h-1.5 bg-outline-variant/30 rounded-b-lg';
        tag78.className = 'inline-flex items-center gap-1 bg-surface-container-high/60 px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm font-bold';
      } else {
        // 7-8 Active
        card78.setAttribute('aria-checked', 'true');
        card78.classList.remove('opacity-90');
        bg78.classList.remove('bg-primary/0');
        bg78.classList.add('bg-primary/5');
        check78.className = 'w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm transition-transform duration-200 scale-100';
        lip78.className = 'absolute bottom-0 left-0 right-0 h-1.5 bg-primary rounded-b-lg';
        tag78.className = 'inline-flex items-center gap-1 bg-surface-container px-3 py-1 rounded-full text-primary font-label-sm text-label-sm font-bold';
  
        // 5-6 Inactive
        card56.setAttribute('aria-checked', 'false');
        card56.classList.add('opacity-90');
        bg56.classList.remove('bg-primary/5');
        bg56.classList.add('bg-primary/0');
        check56.className = 'w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline-variant shadow-none transition-transform duration-200 scale-90';
        lip56.className = 'absolute bottom-0 left-0 right-0 h-1.5 bg-outline-variant/30 rounded-b-lg';
      }
  
      // Play subtle haptic feedback vibration if supported
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(30);
      }
    }
  
    function handleContinue() {
      const btn = document.getElementById('submit-age-btn');
      btn.classList.add('scale-95');
      setTimeout(() => {
        btn.classList.remove('scale-95');
        // Navigation dispatch event for child learning flow
        console.log('Selected age group:', selectedAge);
      }, 150);
    }
  Object.assign(window,{handleContinue,selectAgeCard});
  })();
  // ---- screen: home ----
  (function(){
  (function() {
      const startBtn = document.getElementById('start-lesson-btn');
      const sparkleContainer = document.getElementById('sparkle-layer');
  
      if (startBtn && sparkleContainer) {
        startBtn.addEventListener('click', function(e) {
          const emojis = ['⭐', '✨', '🎉', '🦁', '🌟', '💖'];
          const rect = startBtn.getBoundingClientRect();
          
          for (let i = 0; i < 14; i++) {
            const item = document.createElement('div');
            item.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            item.className = 'absolute text-2xl transition-all duration-700 ease-out select-none';
            
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;
            
            item.style.left = startX + 'px';
            item.style.top = startY + 'px';
            sparkleContainer.appendChild(item);
  
            const destX = (Math.random() - 0.5) * 240;
            const destY = -Math.random() * 180 - 30;
  
            requestAnimationFrame(() => {
              item.style.transform = `translate(${destX}px, ${destY}px) scale(${1 + Math.random() * 0.8})`;
              item.style.opacity = '0';
            });
  
            setTimeout(() => {
              item.remove();
            }, 750);
          }
        });
      }
    })();
  })();
  // ---- screen: lesson ----
  (function(){
  // Simple micro-interactions for child feedback delight
    const soundBtn = document.getElementById('sound-btn');
    const puppyMascot = document.getElementById('puppy-mascot');
    const micCard = document.getElementById('mic-card');
    const continueBtn = document.getElementById('continue-btn');
  
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        // Wiggle puppy mascot playfully
        if (puppyMascot) {
          puppyMascot.classList.add('rotate-6');
          setTimeout(() => puppyMascot.classList.remove('rotate-6'), 200);
        }
        
        // Temporary label state for reassurance
        const label = soundBtn.querySelector('span:last-child');
        if (label) {
          const prev = label.textContent;
          label.textContent = 'משמיע: DOG! 🎵';
          setTimeout(() => {
            label.textContent = prev;
          }, 1500);
        }
      });
    }
  
    if (micCard) {
      micCard.addEventListener('click', () => {
        micCard.classList.add('bg-surface-container-highest');
        setTimeout(() => micCard.classList.remove('bg-surface-container-highest'), 300);
      });
    }
  
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        continueBtn.classList.add('scale-95');
        setTimeout(() => continueBtn.classList.remove('scale-95'), 150);
      });
    }
  })();
  // ---- screen: practice ----
  (function(){
  (function() {
      // Utility to spawn joyful micro-sparkles/confetti
      function spawnMicroParticles(originEl) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = originEl.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        const colors = ['#4f46e5', '#ffb95f', '#fe7488', '#3525cd', '#ffd4a4', '#4d44e3'];
        const count = 8;
  
        for (let i = 0; i < count; i++) {
          const dot = document.createElement('div');
          dot.className = 'confetti-particle';
          const size = Math.floor(Math.random() * 6 + 6);
          dot.style.width = size + 'px';
          dot.style.height = size + 'px';
          dot.style.backgroundColor = colors[i % colors.length];
          dot.style.left = originX + 'px';
          dot.style.top = originY + 'px';
  
          const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
          const dist = Math.random() * 55 + 40;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist - 30; // float slightly upward
          const tr = Math.random() * 360;
  
          dot.style.setProperty('--tx', tx + 'px');
          dot.style.setProperty('--ty', ty + 'px');
          dot.style.setProperty('--tr', tr + 'deg');
  
          document.body.appendChild(dot);
          setTimeout(() => {
            if (dot && dot.parentNode) dot.parentNode.removeChild(dot);
          }, 900);
        }
      }
  
      // Main Audio Speaker Interaction
      const mainSpeaker = document.getElementById('mainAudioBtn');
      if (mainSpeaker) {
        mainSpeaker.addEventListener('click', function(e) {
          this.classList.remove('scale-110');
          void this.offsetWidth; // force reflow
          this.classList.add('scale-110');
          spawnMicroParticles(this);
          setTimeout(() => this.classList.remove('scale-110'), 250);
        });
      }
  
      // Correct Dog card interaction
      const dogCard = document.getElementById('card-dog');
      if (dogCard) {
        dogCard.addEventListener('click', function() {
          this.classList.remove('card-pop-celebrate');
          void this.offsetWidth;
          this.classList.add('card-pop-celebrate');
          spawnMicroParticles(this);
  
          const checkBadge = document.getElementById('dogCheckBadge');
          if (checkBadge) {
            checkBadge.classList.add('scale-125');
            setTimeout(() => checkBadge.classList.remove('scale-125'), 350);
          }
  
          setTimeout(() => this.classList.remove('card-pop-celebrate'), 600);
        });
      }
  
      // Distractor cards gentle friendly wobble
      const distractors = ['card-cat', 'card-fish', 'card-lion'];
      distractors.forEach(id => {
        const card = document.getElementById(id);
        if (card) {
          card.addEventListener('click', function() {
            this.classList.remove('card-gentle-wobble');
            void this.offsetWidth;
            this.classList.add('card-gentle-wobble');
            setTimeout(() => this.classList.remove('card-gentle-wobble'), 500);
          });
        }
      });
  
      // Next button micro-confetti feedback
      const nextBtn = document.getElementById('nextActionBtn');
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          spawnMicroParticles(this);
        });
      }
    })();
  })();
  // ---- screen: sentence ----
  (function(){
  let isRecording = false;
    let hasRecorded = false;
    let waveInterval = null;
  
    function speakWord(buttonElement, word) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      }
      
      // Quick physical pop animation
      buttonElement.classList.add('scale-110');
      setTimeout(() => {
        buttonElement.classList.remove('scale-110');
      }, 180);
    }
  
    function playFullSentence() {
      const playBtn = document.getElementById('play-sentence-btn');
      const waveBars = document.querySelectorAll('#waveform span');
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('This is a dog.');
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
  
        // Animate waveform bars
        let animating = true;
        const interval = setInterval(() => {
          if (!animating) return;
          waveBars.forEach(bar => {
            const h = Math.floor(Math.random() * 16) + 4;
            bar.style.height = `${h}px`;
          });
        }, 100);
  
        utterance.onend = () => {
          animating = false;
          clearInterval(interval);
          waveBars.forEach((bar, idx) => {
            bar.style.height = [8, 16, 12, 20, 8][idx] + 'px';
          });
        };
  
        window.speechSynthesis.speak(utterance);
      }
    }
  
    function toggleRecording() {
      const pulse = document.getElementById('record-pulse');
      const icon = document.getElementById('record-icon');
      const statusText = document.getElementById('status-text');
      const statusDot = document.getElementById('status-dot');
      const statusPill = document.getElementById('status-pill');
      const playbackBtn = document.getElementById('playback-btn');
      const resetBtn = document.getElementById('reset-btn');
  
      if (!isRecording) {
        // Start Recording
        isRecording = true;
        pulse.classList.remove('hidden');
        icon.innerText = 'stop';
        statusText.innerText = 'מקשיב לך... תגידו עכשיו!';
        statusDot.className = 'w-2 h-2 rounded-full bg-error animate-pulse';
        statusPill.className = 'bg-error-container text-on-error-container px-3 py-1 rounded-full flex items-center gap-1.5 transition-all';
        
        // Auto stop after 3 seconds for simulated kids flow
        setTimeout(() => {
          if (isRecording) {
            toggleRecording();
          }
        }, 3000);
  
      } else {
        // Stop Recording & Success
        isRecording = false;
        hasRecorded = true;
        pulse.classList.add('hidden');
        icon.innerText = 'mic';
        statusText.innerText = 'כל הכבוד! הצליל נשמע מעולה 🎉';
        statusDot.className = 'w-2 h-2 rounded-full bg-primary';
        statusPill.className = 'bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full flex items-center gap-1.5 transition-all';
  
        // Enable Listen & Reset
        playbackBtn.disabled = false;
        playbackBtn.className = 'w-14 h-14 rounded-full bg-primary text-on-primary shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95';
        
        resetBtn.disabled = false;
        resetBtn.className = 'w-14 h-14 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center transition-all cursor-pointer active:scale-95';
  
        // Trigger celebratory button bounce
        const continueBtn = document.getElementById('continue-button');
        continueBtn.classList.add('scale-105');
        setTimeout(() => continueBtn.classList.remove('scale-105'), 300);
      }
    }
  
    function playUserRecording() {
      if (!hasRecorded) return;
      const playbackBtn = document.getElementById('playback-btn');
      playbackBtn.classList.add('scale-90');
      setTimeout(() => playbackBtn.classList.remove('scale-90'), 150);
  
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('This is a dog');
        utterance.lang = 'en-US';
        utterance.pitch = 1.25; // Playful slight pitch increase
        window.speechSynthesis.speak(utterance);
      }
    }
  
    function resetRecording() {
      hasRecorded = false;
      isRecording = false;
      
      const playbackBtn = document.getElementById('playback-btn');
      const resetBtn = document.getElementById('reset-btn');
      const statusText = document.getElementById('status-text');
      const statusDot = document.getElementById('status-dot');
      const statusPill = document.getElementById('status-pill');
  
      playbackBtn.disabled = true;
      playbackBtn.className = 'w-14 h-14 rounded-full bg-surface-container-highest text-outline flex items-center justify-center transition-all cursor-not-allowed';
  
      resetBtn.disabled = true;
      resetBtn.className = 'w-14 h-14 rounded-full bg-surface-container-highest text-outline flex items-center justify-center transition-all cursor-not-allowed';
  
      statusText.innerText = 'מוכן להקלטה';
      statusDot.className = 'w-2 h-2 rounded-full bg-outline';
      statusPill.className = 'bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full flex items-center gap-1.5 transition-all';
    }
  
    function completeStep() {
      const btn = document.getElementById('continue-button');
      btn.innerHTML = '<span>כל הכבוד! עוברים הלאה...</span>';
      btn.classList.add('bg-tertiary-container');
      setTimeout(() => {
        // Mock navigation action
        LP.go('progress');
      }, 400);
    }
  Object.assign(window,{completeStep,playFullSentence,playUserRecording,resetRecording,speakWord,toggleRecording});
  })();
  // ---- screen: progress ----
  (function(){
  // Word pronunciation auditory feedback simulation
    function playWordAudio(word) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      }
    }
  
    // Quick game launcher trigger
    document.getElementById('review-btn')?.addEventListener('click', () => {
      // Micro tactile scale & confetti effect cue
      const btn = document.getElementById('review-btn');
      btn.classList.add('bg-primary-container');
      setTimeout(() => {
        btn.classList.remove('bg-primary-container');
        LP.go('practice');
      }, 180);
    });
  
    
  Object.assign(window,{playWordAudio});
  })();
  // ---- screen: parent ----
  (function(){
  
    // Toggle Reminder Micro-Interaction
    const reminderToggle = document.getElementById('reminder-toggle');
    if (reminderToggle) {
      let isActive = true;
      reminderToggle.addEventListener('click', () => {
        isActive = !isActive;
        if (isActive) {
          reminderToggle.className = 'w-12 h-7 bg-primary rounded-full p-0.5 flex items-center justify-end transition-colors duration-200';
        } else {
          reminderToggle.className = 'w-12 h-7 bg-surface-container-highest rounded-full p-0.5 flex items-center justify-start transition-colors duration-200';
        }
      });
    }
  
    // WhatsApp Share Toast Trigger
    const shareBtn = document.getElementById('whatsapp-share-btn');
    const toast = document.getElementById('toast-pill');
    if (shareBtn && toast) {
      shareBtn.addEventListener('click', () => {
        toast.classList.remove('opacity-0', 'pointer-events-none');
        toast.classList.add('opacity-100');
        setTimeout(() => {
          toast.classList.remove('opacity-100');
          toast.classList.add('opacity-0', 'pointer-events-none');
        }, 2500);
      });
    }
  })();

  // ---------- 3. Navigation hooks ----------
  function after(id, ms, fn) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('click', function () { setTimeout(fn, ms); });
  }
  after('startBtn', 150, function () { go('age'); });
  after('submit-age-btn', 250, function () {
    var checked = document.querySelector('#age-selector-group [aria-checked="true"]');
    store.set('age', checked && checked.id.indexOf('7-8') > -1 ? '7-8' : '5-6');
    go('home', { replace: true });
  });
  after('start-lesson-btn', 450, function () { go('lesson'); });
  after('continue-btn', 160, function () { go('practice'); });
  after('nextActionBtn', 300, function () { go('sentence'); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (!a) return;
    e.preventDefault();
    var p = a.getAttribute('data-path');
    if (p && NAV_ROUTE[p]) go(NAV_ROUTE[p]);
  });

  // broken external image → hide the broken icon instead of showing alt text
  document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.target.style.visibility = 'hidden';
  }, true);
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

  // ---------- 4. Boot ----------
  window.addEventListener('hashchange', function () { show(currentFromHash() || defaultScreen()); });
  var first = currentFromHash();
  if (!first) { first = defaultScreen(); history.replaceState(null, '', '#/' + first); }
  show(first);

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
