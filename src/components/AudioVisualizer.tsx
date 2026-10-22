import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 32,
  height = 48,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(barCount);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, width, h);

      if (isPlaying && audioEngine.analyser) {
        audioEngine.getFrequencyData(dataArray);
      } else {
        // Idle gentle breathing line when paused
        for (let i = 0; i < barCount; i++) {
          dataArray[i] = Math.max(0, dataArray[i] * 0.9);
        }
      }

      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        const value = isPlaying ? (dataArray[i] / 255) : 0.05 + 0.03 * Math.sin(Date.now() / 300 + i * 0.4);
        const barHeight = Math.max(3, value * h * 0.92);
        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // Gold neon gradient: bright yellow-gold on top, amber at base
        const gradient = ctx.createLinearGradient(0, y, 0, h);
        gradient.addColorStop(0, '#fef08a');
        gradient.addColorStop(0.4, '#f59e0b');
        gradient.addColorStop(1, '#b45309');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, [2, 2, 0, 0]);
        ctx.fill();

        // Subtle gold glow on taller peaks
        if (value > 0.45) {
          ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={320}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
};
