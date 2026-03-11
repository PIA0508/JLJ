/*=============================================================
  characters.js — 角色定义
=============================================================*/

var CHARS = {
  /* ========== 四位主角 (AI Agent) ========== */
  baili: {
    id: 'baili', name: '百里继锋', title: '长枪难逃',
    weapon: '长枪', epithet: '剥皮拆骨锅中熬',
    color: '#c9a96e',
    desc: '乐求汇大掌柜，智勇双全，洞察力极强。为人沉稳果断，胸怀天下苍生。',
    ability: { STR: 16, DEX: 15, CON: 14, INT: 18, WIS: 17, CHA: 16 },
    psych:   { AGG: 8, CAU: 16, LOY: 18, PRI: 12, EMP: 15, CUN: 14 },
    role: 'leader'
  },
  sikong: {
    id: 'sikong', name: '司空屹', title: '神经刀',
    weapon: '神经刀', epithet: '司空刀',
    color: '#e74c3c',
    desc: '乐求汇二掌柜，行事稳重素有急智，刀法凌厉。外冷内热，重情重义。',
    ability: { STR: 15, DEX: 17, CON: 15, INT: 15, WIS: 14, CHA: 12 },
    psych:   { AGG: 14, CAU: 13, LOY: 17, PRI: 10, EMP: 12, CUN: 11 },
    role: 'fighter'
  },
  husilin: {
    id: 'husilin', name: '胡斯林', title: '蓝图',
    weapon: '蓝图杆', epithet: '山中恶虎水中蛟',
    color: '#3498db',
    desc: '乐求汇三掌柜，为人坚毅勇决但刚过易折，杀气凛然，武功极高。',
    ability: { STR: 17, DEX: 16, CON: 16, INT: 13, WIS: 11, CHA: 10 },
    psych:   { AGG: 18, CAU: 7, LOY: 16, PRI: 17, EMP: 8, CUN: 9 },
    role: 'berserker'
  },
  yuwen: {
    id: 'yuwen', name: '宇文俊', title: '量天枪',
    weapon: '量天枪（三棱二节白缨枪）', epithet: '北地枪神·枪棒双绝',
    color: '#2ecc71',
    desc: '常山宇文氏，枪棒双绝，为人圆滑善谋。与慕容凯八拜之交，此行暗藏深意。',
    ability: { STR: 16, DEX: 16, CON: 14, INT: 16, WIS: 15, CHA: 17 },
    psych:   { AGG: 10, CAU: 15, LOY: 14, PRI: 13, EMP: 11, CUN: 18 },
    role: 'strategist'
  },

  /* ========== 关键 NPC ========== */
  simajie: {
    id: 'simajie', name: '司马杰', title: '问刀',
    weapon: '问刀', desc: '江东司马氏族长，天下第一用刀高手。韬光养晦二十年，实则处心积虑。',
    ability: { STR: 18, DEX: 17, CON: 16, INT: 19, WIS: 18, CHA: 15 },
    color: '#8e44ad', role: 'npc'
  },
  simali: {
    id: 'simali', name: '司马利', title: '司马三立',
    weapon: '未知', desc: '司马杰子侄辈，善于谋略城府极深，文韬武略不下其祖。',
    ability: { STR: 14, DEX: 15, CON: 14, INT: 17, WIS: 16, CHA: 16 },
    color: '#9b59b6', role: 'npc'
  },
  murongkang: {
    id: 'murongkang', name: '慕容康', title: '慕容氏族长',
    weapon: '未知', desc: '丹阳慕容氏族长，勉强一流水准，运筹帷幄苦撑家业。',
    ability: { STR: 13, DEX: 14, CON: 13, INT: 16, WIS: 17, CHA: 14 },
    color: '#1abc9c', role: 'npc'
  },
  murongkai: {
    id: 'murongkai', name: '慕容凯', title: '无色剑',
    weapon: '无色剑', desc: '慕容康胞弟，当世有数的高手，与司马杰的问刀堪称一时瑜亮。',
    ability: { STR: 16, DEX: 18, CON: 15, INT: 14, WIS: 13, CHA: 13 },
    color: '#16a085', role: 'npc'
  },
  qiyaoyang: {
    id: 'qiyaoyang', name: '齐耀阳', title: '齐氏青年高手',
    weapon: '剑', desc: '姑苏齐家青年高手，性格刚烈正直，不善言辞。',
    ability: { STR: 15, DEX: 16, CON: 14, INT: 12, WIS: 11, CHA: 10 },
    color: '#f39c12', role: 'npc'
  }
};

/* 主角 ID 列表 */
var PROTAGONISTS = ['baili', 'sikong', 'husilin', 'yuwen'];

/* 玩家角色（见证者） */
var PLAYER = {
  id: 'player', name: '见证者', title: '局外之人',
  desc: '你是这场江湖风云的见证者。你的选择将影响局势走向。',
  color: '#f1c40f',
  ability: { STR: 12, DEX: 12, CON: 12, INT: 14, WIS: 14, CHA: 13 }
};
