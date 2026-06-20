<template>
<h3 class="progress-header">
      <div class="ascend-wrapper" :class="{ hidden: !canShowAscension(hero) }">
        <button class="btnAscend" @click="performAscension">
        <img :src="ascensionIcon" width="24px" height="24px" style="vertical-align: -2px;"/>
          <div class="ascend-tooltip" v-html="ascensionContent()"></div>
        </button>
      </div>
      <div class="rebirth-wrapper" :class="{ hidden: !canShowRebirth(hero) }">
        <button class="btnRebirth" @click="performRebirth">
        ♻️
          <div class="rebirth-tooltip" v-html="rebirthContent()">
          </div>
        </button>
      </div>
      <div class="abyss-wrapper" :class="{ hidden: !canShowAbyss(hero) }">
        <button class="btnAbyss" @click="performAbyss">
        🧿
          <div class="abyss-tooltip abyss-shadow" v-html="abyssContent()">
          </div>
        </button>
      </div>
      <div class="inf-wrapper" :class="{ hidden: !canShowInfinity(hero) }">
        <button class="btnInf" @click="performInf" >
          <span class="infinity-glow">∞</span>
          <div class="inf-tooltip inf-shadow" v-html="infinityContent()">
              
          </div>
        </button>
      </div>
      <div class="soul-wrapper" :class="{ hidden: !canShowSoul(hero) }">
        <button class="btnSoul" @click="performSoulD" >
          <img :src="redSkull" width="24px" height="24px" v-if="hero.soulD" />
          <span v-if="!hero.soulD">💀</span>
          <div class="soul-tooltip" v-html="souldContent()">
          </div>
        </button>
      </div>
      <div class="singularity-wrapper" :class="{ hidden: !canShowSingularity(hero) }">
        <button class="btnSingularity" @click="performSingularity" >
          <SvgIcon name="singularity" size="1.4em" />
          <div class="singularity-tooltip singularity-shadow" v-html="singularityContent()">
          </div>
        </button>
      </div>
      <div class="singularity-wrapper" :class="{ hidden: !canShowSingShards(hero) }">
        <button class="btnSingularity" @click="performSingShards" >
          <SvgIcon name="singularity" size="1.4em" />
          <div class="singularity-tooltip singularity-shadow" v-html="singShardsContent()">
          </div>
        </button>
      </div>
</h3>
</template>

<script setup>
import { computed, reactive, ref, watch} from 'vue';
import { useHero } from '../../composables/useHero.js';
import { useEnemy } from '../../composables/useEnemy.js';
import { useBuff } from '../../data/buffs.js';
import { dimensions } from '../../data/dimensions.js';
import redSkull from '../../assets/red-skull.png';
import ascensionIcon from '../../assets/ascension.png';

import { useAbysses } from '../../composables/battleUtils/useAbyss.js';
import { useSingularity } from '../../composables/battleUtils/useSIngularity.js';
import { useResets } from '../../composables/battleUtils/useResets.js';

import SvgIcon from '../svgIcon.vue';
import { getSvgIconHTML } from "../../composables/svgIcon.js"
import { fn } from '../../composables/utils/global.js';



import {
  infinityMilestones,
  singularityMilestones,
  abyssMilestones,
} from "../../data/infinityMilestones.js";
import { useRebirths } from '../../composables/battleUtils/useRebirth.js';
import { useProgressions } from '../../composables/battleUtils/useProgression.js';
import { useAscensions } from '../../composables/battleUtils/useAscension.js';
import { useDimensions } from '../../composables/battleUtils/useDimensions.js';

const {
  abyssRewardList
} = useAbysses();

const {
  getTotalSp,
  singStageReq,
  enemyShardsMult
} = useSingularity();

const {
  performAscension,
  performRebirth,
  performAbyss,
  performInf,
  performSoulD,
  performSingularity,
  dsGain
} = useResets()

const {
  calculateRebirthTier
} = useRebirths();

const {
  singPower
} = useSingularity();

const {
  refreshKillsPerZone
} = useProgressions();

const {
  perksHandler
} = useAscensions();

const {
  getDimSpecialReward
} = useDimensions()


const { hero } = useHero();
const { buffs } = useBuff();
const { enemy } = useEnemy();




function performSingShards() {
  hero.value.gravity.isTrial = !hero.value.gravity.isTrial;
  hero.value.kills = 0;
  hero.value.killsPerZone = 1e7;
  hero.value.stages.current = 300;
}

function canShowAscension(h) {
  return h.stages.current >= 10 && 
  h.dId !== 'bh' &&
  h.dId !== 'dimMerge'
}

function canShowRebirth(h) {
  return (
    h.level >= 100 &&
    !h.isSingularity &&
    h.dId !== 'bh' &&
    h.dId !== 'dimMerge'
  );
}

function canShowAbyss(h) {
  if (h.dId === 'bh') return false;
  if (h.isSingularity) return false;
  if (h.dId === 'hard') return false;
  if (h.dId === 'dimMerge') return false;

  return (
    (h.abyssTier < 3 && h.soulsMax >= 20 + 10 * h.abyssTier) ||
    h.spCount >= 15
  );
}

function canShowSoul(h) {
  return (
    (h.infExpansions.soul) &&
    !h.isSingularity &&
    h.dId !== 'soulD' &&
    h.dId !== 'bh' && 
    h.dId !== 'c-soulD' &&
    h.dId !== 'dimMerge'
  );
}

function canShowInfinity(h) {
  return (
    !h.infProgress &&
    h.dId === 'main' &&
    !h.isSingularity &&
    h.mainInfTier < h.mainInfTierCap &&
    h.dId !== 'dimMerge' &&
    h.infUnlocked
  );
}

function canShowSingularity(h) {
  return (
    h.dId === 'main' &&
    !h.isAbyss &&
    h.mainInfTier >= 7 + 2 * Math.min(h.singularity, 7) &&
    h.singularityKills < 100 &&
    h.dId !== 'dimMerge'
  );
}

function canShowSingShards(h) {
  return (
    h.dId === 'main' &&
    !h.isAbyss &&
    h.stages.current >= 300 &&
    h.dId !== 'dimMerge' &&
    h.bhTier >= 5
  );
}

function ascensionContent () {
  let text = `<p style="color: #0011ff; font-weight: bold">转生</p>
  <p>重置到关卡 1，但会失去等级、技能树和装备进度。</p>`;

  text += `<p>总碎片： ${ fn(hero.value.totalAscensionShards) } `;
  if(hero.value.ascendShardPerform > 0)
    text += `<span>[+${fn(hero.value.ascendShardPerform)} 转生后]</span> 💠</p> `;
  else text += `💠</p>`;

  if(getDimSpecialReward(9) && hero.value.dId == 'main')
    text += `<p>你现在可以获得 <span style="color: #fe41fe">维度碎片 <strong>[DS]</strong></span>。
  达到关卡 ${dsGain()} 并转生以获得 <span style="color: #fe41fe">1 个维度碎片[DS]</span></p>`;

  return text;
}

function rebirthContent () {
  let text = `<p style="color: #00ff80; font-weight: bold">重生</p>`;

  if(!hero.value.infExpansions.rebirth)
    text += `<span>你受到 <span style="color: red">重生压制</span> 影响<br>
    <span>您已达到最高等级限制。重生以打破这个限制</span><br><br>`;

  text += `<span>重置到关卡 1，同时重置等级、技能树、装备和灵魂进度</span><br><br>`;


  let rebirth = calculateRebirthTier(hero.value.level, hero.value.rebirthTier);

  if(rebirth > 0)
    text += `<span>+${rebirth} 重置后的重生层级</span><br><br>`;
    

  if(hero.value.rebirthPts < 1e5)
    text += `重置后获得 ${fn(hero.value.totalRebirthPts)} 重生点数`;

  return text;
}

function abyssContent () {
  let text = '';

  if(hero.value.abyssTier < 3)
    text += `<p style="color: #f942f9; font-weight: bold">深渊[T${hero.value.abyssTier}]</p>`;
  else text += `<p style="color: #f942f9; font-weight: bold">深渊维度</p>`;

  text += `<p>${abyssMilestones[hero.value.abyssTier].description}`;
  if (hero.value.abyssTier >= 3) text += `. 精华获取降低 [^${fn(0.25 + perksHandler(46))}]`;
  text += '</p>';
  text += `<p>${abyssMilestones[hero.value.abyssTier].reward}</p>`;

  if(hero.value.abyssDStages >= 100 && hero.value.dId != 'abyss-d') 
    text += `<span style="color: #f942f9; font-weight: bold">你已达到深渊维度最高关卡。寻找其他方式继续推进。</span><br><br>`

  if(hero.value.abyssTier >= 3)
    text += `<span>最高关卡： ${hero.value.abyssDStages}</span>
    <p>${abyssRewardList()}</p>`;
  
  if(hero.value.isAbyss)
    text += `点击离开，或在达到指定关卡后完成深渊。`;
  
  return text;
}

function infinityContent () {
  let t = hero.value.mainInfTier;
  let color = t < 60? 'gold': '#cc66ff';
  let level = hero.value.infTierLevelReq;


  let text = `<span style="color: ${color}"><strong>Infinity [T${hero.value.mainInfTier}]</strong></span>`;

  if(t < 60)
    text += `<p>你已成为全能者，但 <span style="color: gold">[D-无限]</span> 试图阻止你击碎其造物的一块碎片。</p>`;
  else text += `<p><span style="color: ${color}; font-weight: bold">[D-腐化]</span> 正在干扰 <span style="color: gold">[D-无限]</span> 的结构并改变其行为。`

  
  if(t < 23)
    text += `<p>${ infinityMilestones[t].description }</p>`;
  
  text += `<p>按下按钮后，进度将重置，你会面对一场使[经验获取]和[最高等级]降低的试炼，倍率为 <span style='color: red'>^${(hero.value.infPower).toFixed(2)}</span>.
  当你达到等级 <span style="color: ${color}">${level}</span> 你将获得 <span style='color: ${color}'>Infinity [T${hero.value.mainInfTier + 1}]</span>。`;

  if(t >= 20)
    text += `<p><span style="color: gold">[D-无限]</span> 正在集结力量，并会每 5 个无限层级对你施加 <span style="color: red">[预言]</span> </p>`;

  return text;
}

function souldContent () {
  let text = `<p style="color: #e100ffcc; font-weight: bold">维度灵魂</p>
  <p>进入一个灵魂 100% 出现的子空间，但其中灵魂比普通灵魂更强。<strong>灵魂不会掉落战利品</strong></p>`;

  if(hero.value.selectedDivSkills.includes(11))
    text += `<p>灵魂维度被阻止，原因： <span style='color: #00ffea'>灵魂蚀</span></p>`;
  
  if(hero.value.selectedDivSkills.includes(6))
    text += `<p>灵魂维度被阻止，原因： <span style='color: #00ffea'>限制之基</p>`;

  if(hero.value.souls >= hero.value.soulsCap)
    text += `<p>灵魂维度被阻止，原因： <span style='color: #f424fb'>灵魂上限</p>`;
  
  if(hero.value.stages.current < 15)
    text += `<p>灵魂维度被阻止。你可从关卡 15 开始进入</p>`;




  return text;
}

function singularityContent () {
  let text = '';

  if(hero.value.singularity < 8)
    text += `<p style="color: cyan"><strong>奇点[T${hero.value.singularity}]</strong></p>`;
  else text += `<p style="color: cyan"><strong>奇点黑洞</strong></p>`

  text += `<p>潜入由 <span style="color: cyan">[D-重力]</span> 支配的奇点。</p>`;
  text += `<p>${ singularityMilestones[hero.value.singularity].challenge }</p>`;

  if(hero.value.isSingularity)
    text += `奇点会根据已击杀敌人数量提高[敌人强度]： <span style="color: cyan">${fn(singPower())}<br><br></span>`;
  
  if(hero.value.singularity < 8)
  text += `<p>执行奇点以获得： ${singularityMilestones[hero.value.singularity].reward}</p>`;

  if(hero.value.singularity >= 8) {
    text += `<span>最高击杀： ${hero.value.singularityKills}</span><br>`; 
  }
  if (hero.value.singularity >= 8 && hero.value.isSingularity) {
    text += `<span>总 SP： <b>${fn(getTotalSp())}</b></span><br><br>`
  }
    
  if(hero.value.eLevel < 700 && !hero.value.isSingularity)
    text += `<span>达到 700 级以进入奇点</span><br>`;
  
  if(hero.value.isSingularity)
    text += `<span>点击离开奇点</span>`;
  
  return text;
}

function singShardsContent () {
  let text = '';

  if (hero.value.stages.current < 300) return '达到关卡 300';

  text += `<p style="color: cyan"><strong>奇点[D-S]</strong></p>`;

  text += `<p>你已理解这个世界的全部重量。重力本身将听从你的号令。 
    进入奇点本身的临界点。 
    驾驭这一点后，你将获得一枚 <b style="color: cyan">奇点碎片</b>. 
    每枚 <b style="color: cyan">奇点碎片</b> 都会提高敌人强度和击杀需求。</p>
    
    <p style="color: cyan"><b>目标：探明这个世界之外的事物。</b></p>`;

  text += `<p>基础关卡需求： +${fn(singStageReq(false))}</p>
  <p>敌人生命值： ${fn(enemyShardsMult(false).hp)} | 敌人伤害： ${fn(enemyShardsMult(false).dmg)}</p>`

  return text;
}


</script>

<style scoped>
.progress-header {
  display: flex;
  align-items: center;
  gap: 8px; 
}

.hidden {
  visibility: hidden; 
  opacity: 0;          
}

.btnAscend {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
}

.ascend-wrapper {
  position: relative;
  display: inline-block;
}


.btnAscend:hover {
  transform: scale(1.1);
  z-index: 1000;
}


.btnAscend:hover .ascend-tooltip {
  display: block;
}
/* rebirth */
.btnRebirth, .btnAbyss, .btnInf, .btnSoul, .btnSingularity {
  position: relative; 
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
  padding: 0px;
  scrollbar-width: thin;
  scrollbar-color: rgb(245, 229, 56) transparent;
}

.btnAbyss {
  scrollbar-color: rgb(217, 47, 243) transparent;
}

.rebirth-wrapper, .abyss-wrapper, .inf-wrapper, .soul-wrapper, .singularity-wrapper {
  position: relative;
  display: inline-block;
}


.btnRebirth:hover, .btnAbyss:hover, .btnInf:hover, .btnSoul:hover, .btnSingularity:hover {
  transform: scale(1.1);
  z-index: 1000;
}

.btnRebirth:hover .rebirth-tooltip, .btnAbyss:hover .abyss-tooltip, .btnInf:hover .inf-tooltip, .btnSoul:hover .soul-tooltip, .btnSingularity:hover .singularity-tooltip {
  display: block;
}

.ascend-tooltip, .rebirth-tooltip, .abyss-tooltip, .inf-tooltip, .soul-tooltip, .singularity-tooltip {
  display: none;
  position: absolute;
  
  top: 500%;
  left: 100%;
  transform: translateY(-50%);
  width: 230px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  white-space: normal;
  z-index: 1000;

  overflow-y: auto;
  max-height: 300px;
}

.ascend-tooltip {
  box-shadow: 0 0 10px #0011ffcc;
}

.rebirth-tooltip {
  box-shadow: 0 0 10px rgba(21, 255, 0, 0.8); 
}

.abyss-tooltip {
  box-shadow: 0 0 10px rgba(225, 0, 255, 0.8);
  top: 650%;
}

.soul-tooltip {
  box-shadow: 0 0 10px #e100ffcc;
}

.inf-tooltip {
  box-shadow: 0 0 10px rgb(238, 255, 0);
  top: 550%;
}

.singularity-shadow {
  box-shadow: 0 0 12px 4px #66ffcc;
  top: 600%;
}

.infinity-glow {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 3s linear infinite;
  display: inline-block;
  line-height: 25px;
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>