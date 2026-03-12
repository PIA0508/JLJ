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
      savePanel: document.getElementById('save-panel'),
      charBookPanel: document.getElementById('charbook-panel'),
      tapHint: document.getElementById('tap-hint')
    };
  },

  hideTitle() { this.els.title.classList.add('hidden'); },
  showTitle() { this.els.title.classList.remove('hidden'); },
  showGameUI() { this.els.game.classList.remove('hidden'); this.updateCharacterPanel(); },

  // 打字机 - 叙述
  typeText(text, options) {
    options = options || {};
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'story-beat narrate';
      if (options.style) div.classList.add(options.style);
      if (options.highlight) div.classList.add('highlight-' + options.highlight);
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      var i = 0, speed = CONFIG.TYPEWRITER_SPEED, skip = false;
      var skipHandler = function() { skip = true; };
      UI.els.storyArea.addEventListener('click', skipHandler, { once: true });
      function type() {
        if (skip || i >= text.length) {
          div.textContent = text;
          UI.els.storyArea.removeEventListener('click', skipHandler);
          UI._scrollToBottom();
          UI._showTapHint();
          setTimeout(resolve, options.pause || 200);
          return;
        }
        div.textContent = text.substring(0, i + 1);
        i++;
        UI._scrollToBottom();
        setTimeout(type, speed);
      }
      type();
    });
  },

  // 打字机 - 对话
  typeDialog(name, text, color, style) {
    return new Promise(function(resolve) {
      var container = document.createElement('div');
      container.className = 'story-beat dialog';
      if (style) container.classList.add(style);
      var nameSpan = document.createElement('span');
      nameSpan.className = 'speaker-name';
      nameSpan.style.color = color || '#c9a96e';
      nameSpan.textContent = name;
      var textSpan = document.createElement('span');
      textSpan.className = 'dialog-text';
      container.appendChild(nameSpan);
      container.appendChild(document.createTextNode('：'));
      container.appendChild(textSpan);
      UI.els.storyArea.appendChild(container);
      UI._scrollToBottom();
      var i = 0, skip = false;
      var skipHandler = function() { skip = true; };
      UI.els.storyArea.addEventListener('click', skipHandler, { once: true });
      function type() {
        if (skip || i >= text.length) {
          textSpan.textContent = text;
          UI.els.storyArea.removeEventListener('click', skipHandler);
          UI._scrollToBottom();
          UI._showTapHint();
          setTimeout(resolve, 200);
          return;
        }
        textSpan.textContent = text.substring(0, i + 1);
        i++;
        UI._scrollToBottom();
        setTimeout(type, CONFIG.TYPEWRITER_SPEED);
      }
      type();
    });
  },

  // 章节标题（全屏覆盖）
  showChapterTitle(num, title) {
    return new Promise(function(resolve) {
      var overlay = UI.els.chapterOverlay;
      var isSpecial = (num === '续' || num === '序');
      overlay.innerHTML = '<div class="chapter-num">第' + (isSpecial ? '' : '') + num + (isSpecial ? '' : '章') + '</div><div class="chapter-title">' + title + '</div>';
      overlay.style.display = 'flex';
      overlay.classList.remove('hidden');
      void overlay.offsetHeight;
      overlay.classList.add('show');
      setTimeout(function() {
        overlay.classList.remove('show');
        setTimeout(function() {
          overlay.style.display = 'none';
          overlay.classList.add('hidden');
          var marker = document.createElement('div');
          marker.className = 'chapter-marker';
          marker.innerHTML = '<span>— 第' + (isSpecial ? '' : '') + num + (isSpecial ? '' : '章') + '：' + title + ' —</span>';
          UI.els.storyArea.appendChild(marker);
          UI._scrollToBottom();
          resolve();
        }, 500);
      }, 2500);
    });
  },

  // ============================================================
  // 场景横幅 (地点+氛围+天气)
  // ============================================================
  showSceneBanner(location, mood, weather) {
    return new Promise(function(resolve) {
      var weatherIcons = { rain: '🌧', clear: '☀', night: '🌙', dawn: '🌅', storm: '⛈', snow: '❄' };
      var moodColors = { '繁华': '#c9a96e', '清新': '#a8d5a2', '凝重': '#7eb8da', '紧张': '#d4726a', '沉思': '#9a8aaa', '离别': '#b0a080', '争论': '#e8a060' };
      var icon = weatherIcons[weather] || '';
      var color = moodColors[mood] || '#c9a96e';
      var div = document.createElement('div');
      div.className = 'scene-banner';
      div.innerHTML = '<div class="scene-line"></div>' +
        '<div class="scene-content">' +
        '<span class="scene-icon">' + icon + '</span>' +
        '<span class="scene-location" style="color:' + color + '">' + location + '</span>' +
        '</div>' +
        '<div class="scene-line"></div>';
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 800);
    });
  },

  // ============================================================
  // 角色登场卡
  // ============================================================
  showEntrance(charId, text) {
    return new Promise(function(resolve) {
      var char = CHARACTERS[charId];
      var div = document.createElement('div');
      div.className = 'entrance-card';
      if (char) {
        div.innerHTML = '<div class="entrance-bar" style="background:' + char.color + '"></div>' +
          '<div class="entrance-body">' +
          '<div class="entrance-avatar" style="background:' + char.color + '">' + char.name[0] + '</div>' +
          '<div class="entrance-info">' +
          '<div class="entrance-name" style="color:' + char.color + '">' + char.name + '</div>' +
          '<div class="entrance-title">' + char.title + '</div>' +
          '</div></div>' +
          '<div class="entrance-text">' + text + '</div>';
      } else {
        div.innerHTML = '<div class="entrance-text">' + text + '</div>';
      }
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 1000);
    });
  },

  // ============================================================
  // 战斗闪光
  // ============================================================
  showCombatFlash(text) {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'combat-flash';
      div.innerHTML = '<span class="combat-icon">⚔</span> ' + text;
      UI.els.storyArea.appendChild(div);
      // 屏幕震动效果
      UI.els.storyArea.classList.add('screen-shake');
      setTimeout(function() { UI.els.storyArea.classList.remove('screen-shake'); }, 500);
      UI._scrollToBottom();
      setTimeout(resolve, 800);
    });
  },

  // ============================================================
  // 诗词/名句
  // ============================================================
  showPoem(text) {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'poem-block';
      div.innerHTML = '<div class="poem-deco">❖</div>' +
        '<div class="poem-text">' + text.replace(/\n/g, '<br>') + '</div>' +
        '<div class="poem-deco">❖</div>';
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 1200);
    });
  },

  // ============================================================
  // 场景转换
  // ============================================================
  showTransition(text) {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'scene-transition';
      div.innerHTML = '<div class="transition-line"></div>' +
        '<span class="transition-text">' + text + '</span>' +
        '<div class="transition-line"></div>';
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 1000);
    });
  },

  // AI续写小标题
  showSubTitle(title) {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'sub-chapter-title';
      div.textContent = '— ' + title + ' —';
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 600);
    });
  },

  // 分隔线
  showDivider() {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'story-divider';
      div.innerHTML = '· · ·';
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 400);
    });
  },

  // 骰子
  showDicePrompt(desc) {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'story-beat dice-prompt';
      div.innerHTML = '<span class="dice-icon">🎲</span> ' + desc;
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 500);
    });
  },

  animateDice(result) {
    return new Promise(function(resolve) {
      var overlay = UI.els.diceOverlay;
      overlay.classList.remove('hidden');
      overlay.innerHTML = '<div class="dice-box"><div class="dice-d20"><div class="dice-value">?</div></div><div class="dice-detail"></div></div>';
      var diceEl = overlay.querySelector('.dice-value');
      var detailEl = overlay.querySelector('.dice-detail');
      var d20El = overlay.querySelector('.dice-d20');
      var count = 0, maxCount = 15;
      d20El.classList.add('rolling');
      function roll() {
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
          setTimeout(function() {
            overlay.classList.add('hidden');
            var div = document.createElement('div');
            div.className = 'story-beat dice-result ' + (result.success ? 'success' : 'fail');
            div.innerHTML = '🎲 ' + result.detail;
            UI.els.storyArea.appendChild(div);
            UI._scrollToBottom();
            resolve();
          }, 1500);
        }
      }
      roll();
    });
  },

  // 心理骰子
  showPsychDice(character, psychResult) {
    return new Promise(function(resolve) {
      var div = document.createElement('div');
      div.className = 'story-beat psych-dice';
      div.innerHTML = '<div class="psych-header" style="color:' + character.color + '">🧠 ' + character.name + ' 心理骰子</div>' +
        '<div class="psych-traits">' + psychResult.details.map(function(d) { return '<span class="psych-trait">' + d + '</span>'; }).join('') + '</div>' +
        '<div class="psych-summary">' + psychResult.summary + '</div>';
      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 800);
    });
  },

  // 玩家选择
  showChoices(prompt, options, callback) {
    var panel = UI.els.choicePanel;
    panel.innerHTML = '<div class="choice-prompt">' + prompt + '</div><div class="choice-options">' +
      options.map(function(opt, i) { return '<button class="choice-btn" data-index="' + i + '">' + opt.text + '</button>'; }).join('') + '</div>';
    panel.classList.remove('hidden');
    panel.querySelectorAll('.choice-btn').forEach(function(btn, i) {
      btn.addEventListener('click', function() { callback(options[i]); });
    });
    UI._scrollToBottom();
  },

  hideChoices() {
    UI.els.choicePanel.classList.add('hidden');
    UI.els.choicePanel.innerHTML = '';
  },

  // 角色面板
  updateCharacterPanel() {
    var panel = UI.els.charPanel;
    panel.innerHTML = Object.entries(CHARACTERS).map(function(entry) {
      var id = entry[0], char = entry[1];
      var s = GameEngine.state.characters[id] || {};
      var hp = s.hp || char.hp;
      var hpPct = Math.round((hp / char.maxHp) * 100);
      return '<div class="char-card" onclick="UI.showCharDetail(\'' + id + '\')">' +
        '<div class="char-avatar" style="background:' + char.color + '">' + char.name[0] + '</div>' +
        '<div class="char-info"><div class="char-name" style="color:' + char.color + '">' + char.name + '</div>' +
        '<div class="hp-bar"><div class="hp-fill" style="width:' + hpPct + '%"></div></div></div></div>';
    }).join('');
  },

  // 角色详情弹窗
  showCharDetail(id) {
    var char = CHARACTERS[id];
    if (!char) return;
    var overlay = document.createElement('div');
    overlay.className = 'char-detail-overlay';
    overlay.innerHTML = '<div class="char-detail-card">' +
      '<div class="char-detail-header" style="border-color:' + char.color + '">' +
      '<div class="char-detail-avatar" style="background:' + char.color + '">' + char.name + '</div>' +
      '<div class="char-detail-title">' + char.title + '</div>' +
      '<div class="char-detail-weapon">兵器：' + char.weapon + '</div></div>' +
      '<div class="char-detail-bio">' + char.bio + '</div>' +
      '<div class="char-detail-stats"><div class="stat-section"><h4>⚔️ 能力骰子</h4>' +
      Object.entries(char.abilities).map(function(e) {
        var mod = DiceSystem.getModifier(e[1]);
        return '<div class="stat-row"><span>' + ABILITY_NAMES[e[0]] + '</span><span class="stat-val">' + e[1] + ' (' + (mod >= 0 ? '+' : '') + mod + ')</span></div>';
      }).join('') + '</div><div class="stat-section"><h4>🧠 心理骰子</h4>' +
      Object.entries(char.psychology).map(function(e) {
        return '<div class="stat-row"><span>' + PSYCH_NAMES[e[0]] + '</span><span class="stat-val">' + e[1] + '</span></div>';
      }).join('') + '</div></div>' +
      '<div class="char-detail-personality"><strong>性格：</strong>' + char.personality + '</div>' +
      '<button class="close-detail" onclick="this.closest(\'.char-detail-overlay\').remove()">关闭</button></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
  },

  // 加载提示
  showLoading(text) {
    UI.els.loadingOverlay.innerHTML = '<div class="loading-box"><div class="loading-spinner"></div><div class="loading-text">' + text + '</div></div>';
    UI.els.loadingOverlay.classList.remove('hidden');
  },
  hideLoading() { UI.els.loadingOverlay.classList.add('hidden'); },

  // 设置
  toggleSettings() {
    UI.els.settingsPanel.classList.toggle('hidden');
    if (!UI.els.settingsPanel.classList.contains('hidden')) {
      UI.els.synopsisPanel.classList.add('hidden');
      if (UI.els.charBookPanel) UI.els.charBookPanel.classList.add('hidden');
      if (UI.els.savePanel) UI.els.savePanel.classList.add('hidden');
    }
  },

  // ============================================================
  // 多槽位存档面板
  // ============================================================
  toggleSavePanel() {
    var panel = UI.els.savePanel;
    if (panel.classList.contains('hidden')) {
      UI._renderSavePanel();
      panel.classList.remove('hidden');
      UI.els.settingsPanel.classList.add('hidden');
      UI.els.synopsisPanel.classList.add('hidden');
      if (UI.els.charBookPanel) UI.els.charBookPanel.classList.add('hidden');
    } else { panel.classList.add('hidden'); }
  },

  _renderSavePanel() {
    var slots = GameEngine.getSaveSlots();
    var html = '<div class="syn-header"><div class="syn-title">💾 存档管理</div><button class="syn-close" onclick="UI.toggleSavePanel()">✕</button></div>';
    html += '<div style="padding:.6rem .8rem">';
    for (var i = 0; i < slots.length; i++) {
      var s = slots[i];
      if (s.exists) {
        html += '<div class="save-slot"><div class="save-slot-info"><div class="save-slot-label">存档 ' + (i + 1) + ' — ' + s.label + '</div><div class="save-slot-time">' + s.time + '</div></div>' +
          '<div class="save-slot-btns"><button class="save-slot-btn load" onclick="UI.toggleSavePanel();GameEngine.continueGame(' + i + ')">读取</button>' +
          '<button class="save-slot-btn save" onclick="GameEngine.saveGame(' + i + ');UI._renderSavePanel()">覆盖</button>' +
          '<button class="save-slot-btn del" onclick="if(confirm(\'确定删除？\')){GameEngine.deleteSave(' + i + ');UI._renderSavePanel()}">删除</button></div></div>';
      } else {
        html += '<div class="save-slot empty"><div class="save-slot-info"><div class="save-slot-label">存档 ' + (i + 1) + ' — 空</div></div>' +
          '<div class="save-slot-btns"><button class="save-slot-btn save" onclick="GameEngine.saveGame(' + i + ');UI._renderSavePanel()">保存</button></div></div>';
      }
    }
    html += '</div>';
    UI.els.savePanel.innerHTML = html;
  },

  // ============================================================
  // 人物图鉴 (出场角色 + 关系图)
  // ============================================================
  toggleCharBook() {
    var panel = UI.els.charBookPanel;
    if (panel.classList.contains('hidden')) {
      UI._renderCharBook();
      panel.classList.remove('hidden');
      UI.els.settingsPanel.classList.add('hidden');
      UI.els.synopsisPanel.classList.add('hidden');
      if (UI.els.savePanel) UI.els.savePanel.classList.add('hidden');
    } else { panel.classList.add('hidden'); }
  },

  _renderCharBook() {
    var appeared = GameEngine.state.appearedChars;
    var relations = GameEngine.state.relationships;
    var factionColors = { '乐求汇': '#c9a96e', '常山宇文氏': '#a8d5a2', '金陵司马氏': '#d4726a', '丹阳慕容氏': '#7eb8da', '姑苏齐氏': '#d0a0d0' };

    // 按势力分组
    var groups = {};
    for (var name in appeared) {
      var c = appeared[name];
      var f = c.faction || '其他';
      if (!groups[f]) groups[f] = [];
      groups[f].push(c);
    }

    var charHtml = '';
    for (var faction in groups) {
      var color = factionColors[faction] || '#9a9080';
      charHtml += '<div class="cb-faction"><div class="cb-faction-name" style="color:' + color + '">' + faction + '</div>';
      for (var i = 0; i < groups[faction].length; i++) {
        var ch = groups[faction][i];
        var mainChar = ch.id ? CHARACTERS[ch.id] : null;
        var avatarBg = mainChar ? mainChar.color : color;
        charHtml += '<div class="cb-char">' +
          '<div class="cb-avatar" style="background:' + avatarBg + '">' + ch.name[0] + '</div>' +
          '<div class="cb-info">' +
          '<div class="cb-name" style="color:' + avatarBg + '">' + ch.name + '</div>' +
          '<div class="cb-title">' + (ch.title || '') + '</div>' +
          '<div class="cb-desc">' + (ch.desc || '') + '</div>' +
          '</div></div>';
      }
      charHtml += '</div>';
    }

    // 关系图
    var relHtml = '';
    for (var j = 0; j < relations.length; j++) {
      var r = relations[j];
      // 只显示已出场角色的关系
      if (appeared[r.from] || appeared[r.to]) {
        var typeColors = { '兄弟': '#c9a96e', '结义': '#a8d5a2', '世仇': '#d4726a', '盟友': '#7eb8da', '族亲': '#d0a0d0', '族人': '#9a9080' };
        var tc = typeColors[r.type] || '#9a9080';
        relHtml += '<div class="cb-rel">' +
          '<span class="cb-rel-from">' + r.from + '</span>' +
          '<span class="cb-rel-type" style="color:' + tc + ';border-color:' + tc + '">' + r.type + '</span>' +
          '<span class="cb-rel-to">' + r.to + '</span>' +
          '<span class="cb-rel-desc">' + (r.desc || '') + '</span></div>';
      }
    }

    var noChars = Object.keys(appeared).length === 0;
    UI.els.charBookPanel.innerHTML =
      '<div class="syn-header"><div class="syn-title">👥 人物图鉴</div><button class="syn-close" onclick="UI.toggleCharBook()">✕</button></div>' +
      '<div class="cb-body">' +
      (noChars ? '<div class="syn-empty">尚无角色出场，开始游戏后将自动记录。</div>' :
        '<div class="syn-section-title">出场人物</div>' + charHtml +
        '<div class="syn-section-title">人物关系</div><div class="cb-relations">' + relHtml + '</div>') +
      '</div>';
  },

  // ============================================================
  // 故事梗概面板
  // ============================================================
  toggleSynopsis() {
    var panel = UI.els.synopsisPanel;
    if (panel.classList.contains('hidden')) {
      UI._renderSynopsis();
      panel.classList.remove('hidden');
      UI.els.settingsPanel.classList.add('hidden');
    } else {
      panel.classList.add('hidden');
    }
  },

  _renderSynopsis() {
    var data = GameEngine.getSynopsisData();
    var panel = UI.els.synopsisPanel;
    var phaseText = data.phase === 'freePlay' ? 'AI续写中' : data.phase === 'ending' ? '已完结' : '主线进行中';
    var chapterProgress = data.phase === 'mainStory' ? '第' + (data.currentChapter + 1) + '/' + MAIN_STORY.length + '章' : '主线已完成';

    var charHtml = Object.entries(data.characters).map(function(entry) {
      var c = entry[1];
      return '<div class="syn-char"><span class="syn-char-dot" style="background:' + c.color + '"></span>' +
        '<span class="syn-char-name">' + c.name + '</span>' +
        '<span class="syn-char-hp">' + c.hp + '/' + c.maxHp + '</span>' +
        '<span class="syn-char-loc">' + c.location + '</span></div>';
    }).join('');

    var synHtml = '';
    if (data.synopsis.length === 0) {
      synHtml = '<div class="syn-empty">尚无记录，完成第一章后将自动记录。</div>';
    } else {
      synHtml = data.synopsis.map(function(s, i) {
        return '<div class="syn-entry"><div class="syn-entry-num">' + (i + 1) + '</div><div class="syn-entry-text">' + s.text + '</div></div>';
      }).join('');
    }

    var choiceHtml = '';
    if (data.playerChoices.length > 0) {
      choiceHtml = '<div class="syn-section-title">你的选择</div><div class="syn-choices">' +
        data.playerChoices.map(function(c) { return '<span class="syn-choice-tag">' + c + '</span>'; }).join('') + '</div>';
    }

    var diceHtml = '';
    if (data.diceHighlights.length > 0) {
      diceHtml = '<div class="syn-section-title">关键骰子</div>' +
        data.diceHighlights.map(function(d) {
          return '<div class="syn-dice ' + (d.nat20 ? 'crit' : 'fumble') + '">' + d.detail + '</div>';
        }).join('');
    }

    panel.innerHTML = '<div class="syn-header"><div class="syn-title">📜 故事梗概</div>' +
      '<button class="syn-close" onclick="UI.toggleSynopsis()">✕</button></div>' +
      '<div class="syn-progress"><span class="syn-phase">' + phaseText + '</span><span class="syn-chapter">' + chapterProgress + '</span></div>' +
      '<div class="syn-section-title">角色状态</div><div class="syn-chars">' + charHtml + '</div>' +
      '<div class="syn-section-title">剧情回顾</div><div class="syn-entries">' + synHtml + '</div>' +
      choiceHtml + diceHtml;
  },

  _showTapHint() {
    if (UI.els.tapHint) {
      UI.els.tapHint.classList.add('show');
      setTimeout(function() { UI.els.tapHint.classList.remove('show'); }, 1500);
    }
  },

  // ============================================================
  // 心理过程展示 (可折叠)
  // ============================================================
  showThinkingProcess(process) {
    return new Promise(function(resolve) {
      var char = CHARACTERS[process.charId];
      var trigram = process.yijingReading.trigram;
      var shiftHtml = process.yijingReading.shift
        ? '<div class="tp-shift">⚡ 卦象变动：' + PsychologyModel.TRIGRAMS[process.yijingReading.shift.from].name + ' → ' + PsychologyModel.TRIGRAMS[process.yijingReading.shift.to].name + '</div>'
        : '';

      // 认知功能步骤
      var cogHtml = process.cognitiveProcess.map(function(s) {
        return '<div class="tp-cog-step ' + (s.active ? 'active' : 'dim') + '">' +
          '<span class="tp-cog-label">[' + s.label + '] ' + s.func + '</span> ' +
          '<span class="tp-cog-name">' + s.name + '</span> ' +
          '<span class="tp-cog-roll">🎲' + s.roll + '</span>' +
          (s.active ? ' — ' + s.desc : '') + '</div>';
      }).join('');

      var div = document.createElement('div');
      div.className = 'story-beat thinking-process';
      div.innerHTML =
        '<div class="tp-header" style="border-color:' + process.charColor + '">' +
          '<span class="tp-toggle" onclick="this.closest(\'.thinking-process\').classList.toggle(\'collapsed\')">▼</span>' +
          '<span class="tp-char-name" style="color:' + process.charColor + '">' + process.charName + '</span>' +
          '<span class="tp-label">· 心理过程</span>' +
        '</div>' +
        '<div class="tp-body">' +
          '<div class="tp-row tp-perception"><span class="tp-icon">👁</span><span class="tp-tag">感知</span>' + process.perception + '</div>' +
          '<div class="tp-row tp-emotion"><span class="tp-icon">💭</span><span class="tp-tag">情感</span>' + process.emotionalResponse + '</div>' +
          '<div class="tp-row tp-id"><span class="tp-icon">🔥</span><span class="tp-tag">本我</span><span class="tp-roll">🎲' + process.idRoll + '</span> ' + process.idImpulse + '</div>' +
          '<div class="tp-row tp-superego"><span class="tp-icon">⚖️</span><span class="tp-tag">超我</span><span class="tp-roll">🎲' + process.superEgoRoll + '</span> ' + process.superEgoCheck + '</div>' +
          '<div class="tp-row tp-ego"><span class="tp-icon">🧠</span><span class="tp-tag">自我</span><span class="tp-roll">🎲' + process.egoRoll + '</span> ' + process.egoMediation + '</div>' +
          '<div class="tp-section-label">认知功能</div>' +
          '<div class="tp-cog">' + cogHtml + '</div>' +
          '<div class="tp-section-label">易经</div>' +
          '<div class="tp-row tp-yijing"><span class="tp-icon">' + trigram.symbol + '</span>' + process.yijingReading.guidance + '</div>' +
          shiftHtml +
          '<div class="tp-stress-bar"><span>压力 ' + process.stressLevel + '/100</span><div class="tp-stress-fill" style="width:' + process.stressLevel + '%"></div></div>' +
        '</div>';

      UI.els.storyArea.appendChild(div);
      UI._scrollToBottom();
      setTimeout(resolve, 600);
    });
  },

  _scrollToBottom() {
    var el = UI.els.storyArea;
    if (el) { requestAnimationFrame(function() { el.scrollTop = el.scrollHeight; }); }
  }
};
