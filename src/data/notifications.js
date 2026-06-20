export const notifications = [
    {
      id: "firstBoss",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.stages.current >= 5,
  
      message: {
        text: "你已遭遇第一个 Boss。可在信息区[战斗机制]中了解更多。",
        link: {
          set: "Info",
          info: "Info",
          stat: "Boss"
        }
      }
    },

    {
      id: "abyss-1",
  
      once: false,
  
      condition: (ctx) =>
        ctx.h.isAbyss && ctx.h.abyssTier == 0 && ctx.h.stages.current >= 20,
  
      message: {
        text: "你已完成深渊[T0]。点击图标离开。",
      },

      cooldown: 2000,
    },

    {
      id: "abyss-2",
  
      once: false,
  
      condition: (ctx) =>
        ctx.h.isAbyss && ctx.h.abyssTier == 1 && ctx.h.stages.current >= 30,
  
      message: {
        text: "你已完成深渊[T1]。点击图标离开。",
      },

      cooldown: 2000,
    },

    {
      id: "abyss-3",
  
      once: false,
  
      condition: (ctx) =>
        ctx.h.isAbyss && ctx.h.abyssTier == 2 && ctx.h.stages.current >= 40,
  
      message: {
        text: "你已完成深渊[T2]。点击图标离开。",
      },

      cooldown: 2000,
    },

    {
      id: "celestialAppears",
  
      once: false,
  
      message: {
        text: "天界生物已出现。",
      },

      cooldown: 2000,
    },

    {
      id: "firstCorruption",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.spaceUnlocked,
  
      message: {
        text: "你的世界已被未知实体侵蚀。你发现了腐化。将鼠标悬停在进度区域的图标上查看说明。"
      }
    },

    {
      id: "singLevel",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singularityLevels > 0,
  
      message: {
        text: "你已掌握重力的基础，抵达奇点等级。可在信息区[等级]中了解更多。"
      }
    },

    {
      id: "singTrial",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singLeft,
  
      message: {
        text: "你已离开奇点。既然它已经开启，现在无需结束它。变得更强后再回来尝试。"
      }
    },

    {
      id: "singResonance",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singularity >= 2,
  
      message: {
        text: "腐化影响了你对诅咒的感知。你解锁了共鸣。可在护符区了解更多。"
      }
    },

    {
      id: "freeTreePoints",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.tree.freePoints > 0,
  
      message: {
        text: "你已解锁免费技能树点数。可在技能树区了解更多。"
      }
    },

    {
      id: "infResistance",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.infPenalty > 0,
  
      message: {
        text: "你已解锁无限抗性。可在无限区了解更多。"
      }
    },

    {
      id: "dimShards",
  
      once: true,
  
      condition: (ctx) =>
        ctx.dim[9].infTier >= ctx.dim[9].spInfTier,
  
      message: {
        text: "你已解锁维度碎片。请在主维度的进度区域悬停转生图标查看说明。"
      }
    },

    {
      id: "perdition",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.mainInfTier >= 20,
  
      message: {
        text: "你跨越了无限之线。[D-无限]向你降下诸般沉沦。"
      }
    },

    {
      id: "advancedCurse",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.singularity >= 8,
  
      message: {
        text: "你已解锁高级诅咒。可在护符区了解更多。"
      }
    },

    {
      id: "gravityPressure",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.trueLevel >= 60000 && ctx.h.dId == 'main',
  
      message: {
        text: "你正承受重力压迫。达到 7万真实等级可获得第一次超越。"
      }
    },

    {
      id: "tr",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.trueLevel >= 70000 && ctx.h.dId == 'main',
  
      message: {
        text: "你已获得第一次超越。可在进度区了解更多。"
      }
    },

    {
      id: "bh",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.rebirthPts >= 1e7,
  
      message: {
        text: "在重力压迫下，你解锁了黑洞。可在维度图谱中找到黑洞。"
      }
    },

    {
      id: "darkDims",
  
      once: true,
  
      condition: (ctx) =>
        ctx.dim[13].infTier >= 25 && ctx.dim[22].infTier >= 35 && ctx.h.mainInfTier >= 35,
  
      message: {
        text: "你已触及暗物质。进入其中后，你打开了通往其他世界的通道，并解锁了黑暗维度。"
      }
    },

    {
      id: "quasarCores",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.mainInfTier >= 50,
  
      message: {
        text: "通过压制无限之力，你唤来了这个世界的强大力量，并解锁了类星体核心。"
      }
    },

    {
      id: "d-corr",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.mainInfTier >= 60,
  
      message: {
        text: "[D-腐化]向这个世界显现。腐化愈发集中，撕裂空间结构。你已解锁受[D-腐化]影响的维度。"
      }
    },

    {
      id: "bh-4",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.bhTier >= 4,
  
      message: {
        text: "在重力影响下，你扭曲了时间，创造出时间裂隙，并解锁了时间线。"
      }
    },

    {
      id: "bh-5",
  
      once: true,
  
      condition: (ctx) =>
        ctx.h.bhTier >= 5,
  
      message: {
        text: "通过将空间压缩到最小粒子，你创造了第一枚奇点碎片。在主维度达到关卡300以解锁新的试炼。"
      }
    },

    {
      id: "tm-complete",
  
      once: false,
  
  
      message: {
        text: "你回到了主时间线，并获得了法则之石。"
      },

      cooldown: 4000,
    },

    {
      id: "tm-auto-complete",
  
      once: false,
  
  
      message: {
        text: "自动时间线已返回主时间线，并获得了法则之石。"
      },

      cooldown: 4000,
    },

    {
        id: 'inventoryWarning',
      
        once: false,
      
        cooldown: 4000,
      
        message: {
          text: '[法则]：背包即将满。'
        }
      }
  ];

  //unlock bh
  //reach first tr

  //Magnitude information can be found in the information panel.
  //you reach your first gravity level. The req is getting much worse. Gravity levels grants double stats on level up
  //you reach certain stage in Abyss. Click on abyss icon to complete the Abyss Trial.