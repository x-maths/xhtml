# P5.js 渲染优化说明

## 优化内容

### 1. **加载状态提示**

- 在 p5 容器中添加了"⏳ 加载动画中..."提示
- 设置了最小高度（200px）避免布局跳动
- 使用 flexbox 居中显示加载提示

### 2. **改进的初始化逻辑**

- 添加了 100ms 延迟，确保 DOM 完全渲染后再初始化 p5
- 支持多种方式引用 sketch 函数：
  - 直接传递函数引用：`sketchFunction: remainderSketch`
  - 传递函数名字符串：`sketchFunction: "remainderSketch"`
  - 通过 sketch.id 自动查找：`id: "remainderSketch"`

### 3. **错误处理**

- 添加了 try-catch 包裹每个 sketch 的初始化
- 在控制台输出详细的成功/失败信息
- 使用 emoji 图标（✅/❌）使日志更易读

### 4. **实例管理**

- 将 p5 实例存储到全局作用域：`window.p5_${sketchId}`
- 方便后续控制动画（暂停、重置等）

### 5. **容器检查**

- 在 sketch 的 setup 函数中检查容器是否存在
- 避免因容器未找到导致的错误

## 使用方式

### 方式一：直接引用函数（推荐）

```javascript
// 1. 定义sketch函数
const mySketch = function (p) {
  p.setup = function () {
    const container = document.getElementById("my-demo");
    if (!container) return;
    const canvas = p.createCanvas(400, 300);
    canvas.parent("my-demo");
  };
  p.draw = function () {
    p.background(220);
  };
};

// 2. 在配置中引用
const CONFIG = {
  p5Sketches: [
    {
      id: "mySketch",
      sketchFunction: mySketch, // 直接引用
    },
  ],
};
```

### 方式二：使用字符串名称

```javascript
// 1. 定义sketch函数（必须是全局变量）
window.mySketch = function (p) {
  // ...
};

// 2. 在配置中使用字符串
const CONFIG = {
  p5Sketches: [
    {
      id: "mySketch",
      sketchFunction: "mySketch", // 字符串引用
    },
  ],
};
```

### 方式三：仅使用 ID（自动查找）

```javascript
// 1. 定义sketch函数（名称必须与ID匹配）
window.remainderSketch = function (p) {
  // ...
};

// 2. 在配置中只提供ID
const CONFIG = {
  p5Sketches: [
    {
      id: "remainderSketch", // 自动从window.remainderSketch查找
    },
  ],
};
```

## 配置结构

### p5 内容配置

```json
{
  "type": "p5",
  "title": "动画标题",
  "containerId": "unique-container-id",
  "caption": "说明文字（可选）",
  "sketchId": "sketch标识符（可选，用于关联）"
}
```

### p5Sketches 配置

```javascript
{
  id: "sketchName",              // 必需：sketch标识符
  sketchFunction: functionRef,   // 可选：函数引用或字符串
  description: "描述"            // 可选：sketch描述
}
```

## 控制动画

### 访问 p5 实例

```javascript
// 通过ID访问实例
const p5Instance = window.p5_remainderSketch;

// 暂停动画
if (p5Instance) {
  p5Instance.noLoop();
}

// 恢复动画
if (p5Instance) {
  p5Instance.loop();
}

// 重置动画（需要在sketch中实现reset方法）
if (p5Instance && typeof p5Instance.reset === "function") {
  p5Instance.reset();
}
```

### 在 sketch 中添加控制方法

```javascript
const mySketch = function (p) {
  let animationStep = 0;

  p.setup = function () {
    // ...
  };

  p.draw = function () {
    // ...
  };

  // 添加自定义重置方法
  p.reset = function () {
    animationStep = 0;
    // 重置其他状态
  };
};
```

## 调试技巧

### 1. 检查控制台日志

打开浏览器控制台，查看 p5 初始化信息：

- ✅ 表示成功
- ❌ 表示失败，并显示错误详情

### 2. 检查容器是否存在

```javascript
p.setup = function () {
  const container = document.getElementById("my-container");
  if (!container) {
    console.error("容器未找到: my-container");
    return;
  }
  // ...
};
```

### 3. 检查 sketch 函数是否正确定义

```javascript
console.log("remainderSketch类型:", typeof remainderSketch);
console.log("window.remainderSketch类型:", typeof window.remainderSketch);
```

## 常见问题

### Q: 动画不显示，控制台显示"函数未找到"

A: 确保 sketch 函数在 CONFIG 定义之前声明，或者使用全局变量。

### Q: 动画显示但容器很小

A: 检查容器的 min-height 设置，确保有足够的空间。

### Q: 动画加载很慢

A: 这是正常的，因为有 100ms 延迟确保 DOM 渲染。如果需要更快，可以减少延迟时间。

### Q: 如何在同一页面添加多个动画？

A: 为每个动画使用不同的 containerId 和 sketchId：

```javascript
CONFIG.p5Sketches = [
  { id: "sketch1", sketchFunction: sketch1Func },
  { id: "sketch2", sketchFunction: sketch2Func },
];
```

## 性能优化建议

1. **限制帧率**：如果不需要 60fps，可以降低帧率

   ```javascript
   p.setup = function () {
     p.frameRate(30); // 降低到30fps
   };
   ```

2. **避免重复创建对象**：在 draw()外部创建对象，在 draw()内部重用

3. **使用对象池**：对于大量动态对象，使用对象池模式

4. **条件渲染**：只在必要时更新画面
   ```javascript
   p.draw = function () {
     if (!needsUpdate) return;
     // 绘制逻辑
   };
   ```

## 示例文件

- `template-p5-optimized.html` - 完整的优化示例
- `p5-example.html` - 简单的独立示例
- `template-p5-demo.html` - 基础示例（已修复语法错误）
