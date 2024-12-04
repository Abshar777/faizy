import React, { useState, useLayoutEffect, MouseEvent } from "react";

interface RippleProps {
  duration?: number;
  color?: string;
}

interface Ripple {
  x: number;
  y: number;
  size: number;
}

export const useDebouncedRippleCleanUp = (
  rippleCount: number,
  duration: number,
  cleanUpFunction: () => void
) => {
  useLayoutEffect(() => {
    let bounce: NodeJS.Timeout | null = null;
    if (rippleCount > 0) {
      clearTimeout(bounce!);

      bounce = setTimeout(() => {
        cleanUpFunction();
        clearTimeout(bounce!);
      }, duration * 4);
    }

    return () => {
      if (bounce) clearTimeout(bounce);
    };
  }, [rippleCount, duration, cleanUpFunction]);
};

export const useRipple = () => {
  const [rippleArray, setRippleArray] = useState<Ripple[]>([]);
  const addRipple = (event: MouseEvent<HTMLDivElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const x = event.pageX - rippleContainer.x - size / 2;
    const y = event.pageY - rippleContainer.y - size / 2;
    const newRipple = { x, y, size };

    setRippleArray((prevRipples) => [...prevRipples, newRipple]);
  };
  const cleanUpFunction = useDebouncedRippleCleanUp(
    rippleArray.length,
    850,
    () => {
      setRippleArray([]);
    }
  );
  return { rippleArray, cleanUpFunction, addRipple };
};

const Ripple: React.FC<RippleProps> = ({ duration = 850, color = "#fff" }) => {
  const [rippleArray, setRippleArray] = useState<Ripple[]>([]);

  useDebouncedRippleCleanUp(rippleArray.length, duration, () => {
    setRippleArray([]);
  });

  const addRipple = (event: MouseEvent<HTMLDivElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const x = event.pageX - rippleContainer.x - size / 2;
    const y = event.pageY - rippleContainer.y - size / 2;
    const newRipple = { x, y, size };

    setRippleArray((prevRipples) => [...prevRipples, newRipple]);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseDown={addRipple}
    >
      {rippleArray.map((ripple, index) => (
        <span
          key={index}
          className="absolute bg-opacity-75 rounded-full animate-ripple"
          style={{
            top: `${ripple.y}px`,
            left: `${ripple.x}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            backgroundColor: color,
            animationDuration: `${duration}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default Ripple;
