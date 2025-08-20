'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  fallSpeed: number;
  color: string;
  size: number;
}

const colors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
  '#BB8FCE', // Lavender
  '#85C1E9', // Sky Blue
];

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Create confetti pieces immediately when component mounts
    const newPieces: ConfettiPiece[] = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      fallSpeed: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 12,
    }));

    setPieces(newPieces);

    // Animation loop
    let animationId: number;
    const animate = () => {
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          y: piece.y + piece.fallSpeed,
          rotation: piece.rotation + piece.rotationSpeed,
        }))
      );

      // Continue animation if pieces are still visible
      if (pieces.some(piece => piece.y < window.innerHeight + 100)) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    // Cleanup animation after 3 seconds
    const cleanupTimer = setTimeout(() => {
      cancelAnimationFrame(animationId);
    }, 3000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(cleanupTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: piece.x,
            top: piece.y,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: piece.y < window.innerHeight ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}
