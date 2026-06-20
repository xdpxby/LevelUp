<template>
  <div class="zone-progress-header">
    <div class="left-icons">
      <div class="tooltip-wrapper-corr" v-if="hero.spaceUnlocked">
        <span
          class="tooltip-icon-corr"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('CorrInfluence', '1.25em')"
        ></span>
        <div class="corruption-tooltip-corr">
          <div
            class="corruption-tooltip-content-corr"
            v-html="corruptionInfluence()"
          ></div>
        </div>
      </div>

      <Tooltip v-if="hero.tr.count >= 1 || hero.bhTier > 0" :text="() => transcendenceEffects()" boxShadow="0 0 10px cyan" position="right-top">
        <span>🌀</span>
      </Tooltip>

      <Tooltip :text="() => timePenaltyEffect()" boxShadow="0 0 10px gold" position="right-top">
        <span v-if="hero.timePenalty">🕐</span>
      </Tooltip>
    </div>

    <div class="progress-center" v-if="!hero.dId.startsWith('d-')">
      <span class="progress-text">进度</span>
    </div>

    <div class="right-icons tooltip-content">
      <Tooltip :text="() => darkSpaceHandle()" boxShadow="0 0 10px gold">
        <span
          v-if="hero.dId == 'd-noSpace'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('celestials', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => unlimitedDimHandle()" boxShadow="0 0 10px red">
        <span
          v-if="hero.dId == 'd-unlimitted'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('maxLevelReduction', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => noEqDimHandle()" boxShadow="0 0 10px orange">
        <span
          v-if="hero.dId == 'd-noEq' || hero.darkId.includes('d-noEq')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('forge', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => apsHandle()" boxShadow="0 0 10px red">
        <span
          v-if="hero.dId == 'd-noAps'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('apsPenalty', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => dInfTreeHandle()" boxShadow="0 0 10px lightgreen">
        <span
          v-if="hero.dId == 'd-noTree' || hero.darkId.includes('d-noTree')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('infTree', '1.25em')"
        ></span>
      </Tooltip>
      
      
      <Tooltip :text="() => bleedingVeilHandle()" boxShadow="0 0 10px red">
        <span
          v-if="hero.dId == 'd-survival-2'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('bleedingVeil', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => nextDimHandle()" boxShadow="0 0 10px blue">
        <span
          v-if="hero.dId == 'd-next' || hero.darkId.includes('d-next')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('nextDim2', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => dBuffsHandle()" boxShadow="0 0 10px yellow">
        <span
          v-if="hero.darkId.includes('d-noBuffs')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('dBuffs', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => darkEnergyHandle()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId == 'd-overstage'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('darkEnergy', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => darkEnemyHandle()" boxShadow="0 0 10px orange">
        <span
          v-if="hero.dId == 'd-danger'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('darkDangerEnemy', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => doomHandle()" boxShadow="0 0 10px #af1b0b">
        <span
          v-if="hero.dId == 'd-damage' || hero.darkId.includes('d-damage')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('doom', '1.25em')"
        ></span>
      </Tooltip>
      <Tooltip :text="() => dHardHandle()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId == 'd-hard' || hero.darkId.includes('d-hard')"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('cursePower', '1.25em')"
        ></span>
      </Tooltip>
      
      <Tooltip :text="() => corruptionHandle()" boxShadow="0 0 10px purple">
        <span
          v-if="
            hero.dId == 'd-corruption' || hero.darkId.includes('d-corruption')
          "
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('corruptionDim', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => firstHelp()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId == 'main' && hero.mainInfTier < 10"
          >
          🌐
          </span
        >
      </Tooltip>

      <Tooltip :text="() => deathRecovery()" boxShadow="0 0 10px blue">
        <span v-if="hero.stages.current > 100">☠️</span>
      </Tooltip>

      <Tooltip :text="() => infHandle()" boxShadow="0 0 10px gold">
        <span
          v-if="hero.infProgress"
          class="infinity-glow"
          >
          ∞
          </span
        >
      </Tooltip>

      <Tooltip :text="() => dimsEffect()" boxShadow="0 0 10px purple">
        <span
          v-if="hero.dId != 'main' && dimsEffect()"
          >
          🌐
          </span
        >
      </Tooltip>

      <Tooltip :text="() => timelineHandle()" boxShadow="0 0 10px yellow">
        <span
          v-if="hero.dId == 'advanceBH'"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('advanceBH', '1.25em')"
        ></span>
      </Tooltip>

      <Tooltip :text="() => stageHardCap()" boxShadow="0 0 10px rgb(0, 247, 255)">
        <span
          v-if="hero.stages.current >= hero.stages.max"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('singularity', '1.25em')"
        ></span>
      </Tooltip>


      <Tooltip :text="() => travellHandle()" boxShadow="0 0 10px blue">
        <span
          v-if="hero.isTravell && hero.travellPenalty > 1"
          style="vertical-align: -webkit-baseline-middle"
          v-html="getSvgIconHTML('traveller', '1.25em')"
        ></span>
      </Tooltip>

    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import { useHero } from "../../composables/useHero.js";
import { useEnemy } from "../../composables/useEnemy.js";
import { usePlayer } from "../../composables/utils/playerSetup.js";

import { dimensions } from "../../data/dimensions.js";

import SvgIcon from "../svgIcon.vue";
import { getSvgIconHTML } from "../../composables/svgIcon.js";
import { fn, timeFormat } from "../../composables/utils/global.js";

import { useInfinity } from '../../composables/battleUtils/useInfinity.js';
import { useSpecialStats } from '../../composables/battleUtils/useSpecialStats.js'
import { useDimensions } from "../../composables/battleUtils/useDimensions.js";
import { useBaseEnemy } from "../../composables/utils/enemySetup.js";
import { useAbysses } from "../../composables/battleUtils/useAbyss.js";
import { useTimeline } from "../../composables/battleUtils/dims/useTimeline.js";
import { useVoid } from "../../composables/battleUtils/dims/useVoid.js";
import { newicons } from "../../composables/icons.js";


const { hero } = useHero();
const { enemy } = useEnemy();
const { player } = usePlayer();
const { villian } = useBaseEnemy();

const {
  voidEffects
} = useVoid();

const {
  infPenalties
} = useInfinity();

const { 
  getDimEffect
} = useDimensions();

const {
  getCorruptionSourses
} = useSpecialStats();

const {
  corrInflueceHandle
} = useAbysses();

const {
  timelineReq
} = useTimeline();

function deathRecovery() {
  let text = `在这个关卡，世界会压制你过度膨胀的力量，使死亡后的恢复时间延长 <span style="color: red">[${fn(1 + 0.01 * Math.max(hero.value.stages.current - 100, 0))}]</span> 倍`;

  return text;
}

function infHandle() {
  const h = hero.value;

  let penalty = Math.max(Math.min(h.infPower, 1), 0);
  let t = h.infTier;
  let color = t < 60? 'gold': '#cc66ff';

  let req = (h.dId.startsWith('d-')? 1400: h.infTierLevelReq);
  let text = ``;

  if (h.dId != 'advanceBH' && h.dId != 'dimMerge')
    text = `<span style="color: #feed8a">达到总等级 <b style="color: ${color}">${req}</b> 以完成无限试炼</span><br>`

  text += `<span style="color: #feed8a">本次试炼惩罚：
  最高等级： <span style='color: red'>[^${penalty.toFixed(2)}]</span>
  经验获取： <span style='color: red'>[^${penalty.toFixed(2)}]</span></span><br>`
  
  if(t >= 20)
    text += `<span style="color: #ff6666; font-weight: bold">[预言]</span>
    <span style="color: gold">星尘掉落降低 </span> <span style="color: #ff6666; font-weight: bold">${fn(infPenalties().stardust)}</span><br>`;
  if(t >= 25)
    text += `<span style="color: #b6ff00">诱变剂掉落降低</span> <span style="color: #ff6666; font-weight: bold">${fn(infPenalties().mutagen)}</span><br>`;
  if(t >= 30)
    text += `<span style="color: #f9453f">共鸣[诅咒]： <span style="color: #ff6666; font-weight: bold">${fn(infPenalties().curseMult)}</span><br>`;

  text += `<span style="color:#bfbfbf; font-style:italic; font-size:0.85em;">这些效果只在无限试炼中生效。</span><br><br>`;
  
  if(h.infPenalty > 0)
    text += `<span style="color: #feed8a">无限抗性： <b style="color: gold">[${fn(h.infPenalty)}]</b></span>`;
  
  return text;
}

function darkEnergyHandle() {
  let text = `击杀所有 <b style="color: cyan">[朦胧者]</b> 以进入下一 <span style='color: gold'>无限层级</span><br><br>`;
  text += `<b style="color: cyan">[朦胧者]</b>： ${enemy.value.darkEnergy.totalBosses} / ${enemy.value.darkEnergy.maxBosses}<br>`;

  if (enemy.value.darkEnergy.totalBosses < enemy.value.darkEnergy.maxBosses)
    text += `关卡：<span style='color: gold'>${
      100 + 5 * enemy.value.darkEnergy.totalBosses
    }</span>`;
  else
    text += `所有 <span style="color: cyan">[朦胧者]</span> 均已找到`;

  return text;
}

function doomHandle() {
  let text = `击杀敌人时，你会获得一层 <span style="color: red">[毁灭]</span>。每层都会降低你的属性。

    当前层数： <span style="color: red; font-weight: bond">${villian.value.status.dims.ddamage.kills}</span>

    <span style="color: red">伤害[惩罚]： ${fn(getDimEffect(28).dmg)}</span>
    <span style="color: lightgreen">生命值[惩罚]： ${fn(getDimEffect(28).stats)}</span>
    <span style="color: yellow">防御[惩罚]： ${fn(getDimEffect(28).stats)}</span>
  `;

  if (dimensions.value[28].infTier >= 20)
    text += `<br>击杀时有 50% 几率不获得一层 <span style="color: red">*毁灭*</span>。`;
  else if (dimensions.value[28].infTier >= 10)
    text += `<br>击杀时有 25% 几率不获得一层 <span style="color: red">*毁灭*</span>。`;

  return text;
}

function darkEnemyHandle() {
  let tier = dimensions.value[31].infTier;
  let danger = 1000 + 500 * tier;
  let stage = 100 + 10 * tier;

  
  let text = `找到 <span style="color: orange">维度巨像</span> 以进入下一 <span style="color: gold">无限层级</span><br><br>`;
  if (enemy.value.specialCreatures['ddim' + (tier + 1)]?.req === undefined)
    text += `<b style="color: orange">来自黑暗维度的所有生物均已找到</b>`;
  else if (enemy.value.specialCreatures['ddim' + (tier + 1)].req)
    text += `<b style="color: orange">已找到一个来自黑暗维度的存在</b>`;
  else 
    text += `需求：
  危险： <span style="color: gold">[${danger}+]</span>
  关卡： <span style="color: gold">[${stage}+]</span>
  `;


  return text;
}

function nextDimHandle() {
  let stage = Math.max(30 - dimensions.value[34].infTier, 1);
  let maxStage = 30 + 5 * dimensions.value[34].infTier;
  if (hero.value.dId == "d-next")
    return `这个世界已被重力击碎。你可达到的最高关卡为 <span style="color: red">${stage}</span>.`;
  if (hero.value.darkId.includes("d-next"))
    return `你可达到的最高关卡为 <span style="color: gold">${maxStage}</span>`;

  return "";
}

function bleedingVeilHandle() {
  return `<span style='color: #c31414'>[血幕]</span>

    你受到 <span style="color: #F8686A">[血幕]</span> 效果影响，每秒承受 <span style="color: #F8686A">${fn(player.value.status.dims.veil.damage)}</span> 点伤害
    <span style='color: #c31414'>[血幕]</span> 的力量会随通过的关卡提升。
  `;
}

function corruptionHandle() {
  let text = `<span style="color: violet">当你受到腐化影响时：</span><br>`;

  text += `<span style="color: red">敌人伤害： </span> <b style="color: gold">${fn(getDimEffect(26).dmg)}</b><br>`;
  text += `<span style="color: lightgreen">敌人生命值： </span> <b style="color: gold">${fn(getDimEffect(26).hp)}</b><br>`;
  if (getDimEffect(26).corr > 1)
    text += `<span style="color: #d537d5">最高等级惩罚提高</span> <b style="color: gold">${fn(getDimEffect(26).corr)}</b><br>`;
  text += "<span style='font-size: 11px; color: #ffb3b3;'>提示：腐化弱点会降低这些数值。</span>"

  return text;
}

function dHardHandle() {
  let resonance = getDimEffect(27);
  let text = `<span style="color: #ff4d4d">诅咒[共鸣]</span>: <span style="color: red">x${fn(resonance)}</span>`;

  return text;
}

function dBuffsHandle() {
  let descrease = Math.min(Math.log(1 + dimensions.value[32].infTier) ** 4, 80);

  let text = `技能出现几率： <span style='color: yellow'>${(
    100 - descrease
  ).toFixed(2)}</span>`;

  return text;
}

function dInfTreeHandle() {
  let mult = 1;

  if (hero.value.dId == "d-noTree")
    mult = getDimEffect(35).dId;
  else if (hero.value.darkId.includes("d-noTree"))
    mult = getDimEffect(35).darkId;

  let text = `无限节点花费： <span style="color: gold">${fn(mult)}<span>`;

  return text;
}

function apsHandle() {
  let text = `攻速惩罚： <span style="color: red">-${fn(getDimEffect(39).aps)}</span>
  敌人攻速： <span style="color: yellow">+${fn(getDimEffect(39).vaps)}</span>`;

  return text;
}

function noEqDimHandle() {
  let dark_d_penalty =
    hero.value.dId == "d-noEq"
      ? (Math.E * (dimensions.value[36].infTier + 1)) ** 1.3
      : 1;
  dark_d_penalty = hero.value.darkId.includes("d-noEq")
    ? Math.max(Math.E ** (1.3 - 0.015 * dimensions.value[36].infTier), 1)
    : dark_d_penalty;

  let text = `强化花费： <span style="color: gold">*${fn(
    dark_d_penalty
  )}</span>`;
  if (hero.value.darkId.includes("d-noEq"))
    text += `<br>你可达到的最高装备层级为 <span style="color: rgb(0, 255, 255)">${
      dimensions.value[36].infTier + 1
    }</span>`;

  return text;
}

function unlimitedDimHandle() {
  let text = `最高等级降低： <span style="color: red">${fn(getDimEffect(38))}</span>`;

  return text;
}

function stageHardCap() {
  return `<span style="color: rgb(0, 255, 255)">你对这个世界的认知仍太浅，也许[D-重力]会给你提示</span>`;
}

function darkSpaceHandle() {
  let power = (Math.E * (1 + dimensions.value[37].infTier)) ** 1.75;
  let count = 6 * (dimensions.value[37].infTier + 1);
  let text = `天界生物强度提升 <span style="color: gold">${fn(
    power
  )}</span> 倍<br>`;
  text += `击败 <span style="color: gold">${
    hero.value.spCount + hero.value.spsCount
  } / ${count}</span> 个天界生物以进入下一无限层级`;

  return text;
}

function travellHandle() {
  let text = `<span style="color: lightblue">旅行效果</span>
  
  敌人强度提升 <span style="color: red">${hero.value.travellPenalty.toFixed(
    2
  )}</span>.
  `;
  if (hero.value.dId.startsWith("d-"))
    text += `<br>处于黑暗维度时，旅行效果会恶化并扩展到其他效果：
    - 腐化效果翻倍
    - 诅咒效果翻倍
    - 毁灭效果提高`;

  return text;
}


function corruptionEffect() {
  let corruption =
    (hero.value.dId.startsWith('d-')
      ? Math.min(hero.value.corruption.total, hero.value.corruption.dcap)
      : Math.min(hero.value.corruption.total, hero.value.corruption.cap));

  let text = `
  <div style="font-size: 14px; line-height: 1.35;">
    
    <div style="margin-bottom: 6px;">
      <span style="color:#ee29ff; font-weight: 600;">腐败</span> — 
      一种来自 <span style="color:#ee29ff;">[D-腐化]</span> 并影响你的隐秘力量。
    </div>

    <div style="margin-bottom: 10px;">
      <span style="color:#ee29ff; font-weight: 600;">腐败</span> 会降低你的 <span style="color:rgb(159, 255, 127);">最大等级</span> ，在 300 级后倍率为
      <span style="color:#ff6b6b; font-weight: 600;">×${(
        getCorruptionEffect()
      ).toFixed(2)}</span>。<br>
      <span>死亡时会失去 <b style="color: red">${fn(hero.value.corruption.killsLose * 100)}%</b> 的关卡击杀数</span>
    </div>

    <div style="margin-bottom: 8px;">
      <span style="color:#ee29ff; font-weight: 900;">腐败：</span>
      <span style="color:#ee29ff;">${fn(corruption)}</span>
    </div>

    <div style="margin-top: 10px; font-weight: 600; color:#bbbbbb;">来源：</div>

    <div style="margin-top: 4px;">
      <div>基础 — <span style="color:#fff;">0.1</span></div>

      <div><span style="color: lightgreen;">重生</span> — 
        <span style="color: lightgreen;">${fn(getCorruptionSourses("rebirth"))}</span>
      </div>

      <div><span style="color: #d88bff;">深渊</span> — 
        <span style="color: #d88bff;">${fn(getCorruptionSourses("abyss"))}</span>
      </div>

      <div><span style="color: #b6ff00;">辐射</span> — 
        <span style="color: #b6ff00;">${fn(getCorruptionSourses("rad"))}</span>
      </div>

      <div><span style="color: orange;">空间</span> — 
        <span style="color: orange;">${fn(getCorruptionSourses("space"))}</span>
      </div>`;

      if(hero.value.mainInfTier >= 5) {
        text += `<div><span style="color: gold;">无限</span> — 
          <span style="color: gold;">${fn(getCorruptionSourses("inf"))}</span>
        </div>`
      }
      if(dimensions.value[22].infTier > 25) {
        text += `<div><span style="color: #ad7bff;">维度</span> — 
          <span style="color: #ad7bff;">${fn(getCorruptionSourses("dim"))}</span>
        </div>`
      }
      
        text += `<div><span style="color:#eeff04;">总计</span> — 
        <span style="color: #eeff04;">${fn(hero.value.corruption.total)}</span>
      </div>
    </div>

  </div>
  `;

  return text;
}

function getCorruptionEffect() {
  if(hero.value.dId.startsWith('d-')){
    let mult = getDimEffect(26).corr;
    let dCorruption = Math.min(hero.value.corruption.total, hero.value.corruption.dcap) * 0.1;

    return dCorruption / mult;
  } else {
    let corruption = Math.min(hero.value.corruption.total, hero.value.corruption.cap)
    return Math.max(1 - corruption, 0);
  }
}

function corruptionInfluence() {
  let corrInfDims = ['advanceBH', 'dimMerge'];

  if (!hero.value.dId.startsWith('c-') && 
  !corrInfDims.includes(hero.value.dId)) return corruptionEffect();

  let text = `<span style="color: #d8b4fe"><span style='color:#ee29ff'>腐化影响</span> - 来自 
    <span style='color:#ee29ff'>[D-腐化]</span> 的压倒性冲击，会扭曲现实的各个层面。</span><br><br>
    <span style='color:#ee29ff'>腐化影响： </span><span style='color:red'>${hero.value.corrInfluence}%</span><br><br>`;

  const corr = hero.value.corrInfluence;

  const effects = [
    {
      t: 5,
      d: "每点腐化影响、每个已完成关卡使敌人生命值和伤害 +1%",
      v: () => `(${fn(corrInflueceHandle(0).hp)}) (${fn(corrInflueceHandle(0).dmg)})`,
    },
    {
      t: 10,
      d: "每点腐化影响使基础关卡需求 +0.0025",
      v: () => `${fn(corrInflueceHandle(1))}`,
    },
    {
      t: 15,
      d: "每点腐化影响提高等级需求",
      v: () => `${fn(corrInflueceHandle(2))}`,
    },
    {
      t: 20,
      d: "每点腐化影响都会根据本次试炼总死亡次数削弱属性",
      v: () => `${fn(corrInflueceHandle(3))}`,
    },
    {
      t: 25,
      d: "每个已使用技能都会让无限点数收益变差",
      v: () => `${fn(corrInflueceHandle(4))}`,
    },
    {
      t: 30,
      d: "每点腐化影响 -1% 暴击和 -0.1 暴击伤害",
      v: () => `(${fn(corrInflueceHandle(5).crit)}) (${fn(corrInflueceHandle(5).critDmg)})`,
    },
    { t: 35, d: "无法通过重生获得层级", v: null },
    {
      t: 40,
      d: "每点腐化影响降低强化效果",
      v: () => `${fn(corrInflueceHandle(7))}`,
    },
    {
      t: 45,
      d: "每点腐化影响提高关卡击杀损失。",
      v: () => `${fn(corrInflueceHandle(8))}`,
    },
    { t: 50, d: "每点腐化影响都会削弱类星体之力", 
      v: () => `${fn(corrInflueceHandle(9))}` },
    { t: 55, d: "天界生物不再提供 SP", v: null },
    { t: 60, d: "最高等级降低取决于最高等级与当前等级的差值。", 
      v: () => `${fn(corrInflueceHandle(11))}` },
    { t: 65, d: "每点腐化影响降低装备掉落几率", 
      v: () => `${fn(corrInflueceHandle(12))}` },
    {
      t: 70,
      d: "获得的经验减少",
      v: () => `^${fn(corrInflueceHandle(13))}`,
    },
    { t: 75, d: "死亡时：重置 10% 关卡击杀数", v: null },
    { t: 80, d: "死亡时：失去 10 级", v: null },
    { t: 85, d: "禁用治疗", v: null },
    { t: 90, d: "禁用防御", v: null },
    { t: 95, d: "攻击变为 0", v: null },
    { t: 100, d: "攻击速度变为 0", v: null },
  ];

  effects.forEach((e) => {
    if (corr >= e.t) {
      const val = e.v ? e.v() : null;
      text += `<span style='color:#ee29ff'>${e.t}%</span>: <span style="color: #b8a9ff">${e.d}</span>`;
      if (val !== null) {
        text += ` <span style='color:red'>[${val}]</span>`;
      }
      text += "<br>";
    }
  });

  return text;
}

function transcendenceEffects() {
  const c = {
    title: '#67e8f9',
    text: '#c7f7ff',
  };

  let text = `
    <span style="color:${c.title}">超越[Tr] </span>
    <span style="color:${c.text}">
      是克服重力、获得超越凡俗之力的第一条道路。
      每 70,000 真实等级获得 1 点
    </span>
    <span style="color:${c.title}"> [Tr]</span>.
    <br><br>

    <span style="color:${c.text}">
      通过
    </span>
    <span style="color:${c.title}"> [D-重力] </span>
    <span style="color:${c.text}"> 
      试炼以解锁新的效果： 
    </span>
    <span style="color:${c.title}"> [Tr] </span>.
    <br><br>

    <span style="color:${c.text}"> 
      这些效果的强度取决于 
    </span>
    <span style="color:${c.title}"> [Tr] </span>.
    <br><br>

    <span style="color:${c.title}"> [Tr] </span>
    <span style="color:${c.text}">
      只存在于主维度和
    </span>
    <span style="color:${c.title}"> [黑洞] </span>.
    <br><br>

    <span style="color:${c.text}">
      进入
    </span>
    <span style="color:${c.title}"> [黑洞] </span>,
    <span style="color:${c.text}">
      后，你会摧毁自己的身体，只留下你的 
    </span>
    <span style="color:${c.title}"> [Tr] </span>
    <span style="color:${c.text}">
      能量。
    </span>
  `;

  if (hero.value.tr.spread > 0) {
    text += `
      <br><br>
      <span style="color:${c.title}"> [Tr] 扩散</span>
      <span style="color:${c.text}">
        - 允许
      </span>
      <span style="color:${c.title}"> [Tr] </span>
      <span style="color:${c.text}">
        存在于所有维度。 
      </span>
    `;
  }

  return text.replace(/\n\s*/g, '');
}

function dimsEffect() {
  let id = hero.value.dId;

  let text = `<span style="color: #f942f9; font-weight: bold">维度效果状态</span><br><br>`;

  switch(id) {
    case "gravity": {
      text += `英雄伤害： <span style="color: red">${fn(getDimEffect(2).dmg)}</span>
      敌人生命值： <span style="color: lightgreen">${fn(getDimEffect(2).hp)}</span>`;
      break;
    }
    case "overkill": {
      text += `敌人伤害： <span style="color: red">${fn(getDimEffect(3).dmg)}</span>
      敌人生命值： <span style="color: lightgreen">${fn(getDimEffect(3).hp)}</span>`;
      break;
    }
    case "damage": {
      text += `敌人伤害： <span style="color: red">${fn(getDimEffect(20).dmg)}</span>
      敌人生命值： <span style="color: lightgreen">${fn(getDimEffect(20).hp)}</span>
      该效果可通过转生或重生重置。`
      break;
    }
    case "unlimitted": {
      text += `<span style="color: red">等级冲刺已锁定</span>
      <span style="color: red">无限节点花费翻倍。</span>`
      break;
    }
    case "dimMerge": {
      text += dimMergeEffect();
      break;
    }

    default: return "";
  }

  return text;
}

function firstHelp () {
  let text = `<span style="color: #f942f9; font-weight: bold">维度效果</span><br><br>`;

  text += `<p style="color:#f87171; text-align: justify; text-justify: inter-word; word-break: break-word;">解锁维度图谱前，你拥有：</p>
  <span style="color: lightgreen">x2 经验乘数</span>
  <span style="color: orange">x2 技能经验乘数</span>
  <span style="color: lightblue">x2 转生碎片乘数</span>
  <span style="color: lightgreen">x2 重生点数乘数</span>
  <span style="color: yellow">x2 星尘乘数</span>
  <span style="color: #b6ff00">x2 诱变剂乘数</span>`

  return text;
}

function dimMergeEffect () {

let labelColor = '#c95ec9';
let labelEffect = 'gold';
return (`
  <span style="color:#a78bfa;">
  每个已通过关卡都会增强虚空影响。
  </span><br><br>

  <span style="color: ${labelColor};">关卡需求： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(0))}</b><br>

  <span style="color:${labelColor};">装备掉落几率降低： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(1))}</b><br>

  <span style="color:${labelColor};">强化花费降低： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(2))}</b><br>

  <span style="color:${labelColor};">等级需求： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(3))}</b><br>

  <span style="color:${labelColor};">最低等级降低： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(4))}</b><br>

  <span style="color:${labelColor};">敌人强度： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(5))}</b><br>

  <span style="color:${labelColor};">灵魂出现几率降低： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(6))}</b><br>

  <span style="color:${labelColor};">共鸣力量： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(7))}</b><br>

  <span style="color:${labelColor};">技能经验获取降低： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(8))}</b><br>

  <span style="color:${labelColor};">腐化影响： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(9))}</b><br>

  <span style="color:${labelColor};">无限层级： </span>
  <b style="color:${labelEffect};">${fn(voidEffects(10))}</b><br><br>

  <span style="color:#f87171;"><b>空间战斗已锁定</b></span><br>

  <span style="color:#f87171;"><b>灵魂维度已锁定</b></span><br>

  <span style="color:#f87171;"><b>关卡旅行已锁定</b></span><br>

  <span style="color:#f87171;"><b>关卡冲刺已锁定</b></span><br>

  <span style="color:#f87171;"><b>转生重置已锁定</b></span><br>

  <span style="color:#f87171;"><b>重生重置已锁定</b></span><br>
  `).replace(/\n\s*/g, '');
}

function timelineHandle () {
  let text = ``;
  let req = timelineReq();

  text += `<span style="color: #66ffcc; font-weight: bold;">完成条件：</span><br>`;
  text += `<span style="color: #ffff66;">关卡</span>: <span style="color: white; font-weight: bold;">${req.stage}</span><br>`;
  text += `<span style="color: #ffff66;">总等级</span>: <span style="color: white; font-weight: bold;">${req.level}</span>`;

  return text;
}

function timePenaltyEffect() {
  const remaining = Math.max(
    0,
    hero.value.maxTime - Date.now()
  );

  const endDate = new Date(hero.value.maxTime);

  return `<span style="color:#ff5555">你进入了时空异常，无法在异常中获得资源。
    你将在以下时间后可以离开异常：</span><br><span style="color:gold">${timeFormat(remaining / 1000)}</span>
    结束时间：<span style="color:#87cefa">${endDate.toLocaleString()}</span>`;
}


</script>

<style scoped>
.zone-progress-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  min-height: 3vh;
}

.left-icons,
.right-icons {
  display: flex;
  gap: 0.2rem;
  align-items: center;
}

.progress-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.progress-text {
  text-shadow: 0 0 4px #00ffea;
}

.tooltip-wrapper-corr {
  position: relative;
  display: inline-block;
  cursor: help;
}

.tooltip-icon-corr {
  display: inline-block;
  vertical-align: middle;
}

.corruption-tooltip-corr {
  position: absolute;
  top: 100%;
  left: 500%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 0 10px #ee29ff;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  min-width: 25vh;
}

.tooltip-wrapper-corr:hover .corruption-tooltip-corr {
  opacity: 1;
  pointer-events: auto;
}

.corruption-tooltip-content-corr {
  max-height: 25vh;
  max-width: 40vh;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.4;
  scrollbar-width: thin;
  scrollbar-color: #ee29ff rgba(0, 0, 0, 0.2);
}

.tr-card {
  width: 100%;
  max-width: 600px;
  background: linear-gradient(
    180deg,
    rgba(0, 20, 25, 0.6),
    rgba(2, 8, 12, 0.85)
  );
  border: 1px solid rgba(0, 255, 230, 0.08);
  border-left: 4px solid rgba(0, 255, 230, 0.16);
  padding: 14px;
  border-radius: 12px;
  color: #dffcff;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
}

.tr-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.tr-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(0, 255, 230, 0.03);
  color: #bffefe;
  border: 1px solid rgba(0, 255, 230, 0.06);
  font-weight: 600;
  font-size: 0.9rem;
}

.tr-badge--path {
  font-size: 1rem;
  letter-spacing: 0.4px;
  background: linear-gradient(
    90deg,
    rgba(0, 255, 230, 0.04),
    rgba(0, 150, 200, 0.02)
  );
  color: #d9ffff;
  border-left: 2px solid rgba(0, 255, 230, 0.2);
}

.tr-tag {
  margin-left: 6px;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 6px;
  background: rgba(0, 255, 230, 0.08);
  color: #002b2a;
  font-weight: 700;
}

.tr-badges-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tr-body {
  margin-top: 6px;
}

.tr-line {
  margin: 0;
  color: #dffcff;
  font-size: 0.95rem;
}

.accent {
  color: #8ffdf0;
  font-weight: 700;
}

.infinity-glow {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
  background: linear-gradient(45deg, #fff7cc, #ffd700, #ffcc00, #fff7cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  line-height: 20px;
}
</style>
