# 数学冒险模板使用说明

## 概述

`template.html` 是一个支持动态内容加载的交互式教学页面模板，基于 `07.html` 和 `02.html` 归纳而成。该模板采用配置驱动的方式，可以通过 JSON 配置文件或内嵌配置对象来动态生成教学内容。

## 核心特性

### 1. 主题系统

- **暗色主题**（默认）：赛博朋克风格
- **亮色主题**：通过 URL 参数 `?theme=light` 切换
- 支持 CSS 变量自定义主题颜色

### 2. 游戏化元素

- **能量条系统**：完成关卡获得经验值
- **对话系统**：老师和学生的互动对话
- **关卡系统**：选择题形式的知识测试
- **Boss 战**：终极挑战关卡
- **烟花效果**：完成任务的庆祝动画

### 3. 视觉效果

- **星空背景**：p5.js 动态星空动画
- **霓虹特效**：赛博朋克风格的发光效果
- **扫描线动画**：科技感扫描效果
- **按钮动效**：悬停、点击、正确/错误反馈

### 4. 音频支持

- 背景音乐播放
- 右下角音频控制按钮
- 播放时旋转动画

## 使用方法

### 方法一：内嵌配置（推荐用于简单场景）

直接修改 `template.html` 中的 `CONFIG` 对象：

```javascript
const CONFIG = {
  title: "数学冒险：余数星球探索",
  subtitle: "[ MISSION: 解锁同余定理的秘密 ]",
  missionIcon: "📡",
  energyLabel: "知识能量",
  audioUrl: "https://example.com/audio.wav",
  missionBrief: ["欢迎来到余数星球！", "完成对话特训，解锁终极秘密！"],
  stages: [
    // 阶段配置...
  ],
  summary: [
    // 总结配置...
  ],
};
```

### 方法二：外部配置文件（推荐用于复杂场景）

1. 创建 JSON 配置文件（参考 `config-example.json`）
2. 通过 URL 参数加载：`template.html?config=config-example.json`

## 配置结构说明

### 基本配置

```json
{
  "title": "页面标题",
  "subtitle": "副标题/任务描述",
  "missionIcon": "📡",
  "energyLabel": "能量条标签",
  "audioUrl": "音频文件URL",
  "summaryTitle": "总结标题"
}
```

### 任务简报

```json
{
  "missionBrief": ["简报第一行", "简报第二行"]
}
```

### 阶段配置

每个阶段包含多个内容项，支持以下类型：

#### 1. 对话（dialogue）

```json
{
  "type": "dialogue",
  "speaker": "teacher", // 或 "student"
  "content": "对话内容"
}
```

#### 2. 可视化演示（visualization）

```json
{
  "type": "visualization",
  "title": "演示标题",
  "containerId": "容器ID",
  "caption": "说明文字（可选）"
}
```

#### 3. 关卡（level）

```json
{
  "type": "level",
  "id": "level-1",
  "title": "⚡ 关卡标题",
  "exp": 33,
  "question": "问题描述",
  "hint": "提示信息（可选）",
  "correctAnswer": 2, // 或字符串
  "gridCols": 4, // 选项列数
  "buttonSize": "text-lg", // 按钮文字大小
  "options": [
    { "label": "选项A", "value": 1 },
    { "label": "选项B", "value": 2 }
  ],
  "feedback": "正确答案的反馈"
}
```

#### 4. Boss 战（boss）

```json
{
  "type": "boss",
  "title": "Ω Boss标题",
  "description": "Boss描述",
  "hint": "提示信息（可选）",
  "correctAnswer": "答案",
  "options": [
    { "label": "选项A", "value": "A" },
    { "label": "选项B", "value": "B" }
  ],
  "successMessage": "成功消息",
  "successDetail": "成功详情（可选）"
}
```

### 总结配置

```json
{
  "summary": [
    {
      "title": "[ 知识点标题 ]",
      "content": "知识点内容"
    }
  ]
}
```

## 完整示例

参见 `config-example.json` 文件，展示了一个完整的余数星球探索课程配置。

## 扩展功能

### 添加自定义可视化

在配置中添加可视化后，需要在页面加载后初始化 p5.js 实例：

```javascript
CONFIG.visualizations = [
  {
    initFunction: function () {
      const sketch = function (p) {
        p.setup = function () {
          const canvas = p.createCanvas(400, 300);
          canvas.parent("your-container-id");
        };
        p.draw = function () {
          // 绘制逻辑
        };
      };
      new p5(sketch);
    },
  },
];
```

## 主题定制

修改 CSS 变量来自定义主题颜色：

```css
.dark-theme {
  --bg-primary: #0a0e27;
  --bg-secondary: #161b33;
  --text-primary: #e0e7ff;
  --accent-1: #00ffff;
  --accent-2: #a855f7;
  /* ... */
}
```

## 浏览器兼容性

- 现代浏览器（Chrome, Firefox, Safari, Edge）
- 需要支持 ES6+ 语法
- 需要支持 CSS Grid 和 Flexbox

## 依赖库

- **Tailwind CSS 4**：样式框架
- **p5.js 2.1.1**：可视化和动画
- **MathJax 4**：数学公式渲染（可选）
- **Google Fonts - Orbitron**：字体

## 技术栈

- HTML5
- CSS3（CSS Variables, Animations）
- JavaScript ES6+
- p5.js
- Tailwind CSS

## 最佳实践

1. **配置文件管理**：为不同课程创建独立的配置文件
2. **模块化内容**：将复杂课程拆分为多个阶段
3. **渐进式难度**：从简单对话到关卡再到 Boss 战
4. **即时反馈**：每个关卡提供清晰的正确/错误反馈
5. **视觉一致性**：保持统一的设计风格和配色方案

## 常见问题

### Q: 如何修改能量条的总值？

A: 修改 `totalEnergy` 常量，并相应调整各关卡的 `exp` 值。

### Q: 如何禁用音频功能？

A: 将 `audioUrl` 设置为空字符串，或隐藏音频控制按钮。

### Q: 如何添加更多对话角色？

A: 扩展 `renderDialogue` 函数，添加新的角色类型和样式。

### Q: 配置文件加载失败怎么办？

A: 检查浏览器控制台错误信息，确保 JSON 格式正确且文件路径可访问。

## 许可证

本模板基于原始文件 `07.html` 和 `02.html` 归纳而成，保留原有功能和设计风格。
