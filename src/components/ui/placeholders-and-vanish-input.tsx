"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
  fixedPrefix = "Think of a title",
  triggerVanish = false,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fixedPrefix?: string;
  triggerVanish?: boolean;
  disabled?: boolean;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  }, [placeholders.length]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  }, [startAnimation]);

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleVisibilityChange, startAnimation]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<Array<{ x: number; y: number; r: number; color: string }>>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [submitAnimation, setSubmitAnimation] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: Array<{ x: number; y: number; color: number[] }> = [];

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n;
        if (pixelData[e] !== 0 && pixelData[e + 1] !== 0 && pixelData[e + 2] !== 0) {
          newData.push({
            x: n,
            y: t,
            color: [pixelData[e], pixelData[e + 1], pixelData[e + 2], pixelData[e + 3]],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const vanishAndSubmit = useCallback(
    (submitForm = true) => {
      setAnimating(true);
      draw();

      const animate = (start: number) => {
        const animateFrame = (pos: number = 0) => {
          requestAnimationFrame(() => {
            const newArr = [];
            for (let i = 0; i < newDataRef.current.length; i++) {
              const current = newDataRef.current[i];
              if (current.x < pos) {
                newArr.push(current);
              } else {
                if (current.r <= 0) {
                  current.r = 0;
                  continue;
                }
                current.x += Math.random() > 0.5 ? 1 : -1;
                current.y += Math.random() > 0.5 ? 1 : -1;
                current.r -= 0.05 * Math.random();
                newArr.push(current);
              }
            }
            newDataRef.current = newArr;
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) {
              ctx.clearRect(pos, 0, 800, 800);
              newDataRef.current.forEach((t) => {
                const { x: n, y: i, r: s, color: color } = t;
                if (n > pos) {
                  ctx.beginPath();
                  ctx.rect(n, i, s, s);
                  ctx.fillStyle = color;
                  ctx.strokeStyle = color;
                  ctx.stroke();
                }
              });
            }
            if (newDataRef.current.length > 0) {
              animateFrame(pos - 8);
            } else {
              setValue("");
              setAnimating(false);
            }
          });
        };
        animateFrame(start);
      };

      const currentValue = inputRef.current?.value || "";
      if (currentValue && inputRef.current) {
        const maxX = newDataRef.current.reduce(
          (prev, current) => (current.x > prev ? current.x : prev),
          0
        );
        animate(maxX);
      }

      if (submitForm && onSubmit) {
        setSubmitAnimation(true);
        setTimeout(() => setSubmitAnimation(false), 300);
        const event = new Event("submit", {
          bubbles: true,
          cancelable: true,
        }) as unknown as React.FormEvent<HTMLFormElement>;
        onSubmit(event);
      }
    },
    [draw, onSubmit]
  );

  useEffect(() => {
    if (triggerVanish && value && !animating) {
      vanishAndSubmit(false);
    }
  }, [triggerVanish, value, animating, vanishAndSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      setSubmitAnimation(true);
      setTimeout(() => setSubmitAnimation(false), 300);
      vanishAndSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <motion.form
      className={cn(
        "w-full relative max-w-xl mx-auto bg-white dark:bg-zinc-800 h-12 rounded-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition-all duration-200",
        value && "bg-gray-50"
      )}
      onSubmit={handleSubmit}
      animate={{
        scale: submitAnimation ? 0.98 : 1,
        transition: { type: "spring", stiffness: 500, damping: 15 },
      }}
    >
      <canvas
        className={cn(
          "absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20",
          !animating ? "opacity-0" : "opacity-100"
        )}
        ref={canvasRef}
      />
      <motion.input
        onChange={(e) => {
          if (!animating) {
            setValue(e.target.value);
            onChange?.(e);
          }
        }}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        value={value}
        type="text"
        className={cn(
          "w-full relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20",
          animating && "text-transparent dark:text-transparent"
        )}
        animate={{
          x: submitAnimation ? [-2, 2, -2, 2, 0] : 0,
          transition: { duration: 0.3 },
        }}
      />

      <motion.button
        disabled={!value}
        type="submit"
        whileHover={!value ? {} : { scale: 1.05, backgroundColor: "#000" }}
        whileTap={!value ? {} : { scale: 0.95 }}
        className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition-all duration-200 flex items-center justify-center"
        onClick={() => {
          if (value) {
            setSubmitAnimation(true);
            setTimeout(() => setSubmitAnimation(false), 300);
          }
        }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-300 h-4 w-4"
          animate={{
            rotate: submitAnimation ? [0, 15, 0] : 0,
            scale: submitAnimation ? [1, 1.2, 1] : 1,
            transition: { duration: 0.3 },
          }}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <motion.path
            d="M5 12l14 0"
            initial={{
              strokeDasharray: "50%",
              strokeDashoffset: "50%",
            }}
            animate={{
              strokeDashoffset: value ? 0 : "50%",
            }}
            transition={{
              duration: 0.3,
              ease: "linear",
            }}
          />
          <motion.path
            d="M13 18l6 -6"
            animate={{
              pathLength: submitAnimation ? [0, 1, 0] : 1,
              transition: { duration: 0.3 },
            }}
          />
          <motion.path
            d="M13 6l6 6"
            animate={{
              pathLength: submitAnimation ? [0, 1, 0] : 1,
              transition: { duration: 0.3 },
            }}
          />
        </motion.svg>
      </motion.button>

      <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
        <AnimatePresence mode="wait">
          {!value && (
            <div className="flex dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate">
              <motion.span
                className="mr-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {fixedPrefix}
              </motion.span>
              <motion.span
                initial={{
                  y: 5,
                  opacity: 0,
                }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -15,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {placeholders[currentPlaceholder]}
              </motion.span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
