import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";

import { fn, timeFormat } from "../../utils/global.js";

import { dimensions } from "../../../data/dimensions.js";

import { useDimensions } from "../useDimensions.js";
import { useTimeline } from "./useTimeline.js";
import { usePlayer } from "../../utils/playerSetup.js";
import { useVoid } from "./useVoid.js";
import { tr } from "../../../i18n/index.js";


export const useNormalDimension = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    const { player } = usePlayer();

    let dId = null;

    const { getDimSpecialReward, getDimReward, getDimEffect, getBaseTierSourses } = useDimensions();
    const { getAllActiveDims } = useTimeline();
    const { voidTimer, voidShardsDrop } = useVoid();

    const noTier = ['eternity', 'dimMerge'];
    const singleTier = ['time', 'abyss-d', 'survival-2','unlimitted', 'dimMerge'];

    const setNormalCard = (d, d_req) => {
        

        let str = `
            <div style="
            font-size: 18px;
            font-weight: 900;
            margin-bottom: 6px;
            color: #ffffff;
            text-shadow: 0 0 4px rgba(0,0,0,0.45);
            ">
            ${tr('Dimension')}: ${d.name} [${d.idx}]
            </div>
        `;
        
        if (d_req(d)) {
            str += reqCard(d.c);
            return str;
        }
        
        str += dimDescCard(d)

        str += infTierCardHandler(d, d_req);

        str += dimRewardCard(d);

        str += dimSpecialRewardCard(d);

        if(d.id == 'time') 
            str += time_dim_sr_handle();
        
        return str;
    }

    function dimSpecialRewardCard(d) {
      if (d.sp == '') 
        return '';

      return `
            <div style="
              background: #e9faff;
              padding: 10px 12px;
              border-radius: 10px;
              margin-bottom: 10px;
              text-align: center;
              box-shadow: 0 0 8px rgba(0, 240, 255, 0.45);
              border: 1px solid #b8f5ff;
            ">
              <div style="
                font-size: 16px;
                font-weight: 900;
                text-transform: uppercase;
                color: #007e89;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">
                ${tr('Special Reward')}
              </div>
              <div style="
                font-size: 14px;
                font-weight: 600;
                color: #00606b;
              ">
                ${tr(d.sp)}
              </div>
            </div>
          `;
    }

    function dimRewardCard(d) {
        if(d.r == "") 
            return "";

        let desc = "";
        let title = "Reward";
        let baseColor = '#006f75';
        let baseBackground = '#dffeff';
        let baseBorder = '#b2f2f5';
      
        switch (d.id) {
          case "noBuffs":
            desc = `Skill EXP Boost: <span style="color:#00a8ff;font-weight:700">
                      ${fn(getDimReward(11))}
                    </span>`;
            break;
          
          case "unlimitted":
            desc = unlimit_dim_r_handle();
            break;

          case "danger":
            desc = `Max Danger: <span style="color:#ff7f50;font-weight:700">
                      +${fn(getDimReward(15))}
                    </span>`;
            break;
      
          case "damage":
            desc = `Damage MULT: <span style="color:#ff4d4d;font-weight:700">
                      ${fn(getDimReward(20))}
                    </span>`;
            break;
      
          case "survival-2":
            desc = `
              最高关卡：<span style="color:#00a8ff;font-weight:700">
                ${hero.value.dims.survival.stage}
              </span><br>
              生命符文生效至等级
              <span style="color:#00a8ff;font-weight:700">
                ${Math.floor(getDimReward(21).level)}
              </span>
            `;
            break;
          
          default: 
            desc = d.r;
            break;

      

        }
      
        return `
          <div style="
            background: ${baseBackground};
            padding: 10px 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            text-align: center;
            box-shadow: 0 0 6px rgba(0, 200, 220, 0.35);
            border: 1px solid ${baseBorder};
          ">
            <div style="
              font-size: 16px;
              font-weight: 800;
              text-transform: uppercase;
              color: ${baseColor};
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            ">
              ${tr(title)}
            </div>
            <div style="
              font-size: 14px;
              font-weight: 600;
              color: ${baseColor};
            ">
              ${tr(desc)}
            </div>
          </div>
        `;
    }

    const infTierCardHandler = (d, d_req) => {
        dId = d.idx;

        if (d.id === 'main' && hero.value.mainInfTierCap > 60)
          return infinityTierCardCorr(hero.value.mainInfTier, hero.value.mainInfTierCap);

        else if (d.id === 'main')
          return infinityTierCard(hero.value.mainInfTier, hero.value.mainInfTierCap);
        
        else if (noTier.includes(d.id)) 
            return "";

        else if (singleTier.includes(d.id) && !d_req(d)) 
            return infinityTierCard(d.infTier);
        
        else if (!d_req(d)) 
            return infinityTierCard(d.infTier, d.maxInfTier);       
    }

    function infinityTierCardCorr(cur, max) {
      const tier = max ? `Infinity [T${cur}]/[T${max}]` : `Infinity [T${cur}]`;
      
      return `
        <div style="
          padding: 6px 10px;
          border-radius: 6px;
          background: rgba(153, 102, 255, 0.1); 
          border-left: 3px solid #d3a0ff;       
          color: #d3a0ff;  
          font-size: 14px;
          margin-bottom: 10px;
        ">
          ${tier}
        </div>
      `;
    }

    function infinityTierCard(cur, max = null) {
        const tier = infTierTemplate(cur, max);
      
        return `
          <div style="
            padding: 6px 10px;
            border-radius: 6px;
            background: rgba(255,215,0,0.1);
            border-left: 3px solid gold;
            font-size: 14px;
            color: gold;
            margin-bottom: 10px;
          ">
            ${tier}
          </div>
        `;
    }

    function infTierTemplate (cur, max) {
      let e = getBaseTierSourses(dId);

      let inf = e > 0? `Infinity [T${cur}+${e}]`: `Infinity [T${cur}]`;
      let tier = max ? `${inf}/[T${max}]` : inf;

      return tier;
    }

    function dimDescCard(d) {
        let desc = "";
        let baseColor = '#d3e1ff';
      
        switch(d.id){
          case "main":
            desc = main_dim_des_handle();
            break;
          case "hard": 
            desc = `进入诅咒固定为[T5]且永久存在的维度。
            你无法从诅咒获得精华，深渊被锁定。
            达到关卡 <span style="color:#00a8ff;font-weight:700">
            ${100 + 5 * (d.infTier - 20)}
            </span> 后，才能推进到下一层无限试炼。
            你以无限[T20]开始。`;
            break;
          case "overstage":
            desc = `进入从关卡
            <span style="color:#00a8ff;font-weight:700">
            ${100 + 10 * (d.infTier - 20)}
            </span> 开始的维度。`;
            break;
          case "dimMerge":
            desc = (hero.value.dims.corrShards >= 20? merge_dim_des_handle(): corr_dim_des_handle()); 
            break;
          default:
            desc = d.d;
            break;
        }
      
        return `
          <div style="
            background: #1d1f2e;
            padding: 10px 12px;
            border-radius: 8px;
            color: ${baseColor};
            font-size: 14px;
            margin-bottom: 12px;
            line-height: 1.3;
            border: 1px solid rgba(255,255,255,0.12);
          ">
            ${tr(desc)}
          </div>
        `;
    }

    function reqCard(text) {
        return `
            <div style="
              background: rgba(255,70,70,0.12);
              border-left: 3px solid #ff4646;
              padding: 6px 10px;
              border-radius: 6px;
              color: #ff6a6a;
              font-size: 14px;
              margin-bottom: 10px;
              line-height: 1.25;
            ">
              ${tr(text)}
            </div>
          `;
    }


    function main_dim_des_handle() {
        function dimCard(text, color = "#8af7ff") {
          return `
            <div style="
              background: #0b1414;
              border-left: 3px solid ${color};
              padding: 10px 12px;
              border-radius: 8px;
              color: #d8fffa;
              margin-bottom: 12px;
              line-height: 1.35;
              font-size: 14px;
            ">
              ${tr(text)}
            </div>
          `;
        }
      
        let str = "";
        str += dimCard("维度中的无限试炼会自动完成。");
        str += dimCard("深渊契约：满足深渊需求后，深渊会自动完成。仅在其他维度中生效。");
        str += dimCard("无限扩展的影响会延伸到所有维度。");
        str += dimCard("每完成该维度的一层无限试炼都会获得奖励。");
        str += dimCard("完成该维度全部无限试炼后会获得特殊奖励。");
      
        return str;
    }

    function corr_dim_des_handle () {
      let d = hero.value.dims;

      let text = `使用<span style="color:#cc66ff; font-weight:600">腐化碎片</span>穿越所有维度，以解锁
      <span style="color:#b6ff00; font-weight:700">维度融合</span>。<br><br>
      <span style="color:#cc66ff">腐化碎片：<strong>${d.corrShards} / 20</strong></span><br><br>

      <span style="color:#b726ff; font-weight:bold">[D-Corruption]</span>正在扭曲<span style="color:#cc66ff">腐化</span>，将力量施加于这个世界。
      每个<span style="color: #cc66ff">腐化碎片</span>都会提高主维度的<span style="color:gold">无限上限</span>，但也会增强
      <span style="color:#cc66ff">腐化影响</span>。<br><br>

      <span style="color:gold">无限上限 +2 <strong>[${2 * d.corrShards}]</strong></span><br>
      <span style="color:#cc66ff">腐化影响 +1% <strong>[${d.corrShards}%]</strong></span><br><br>

      在主维度达到<span style="color: gold; font-weight:700">[T${60 + 2 * d.corrShards}]</span>
      以解锁下一个<span style="color:#cc66ff">腐化维度</span>。`

      return text;
    }

    function merge_dim_des_handle () {
      let text = `汇聚所有维度的力量后，你在世界中撕开了一道通往<span style="color: #b6ff00"><b>虚空</b></span>的裂隙，那里自有法则。<br>
      进入<span style="color: #b6ff00"><b>虚空</b></span>后，每完成一个关卡都会提高各方面需求。<span style="color: #b6ff00"><b>虚空</b></span>与其他<span style="color: cyan"><b>[D-Rulers]</b></span>直接相连，所以每完成一个关卡
      也会提高<span style="color: #cc66ff"><b>腐化影响</b></span>和<span style="color: gold"><b>无限惩罚</b></span>。<br>
      推进关卡时，你会吸收<span style="color: #b6ff00"><b>虚空碎片</b></span>。它们会逐渐累积，并且每8小时可以消耗一次。<br><br>
      <span style="color: #b6ff00"><b>目标：找到[D-Eternity]，了解更多关于[D-Rulers]的信息。</b></span><br><br>
      
      最高关卡：<span style="color: #b6ff00"><b>${hero.value.void.stage}</b></span><br>
      <span style="color: #b6ff00"><b>已累积虚空碎片：${fn(voidShardsDrop())}</b></span><br>
      距离消耗虚空碎片还剩：<span style="color: #b6ff00"><b>${timeFormat(hero.value.void.time)}</b></span><br>`;

      return text;
    }

    function unlimit_dim_r_handle(){
        let unlimitD = `
        <span>最高等级：${hero.value.unlimitLevel}</span>/<span>[${getDimReward(5).maxUnlimmit}]</span><br><br>
        <span>
        经验乘数：${fn(getDimReward(5).exp)} <br>
        最高等级乘数：${fn(getDimReward(5).maxLevel)} <br>
        最低等级：${getDimReward(5).min}<br>
        </span><br>
        ${unlimit_bonuses(hero.value.unlimitLevel)}
        `
      
        return unlimitD;
    }

    function unlimit_bonuses(lvl) {
        function dimCard(text, color = "#8af7ff") {
            return `
              <div style="
                background: #0b1414;
                border-left: 3px solid ${color};
                padding: 10px 12px;
                border-radius: 8px;
                color: #d8fffa;
                margin-bottom: 12px;
                line-height: 1.35;
                font-size: 14px;
              ">
                ${tr(text)}
              </div>
            `;
        }

          
        const goals = [
          { lvl: 2000, text: '' },
          { lvl: 3000, text: '每200级使预言惩罚降低1%。' },
          { lvl: 4000, text: '每500级获得+0.01无限抗性。' },
          { lvl: 5000, text: '每100级使已解锁的无限目标[T2]效果提高1%。' },
          { lvl: 6000, text: '每500级使腐化影响-1%。' },
          { lvl: 7000, text: '该维度中每100级使虚空碎片乘数+0.01。' },
          { lvl: 8000, text: '每1000级使奇点碎片乘数+0.01。' },
          { lvl: 9000, text: '每2000级获得+1腐化碎片。' },
          { lvl: 10000, text: '每10000级使所有维度基础层级+1。' },
          { lvl: 12500, text: '每500级降低关卡需求。' },
          { lvl: 15000, text: '每1000级使星尘获取x1.1。' },
          { lvl: 17500, text: '每500级使无限点数乘数+0.01。' },
          { lvl: 20000, text: '[D-Unlimatum]不再影响该维度。' },
        ];
      
        let result = '';
        let lockedShown = false;

        let infBonus = Math.max(Math.floor((hero.value.unlimitLevel - 1500) / 500), 0);
        let bonus = (infBonus * 5 + 1) ** 1.5;
      
        for (const g of goals) {
            if (g.lvl === 2000 && lvl >= g.lvl) {
              result += dimCard(
                `在D5中达到等级${2000 + 500 * infBonus}，获得额外经验乘数${fn(bonus)}。`,
                "#8af7ff"
              );
            }
            else if (lvl >= g.lvl) {
              result += dimCard(g.text, "#8af7ff");
            } else if (!lockedShown) {
              result += dimCard(
                `达到等级${g.lvl}以解锁新功能。`,
                "#ff8a8a"
              );
              lockedShown = true;
            }
          }
      
        return result;
    }
      

    function time_dim_sr_handle() {
        return `
        <div style="
            padding: 8px 12px;
            border-radius: 8px;
            background: rgba(150,180,255,0.12);
            border-left: 3px solid #8fb3ff;
            font-size: 14px;
            color: #aac7ff;
            margin-bottom: 10px;
            line-height: 1.25;
        ">
            ${tr('Your best time')}: ${timeFormat(hero.value.dTimeReward)}
        </div>
        `;
    }

    function timeFormat(t) {
        if (isNaN(t) || t == null) return '00:00';
      
        const sec = Math.floor(t % 60).toString().padStart(2, '0');
        const min = Math.floor((t / 60) % 60).toString().padStart(2, '0');
        const hr  = Math.floor((t / 3600) % 24).toString().padStart(2, '0');
        const days = Math.floor(t / 86400);
      
        if (days > 0) {
          return `${days}d ${hr}:${min}:${sec}`;
        } else if (hr !== '00') {
          return `${hr}:${min}:${sec}`;
        } else {
          return `${min}:${sec}`;
        }
    }

    function dTime(){
      if (hero.value.dTimeReward > 0) {
        const time = hero.value.dTimeReward;
        const speedMult = time <= 60 ? 2 : 1;
    
        const afkPercent = Math.max(Math.min((15 / Math.log(Math.max(time, 3))) * speedMult, 10), 1);
        const afkDuration = Math.min((7.5 / Math.sqrt(Math.max(time, 3))) * speedMult, 5);
    
        return `奖励：每击杀${Math.round(100 / afkPercent)}个敌人，获得${afkDuration.toFixed(1)}秒离线加速。<br>`;
      } else {
        return `奖励：0%几率获得0秒离线加速。<br>`;
      }
    }

    return {
        setNormalCard
    }
}
