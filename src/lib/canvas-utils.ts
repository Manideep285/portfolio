interface Position {
  x: number;
  y: number;
}

interface NodeType {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface CanvasContext extends CanvasRenderingContext2D {
  running?: boolean;
  frame?: number;
}

interface WaveConfig {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

interface LineConfig {
  spring: number;
}

interface Config {
  debug: boolean;
  friction: number;
  trails: number;
  size: number;
  dampening: number;
  tension: number;
}

class Wave {
  private phase: number;
  private offset: number;
  private frequency: number;
  private amplitude: number;

  constructor(config: WaveConfig = {}) {
    this.phase = config.phase || 0;
    this.offset = config.offset || 0;
    this.frequency = config.frequency || 0.001;
    this.amplitude = config.amplitude || 1;
  }

  update(): number {
    this.phase += this.frequency;
    return this.offset + Math.sin(this.phase) * this.amplitude;
  }

  value(): number {
    return this.update();
  }
}

class Line {
  private spring: number;
  private friction: number;
  private nodes: NodeType[];

  constructor(config: LineConfig) {
    this.spring = config.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    
    for (let i = 0; i < E.size; i++) {
      const node = createNode();
      node.x = pos.x;
      node.y = pos.y;
      this.nodes.push(node);
    }
  }

  update(): void {
    let springFactor = this.spring;
    let currentNode = this.nodes[0];
    
    currentNode.vx += (pos.x - currentNode.x) * springFactor;
    currentNode.vy += (pos.y - currentNode.y) * springFactor;

    for (let i = 0; i < this.nodes.length; i++) {
      currentNode = this.nodes[i];
      
      if (i > 0) {
        const prevNode = this.nodes[i - 1];
        currentNode.vx += (prevNode.x - currentNode.x) * springFactor;
        currentNode.vy += (prevNode.y - currentNode.y) * springFactor;
        currentNode.vx += prevNode.vx * E.dampening;
        currentNode.vy += prevNode.vy * E.dampening;
      }
      
      currentNode.vx *= this.friction;
      currentNode.vy *= this.friction;
      currentNode.x += currentNode.vx;
      currentNode.y += currentNode.vy;
      
      springFactor *= E.tension;
    }
  }

  draw(ctx: CanvasContext): void {
    let current: NodeType;
    let next: NodeType;
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1; i < this.nodes.length - 2; i++) {
      current = this.nodes[i];
      next = this.nodes[i + 1];
      x = 0.5 * (current.x + next.x);
      y = 0.5 * (current.y + next.y);
      ctx.quadraticCurveTo(current.x, current.y, x, y);
    }

    current = this.nodes[this.nodes.length - 2];
    next = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(current.x, current.y, next.x, next.y);
    ctx.stroke();
    ctx.closePath();
  }
}

const createNode = (): NodeType => ({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
});

let ctx: CanvasContext;
let wave: Wave;
const pos: Position = { x: 0, y: 0 };
let lines: Line[] = [];
const E: Config = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

function render() {
  if (ctx.running) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `hsla(${Math.round(wave.update())},100%,50%,0.025)`;
    ctx.lineWidth = 10;

    for (let i = 0; i < E.trails; i++) {
      const line = lines[i];
      line.update();
      line.draw(ctx);
    }

    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function initCanvas(canvas: HTMLCanvasElement) {
  ctx = canvas.getContext("2d") as CanvasContext;
  ctx.running = true;
  ctx.frame = 1;
  
  wave = new Wave({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  function handleMouseMove(e: MouseEvent | TouchEvent) {
    if ('touches' in e) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else {
      pos.x = (e as MouseEvent).clientX;
      pos.y = (e as MouseEvent).clientY;
    }
    e.preventDefault();
  }

  function handleTouch(e: TouchEvent) {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    }
  }

  function initLines() {
    lines = [];
    for (let i = 0; i < E.trails; i++) {
      lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }));
    }
  }

  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight;

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("touchmove", handleMouseMove);
  document.addEventListener("touchstart", handleTouch);

  initLines();
  render();

  return () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchmove", handleMouseMove);
    document.removeEventListener("touchstart", handleTouch);
    ctx.running = false;
  };
}

export { initCanvas };
