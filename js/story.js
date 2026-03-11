// ============================================================
// 金陵劫 - 主线剧情脚本
// 每个scene包含: id, chapter, title, beats(剧情节拍), choices(玩家选择)
// beat类型: narrate(叙述), dialog(对话), dice(骰子检定), action(动作), pause(停顿)
// ============================================================

const MAIN_STORY = [

// ======================== 第一章 ========================
{
  id: 'ch1',
  chapter: 1,
  title: '乐求汇',
  beats: [
    { type: 'narrate', text: '长安城。', pause: 800 },
    { type: 'narrate', text: '乐求汇，人头攒动，歌舞升平。' },
    { type: 'narrate', text: '相传能进得乐求汇的客人，不是权倾朝野的达官显贵，就是江湖中一呼百应的侠义之士。' },
    { type: 'narrate', text: '乐求汇从开张的那天开始，黑白两道上门寻衅生事的，不下几十起，但个个铩羽而归。' },
    { type: 'narrate', text: '而乐求汇之所以能在这个龙蛇混杂的环境里左右逢源屹立不倒，全因为他的三个掌柜！' },
    { type: 'narrate', text: '大掌柜——长枪难逃·百里继锋。', speaker: null, highlight: 'baili' },
    { type: 'narrate', text: '二掌柜——神经刀·司空屹。', highlight: 'sikong' },
    { type: 'narrate', text: '三掌柜——蓝图·胡斯林。', highlight: 'husilin' },
    { type: 'narrate', text: '大多上门寻衅之事，二掌柜和三掌柜出手基本就打发了。真正由大掌柜出手解决的，没超过五起。' },
    { type: 'narrate', text: '所以民间相传——', style: 'quote' },
    { type: 'narrate', text: '「胡蓝图、司空刀，山中恶虎水中蛟。\n长枪难逃百里锋，剥皮拆骨锅中熬！」', style: 'poem' },
    { type: 'narrate', text: '而我们的故事，就是从这里开始的……', style: 'fade' },
  ]
},

// ======================== 第二章 ========================
{
  id: 'ch2',
  chapter: 2,
  title: '二月二，龙抬头',
  beats: [
    { type: 'narrate', text: '夜的春雨将青石板路洗成了深黛色，空气中弥漫着清新的味道，不禁让人心情十分的愉快。' },
    { type: 'narrate', text: '司空屹此刻的心情就很愉快，因为昨晚轮他当值，前后收拾了两波不长眼的东西。虽然一宿未合眼，但精神却十分兴奋。再加上刚刚吃了一碗大排骨面和两笼汤包，他甚至觉得就算来一条龙，也能轻松打发了。', speaker: 'sikong' },
    { type: 'narrate', text: '一蓬卷雨被风卷到了屋檐下，也打湿了司空屹的长衫下摆。司空屹低头看了看不禁皱了一下眉。' },
    { type: 'narrate', text: '就在这时，他的眼中突然出现了一双脚。' },
    { type: 'narrate', text: '司空屹已经十余年没有被人近身而不自知过，心中暗吃一惊，慢慢抬起头打量着对方。', style: 'tension' },
    { type: 'dice', character: 'sikong', ability: 'WIS', dc: 15, desc: '司空屹感知检定——察觉来人实力', onSuccess: '司空屹敏锐地察觉到来人气息内敛，绝非等闲之辈。', onFail: '司空屹一时未能看透来人深浅。' },
    { type: 'dialog', speaker: 'sikong', text: '客官来晚了，小店刚刚打烊。' },
    { type: 'narrate', text: '来人年约四旬，普通的长相，寻常的打扮。唯一让人注意的就是他手中拎着的黑匣。' },
    { type: 'narrate', text: '他就像没听到司空屹说的话，径直迈步入店并寻了一张桌子坐了下来，手中的黑匣也随手放在了脚边。' },
    { type: 'narrate', text: '司空屹缓步到桌前，在来人的对面慢慢坐下。' },
    { type: 'dialog', speaker: 'sikong', text: '阁下没听到我说的话吗？莫非是聋子？', style: 'cold' },
    { type: 'narrate', text: '来人微一皱眉。' },
    { type: 'dialog', speaker: 'yuwen', text: '司空屹，去叫你们大掌柜百里继锋来。' },
    { type: 'narrate', text: '司空屹脸色一变，一股锋利的气息便透了出来。', style: 'tension' },
    { type: 'dialog', speaker: 'sikong', text: '不知阁下尊姓大名？找大掌柜到底有何事？' },
    { type: 'narrate', text: '来人抬起头，微微一笑。' },
    { type: 'dialog', speaker: 'yuwen', text: '在下常山宇文俊。' },
    { type: 'narrate', text: '常山宇文氏！司空屹闻言不禁虎躯一震。' },
    { type: 'dialog', speaker: 'sikong', text: '原来阁下便是枪棒双绝，有着北地枪神之称的宇文俊？' },
    { type: 'dialog', speaker: 'yuwen', text: '不敢不敢。在下此番来得匆忙，本该先呈上拜帖才是，但事关重大，还请二掌柜恕罪。' },
    { type: 'narrate', text: '宇文俊满脸堆笑地唱了个肥喏。司空屹被对方这前倨后恭的态度弄得有点摸不着头脑。' },
    { type: 'dialog', speaker: 'sikong', text: '宇文兄请稍候，我这就去请大哥过来一叙。' },
    { type: 'narrate', text: '司空屹吩咐完毕，又朝宇文俊一拱手，径直往后院奔去。' },
  ]
},

// ======================== 第三章 ========================
{
  id: 'ch3',
  chapter: 3,
  title: '杀气',
  beats: [
    { type: 'narrate', text: '刚过中庭，迎面便撞上三掌柜胡斯林。' },
    { type: 'dialog', speaker: 'husilin', text: '二哥，何事这般匆忙？' },
    { type: 'dialog', speaker: 'sikong', text: '有人来找大哥。你去前堂招呼一下。' },
    { type: 'narrate', text: '司空屹口中应着脚下未停，说话间人早已去得远了。' },
    { type: 'dialog', speaker: 'husilin', text: '有人寻大哥麻烦？我倒想看看这是哪家不长眼的东西。', style: 'cold' },
    { type: 'narrate', text: '胡斯林听得不甚明白，琢磨着还有人敢上门找大哥寻仇，冷笑中便奔进了前堂。' },
    { type: 'narrate', text: '宇文俊正端着香茗品茶。心中突然有种被人兜头浇了一盆冰水的感觉。', style: 'tension' },
    { type: 'narrate', text: '这种感觉对他来说再熟悉不过了——那便是杀气。' },
    { type: 'narrate', text: '然后，他看到了一双似乎结了冰的眼睛，而它的主人正一步一步向自己走来。' },
    { type: 'dice', character: 'husilin', ability: 'CHA', dc: 10, desc: '胡斯林威压检定——杀气凝聚', forceSuccess: true, onSuccess: '胡斯林的杀气如实质般笼罩了整个前堂。' },
    { type: 'narrate', text: '他走得很慢，明明和自己相隔还有三丈有余，但他只迈了四步便到了自己的面前。' },
    { type: 'narrate', text: '宇文俊瞳孔一紧。他明白自己已被对方的杀气锁定，精神已产生了幻觉。' },
    { type: 'narrate', text: '自己如果胡乱动作，在气机牵引之下，对方出手必是终极杀招！而不做反击，对方已早占先手，最终自己恐怕只能落败身死。', style: 'tension' },
    { type: 'dice', character: 'yuwen', ability: 'WIS', dc: 16, desc: '宇文俊感知检定——寻找破绽', onSuccess: '宇文俊不愧为当世有数的高手，他敏锐地找到了一丝破绽。', onFail: '宇文俊凭借多年经验，勉强稳住心神。' },
    { type: 'narrate', text: '宇文俊只是把手指一松，手中瓷杯"当"的一声，坠落地面摔得四分五裂。同时默运真气准备伺机反击。' },
    { type: 'narrate', text: '胡斯林正准备突施辣手，却被这"当"的一声吃了一惊，锁定对手的杀气便出现了一丝破绽。' },
    { type: 'narrate', text: '回过神来，发现对方也做出了反击之势，再想凝成杀气却为时已晚。' },
    { type: 'narrate', text: '胡斯林盛怒之下，抽出自己的兵刃"蓝烈"向宇文俊扑去！', style: 'action' },
    { type: 'dice', character: 'husilin', ability: 'STR', dc: 14, desc: '胡斯林力量检定——蓝烈点桌', forceSuccess: true, onSuccess: '胡斯林手中蓝烈点上木桌，瞬间桌子四分五裂，所有碎片都飞向了宇文俊！' },
    { type: 'dice', character: 'yuwen', ability: 'DEX', dc: 15, desc: '宇文俊敏捷检定——长枪拨碎片', onSuccess: '宇文俊长枪急点，所有木片皆成齑粉！这神乎其技的枪法，让胡斯林也大为惊叹！', onFail: '宇文俊虽有几片碎木擦身而过，但量天枪依然将大部分碎片击碎！' },
    { type: 'narrate', text: '偷袭不成便硬碰硬，手底见真章！宇文俊飞身后退并打开黑匣子，迅速接起名为"量天"的三截二节白缨枪。' },
    { type: 'dialog', speaker: 'baili', text: '住手！！', style: 'shout' },
    { type: 'narrate', text: '随着一声大吼，一条身影站在了门口。自是长枪难逃——百里继锋到了！' },
  ]
},

// ======================== 第四章 ========================
{
  id: 'ch4',
  chapter: 4,
  title: '来意',
  beats: [
    { type: 'narrate', text: '前堂很快就被收拾干净。桌子已被换过，四杯香茗也端了上来。宇文俊、百里继锋、司空屹、胡斯林四人围桌而坐。' },
    { type: 'narrate', text: '胡斯林看着宇文俊，眼神中满是挑衅的意思。而宇文俊视而不见，依旧面带微笑。一边的司空屹低着头眼珠子乱转，似乎在思考着什么却又想不明白的样子。而百里继锋则在打量着这个与自己齐名的高手。' },
    { type: 'dialog', speaker: 'baili', text: '宇文兄，请喝茶！', style: 'calm' },
    { type: 'narrate', text: '百里继锋对刚才的冲突之事只字不提。' },
    { type: 'dialog', speaker: 'baili', text: '不知宇文兄寻我何事？' },
    { type: 'narrate', text: '百里继锋直接开门见山。' },
    { type: 'dialog', speaker: 'yuwen', text: '不知百里兄可识得金陵司马杰？' },
    { type: 'dialog', speaker: 'baili', text: '江东司马氏，世人谁不知？司马杰乃是司马氏族的族长，宝刃名曰"问刀"，乃天下第一用刀高手。但我却只闻其名未识其人。' },
    { type: 'dialog', speaker: 'yuwen', text: '但司马杰于五日之前莫名失踪，司马氏全族上下讳口不言，并侦骑频出四方打探却始终不得要领。' },
    { type: 'dialog', speaker: 'baili', text: '哦？司马杰失踪了？' },
    { type: 'dialog', speaker: 'yuwen', text: '是。' },
    { type: 'dice', character: 'baili', ability: 'INT', dc: 12, desc: '百里继锋智力检定——分析宇文俊来意', forceSuccess: true, onSuccess: '百里继锋敏锐地捕捉到了关键疑点。' },
    { type: 'dialog', speaker: 'baili', text: '既然司马全族上下禁言此事，而宇文兄却又如何得知？' },
    { type: 'narrate', text: '百里继锋看似漫不经心的一句，却直击要害。如果宇文俊不能做出合理解释，那他这趟长安行的目的，就颇为耐人寻味。' },
    { type: 'dialog', speaker: 'yuwen', text: '丹阳慕容凯乃是我的八拜之交！' },
    { type: 'narrate', text: '宇文俊剑眉一挑，笑着道出了原委——' },
    { type: 'narrate', text: '丹阳慕容氏由北地迁祸而迁至金陵已有百余年，乃当时金陵第一大门阀。自四十年前司马氏前族长司马兰也将族人迁至这江南佳丽地金陵帝王洲开始，两大门阀便纷争不断。' },
    { type: 'narrate', text: '卧榻之侧岂容他人酣睡？司马家数代在朝为官，当年权倾朝野只手遮天！再加上司马家中高手频出，慕容氏渐渐不敌，最终以司马家占据金陵而慕容全族被迫迁至丹阳郡，以图东山再起而告终。' },
    { type: 'narrate', text: '而慕容凯则是慕容家新进的高手之一，自出道以来身经大小数十战，都未尝一败。手中的"无色"剑与司马杰的"问刀"，堪称一时瑜亮，在江南不做第三人之想！' },
  ]
},

// ======================== 第五章 ========================
{
  id: 'ch5',
  chapter: 5,
  title: '棋局',
  beats: [
    { type: 'dialog', speaker: 'sikong', text: '慕容凯是和你拜了把子。但他司马杰不见了，关我等鸟事？你千里奔波而来就为这？', style: 'angry' },
    { type: 'narrate', text: '司空屹见话不投机，毫不客气地正要发作。' },
    { type: 'dialog', speaker: 'baili', text: '哎，二弟稍安勿躁，且听宇文兄把话说完！' },
    { type: 'narrate', text: '听得百里继锋发话，司空屹也是不敢多言。' },
    { type: 'dialog', speaker: 'yuwen', text: '司空兄息怒，且听小弟一言。司马氏历来嚣张跋扈专权弄政，唯独司马杰领阀主之位后韬光养晦不问世事，这二十年来无论对江湖还是朝政都皆为善事。而今司马杰不知所踪，阀主之位空缺。古话道国不可一日无君。司马家必推一人领阀主之位……' },
    { type: 'dialog', speaker: 'husilin', text: '宇文兄言下之意是——"司马三立"中的司马利会领阀主之位？' },
    { type: 'dialog', speaker: 'yuwen', text: '不错。司马利乃司马杰子侄辈。但此子善于谋略城府极深，且文韬武略亦不下乃祖。少年时曾扬言今生为人当学其祖司马重达，创不世之功才不负此生！' },
    { type: 'dialog', speaker: 'baili', text: '哦？司马家还有这样一个晚辈？看来我不问江湖之事久矣……' },
    { type: 'dialog', speaker: 'yuwen', text: '百里兄何出此言。司马利为人处世极为圆滑，知其内心者皆其心腹。而各位不知实属常情。' },
    { type: 'narrate', text: '宇文俊言到此处，端起香茗品了口，得意之色不予言表。' },
    { type: 'dialog', speaker: 'husilin', text: '宇文兄弟能知道这般明白，你那拜把兄弟功不可没啊！', style: 'sarcastic' },
    { type: 'dialog', speaker: 'yuwen', text: '慕容家死了六个埋伏多年的眼线，才换到的这点消息。如不是为了两家不死不休的世仇，慕容凯岂能这般下血本？' },
    { type: 'dialog', speaker: 'baili', text: '宇文兄，我三兄弟都是痛快人。你兜兜转转说了半天也没说明白此行的来意。' },
    { type: 'narrate', text: '宇文俊一挑他那浓中见清的剑眉。' },
    { type: 'dialog', speaker: 'yuwen', text: '我要你们把司马杰给找出来！生要见人，死要见尸！', style: 'serious' },
  ],
  // 第五章结束时的玩家选择
  choices: {
    prompt: '作为见证者，你对宇文俊的请求有何看法？',
    options: [
      { id: 'trust', text: '🤔 宇文俊所言有理，此事关乎江东百姓安危', effect: { trust_yuwen: 2 } },
      { id: 'doubt', text: '🧐 宇文俊话里有话，恐怕另有图谋', effect: { trust_yuwen: -2, insight: 1 } },
      { id: 'observe', text: '👁️ 静观其变，看三位掌柜如何决断', effect: { patience: 1 } },
    ]
  }
},

// ======================== 第六章 ========================
{
  id: 'ch6',
  chapter: 6,
  title: '示敌以弱',
  beats: [
    { type: 'narrate', text: '后院。百里继锋、司空屹、胡斯林三兄弟密议。' },
    { type: 'dialog', speaker: 'husilin', text: '大哥，你怎么就答应宇文俊了？你我兄弟在此逍遥自在，何苦去管那劳什子事？' },
    { type: 'narrate', text: '百里继锋没有说话。胡斯林继续说道——' },
    { type: 'dialog', speaker: 'husilin', text: '难道你真的相信那小子所说的什么当今高宗皇帝昏庸无道，宦官弄权，明码标价买卖官职，不久必天下大乱？可最终只会苦了百姓。如司马利登上阀主之位，必会与慕容家再生事端。如能寻回司马杰，继续与慕容氏相互制衡维持现状，也能保江东百姓一方平安，少受战乱之苦？' },
    { type: 'dialog', speaker: 'husilin', text: '那宇文俊张嘴就来，满口仁义道德，古之苏秦张仪也不过如此。想那司马杰平时虽韬光养晦为人低调，但他毕竟是司马族长，历来司马族长有几个是省油的灯？且不说他本人乃天下有数的高手，就他身边护卫高手又岂止百人？他不去打杀别人就算是人家祖上有福了，还有人敢去招惹他？你要说他被人偷偷干掉了，我第一个不信！' },
    { type: 'narrate', text: '百里继锋看了看老三，又看向司空屹。' },
    { type: 'dialog', speaker: 'baili', text: '我料到你们会有意见。二弟，说说你的看法。' },
    { type: 'dialog', speaker: 'sikong', text: '我想说的，老三都说过了。我只想问一句——大哥，你真的相信宇文俊的话吗？' },
    { type: 'dice', character: 'baili', ability: 'INT', dc: 14, desc: '百里继锋智力检定——推演全局', forceSuccess: true, onSuccess: '百里继锋目光如炬，一切尽在掌握。' },
    { type: 'narrate', text: '百里继锋目中精光一闪。' },
    { type: 'dialog', speaker: 'baili', text: '咱们做这样一个推测——首先，司马杰失踪后最大的受益者是司马利。他一旦登上阀主之位后当务之急定是清除异己，稳固自己的地位。' },
    { type: 'dialog', speaker: 'baili', text: '按司马利的野心，定是征讨慕容氏。慕容氏如今势微，虽有"无色剑"慕容凯这一级数的高手撑着门面，其阀主慕容康也勉强能达一流水准，但余者皆不足虑。' },
    { type: 'dialog', speaker: 'baili', text: '反观司马家，虽少了问刀司马杰，但司马利、司马礼、司马离这被合称为"司马三立"的三兄弟，他们至少也是慕容康这个级数的好手。其中司马礼尤为扎手，都说此人武技已接近司马问刀，所差的也只是火候而已。' },
    { type: 'dialog', speaker: 'baili', text: '但是，在我看来司马利选择这个时间去灭慕容氏，横看竖看都不是最好的时机。' },
    { type: 'narrate', text: '百里继锋似乎想到了什么，不禁瞳孔一缩。', style: 'tension' },
    { type: 'dialog', speaker: 'baili', text: '我明白了——司马问刀在玩示敌以弱之计！他是假失踪！！', style: 'shout' },
    { type: 'dialog', speaker: 'baili', text: '好个司马问刀，这手示敌以弱玩得真是漂亮！' },
    { type: 'narrate', text: '百里继锋抚掌大笑。' },
    { type: 'dialog', speaker: 'husilin', text: '难道现下的局势，是司马问刀故意营造出来的？' },
    { type: 'dialog', speaker: 'baili', text: '二弟，你明白了吗？' },
    { type: 'dialog', speaker: 'sikong', text: '大哥的意思是——司马问刀处心积虑二十年就在等一个机会。现如今时机成熟，他先以失踪从而退居幕后方便暗中布局。再营造出司马利虽成为阀主，但司马氏族却因内斗而元气大伤的微妙局面。先让其他氏族掉以轻心放松戒备，后再一举将其兼并，稳固自己在江东的根基。日后就可以出兵江东逐鹿中原再次问鼎天下！' },
    { type: 'dialog', speaker: 'baili', text: '对！所谓其他氏族，实是慕容氏。近十年来慕容家不仅人丁单薄而且鲜有高手，反观司马家人才辈出，这一退一进差距立现。' },
    { type: 'dialog', speaker: 'husilin', text: '可慕容家再怎样落得下风，也并非没有一拼之力。况且，与慕容家交好的势力也有不少，危急之时慕容兄弟自可请来助拳。' },
    { type: 'dialog', speaker: 'baili', text: '除了姑苏齐家，其他土鸡瓦犬又有谁敢不看司马家的脸色行事？' },
    { type: 'dialog', speaker: 'husilin', text: '你们说如果两家火并，司马问刀会不会在暗中设伏，截杀其他势力派来的援手？' },
    { type: 'dialog', speaker: 'sikong', text: '不是会不会，可能这才是司马问刀真正的连环计！', style: 'tension' },
    { type: 'dialog', speaker: 'baili', text: '我的直觉告诉我，慕容家很可能看穿了司马问刀的计谋！' },
    { type: 'dialog', speaker: 'sikong', text: '大哥此话怎讲？' },
    { type: 'dialog', speaker: 'baili', text: '宇文俊此行明为江东百姓实为丹阳慕容。我们三兄弟一旦同意东去金陵，慕容家必会造势让司马家投鼠忌器东西不得兼顾……' },
    { type: 'dialog', speaker: 'husilin', text: '但是大哥，咱们东去金陵何止千里？万一慕容家未曾造势便给司马问刀一锅端了，那岂不让人笑掉大牙？' },
    { type: 'dialog', speaker: 'baili', text: '三弟，按我推测，慕容家很可能在几天前就放出我等东来的消息，欲盖弥彰混淆视听。' },
    { type: 'dialog', speaker: 'baili', text: '这样一来，慕容东有姑苏齐家这可解近渴的近水，西边又有我等千里之外的援军，再加上"量天枪"宇文俊助拳，慕容氏实力自是大涨。司马家一心想吞并慕容氏，慕容家何尝不亦是如此？' },
    { type: 'dialog', speaker: 'baili', text: '司马问刀行事一向谨小慎微，此等境况之下只怕唯有重新布局。' },
    { type: 'dialog', speaker: 'husilin', text: '可是大哥，那宇文俊早先为何不直接说明来意？说什么要我们去找司马问刀？阴阳怪气皮里阳秋，甚是讨厌！还有司马家知我等行踪，也可在沿途设伏我们？' },
    { type: 'dialog', speaker: 'baili', text: '三弟，宇文俊与我等素不相识，岂能一见面便全盘托出？如果我没猜错的话，他才是看穿司马问刀计策之人，设计咱们入局的也是他。' },
    { type: 'dialog', speaker: 'baili', text: '至于金陵周边氏族用伏兵之计甚是有效。慕容司马两家一旦发生火并，齐氏必发兵相救，而丹阳郡距姑苏城不过二百余里，齐家的援手可能刚出门，这条情报不出一盏茶的功夫就能送到司马家，司马问刀便可从容用兵。' },
    { type: 'dialog', speaker: 'baili', text: '但对付我们可说是无用之举。首先，咱们东去的道路最少有六七条可以选择。既可取道洛阳出虎牢经寿春由庐州可抵丹阳郡，也可南下宛城从荆州乘船由水路至丹阳郡。这两条道路相隔距离甚远，光在哪条路上设伏就够司马问刀头痛很久了。' },
    { type: 'dialog', speaker: 'baili', text: '万一设伏不成千里来回奔波不说，还白白浪费了这些人手。现大战在即以司马问刀的精明岂会出此昏招？' },
    { type: 'dialog', speaker: 'sikong', text: '大哥，那咱们去还是不去？' },
    { type: 'dialog', speaker: 'husilin', text: '大哥，那咱们去还是不去？' },
    { type: 'dialog', speaker: 'baili', text: '去！为何不去？既然问刀兄下了这样大的一盘棋，我等岂能只当个看客？', style: 'determined' },
    { type: 'narrate', text: '百里继锋微眯着双眼望向东方，眼神中满是期待。' },
  ],
  choices: {
    prompt: '三兄弟即将东行金陵。作为见证者，你选择——',
    options: [
      { id: '陆路', text: '⚔️ 建议走陆路——取道洛阳出虎牢，速度更快', effect: { route: 'land', speed: 1 } },
      { id: '水路', text: '🚢 建议走水路——南下荆州乘船，更为隐蔽', effect: { route: 'water', stealth: 1 } },
      { id: '不干涉', text: '🤐 不发表意见，让他们自己决定', effect: { neutral: 1 } },
    ]
  }
},

// ======================== 第七章 ========================
{
  id: 'ch7',
  chapter: 7,
  title: '分兵',
  beats: [
    { type: 'narrate', text: '长安，乐求汇。' },
    { type: 'dialog', speaker: 'baili', text: '二弟三弟，你二人轻装简从，明日清晨由陆路赶往丹阳。我稍做安排随后就到。' },
    { type: 'dialog', speaker: 'sikong', text: '是，大哥。' },
    { type: 'dialog', speaker: 'baili', text: '沿途需小心谨慎，遇事可留暗号。如无意外，在陈留我便可与你们汇合。' },
    { type: 'dialog', speaker: 'baili', text: '三弟，你为人坚毅勇决但刚过易折，遇事休要冲动，凡事多听二哥的意见。二弟，你行事稳重素有急智，但此行山高水远须万般小心才是。' },
    { type: 'dialog', speaker: 'sikong', text: '大哥，我们省得。' },
    { type: 'dialog', speaker: 'baili', text: '咱们陈留相会！' },
    { type: 'dialog', speaker: 'husilin', text: '好，咱们陈留再见！' },
  ]
},

// ======================== 第八章 ========================
{
  id: 'ch8',
  chapter: 8,
  title: '丹阳·慕容',
  beats: [
    { type: 'narrate', text: '丹阳郡，慕容世家。' },
    { type: 'dialog', speaker: null, speakerName: '慕容凯', text: '大哥，你说宇文兄此行能否成功？' },
    { type: 'narrate', text: '慕容凯看着眉头紧锁的慕容康问道。' },
    { type: 'dialog', speaker: null, speakerName: '慕容康', text: '不好说。' },
    { type: 'narrate', text: '慕容康长身而起，在书桌前习惯性地来回踱步。' },
    { type: 'narrate', text: '慕容凯望着面前大不了自己几岁，却两鬓花白的胞兄，不禁暗自感慨。他很明白，他的兄长自从当了慕容家的族长后，承受了多大的压力。面对咄咄逼人的司马氏，慕容康也是竭尽所能与之周旋，勉强扯成五五之数。' },
    { type: 'dialog', speaker: null, speakerName: '慕容康', text: '那百里继锋颇有智计，宇文兄弟的计策多半会被识破。' },
    { type: 'dialog', speaker: null, speakerName: '慕容凯', text: '什么？' },
    { type: 'dialog', speaker: null, speakerName: '慕容康', text: '但百里继锋他们肯定还是会出手相助。' },
    { type: 'dialog', speaker: null, speakerName: '慕容凯', text: '啊？大哥，这又是为何？' },
    { type: 'dialog', speaker: null, speakerName: '慕容康', text: '这纯粹是一种直觉。' },
    { type: 'dialog', speaker: null, speakerName: '慕容康', text: '阿凯，你马上传令下去。一，金陵城内外所有暗桩每天十二个时辰给我紧盯司马家，有任何风吹草动，第一时间飞鸽传书。二，立刻遣人通知齐天平家主准备随时来援。三，疏散族内老幼妇孺，同时召回外埠好手。备战！' },
    { type: 'dialog', speaker: null, speakerName: '慕容凯', text: '是，大哥！' },
    { type: 'narrate', text: '慕容凯快步退出书房。慕容康满眼山雨欲来。' },
  ]
},

// ======================== 第九章 ========================
{
  id: 'ch9',
  chapter: 9,
  title: '姑苏·齐家',
  beats: [
    { type: 'narrate', text: '姑苏，虎丘，齐氏家族。' },
    { type: 'dialog', speaker: null, speakerName: '齐耀阳', text: '宗主，慕容氏与咱们唇亡齿寒，如今求救，我愿率族内好手前去援手。' },
    { type: 'narrate', text: '族中青年高手齐耀阳向齐天平主动请缨。' },
    { type: 'dialog', speaker: null, speakerName: '大长老', text: '且慢！宗主三思！慕容氏族虽与我齐家数代交好，可近年来犹如冢中枯骨一般。反观司马氏愈发势大强横。虽司马杰不知所踪，可其实力也不是慕容可比。为了慕容而开罪司马，实属不智啊！' },
    { type: 'dialog', speaker: null, speakerName: '齐耀阳', text: '大长老说的哪里话！当年慕容氏与我齐家歃血为盟，现今因惧司马家而背信弃义！那我齐家岂不为世人耻笑？' },
    { type: 'dialog', speaker: null, speakerName: '大长老', text: '乳臭未干的黄口小儿！你懂得什么？此一时彼一时，行事做人当顺势而为之。你逞一时英雄只会为齐家招来灭族之祸！' },
    { type: 'narrate', text: '大长老见诸人附和，手捋长须甚是得意。齐耀阳本就不善言辞，先被大长老一顿抢白又给族人一通奚落，气得双眉倒竖青筋暴起，手按剑柄立时就要发作。' },
    { type: 'narrate', text: '这时，一双柔荑轻轻按住了他的剑柄——' },
    { type: 'dialog', speaker: null, speakerName: '???', text: '耀阳，稍安勿躁！' },
    { type: 'narrate', text: '主线剧情至此告一段落。风云际会，各方势力暗流涌动。接下来的故事，将由四位主角的决策与你的选择共同书写……', style: 'fade' },
  ],
  choices: {
    prompt: '主线剧情结束。作为见证者，你最关注哪条线索？这将影响AI续写的方向——',
    options: [
      { id: 'sima', text: '🗡️ 司马问刀的真正计划——他到底在布什么局？', effect: { focus: 'sima_plot' } },
      { id: 'murong', text: '🛡️ 慕容家的命运——他们能否在这场风暴中存活？', effect: { focus: 'murong_fate' } },
      { id: 'qi', text: '⚔️ 齐家的抉择——那个按住齐耀阳剑柄的人是谁？', effect: { focus: 'qi_mystery' } },
      { id: 'journey', text: '🏔️ 三兄弟的东行之路——陈留会合后将面对什么？', effect: { focus: 'journey' } },
    ]
  }
}

]; // END MAIN_STORY
