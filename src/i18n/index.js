import { createI18n } from 'vue-i18n';
import zhCN from './zh-CN.js';

export const SUPPORT_LOCALE = 'zh-CN';

export const i18n = createI18n({
  legacy: false,
  locale: SUPPORT_LOCALE,
  fallbackLocale: SUPPORT_LOCALE,
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    [SUPPORT_LOCALE]: zhCN,
  },
});

export function translateEventName(name) {
  return i18n.global.t(`events.${name}`);
}

export function translateRuntime(scope, key, params) {
  const path = `${scope}.${key}`;
  return i18n.global.te(path) ? i18n.global.t(path, params) : key;
}


function getRuntimeMessages() {
  const locale = i18n.global.locale?.value ?? i18n.global.locale ?? SUPPORT_LOCALE;
  return i18n.global.getLocaleMessage(locale)?.runtime ?? {};
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceByBoundary(value, entries) {
  let result = String(value);

  for (const [source, target] of entries) {
    const needsLeadingBoundary = /^[A-Za-z0-9_]/.test(source);
    const needsTrailingBoundary = /[A-Za-z0-9_]$/.test(source);
    const prefix = needsLeadingBoundary ? '(^|[^A-Za-z0-9_])' : '';
    const suffix = needsTrailingBoundary ? '(?=$|[^A-Za-z0-9_])' : '';
    result = result.replace(new RegExp(`${prefix}${escapeRegExp(source)}${suffix}`, 'g'), (...args) => {
      const leading = needsLeadingBoundary ? args[1] : '';
      return `${leading}${target}`;
    });
  }

  return result;
}

function replaceRuntimePhrases(value) {
  const phrases = getRuntimeMessages().phrases ?? {};
  const entries = Object.entries(phrases).sort((a, b) => b[0].length - a[0].length);
  return replaceByBoundary(value, entries);
}

function replaceRuntimeWords(value) {
  const words = getRuntimeMessages().words ?? {};
  const entries = Object.entries(words).sort((a, b) => b[0].length - a[0].length);
  if (entries.length === 0) return value;

  return String(value)
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (part.startsWith('<')) return part;

      const protectedTokens = [];
      const protect = (token) => {
        const placeholder = `__I18N_CODE_${protectedTokens.length}__`;
        protectedTokens.push(token);
        return placeholder;
      };

      const protectedPart = part
        .replace(/\$\{[^}]*\}/g, protect)
        .replace(/(?:Ω\s+)?[A-Z]{2,3}-[A-Za-z0-9ΘΛΩΦµβχσλθξηψωδκϕ-]+/g, protect);

      const translated = replaceByBoundary(protectedPart, entries);
      return protectedTokens.reduce(
        (result, token, index) => result.replace(`__I18N_CODE_${index}__`, token),
        translated,
      );
    })
    .join('');
}

const trCache = new Map();
const TR_CACHE_LIMIT = 2000;

export function tr(value) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  if (!/[A-Za-z]/.test(value)) return value;

  const cached = trCache.get(value);
  if (cached !== undefined) return cached;

  const trimmed = value.trim();
  const exact = getRuntimeMessages().exact?.[trimmed];
  const translated = exact
    ? value.replace(trimmed, exact)
    : replaceRuntimeWords(replaceRuntimePhrases(value));

  if (trCache.size >= TR_CACHE_LIMIT) {
    trCache.delete(trCache.keys().next().value);
  }

  trCache.set(value, translated);

  return translated;
}
