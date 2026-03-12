// ============================================================
// 金陵劫 - 游戏引擎
// ============================================================
const GameEngine = {
  state: {
    phase: 'title',
    currentChapter: 0, currentBeat: 0,
    characters: {}, playerChoices: [], events: [], diceLog: [], synopsis: [],
    factions: { sima: { power: 90, alert: 50 }, murong: { power: 45, alert: 70 }, qi: { power: 60, alert: 30 } },
    playerStats: { insight: 0, trust_yuwen: 0, patience: 0, focus: null },
    isTyping: false, waitingForChoice: false, aiGenerating: false,
    mainStoryComplete: false, freePlayIntroShown: false, aiChapterCount: 0
  },

  CHAPTER_SYNOPSIS: {
    ch1: '长安城乐求汇，大掌柜百里继锋、二掌柜司空屹、三掌柜胡斯林威名远扬，黑白两道无人敢犯。',
    ch2: '二月二龙抬头之夜，北地枪神宇文俊突然造访乐求汇。他自称与慕容凯八拜之交，带来丹阳慕容氏的求援消息——司马氏即将对慕容氏动手。',
    ch3: '宇文俊道出金陵局势：司马问刀失踪，司马三立蠢蠢欲动；慕容康苦苦支撑，慕容凯独木难支。三兄弟商议是否南下介入。',
    ch4: '三兄弟决定南下丹阳。途中宇文俊展露枪棒双绝的实力，但百里继锋隐隐察觉其言行中的算计。',
    ch5: '抵达丹阳，慕容康设宴接风。席间暗流涌动，各方势力的探子已经开始行动。姑苏齐氏的齐耀阳主动请缨前来助阵。',
    ch6: '司马三立——司马利、司马礼、司马离联袂出击，试探慕容氏虚实。慕容凯与齐耀阳联手迎敌，一场恶战在所难免。'
  },

  init() {
    for (const [id, char] of Object.entries(CHARACTERS)) {
      this.state.characters[id] = { hp: char.hp, maxHp: char.maxHp, mp: char.mp, maxMp: char.maxMp, location: '长安·乐求汇', status: 'normal' };
    }
    this.loadGame();
  },

  startGame() {
    localStorage.removeItem('jinlingjie_save');
    this.state = { phase: 'mainStory', currentChapter: 0, currentBeat: 0, mainStoryComplete: false, freePlayIntroShown: false, aiChapterCount: 0, playerChoices: [], events: [], diceLog: [], synopsis: [], characters: {}, factions: { sima: { power: 90, alert: 50 }, murong: { power: 45, alert: 70 }, qi: { power: 60, alert: 30 } }, playerStats: { insight: 0, trust_yuwen: 0, patience: 0, focus: null }, isTyping: false, waitingForChoice: false, aiGenerating: false };
    for (const [id, char] of Object.entries(CHARACTERS)) this.state.characters[id] = { hp: char.hp, maxHp: char.maxHp, mp: char.mp, maxMp: char.maxMp, location: '长安·乐求汇', status: 'normal' };
    UI.hideTitle(); UI.showGameUI(); this.playCurrentBeat();
  },

  continueGame() {
    if (this.state.phase === 'title') { this.startGame(); return; }
    UI.hideTitle(); UI.showGameUI(); UI.updateCharacterPanel(); this.playCurrentBeat();
  },

  addSynopsis(chapterId, text) {
    if (this.state.synopsis.find(s => s.id === chapterId)) return;
    this.state.synopsis.push({ id: chapterId, text, time: Date.now() });
  },

  getSynopsisData() {
    const data = { phase: this.state.phase, currentChapter: this.state.currentChapter, synopsis: this.state.synopsis, playerChoices: this.state.playerChoices, characters: {}, diceHighlights: this.state.diceLog.filter(d => d.nat20 || d.nat1).slice(-5) };
    for (const [id, char] of Object.entries(CHARACTERS)) {
      const s = this.state.characters[id] || {};
      data.characters[id] = { name: char.name, title: char.title, color: char.color, hp: s.hp || char.hp, maxHp: char.maxHp, location: s.location || '未知', status: s.status || 'normal' };
    }
    return data;
  },

  async playCurrentBeat() {
    if (this.state.phase === 'mainStory') await this.playMainStoryBeat();
  },

  async playMainStoryBeat() {
    const chapter = MAIN_STORY[this.state.currentChapter];
    if (!chapter) { this.onMainStoryComplete(); return; }
    if (this.state.currentBeat === 0) await UI.showChapterTitle(chapter.chapter, chapter.title);
    const beat = chapter.beats[this.state.currentBeat];
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
    const char = CHARACTERS[beat.character]; if (!char) return;
    await UI.showDicePrompt(beat.desc);
    let result;
    if (beat.forceSuccess) {
      result = DiceSystem.abilityCheck(char, beat.ability, beat.dc);
      result.success = true;
      if (result.roll < beat.dc - DiceSystem.getModifier(char.abilities[beat.ability])) {
        result.roll = beat.dc - DiceSystem.getModifier(char.abilities[beat.ability]) + DiceSystem.roll(4);
        result.total = result.roll + result.modifier;
      }
    } else { result = DiceSystem.abilityCheck(char, beat.ability, beat.dc); }
    await UI.animateDice(result);
    this.state.diceLog.push(result);
    const text = result.success ? beat.onSuccess : beat.onFail;
    if (text) await UI.typeText(text, { style: result.success ? 'success' : 'fail' });
  },

  showChoices(choiceData) {
    this.state.waitingForChoice = true;
    UI.showChoices(choiceData.prompt, choiceData.options, (choice) => this.onPlayerChoice(choice));
  },

  async onPlayerChoice(choice) {
    this.state.waitingForChoice = false;
    this.state.playerChoices.push(choice.id);
    if (choice.effect) for (const [key, val] of Object.entries(choice.effect)) if (key in this.state.playerStats) this.state.playerStats[key] = (typeof this.state.playerStats[key] === 'number') ? this.state.playerStats[key] + val : val;
    UI.hideChoices();
    await UI.typeText(`你选择了：${choice.text}`, { style: 'player-choice' });
    this.saveGame();
    if (this.state.phase === 'mainStory') { await this.sleep(800); this.nextChapter(); }
    else if (this.state.phase === 'freePlay') {
      await this.sleep(800);
      if (choice.id === 'retry') this.generateAIChapter();
      else if (choice.id === 'save') { this.saveGame(); await UI.typeText('游戏已保存。点击屏幕继续冒险。', { style: 'system' }); }
      else { this.state.events.push(`玩家选择了：${choice.text}`); this.generateAIChapter(); }
    }
  },

  nextChapter() {
    const chapter = MAIN_STORY[this.state.currentChapter];
    if (chapter) { const synText = this.CHAPTER_SYNOPSIS[chapter.id] || `第${chapter.chapter}章「${chapter.title}」已完成。`; this.addSynopsis(chapter.id, synText); }
    this.state.currentChapter++; this.state.currentBeat = 0;
    if (this.state.currentChapter >= MAIN_STORY.length) this.onMainStoryComplete();
    else { this.saveGame(); this.playCurrentBeat(); }
  },

  nextBeat() {
    if (this.state.isTyping || this.state.waitingForChoice || this.state.aiGenerating) return;
    this.state.currentBeat++; this.saveGame(); this.playCurrentBeat();
  },

  async onMainStoryComplete() {
    if (this.state.mainStoryComplete) { this.state.phase = 'freePlay'; this.generateAIChapter(); return; }
    this.state.mainStoryComplete = true; this.state.phase = 'freePlay';
    await UI.showChapterTitle('续', '风云再起');
    await UI.typeText('主线剧情已结束。', { style: 'system' });
    await this.sleep(500);
    await UI.typeText('从现在开始，四位主角将作为独立的AI角色，根据各自的性格和心理状态做出决策。', { style: 'system' });
    await this.sleep(500);
    await UI.typeText('你作为见证者，将在关键时刻做出选择，共同书写这个故事的未来……', { style: 'system' });
    this.state.freePlayIntroShown = true; this.saveGame();
    await this.sleep(1500); await this.generateAIChapter();
  },

  async generateAIChapter() {
    this.state.aiGenerating = true; UI.showLoading('四位主角正在深度思考……');

    // 1. 为每位主角生成完整心理过程
    const thinkingProcesses = {};
    const situation = this.state.events.slice(-3).join('；') || '宇文俊刚刚抵达乐求汇，提出南下丹阳的请求。';

    for (const [id, char] of Object.entries(CHARACTERS)) {
      thinkingProcesses[id] = PsychologyModel.generateThinkingProcess(id, situation);
    }

    UI.hideLoading();
    this.state.aiChapterCount++;
    if (this.state.aiChapterCount > 1) await UI.showDivider();

    // 2. 展示每位主角的心理过程
    for (const [id, tp] of Object.entries(thinkingProcesses)) {
      if (tp) await UI.showThinkingProcess(tp);
    }

    UI.showLoading('AI正在根据心理分析续写剧情……');

    // 3. 构建AI提示词（包含深层心理分析）
    const psychPrompts = Object.entries(thinkingProcesses)
      .filter(([id, tp]) => tp)
      .map(([id, tp]) => PsychologyModel.buildPromptForAI(id, tp))
      .join('\n\n---\n\n');

    const recentEvents = this.state.events.slice(-5).join('\n') || '主线剧情刚刚结束，三兄弟即将从长安出发前往丹阳。';
    const playerFocus = this.state.playerStats.focus || '整体局势';

    const response = await AIAgent.continueStory(
      this.state,
      `玩家关注方向: ${playerFocus}\n\n【四位主角深层心理分析】\n${psychPrompts}`,
      recentEvents
    );

    UI.hideLoading(); this.state.aiGenerating = false;
    if (response.error) {
      await UI.typeText(response.text, { style: 'error' });
      this.state.waitingForChoice = true;
      UI.showChoices('AI生成失败', [{ id: 'retry', text: '🔄 重新生成', effect: {} }, { id: 'save', text: '💾 保存并退出', effect: {} }], (choice) => { this.state.waitingForChoice = false; UI.hideChoices(); this.onPlayerChoice(choice); });
      return;
    }
    const parsed = AIAgent.parseResponse(response.text); await this.playAIContent(parsed);
  },

  async playAIContent(content) {
    if (content.chapter_title) await UI.showSubTitle(content.chapter_title);
    if (content.beats) for (const beat of content.beats) { if (beat.speakerName && !beat.speaker) for (const [id, char] of Object.entries(CHARACTERS)) if (char.name === beat.speakerName) { beat.speaker = id; break; } await this.executeBeat(beat); await this.sleep(300); }
    if (content.dice_moments) for (const dm of content.dice_moments) await this.executeDiceCheck({ character: dm.character, ability: dm.ability, dc: dm.dc, desc: dm.desc, onSuccess: dm.onSuccess || '检定成功！', onFail: dm.onFail || '检定失败……' });
    if (content.choices && content.choices.options?.length) this.showChoices(content.choices);
    else this.showChoices({ prompt: '接下来——', options: [{ id: 'continue', text: '📖 继续观看', effect: {} }, { id: 'intervene', text: '✋ 作为见证者介入', effect: { intervene: true } }] });
  },

  async playerAbilityCheck(ability, dc, desc) {
    const result = DiceSystem.abilityCheck({ name: '见证者(你)', abilities: { STR: 12, DEX: 12, CON: 12, INT: 14, WIS: 14, CHA: 13 } }, ability, dc);
    await UI.animateDice(result); return result;
  },

  saveGame() { try { localStorage.setItem('jinlingjie_save', JSON.stringify(this.state)); } catch (e) { console.warn('Save failed:', e); } },
  loadGame() { try { const data = localStorage.getItem('jinlingjie_save'); if (data) { const saved = JSON.parse(data); Object.assign(this.state, saved); return true; } } catch (e) { console.warn('Load failed:', e); } return false; },
  clearSave() { localStorage.removeItem('jinlingjie_save'); location.reload(); },
  sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
};
