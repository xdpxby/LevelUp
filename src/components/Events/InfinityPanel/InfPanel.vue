<template>
  <div class="infinity-wrapper">
    <div class="ip-header">
      <span
        class="ip-title"
        @click="hero.eLink = { set: 'Info', info: 'Infinity' }"
      >
        <sup class="info-icon"></sup> {{ t('infinityPanel.points') }}
      </span>

      <span
        class="ip-value"
        @click="hero.eLink = { set: 'Info', info: 'Stats', stat: 'IP' }"
      >
        <sup class="info-icon"></sup>{{ Math.floor(hero.infPoints) }}
      </span>
    </div>

    <div class="infinity-layout">
      <!-- LEFT: GOALS -->
      <div class="goals-panel">
        <div class="goals-header">
          <h2>{{ t('infinityPanel.goals') }}</h2>

          <div class="tier-buttons">
            <button
              v-for="t in maxBtnTiers + (hero.mainInfTier >= 70? 1: 0)"
              :key="t"
              @click="activeTier = t"
              :class="{ active: activeTier === t }"
            >
              T{{ t }}
            </button>
          </div>
        </div>

        <div class="goals-grid">
          <div
            v-for="goal in filterGoals"
            :key="goal.id"
            cl
            :class="[
              `goal-level-${goal.level}`,
              {
                completed: goal.tier === goal.maxTier,
                'goal-rank-2': goal.rank === 2
              },
            ]"
          >
            <Tooltip :text="() => infDescription(goal)">
              <div class="inf-icons" v-html="goal.icon"></div>
            </Tooltip>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE PANELS -->
      <div class="right-panels">
        <div class="panel-block">
          <h2>{{ t('infinityPanel.bonuses') }}</h2>
          <div class="scroll-box">
            <div
              v-for="bonus in filterBonuses"
              :key="bonus.id"
              class="bonus-line"
            >
              <span class="bonus-stat">{{ bonus.stat }}</span>
              <span class="bonus-value">{{ bonus.value }}</span>
            </div>

            <div class="bonus-requirement" v-if="filterBonuses.length">
              {{ t('infinityPanel.reach', { tier: getBonusReq(hero.mainInfTier) }) }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useHero } from "../../../composables/useHero.js";
import { goals } from "../../../data/infGoals.js";
import { dimensions } from "../../../data/dimensions.js";
import { fn } from "../../../composables/utils/global.js";

import SvgIcon from "../../svgIcon.vue";
import { useInfinity } from "../../../composables/battleUtils/useInfinity.js";
import { infBonusesHandler } from "../../../composables/battleUtils/global/infBonusesHandler.js";

const { 
  goalRankTwoHandle
} = useInfinity();

const { t } = useI18n();

const { hero } = useHero();

const activeTier = ref(1);
const maxBtnTiers = ref(1);



function getBonusReq(tier) {

switch (true) {

  case tier <= 7:
    return tier + 1

  case tier <= 9:
    return 10

  case tier <= 12:
    return 13

  case tier <= 14:
    return 15

  case tier <= 15:
    return 16

  case tier <= 17:
    return 18

  case tier <= 19:
    return 20

  case tier <= 21:
    return 22

  case tier <= 24:
    return 25

  case tier <= 29:
    return 30

  case tier <= 34:
    return 35

  case tier <= 39:
    return 40

  case tier <= 49:
    return 50

  case tier <= 59:
    return 60

  case tier <= 69:
    return 70

  case tier <= 79:
    return 80

  case tier <= 84:
    return 85

  case tier <= 89:
    return 90

  case tier <= 99:
    return 100

  case tier <= 109:
    return 110

  case tier <= 119:
    return 120

  case tier <= 129:
    return 130

  case tier <= 139:
    return 140

  case tier <= 149:
    return 150

  case tier <= 159:
    return 160

  case tier <= 169:
    return 170

  case tier <= 179:
    return 180

  default:
    return 1
}
}

const filterGoals = computed(() =>
  goals.value
    .filter((g) => g.rank == activeTier.value)
    .filter((g) => g.status)
    .sort((a, b) => a.level - b.level)
);

const filterBonuses = computed(() =>
  bonuses.value.filter((bonus) => bonus.status <= hero.value.mainInfTier)
);

function infDescription(goal) {
  if (goal.rank == 2)
    return infVoidDecr(goal);

  let str = goal.requirement[goal.tier];
  str += ` [<span>${goal.tier}/${goal.maxTier}</span>]`;
  str += `<br><span style="color: gold">${t('infinityPanel.rewardIp', { reward: goal.reward })}</span>`;

  return str;
}

function infVoidDecr(goal) {
  let id = goal.id;

  switch(id) {
    case 36: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于虚空碎片总量`
    case 37: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于奇点碎片`
    case 38: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于黑暗维度中的无限总量`
    case 39: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于总等级`
    case 40: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于超越`
    case 41: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于转生碎片总量`
    case 42: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于造成的伤害`
    case 43: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于主维度无限层级`
    case 44: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于空间戒指强化`
    case 45: return `<b style="color: gold">+${fn(goalRankTwoHandle(id))} IP</b> 基于虚空层级`

  }
}

const bonuses = computed(() => [
  {
    id: 0,
    stat: "伤害乘数",
    value: `${fn(infBonusesHandler(0, hero))}`,
    status: 0,
  },
  {
    id: 1,
    stat: "生命值乘数",
    value: `${fn(infBonusesHandler(1, hero))}`,
    status: 0,
  },
  {
    id: 2,
    stat: "防御乘数",
    value: `${fn(infBonusesHandler(2, hero))}`,
    status: 0,
  },
  {
    id: 3,
    stat: "经验获取",
    value: `${fn(infBonusesHandler(3, hero))}`,
    status: 0,
  },

  {
    id: 4,
    stat: "装备掉落几率",
    value: `${fn(infBonusesHandler(4, hero))}`,
    status: 1,
  },
  {
    id: 5,
    stat: "深渊敌人削弱",
    value: `${fn(infBonusesHandler(5, hero))}`,
    status: 1,
  },

  {
    id: 6,
    stat: "超杀",
    value: `${fn(infBonusesHandler(6, hero))}`,
    status: 2,
  },

  {
    id: 7,
    stat: "转生碎片获取",
    value: `${fn(infBonusesHandler(7, hero))}`,
    status: 3,
  },
  {
    id: 8,
    stat: "重生碎片获取",
    value: `${fn(infBonusesHandler(8, hero))}`,
    status: 3,
  },

  {
    id: 9,
    stat: "技能经验获取",
    value: `${fn(infBonusesHandler(9, hero))}`,
    status: 4,
  },

  {
    id: 10,
    stat: "腐化弱点",
    value: `${fn(infBonusesHandler(10, hero))}`,
    status: 5,
  },

  {
    id: 11,
    stat: "灵魂削弱",
    value: `${fn(infBonusesHandler(11, hero))}`,
    status: 6,
  },

  {
    id: 12,
    stat: "等级需求降低",
    value: `${fn(infBonusesHandler(12, hero))}`,
    status: 7,
  },
  {
    id: 13,
    stat: "关卡需求降低",
    value: `${fn(infBonusesHandler(13, hero))}`,
    status: 7,
  },

  {
    id: 14,
    stat: "敌人削弱",
    value: `${fn(infBonusesHandler(14, hero))}`,
    status: 8,
  },

  {
    id: 15,
    stat: "初始获得 2k 诱变剂",
    value: ``,
    status: 10,
  },

  {
    id: 16,
    stat: "最高等级乘数",
    value: `${fn(infBonusesHandler(16, hero))}`,
    status: 10,
  },
  { id: 17, stat: "最低等级", value: `${fn(infBonusesHandler(24, hero))}`, status: 13 },

  { id: 18, stat: "新无限技能：充能", value: ``, status: 15 },

  {
    id: 19,
    stat: "最高危险",
    value: `${fn(infBonusesHandler(18, hero))}`,
    status: 16,
  },
  
  {
    id: 20,
    stat: "星尘获取",
    value: `${fn(infBonusesHandler(19, hero))}`,
    status: 18,
  },

  {
    id: 21,
    stat: "潜能",
    value: `${fn(infBonusesHandler(20, hero))}`,
    status: 20,
  },

  {
    id: 22,
    stat: "奇点敌人削弱",
    value: `${fn(infBonusesHandler(21, hero))}`,
    status: 22,
  },

  { id: 23, stat: "IP 加成成长更好", value: ``, status: 25 },

  { 
    id: 24, 
    stat: "共鸣弱点", value: `${fn(infBonusesHandler(23, hero))}`, 
    status: 30 
  },
  {
    id: 25,
    stat: "诱变剂",
    value: `${fn(infBonusesHandler(25, hero))}`,
    status: 40,
  },

  { id: 26, stat: "解锁类星体核心", value: ``, status: 50 },
  { id: 27, stat: "在主维度保留最大无限守卫数", value: ``, status: 60 },
  { id: 28, stat: "解锁无限目标[T2]", value: ``, status: 70 },
  { id: 29, stat: "远古碎片获取", value: `${fn(infBonusesHandler(29, hero))}`, status: 80 },
  { id: 30, stat: "灵魂出现几率", value: `${fn(infBonusesHandler(30, hero))}`, status: 85 },
  { id: 31, stat: "类星体核心效果", value: `${fn(infBonusesHandler(31, hero))}`, status: 90 },
  { id: 32, stat: "解锁 3 个新类星体核心", value: ``, status: 100 },
  { id: 33, stat: "腐化影响弱点", value: `${fn(infBonusesHandler(33, hero))}`, status: 110 },
  { id: 34, stat: "奇点碎片乘数", value: `${fn(infBonusesHandler(34, hero))}`, status: 120 },
  { id: 35, stat: "虚空碎片获取", value: `${fn(infBonusesHandler(35, hero))}`, status: 130 },
  { id: 36, stat: "无限抗性", value: `${fn(infBonusesHandler(36, hero))}`, status: 140 },
  { id: 37, stat: "解锁 3 个新类星体核心", value: ``, status: 150 },
  { id: 38, stat: "5% 超越之力扩散到所有维度。", value: ``, status: 160 },
  { id: 39, stat: "觉醒层级需求降低", value: `${fn(infBonusesHandler(39, hero))}`, status: 170 },
  { id: 40, stat: "强化花费降低", value: `${fn(infBonusesHandler(40, hero))}`, status: 180 },
  { id: 42, stat: "解锁 3 个新类星体核心", value: ``, status: 200 },
])

</script>

<style scoped>
.infinity-wrapper {
  margin: 0 auto;
  padding: 20px;
}

.ip-header {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 15px;
  font-size: 1.4rem;
  color: gold;
  text-shadow: 0 0 8px gold;
}
.ip-title,
.ip-value {
  cursor: pointer;
  font-weight: 900;
}

.info-icon {
  font-size: 8px;
}

/* MAIN FLEX LAYOUT */
.infinity-layout {
  display: flex;
  gap: 25px;
  justify-content: center;
}

/* LEFT PANEL – GOALS */
.goals-panel {
  width: 520px;
  background: #2c2c2c;
  border: 2px solid gold;
  box-shadow: 0 0 10px gold;
  padding: 20px;
  border-radius: 14px;
  color: gold;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(45px, 1fr));
  gap: 18px;
  margin-top: 20px;
}

/* RIGHT PANELS STACK */
.right-panels {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Each right block */
.panel-block {
  width: 350px;
  height: 60vh;
  background: #2c2c2c;
  border: 2px solid gold;
  border-radius: 12px;
  padding: 16px;
  color: gold;
  box-shadow: 0 0 8px gold;
}

/* Scrollable box inside */
.scroll-box {
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 10px;
  scrollbar-width: thin;
  scrollbar-color: gold transparent;
}

.scroll-box.empty {
  opacity: 0.6;
  font-style: italic;
}


.goal-level-1 {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid gold;
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goal-level-2 {
  background: rgba(255, 0, 234, 0.1);
  border: 2px solid rgb(255, 0, 234);
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goal-level-3 {
  background: rgba(0, 255, 234, 0.1);
  border: 2px solid rgb(0, 255, 234);
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goal-level-4 {
  background: rgba(255, 0, 0, 0.1);
  border: 2px solid rgb(255, 0, 0);
  border-radius: 10px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.goal-rank-2 {
  background:
    linear-gradient(
      135deg,
      rgba(0,255,255,0.10),
      rgba(255,215,0,0.12)
    );

  border: 2px solid #b6ff00;
  text-align: center;
  border-radius: 10px;

  box-shadow:
    0 0 18px rgba(0,255,255,0.15),
    0 0 24px rgba(255,215,0,0.10);

}

.goal-level-1.completed {
  background: rgba(255, 215, 0, 0.3);
  color: #222;
  animation: pulse 2s infinite;
}

.goal-level-2.completed {
  background: rgba(247, 0, 255, 0.3);
  color: #222;
  animation: pulseCorrupted 2s infinite;
}

.goal-level-3.completed {
  background: rgba(0, 255, 234, 0.3);
  color: #222;
  animation: pulseDivine 2s infinite;
}

.goal-level-4.completed {
  background: rgba(255, 0, 0, 0.3);
  color: #222;
  animation: pulseDarkness 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 10px gold;
  }
  50% {
    box-shadow: 0 0 20px #fff700;
  }
  100% {
    box-shadow: 0 0 10px gold;
  }
}

@keyframes pulseCorrupted {
  0% {
    box-shadow: 0 0 10px rgba(255, 0, 234, 0.42);
  }
  50% {
    box-shadow: 0 0 20px rgb(255, 0, 234);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 0, 234, 0.36);
  }
}

@keyframes pulseDivine {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 242, 0.42);
  }
  50% {
    box-shadow: 0 0 20px rgb(0, 255, 242);
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 247, 255, 0.36);
  }
}

@keyframes pulseDarkness {
  0% {
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.42);
  }
  50% {
    box-shadow: 0 0 20px rgb(255, 0, 0);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.36);
  }
}

.infinity-bonuses {
  padding: 0.5rem;
}

.bonus-line {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px dashed #555;
}

.bonus-stat {
  font-weight: bold;
}

.bonus-value {
  color: #aaffaa;
}

.bonus-requirement {
  margin-top: 8px;
  font-weight: bold;
  text-align: center;
  color: #ffaa00;
}

.goals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  padding-bottom: 8px;
  border-bottom: 2px solid gold;
}

.goals-header h2 {
  margin: 0;
  font-size: clamp(1.2rem, 2vw, 1.7rem);
  color: gold;
  text-shadow: 0 0 8px gold;
}

/* Buttons */
.tier-buttons {
  display: flex;
  gap: 8px;
}

.tier-buttons button {
  padding: 5px 10px;
  border: 1px solid gold;
  background: #1c1c1c;
  color: gold;

  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;

  transition: 0.2s;
}

.tier-buttons button:hover {
  background: gold;
  color: black;
  box-shadow: 0 0 10px gold;
}

.tier-buttons button.active {
  background: gold;
  color: black;
  box-shadow: 0 0 10px gold;
}

.tier-buttons button.active {
  background: gold;
  color: black;
  box-shadow: 0 0 8px gold;
  transform: translateY(-1px);
}


.inf-icons {
  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

</style>
