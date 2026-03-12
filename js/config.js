// ============================================================
// 金陵劫 - 配置文件
// ============================================================

const CONFIG = {
  API_KEY: 'YOUR_DEEPSEEK_API_KEY',
  API_URL: 'https://api.deepseek.com/v1/chat/completions',
  API_MODEL: 'deepseek-chat',
  TYPEWRITER_SPEED: 40,
  DICE_ANIM_DURATION: 1200,
  AUTO_SAVE_INTERVAL: 60000,
  MAX_HISTORY_TOKENS: 4000,
  DC: { TRIVIAL: 5, EASY: 8, MEDIUM: 12, HARD: 15, VERY_HARD: 18, LEGENDARY: 22 }
};

// ============================================================
// 四位主角
// ============================================================
const CHARACTERS = {
  baili: {
    id: 'baili', name: '百里继锋', title: '大掌柜 · 长枪难逃',
    weapon: '长枪', color: '#c9a96e',
    abilities: { STR: 16, DEX: 14, CON: 15, INT: 18, WIS: 17, CHA: 16 },
    psychology: { courage: 16, rationality: 18, loyalty: 17, ambition: 12, suspicion: 14, obsession: 13 },
    personality: '运筹帷幄，沉稳如山。善于洞察全局，从不轻举妄动。对兄弟情深义重，但绝不感情用事。',
    bio: '乐求汇大掌柜，长枪出神入化。民间相传"长枪难逃百里锋，剥皮拆骨锅中熬"。真正由他出手解决的事端不超过五起，可见其威慑之力。',
    hp: 100, maxHp: 100, mp: 80, maxMp: 80
  },
  sikong: {
    id: 'sikong', name: '司空屹', title: '二掌柜 · 神经刀',
    weapon: '神经刀', color: '#7eb8da',
    abilities: { STR: 15, DEX: 17, CON: 14, INT: 14, WIS: 13, CHA: 12 },
    psychology: { courage: 15, rationality: 13, loyalty: 18, ambition: 10, suspicion: 12, obsession: 11 },
    personality: '性情直率，嫉恶如仇。行事冲动但直觉敏锐，对大哥言听计从。虽不善言辞但心思缜密。',
    bio: '乐求汇二掌柜，神经刀出手诡异莫测。十余年来无人能近身而不被察觉，战斗经验极为丰富。',
    hp: 90, maxHp: 90, mp: 70, maxMp: 70
  },
  husilin: {
    id: 'husilin', name: '胡斯林', title: '三掌柜 · 蓝图',
    weapon: '蓝图杆·蓝烈', color: '#d4726a',
    abilities: { STR: 17, DEX: 16, CON: 16, INT: 13, WIS: 12, CHA: 11 },
    psychology: { courage: 18, rationality: 11, loyalty: 16, ambition: 13, suspicion: 15, obsession: 14 },
    personality: '刚猛暴烈，嫉恶如仇。杀气凛然，出手狠辣。性格直爽但刚过易折，容易被激怒。',
    bio: '乐求汇三掌柜，蓝图杆使得出神入化。杀气之重，连宇文俊这等高手都为之变色。民间相传"胡蓝图、司空刀，山中恶虎水中蛟"。',
    hp: 95, maxHp: 95, mp: 60, maxMp: 60
  },
  yuwen: {
    id: 'yuwen', name: '宇文俊', title: '北地枪神 · 枪棒双绝',
    weapon: '量天枪', color: '#a8d5a2',
    abilities: { STR: 15, DEX: 16, CON: 13, INT: 17, WIS: 15, CHA: 18 },
    psychology: { courage: 14, rationality: 16, loyalty: 14, ambition: 16, suspicion: 13, obsession: 15 },
    personality: '能言善辩，城府极深。表面温文尔雅实则精于算计。为达目的不择手段，但也有自己的底线。',
    bio: '常山宇文氏，枪棒双绝，人称北地枪神。与慕容凯八拜之交。此番千里入长安，名为寻人实为布局。',
    hp: 85, maxHp: 85, mp: 85, maxMp: 85
  }
};

// ============================================================
// 重要NPC
// ============================================================
const NPCS = {
  sima_jie: { name: '司马杰', title: '问刀', faction: '金陵司马氏', desc: '天下第一用刀高手，司马氏族长。韬光养晦二十年，实则深谋远虑。' },
  sima_li: { name: '司马利', title: '司马三立之首', faction: '金陵司马氏', desc: '司马杰侄辈，善于谋略城府极深，文韬武略不下其祖。' },
  sima_li2: { name: '司马礼', title: '司马三立', faction: '金陵司马氏', desc: '武技接近司马问刀，所差者火候而已。' },
  sima_li3: { name: '司马离', title: '司马三立', faction: '金陵司马氏', desc: '司马三立之一，实力不俗。' },
  sima_qiyue: { name: '司马起越', title: '司马族弟', faction: '金陵司马氏', desc: '司马问刀族弟，深不可测。' },
  sima_chaoqun: { name: '司马超群', title: '司马族弟', faction: '金陵司马氏', desc: '司马问刀族弟，深不可测。' },
  murong_kang: { name: '慕容康', title: '慕容氏族长', faction: '丹阳慕容氏', desc: '勉强一流水准，运筹帷幄能力极强。两鬓花白，承受巨大压力。' },
  murong_kai: { name: '慕容凯', title: '无色剑', faction: '丹阳慕容氏', desc: '慕容康胞弟，当世有数的用剑高手。与宇文俊八拜之交。' },
  qi_tianping: { name: '齐天平', title: '齐氏宗主', faction: '姑苏齐氏', desc: '姑苏齐家家主，与慕容氏数代交好。' },
  qi_yaoyang: { name: '齐耀阳', title: '齐家青年高手', faction: '姑苏齐氏', desc: '性情刚烈，主动请缨援助慕容氏。不善言辞但忠义无双。' }
};

const ABILITY_NAMES = { STR: '力量', DEX: '敏捷', CON: '体质', INT: '智力', WIS: '感知', CHA: '魅力' };
const PSYCH_NAMES = { courage: '勇气', rationality: '理智', loyalty: '忠义', ambition: '野心', suspicion: '猜疑', obsession: '执念' };
