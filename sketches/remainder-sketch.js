// 余数演示动画 - p5.js Instance Mode
// 这个文件可以被配置文件通过 codeUrl 引用

(function(p, containerId, params) {
  // 从参数中获取配置,提供默认值
  const totalApples = params.totalApples || 10;
  const totalKids = params.totalKids || 3;
  
  let apples = [];
  let kids = [];
  let animationStep = 0;
  let stepTimer = 0;
  let canvasWidth = 400;
  let canvasHeight = 300;
  
  p.setup = function() {
    // 获取容器并设置画布大小
    const container = document.getElementById(containerId);
    if (container) {
      canvasWidth = Math.min(400, container.clientWidth - 20);
      canvasHeight = 300;
    }
    
    const canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(containerId);
    
    // 初始化苹果位置(网格布局)
    for (let i = 0; i < totalApples; i++) {
      apples.push({
        x: 50 + (i % 5) * 60,
        y: 50 + Math.floor(i / 5) * 60,
        targetX: 0,
        targetY: 0,
        assigned: false,
        kidIndex: -1
      });
    }
    
    // 初始化小朋友位置(均匀分布)
    const spacing = canvasWidth / (totalKids + 1);
    for (let i = 0; i < totalKids; i++) {
      kids.push({
        x: spacing * (i + 1),
        y: canvasHeight - 80,
        count: 0
      });
    }
  };
  
  p.draw = function() {
    // 深色背景
    p.background(20, 25, 50);
    
    // 绘制标题
    p.fill(100, 212, 255);
    p.textAlign(p.CENTER);
    p.textSize(16);
    p.text(`${totalApples} ÷ ${totalKids} = ?`, canvasWidth / 2, 25);
    
    // 动画逻辑:每60帧分配一个苹果
    stepTimer++;
    if (stepTimer > 60 && animationStep < totalApples) {
      const apple = apples[animationStep];
      const kidIndex = animationStep % totalKids; // 轮流分配
      
      apple.assigned = true;
      apple.kidIndex = kidIndex;
      apple.targetX = kids[kidIndex].x;
      apple.targetY = kids[kidIndex].y - 40 - kids[kidIndex].count * 25;
      kids[kidIndex].count++;
      
      animationStep++;
      stepTimer = 0;
    }
    
    // 绘制苹果
    for (let apple of apples) {
      if (apple.assigned) {
        // 平滑移动到目标位置
        apple.x = p.lerp(apple.x, apple.targetX, 0.1);
        apple.y = p.lerp(apple.y, apple.targetY, 0.1);
      }
      
      // 苹果颜色:已分配=蓝色,未分配=黄色
      if (apple.assigned) {
        p.fill(100, 212, 255);
      } else {
        p.fill(251, 191, 36);
      }
      
      p.noStroke();
      p.ellipse(apple.x, apple.y, 20, 20);
      
      // 苹果柄
      p.fill(139, 69, 19);
      p.rect(apple.x - 2, apple.y - 12, 4, 8);
    }
    
    // 绘制小朋友
    for (let i = 0; i < kids.length; i++) {
      const kid = kids[i];
      
      // 头部
      p.fill(168, 85, 247);
      p.ellipse(kid.x, kid.y, 40, 40);
      
      // 表情
      p.fill(255);
      p.textSize(12);
      p.textAlign(p.CENTER);
      p.text(`👦${i + 1}`, kid.x, kid.y + 5);
      
      // 显示当前拥有的苹果数量
      p.fill(100, 212, 255);
      p.textSize(14);
      p.text(kid.count, kid.x, kid.y + 60);
    }
    
    // 动画完成后显示结果
    if (animationStep >= totalApples) {
      const quotient = Math.floor(totalApples / totalKids);
      const remainder = totalApples % totalKids;
      
      p.fill(34, 197, 94);
      p.textSize(18);
      p.textAlign(p.CENTER);
      p.text(`每人 ${quotient} 个, 余 ${remainder} 个`, canvasWidth / 2, canvasHeight - 20);
    }
  };
  
  // 响应式调整
  p.windowResized = function() {
    const container = document.getElementById(containerId);
    if (container) {
      canvasWidth = Math.min(400, container.clientWidth - 20);
      p.resizeCanvas(canvasWidth, canvasHeight);
    }
  };
})
