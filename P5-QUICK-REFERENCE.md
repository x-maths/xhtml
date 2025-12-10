# P5.js 动画配置快速参考

## 三种配置方式对比

### 方式 1: 内联代码 (适合简单动画)

```json
{
  "p5Sketches": [
    {
      "id": "mySketch",
      "code": "(function(p, containerId, params) { p.setup = function() { const canvas = p.createCanvas(400, 300); canvas.parent(containerId); }; p.draw = function() { p.background(220); }; })",
      "params": { "speed": 1 }
    }
  ]
}
```

**优点:** 配置文件自包含,无需额外文件
**缺点:** 代码需要转义,不易编辑

---

### 方式 2: 外部 URL (推荐,适合复杂动画)

```json
{
  "p5Sketches": [
    {
      "id": "mySketch",
      "codeUrl": "./sketches/my-sketch.js",
      "params": { "speed": 1 }
    }
  ]
}
```

**优点:** 代码独立,易于维护和版本控制
**缺点:** 需要额外的 HTTP 请求

---

### 方式 3: 全局函数 (适合页面内定义)

```json
{
  "p5Sketches": [
    {
      "id": "mySketch",
      "sketchFunction": "mySketch",
      "params": { "speed": 1 }
    }
  ]
}
```

在 HTML 中:

```html
<script>
  function mySketch(p, containerId, params) {
    p.setup = function() { ... };
    p.draw = function() { ... };
  }
</script>
```

**优点:** 直接在页面中定义,便于调试
**缺点:** 配置和代码分离

---

## Sketch 代码模板

### 基础模板

```javascript
(function (p, containerId, params) {
  // 1. 从 params 获取配置
  const config = {
    width: params.width || 400,
    height: params.height || 300,
  };

  // 2. setup 函数
  p.setup = function () {
    const canvas = p.createCanvas(config.width, config.height);
    canvas.parent(containerId);
  };

  // 3. draw 函数
  p.draw = function () {
    p.background(220);
    // 绘制逻辑...
  };

  // 4. 响应式调整 (可选)
  p.windowResized = function () {
    const container = document.getElementById(containerId);
    if (container) {
      p.resizeCanvas(container.clientWidth, config.height);
    }
  };
});
```

### 动画模板

```javascript
(function (p, containerId, params) {
  let objects = [];
  let animationStep = 0;
  let timer = 0;

  p.setup = function () {
    const canvas = p.createCanvas(400, 300);
    canvas.parent(containerId);

    // 初始化对象
    for (let i = 0; i < params.count || 10; i++) {
      objects.push({
        x: p.random(p.width),
        y: p.random(p.height),
        vx: p.random(-2, 2),
        vy: p.random(-2, 2),
      });
    }
  };

  p.draw = function () {
    p.background(20, 25, 50);

    // 更新和绘制对象
    for (let obj of objects) {
      obj.x += obj.vx;
      obj.y += obj.vy;

      // 边界检测
      if (obj.x < 0 || obj.x > p.width) obj.vx *= -1;
      if (obj.y < 0 || obj.y > p.height) obj.vy *= -1;

      // 绘制
      p.fill(100, 212, 255);
      p.ellipse(obj.x, obj.y, 20, 20);
    }
  };
});
```

### 交互模板

```javascript
(function (p, containerId, params) {
  let mousePressed = false;

  p.setup = function () {
    const canvas = p.createCanvas(400, 300);
    canvas.parent(containerId);
  };

  p.draw = function () {
    p.background(220);

    if (mousePressed) {
      p.fill(255, 0, 0);
    } else {
      p.fill(0, 255, 0);
    }

    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };

  p.mousePressed = function () {
    mousePressed = true;
  };

  p.mouseReleased = function () {
    mousePressed = false;
  };
});
```

---

## 完整配置示例

### 在内容中声明动画位置

```json
{
  "stages": [
    {
      "content": [
        {
          "type": "dialogue",
          "speaker": "teacher",
          "content": "让我们看一个动画"
        },
        {
          "type": "p5",
          "title": "动画标题",
          "containerId": "my-animation",
          "caption": "这是说明文字",
          "sketchId": "mySketch"
        }
      ]
    }
  ]
}
```

### 定义动画实现

```json
{
  "p5Sketches": [
    {
      "id": "mySketch",
      "description": "动画描述",
      "containerId": "my-animation",
      "params": {
        "customParam1": "value1",
        "customParam2": 123
      },
      "code": "..."
    }
  ]
}
```

---

## 参数传递示例

### 配置中定义参数

```json
{
  "params": {
    "totalApples": 10,
    "totalKids": 3,
    "colors": ["#ff0000", "#00ff00"],
    "speed": 60
  }
}
```

### Sketch 中使用参数

```javascript
(function (p, containerId, params) {
  // 解构并提供默认值
  const {
    totalApples = 10,
    totalKids = 3,
    colors = ["#00d4ff", "#7c3aed"],
    speed = 60,
  } = params;

  p.setup = function () {
    console.log(`苹果: ${totalApples}, 小朋友: ${totalKids}`);
    // 使用参数...
  };
});
```

---

## 调试清单

- [ ] 检查 `containerId` 是否唯一且正确
- [ ] 检查 `sketchId` 是否与 `p5Sketches[].id` 匹配
- [ ] 确认 sketch 代码格式: `(function(p, containerId, params) { ... })`
- [ ] 确认 `canvas.parent(containerId)` 已调用
- [ ] 查看浏览器控制台的初始化日志
- [ ] 检查 `window.p5ConfigMap` 是否包含配置
- [ ] 检查 `window.p5_[sketchId]` 是否存在实例

---

## 常用代码片段

### 获取容器宽度

```javascript
const container = document.getElementById(containerId);
const width = container ? Math.min(400, container.clientWidth - 20) : 400;
```

### 响应式画布

```javascript
p.windowResized = function () {
  const container = document.getElementById(containerId);
  if (container) {
    p.resizeCanvas(container.clientWidth - 20, 300);
  }
};
```

### 平滑动画

```javascript
// 使用 lerp 实现平滑移动
obj.x = p.lerp(obj.x, targetX, 0.1);
obj.y = p.lerp(obj.y, targetY, 0.1);
```

### 定时器控制

```javascript
let timer = 0;
const interval = 60; // 60 帧 = 1 秒

p.draw = function () {
  timer++;
  if (timer >= interval) {
    // 执行定时任务
    timer = 0;
  }
};
```

---

## 文件结构建议

```
xhtml/
├── template.html                    # 主模板
├── config-with-p5-enhanced.json     # 内联代码示例
├── config-external-sketch.json      # 外部代码示例
├── sketches/                        # sketch 代码目录
│   ├── remainder-sketch.js
│   ├── animation-1.js
│   └── animation-2.js
└── README-p5-system.md              # 完整文档
```

---

## 使用流程

1. **创建配置文件** (如 `my-config.json`)
2. **在 stages 中添加 p5 内容项**
3. **在 p5Sketches 中定义 sketch**
4. **选择代码加载方式** (内联/URL/全局)
5. **访问页面**: `template.html?config=my-config.json`

---

## 示例文件

查看以下文件了解完整示例:

- **内联代码**: `config-with-p5-enhanced.json`
- **外部 URL**: `config-external-sketch.json`
- **Sketch 文件**: `sketches/remainder-sketch.js`
- **完整文档**: `README-p5-system.md`
