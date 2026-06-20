<template>
  <div class="soul-panel">
    
    <div
      class="soul-circle"
      :style="{ '--fill': fillPercent, '--circle-size': circleSize + 'px' }"
    >
        <div class="circle-content">
              <div class="tier">
                  [T{{ hero.soulPower.tier }}]
              </div>
              <div class="souls">
              {{ hero.souls }} / {{ hero.soulPower.req }} 灵魂
              </div>
        </div>
    </div>

    <!-- Right Side Tabs -->
    <div class="right-section">
      <div class="tabs">
        <button :class="{ active: tab === 'Target' }" @click="tab = 'Target'">
          {{ tr('Target') }}
        </button>

        <button :class="{ active: tab === 'Base' }" @click="tab = 'Base'">
          {{ tr('Base') }}
        </button>

        <button :class="{ active: tab === 'Rewards' }" @click="tab = 'Rewards'">
          {{ tr('Rewards') }}
        </button>

        <Tooltip :text="() => btnUnlocked(1)" boxShadow="0 0 10px #e600ff">
            <button
            :class="{ active: tab === 'Special' }"
            @click="tab = 'Special'"
            :disabled="!hero.infExpansions.soul"
            >
            {{ tr('Special') }}
            </button>
        </Tooltip>

        <Tooltip :text="() => btnUnlocked(2)" boxShadow="0 0 10px #e600ff">
          <button
            :class="{ active: tab === 'Unique' }"
            @click="tab = 'Unique'"
            :disabled="!getDimSpecialReward(56)"
          >
            {{ tr('Unique') }}
          </button>
        </Tooltip>
      </div>

      <div class="tab-content">
        <div v-if="tab === 'Target'">
          <SoulTargetPanel />
        </div>

        <div v-if="tab === 'Base'">
          <div class="base-card">
            +{{ fn(hero.soulPower.label.maxLevel) }} 最高等级 每 <span style="color: #e600ff">灵魂</span> 
            <span style="color: #bd44ca;font-weight: bold"> [{{ hero.soulPower.base.maxLevel }}]</span>
          </div>
          <div class="base-card">
            +{{ fn(hero.soulPower.label.exp)}} 经验乘数 每 <span style="color: #e600ff">灵魂</span> 
            <span style="color: #bd44ca;font-weight: bold"> [{{ fn(hero.soulPower.base.exp) }}]</span>
            <span style="color: red"> 硬上限 <strong>[{{ 40 + (hero.infExpansions.soul? 40: 0) }} 灵魂]</strong></span>
          </div>
          <div class="base-card" v-if="hero.infExpansions.soul">
            +{{ fn(hero.soulPower.label.minLevel)}} 最低等级 每 <span style="color: #e600ff"> 灵魂层级</span>
            <span style="color: #bd44ca;font-weight: bold"> [{{ hero.soulPower.base.min, true }}]</span>
          </div>
          <div class="base-card" style="color: yellow" v-if="hero.souls > 40">
            星尘乘数 [{{ fn(hero.soulPower.base.stardust) }}]
          </div>
          <div class="base-card" style="color: #b6ff00" v-if="hero.souls > 40">
             诱变剂乘数 [{{ fn(hero.soulPower.base.mutagen) }}]
          </div>
        </div>

        <div v-if="tab === 'Rewards'">
          <SoulRewardPanel />
        </div>

        <div v-if="tab === 'Special'">
          <div
            v-for="(bonus, i) in formattedSpecialBonuses"
            :key="i"
            class="base-card"
            v-html="bonus"
          ></div>
        </div>

        <div v-if="tab === 'Unique'" class="unique-list">
          <div 
            v-for="(item, i) in uniqueBonuses" 
            :key="i" 
            class="unique-card"
          >
            <div class="unique-header">
              <h3>{{ tr(item.title) }}</h3>

              <span v-if="!isUnlocked(item)" class="unique-lock">
                在 D56 消耗 {{ item.req }} 灵魂
              </span>
            </div>

            <p :class="{ locked: !isUnlocked(item) }">
              {{ tr(item.desc) }}
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { tr } from "../../../i18n/index.js";
import { useHero } from "../../../composables/useHero.js";
import { useEnemy } from "../../../composables/useEnemy.js";

import SoulRewardPanel from './SoulRewardPanel.vue';
import SoulTargetPanel from './SoulTargetPanel.vue';

import { fn } from "../../../composables/utils/global.js";

const { hero } = useHero();
const { enemy } = useEnemy();

import { useSouls } from '../../../composables/battleUtils/useSouls.js';
import { useDimensions } from "../../../composables/battleUtils/useDimensions.js";

const {
  soulPowerTooltipHandle
} = useSouls();

const {
  getDimSpecialReward
} = useDimensions();

const fillPercent = computed(() => {
  const progress = hero.value.souls / hero.value.soulPower.req;
  return Math.max(0, Math.min(100, Math.floor(progress * 100)));
});

const tab = ref("Target");

const circleSize = computed(() => {
  const w = Math.min(window.innerWidth, 1200);
  const size = Math.round(Math.max(300, Math.min(320, w * 0.12)));
  return size;
});

const specialBonuses = ref([
  "[] 伤害 每灵魂 []",
  "[] 暴击几率 每灵魂 []",
  "[] 暴击伤害 每灵魂 []",
  "[] 攻击速度 每灵魂 []",
  "[] 受到伤害降低 每灵魂 []",
  "[] 命中 每灵魂 []",
  "[] 闪避 每灵魂 []",
]);

const formattedSpecialBonuses = computed(() => {
  const tier = hero.value.soulPower.tier + 1;
  return specialBonuses.value.slice(0, tier).map((text, i) => {
    const special = hero.value.soulPower.special[i];
    if (!special) return "";

    const base = +special.base.toFixed(4);
    const value = +fn(special.value);

    return text
      .replace(
        "[]",
        `<span style='color: #9b6fff; font-weight: 700;'> [${base}]</span>`
      )
      .replace(
        /\[\]/,
        `<span style='color: #9b6fff; font-weight: 700;'> [${value}]</span>`
      );
  });
});

const uniqueBonuses = ref([
  { req: 120, title: "快速斩击[觉醒]", desc: "快速斩击不再有层级上限。每个额外层级使[T4]效果提高 1%" },
  { req: 140, title: "超杀[觉醒]", desc: "超杀不再有层级上限。每个额外层级使超额战利品提高 1%" },
  { req: 160, title: "征服[觉醒]", desc: "征服不再有层级上限。每个额外层级使最大时间提高 100 秒" },
  { req: 180, title: "旅行者[觉醒]", desc: "旅行者不再有层级上限。每个额外层级使[T4]效果提高 1.1" },
  { req: 200, title: "先发制人[觉醒]", desc: "先发制人不再有层级上限。每个额外层级使[T4]效果提高 1%" },
  { req: 220, title: "狙击手[觉醒]", desc: "狙击手不再有层级上限。" },
  { req: 240, title: "狂暴[觉醒]", desc: "狂暴不再有层级上限。每个额外层级使低生命阈值提高 2%" },
  { req: 260, title: "连击[觉醒]", desc: "连击不再有层级上限。每个额外层级使连击最大层数提高 10" },
]);

function isUnlocked(item) {
  return hero.value.cSoulsMax >= item.req;
}

function btnUnlocked(id) {
    if (!hero.value.infExpansions.soul && id == 1) return `解锁灵魂的 <span style='color: gold; font-weight: 600'>无限扩展</span>`;
    if (!getDimSpecialReward(56) && id == 2 && hero.value.mainInfTier >= 60) return `完成 <span style='color: gold; font-weight: 600'>D56</span> 以解锁`;
    if (getDimSpecialReward(56) && id == 2 && hero.value.mainInfTier < 60) return `<span style='color: gold; font-weight: 600'>已锁定</span>`;

  return "";
}




onMounted(() => {
  window.addEventListener("resize", () => {});
});
</script>

<style scoped>
.soul-panel {
  display: flex;
  gap: 20px;
  padding: 18px;

  width: 100%;
  max-width: 850px;

  height: 320px; 
  
  background: #12061a;
  border: 2px solid #6b29ff;
  border-radius: 14px;
  color: #e6d7ff;

  overflow: hidden; 
}

.soul-circle {
  width: var(--circle-size);
  height: var(--circle-size);
  position: relative;
  border-radius: 50%;
  background: #2a1150;
  border: 6px solid rgba(138, 77, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.soul-circle::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  padding: 6px;
  background: conic-gradient(#8a4dff calc(var(--fill) * 1%), transparent 0)
    border-box;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.circle-content {
  position: absolute;
  text-align: center;
  font-weight: 800;
  pointer-events: none;
}

.circle-content .tier {
  font-size: 1.9em;
  line-height: 1;
  letter-spacing: 0.6px;
  color: #fff;
  text-shadow: 0 2px 8px rgba(122, 61, 255, 0.45);
}

.circle-content .souls {
  font-size: 1.05em;
  opacity: 0.95;
  margin-top: 6px;
}

/* Right */
.right-section {
  display: flex;
  flex-direction: column;

  flex: 1;
  min-width: 0;
  overflow: hidden;

  scrollbar-width: thin;
  scrollbar-color: rgb(214, 40, 226) transparent;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.tabs button {
  padding: 8px 12px;
  border: 2px solid #7a3dff;
  background: transparent;
  color: #d6baff;
  border-radius: 8px;
  transition: 0.18s;
  font-weight: 700;
}

.tabs button.active {
  background: linear-gradient(90deg, #8a4dff, #7a3dff);
  color: white;
  transform: translateY(-2px);
}

.tab-content {
  flex: 1; 

  overflow-y: auto;

  border-radius: 12px;
  padding: 10px;

  background: rgba(22, 9, 36, 0.6);
  border: 1px solid rgba(122, 61, 255, 0.12);
}

.bonus-card {
  background: linear-gradient(
    180deg,
    rgba(42, 17, 80, 0.6),
    rgba(32, 10, 60, 0.6)
  );
  border: 1px solid rgba(122, 61, 255, 0.18);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-weight: 700;
}

.base-card {
  background: linear-gradient(
    180deg,
    rgba(42, 17, 80, 0.6),
    rgba(32, 10, 60, 0.6)
  );
  margin-bottom: 10px;
  font-weight: 700;
}


/* Responsive tweaks */
@media (max-width: 640px) {
  .soul-panel {
    gap: 12px;
    padding: 12px;
  }
  .circle-content .tier {
    font-size: 1.5em;
  }
}


/* Unique  */

.unique-card {
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 6px;
  background: rgba(0,0,0,0.2);
}

.unique-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unique-card h3 {
  margin: 0;
  color: gold;
}

.unique-lock {
  font-size: 11px;
  color: orange;
  opacity: 0.9;
}

.unique-card p {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.85;
  line-height: 1.3;
}

.unique-card p.locked {
  opacity: 0.4;
  filter: blur(0.3px);
}
</style>
