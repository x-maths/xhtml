# P5.js 动画渲染系统使用指南

## 概述

本系统支持通过配置文件动态加载和渲染 p5.js 动画,提供了多种灵活的代码加载方式。

## 配置结构

### 1. 在内容中声明 p5 动画

在 `stages[].content[]` 数组中添加 p5 类型的内容项:

```json
{
  "type": "p5",
  "title": "可视化演示",
  "containerId": "remainder-demo",
  "caption": "10 ÷ 3 = 3 ... 1",
  "sketchId": "remainderSketch"
}
```

**字段说明:**

- `type`: 必须为 `"p5"`
- `title`: 动画标题,显示在动画上方
- `containerId`: 动画容器的 DOM ID,必须唯一
- `caption`: 可选,动画下方的说明文字
- `sketchId`: sketch 标识符,用于关联 `p5Sketches` 配置

### 2. 在 p5Sketches 中定义动画代码

在配置文件的 `p5Sketches` 数组中定义动画的实现代码:

```json
{
  "p5Sketches": [
    {
      "id": "remainderSketch",
      "description": "余数演示动画",
      "containerId": "remainder-demo",
      "params": {
        "totalApples": 10,
        "totalKids": 3
      },
      "code": "..."
    }
  ]
}
```

**字段说明:**

- `id`: sketch 唯一标识符,与内容中的 `sketchId` 对应
- `description`: 可选,sketch 描述
- `containerId`: 可选,如果指定则覆盖自动查找的容器 ID
- `params`: 可选,传递给 sketch 的参数对象
- `code`: 方式 1 - 内联代码字符串
- `codeUrl`: 方式 2 - 外部代码文件 URL
- `sketchFunction`: 方式 3 - 全局函数名或函数引用

## 代码加载方式

### 方式 1: 内联代码 (推荐用于配置文件)

直接在配置中嵌入 sketch 代码:

```json
{
  "id": "remainderSketch",
  "code": "(function(p, containerId, params) {\n  p.setup = function() {\n    const canvas = p.createCanvas(400, 300);\n    canvas.parent(containerId);\n  };\n  p.draw = function() {\n    p.background(220);\n  };\n})"
}
```

**代码格式要求:**

- 必须是一个立即执行函数表达式 (IIFE)
- 函数签名: `(p, containerId, params) => { ... }`
- 参数说明:
  - `p`: p5.js 实例对象
  - `containerId`: 容器 DOM ID 字符串
  - `params`: 从配置传入的参数对象

**示例:**

```javascript
(function (p, containerId, params) {
  const totalApples = params.totalApples || 10;

  p.setup = function () {
    const canvas = p.createCanvas(400, 300);
    canvas.parent(containerId);
  };

  p.draw = function () {
    p.background(20, 25, 50);
    p.fill(255);
    p.text(`Total: ${totalApples}`, 10, 20);
  };
});
```

### 方式 2: 外部文件 URL (推荐用于复杂动画)

从外部 JavaScript 文件加载代码:

```json
{
  "id": "remainderSketch",
  "codeUrl": "https://example.com/sketches/remainder-sketch.js",
  "params": {
    "totalApples": 10
  }
}
```

**外部文件格式:**

```javascript
// remainder-sketch.js
(function(p, containerId, params) {
  // sketch 实现代码
  p.setup = function() { ... };
  p.draw = function() { ... };
})
```

### 方式 3: 全局函数引用

引用页面中已定义的全局函数:

```json
{
  "id": "remainderSketch",
  "sketchFunction": "remainderSketch"
}
```

在 HTML 中定义:

```html
<script>
  function remainderSketch(p, containerId, params) {
    p.setup = function() { ... };
    p.draw = function() { ... };
  }
</script>
```

### 方式 4: 自动查找

如果只指定 `id`,系统会自动从全局作用域查找同名函数:

```json
{
  "id": "remainderSketch"
}
```

## 完整示例

### 配置文件示例

```json
{
  "stages": [
    {
      "content": [
        {
          "type": "dialogue",
          "speaker": "teacher",
          "content": "让我们看一个动画演示"
        },
        {
          "type": "p5",
          "title": "余数可视化",
          "containerId": "demo-1",
          "caption": "10 ÷ 3 = 3 ... 1",
          "sketchId": "remainderSketch"
        }
      ]
    }
  ],
  "p5Sketches": [
    {
      "id": "remainderSketch",
      "description": "余数演示动画",
      "params": {
        "totalApples": 10,
        "totalKids": 3,
        "animationSpeed": 60
      },
      "code": "(function(p, containerId, params) {\n  const { totalApples, totalKids, animationSpeed } = params;\n  \n  p.setup = function() {\n    const container = document.getElementById(containerId);\n    const width = container ? container.clientWidth - 20 : 400;\n    const canvas = p.createCanvas(width, 300);\n    canvas.parent(containerId);\n  };\n  \n  p.draw = function() {\n    p.background(20, 25, 50);\n    // 动画逻辑...\n  };\n  \n  p.windowResized = function() {\n    const container = document.getElementById(containerId);\n    if (container) {\n      p.resizeCanvas(container.clientWidth - 20, 300);\n    }\n  };\n})"
    }
  ]
}
```

## 最佳实践

### 1. 响应式设计

始终根据容器大小调整画布:

```javascript
p.setup = function () {
  const container = document.getElementById(containerId);
  const width = container ? Math.min(400, container.clientWidth - 20) : 400;
  const canvas = p.createCanvas(width, 300);
  canvas.parent(containerId);
};

p.windowResized = function () {
  const container = document.getElementById(containerId);
  if (container) {
    const width = Math.min(400, container.clientWidth - 20);
    p.resizeCanvas(width, 300);
  }
};
```

### 2. 参数化配置

使用 `params` 使动画可配置:

```javascript
(function (p, containerId, params) {
  // 提供默认值
  const config = {
    totalItems: params.totalItems || 10,
    groups: params.groups || 3,
    speed: params.speed || 60,
    colors: params.colors || ["#00d4ff", "#7c3aed"],
  };

  // 使用配置...
});
```

### 3. 性能优化

- 避免在 `draw()` 中创建新对象
- 使用对象池复用对象
- 必要时使用 `noLoop()` 停止动画

```javascript
let objects = [];

p.setup = function () {
  // 预创建对象
  for (let i = 0; i < 100; i++) {
    objects.push({ x: 0, y: 0, active: false });
  }
};

p.draw = function () {
  // 复用对象而不是创建新对象
  if (animationComplete) {
    p.noLoop(); // 停止不必要的渲染
  }
};
```

### 4. 错误处理

在关键操作中添加错误处理:

```javascript
p.setup = function () {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`容器 ${containerId} 不存在`);
      return;
    }
    const canvas = p.createCanvas(400, 300);
    canvas.parent(containerId);
  } catch (error) {
    console.error("初始化失败:", error);
  }
};
```

## 调试技巧

### 1. 控制台日志

系统会自动输出初始化日志:

- ✅ 成功: `P5 sketch "sketchId" 初始化成功`
- ❌ 失败: `P5 sketch "sketchId" 初始化失败: [错误信息]`

### 2. 访问 p5 实例

每个 sketch 实例会存储在全局变量中:

```javascript
// 在浏览器控制台中
window.p5_remainderSketch; // 访问 sketch 实例
```

### 3. 查看配置映射

```javascript
// 查看所有 p5 配置
window.p5ConfigMap;
```

## 常见问题

### Q: 动画不显示?

1. 检查 `containerId` 是否正确
2. 检查控制台是否有错误信息
3. 确认 sketch 代码格式正确
4. 验证 `canvas.parent(containerId)` 是否执行

### Q: 如何传递复杂参数?

使用 `params` 对象传递任何 JSON 可序列化的数据:

```json
{
  "params": {
    "data": [1, 2, 3, 4, 5],
    "config": {
      "color": "#00d4ff",
      "speed": 2
    }
  }
}
```

### Q: 如何在动画间通信?

通过全局变量或事件系统:

```javascript
// Sketch 1
window.sharedData = { value: 42 };

// Sketch 2
const data = window.sharedData;
```

## 使用方法

### 在 HTML 中使用

```html
<!-- 方式1: URL 参数加载配置 -->
<script>
  // template.html?config=config-with-p5-enhanced.json
</script>

<!-- 方式2: 直接在页面中定义配置 -->
<script>
  Object.assign(CONFIG, {
    // 配置内容...
  });
</script>
```

### 本地测试

```bash
# 启动本地服务器
python -m http.server 8000

# 访问
http://localhost:8000/template.html?config=config-with-p5-enhanced.json
```

## 示例文件

- `config-with-p5-enhanced.json` - 完整配置示例(内联代码)
- `sketches/remainder-sketch.js` - 独立 sketch 文件示例
- `template.html` - 主模板文件

## 技术细节

### 初始化流程

1. 页面加载 → `loadConfig()`
2. 渲染内容 → `renderP5()` 注册配置到 `p5ConfigMap`
3. 初始化动画 → `initializeP5Sketches()`
4. 对每个 sketch:
   - 加载代码 (内联/URL/全局)
   - 创建 sketch 函数
   - 查找容器 ID
   - 创建 p5 实例
   - 存储实例引用

### 代码执行上下文

- 使用 `Function` 构造器动态创建函数
- 函数在全局作用域执行
- 可访问 `window` 对象和所有全局变量
- sketch 函数会自动注册到 `window[sketchId]`
