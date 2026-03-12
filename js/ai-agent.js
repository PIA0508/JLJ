// ============================================================
// 金陵劫 - AI Agent 系统
// ============================================================
const AIAgent = {
  history: [],
  gameState: {},

  async callAPI(systemPrompt, userPrompt, maxTokens = 1500) {
    try {
      const resp = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.API_KEY}` },
        body: JSON.stringify({
          model: CONFIG.API_MODEL,
          messages: [{ role: 'system', content: systemPrompt }, ...this.history.slice(-10), { role: 'user', content: userPrompt }],
          max_tokens: maxTokens, temperature: 0.85, top_p: 0.9
        })
      });
      if (!resp.ok) { const err = await resp.text(); console.error('API Error:', err); return { error: true, text: '（AI思考中断，请检查网络或API Key）' }; }
      const data = await resp.json();
      const text = data.choices[0].message.content;
      this.history.push({ role: 'user', content: userPrompt }, { role: 'assistant', content: text });
      if (this.history.length > 20) this.history = this.history.slice(-16);
      return { error: false, text: text };
    } catch (e) { console.error('API Call Failed:', e); return { error: true, text: '（网络连接失败）' }; }
  },

  getWorldPrompt() {
    return `你是一个古代武侠文字游戏的AI叙事引擎。
【世界观】时代背景：类似中国古代南北朝时期，朝廷腐败，门阀割据。核心冲突：金陵司马氏与丹阳慕容氏的百年世仇即将爆发。
【主要势力】乐求汇三掌柜、北地枪神宇文俊、金陵司马氏、丹阳慕容氏、姑苏齐氏。
【写作风格】武侠小说风格，文笔凝练有力。对话符合角色性格，有古风韵味。战斗描写有画面感。每段叙述控制在2-4句话。
【输出格式】严格按以下JSON格式输出：
{"beats": [{"type": "narrate", "text": "叙述文本"}, {"type": "dialog", "speakerName": "角色名", "text": "对话内容"}], "choices": {"prompt": "给玩家的选择提示", "options": [{"id": "选项id", "text": "选项文本"}]}}`;
  },

  async makeDecision(character, situation, psychResult, diceResults) {
    const charData = CHARACTERS[character.id] || character;
    const prompt = `【角色决策请求】角色：${charData.name}（${charData.title}）性格：${charData.personality}【当前心理状态】${psychResult.summary}【当前局势】${situation}【能力检定结果】${diceResults ? diceResults.map(d => d.detail).join('\n') : '无'}
请根据该角色的性格特点和当前心理状态，生成该角色在此情境下最可能做出的决策和行动。
输出JSON格式：{"decision": "角色的决策描述", "reasoning": "内心独白", "action": "具体行动", "dialog": "角色说的话"}`;
    return await this.callAPI(this.getWorldPrompt(), prompt, 800);
  },

  async continueStory(gameState, playerChoice, recentEvents) {
    const stateDesc = this._buildStateDescription(gameState);
    const prompt = `【剧情续写请求】
【当前游戏状态】${stateDesc}
【玩家(见证者)的关注方向】${playerChoice}
【最近发生的事件】${recentEvents}
请续写接下来的剧情章节。要求：1.承接之前的故事线，情节合理连贯 2.四位主角都要有戏份 3.要有至少1-2个需要骰子检定的关键时刻 4.要给玩家提供2-3个选择 5.章节长度适中，约15-25个beat 6.要有悬念和转折
严格按JSON格式输出：{"chapter_title": "章节标题", "beats": [...], "choices": {...}, "dice_moments": [{"character": "角色id", "ability": "能力名", "dc": 数字, "desc": "检定描述"}]}`;
    return await this.callAPI(this.getWorldPrompt(), prompt, 2500);
  },

  async generateNPC(npcName, situation) {
    const prompt = `【NPC行为生成】NPC：${npcName} ${NPCS[npcName] ? `身份：${NPCS[npcName].title}，${NPCS[npcName].desc}` : ''}当前情境：${situation}
请生成该NPC在此情境下的反应，包括对话和行为。
输出JSON：{"beats": [{"type": "dialog", "speakerName": "${npcName}", "text": "..."}, {"type": "narrate", "text": "..."}]}`;
    return await this.callAPI(this.getWorldPrompt(), prompt, 600);
  },

  _buildStateDescription(state) {
    const parts = [];
    for (const [id, char] of Object.entries(CHARACTERS)) {
      const s = state.characters?.[id] || {};
      parts.push(`${char.name}: HP${s.hp || char.hp}/${char.maxHp}, 位置:${s.location || '未知'}`);
    }
    if (state.factions) parts.push(`\n势力动态: ${JSON.stringify(state.factions)}`);
    if (state.playerChoices?.length) parts.push(`\n玩家历史选择: ${state.playerChoices.join(', ')}`);
    if (state.events?.length) parts.push(`\n已发生事件: ${state.events.slice(-5).join(', ')}`);
    return parts.join('\n');
  },

  parseResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) { console.warn('JSON parse failed, using raw text'); }
    return { beats: [{ type: 'narrate', text: text }] };
  }
};
