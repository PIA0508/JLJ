// ============================================================
// 金陵劫 - 骰子系统
// ============================================================
const DiceSystem = {
  d20() { return Math.floor(Math.random() * 20) + 1; },
  roll(sides) { return Math.floor(Math.random() * sides) + 1; },
  getModifier(score) { return Math.floor((score - 10) / 2); },

  abilityCheck(character, ability, dc) {
    const raw = this.d20();
    const score = character.abilities[ability];
    const mod = this.getModifier(score);
    const total = raw + mod;
    const nat20 = raw === 20, nat1 = raw === 1;
    const success = nat20 ? true : (nat1 ? false : total >= dc);
    return {
      roll: raw, modifier: mod, total, nat20, nat1, success, ability,
      abilityName: ABILITY_NAMES[ability], dc,
      detail: `${character.name} [${ABILITY_NAMES[ability]}检定] 🎲${raw}${mod >= 0 ? '+' : ''}${mod} = ${total} vs DC${dc} → ${nat20 ? '大成功！' : nat1 ? '大失败！' : success ? '成功' : '失败'}`
    };
  },

  contestedCheck(char1, ability1, char2, ability2) {
    const r1 = this.abilityCheck(char1, ability1, 0);
    const r2 = this.abilityCheck(char2, ability2, 0);
    const winner = r1.total >= r2.total ? char1 : char2;
    return { roll1: r1, roll2: r2, winner,
      detail: `${char1.name}[${ABILITY_NAMES[ability1]}] 🎲${r1.total} vs ${char2.name}[${ABILITY_NAMES[ability2]}] 🎲${r2.total} → ${winner.name}胜出！`
    };
  },

  psychologyRoll(character) {
    const psych = character.psychology;
    const result = {};
    const details = [];
    for (const [trait, base] of Object.entries(psych)) {
      const roll = this.d20();
      const mod = this.getModifier(base);
      const total = Math.max(1, Math.min(25, roll + mod));
      result[trait] = { base, roll, modifier: mod, total,
        intensity: total >= 18 ? 'extreme' : total >= 14 ? 'high' : total >= 10 ? 'moderate' : total >= 6 ? 'low' : 'minimal'
      };
      details.push(`${PSYCH_NAMES[trait]}: 🎲${roll}${mod >= 0 ? '+' : ''}${mod}=${total}(${result[trait].intensity})`);
    }
    return { character: character.name, traits: result, details, summary: this._psychSummary(character.name, result) };
  },

  _psychSummary(name, traits) {
    const p = [];
    if (traits.courage.intensity === 'extreme') p.push('勇气爆棚，无所畏惧');
    else if (traits.courage.intensity === 'low') p.push('心中犹豫畏缩');
    if (traits.rationality.intensity === 'extreme') p.push('头脑极为清醒');
    else if (traits.rationality.intensity === 'low') p.push('情绪波动，理智减退');
    if (traits.loyalty.intensity === 'extreme') p.push('忠义坚如磐石');
    else if (traits.loyalty.intensity === 'low') p.push('对同伴信任动摇');
    if (traits.ambition.intensity === 'extreme') p.push('野心勃勃');
    if (traits.suspicion.intensity === 'extreme') p.push('疑心极重');
    if (traits.obsession.intensity === 'extreme') p.push('执念深重');
    return `${name}当前心理状态：${p.join('；') || '平稳'}。`;
  },

  attackRoll(attacker, defender) {
    const atkAbility = attacker.abilities.DEX >= attacker.abilities.STR ? 'DEX' : 'STR';
    const atkCheck = this.abilityCheck(attacker, atkAbility, 10 + this.getModifier(defender.abilities.DEX));
    let damage = 0, detail = atkCheck.detail;
    if (atkCheck.success) {
      const baseDmg = this.roll(8) + this.getModifier(attacker.abilities.STR);
      const defReduction = Math.floor(this.getModifier(defender.abilities.CON) / 2);
      damage = Math.max(1, atkCheck.nat20 ? baseDmg * 2 : baseDmg) - Math.max(0, defReduction);
      damage = Math.max(1, damage);
      detail += ` | 造成 ${damage} 点伤害${atkCheck.nat20 ? '(暴击！)' : ''}`;
    }
    return { hit: atkCheck.success, damage, critical: atkCheck.nat20, fumble: atkCheck.nat1, detail };
  }
};
