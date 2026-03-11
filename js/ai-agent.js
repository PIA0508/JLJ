// ============================================================
// 金陵劫 - AI Agent 系统 (DeepSeek API)
// 四位主角的决策由心理骰子+AI共同驱动
// ============================================================

const AIAgent = {

  // 对话历史(用于上下文)
  history: [],
  // 游戏状态摘要
  gameState: {},

  // ============================================================
  // 调用 DeepSeek API
  // ============================================================
  async callAPI(systemPrompt, userPrompt, maxTokens = 1500) {
    try {
      const resp = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          model: CONFIG.API_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...this.history.slice(-10),
            { role: 'user', content: userPrompt }
          ],
          max_tokens: maxTokens,
          temperature: 0.85,
          top_p: 0.9
        })
      });

      if (!resp.ok) {
        const err = await resp.text();
        console.error('API Error:', err);
        return { error: true, text: '（AI思考中断，请检查网络或API Key）' };
      }

      const data = await resp.json();
      const text = data.choices[0].message.content;

      // 记录历史
      this.history.push({ role: 'user', content: userPrompt });
      this.history.push({ role: 'assistant', content: text });

      // 控制历史长度
      if (this.history.length > 20) {
        this.history = this.history.slice(-16);
      }

      return { error: false, text: text };
    } catch (e) {
      console.error('API Call Failed:', e);
      return { error: true, text: '（网络连接失败，请检查网络）' };
    }
  },

  // ============================================================
  // 世界观系统提示词
  // ============================================================
  getWorldPrompt() {
    return `你是一个古代武侠文字游戏的AI叙事引擎。

【世界观】
时代背景：类似中国古代南北朝时期，朝廷腐败，门阀割据。
核心冲突：金陵司马氏与丹阳慕容氏的百年世仇即将爆发。

【主要势力】
- 乐求汇三掌柜：百里继锋(大掌柜·长枪)、司空屹(二掌柜·神经刀)、胡斯林(三掌柜·蓝图杆)
- 北地枪神宇文俊：与慕容凯八拜之交，精于算计
- 金陵司马氏：族长司马杰(问刀)假失踪布局，司马三立(司马利/礼/离)虎视眈眈
- 丹阳慕容氏：族长慕容康苦苦支撑，慕容凯(无色剑)为顶梁柱
- 姑苏齐氏：与慕容交好，内部分裂(大长老主和，齐耀阳主战)

【写作风格】
- 武侠小说风格，文笔凝练有力
- 对话要符合角色性格，有古风韵味但不晦涩
- 战斗描写要有画面感，招式要有武侠特色
- 情节推进要合理，伏笔要自然
- 每段叙述控制在2-4句话，保持节奏感

【输出格式】
严格按以下JSON格式输出，不要输出其他内容：
{
  "beats": [
    {"type": "narrate", "text": "叙述文本"},
    {"type": "dialog", "speakerName": "角色名", "text": "对话内容"},
    {"type": "action", "text": "动作描写"}
  ],
  "choices": {
    "prompt": "给玩家的选择提示",
    "options": [
      {"id": "选项id", "text": "选项文本", "effect": {}}
    ]
  }
}`;
  },

  // ============================================================
  // AI主角决策 - 根据心理骰子结果生成决策
  // ============================================================
  async makeDecision(character, situation, psychResult, diceResults) {
    const charData = CHARACTERS[character.id] || character;

    const prompt = `【角色决策请求】

角色：${charData.name}（${charData.title}）
性格：${charData.personality}

【当前心理状态】（心理骰子结果）
${psychResult.summary}
详细数值：${psychResult.details.join('、')}

【当前局势】
${situation}

【能力检定结果】
${diceResults ? diceResults.map(d => d.detail).join('\n') : '无'}

请根据该角色的性格特点和当前心理状态，生成该角色在此情境下最可能做出的决策和行动。
输出JSON格式：
{
  "decision": "角色的决策描述",
  "reasoning": "内心独白/思考过程(1-2句)",
  "action": "具体行动",
  "dialog": "角色说的话(如果会说话的话，否则为null)"
}`;

    return await this.callAPI(this.getWorldPrompt(), prompt, 800);
  },

  // ============================================================
  // AI续写剧情 - 主线结束后生成新章节
  // ============================================================
  async continueStory(gameState, playerChoice, recentEvents) {
    const stateDesc = this._buildStateDescription(gameState);

    const prompt = `【剧情续写请求】

【当前游戏状态】
${stateDesc}

【玩家(见证者)的关注方向】
${playerChoice}

【最近发生的事件】
${recentEvents}

请续写接下来的剧情章节。要求：
1. 承接之前的故事线，情节要合理连贯
2. 四位主角（百里继锋、司空屹、胡斯林、宇文俊）都要有戏份
3. 要有至少1-2个需要骰子检定的关键时刻
4. 要给玩家(见证者)提供2-3个选择
5. 章节长度适中，约15-25个beat
6. 要有悬念和转折

严格按JSON格式输出：
{
  "chapter_title": "章节标题",
  "beats": [...],
  "choices": {...},
  "dice_moments": [
    {"character": "角色id", "ability": "能力名", "dc": 数字, "desc": "检定描述"}
  ]
}`;

    return await this.callAPI(this.getWorldPrompt(), prompt, 2500);
  },

  // ============================================================
  // AI生成NPC对话和行为
  // ============================================================
  async generateNPC(npcName, situation) {
    const prompt = `【NPC行为生成】

NPC：${npcName}
${NPCS[npcName] ? `身份：${NPCS[npcName].title}，${NPCS[npcName].desc}` : ''}

当前情境：${situation}

请生成该NPC在此情境下的反应，包括对话和行为。
输出JSON：
{
  "beats": [
    {"type": "dialog", "speakerName": "${npcName}", "text": "..."},
    {"type": "narrate", "text": "..."}
  ]
}`;

    return await this.callAPI(this.getWorldPrompt(), prompt, 600);
  },

  // 构建游戏状态描述
  _buildStateDescription(state) {
    const parts = [];

    // 角色状态
    for (const [id, char] of Object.entries(CHARACTERS)) {
      const s = state.characters?.[id] || {};
      parts.push(`${char.name}: HP${s.hp || char.hp}/${char.maxHp}, 位置:${s.location || '未知'}`);
    }

    // 势力关系
    if (state.factions) {
      parts.push(`\n势力动态: ${JSON.stringify(state.factions)}`);
    }

    // 玩家选择历史
    if (state.playerChoices && state.playerChoices.length > 0) {
      parts.push(`\n玩家历史选择: ${state.playerChoices.join(', ')}`);
    }

    // 关键事件
    if (state.events && state.events.length > 0) {
      parts.push(`\n已发生事件: ${state.events.slice(-5).join(', ')}`);
    }

    return parts.join('\n');
  },

  // 解析AI返回的JSON
  parseResponse(text) {
    try {
      // 尝试提取JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.warn('JSON parse failed, using raw text');
    }
    // 降级：将纯文本转为beats
    return {
      beats: [{ type: 'narrate', text: text }]
    };
  }
};
