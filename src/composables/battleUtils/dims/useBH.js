import { useHero } from "../../useHero";
import { useEnemy } from "../../useEnemy.js";
import { usePlayer } from "../../utils/playerSetup.js";

import { dGravityHandler } from "../global/dGravityHandler.js";
import { fn } from "../../utils/global.js";


export const useBH = () => {
    const { hero } = useHero();
    const { enemy } = useEnemy();
    const { player } = usePlayer();

    const bhReq = [1, 3, 8, 30, 200, 1000];

    function bhTrial() {
        let str = ``;
        
        
        const tier = hero.value.bhTier;
      
        if(hero.value.tr.count >= bhReq[tier])
          hero.value.isBhBoss = true;
        
        if (!hero.value.isBhBoss) {
          str += `<span style="color: #a3ffe0">达到超越${bhReq[tier]}后，可进入黑洞。</span><br>`;
          if (tier === 0) {
            str += `<span style="color: yellow">在主维度达到70,000真实等级。</span>`;
          }
          return str;
        }

        str += `<span style="color: cyan; font-weight: bold">Black Hole [T${tier}]</span><br><br>`;
      
        if (tier >= 5) {
          str += `直面不朽的引力统治者。对其造成足够伤害，以获得相称的奖励。<br><br>`
          str += `已造成总伤害：<b style="color: gold">[${fn(hero.value.gravity.bhMaxDmg)}]</b><br><br>`
          str += dGravity();

          return str;
        }
      
       
        str += `<span style="color: #cccccc">
            潜入由<span style="color: cyan">[D-Gravity]</span>统治的黑洞黑暗深处，直面
            <span style="color: cyan">奇点体</span>。
            它们的每次攻击都会比上一次更强。
            当你死亡时，你的<span style="color: cyan">超越</span>会被摧毁，
            并且你会返回主维度。
        </span><br><br>`;
      
        const baseRewards = [
          `<span style="color: rgb(111, 245, 200)">+75奇点等级</span>`,
          `<span style="color: gold">+0.05无限点数乘数</span>`,
          `<span style="color: lightblue">等级冲刺与关卡冲刺：+5%</span>`,
        ];
      
        const uniqueRewards = {
          0: `<span style="color: red">增益：黑色冲动[T1]</span><br>
              每次<span style="color: cyan">超越</span>使<span style="color: lime"><b>+0.1</b>最高等级乘数</span><br>
              <span style="color: gold">初始拥有1000万星尘</span>`,
          1: `<span style="color: red">增益：黑色冲动[T2]</span><br>
              每次<span style="color: cyan">超越</span>使<span style="color: red">伤害</span>乘数<b style="color: lime">+1.05</b><br>
              <span style="color: gold">解锁自动锻造</span>`,
          2: `<span style="color: red">增益：黑色冲动[T3]</span><br>
              <span style="color: lightgreen">每次<span style="color: cyan">超越</span>使最低等级<b>+1</b></span><br>
              <span style="color: gold">解锁空间-无限</span>`,
          3: `<span style="color: red">增益：黑色冲动[T4]</span><br>
              每次<span style="color: cyan">超越</span>使<span style="color: orange">无限点数乘数</span><b style="color: lime">+0.005</b><br>
              <span style="color: gold">解锁时间线</span>`,
          4: `每次<span style="color: cyan">超越</span>使<span style="color:#e600ff">腐化影响</span><b style="color: lime">-0.5%</b><br>
              <span style="color: cyan">解锁奇点碎片</span>`,
        };

        
      
        str += `<span style="color: #a3ffe0">奖励：</span><br>`;
        [...baseRewards, uniqueRewards[tier]].forEach(r => {
          str += `${r}<br>`;
        });
      
        return str;
    }

    function dGravity () {
      const dmgReward = [
        {
          reward: `奇点[D-S]关卡需求降低[]`,
          req: `达到[]伤害以提升此奖励`
        },
        {
          reward: `虚空碎片乘数[]`,
          req: `达到[]伤害以提升此奖励`,
        },
        {
          reward: '[%]的超越力量扩散到所有维度',
          req: `达到[]伤害以提升此奖励`,
        },
        {
          reward: "[^]星尘获取",
          req: `达到[]伤害以提升此奖励`,
        },
        {
          reward: '奇点碎片乘数[]',
          req: `达到[]伤害以提升此奖励`,
        },
        
        {
          reward: "[]腐化碎片",
          req: `达到[]伤害以提升此奖励`,
        },
        
      ]

      const rewards = dmgReward.map((r, i) => {

        const data = dGravityHandler(i, hero);
      
        let reward = r.reward;
        let req = r.req;
      
        reward = reward.replace('[]', `[${fn(data.v)}]`);
        reward = reward.replace('[^]', `[^${fn(data.v)}]`);
        reward = reward.replace('[%]', `[${fn(data.v)}%]`);
      
        req = req.replace('[]', fn(data.req));
      
        return `
          <div style="
            margin-top:8px;
            padding:10px;

            border-radius:12px;

            background:
              linear-gradient(
                135deg,
                rgba(20,30,40,0.85),
                rgba(10,15,25,0.95)
              );

            border:1px solid rgba(163,255,224,0.15);

            box-shadow:
              0 0 12px rgba(0,255,200,0.08),
              inset 0 0 18px rgba(163,255,224,0.05);
          ">

            <div style="
              color:#a3ffe0;
              font-weight:700;
              font-size:14px;

              text-shadow:
                0 0 10px rgba(163,255,224,0.25);
            ">
              ${reward}
            </div>

            <div style="
              margin-top:4px;

              color:#8b9bb4;
              font-size:12px;
              line-height:1.4;
            ">
              ${req}
            </div>

          </div>
        `;
      });

      

      return rewards.join("");
    }

    return {
        bhTrial
    }
}
