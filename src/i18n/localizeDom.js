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
