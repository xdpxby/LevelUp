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


function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceRuntimePhrases(value) {
  let result = String(value);
  const phrases = zhCN.runtime?.phrases ?? {};
  const entries = Object.entries(phrases).sort((a, b) => b[0].length - a[0].length);

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

export function tr(value) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'string') return value;
  if (!/[A-Za-z]/.test(value)) return value;

  const trimmed = value.trim();
  const exact = zhCN.runtime?.exact?.[trimmed];
  if (exact) return value.replace(trimmed, exact);

  return replaceRuntimePhrases(value);
}
