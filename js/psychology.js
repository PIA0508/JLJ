// ============================================================
// 金陵劫 - 深层心理模型 (精神分析 + 荣格八维 + 易经)
// ============================================================

const PsychologyModel = {

  // ============================================================
  // 荣格八维认知功能
  // ============================================================
  FUNCTIONS: {
    Ni: { name: '内倾直觉', desc: '洞察本质，预见未来，把握隐藏的模式' },
    Ne: { name: '外倾直觉', desc: '发散联想，看到可能性，灵活应变' },
    Si: { name: '内倾感觉', desc: '依赖经验，注重细节，遵循传统' },
    Se: { name: '外倾感觉', desc: '活在当下，敏锐感知，即时反应' },
    Ti: { name: '内倾思维', desc: '逻辑分析，追求内在一致性，独立判断' },
    Te: { name: '外倾思维', desc: '效率导向，组织规划，客观决策' },
    Fi: { name: '内倾情感', desc: '内在价值观，真诚感受，道德直觉' },
    Fe: { name: '外倾情感', desc: '共情他人，维护和谐，社交影响' }
  },

  // ============================================================
  // 易经八卦映射
  // ============================================================
  TRIGRAMS: {
    qian:  { symbol: '☰', name: '乾', nature: '天', virtue: '刚健中正', desc: '天行健，君子以自强不息' },
    kun:   { symbol: '☷', name: '坤', nature: '地', virtue: '厚德载物', desc: '地势坤，君子以厚德载物' },
    zhen:  { symbol: '☳', name: '震', nature: '雷', virtue: '奋发警醒', desc: '洊雷震，君子以恐惧修省' },
    xun:   { symbol: '☴', name: '巽', nature: '风', virtue: '柔顺渗透', desc: '随风巽，君子以申命行事' },
    kan:   { symbol: '☵', name: '坎', nature: '水', virtue: '险中求通', desc: '水洊至，习坎，君子以常德行' },
    li:    { symbol: '☲', name: '离', nature: '火', virtue: '光明附丽', desc: '明两作离，大人以继明照于四方' },
    gen:   { symbol: '☶', name: '艮', nature: '山', virtue: '止而不动', desc: '兼山艮，君子以思不出其位' },
    dui:   { symbol: '☱', name: '兑', nature: '泽', virtue: '喜悦通达', desc: '丽泽兑，君子以朋友讲习' }
  },

  // ============================================================
  // 四位主角 - 深层心理档案
  // ============================================================
  PROFILES: {
    baili: {
      // === 人物小传 ===
      biography: {
        origin: '出身武学世家，自幼习枪。十五岁独闯江湖，十八岁已名震一方。',
        education: '师从隐世高人，不仅学武，更学兵法谋略。博览群书，尤精《孙子兵法》。',
        environment: '见过太多江湖恩怨的惨烈结局，目睹过灭门惨案，深知冲动的代价。',
        keyEvents: [
          '二十岁时因一时大意，导致同门师兄重伤，从此行事极为谨慎',
          '创立乐求汇，以商养武，以智御力，十年未逢败绩',
          '收留司空屹和胡斯林，视为手足，三人结义'
        ],
        behavior: '说话前必三思，从不在愤怒时做决定。习惯性地观察所有人的微表情。'
      },
      // === 荣格八维 (INTJ型) ===
      jung: {
        dominant:  'Ni',  // 主导：内倾直觉 — 洞察全局
        auxiliary: 'Te',  // 辅助：外倾思维 — 高效决策
        tertiary:  'Fi',  // 第三：内倾情感 — 深藏的情义
        inferior:  'Se',  // 劣势：外倾感觉 — 有时忽略眼前细节
        shadow:    'Ne'   // 阴影：外倾直觉 — 压力下会过度联想
      },
      // === 精神分析三层 ===
      freud: {
        id:       30,  // 本我(欲望驱力) — 被压制，很少冲动
        ego:      90,  // 自我(现实调和) — 极强，精于权衡
        superego: 75   // 超我(道德理想) — 强，有坚定的道义感
      },
      // === 易经卦象 ===
      yijing: {
        base: 'qian',      // 本卦：乾 — 天道刚健
        current: 'qian',   // 当前卦象（会随剧情变化）
        changing: null      // 变爻
      },
      // === 核心驱动 ===
      drives: {
        seekBenefit: '守护兄弟和乐求汇的安宁，维护心中的道义',
        avoidPain: '害怕因自己的判断失误导致兄弟受伤或死亡',
        deepFear: '内心深处恐惧自己终将无法保护所有人'
      },
      // === 后天价值观 (优先级排序) ===
      values: ['义', '智', '信', '忠', '勇'],
      valueDesc: '义字当头，但义的定义是"以最小代价保全最多人"。不是莽夫之义，而是智者之义。',
      // === 实时心理状态 ===
      state: {
        emotion: '平静',
        stress: 20,
        confidence: 85,
        trust: { sikong: 95, husilin: 90, yuwen: 35 },
        currentGoals: ['弄清宇文俊的真实目的', '评估南下的风险'],
        suppressedDesires: ['想置身事外，过安稳日子'],
        innerConflict: '道义要求他出手相助，理智告诉他此事凶险万分'
      }
    },

    sikong: {
      biography: {
        origin: '孤儿出身，在街头长大。十二岁被百里继锋救下，从此追随。',
        education: '刀法多为实战自悟，没有正式师承。百里继锋教他读书识字和做人道理。',
        environment: '底层出身让他对弱者有天然同情，对背叛和欺骗极度敏感。',
        keyEvents: [
          '幼年被人贩子拐卖，差点死在矿洞里，被百里继锋所救',
          '十六岁第一次杀人，保护一个被欺负的小贩，从此悟出神经刀',
          '曾被人设计陷害，险些与大哥反目，事后更加珍惜信任'
        ],
        behavior: '对认定的人绝对忠诚，对陌生人保持警惕。情绪来得快去得也快。'
      },
      jung: {
        dominant:  'Fi',  // 内倾情感 — 强烈的内在价值判断
        auxiliary: 'Se',  // 外倾感觉 — 极强的战斗直觉
        tertiary:  'Ni',  // 内倾直觉 — 偶尔的惊人洞察
        inferior:  'Te',  // 外倾思维 — 不擅长系统规划
        shadow:    'Fe'   // 阴影：压力下可能情绪爆发影响他人
      },
      freud: {
        id:       60,  // 本我较强 — 冲动，直觉行事
        ego:      55,  // 自我中等 — 在忠诚和冲动间摇摆
        superego: 80   // 超我很强 — 忠义是最高准则
      },
      yijing: {
        base: 'zhen',     // 震 — 雷，行动力
        current: 'zhen',
        changing: null
      },
      drives: {
        seekBenefit: '获得大哥的认可，保护身边的人',
        avoidPain: '害怕被背叛，害怕失去大哥和三弟',
        deepFear: '内心深处恐惧自己不够强大，无法在关键时刻保护重要的人'
      },
      values: ['忠', '义', '勇', '信', '仁'],
      valueDesc: '大哥说的就是对的。但如果大哥的决定会伤害无辜，他会陷入痛苦的挣扎。',
      state: {
        emotion: '兴奋',
        stress: 15,
        confidence: 75,
        trust: { baili: 100, husilin: 88, yuwen: 25 },
        currentGoals: ['听大哥的安排', '盯紧宇文俊'],
        suppressedDesires: ['想立刻动手试探宇文俊的深浅'],
        innerConflict: '直觉告诉他宇文俊不可信，但大哥似乎在考虑合作'
      }
    },

    husilin: {
      biography: {
        origin: '北方边塞军户之后，父亲战死沙场。十岁起扛枪杀敌。',
        education: '蓝图杆法为家传绝学，另从军中老卒学得百战之术。不识几个字但悟性极高。',
        environment: '边塞苦寒之地长大，见惯生死，养成了豪爽暴烈的性格。',
        keyEvents: [
          '十三岁独杀三名马匪，救下一村老幼，从此被称为"蓝图"',
          '因性格暴烈得罪权贵，被通缉南逃，途中遇到百里继锋',
          '曾因暴怒失手重伤无辜之人，此事成为心中最大的痛'
        ],
        behavior: '说话大嗓门，动辄拍桌子。但对老人孩子异常温柔。喝酒后更加暴烈。'
      },
      jung: {
        dominant:  'Se',  // 外倾感觉 — 活在当下，即时反应
        auxiliary: 'Ti',  // 内倾思维 — 有自己的一套逻辑
        tertiary:  'Fe',  // 外倾情感 — 粗中有细，能感知氛围
        inferior:  'Ni',  // 内倾直觉 — 最弱，不善长远规划
        shadow:    'Si'   // 阴影：压力下会被过去的创伤记忆淹没
      },
      freud: {
        id:       85,  // 本我极强 — 冲动暴烈
        ego:      40,  // 自我较弱 — 容易失控
        superego: 60   // 超我中等 — 有底线但容易被怒火冲破
      },
      yijing: {
        base: 'li',       // 离 — 火，光明但也灼烈
        current: 'li',
        changing: null
      },
      drives: {
        seekBenefit: '痛痛快快地活着，保护弱小，与兄弟并肩作战',
        avoidPain: '害怕窝囊地活着，害怕自己的暴怒伤害无辜',
        deepFear: '恐惧自己终究是个只会杀人的莽夫，无法真正保护想保护的人'
      },
      values: ['勇', '义', '忠', '仁', '信'],
      valueDesc: '宁可站着死，不愿跪着生。但那次误伤无辜后，开始学着克制。',
      state: {
        emotion: '烦躁',
        stress: 30,
        confidence: 80,
        trust: { baili: 92, sikong: 85, yuwen: 15 },
        currentGoals: ['搞清楚到底打不打', '如果打就冲在最前面'],
        suppressedDesires: ['想直接揍宇文俊一顿逼他说实话'],
        innerConflict: '想打架但大哥让他忍耐，憋得难受'
      }
    },

    yuwen: {
      biography: {
        origin: '常山宇文氏嫡系，世家子弟。自幼接受最精英的教育。',
        education: '枪法师从其父宇文渊，棒法得自少林高僧。另精通纵横之术、帝王心术。',
        environment: '世家争斗中长大，从小看惯了笑里藏刀和背后捅刀。',
        keyEvents: [
          '十四岁目睹叔父被族中长老联手逼死，明白了"实力即正义"',
          '与慕容凯结拜，是真心也是布局——他需要南方的盟友',
          '曾为达目的牺牲过一个信任他的朋友，此事是他不愿触碰的伤疤'
        ],
        behavior: '永远面带微笑，说话滴水不漏。越是危险越是从容。独处时偶尔流露疲惫。'
      },
      jung: {
        dominant:  'Fe',  // 外倾情感 — 精于读人、影响人
        auxiliary: 'Ni',  // 内倾直觉 — 深远的战略眼光
        tertiary:  'Se',  // 外倾感觉 — 不错的临场应变
        inferior:  'Ti',  // 内倾思维 — 有时逻辑链条有漏洞
        shadow:    'Fi'   // 阴影：压力下内在价值观会动摇，产生自我怀疑
      },
      freud: {
        id:       50,  // 本我中等 — 有野心但善于隐藏
        ego:      95,  // 自我极强 — 精于算计和伪装
        superego: 35   // 超我较弱 — 道德标准灵活可调
      },
      yijing: {
        base: 'xun',      // 巽 — 风，柔顺渗透
        current: 'xun',
        changing: null
      },
      drives: {
        seekBenefit: '实现宇文氏的复兴大业，成为真正的棋手而非棋子',
        avoidPain: '害怕失去控制权，害怕被人看穿真实意图',
        deepFear: '恐惧自己已经变成了和那些逼死叔父的人一样的怪物'
      },
      values: ['智', '利', '义', '信', '勇'],
      valueDesc: '表面重义，实则以利为先。但对慕容凯的兄弟情有三分真——这三分真是他最大的弱点。',
      state: {
        emotion: '从容',
        stress: 40,
        confidence: 90,
        trust: { baili: 45, sikong: 20, husilin: 15 },
        currentGoals: ['说服三兄弟南下', '在各势力间布局', '保护慕容凯（真心三分）'],
        suppressedDesires: ['想放弃一切算计，做一个简单的人'],
        innerConflict: '利用三兄弟的愧疚感还是真诚以待？前者高效但后者……让他想起年少时的自己'
      }
    }
  },

  // ============================================================
  // 心理决策引擎 — 生成角色的完整思考过程
  // ============================================================
  generateThinkingProcess(charId, situation, diceRolls) {
    const profile = this.PROFILES[charId];
    const char = CHARACTERS[charId];
    if (!profile || !char) return null;

    const jung = profile.jung;
    const freud = profile.freud;
    const state = profile.state;
    const trigram = this.TRIGRAMS[profile.yijing.current];

    // 1. 掷心理骰子 — 决定当前各层的活跃度
    const idRoll = DiceSystem.d20() + DiceSystem.getModifier(freud.id);
    const egoRoll = DiceSystem.d20() + DiceSystem.getModifier(freud.ego);
    const superEgoRoll = DiceSystem.d20() + DiceSystem.getModifier(freud.superego);

    // 2. 掷认知功能骰子
    const funcRolls = {};
    [jung.dominant, jung.auxiliary, jung.tertiary, jung.inferior].forEach((f, i) => {
      const bonus = [6, 3, 0, -3][i]; // 主导>辅助>第三>劣势
      funcRolls[f] = DiceSystem.d20() + bonus;
    });

    // 3. 易经变卦（压力大时卦象可能变化）
    let yijingShift = null;
    if (state.stress > 60) {
      const shiftRoll = DiceSystem.d20();
      if (shiftRoll <= state.stress / 5) {
        const trigrams = Object.keys(this.TRIGRAMS);
        const newTrigram = trigrams[Math.floor(Math.random() * trigrams.length)];
        if (newTrigram !== profile.yijing.current) {
          yijingShift = { from: profile.yijing.current, to: newTrigram };
          profile.yijing.current = newTrigram;
        }
      }
    }

    // 4. 确定主导驱动力
    const dominant = idRoll > egoRoll && idRoll > superEgoRoll ? 'id'
                   : superEgoRoll > egoRoll ? 'superego' : 'ego';

    // 5. 构建思考过程
    const process = {
      charId: charId,
      charName: char.name,
      charColor: char.color,
      situation: situation,

      // 感知层
      perception: this._generatePerception(charId, situation, funcRolls),
      // 情感反应
      emotionalResponse: this._generateEmotionalResponse(charId, situation, state),
      // 本我冲动
      idImpulse: this._generateIdImpulse(charId, idRoll, profile.drives),
      idRoll: idRoll,
      // 超我约束
      superEgoCheck: this._generateSuperEgoCheck(charId, superEgoRoll, profile.values, profile.valueDesc),
      superEgoRoll: superEgoRoll,
      // 自我调和
      egoMediation: this._generateEgoMediation(charId, egoRoll, dominant, state),
      egoRoll: egoRoll,
      // 认知功能处理
      cognitiveProcess: this._generateCognitiveProcess(charId, jung, funcRolls),
      funcRolls: funcRolls,
      // 易经卦象
      yijingReading: {
        trigram: this.TRIGRAMS[profile.yijing.current],
        shift: yijingShift,
        guidance: this._generateYijingGuidance(profile.yijing.current, situation)
      },
      // 最终决策倾向
      dominantDrive: dominant,
      stressLevel: state.stress,
      confidence: state.confidence
    };

    return process;
  },

  // === 感知层 ===
  _generatePerception(charId, situation, funcRolls) {
    const p = this.PROFILES[charId];
    const dom = p.jung.dominant;
    const prompts = {
      Ni: '透过表象看到了隐藏的脉络……',
      Se: '敏锐地捕捉到了当下的每一个细节……',
      Fi: '内心深处涌起了强烈的感受……',
      Fe: '感知到了在场所有人的情绪变化……',
      Ti: '开始在脑中构建逻辑框架……',
      Te: '迅速评估了局势的利弊……',
      Si: '这个场景让他想起了过去的经历……',
      Ne: '脑中闪过了无数种可能性……'
    };
    return prompts[dom] || '正在观察局势……';
  },

  // === 情感反应 ===
  _generateEmotionalResponse(charId, situation, state) {
    const emotions = [];
    if (state.stress > 50) emotions.push('压力沉重');
    if (state.confidence > 70) emotions.push('胸有成竹');
    else if (state.confidence < 40) emotions.push('心中不安');

    // 检查信任关系
    for (const [target, level] of Object.entries(state.trust)) {
      if (level < 30) emotions.push(`对${CHARACTERS[target]?.name || target}心存戒备`);
    }
    return emotions.length > 0 ? emotions.join('，') : state.emotion;
  },

  // === 本我冲动 ===
  _generateIdImpulse(charId, roll, drives) {
    if (roll >= 18) return `强烈的冲动：${drives.seekBenefit}`;
    if (roll >= 14) return `内心渴望：${drives.seekBenefit.substring(0, 15)}……`;
    if (roll <= 5) return `深层恐惧浮现：${drives.deepFear}`;
    if (roll <= 8) return `隐隐的不安：${drives.avoidPain.substring(0, 15)}……`;
    return '本能欲望被理智压制';
  },

  // === 超我约束 ===
  _generateSuperEgoCheck(charId, roll, values, valueDesc) {
    if (roll >= 18) return `道义感极强——"${values[0]}"字当头，绝不退让`;
    if (roll >= 14) return `价值观清晰：${valueDesc.substring(0, 20)}……`;
    if (roll <= 5) return '道德约束暂时松动，利益考量占了上风';
    if (roll <= 8) return '内心的道德标准在动摇……';
    return `遵循"${values[0]}"的原则行事`;
  },

  // === 自我调和 ===
  _generateEgoMediation(charId, roll, dominant, state) {
    const labels = { id: '本能冲动', ego: '理性分析', superego: '道义准则' };
    if (roll >= 18) return `极为冷静地权衡了所有因素，以${labels[dominant]}为主导做出判断`;
    if (roll >= 14) return `在${labels.id}和${labels.superego}之间找到了平衡点`;
    if (roll <= 5) return '内心严重撕裂，难以做出决断';
    if (roll <= 8) return `${labels[dominant]}暂时占了上风，但内心并不平静`;
    return `自我调和中，倾向于${labels[dominant]}`;
  },

  // === 认知功能处理 ===
  _generateCognitiveProcess(charId, jung, funcRolls) {
    const steps = [];
    const funcs = [jung.dominant, jung.auxiliary, jung.tertiary, jung.inferior];
    const labels = ['主导', '辅助', '第三', '劣势'];

    funcs.forEach((f, i) => {
      const roll = funcRolls[f];
      const func = this.FUNCTIONS[f];
      if (roll >= 12 || i < 2) { // 主导和辅助总是显示
        steps.push({
          func: f,
          name: func.name,
          label: labels[i],
          roll: roll,
          active: roll >= 12,
          desc: func.desc
        });
      }
    });
    return steps;
  },

  // === 易经指引 ===
  _generateYijingGuidance(trigramKey, situation) {
    const t = this.TRIGRAMS[trigramKey];
    const guidances = {
      qian: '当以刚健之德应对，不可示弱，但刚而不折方为上策',
      kun: '当以柔顺之道化解，厚积薄发，静待时机',
      zhen: '当果断行动，雷厉风行，但需警惕鲁莽之失',
      xun: '当以柔克刚，如风入隙，不动声色地达成目的',
      kan: '前路凶险，需以诚信之德涉险，不可心存侥幸',
      li: '当明辨是非，以光明正大之态度行事，切忌阴谋',
      gen: '当止则止，不可贪进，静观其变方为上策',
      dui: '当以和悦之态待人，但悦而不失其正'
    };
    return `${t.symbol}${t.name}卦·${t.nature} — ${guidances[trigramKey] || t.desc}`;
  },

  // ============================================================
  // 更新角色心理状态（根据剧情事件）
  // ============================================================
  updateState(charId, event) {
    const profile = this.PROFILES[charId];
    if (!profile) return;
    const s = profile.state;

    switch (event.type) {
      case 'combat':
        s.stress = Math.min(100, s.stress + 15);
        if (charId === 'husilin') s.emotion = '亢奋';
        if (charId === 'baili') s.emotion = '警觉';
        break;
      case 'betrayal':
        s.stress = Math.min(100, s.stress + 30);
        if (event.target) s.trust[event.target] = Math.max(0, (s.trust[event.target] || 50) - 30);
        if (charId === 'sikong') s.emotion = '愤怒';
        break;
      case 'alliance':
        s.stress = Math.max(0, s.stress - 10);
        if (event.target) s.trust[event.target] = Math.min(100, (s.trust[event.target] || 50) + 15);
        break;
      case 'revelation':
        s.stress = Math.min(100, s.stress + 10);
        s.confidence = Math.max(0, s.confidence - 10);
        break;
      case 'victory':
        s.stress = Math.max(0, s.stress - 20);
        s.confidence = Math.min(100, s.confidence + 15);
        s.emotion = '振奋';
        break;
      case 'loss':
        s.stress = Math.min(100, s.stress + 25);
        s.confidence = Math.max(0, s.confidence - 20);
        if (charId === 'husilin') s.emotion = '暴怒';
        else s.emotion = '沉重';
        break;
    }
  },

  // ============================================================
  // 生成供AI使用的心理状态提示词
  // ============================================================
  buildPromptForAI(charId, thinkingProcess) {
    const p = this.PROFILES[charId];
    const char = CHARACTERS[charId];
    const tp = thinkingProcess;
    const trigram = tp.yijingReading.trigram;

    return `【${char.name}的深层心理分析】

[人物小传]
${p.biography.origin} ${p.biography.education}
${p.biography.environment}
行为模式：${p.biography.behavior}

[荣格认知功能 — ${this.FUNCTIONS[p.jung.dominant].name}主导型]
主导功能${p.jung.dominant}(${this.FUNCTIONS[p.jung.dominant].name})：${tp.cognitiveProcess.find(s=>s.func===p.jung.dominant)?.desc || ''}
辅助功能${p.jung.auxiliary}(${this.FUNCTIONS[p.jung.auxiliary].name})

[精神分析]
本我冲动(🎲${tp.idRoll})：${tp.idImpulse}
超我约束(🎲${tp.superEgoRoll})：${tp.superEgoCheck}
自我调和(🎲${tp.egoRoll})：${tp.egoMediation}
当前主导：${tp.dominantDrive === 'id' ? '本能驱动' : tp.dominantDrive === 'superego' ? '道义驱动' : '理性驱动'}

[易经]
${trigram.symbol} ${trigram.name}卦 — ${tp.yijingReading.guidance}
${tp.yijingReading.shift ? `⚡ 卦象变动：${this.TRIGRAMS[tp.yijingReading.shift.from].name} → ${this.TRIGRAMS[tp.yijingReading.shift.to].name}` : ''}

[核心驱动]
趋利：${p.drives.seekBenefit}
避苦：${p.drives.avoidPain}
价值观：${p.values.join(' > ')} — ${p.valueDesc}

[当前状态]
情绪：${p.state.emotion} | 压力：${p.state.stress}/100 | 信心：${p.state.confidence}/100
目标：${p.state.currentGoals.join('；')}
内心冲突：${p.state.innerConflict}
被压抑的欲望：${p.state.suppressedDesires.join('；')}

请严格根据以上心理模型，生成${char.name}在当前情境下的决策。决策必须符合其认知功能类型、价值观优先级和当前心理状态。`;
  }
};
