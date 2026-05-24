export type Hobby = {
  id: string
  name: string
  category: string
  brief: string
  detail: string
  image: string
}

export const hobbies: Hobby[] = [
  {
    id: "mechanical-keyboard",
    name: "机械键盘",
    category: "数码",
    brief: "指尖上的仪式感，每一把都有独特的灵魂。",
    detail: "从 Cherry 青轴入坑，到如今收藏了十几把不同配列和轴体的键盘。最喜欢的是 75% 配列 + 金粉轴 V2 的组合，打字声像雨点打在窗户上。每次换一套新键帽，就像换了个新桌面。客制化不只是烧钱，更是对「打字」这件事的尊重。",
    image: "/images/art-01.jpg",
  },
  {
    id: "gaming-mouse",
    name: "游戏鼠标",
    category: "数码",
    brief: "一个好的鼠标，是手的延伸。",
    detail: "从最早的双飞燕到现在的无线轻量化，鼠标的进化见证了游戏外设的发展。现在用的是 60g 超轻无线鼠，握在手里几乎感觉不到重量。PAW3395 传感器、4K 回报率、热插拔微动，这些参数背后的体验提升是实实在在的。打 FPS 的时候，一个跟手的鼠标比什么都重要。",
    image: "/images/react-01.png",
  },
  {
    id: "tea-set",
    name: "茶具收藏",
    category: "生活",
    brief: "一个人的下午，一壶茶，一段代码。",
    detail: "写代码的间隙，泡一壶铁观音或者凤凰单丛是最好的休息。陆续收了几把紫砂壶和几个建盏，每一只都有自己的性格。用久了壶壁会沁出茶香，这是工业品永远无法替代的温度。最近的新宠是一只龙泉青瓷的小茶杯，釉色像雨后的天空。",
    image: "/images/art-02.jpg",
  },
  {
    id: "figures",
    name: "手办模型",
    category: "收藏",
    brief: "把喜欢的角色留在书桌上。",
    detail: "书桌角落摆了七八个景品和一番赏，不算多但都是心头好。每次看番看到特别喜欢的角色就忍不住下手。拼装模型则是另一种乐趣，从剪下零件到渗线水贴消光，一坐就是四五个小时。成品摆在显示器旁边，写 bug 的时候看一眼，心情会好很多。",
    image: "/images/art-03.jpg",
  },
  {
    id: "headphones",
    name: "耳机 & 前端",
    category: "数码",
    brief: "耳朵是不会说谎的，好的声音值得投入。",
    detail: "从手机自带耳机到入门 Hi-Fi，这条路走了三年。目前日常组合是 AKG K701 + 一台小胆放，听女声和弦乐特别毒。出门就 AirPods Pro，方便够用。也短暂拥有过 HD600 和 DT880，但最后还是留下了 K701 —— 那种通透的高频听一次就回不去了。",
    image: "/images/art-04.jpg",
  },
  {
    id: "notebooks",
    name: "手账 & 文具",
    category: "生活",
    brief: "纸和笔，是数字时代最后的浪漫。",
    detail: "虽然天天对着屏幕，但纸笔永远是我思考的第一选择。手边常备一本 Midori MD 方格本和一支 LAMY Safari，开会或者想问题的时候随手画。每年还会买一本ほぼ日手帐，虽然经常空窗但翻一翻还是很有成就感。墨水也有五六瓶，山栗和月夜是最常用的两个颜色。",
    image: "/images/art-01.jpg",
  },
  {
    id: "camera",
    name: "胶片摄影",
    category: "生活",
    brief: "按下快门的那一刻，时间就凝固了。",
    detail: "有一台尼康 FM2，纯机械，连电池都不用。每卷 36 张，每一张都要认真对待。从测光到构图到对焦，整个流程慢下来之后反而更能捕捉到想拍的东西。最近在尝试自己冲洗黑白卷，暗房里那盏红灯下看到影像慢慢浮现的感觉，妙不可言。",
    image: "/images/art-02.jpg",
  },
]

export const hobbyCategories = ["全部", ...Array.from(new Set(hobbies.map((h) => h.category)))]
