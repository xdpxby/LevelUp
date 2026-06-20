<template>
  <div class="debug-panel">
    <h3>调试工具</h3>
    <div class="btn-wrapper">
      <button class="btn" @click="applyTool('bhTier')">黑洞层级</button>
      <button class="btn" @click="applyTool('Levelup')">+1 等级</button>
      <button class="btn" @click="applyTool('afk')">1小时离线</button>
      <button class="btn" @click="applyTool('ShardsPlus')">+1万碎片</button>
      <button class="btn" @click="applyTool('RebirthPtsMore')">+1000重生点数</button>
      <button class="btn" @click="applyTool('abyss')">深渊</button>
      <button class="btn" @click="applyTool('mutagen')">+诱变剂</button>
      <button class="btn" @click="applyTool('RebirthTier')">+10重生层级</button>
      <button class="btn" @click="applyTool('+1 Stage')">+1关卡</button>
      <button class="btn" @click="applyTool('+10 Stage')">+10关卡</button>
      <button class="btn" @click="applyTool('+50 souls')">+50灵魂</button>
      <button class="btn" @click="applyTool('Stardust')">星尘</button>
      <button class="btn" @click="applyTool('+1 Space')">+1空间</button>
      <button class="btn" @click="applyTool('+5 Space')">+5空间</button>
      <button class="btn" @click="applyTool('-5 Space')">-5空间</button>
      <button class="btn" @click="applyTool('+1 tier')">+1维度层级</button>
      <button class="btn" @click="applyTool('-1 tier')">-1维度层级</button>
      <button class="btn" @click="applyTool('+10 kills')">+10击杀</button>
      <button class="btn" @click="applyTool('voidShards')">+1000虚空碎片</button>
      <hr>
      <button class="btn" @click="killHero">击杀英雄</button>
      <button class="btn" @click="killEnemy">击杀敌人</button>
    </div>
  </div>
</template>

<script setup>
import { useHero } from '../composables/useHero.js';
import { useEnemy } from '../composables/useEnemy.js';
import { usePlayer } from '../composables/utils/playerSetup.js';
import { useBaseEnemy } from '../composables/utils/enemySetup.js';

import { dimensions } from '../data/dimensions.js';
import { loading } from '../composables/utils/loading.js';

const props = defineProps({
  engine: Object
});

const { hero } = useHero();
const { enemy } = useEnemy();
const { player } = usePlayer();
const { villian } = useBaseEnemy();

const {
  useGodMode,
  afkSnapshot
} = loading();

function applyTool(str) {
  switch (str) {
    case 'EXP': {
      hero.value.exp += 1000000;
      break;
    }
    case 'bhTier': {
      hero.value.bhTier++;
      break;
    }
    case 'Levelup': 
      hero.value.eLevel += 100;
      break;
    case 'afk': {
      afkSnapshot();
      useGodMode('godmode');
      break;
    }
    case 'abyss':
      hero.value.soulsMax = 40;
      hero.value.soulsCap = 40;
      hero.value.souls = 40;
      hero.value.abyssTier = 3;
      break;
    case '+1 tier': {
      let d = {};
      for(let ds of dimensions.value){
        if(ds.id == hero.value.dId){
          d = ds;
          break;
        }
      }

      if(hero.value.dId == 'main') 
        hero.value.mainInfTier += 1;
      else {
        d.infTier += 1;
      }
      hero.value.infTier += 1;
      break;
    }

    case '-1 tier': {
      let d = {};
      for(let ds of dimensions.value){
        if(ds.id == hero.value.dId){
          d = ds;
          break;
        }
      }

      if(hero.value.dId == 'main') 
        hero.value.mainInfTier -= 1;
      else {
        d.infTier -= 1;
      }
      hero.value.infTier -= 1;
      break;
    }
    case 'mutagen':
      hero.value.mutagen += 1e6;
      break;
    case 'ShardsPlus':
      hero.value.ascensionShards *= 10;
      break;
    case 'RebirthTier':
      if (hero.value.mainInfTier < 3)
        hero.value.rebirthTier += 1;
      else if (hero.value.mainInfTier < 60)
        hero.value.rebirthTier += 10;
      else 
        hero.value.rebirthTier += 60;
      break;
    case 'RebirthPtsMore':
      hero.value.rebirthPts += 100000;
      break;
    case '+1 Stage':
      hero.value.stages.current += 1;
      break;
    case '+10 Stage':
      hero.value.stages.current += 10;
      break;
    case '+50 souls':
      hero.value.souls += 20;
      hero.value.soulsMax += 20;
      break;
    case 'Stardust':
      hero.value.stardust *= 1000;
      break;
    case '+1 Space':
      hero.value.spCount++;
      break;
    case '+5 Space':
      hero.value.spCount += 5;
      break;
    case '+10 kills':
      if (hero.value.isSingularity)
        hero.value.singularityKills += 10;
      hero.value.kills += 10;
      break;
    case '-5 Space':
      hero.value.spCount = Math.max(hero.value.spCount - 5, 0);
      break;
    case 'voidShards':
      hero.value.void.totalShards += 1000;
    default:
      console.warn('Unknown tool:', str);
  }
}

function killHero() {
  //if (!props.engine) return;

  player.value.hp = 1;
  //player.value.dead = true;
  //props.engine.emitHook("onHeroDeathing");
  //props.engine.emitHook("onHeroDeath");
}

function killEnemy() {
  //if (!props.engine) return;

  villian.value.hp = 1;
  //villian.value.dead = true;
  //props.engine.emitHook("onEnemyDeathing");
  //props.engine.emitHook("onEnemyDeath");
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 20%;
  left: 10%;
  z-index: 10000;
  background: rgba(0,0,0,0.8);
  padding: 10px;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  max-width: 160px;
}

.btn-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn {
  border: 1px solid #ffd700;
  background: #222;
  color: #ffd700;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn:hover {
  background: #333;
}
</style>
