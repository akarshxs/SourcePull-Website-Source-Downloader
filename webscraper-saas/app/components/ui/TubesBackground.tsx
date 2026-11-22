"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Ferrari & neon dynamic palette generator
const paletteColors = [
  "#da291c", // Rosso Corsa
  "#ff4136", // Vivid Racing Red
  "#ffffff", // Pure White
  "#f6e500", // Giallo Modena
  "#ff2d75", // Neon Crimson
  "#ff8a00", // Hot Orange
  "#00d4ff", // Cyber Cyan
  "#7b2dff", // Electric Purple
];

const getRandomSelection = (arr: string[], count: number) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
  opacity?: number;
}

export default function TubesBackground({
  children,
  className,
  enableClickInteraction = true,
  opacity = 0.85,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tubesRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      if (!canvasRef.current) return;

      try {
        const module = await import(
          /* webpackIgnore: true */
          // @ts-ignore
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
        );
        const TubesCursor = module.default;

        if (!mounted || !canvasRef.current) return;

        // Striking Ferrari Rosso Corsa & High Voltage Neon lights (NEVER dull green)
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#da291c", "#ffffff", "#ff4136"],
            lights: {
              intensity: 320,
              colors: ["#da291c", "#ff4136", "#ffffff", "#ff8a00"],
            },
          },
        });

        tubesRef.current = app;
        setLoaded(true);

        const handleResize = () => {
          // threejs-components internal resize hook
        };

        window.addEventListener("resize", handleResize);
        cleanup = () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (err) {
        console.error("Failed to load TubesCursor:", err);
      }
    };

    init();

    return () => {
      mounted = false;
      cleanup?.();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!enableClickInteraction || !tubesRef.current) return;
    const colors = getRandomSelection(paletteColors, 3);
    const lightsColors = getRandomSelection(paletteColors, 4);
    tubesRef.current.tubes?.setColors?.(colors);
    tubesRef.current.tubes?.setLightsColors?.(lightsColors);
  };

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[400px] overflow-hidden bg-[#181818]",
        className
      )}
      onClick={handleClick}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 w-full h-full block transition-opacity duration-700 pointer-events-auto cursor-crosshair",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{ touchAction: "none", opacity: loaded ? opacity : 0 }}
      />

      {/* Children overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}
