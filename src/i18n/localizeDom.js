const TEXT_ATTRIBUTES = [
  'title',
  'aria-label',
  'placeholder',
];

const TRANSLATED_FLAG = 'data-cn-original';

const runtime = {
  dictionary: new Map(),
  templates: [],
  phrases: [],
  observer: null,
};

const fallbackEntries = {
  'Combat': '战斗',
  'Skills': '技能',
  'ON': '开启',
  'OFF': '关闭',
  'AFK Popup': '挂机弹窗',
  'Stored Time': '储存时间',
  'Safety Check': '安全确认',
  'Damage Display': '伤害显示',
  'Notafications': '通知',
  'Notifications': '通知',
  'Dimension Teleport': '维度传送',
  'Auto Save': '自动保存',
  'Show popup after returning from offline progress.': '离线进度结算后显示弹窗。',
  'Offline time is stored and can be used later manually.': '离线时间会被储存，之后可手动使用。',
  'Confirmation is required before events are reset.': '重置事件前需要确认。',
  'Displays damage received and dealt on the screen': '在屏幕上显示受到和造成的伤害。',
  'Display a notification window every time a message appears.': '每次出现消息时显示通知窗口。',
  'If you use teleportation, you will automatically enter to the dimension': '使用传送时会自动进入对应维度。',
  'Automatically saves your progress every 30 seconds.': '每 30 秒自动保存进度。',
  'Are you sure you want to reset all progress?': '确定要重置所有进度吗？',
  'Unable to load file: corrupted or invalid format': '无法加载文件：文件已损坏或格式无效',
  'Invalid save file': '无效的存档文件',

  'Notifications ({{0}})': '通知（{{0}}）',
  'Close All': '全部关闭',
  "You've reached the first boss encounter. Learn more in Info Section [Combat Mechanics]": '你已遭遇第一个 Boss。可在信息区[战斗机制]中了解更多。',
  'You complete the Abyss [T0]. Click on icon to leave.': '你已完成深渊[T0]。点击图标离开。',
  'You complete the Abyss [T1]. Click on icon to leave.': '你已完成深渊[T1]。点击图标离开。',
  'You complete the Abyss [T2]. Click on icon to leave.': '你已完成深渊[T2]。点击图标离开。',
  'Celestial is appeared': '天界生物已出现。',
  'Your world has been overwhelmed by an unknown entity. You have discovered corruption. Hover over the icon located in the Progression.': '你的世界已被未知实体侵蚀。你发现了腐化。将鼠标悬停在进度区域的图标上查看说明。',
  'You have harnessed the fundamentals of gravity. You have reached singularity levels. Learn more in the info section [Levels]': '你已掌握重力的基础，抵达奇点等级。可在信息区[等级]中了解更多。',
  "You've left the singularity. There's no need to end it now that it opens. Become stronger and come back to try again.": '你已离开奇点。既然它已经开启，现在无需结束它。变得更强后再回来尝试。',
  'Corruption affects the perception of curses. You unlock Resonance. Learn more in the Amulet section.': '腐化影响了你对诅咒的感知。你解锁了共鸣。可在护符区了解更多。',
  "You've unlocked Free Tree Points. Learn more in the Tree section.": '你已解锁免费技能树点数。可在技能树区了解更多。',
  "You've unlocked Infinity Resistance. Learn more in the Infinity section.": '你已解锁无限抗性。可在无限区了解更多。',
  "You've unlocked Dimension Shards. Hover over the Ascension icon in the Progress section in main dimension": '你已解锁维度碎片。请在主维度的进度区域悬停转生图标查看说明。',
  'You cross the Infinity Line. [D-Infinity] rains down Perditions upon you.': '你跨越了无限之线。[D-无限]向你降下诸般沉沦。',
  "You've unlocked Advanced Curse. Learn more in the Amulet section.": '你已解锁高级诅咒。可在护符区了解更多。',
  'You are under the pressure of Gravity. Reach 70k True Level to gain your first Transcendancy.': '你正承受重力压迫。达到 7万真实等级可获得第一次超越。',
  "You've reach your first Transcendancy. Learn more in the Progress section.": '你已获得第一次超越。可在进度区了解更多。',
  "Under the pressure of gravity you've unlocked Black Hole. Find the Black Hole in D-Atlas.": '在重力压迫下，你解锁了黑洞。可在维度图谱中找到黑洞。',
  "You have reached the dark substance. By entering it, you have opened a passage to other worlds. You've unlocked the dark dimensions.": '你已触及暗物质。进入其中后，你打开了通往其他世界的通道，并解锁了黑暗维度。',
  "By suppressing the power of Infinity, you call upon the mighty force of this world. You've unlocked the Quasar Cores.": '通过压制无限之力，你唤来了这个世界的强大力量，并解锁了类星体核心。',
  "[D-Corruption] reveals himself to this world. Corruption becomes more concentrated, tearing the fabric of space. You've unlocked dimensions affected by [D-Corruption]": '[D-腐化]向这个世界显现。腐化愈发集中，撕裂空间结构。你已解锁受[D-腐化]影响的维度。',
  "Under the influence of gravity, you distort time, creating a temporal rift. You've unlocked Timeline.": '在重力影响下，你扭曲了时间，创造出时间裂隙，并解锁了时间线。',
  'By compressing space to the smallest particle, you create your first singularity shards. Reach Stage 300 in the main dimension to unlock a new Trial.': '通过将空间压缩到最小粒子，你创造了第一枚奇点碎片。在主维度达到关卡300以解锁新的试炼。',
  "You return to your main timeline. You've received the Stone of Law.": '你回到了主时间线，并获得了法则之石。',
  "AUTO TIMELINE has returned to the main timeline. You've received the Stone of Law.": '自动时间线已返回主时间线，并获得了法则之石。',
  '[Laws]: Inventory almost full.': '[法则]：背包即将满。',
  'Mutagen:': '诱变剂：',
  'Mutation [T{{0}}]': '突变[T{{0}}]',
  'Mutation [T1]': '突变[T1]',
  'Mutation [T2]': '突变[T2]',
  'Mutation [T3]': '突变[T3]',
  'Mutation [T4]': '突变[T4]',
  '+0.5% to mutation [T1]': '+0.5% 突变[T1]',
  '+1% to Mutation [T2]': '+1% 突变[T2]',
  '+1.5% to Mutation [T3]': '+1.5% 突变[T3]',
  '+2% to Mutaiton [T4]': '+2% 突变[T4]',
  'Increase mutagen gaining [1]': '诱变剂获取提高[1]',
  '-2 Stage of mutation triger': '突变触发关卡 -2',
  '+1 Potential': '+1 潜能',
  'Unlock Radiation Nodes [Tree]': '解锁辐射节点[技能树]',
  'Unlock 5 Radiation Perks [Ascension]': '解锁 5 个辐射特权[转生]',
  'Souls have no longer Cap': '灵魂不再有上限',
  '+1 DANGER per Level': '每级 +1 危险',
  'Corruption is weaker by 0.02 per Boss killed': '每击杀一个 Boss，腐化削弱 0.02',
  '+1 MAX Level': '+1 最高等级',
  'Reduce the effect of Danger Power': '降低危险之力的效果',
  'Increase the effect of radiation nodes': '提高辐射节点效果',
  '+1 Radiation node choice': '+1 辐射节点选项',
  'Increase mutagen gain depends on stage []': '根据关卡提高诱变剂获取[]',
  'Alpha Burst': '阿尔法爆发',
  'Radionite': '辐射矿',
  'Irradiated Presence': '辐照存在',
  'Crystallized Genome': '结晶基因组',
  'Genetic Overload': '基因过载',
  'Gamma-ray Annihilation': '伽马射线湮灭',
  'Gamma Intensification': '伽马强化',
  'Radiant Choice': '辉光抉择',
  'Adaptive Mutation': '适应性突变',
  'Radiation Perks': '辐射特权',
  'Special Creatures': '特殊生物',
  'Upgrade All': '全部升级',
  'Reset Danger': '重置危险',
  'Except Danger': '危险除外',
  "You won't get mutagens back": '不会返还诱变剂',
  'Lvl: {{0}} / {{1}}': '等级：{{0}} / {{1}}',
  'Upgrade ({{0}} mut)': '升级（{{0}} 诱变剂）',
  'DANGER: [{{0}}]': '危险：[{{0}}]',
  'Enemy Power: [{{0}}]': '敌人强度：[{{0}}]',
};

const phraseEntries = {
  'Ascension Shards': '转生碎片',
  'Ascension Shard': '转生碎片',
  'Rebirth Points': '重生点数',
  'Rebirth Pts': '重生点数',
  'Tree Points': '技能树点数',
  'Void Shards': '虚空碎片',
  'Singularity Shards': '奇点碎片',
  'Law Stone': '法则之石',
  'Timeline Stone': '时间线石',
  'Max Level': '最高等级',
  'Min Level': '最低等级',
  'Base DMG': '基础伤害',
  'Base HP': '基础生命值',
  'Skill EXP': '技能经验',
  'EXP Gain': '经验获取',
  'Equipment Drop Chance': '装备掉落几率',
  'Soul Appearance': '灵魂出现',
  'Soul Appereance': '灵魂出现',
  'Boss Appearance Chance': 'Boss 出现几率',
  'Kill Requirement': '击杀需求',
  'Stage Requirement': '关卡需求',
  'Level Requirement': '等级需求',
  'Infinity Penalty': '无限惩罚',
  'Infinity Resistance': '无限抗性',
  'Quasar Power': '类星体之力',
  'Stardust': '星尘',
  'Mutagen': '诱变剂',
  'Potential': '潜能',
  'Corruption': '腐化',
  'Radiation': '辐射',
  'Infinity': '无限',
  'Ascension': '转生',
  'Rebirth': '重生',
  'Soul': '灵魂',
  'Souls': '灵魂',
  'Equipment': '装备',
  'Amulet': '护符',
  'Curses': '诅咒',
  'Curse': '诅咒',
  'Space': '空间',
  'Tree': '技能树',
  'Buffs': '技能',
  'Buff': '技能',
  'Skills': '技能',
  'Skill': '技能',
  'Damage': '伤害',
  'Health': '生命值',
  'Reward': '奖励',
  'Rewards': '奖励',
  'Requirement': '需求',
  'Completed': '已完成',
  'Locked': '未解锁',
  'Unlocked': '已解锁',
  'Active': '主动',
  'Inactive': '未激活',

  'Advanced Curse': '高级诅咒',
  'Black Hole': '黑洞',
  'D-Infinity': 'D-无限',
  'Infinity Line': '无限之线',
  'Info Section': '信息区',
  'Info section': '信息区',
  'Amulet section': '护符区',
  'Tree section': '技能树区',
  'Infinity section': '无限区',
  'Progress section': '进度区',
  'Combat Mechanics': '战斗机制',
  'D-Atlas': '维度图谱',
  'dark dimensions': '黑暗维度',
  'dark substance': '暗物质',
  'Mutation': '突变',
  'Mutaiton': '突变',
  'mutation': '突变',
  'mutagens': '诱变剂',
  'mutagen': '诱变剂',
  'Danger': '危险',
  'DANGER': '危险',
  'Stage': '关卡',
  'Lvl': '等级',
  'Upgrade': '升级',
};

export async function installChineseLocalization() {
  await loadDictionary();
  prepareTranslations();
  translateDocument();

  runtime.observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        translateTextNode(mutation.target);
        continue;
      }

      for (const node of mutation.addedNodes) {
        translateNode(node);
      }

      if (mutation.type === 'attributes') {
        translateElementAttributes(mutation.target);
      }
    }
  });

  runtime.observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: TEXT_ATTRIBUTES,
  });

  patchDialogs();
}

async function loadDictionary() {
  const response = await fetch(`${import.meta.env.BASE_URL}chs.js`);
  const source = await response.text();
  const parsed = parseCnItems(source);

  for (const [key, value] of Object.entries(fallbackEntries)) {
    parsed[key] = value;
  }

  for (const [key, value] of Object.entries(parsed)) {
    if (!key || !value) continue;
    runtime.dictionary.set(normalizeKey(key), value);
  }
}

function parseCnItems(source) {
  const start = source.indexOf('var cnItems');
  if (start < 0) return {};

  const objectStart = source.indexOf('{', start);
  if (objectStart < 0) return {};

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let index = objectStart; index < source.length; index++) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        const objectLiteral = source.slice(objectStart, index + 1);
        return evaluateObjectLiteral(objectLiteral);
      }
    }
  }

  return {};
}

function evaluateObjectLiteral(objectLiteral) {
  try {
    const items = Function(`"use strict"; return (${objectLiteral});`)();

    return Object.fromEntries(
      Object.entries(items).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[0] : value,
      ])
    );
  } catch (error) {
    console.warn('[i18n] Failed to parse chs.js dictionary.', error);
    return {};
  }
}

function prepareTranslations() {
  runtime.templates = [];

  for (const [key, value] of runtime.dictionary.entries()) {
    if (key.includes('{{')) {
      runtime.templates.push(createTemplateMatcher(key, value));
    }
  }

  runtime.templates = runtime.templates.filter(Boolean);
  runtime.phrases = Object.entries(phraseEntries)
    .sort((a, b) => b[0].length - a[0].length)
    .map(([source, target]) => ({
      source,
      target,
      pattern: new RegExp(escapeRegExp(source), 'gi'),
    }));
}

function createTemplateMatcher(template, replacement) {
  const placeholders = [];
  const source = escapeRegExp(template).replace(/\\\{\\\{([^}]+)\\\}\\\}/g, (_, token) => {
    placeholders.push(token);
    return '([\\s\\S]+?)';
  });

  try {
    return {
      pattern: new RegExp(`^${source}$`, 'i'),
      replacement,
      placeholders,
    };
  } catch {
    return null;
  }
}

function translateDocument() {
  translateNode(document.body);
}

function translateNode(node) {
  if (!node || shouldSkipNode(node)) return;

  if (node.nodeType === Node.TEXT_NODE) {
    translateTextNode(node);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;

  translateElementAttributes(node);

  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(textNode) {
        return shouldSkipNode(textNode) || !hasLatinText(textNode.nodeValue)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  for (const textNode of textNodes) {
    translateTextNode(textNode);
  }
}

function translateTextNode(node) {
  if (shouldSkipNode(node)) return;

  const source = node.nodeValue;
  const translated = translateText(source);

  if (translated !== source) {
    node.nodeValue = translated;
  }
}

function translateElementAttributes(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE || shouldSkipNode(element)) return;

  for (const attr of TEXT_ATTRIBUTES) {
    if (!element.hasAttribute(attr)) continue;

    const original = element.getAttribute(`${TRANSLATED_FLAG}-${attr}`) || element.getAttribute(attr);
    const translated = translateText(original);

    if (translated !== original) {
      element.setAttribute(`${TRANSLATED_FLAG}-${attr}`, original);
      element.setAttribute(attr, translated);
    }
  }
}

function translateText(source) {
  if (!source || !hasLatinText(source)) return source;

  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';
  const body = source.trim();

  if (!body) return source;

  const exact = runtime.dictionary.get(normalizeKey(body));
  if (exact) return `${leading}${exact}${trailing}`;

  const templated = translateTemplate(body);
  if (templated !== body) return `${leading}${templated}${trailing}`;

  const phraseTranslated = translatePhrases(body);
  return `${leading}${phraseTranslated}${trailing}`;
}

function translateTemplate(text) {
  for (const template of runtime.templates) {
    const match = text.match(template.pattern);
    if (!match) continue;

    return template.placeholders.reduce((result, placeholder, index) => {
      const value = translateText(match[index + 1]);
      return result
        .replaceAll(`{{${index}}}`, value)
        .replaceAll(`{{${placeholder}}}`, value);
    }, template.replacement);
  }

  return text;
}

function translatePhrases(text) {
  let result = text;

  for (const phrase of runtime.phrases) {
    result = result.replace(phrase.pattern, phrase.target);
  }

  return result;
}

function patchDialogs() {
  const originalAlert = window.alert.bind(window);
  const originalConfirm = window.confirm.bind(window);

  window.alert = (message) => originalAlert(translateText(String(message)));
  window.confirm = (message) => originalConfirm(translateText(String(message)));
}

function normalizeKey(value) {
  return String(value).trim().toLowerCase();
}

function hasLatinText(value) {
  return /[A-Za-z]/.test(value);
}

function shouldSkipNode(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  if (!element) return false;

  return Boolean(
    element.closest('script, style, noscript, code, pre, input, textarea, select, [data-no-localize]')
  );
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
