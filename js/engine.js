// ============================================================
// 金陵劫 - 游戏引擎
// ============================================================

const GameEngine = {
  // 游戏状态
  state: {
    phase: 'title',        // title, mainStory, freePlay, ending
    currentChapter: 0,
    currentBeat: 0,
    characters: {},
    playerChoices: [],
    events: [],
    diceLog: [],
    synopsis: [],            // 故事梗概条目
    factions: {
      sima: { power: 90, alert: 50 },
      murong: { power: 45, alert: 70 },
      qi: { power: 60, alert: 30 }
    },
    playerStats: {
      insight: 0,
      trust_yuwen: 0,
      patience: 0,
      focus: null
    },
    isTyping: false,
    waitingForChoice: false,
    aiGenerating: false,
    mainStoryComplete: false,
    freePlayIntroShown: false,
    aiChapterCount: 0
  },

  // 初始化
  init() {
    for (const [id, char] of Object.entries(CHARACTERS)) {
      this.state.characters[id] = {
        hp: char.hp, maxHp: char.maxHp,
        mp: char.mp, maxMp: char.maxMp,
        location: '长安·乐求汇', status: 'normal'
      };
    }
    this.loadGame();
  },

  // ============================================================
  // 开始游戏 → 直接进入主线
  // ============================================================
  startGame() {
    localStorage.removeItem('jinlingjie_save');
    this.state.phase = 'mainStory';
    this.state.currentChapter = 0;
    this.state.currentBeat = 0;
    this.state.mainStoryComplete = false;
    this.state.freePlayIntroShown = false;
    this.state.aiChapterCount = 0;
    this.state.playerChoices = [];
    this.state.events = [];
    this.state.diceLog = [];
    this.state.synopsis = [];
    UI.hideTitle();
    UI.showGameUI();
    this.playCurrentBeat();
  },

  // 继续游戏(从存档)
  continueGame() {
    if (this.state.phase === 'title') {
      this.startGame();
      return;
    }
    UI.hideTitle();
    UI.showGameUI();
    UI.updateCharacterPanel();
    this.playCurrentBeat();
  },

  // ============================================================
  // 故事梗概系统 — 每章结束时自动记录，玩家随时可查看
  // ============================================================

  // 每章预设的梗概文本
  CHAPTER_SYNOPSIS: {
    ch1: '长安城乐求汇，大掌柜百里继锋、二掌柜司空屹、三掌柜胡斯林威名远扬，黑白两道无人敢犯。',
    ch2: '二月二龙抬头之夜，北地枪神宇文俊突然造访乐求汇。他自称与慕容凯八拜之交，带来丹阳慕容氏的求援消息——司马氏即将对慕容氏动手。',
    ch3: '宇文俊道出金陵局势：司马问刀失踪，司马三立蠢蠢欲动；慕容康苦苦支撑，慕容凯独木难支。三兄弟商议是否南下介入。',
    ch4: '三兄弟决定南下丹阳。途中宇文俊展露枪棒双绝的实力，但百里继锋隐隐察觉其言行中的算计。',
    ch5: '抵达丹阳，慕容康设宴接风。席间暗流涌动，各方势力的探子已经开始行动。姑苏齐氏的齐耀阳主动请缨前来助阵。',
    ch6: '司马三立——司马利、司马礼、司马离联袂出击，试探慕容氏虚实。慕容凯与齐耀阳联手迎敌，一场恶战在所难免。',
    ch7: '大战一触即发。百里继锋运筹帷幄，布下连环计。司空屹与胡斯林各守要冲，宇文俊的真实目的也渐渐浮出水面。',
    ch8: '决战之夜，各方势力齐聚。司马问刀的失踪真相开始揭晓——一切都是一盘更大的棋。',
    ch9: '最终对决。所有伏笔汇聚，每个人都面临命运的抉择。金陵之劫，究竟鹿死谁手？'
  },

  // 记录一条梗概
  addSynopsis(chapterId, text) {
    // 避免重复
    if (this.state.synopsis.find(s => s.id === chapterId)) return;
    this.state.synopsis.push({
      id: chapterId,
      text: text,
      time: Date.now()
    });
  },

  // 获取当前完整梗概数据（供UI读取）
  getSynopsisData() {
    const data = {
      phase: this.state.phase,
      currentChapter: this.state.currentChapter,
      synopsis: this.state.synopsis,
      playerChoices: this.state.playerChoices,
      characters: {},
      diceHighlights: this.state.diceLog.filter(d => d.nat20 || d.nat1).slice(-5)
    };
    // 角色状态
    for (const [id, char] of Object.entries(CHARACTERS)) {
      const s = this.state.characters[id] || {};
      data.characters[id] = {
        name: char.name,
        title: char.title,
        color: char.color,
        hp: s.hp || char.hp,
        maxHp: char.maxHp,
        location: s.location || '未知',
        status: s.status || 'normal'
      };
    }
    return data;
  },

  // ============================================================
  // 播放当前剧情节拍
  // ============================================================
  async playCurrentBeat() {
    if (this.state.phase === 'mainStory') {
      await this.playMainStoryBeat();
    }
  },

  // 播放主线剧情
  async playMainStoryBeat() {
    const chapter = MAIN_STORY[this.state.currentChapter];
    if (!chapter) {
      this.onMainStoryComplete();
      return;
    }

    // 显示章节标题
    if (this.state.currentBeat === 0) {
      await UI.showChapterTitle(chapter.chapter, chapter.title);
    }

    const beat = chapter.beats[this.state.currentBeat];
    if (!beat) {
      // 当前章节所有beat播放完毕
      if (chapter.choices) {
        this.showChoices(chapter.choices);
        return;
      }
      this.nextChapter();
      return;
    }

    await this.executeBeat(beat);
  },

  // ============================================================
  // 执行单个剧情节拍
  // ============================================================
  async executeBeat(beat) {
    this.state.isTyping = true;

    switch (beat.type) {
      case 'narrate':
        await UI.typeText(beat.text, {
          style: beat.style,
          highlight: beat.highlight,
          pause: beat.pause
        });
        break;

      case 'dialog':
        const speaker = beat.speaker ? CHARACTERS[beat.speaker] : null;
        const name = beat.speakerName || (speaker ? speaker.name : '???');
        const color = speaker ? speaker.color : '#aaa';
        await UI.typeDialog(name, beat.text, color, beat.style);
        break;

      case 'dice':
        await this.executeDiceCheck(beat);
        break;

      case 'action':
        await UI.typeText(beat.text, { style: 'action' });
        break;

      case 'pause':
        await this.sleep(beat.duration || 1000);
        break;
    }

    this.state.isTyping = false;
  },

  // ============================================================
  // 执行骰子检定
  // ============================================================
  async executeDiceCheck(beat) {
    const char = CHARACTERS[beat.character];
    if (!char) return;

    await UI.showDicePrompt(beat.desc);

    let result;
    if (beat.forceSuccess) {
      result = DiceSystem.abilityCheck(char, beat.ability, beat.dc);
      result.success = true;
      if (result.roll < beat.dc - DiceSystem.getModifier(char.abilities[beat.ability])) {
        result.roll = beat.dc - DiceSystem.getModifier(char.abilities[beat.ability]) + DiceSystem.roll(4);
        result.total = result.roll + result.modifier;
      }
    } else {
      result = DiceSystem.abilityCheck(char, beat.ability, beat.dc);
    }

    await UI.animateDice(result);
    this.state.diceLog.push(result);

    const text = result.success ? beat.onSuccess : beat.onFail;
    if (text) {
      await UI.typeText(text, { style: result.success ? 'success' : 'fail' });
    }
  },

  // ============================================================
  // 显示玩家选择
  // ============================================================
  showChoices(choiceData) {
    this.state.waitingForChoice = true;
    UI.showChoices(choiceData.prompt, choiceData.options, (choice) => {
      this.onPlayerChoice(choice);
    });
  },

  // 玩家做出选择
  async onPlayerChoice(choice) {
    this.state.waitingForChoice = false;
    this.state.playerChoices.push(choice.id);

    // 应用效果
    if (choice.effect) {
      for (const [key, val] of Object.entries(choice.effect)) {
        if (key in this.state.playerStats) {
          if (typeof this.state.playerStats[key] === 'number') {
            this.state.playerStats[key] += val;
          } else {
            this.state.playerStats[key] = val;
          }
        }
      }
    }

    // 先隐藏选项面板
    UI.hideChoices();

    // 显示玩家选择的文本
    await UI.typeText(`你选择了：${choice.text}`, { style: 'player-choice' });

    this.saveGame();

    // 根据当前阶段决定后续
    if (this.state.phase === 'mainStory') {
      // 主线模式：进入下一章
      await this.sleep(800);
      this.nextChapter();
    } else if (this.state.phase === 'freePlay') {
      // AI续写模式：根据选择继续生成
      await this.sleep(800);
      if (choice.id === 'retry') {
        this.generateAIChapter();
      } else if (choice.id === 'save') {
        this.saveGame();
        await UI.typeText('游戏已保存。点击屏幕继续冒险。', { style: 'system' });
      } else {
        // 正常选择 → 继续AI生成下一段
        this.state.events.push(`玩家选择了：${choice.text}`);
        this.generateAIChapter();
      }
    }
  },

  // ============================================================
  // 章节控制
  // ============================================================
  nextChapter() {
    // 记录当前章节的梗概
    const chapter = MAIN_STORY[this.state.currentChapter];
    if (chapter) {
      const synText = this.CHAPTER_SYNOPSIS[chapter.id] || `第${chapter.chapter}章「${chapter.title}」已完成。`;
      this.addSynopsis(chapter.id, synText);
    }

    this.state.currentChapter++;
    this.state.currentBeat = 0;

    if (this.state.currentChapter >= MAIN_STORY.length) {
      this.onMainStoryComplete();
    } else {
      this.saveGame();
      this.playCurrentBeat();
    }
  },

  // 下一个beat
  nextBeat() {
    if (this.state.isTyping || this.state.waitingForChoice || this.state.aiGenerating) return;
    this.state.currentBeat++;
    this.saveGame();
    this.playCurrentBeat();
  },

  // ============================================================
  // 主线完成 → 进入AI续写模式（只显示一次过渡）
  // ============================================================
  async onMainStoryComplete() {
    if (this.state.mainStoryComplete) {
      // 已经完成过，直接生成AI章节
      this.state.phase = 'freePlay';
      this.generateAIChapter();
      return;
    }

    this.state.mainStoryComplete = true;
    this.state.phase = 'freePlay';

    // 只显示一次"风云再起"过渡
    await UI.showChapterTitle('续', '风云再起');
    await UI.typeText('主线剧情已结束。', { style: 'system' });
    await this.sleep(500);
    await UI.typeText('从现在开始，四位主角将作为独立的AI角色，根据各自的性格和心理状态做出决策。', { style: 'system' });
    await this.sleep(500);
    await UI.typeText('你作为见证者，将在关键时刻做出选择，共同书写这个故事的未来……', { style: 'system' });

    this.state.freePlayIntroShown = true;
    this.saveGame();

    await this.sleep(1500);
    await this.generateAIChapter();
  },

  // ============================================================
  // AI生成新章节（不再重复显示"风云再起"）
  // ============================================================
  async generateAIChapter() {
    this.state.aiGenerating = true;
    UI.showLoading('四位主角正在思考……');

    // 1. 为每位主角掷心理骰子
    const psychResults = {};
    for (const [id, char] of Object.entries(CHARACTERS)) {
      psychResults[id] = DiceSystem.psychologyRoll(char);
    }

    // 2. 显示心理骰子结果
    UI.hideLoading();

    // AI续写章节计数（不再显示"风云再起"标题）
    this.state.aiChapterCount++;
    if (this.state.aiChapterCount > 1) {
      // 第2次及以后只显示分隔线
      await UI.showDivider();
    }

    for (const [id, result] of Object.entries(psychResults)) {
      await UI.showPsychDice(CHARACTERS[id], result);
    }

    UI.showLoading('AI正在续写剧情……');

    // 3. 构建上下文
    const recentEvents = this.state.events.slice(-5).join('\n') || '主线剧情刚刚结束，三兄弟即将从长安出发前往丹阳。';
    const psychSummaries = Object.entries(psychResults).map(([id, r]) => r.summary).join('\n');
    const playerFocus = this.state.playerStats.focus || '整体局势';

    // 4. 调用AI续写
    const response = await AIAgent.continueStory(
      this.state,
      `玩家关注方向: ${playerFocus}\n\n四位主角当前心理状态:\n${psychSummaries}`,
      recentEvents
    );

    UI.hideLoading();
    this.state.aiGenerating = false;

    if (response.error) {
      await UI.typeText(response.text, { style: 'error' });
      this.state.waitingForChoice = true;
      UI.showChoices('AI生成失败', [
        { id: 'retry', text: '🔄 重新生成', effect: {} },
        { id: 'save', text: '💾 保存并退出', effect: {} }
      ], (choice) => {
        this.state.waitingForChoice = false;
        UI.hideChoices();
        this.onPlayerChoice(choice);
      });
      return;
    }

    // 5. 解析并播放AI生成的内容
    const parsed = AIAgent.parseResponse(response.text);
    await this.playAIContent(parsed);
  },

  // 播放AI生成的内容
  async playAIContent(content) {
    // 如果AI返回了章节标题，作为小标题显示（不用全屏覆盖）
    if (content.chapter_title) {
      await UI.showSubTitle(content.chapter_title);
    }

    if (content.beats) {
      for (const beat of content.beats) {
        if (beat.speakerName && !beat.speaker) {
          for (const [id, char] of Object.entries(CHARACTERS)) {
            if (char.name === beat.speakerName) {
              beat.speaker = id;
              break;
            }
          }
        }
        await this.executeBeat(beat);
        await this.sleep(300);
      }
    }

    // 处理骰子检定
    if (content.dice_moments) {
      for (const dm of content.dice_moments) {
        await this.executeDiceCheck({
          character: dm.character,
          ability: dm.ability,
          dc: dm.dc,
          desc: dm.desc,
          onSuccess: dm.onSuccess || '检定成功！',
          onFail: dm.onFail || '检定失败……'
        });
      }
    }

    // 显示选择（AI返回的或默认的）
    if (content.choices && content.choices.options && content.choices.options.length > 0) {
      this.showChoices(content.choices);
    } else {
      this.showChoices({
        prompt: '接下来——',
        options: [
          { id: 'continue', text: '📖 继续观看', effect: {} },
          { id: 'intervene', text: '✋ 作为见证者介入', effect: { intervene: true } }
        ]
      });
    }
  },

  // ============================================================
  // 玩家能力检定(见证者模式)
  // ============================================================
  async playerAbilityCheck(ability, dc, desc) {
    const playerChar = {
      name: '见证者(你)',
      abilities: { STR: 12, DEX: 12, CON: 12, INT: 14, WIS: 14, CHA: 13 }
    };
    const result = DiceSystem.abilityCheck(playerChar, ability, dc);
    await UI.animateDice(result);
    return result;
  },

  // ============================================================
  // 存档/读档
  // ============================================================
  saveGame() {
    try {
      localStorage.setItem('jinlingjie_save', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  },

  loadGame() {
    try {
      const data = localStorage.getItem('jinlingjie_save');
      if (data) {
        const saved = JSON.parse(data);
        Object.assign(this.state, saved);
        return true;
      }
    } catch (e) {
      console.warn('Load failed:', e);
    }
    return false;
  },

  clearSave() {
    localStorage.removeItem('jinlingjie_save');
    location.reload();
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
