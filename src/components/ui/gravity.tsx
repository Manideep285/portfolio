import React, {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import Matter, {
  Bodies,
  Body,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  World,
} from "matter-js";
import { cn } from "@/lib/utils";

interface GravityProps {
  children: ReactNode;
  debug?: boolean;
  gravity?: { x: number; y: number };
  resetOnResize?: boolean;
  grabCursor?: boolean;
  addTopWall?: boolean;
  autoStart?: boolean;
  className?: string;
}

interface PhysicsBody {
  element: HTMLElement;
  body: Matter.Body;
  props: MatterBodyProps;
}

interface MatterBodyProps {
  children: ReactNode;
  matterBodyOptions?: Matter.IBodyDefinition;
  isDraggable?: boolean;
  bodyType?: "rectangle" | "circle" | "svg";
  sampleLength?: number;
  x?: number | string;
  y?: number | string;
  angle?: number;
  className?: string;
}

export type GravityRef = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

const GravityContext = createContext<{
  registerElement: (id: string, element: HTMLElement, props: MatterBodyProps) => void;
  unregisterElement: (id: string) => void;
} | null>(null);

export const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(GravityContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;
    
    const id = idRef.current;
    
    context.registerElement(id, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    });

    return () => {
      context.unregisterElement(id);
    };
  }, [
    context,
    children,
    matterBodyOptions,
    bodyType,
    sampleLength,
    isDraggable,
    x,
    y,
    angle,
    props
  ]);

  return (
    <div
      ref={elementRef}
      className={cn("absolute", className, isDraggable && "pointer-events-none")}
    >
      {children}
    </div>
  );
};

export const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      addTopWall = true,
      autoStart = true,
      className,
      ...props
    },
    ref
  ) => {
    const canvas = useRef<HTMLDivElement>(null);
    const engine = useRef(Engine.create());
    const render = useRef<Render>();
    const runner = useRef<Runner>();
    const bodiesMap = useRef(new Map<string, PhysicsBody>());
    const frameId = useRef<number>();
    const mouseConstraint = useRef<Matter.MouseConstraint>();
    const mouseDown = useRef(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const isRunning = useRef(false);

    const stopEngine = useCallback(() => {
      if (!isRunning.current) return;

      if (runner.current) {
        Runner.stop(runner.current);
      }
      if (render.current) {
        Render.stop(render.current);
      }
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      isRunning.current = false;
    }, []);

    const updateElements = useCallback(() => {
      bodiesMap.current.forEach(({ element, body }) => {
        const { x, y } = body.position;
        const rotation = body.angle * (180 / Math.PI);
        element.style.transform = `translate3d(${
          x - element.offsetWidth / 2
        }px, ${y - element.offsetHeight / 2}px, 0) rotate(${rotation}deg)`;
      });

      if (isRunning.current) {
        frameId.current = requestAnimationFrame(updateElements);
      }
    }, []);

    const startEngine = useCallback(() => {
      if (!isRunning.current) {
        if (runner.current) {
          runner.current.enabled = true;
          Runner.run(runner.current, engine.current);
        }
        if (render.current) {
          Render.run(render.current);
        }
        frameId.current = requestAnimationFrame(updateElements);
        isRunning.current = true;
      }
    }, [updateElements]);

    const registerElement = useCallback(
      (id: string, element: HTMLElement, props: MatterBodyProps) => {
        if (!canvas.current) return;

        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const canvasRect = canvas.current.getBoundingClientRect();

        const angle = (props.angle || 0) * (Math.PI / 180);
        const x = calculatePosition(props.x, canvasRect.width, width);
        const y = calculatePosition(props.y, canvasRect.height, height);

        let body;
        if (props.bodyType === "circle") {
          const radius = Math.max(width, height) / 2;
          body = Bodies.circle(x, y, radius, {
            ...props.matterBodyOptions,
            angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        } else {
          body = Bodies.rectangle(x, y, width, height, {
            ...props.matterBodyOptions,
            angle,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          });
        }

        if (body) {
          World.add(engine.current.world, [body]);
          bodiesMap.current.set(id, { element, body, props });
        }
      },
      [debug]
    );

    const unregisterElement = useCallback((id: string) => {
      const body = bodiesMap.current.get(id);
      if (body) {
        World.remove(engine.current.world, body.body);
        bodiesMap.current.delete(id);
      }
    }, []);

    const clearRenderer = useCallback(() => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
      if (mouseConstraint.current) {
        World.remove(engine.current.world, mouseConstraint.current);
      }
      if (render.current) {
        Mouse.clearSourceEvents(render.current.mouse);
        Render.stop(render.current);
        if (render.current.canvas.parentElement) {
          render.current.canvas.remove();
        }
      }
      if (runner.current) {
        Runner.stop(runner.current);
      }
      if (engine.current) {
        World.clear(engine.current.world, false);
        Engine.clear(engine.current);
      }
      bodiesMap.current.clear();
      isRunning.current = false;
    }, []);

    const initializeRenderer = useCallback(() => {
      if (!canvas.current) return;

      // Initialize Matter.js with poly-decomp
      const initPolygonDecomposition = async () => {
        try {
          const polyDecomp = await import('poly-decomp');
          Common.setDecomp(polyDecomp);
        } catch (error) {
          console.warn('poly-decomp not available', error);
        }
      };

      // Initialize decomp if needed
      if (!Common.decomp) {
        initPolygonDecomposition();
      }

      const height = canvas.current.offsetHeight;
      const width = canvas.current.offsetWidth;

      // Reset and reconfigure engine
      World.clear(engine.current.world);
      Engine.clear(engine.current);

      // Configure engine for better performance
      // Create engine with optimized settings for smoother physics
      engine.current = Engine.create({
        enableSleeping: false,  // Keep bodies active
        timing: {
          timeScale: 1.2,      // Slightly faster simulation
          timestamp: 0,
        },
        constraintIterations: 6,    // More precise constraints
        positionIterations: 12,     // More accurate positions
        velocityIterations: 8,      // Keep velocity iterations balanced
      });

      engine.current.gravity.x = gravity.x;
      engine.current.gravity.y = gravity.y;

      render.current = Render.create({
        element: canvas.current,
        engine: engine.current,
        options: {
          width,
          height,
          wireframes: false,
          background: "#00000000",
          pixelRatio: 1,
        },
      });

      // Create optimized mouse constraint
      const mouse = Mouse.create(render.current.canvas, {
        element: render.current.canvas
      });

      mouseConstraint.current = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.8,      // Increased stiffness for better control
          damping: 0.5,        // Reduced damping for more responsive dragging
          angularStiffness: 1, // Prevent rotation while dragging
          render: {
            visible: debug,
            strokeStyle: debug ? '#90cdf4' : '#00000000',
            lineWidth: debug ? 2 : 0
          }
        },
        collisionFilter: {
          mask: 0xFFFFFF       // Allow interaction with all bodies
        }
      });

      // Optimize mouse interactions
      Events.on(mouseConstraint.current, 'mousemove', () => {
        const body = mouseConstraint.current?.body;
        if (body) {
          Body.setAngularVelocity(body, 0);
        }
      });

      // Create walls with improved physics properties
      const wallOptions = {
        isStatic: true,
        friction: 0.2,         // Reduced wall friction
        restitution: 0.6,      // Increased bounce
        density: 1,
        slop: 0,              // Perfect collision
        chamfer: { radius: 5 }, // Rounded corners
        render: {
          visible: debug,
          fillStyle: debug ? '#666' : '#00000000'
        }
      };

      const wallThickness = 100;
      const walls = [
        Bodies.rectangle(width / 2, height + wallThickness / 3, width * 1.4, wallThickness, wallOptions),
        Bodies.rectangle(width + wallThickness / 3, height / 2, wallThickness, height * 1.4, wallOptions),
        Bodies.rectangle(-wallThickness / 3, height / 2, wallThickness, height * 1.4, wallOptions),
      ];

      if (addTopWall) {
        walls.push(
          Bodies.rectangle(width / 2, -wallThickness / 3, width * 1.4, wallThickness, wallOptions)
        );
      }

      // Add corner blocks
      const cornerSize = wallThickness;
      const corners = [
        Bodies.rectangle(-cornerSize/2, -cornerSize/2, cornerSize, cornerSize, wallOptions),
        Bodies.rectangle(width + cornerSize/2, -cornerSize/2, cornerSize, cornerSize, wallOptions),
        Bodies.rectangle(-cornerSize/2, height + cornerSize/2, cornerSize, cornerSize, wallOptions),
        Bodies.rectangle(width + cornerSize/2, height + cornerSize/2, cornerSize, cornerSize, wallOptions),
      ];

      walls.push(...corners);

      // Setup mouse interactions
      if (grabCursor) {
        Events.on(mouseConstraint.current, 'mousedown', () => {
          const body = mouseConstraint.current?.body;
          if (body) {
            body.friction = 0;
            body.frictionAir = 0;
          }
        });

        Events.on(mouseConstraint.current, 'mouseup', () => {
          const body = mouseConstraint.current?.body;
          if (body) {
            body.friction = 0.1;
            body.frictionAir = 0.01;
          }
        });

        Events.on(engine.current, "beforeUpdate", () => {
          if (canvas.current) {
            const isHovering = Query.point(
              engine.current.world.bodies,
              mouseConstraint.current?.mouse.position || { x: 0, y: 0 }
            ).length > 0;

            canvas.current.style.cursor = mouseDown.current && isHovering
              ? "grabbing"
              : isHovering
              ? "grab"
              : "default";
          }
        });
      }

      World.add(engine.current.world, [mouseConstraint.current, ...walls]);
      render.current.mouse = mouse;

      // Create and configure runner
      runner.current = Runner.create({
        isFixed: true,
        delta: 1000 / 60
      });

      Runner.run(runner.current, engine.current);
      Render.run(render.current);

      if (autoStart) {
        requestAnimationFrame(startEngine);
      }

    }, [debug, gravity, addTopWall, grabCursor, autoStart, startEngine]);

    const handleResize = useCallback(() => {
      if (!canvas.current || !resetOnResize) return;

      const newWidth = canvas.current.offsetWidth;
      const newHeight = canvas.current.offsetHeight;

      setCanvasSize({ width: newWidth, height: newHeight });
      clearRenderer();
      initializeRenderer();
    }, [clearRenderer, initializeRenderer, resetOnResize]);

    const reset = useCallback(() => {
      stopEngine();
      bodiesMap.current.forEach(({ element, body, props }) => {
        body.angle = props.angle || 0;
        const x = calculatePosition(props.x, canvasSize.width, element.offsetWidth);
        const y = calculatePosition(props.y, canvasSize.height, element.offsetHeight);
        body.position.x = x;
        body.position.y = y;
      });
      startEngine();
    }, [canvasSize, stopEngine, startEngine]);

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [startEngine, stopEngine, reset]
    );

    useEffect(() => {
      if (!resetOnResize) return;

      const debouncedResize = debounce(handleResize, 500);
      window.addEventListener("resize", debouncedResize);

      return () => {
        window.removeEventListener("resize", debouncedResize);
        debouncedResize.cancel();
      };
    }, [handleResize, resetOnResize]);

    // Initialize on mount
    useEffect(() => {
      initializeRenderer();
      return clearRenderer;
    }, [initializeRenderer, clearRenderer]);

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div 
          ref={canvas} 
          className={cn(className, "absolute top-0 left-0 w-full h-full")} 
          {...props}
        >
          {children}
        </div>
      </GravityContext.Provider>
    );
  }
);

function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
) {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100;
    return containerSize * percentage;
  }
  return typeof value === "number" ? value : elementSize - containerSize + elementSize / 2;
}

Gravity.displayName = "Gravity";