import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const FloatingShapes = () => {
  const shapesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    shapesRef.current.forEach((shape) => {
      gsap.to(shape, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });
  }, []);

  const symbols = ["★", "⚡", "▲", "◆"];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {symbols.map((symbol, index) => (
        <div
          key={index}
          ref={(el) => {
            shapesRef.current[index] = el;
          }}
          className="absolute text-4xl opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        >
          {symbol}
        </div>
      ))}
    </div>
  );
};

export default FloatingShapes;
