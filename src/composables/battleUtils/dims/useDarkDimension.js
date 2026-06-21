import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy";

import { fn } from "../../utils/global.js";

import { dimensions } from "../../../data/dimensions.js";
import { useTimeline } from "./useTimeline.js";
import { useDimensions } from "../useDimensions.js";
import { useDimHandler } from "./useDimHandler.js";
import { tr } from "../../../i18n/index.js";


export const useDarkDimension = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();

    let dId = null;

    const { getAllActiveDims } = useTimeline();
    const { getDimReward, getDimEffect, getBaseTierSourses} = useDimensions();

    const setDarkCard = (d, d_req) => {
        

        let str = `
            <div style="
            font-size: 18px;
            font-weight: 900;
            margin-bottom: 6px;
            color:rgb(245, 168, 168);
            text-shadow: 0 0 4px rgba(0,0,0,0.45);
            ">
            ${tr('Dimension')}: ${d.name} [${d.idx}]
            </div>
        `;
        
        if (d_req(d)) {
            str += reqCard(d.c);
            return str;
        }
        
        str += dimDescCard(d);

        str += infTierCardHandler(d);

        str += dimRewardCard(d);

        if(d.debuff !== '') 
            str += interventionCard(d);

        //laws
        
        return str;
    }

    function dimRewardCard(d) {
        if(d.id == 'eternity')
            return "";

        let desc = "";
        let title = "Reward";
        let baseColor = '#9cedd2';
        let baseBackground = '#111d1b';
        let baseBorder = '#ffe8df';
      
        switch (d.id) {
            case "d-overstage":
                desc = dark_energy_reward(d);
                break;
              
            case "d-unlimitted":
                desc = d_unlimitted_handle(d);
                break;
              
            case "d-noBuffs":
                desc = d_buffs_handle(d);
                break;
          
            case "d-danger":
                desc = d_danger_reward_handle(d);
                break;
          
            case "d-noSpace":
                desc = d_noSpace_reward_handle(d);
                break;
          
            case "d-damage":
                desc = d_damage_reward_handle(d);
                break;
            case "d-next":
                desc = d_next(d);
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

    const infTierCardHandler = (d) => {
        dId = d.idx;

        if(d.id == 'eternity')
            return "";
        else 
            return infinityTierCard(d.infTier);
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

      let inf = e > 0? `Infinity [T${cur} + ${e}]`: `Infinity [T${cur}]`;
      let tier = max ? `${inf}/[T${max}]` : inf;

      return tier;
    }

    function dimDescCard(d) {
        let desc = "";
        let baseColor = '#ffd3d3'
      
        switch(d.id){
          case "eternity":
            desc = dark_dimensions_handle();
            break;
          case "d-noSpace": 
            desc = d_noSpace_des_hanlde(d);
            break;
          case "d-danger": 
            desc = d_danger_des_handle(d);
            break;
          case "d-overstage":
            desc = d_overstage_des_handle(d);
            break;
          case "dimMerge":
            desc = dimmergeDesc();
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

    function interventionCard(d) {
        return `
          <div style="
            background: rgba(180, 32, 48, 0.12);
            border: 1px solid #e74c61;
            padding: 10px 12px;
            border-radius: 10px;
            margin-bottom: 12px;
            box-shadow: 0 0 8px rgba(231, 76, 97, 0.25);
          ">
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #ff7a8d;
              text-transform: uppercase;
              margin-bottom: 4px;
              letter-spacing: 0.4px;
            ">
              ${tr('Intervention')}
            </div>
      
            <div style="
              font-size: 14px;
              font-weight: 500;
              color: #e74c61;
              line-height: 1.3;
            ">
              ${tr(d.debuff)}
            </div>
          </div>
        `;
    }




    function d_noSpace_des_hanlde(d) {
        const base = d.d; 
        const required = 6 + (d.infTier * 6);
      
        return `进入空间技能被锁定的维度。天界生物更强。击败<span style='color: yellow'>${required}个空间生物</span>后，即可完成该无限层级。<br><br>`;
    }

    function d_danger_des_handle(d) {
        let danger = 1000 + 500 * d.infTier;
        let stage = 100 + 10 * d.infTier;
      
        return `
          进入<span style='color: orange'>[D-Space]</span>寄宿于<span style='color: orange'>维度巨像</span>中的维度。
          你会在关卡<span style='color: gold'>[${stage}+]</span>、危险<span style='color: gold'>[${danger}+]</span>时遭遇该实体。
          击败它即可解锁通往下一无限层级的道路，并唤醒新的黑暗维度生物。
          <br><br>
        `
    }

    function d_overstage_des_handle(d){
        return `<div>
            进入Boss被
            <span style="color:#8af7ff; font-weight:700;">晦暗者</span>取代的维度。<br>
            击杀
            <span style="color:#8af7ff; font-weight:700;">晦暗者</span>
            可获得
            <span style="color:#b0ffde; font-weight:700;">黑暗能量碎片</span>。<br>
            晦暗者总数：
            <span style="color:#f7d774; font-weight:700;">5</span> 
            <span style="color:#62f2c8;">（每个无限层级+1）</span>。<br>
            进入下一无限层级时，你会
            <span style="color:#ff6a6a; font-weight:700;">失去所有碎片</span>，
            但会获得作用于后续无限层级的
            <span style="color:#b0ffde; font-weight:700;">碎片乘数</span>。<br>
            晦暗者从
            <span style="color:#f7d774; font-weight:700;">关卡100</span>开始出现。<br>
            <span style="color:#b0ffde; font-weight:700;">黑暗能量碎片</span>
            会直接影响你的
            <span style="color:#8af7ff;">最高等级</span>。
          </div>`
    }

    function dark_dimensions_handle(){
  
        function dimCard(text, color = "#9cedd2") {
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
              ${text}
            </div>
          `;
        }
        let str = "";
      
        str += dimCard(
          "黑暗维度没有无限上限。"
        );
      
        str += dimCard(
          `你必须达到
          <span style="color:#b3ffe9;font-weight:600;">总等级1400</span>
          才能解锁下一无限层级。`
        );
      
        str += dimCard(
          "每个新的无限层级都会比上一层更困难。"
        );
      
        str += dimCard(
          "无限抗性在黑暗维度中无效。"
        );
      
        str += dimCard(
          "每个新的黑暗维度都会继承前一个维度的部分强度。"
        );
      
        str += dimCard(
          "干预效果会随该维度的无限层级提高而减弱。"
        );
      
      
      
        return str;
    }



    function dark_energy_reward(d){
        let text = ``;
      
        let percent = d.infTier;
        let totalInfs = dimensions.value.filter(d => d.id.startsWith('d-')) .reduce((sum, d) => sum + d.infTier, 0) 
      
        if(d.infTier < 10)
          text += `达到<span style="color: gold">无限[T10]</span>以解锁黑暗能量的新影响。<br>`;
        else text += `黑暗能量正在汇聚所有黑暗维度的无限之力，并获得总
        <span style="color: gold">无限层级[${totalInfs}]</span>的<span style="color: gold">${percent}%</span>作为强化。该效果会随每个无限层级提高。<br>  `;

        if(d.infTier >= 10 && d.infTier < 15)
          text += `<br>达到<span style="color: gold">无限[T15]</span>以解锁黑暗能量的新影响。<br><br>`;
        else if (d.infTier >= 15) text += `<br>你会保留最大数量的黑暗能量碎片。<br><br>`
      
        text += `<span style="color: #9cedd2">最高等级 [^${(enemy.value.darkEnergy.deTotal).toFixed(4)}]</span><br>`
      
        return text;
    }

    function d_unlimitted_handle(d) {
        
        let text = `
          奖励：削弱<span style='color: rgb(255, 88, 88)'>[D-Ultimatum]</span>
          <span style='color: gold'>[T${d.infTier}]</span>
          <span style='color: rgb(204, 102, 255)'>${getDimReward(38).current}</span> 
          -> <span style='color: gold'>[T${d.infTier + 1}]</span>
          <span style='color: rgb(204, 102, 255)'>${getDimReward(38).next}</span><br>
          
          维度[5][S5-Ω3t]经验乘数：
          <span style='color: rgb(204, 102, 255)'>${fn(getDimReward(38).expMult)}</span><br>
        `;

        if (d.infTier < 10) {
          text += `<br>达到<span style="color: gold">无限[T10]</span>以解锁新功能。`;
        } else {
          text += `<br>从无限[T10]开始，每5个无限层级削弱一次[D-Ultimatum]。<br>`;
        }

        if (d.infTier >= 20 && d.infTier < 25) {
          text += `<br>达到<span style="color: gold">无限[T25]</span>以解锁新功能。`;
        } else if (d.infTier >= 25) {
          text += `<br>黑暗维度中的无限会降低[D5]的等级需求：
          <b style="color: gold">[^${fn(getDimReward(38).lvlRed)}]</b><br>`;
        }
      
        return `<br><span style="color: #9cedd2">${text}</span><br>`;
    }

    function d_buffs_handle(d) {
        let buffTiers = [1, 4, 6, 8, 12, 16, 20, 25];
        let maxCount = 9;
        let count = Math.min(getBuffIntervalPosition(buffTiers, d.infTier), maxCount);
      
        const wrap = (text) => `<span style="color:#9cedd2">奖励：${text}</span><br>`;
      
        switch(count) {
          case 1: return wrap(`达到无限[T1]以解锁重装战士[T4]。`);
          case 2: return wrap(`达到无限[T4]以解锁狂暴[T4]。`);
          case 3: return wrap(`达到无限[T6]以解锁先发制人[T4]。`);
          case 4: return wrap(`达到无限[T8]以解锁旅行者[T4]。`);
          case 5: return wrap(`达到无限[T12]以解锁灵活[T4]。`);
          case 6: return wrap(`达到无限[T16]以解锁闪光[T4]。`);
          case 7: return wrap(`达到无限[T20]以解锁迅捷斩击[T4]。`);
          case 8: return wrap(`达到无限[T25]以解锁额外生命[T4]。`);
          case 9: return wrap(`无限[T25]之后，每个无限层级使技能经验乘数x1.25。`)
          default: return wrap(`无限[T25]之后，每个无限层级使技能经验乘数x1.25。`);
        }
    }

    function d_damage_reward_handle(d){
        let text = ``;
        if(d.infTier >= 20)
          text = `受到命中时，有50%几率不获得一层<span style="color: red">末日</span>。<br><br>`;
        else if(d.infTier >= 10)
          text = `受到命中时，有25%几率不获得一层<span style="color: red">末日</span>。<br>
          达到<span style="color: gold">无限[T20]</span>以解锁新功能。<br><br>`;
        else text = `达到<span style="color: gold">无限[T10]</span>以解锁新功能。<br><br>`;
      
      
        let warp = (text) => `<span style="color:#9cedd2">奖励：${text}</span><br>`;
      
        return text + warp(d.r);
    }

    function d_danger_reward_handle(d) {
        let warp = (text) => `<span style="color:#9cedd2">黑暗生物：<span style="color:red">${text}</span><br> |
        危险之力降低[^${1 - 0.01 * d.infTier}] | 提高黑暗生物上限</span><br>`;
      
        switch(d.infTier){
          case 0: return warp('Dreadfang');
          case 1: return warp('Voidborn Might');
          case 2: return warp('Overseer Prime');
          case 3: return warp('Baselurker');
          case 4: return warp('Infinity Bane');
          case 5: return warp('Crushdepth');
          case 6: return warp('Entropy Leech');
          case 7: return warp('Flameveil');
          case 8: return warp('Bloodhowl');
          case 9: return warp('Tormenthide');
          case 10: return warp('Plaguedozer');
          case 11: return warp('Malignhorn');

          default: return warp('所有黑暗生物均已发现。');
        }
    }

    function d_noSpace_reward_handle(d) {
        const base = d.r; 
        const weaker = (1 - 0.01 * d.infTier).toFixed(2);     
        const stardust = Math.max((Math.E * d.infTier) ** 0.45, 1).toFixed(2);  
        const count = 6 * d.infTier;

        let warp = (text) => `<span style="color:#9cedd2">奖励：${text}</span><br>`;
      
        return warp(base
          .replace(/\[\^1\]/, `[^${weaker}]`)
          .replace(/\[1\]/, `[${stardust}]`)
          .replace(/\[6\]/, `[${count}]`));
    }

    function d_next (d) {
      const tier = d.infTier;

      if (tier >= 18) 
        return `18层之后，每个层级使转生碎片获取x1.25。<b>[${fn(getDimReward(34))}]</b>`;
      else return d.r;
    }



    function getBuffIntervalPosition(arr, num) {
        if (num <= 0) return 1; 
      
        let pos = 1;
        for (let i = 0; i < arr.length; i++) {
          if (num >= arr[i]) {
            pos = i + 2; 
          } else {
            break;
          }
        }
        return pos;
    }

    return {
        setDarkCard
    }
}
