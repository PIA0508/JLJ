// ============================================================
// 金陵劫 - UI 渲染系统
// ============================================================

const UI = {
  els: {},

  init() {
    this.els = {
      title: document.getElementById('title-screen'),
      game: document.getElementById('game-screen'),
      storyArea: document.getElementById('story-area'),
      charPanel: document.getElementById('char-panel'),
      choicePanel: document.getElementById('choice-panel'),
      diceOverlay: document.getElementById('dice-overlay'),
      loadingOverlay: document.getElementById('loading-overlay'),
      chapterOverlay: document.getElementById('chapter-overlay'),
      settingsPanel: document.getElementById('settings-panel'),
      synopsisPanel: document.getElementById('synopsis-panel'),
      tapHint: document.getElementById('tap-hint')
    };
  },

  // ============================================================
  // 标题画面
  // ============================================================
  hideTitle() { this.els.title.classList.add('hidden'); },
  showTitle() { this.els.title.classList.remove('hidden'); },

  // ============================================================
  // 游戏UI
  // ============================================================
  showGameUI() {
    this.els.game.classList.remove('hidden');
    this.updateCharacterPanel();
  },

  // ============================================================
  // 打字机效果 - 叙述文本
  // ============================================================
  typeText(text, options = {}) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'story-beat narrate';
      if (options.style) div.classList.add(options.style);
      if (options.highlight) div.classList.add('highlight-' + options.highlight);

      this.els.storyArea.appendChild(div);
      this._scrollToBottom();

      let i = 0;
      const speed = CONFIG.TYPEWRITER_SPEED;
      let skip = false;

      const skipHandler = () => { skip = true; };
      this.els.storyArea.addEventListener('click', skipHandler, { once: true });

      const type = () => {
        if (skip || i >= text.length) {
          div.textContent = text;
          this.els.storyArea.removeEventListener('click', skipHandler);
          this._scrollToBottom();
          this._showTapHint();
          setTimeout(resolve, options.pause || 200);
          return;
        }
        div.textContent = text.substring(0, i + 1);
        i++;
        this._scrollToBottom();
        setTimeout(type, speed);
      };
      type();
    });
  },

  // ============================================================
  // 打字机效果 - 对话
  // ============================================================
  typeDialog(name, text, color, style) {
    return new Promise(resolve => {
      const container = document.createElement('div');
      container.className = 'story-beat dialog';
      if (style) container.classList.add(style);

      const nameSpan = document.createElement('span');
      nameSpan.className = 'speaker-name';
      nameSpan.style.color = color || '#c9a96e';
      nameSpan.textContent = name;

      const textSpan = document.createElement('span');
      textSpan.className = 'dialog-text';

      container.appendChild(nameSpan);
      container.appendChild(document.createTextNode('：'));
      container.appendChild(textSpan);

      this.els.storyArea.appendChild(container);
      this._scrollToBottom();

      let i = 0;
      let skip = false;
      const skipHandler = () => { skip = true; };
      this.els.storyArea.addEventListener('click', skipHandler, { once: true });

      const type = () => {
        if (skip || i >= text.length) {
          textSpan.textContent = text;
          this.els.storyArea.removeEventListener('click', skipHandler);
          this._scrollToBottom();
          this._showTapHint();
          setTimeout(resolve, 200);
          return;
        }
        textSpan.textContent = text.substring(0, i + 1);
        i++;
        this._scrollToBottom();
        setTimeout(type, CONFIG.TYPEWRITER_SPEED);
      };
      type();
    });
  },

  // ============================================================
  // 章节标题（全屏覆盖式）
  // ============================================================
  showChapterTitle(num, title) {
    return new Promise(resolve => {
      const overlay = this.els.chapterOverlay;
      overlay.innerHTML = `
        <div class="chapter-num">第${num === '续' || num === '序' ? '' : ''}${num}${num === '续' || num === '序' ? '' : '章'}</div>
        <div class="chapter-title">${title}</div>
      `;
      overlay.style.display = 'flex';
      overlay.classList.remove('hidden');
      void overlay.offsetHeight;
      overlay.classList.add('show');

      setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => {
          overlay.style.display = 'none';
          overlay.classList.add('hidden');
          // 在故事区域也显示章节标记
          const marker = document.createElement('div');
          marker.className = 'chapter-marker';
          marker.innerHTML = `<span>— 第${num === '续' || num === '序' ? '' : ''}${num}${num === '续' || num === '序' ? '' : '章'}：${title} —</span>`;
          this.els.storyArea.appendChild(marker);
          this._scrollToBottom();
          resolve();
        }, 500);
      }, 2500);
    });
  },

  // ============================================================
  // 小标题（AI续写章节用，不全屏覆盖）
  // ============================================================
  showSubTitle(title) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'sub-chapter-title';
      div.textContent = `— ${title} —`;
      this.els.storyArea.appendChild(div);
      this._scrollToBottom();
      setTimeout(resolve, 600);
    });
  },

  // ============================================================
  // 分隔线（AI续写段落之间）
  // ============================================================
  showDivider() {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'story-divider';
      div.innerHTML = '· · ·';
      this.els.storyArea.appendChild(div);
      this._scrollToBottom();
      setTimeout(resolve, 400);
    });
  },

  // ============================================================
  // 骰子动画
  // ============================================================
  showDicePrompt(desc) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'story-beat dice-prompt';
      div.innerHTML = `<span class="dice-icon">🎲</span> ${desc}`;
      this.els.storyArea.appendChild(div);
      this._scrollToBottom();
      setTimeout(resolve, 500);
    });
  },

  animateDice(result) {
    return new Promise(resolve => {
      const overlay = this.els.diceOverlay;
      overlay.classList.remove('hidden');

      overlay.innerHTML = `
        <div class="dice-box">
          <div class="dice-d20">
            <div class="dice-value">?</div>
          </div>
          <div class="dice-detail"></div>
        </div>
      `;

      const diceEl = overlay.querySelector('.dice-value');
      const detailEl = overlay.querySelector('.dice-detail');
      const d20El = overlay.querySelector('.dice-d20');

      let count = 0;
      const maxCount = 15;
      d20El.classList.add('rolling');

      const roll = () => {
        if (count < maxCount) {
          diceEl.textContent = DiceSystem.d20();
          count++;
          setTimeout(roll, 60 + count * 10);
        } else {
          d20El.classList.remove('rolling');
          diceEl.textContent = result.roll;

          if (result.nat20) d20El.classList.add('crit');
          else if (result.nat1) d20El.classList.add('fumble');
          else if (result.success) d20El.classList.add('success');
          else d20El.classList.add('fail');

          detailEl.textContent = result.detail;

          setTimeout(() => {
            overlay.classList.add('hidden');
            const div = document.createElement('div');
            div.className = `story-beat dice-result ${result.success ? 'success' : 'fail'}`;
            div.innerHTML = `🎲 ${result.detail}`;
            this.els.storyArea.appendChild(div);
            this._scrollToBottom();
            resolve();
          }, 1500);
        }
      };
      roll();
    });
  },

  // ============================================================
  // 心理骰子展示
  // ============================================================
  showPsychDice(character, psychResult) {
    return new Promise(resolve => {
      const div = document.createElement('div');
      div.className = 'story-beat psych-dice';
      div.innerHTML = `
        <div class="psych-header" style="color:${character.color}">
          🧠 ${character.name} 心理骰子
        </div>
        <div class="psych-traits">
          ${psychResult.details.map(d => `<span class="psych-trait">${d}</span>`).join('')}
        </div>
        <div class="psych-summary">${psychResult.summary}</div>
      `;
      this.els.storyArea.appendChild(div);
      this._scrollToBottom();
      setTimeout(resolve, 800);
    });
  },

  // ============================================================
  // 玩家选择
  // ============================================================
  showChoices(prompt, options, callback) {
    const panel = this.els.choicePanel;
    panel.innerHTML = `
      <div class="choice-prompt">${prompt}</div>
      <div class="choice-options">
        ${options.map((opt, i) => `
          <button class="choice-btn" data-index="${i}">${opt.text}</button>
        `).join('')}
      </div>
    `;
    panel.classList.remove('hidden');

    panel.querySelectorAll('.choice-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        callback(options[i]);
      });
    });

    this._scrollToBottom();
  },

  hideChoices() {
    this.els.choicePanel.classList.add('hidden');
    this.els.choicePanel.innerHTML = '';
  },

  // ============================================================
  // 角色状态面板
  // ============================================================
  updateCharacterPanel() {
    const panel = this.els.charPanel;
    panel.innerHTML = Object.entries(CHARACTERS).map(([id, char]) => {
      const s = GameEngine.state.characters[id] || {};
      const hp = s.hp || char.hp;
      const hpPct = Math.round((hp / char.maxHp) * 100);
      return `
        <div class="char-card" data-id="${id}" onclick="UI.showCharDetail('${id}')">
          <div class="char-avatar" style="background:${char.color}">${char.name[0]}</div>
          <div class="char-info">
            <div class="char-name" style="color:${char.color}">${char.name}</div>
            <div class="hp-bar"><div class="hp-fill" style="width:${hpPct}%"></div></div>
          </div>
        </div>
      `;
    }).join('');
  },

  // 角色详情弹窗
  showCharDetail(id) {
    const char = CHARACTERS[id];
    if (!char) return;

    const overlay = document.createElement('div');
    overlay.className = 'char-detail-overlay';
    overlay.innerHTML = `
      <div class="char-detail-card">
        <div class="char-detail-header" style="border-color:${char.color}">
          <div class="char-detail-avatar" style="background:${char.color}">${char.name}</div>
          <div class="char-detail-title">${char.title}</div>
          <div class="char-detail-weapon">兵器：${char.weapon}</div>
        </div>
        <div class="char-detail-bio">${char.bio}</div>
        <div class="char-detail-stats">
          <div class="stat-section">
            <h4>⚔️ 能力骰子</h4>
            ${Object.entries(char.abilities).map(([k, v]) =>
              `<div class="stat-row"><span>${ABILITY_NAMES[k]}</span><span class="stat-val">${v} (${DiceSystem.getModifier(v) >= 0 ? '+' : ''}${DiceSystem.getModifier(v)})</span></div>`
            ).join('')}
          </div>
          <div class="stat-section">
            <h4>🧠 心理骰子</h4>
            ${Object.entries(char.psychology).map(([k, v]) =>
              `<div class="stat-row"><span>${PSYCH_NAMES[k]}</span><span class="stat-val">${v}</span></div>`
            ).join('')}
          </div>
        </div>
        <div class="char-detail-personality"><strong>性格：</strong>${char.personality}</div>
        <button class="close-detail" onclick="this.closest('.char-detail-overlay').remove()">关闭</button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  },

  // ============================================================
  // 加载提示
  // ============================================================
  showLoading(text) {
    this.els.loadingOverlay.innerHTML = `
      <div class="loading-box">
        <div class="loading-spinner"></div>
        <div class="loading-text">${text}</div>
      </div>
    `;
    this.els.loadingOverlay.classList.remove('hidden');
  },

  hideLoading() {
    this.els.loadingOverlay.classList.add('hidden');
  },

  // ============================================================
  // 设置面板
  // ============================================================
  toggleSettings() {
    this.els.settingsPanel.classList.toggle('hidden');
    // 打开设置时关闭梗概
    if (!this.els.settingsPanel.classList.contains('hidden')) {
      this.els.synopsisPanel.classList.add('hidden');
    }
  },

  // ============================================================
  // 故事梗概面板
  // ============================================================
  toggleSynopsis() {
    const panel = this.els.synopsisPanel;
    if (panel.classList.contains('hidden')) {
      this._renderSynopsis();
      panel.classList.remove('hidden');
      // 打开梗概时关闭设置
      this.els.settingsPanel.classList.add('hidden');
    } else {
      panel.classList.add('hidden');
    }
  },

  _renderSynopsis() {
    const data = GameEngine.getSynopsisData();
    const panel = this.els.synopsisPanel;

    // 进度指示
    let phaseText = '主线进行中';
    if (data.phase === 'freePlay') phaseText = 'AI续写中';
    else if (data.phase === 'ending') phaseText = '已完结';
    const chapterProgress = data.phase === 'mainStory'
      ? `第${data.currentChapter + 1}/${MAIN_STORY.length}章`
      : '主线已完成';

    // 角色状态
    const charHtml = Object.entries(data.characters).map(([id, c]) => {
      const hpPct = Math.round((c.hp / c.maxHp) * 100);
      return `
        <div class="syn-char">
          <span class="syn-char-dot" style="background:${c.color}"></span>
          <span class="syn-char-name">${c.name}</span>
          <span class="syn-char-hp">${c.hp}/${c.maxHp}</span>
          <span class="syn-char-loc">${c.location}</span>
        </div>`;
    }).join('');

    // 梗概条目
    let synHtml = '';
    if (data.synopsis.length === 0) {
      synHtml = '<div class="syn-empty">尚无记录，完成第一章后将自动记录。</div>';
    } else {
      synHtml = data.synopsis.map((s, i) => `
        <div class="syn-entry">
          <div class="syn-entry-num">${i + 1}</div>
          <div class="syn-entry-text">${s.text}</div>
        </div>
      `).join('');
    }

    // 玩家选择记录
    let choiceHtml = '';
    if (data.playerChoices.length > 0) {
      choiceHtml = `
        <div class="syn-section-title">你的选择</div>
        <div class="syn-choices">
          ${data.playerChoices.map(c => `<span class="syn-choice-tag">${c}</span>`).join('')}
        </div>`;
    }

    // 关键骰子
    let diceHtml = '';
    if (data.diceHighlights.length > 0) {
      diceHtml = `
        <div class="syn-section-title">关键骰子</div>
        ${data.diceHighlights.map(d => `
          <div class="syn-dice ${d.nat20 ? 'crit' : 'fumble'}">${d.detail}</div>
        `).join('')}`;
    }

    panel.innerHTML = `
      <div class="syn-header">
        <div class="syn-title">📜 故事梗概</div>
        <button class="syn-close" onclick="UI.toggleSynopsis()">✕</button>
      </div>
      <div class="syn-progress">
        <span class="syn-phase">${phaseText}</span>
        <span class="syn-chapter">${chapterProgress}</span>
      </div>
      <div class="syn-section-title">角色状态</div>
      <div class="syn-chars">${charHtml}</div>
      <div class="syn-section-title">剧情回顾</div>
      <div class="syn-entries">${synHtml}</div>
      ${choiceHtml}
      ${diceHtml}
    `;
  },

  _showTapHint() {
    if (this.els.tapHint) {
      this.els.tapHint.classList.add('show');
      setTimeout(() => this.els.tapHint.classList.remove('show'), 1500);
    }
  },

  _scrollToBottom() {
    const el = this.els.storyArea;
    if (el) {
      requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    }
  }
};
