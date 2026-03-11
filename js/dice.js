// ============================================================
// 金陵劫 - 骰子系统 (DND风格能力骰 + 心理骰)
// ============================================================

const DiceSystem = {
  // 掷d20
  d20() {
    return Math.floor(Math.random() * 20) + 1;
  },

  // 掷任意骰子
  roll(sides) {
    return Math.floor(Math.random() * sides) + 1;
  },

  // 计算能力调整值 (DND规则: (能力值-10)/2 向下取整)
  getModifier(score) {
    return Math.floor((score - 10) / 2);
  },

  // ============================================================
  // 能力检定 (Ability Check)
  // 返回: { roll, modifier, total, nat20, nat1, success, detail }
  // ============================================================
  abilityCheck(character, ability, dc) {
    const raw = this.d20();
    const score = character.abilities[ability];
    const mod = this.getModifier(score);
    const total = raw + mod;
    const nat20 = raw === 20;
    const nat1 = raw === 1;
    const success = nat20 ? true : (nat1 ? false : total >= dc);

    return {
      roll: raw,
      modifier: mod,
      total: total,
      nat20: nat20,
      nat1: nat1,
      success: success,
      ability: ability,
      abilityName: ABILITY_NAMES[ability],
      dc: dc,
      detail: `${character.name} [${ABILITY_NAMES[ability]}检定] 🎲${raw}${mod >= 0 ? '+' : ''}${mod} = ${total} vs DC${dc} → ${nat20 ? '大成功！' : nat1 ? '大失败！' : success ? '成功' : '失败'}`
    };
  },

  // ============================================================
  // 对抗检定 (Contested Check)
  // 两个角色用各自的能力值对抗
  // ============================================================
  contestedCheck(char1, ability1, char2, ability2) {
    const r1 = this.abilityCheck(char1, ability1, 0);
    const r2 = this.abilityCheck(char2, ability2, 0);
    const winner = r1.total >= r2.total ? char1 : char2;

    return {
      roll1: r1, roll2: r2,
      winner: winner,
      detail: `${char1.name}[${ABILITY_NAMES[ability1]}] 🎲${r1.total} vs ${char2.name}[${ABILITY_NAMES[ability2]}] 🎲${r2.total} → ${winner.name}胜出！`
    };
  },

  // ============================================================
  // 心理骰子 (Psychology Dice) - 仅AI主角使用
  // 掷出心理倾向，影响AI决策方向
  // 返回各心理维度的当前状态值
  // ============================================================
  psychologyRoll(character) {
    const psych = character.psychology;
    const result = {};
    const details = [];

    for (const [trait, base] of Object.entries(psych)) {
      const roll = this.d20();
      const mod = this.getModifier(base);
      const total = Math.max(1, Math.min(25, roll + mod));
      result[trait] = {
        base: base,
        roll: roll,
        modifier: mod,
        total: total,
        intensity: total >= 18 ? 'extreme' : total >= 14 ? 'high' : total >= 10 ? 'moderate' : total >= 6 ? 'low' : 'minimal'
      };
      details.push(`${PSYCH_NAMES[trait]}: 🎲${roll}${mod >= 0 ? '+' : ''}${mod}=${total}(${result[trait].intensity})`);
    }

    return {
      character: character.name,
      traits: result,
      details: details,
      // 生成心理状态描述，用于AI prompt
      summary: this._psychSummary(character.name, result)
    };
  },

  // 根据心理骰子结果生成自然语言描述
  _psychSummary(name, traits) {
    const parts = [];

    // 勇气
    if (traits.courage.intensity === 'extreme') parts.push('此刻勇气爆棚，无所畏惧');
    else if (traits.courage.intensity === 'high') parts.push('心中勇气充沛');
    else if (traits.courage.intensity === 'low') parts.push('心中有些犹豫畏缩');
    else if (traits.courage.intensity === 'minimal') parts.push('内心恐惧不安');

    // 理智
    if (traits.rationality.intensity === 'extreme') parts.push('头脑极为清醒冷静');
    else if (traits.rationality.intensity === 'high') parts.push('思维清晰');
    else if (traits.rationality.intensity === 'low') parts.push('情绪波动较大，理智减退');
    else if (traits.rationality.intensity === 'minimal') parts.push('几乎被情绪完全支配');

    // 忠义
    if (traits.loyalty.intensity === 'extreme') parts.push('忠义之心坚如磐石');
    else if (traits.loyalty.intensity === 'high') parts.push('重情重义');
    else if (traits.loyalty.intensity === 'low') parts.push('对同伴的信任有所动摇');

    // 野心
    if (traits.ambition.intensity === 'extreme') parts.push('野心勃勃，渴望建功立业');
    else if (traits.ambition.intensity === 'high') parts.push('心中暗藏野心');
    else if (traits.ambition.intensity === 'minimal') parts.push('毫无争名夺利之心');

    // 猜疑
    if (traits.suspicion.intensity === 'extreme') parts.push('疑心极重，对一切都保持警惕');
    else if (traits.suspicion.intensity === 'high') parts.push('心存戒备');
    else if (traits.suspicion.intensity === 'minimal') parts.push('对他人毫无防备');

    // 执念
    if (traits.obsession.intensity === 'extreme') parts.push('执念深重，不达目的誓不罢休');
    else if (traits.obsession.intensity === 'high') parts.push('心中有放不下的执念');

    return `${name}当前心理状态：${parts.join('；')}。`;
  },

  // ============================================================
  // 战斗伤害计算
  // ============================================================
  attackRoll(attacker, defender) {
    // 攻击检定
    const atkAbility = attacker.abilities.DEX >= attacker.abilities.STR ? 'DEX' : 'STR';
    const atkCheck = this.abilityCheck(attacker, atkAbility, 10 + this.getModifier(defender.abilities.DEX));

    let damage = 0;
    let detail = atkCheck.detail;

    if (atkCheck.success) {
      // 基础伤害 = d8 + 力量调整值
      const baseDmg = this.roll(8) + this.getModifier(attacker.abilities.STR);
      // 防御减免
      const defReduction = Math.floor(this.getModifier(defender.abilities.CON) / 2);
      damage = Math.max(1, atkCheck.nat20 ? baseDmg * 2 : baseDmg) - Math.max(0, defReduction);
      damage = Math.max(1, damage);
      detail += ` | 造成 ${damage} 点伤害${atkCheck.nat20 ? '(暴击！)' : ''}`;
    }

    return {
      hit: atkCheck.success,
      damage: damage,
      critical: atkCheck.nat20,
      fumble: atkCheck.nat1,
      detail: detail
    };
  }
};
