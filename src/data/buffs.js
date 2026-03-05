import { reactive, ref } from 'vue';
import { dimensions } from './dimensions';

const buffs = ref([
    {
      id: 0,
      name: '隐形',
      description: [
        "被敌人命中时有33%概率使防御翻倍",
        "35%概率将敌人一次攻击降为1点伤害",
        "你的防御免疫穿透",
        "你免疫眩晕",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4000, 85000, 1.5e9, 1e12, 1e16],
      active: false,
      ptr: 0,
      def: 1,
      nextTierReq: '在TIER-R中解锁'
    },
    {
      id: 1,
      name: '先发制人',
      description: [
        "首次攻击造成双倍伤害",
        "首次攻击必定暴击",
        "首次攻击使敌人眩晕1秒",
        "首次攻击时攻速条初始为25%",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [10000, 500000, 1e14, 1e18],
      active: false,
      used: false,
      usedSkill: false,
      usedAPS: false,
      stun: 0,
      nextTierReq: '维度32 [T6]',
    },
    {
      id: 2,
      name: '旅者',
      description: [
        "[X3] 装备掉率",
        "[X3] 灵魂出现概率",
        "[X1.5] 飞升碎片 与 [X3] 经验",
        "[X2] 星尘与突变因子",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [12500, 120000, 1e12, 1e15, 1e20],
      active: false,
      nextTierReq: '维度32 [T8]'
    },
    {
        id: 3,
        name: '连击',
        description: [
          "每层连击+1%伤害[上限30]；每次命中+1连击；被敌人命中时连击重置",
          "每层连击+1.25%伤害[上限40]；每次命中+1连击[50%概率额外+1]；被命中时连击保留25%",
          "每层连击+1.5%伤害[上限50]；每次命中+1.5连击；被命中时连击保留50%",
          "每层连击+1.75%伤害[上限100]；每次命中+2连击；被敌人击杀时连击重置；连击满层时+0.3攻速",
          "最大阶"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [12000, 60000, 5e7, 1e9, 1e15],
        active: false,
        combo: 0,
        hit: false,
        nextTierReq: 'SP: 81'
    },
    {
        id: 4,
        name: '血技',
        description: [
          "每秒回复等同当前关卡数值的生命",
          "击杀敌人时回复5%最大生命",
          "每秒回复5%最大生命",
          "每次攻击后回复2%最大生命+[当前关卡]",
          "最大阶"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [5000, 150000, 1e9, 1e12, 1e20],
        active: false,
        time: 0,
        nextTierReq: 'SP: 65'
    },
    {
        id: 5,
        name: '迅斩',
        description: [
          "额外攻击1次；-0.8攻速",
          "25%概率再额外攻击1次；-0.7攻速",
          "独立25%概率再额外攻击1次；-0.6攻速",
          "最大阶"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [6500000, 3e8, 1e9, 1e14, 1e20],
        active: false,
        debuff: 0,
        stuck: 0
    },
    {
        id: 6,
        name: '充能',
        description: [
          `每层奇点阶级+1最大阶；
          命中时有25%概率获得随机充能（每阶+1%）；
          被命中时有50%概率失去随机充能（每阶-2%）；
          最大充能：1（每阶+1）；
          力量充能：+5%伤害、+0.1攻速；能量充能：+1暴击、+5暴伤；生命充能：+5%生命、+5%防御。`
        ],
        tier: 1,
        maxTier: 1,
        exp: 0,
        maxExp: [1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 1e19, 1e20],
        active: false,
        charges: {
          power: 0,
          energy: 0,
          life: 0,
        }
      },
      {
        id: 7,
        name: '溢出击杀',
        description: [
          "+1 溢出击杀",
          "每100最大等级 +1 溢出击杀",
          "每50等级 +1 溢出击杀",
          "每次溢出击杀有10%概率获得经验与武器掉率加成",
          "最大阶"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [225000, 1625000, 1e10, 1e12, 1e17],
        active: false,
        nextTierReq: '奇点[T0]'
      },
      {
      id: 8,
        name: '征服',
        description: [
          "每秒+0.1%生命[上限500秒]",
          "每秒+0.1%伤害[上限750秒]",
          "每250秒+0.1攻速[上限1000秒]",
          "每50秒+1%敌人弱点[上限1250秒]；初始250秒",
          "最大阶"
        ],
        tier: 1,
        maxTier: 3,
        exp: 0,
        maxExp: [250000, 2.5e6, 1e10, 1e11, 1e15],
        active: false,
        time: 0,
        spaceTime: 0,
        nextTierReq: '在TIER-S中解锁'
      },
      {
      id: 9,
      name: '灵活',
      description: [
        "10%概率闪避敌人命中",
        "20%概率闪避敌人命中",
        "闪避判定进行两次",
        "每次成功闪避后+4%闪避率",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      times: 0,
      maxExp: [800000, 2e7, 1e15, 1e18, 1e22],
      active: false,
      nextTierReq: '维度32 [T12]'
    },
    {
      id: 10,
      name: '额外生命',
      description: [
        `${35}% 概率在死亡后以50%生命复苏`,
        "复苏后8秒内+50%伤害与100%防御",
        "复苏后3秒内免疫一切伤害",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [2e6, 1e7, 1e8, 1e12, 1e18],
      active: false,
      rise: 1,
      buffT2: 0,
      buffT3: 0,
      buffT3HP : 0,
    },
    {
      id: 11,
      name: '狙击手',
      description: [
        "+15%暴击率，+75%暴击伤害",
        "若暴击率超过100%，额外造成一次双倍伤害",
        "暴击率判定进行两次",
        "当本次命中为暴击时，无视敌人闪避",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [2e6, 1e7, 1e10, 1e11, 1e18],
      active: false,
      hit: false,
      nextTierReq: 'SP: 133'
    },
    {
      id: 12,
      name: '狂战',
      description: [
        `低生命，高伤害 -> 1:2`,
        "低生命时+15%暴击率与+75%暴击伤害",
        "生命低于30%时，每缺失10%生命回复1%生命",
        "包含狂怒机制，详情见狂怒图标",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [5e6, 1e8, 1e14, 1e16, 1e18],
      active: false,
      dmg: 1,
      crit: 0,
      critDmg: 0,
      rage: 0,
      isRage: false,
      rageAttackMult: 0,
      nextTierReq: "维度[32] [T4]",
    },
    {
      id: 13,
      name: '主宰者',
      description: [
        `防御x1.5，生命x1.5，伤害x0.75`,
        "每缺失10%生命，+10%防御",
        "基于最大生命额外+5%防御",
        "完全格挡时有50%概率回复10%生命",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [4e6, 8e7, 1e14, 1e15, 1e18],
      active: false,
      nextTierReq: '维度[32] [T1]'
    },
    {
      id: 14,
      name: '闪电',
      description: [
        `你的基础攻速不低于1`,
        "每击杀1个太空首领+0.1攻速[上限0.5]",
        "每通过1关+0.01攻速[上限1]",
        "超出上限的攻速转化为额外打击概率",
        "最大阶"
      ],
      tier: 1,
      maxTier: 3,
      exp: 0,
      maxExp: [1e8, 1e10, 1e16, 1e17, 1e18],
      extraHit: 0,
      active: false,
      nextTierReq: '维度[32] [T16]'
    },
    {
      id: 15,
      name: '黑色脉冲',
      description: [
        "每次命中使双倍伤害概率+20%，累计5次后重置",
        "每次攻击有25%概率无视敌人防御；对无防御敌人造成1.5倍伤害",
        "每次命中有5%概率生成神圣护盾，使你1秒内易受攻击",
        "若你的非暴击伤害低于敌人生命值10倍，造成双倍伤害",
        "最大阶"
      ],
      tier: 1,
      maxTier: 1,
      exp: 0,
      maxExp: [1e12, 1e14, 1e16, 1e18, 1e20],
      active: false,
      hits: 0,
      defIgnore: false,
    },
    {
      id: 16,
      name: '辐照',
      description: [
        "敌人出现时损失25%最大生命",
        "敌人每次攻击都会损失1%最大生命，上限50%",
        "命中时敌人获得1层辐照。层数满时，敌人损失1%最大生命。最多10层；你受伤时重置。",
        "敌人死亡时其50%辐照层数转移给下一个敌人；你受伤时有50%层数不会丢失。",
        "最大阶"
      ],      
      tier: 1,
      maxTier: 4,
      exp: 0,
      stack: 0,
      maxExp: [1e12, 1e13, 1e14, 1e15, 1e16],
      active: false,
    },
  ]);

  export function useBuff() {
    return {buffs}
  }

