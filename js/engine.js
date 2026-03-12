// ============================================================
// 金陵劫 - 游戏引擎
// ============================================================
const GameEngine = {
  state: {
    phase: 'title',
    currentChapter: 0, currentBeat: 0,
    characters: {}, playerChoices: [], events: [], diceLog: [], synopsis: [],
    appearedChars: {},  // 已出场角色记录 { name: { id, name, title, faction, desc, firstChapter } }
    relationships: [],  // 人物关系 [{ from, to, type, desc }]
    factions: { sima: { power: 90, alert: 50 }, murong: { power: 45, alert: 70 }, qi: { power: 60, alert: 30 } },
    playerStats: { insight: 0, trust_yuwen: 0, patience: 0, focus: null },
    isTyping: false, waitingForChoice: false, aiGenerating: false,
    mainStoryComplete: false, freePlayIntroShown: false, aiChapterCount: 0,
    storyHTML: ''  // 保存已显示的故事内容
  },

  CHAPTER_SYNOPSIS: {
    ch1: '长安城乐求汇，大掌柜百里继锋、二掌柜司空屹、三掌柜胡斯林威名远扬，黑白两道无人敢犯。',
    ch2: '二月二龙抬头之夜，一名神秘来客造访乐求汇，司空屹十余年来首次被人近身而不自知。',
    ch3: '来人正是北地枪神宇文俊。胡斯林与宇文俊杀气对峙，一场恶战被百里继锋及时喝止。',
    ch4: '宇文俊道出金陵局势：司马问刀失踪，慕容凯是他八拜之交。他要三兄弟帮忙找出司马杰。',
    ch5: '百里继锋洞察全局，推断司马问刀是假失踪、真布局——示敌以弱的连环计。三兄弟决定东行金陵。',
    ch6: '三兄弟分头出发赶往丹阳。慕容康下令备战，齐家内部因是否援助慕容而激烈争论。'
  },

  // 预设人物关系图
  PRESET_RELATIONS: [
    { from: '百里继锋', to: '司空屹', type: '兄弟', desc: '大哥与二弟，生死之交' },
    { from: '百里继锋', to: '胡斯林', type: '兄弟', desc: '大哥与三弟，生死之交' },
    { from: '司空屹', to: '胡斯林', type: '兄弟', desc: '二哥与三弟' },
    { from: '宇文俊', to: '慕容凯', type: '结义', desc: '八拜之交' },
    { from: '慕容康', to: '慕容凯', type: '兄弟', desc: '胞兄胞弟' },
    { from: '慕容康', to: '司马杰', type: '世仇', desc: '慕容氏与司马氏百年世仇' },
    { from: '司马利', to: '司马杰', type: '族亲', desc: '子侄辈，野心勃勃' },
    { from: '齐天平', to: '慕容康', type: '盟友', desc: '齐氏与慕容氏数代交好' },
    { from: '齐耀阳', to: '齐天平', type: '族人', desc: '族中青年高手' },
  ],

  // 预设出场角色（按剧情出场顺序注册）
  PRESET_CHARS: {
    ch1: [
      { name: '百里继锋', id: 'baili', title: '大掌柜 · 长枪难逃', faction: '乐求汇', desc: '乐求汇大掌柜，运筹帷幄，长枪出神入化。' },
      { name: '司空屹', id: 'sikong', title: '二掌柜 · 神经刀', faction: '乐求汇', desc: '乐求汇二掌柜，性情直率，刀法诡异莫测。' },
      { name: '胡斯林', id: 'husilin', title: '三掌柜 · 蓝图', faction: '乐求汇', desc: '乐求汇三掌柜，刚猛暴烈，杀气凛然。' },
    ],
    ch2: [
      { name: '宇文俊', id: 'yuwen', title: '北地枪神 · 枪棒双绝', faction: '常山宇文氏', desc: '能言善辩，城府极深。与慕容凯八拜之交。' },
    ],
    ch4: [
      { name: '司马杰', id: null, title: '问刀', faction: '金陵司马氏', desc: '司马氏族长，天下第一用刀高手。韬光养晦二十年，近日莫名失踪。' },
      { name: '司马利', id: null, title: '司马三立之首', faction: '金陵司马氏', desc: '司马杰子侄辈，善于谋略城府极深，野心勃勃。' },
      { name: '司马礼', id: null, title: '司马三立', faction: '金陵司马氏', desc: '武技接近司马问刀，所差者火候而已。' },
      { name: '司马离', id: null, title: '司马三立', faction: '金陵司马氏', desc: '司马三立之一。' },
      { name: '慕容凯', id: null, title: '无色剑', faction: '丹阳慕容氏', desc: '慕容家顶梁柱，与司马杰的问刀堪称一时瑜亮。' },
      { name: '慕容康', id: null, title: '慕容氏族长', faction: '丹阳慕容氏', desc: '苦苦支撑慕容家，运筹帷幄能力极强。' },
    ],
    ch6: [
      { name: '齐天平', id: null, title: '齐氏宗主', faction: '姑苏齐氏', desc: '姑苏齐家家主，与慕容氏数代交好。' },
      { name: '齐耀阳', id: null, title: '齐家青年高手', faction: '姑苏齐氏', desc: '性情刚烈，主动请缨援助慕容氏。' },
      { name: '齐家大长老', id: null, title: '齐氏大长老', faction: '姑苏齐氏', desc: '主张顺势而为，反对援助慕容。' },
    ]
  },

  init() {
    for (var id in CHARACTERS) {
      var char = CHARACTERS[id];
      this.state.characters[id] = { hp: char.hp, maxHp: char.maxHp, mp: char.mp, maxMp: char.maxMp, location: '长安·乐求汇', status: 'normal' };
    }
    this.state.relationships = this.PRESET_RELATIONS.slice();
  },

  // ============================================================
  // 存档系统 — 多槽位
  // ============================================================
  saveGame(slot) {
    slot = slot || 0;
    // 保存前快照storyArea内容
    this.state.storyHTML = UI.els.storyArea ? UI.els.storyArea.innerHTML : '';
    // 只保存可序列化的数据，排除运行时标志
    var saveData = {
      version: 2,
      timestamp: Date.now(),
      phase: this.state.phase,
      currentChapter: this.state.currentChapter,
      currentBeat: this.state.currentBeat,
      characters: this.state.characters,
      playerChoices: this.state.playerChoices,
      events: this.state.events,
      diceLog: this.state.diceLog,
      synopsis: this.state.synopsis,
      appearedChars: this.state.appearedChars,
      relationships: this.state.relationships,
      factions: this.state.factions,
      playerStats: this.state.playerStats,
      mainStoryComplete: this.state.mainStoryComplete,
      freePlayIntroShown: this.state.freePlayIntroShown,
      aiChapterCount: this.state.aiChapterCount,
      storyHTML: this.state.storyHTML
    };
    try {
      localStorage.setItem('jlj_save_' + slot, JSON.stringify(saveData));
      return true;
    } catch (e) { console.warn('Save failed:', e); return false; }
  },

  loadGame(slot) {
    slot = slot || 0;
    try {
      var raw = localStorage.getItem('jlj_save_' + slot);
      // 兼容旧存档key
      if (!raw && slot === 0) raw = localStorage.getItem('jinlingjie_save');
      if (!raw) return false;
      var saved = JSON.parse(raw);
      // 合并存档数据到state（不覆盖运行时标志）
      this.state.phase = saved.phase || 'title';
      this.state.currentChapter = saved.currentChapter || 0;
      this.state.currentBeat = saved.currentBeat || 0;
      this.state.characters = saved.characters || this.state.characters;
      this.state.playerChoices = saved.playerChoices || [];
      this.state.events = saved.events || [];
      this.state.diceLog = saved.diceLog || [];
      this.state.synopsis = saved.synopsis || [];
      this.state.appearedChars = saved.appearedChars || {};
      this.state.relationships = saved.relationships || this.PRESET_RELATIONS.slice();
      this.state.factions = saved.factions || this.state.factions;
      this.state.playerStats = saved.playerStats || this.state.playerStats;
      this.state.mainStoryComplete = saved.mainStoryComplete || false;
      this.state.freePlayIntroShown = saved.freePlayIntroShown || false;
      this.state.aiChapterCount = saved.aiChapterCount || 0;
      this.state.storyHTML = saved.storyHTML || '';
      // 确保运行时标志重置
      this.state.isTyping = false;
      this.state.waitingForChoice = false;
      this.state.aiGenerating = false;
      return true;
    } catch (e) { console.warn('Load failed:', e); return false; }
  },

  // 获取所有存档槽位信息
  getSaveSlots() {
    var slots = [];
    for (var i = 0; i < 5; i++) {
      var raw = localStorage.getItem('jlj_save_' + i);
      if (raw) {
        try {
          var d = JSON.parse(raw);
          var date = new Date(d.timestamp);
          var chLabel = d.mainStoryComplete ? 'AI续写' : '第' + (d.currentChapter + 1) + '章';
          slots.push({ slot: i, exists: true, label: chLabel, time: date.toLocaleString(), phase: d.phase });
        } catch (e) { slots.push({ slot: i, exists: false }); }
      } else {
        slots.push({ slot: i, exists: false });
      }
    }
    return slots;
  },

  deleteSave(slot) {
    localStorage.removeItem('jlj_save_' + slot);
    if (slot === 0) localStorage.removeItem('jinlingjie_save');
  },

  clearAllSaves() {
    for (var i = 0; i < 5; i++) localStorage.removeItem('jlj_save_' + i);
    localStorage.removeItem('jinlingjie_save');
    location.reload();
  },

  // ============================================================
  // 开始 / 继续游戏
  // ============================================================
  startGame() {
    this.deleteSave(0);
    // 重置state
    this.state.phase = 'mainStory';
    this.state.currentChapter = 0; this.state.currentBeat = 0;
    this.state.mainStoryComplete = false; this.state.freePlayIntroShown = false; this.state.aiChapterCount = 0;
    this.state.playerChoices = []; this.state.events = []; this.state.diceLog = []; this.state.synopsis = [];
    this.state.appearedChars = {}; this.state.relationships = this.PRESET_RELATIONS.slice();
    this.state.storyHTML = '';
    this.state.isTyping = false; this.state.waitingForChoice = false; this.state.aiGenerating = false;
    for (var id in CHARACTERS) {
      var c = CHARACTERS[id];
      this.state.characters[id] = { hp: c.hp, maxHp: c.maxHp, mp: c.mp, maxMp: c.maxMp, location: '长安·乐求汇', status: 'normal' };
    }
    UI.hideTitle(); UI.showGameUI();
    UI.els.storyArea.innerHTML = '';
    this.registerChapterChars(0);
    this.playCurrentBeat();
  },

  continueGame(slot) {
    slot = slot || 0;
    if (!this.loadGame(slot)) { this.startGame(); return; }
    UI.hideTitle(); UI.showGameUI();
    // 恢复已显示的故事内容
    if (this.state.storyHTML && UI.els.storyArea) {
      UI.els.storyArea.innerHTML = this.state.storyHTML;
      UI._scrollToBottom();
    }
    UI.updateCharacterPanel();
    // 不自动播放下一个beat，等玩家点击
  },

  // ============================================================
  // 注册章节出场角色
  // ============================================================
  registerChapterChars(chapterIndex) {
    var chapter = MAIN_STORY[chapterIndex];
    if (!chapter) return;
    var presets = this.PRESET_CHARS[chapter.id];
    if (presets) {
      for (var i = 0; i < presets.length; i++) {
        var p = presets[i];
        if (!this.state.appearedChars[p.name]) {
          this.state.appearedChars[p.name] = {
            id: p.id, name: p.name, title: p.title, faction: p.faction, desc: p.desc,
            firstChapter: chapter.chapter
          };
        }
      }
    }
  },

  // ============================================================
  // 剧情播放
  // ============================================================
  async playCurrentBeat() {
    if (this.state.phase === 'mainStory') await this.playMainStoryBeat();
  },

  async playMainStoryBeat() {
    var chapter = MAIN_STORY[this.state.currentChapter];
    if (!chapter) { this.onMainStoryComplete(); return; }
    if (this.state.currentBeat === 0) {
      this.registerChapterChars(this.state.currentChapter);
      await UI.showChapterTitle(chapter.chapter, chapter.title);
    }
    var beat = chapter.beats[this.state.currentBeat];
    if (!beat) { this.nextChapter(); return; }
    await this.executeBeat(beat);
  },

  async executeBeat(beat) {
    this.state.isTyping = true;
    switch (beat.type) {
      case 'narrate': await UI.typeText(beat.text, { style: beat.style, highlight: beat.highlight, pause: beat.pause }); break;
      case 'dialog':
        var speaker = beat.speaker ? CHARACTERS[beat.speaker] : null;
        await UI.typeDialog(beat.speakerName || (speaker ? speaker.name : '???'), beat.text, speaker ? speaker.color : '#9a9080', beat.style);
        break;
      case 'scene': await UI.showSceneBanner(beat.location, beat.mood, beat.weather); break;
      case 'entrance': await UI.showEntrance(beat.charId, beat.text); break;
      case 'combat': await UI.showCombatFlash(beat.text); break;
      case 'poem': await UI.showPoem(beat.text); break;
      case 'transition': await UI.showTransition(beat.text); break;
      case 'dice': await this.executeDiceCheck(beat); break;
      case 'action': await UI.typeText(beat.text, { style: 'action' }); break;
      case 'pause': await this.sleep(beat.duration || 1000); break;
    }
    this.state.isTyping = false;
  },

  async executeDiceCheck(beat) {
    var char = CHARACTERS[beat.character]; if (!char) return;
    await UI.showDicePrompt(beat.desc);
    var result = DiceSystem.abilityCheck(char, beat.ability, beat.dc);
    await UI.animateDice(result);
    this.state.diceLog.push(result);
    var text = result.success ? beat.onSuccess : beat.onFail;
    if (text) await UI.typeText(text, { style: result.success ? 'success' : 'fail' });
  },

  // ============================================================
  // 章节 / Beat 控制
  // ============================================================
  nextChapter() {
    var chapter = MAIN_STORY[this.state.currentChapter];
    if (chapter) {
      var synText = this.CHAPTER_SYNOPSIS[chapter.id] || '第' + chapter.chapter + '章「' + chapter.title + '」已完成。';
      this.addSynopsis(chapter.id, synText);
    }
    this.state.currentChapter++;
    this.state.currentBeat = 0;
    if (this.state.currentChapter >= MAIN_STORY.length) this.onMainStoryComplete();
    else { this.saveGame(0); this.playCurrentBeat(); }
  },

  nextBeat() {
    if (this.state.isTyping || this.state.waitingForChoice || this.state.aiGenerating) return;
    this.state.currentBeat++;
    this.playCurrentBeat();
  },

  addSynopsis(chapterId, text) {
    if (this.state.synopsis.find(function(s) { return s.id === chapterId; })) return;
    this.state.synopsis.push({ id: chapterId, text: text, time: Date.now() });
  },

  getSynopsisData() {
    return {
      phase: this.state.phase, currentChapter: this.state.currentChapter,
      synopsis: this.state.synopsis, playerChoices: this.state.playerChoices,
      characters: (function() {
        var out = {};
        for (var id in CHARACTERS) {
          var c = CHARACTERS[id], s = GameEngine.state.characters[id] || {};
          out[id] = { name: c.name, title: c.title, color: c.color, hp: s.hp || c.hp, maxHp: c.maxHp, location: s.location || '未知' };
        }
        return out;
      })(),
      diceHighlights: this.state.diceLog.filter(function(d) { return d.nat20 || d.nat1; }).slice(-5)
    };
  },

  // ============================================================
  // 选择 (AI续写阶段用)
  // ============================================================
  showChoices(choiceData) {
    this.state.waitingForChoice = true;
    UI.showChoices(choiceData.prompt, choiceData.options, function(choice) { GameEngine.onPlayerChoice(choice); });
  },

  onPlayerChoice(choice) {
    this.state.waitingForChoice = false;
    this.state.playerChoices.push(choice.id);
    if (choice.effect) {
      for (var key in choice.effect) {
        if (key in this.state.playerStats) {
          if (typeof this.state.playerStats[key] === 'number') this.state.playerStats[key] += choice.effect[key];
          else this.state.playerStats[key] = choice.effect[key];
        }
      }
    }
    UI.hideChoices();
    UI.typeText('你选择了：' + choice.text, { style: 'player-choice' });
    this.saveGame(0);
    var self = this;
    setTimeout(function() {
      if (self.state.phase === 'freePlay') self.generateAIChapter();
    }, 1500);
  },

  // ============================================================
  // 主线完成 → AI续写
  // ============================================================
  async onMainStoryComplete() {
    if (this.state.mainStoryComplete && this.state.freePlayIntroShown) {
      this.generateAIChapter(); return;
    }
    this.state.mainStoryComplete = true; this.state.phase = 'freePlay';
    if (!this.state.freePlayIntroShown) {
      this.state.freePlayIntroShown = true;
      await UI.showChapterTitle('续', '风云再起');
      await UI.typeText('主线剧情已结束。从现在开始，四位主角将作为独立的AI角色做出决策。你作为见证者，将在关键时刻做出选择，共同书写故事的未来……', { style: 'system' });
      await this.sleep(2000);
    }
    this.generateAIChapter();
  },

  async generateAIChapter() {
    this.state.aiGenerating = true; UI.showLoading('四位主角正在深度思考……');
    var thinkingProcesses = {};
    var situation = this.state.events.slice(-3).join('；') || '宇文俊刚刚抵达乐求汇，提出南下丹阳的请求。';
    for (var id in CHARACTERS) {
      if (typeof PsychologyModel !== 'undefined') thinkingProcesses[id] = PsychologyModel.generateThinkingProcess(id, situation);
    }
    UI.hideLoading();
    this.state.aiChapterCount++;
    if (this.state.aiChapterCount > 1) await UI.showDivider();
    for (var id2 in thinkingProcesses) {
      if (thinkingProcesses[id2] && typeof UI.showThinkingProcess === 'function') await UI.showThinkingProcess(thinkingProcesses[id2]);
    }
    UI.showLoading('AI正在续写剧情……');
    var psychPrompts = '';
    for (var id3 in thinkingProcesses) {
      if (thinkingProcesses[id3] && typeof PsychologyModel !== 'undefined') psychPrompts += PsychologyModel.buildPromptForAI(id3, thinkingProcesses[id3]) + '\n\n---\n\n';
    }
    var recentEvents = this.state.events.slice(-5).join('\n') || '主线剧情刚刚结束。';
    var playerFocus = this.state.playerStats.focus || '整体局势';
    var response = await AIAgent.continueStory(this.state, '玩家关注方向: ' + playerFocus + '\n\n' + psychPrompts, recentEvents);
    UI.hideLoading(); this.state.aiGenerating = false;
    if (response.error) {
      await UI.typeText(response.text, { style: 'error' });
      this.showChoices({ prompt: 'AI生成失败', options: [
        { id: 'retry', text: '🔄 重新生成', effect: {} },
        { id: 'save', text: '💾 保存并退出', effect: {} }
      ]});
      return;
    }
    var parsed = AIAgent.parseResponse(response.text);
    await this.playAIContent(parsed);
  },

  async playAIContent(content) {
    if (content.chapter_title) await UI.showSubTitle(content.chapter_title);
    if (content.beats) {
      for (var i = 0; i < content.beats.length; i++) {
        var beat = content.beats[i];
        if (beat.speakerName && !beat.speaker) {
          for (var id in CHARACTERS) { if (CHARACTERS[id].name === beat.speakerName) { beat.speaker = id; break; } }
        }
        await this.executeBeat(beat);
        await this.sleep(300);
      }
    }
    if (content.dice_moments) {
      for (var j = 0; j < content.dice_moments.length; j++) {
        var dm = content.dice_moments[j];
        await this.executeDiceCheck({ character: dm.character, ability: dm.ability, dc: dm.dc, desc: dm.desc, onSuccess: dm.onSuccess || '成功！', onFail: dm.onFail || '失败……' });
      }
    }
    if (content.choices) this.showChoices(content.choices);
    else this.showChoices({ prompt: '接下来——', options: [
      { id: 'continue', text: '📖 继续观看', effect: {} },
      { id: 'intervene', text: '✋ 作为见证者介入', effect: { intervene: true } }
    ]});
  },

  sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }
};
