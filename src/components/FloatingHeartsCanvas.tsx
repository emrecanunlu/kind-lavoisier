"use client";

import React, { useEffect, useRef } from "react";

export const FloatingHeartsCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    interface HeartParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      growth: number;
      color: string;
    }

    const colors = [
      "rgba(244, 63, 94, ",  // rose-500
      "rgba(236, 72, 153, ", // pink-500
      "rgba(219, 39, 119, ", // pink-600
      "rgba(251, 113, 133, ",// rose-400
    ];

    const particles: HeartParticle[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 14 + 6,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: Math.sin(Math.random() * Math.PI) * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.2,
      growth: Math.random() * 0.005,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const drawHeart = (x: number, y: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color + opacity + ")";
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(
        x,
        y,
        x - size / 2,
        y,
        x - size / 2,
        y + topCurveHeight
      );
      // bottom left curve
      ctx.bezierCurveTo(
        x - size / 2,
        y + (size + topCurveHeight) / 2,
        x,
        y + size,
        x,
        y + size
      );
      // bottom right curve
      ctx.bezierCurveTo(
        x,
        y + size,
        x + size / 2,
        y + (size + topCurveHeight) / 2,
        x + size / 2,
        y + topCurveHeight
      );
      // top right curve
      ctx.bezierCurveTo(
        x + size / 2,
        y,
        x,
        y,
        x,
        y + topCurveHeight
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        drawHeart(p.x, p.y, p.size, p.color, p.opacity);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};
