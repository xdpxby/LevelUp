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

export function translateFallbackExact(text) {
  const key = String(text ?? '').trim();
  return zhCN.fallback.exact[key] ?? text;
}

export function getFallbackPhrases() {
  return zhCN.fallback.phrases;
}
