import React, { useRef, useEffect } from 'react';


// Define the properties of each animated leaf
interface Leaf {
  // X position on canvas
  x: number;
  // Y position on canvas
  y: number;
  // Size of the leaf
  size: number;
  // Horizontal speed (drift)
  speedX: number;
  // Vertical falling speed
  speedY: number;
  // Current rotation angle in radians
  rotation: number;
  // Rotation speed (how fast the leaf spins)
  rotSpeed: number;
}

// Main component
const ParticleBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  // Canvas DOM reference
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // All the animated leaf objects
  const leaves = useRef<Leaf[]>([]);
  // Holds the animation frame ID for cleanup
  const animRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate leaves based on viewport
    const initLeaves = () => {
      const count = Math.floor((canvas.width * canvas.height) / 40000);
      leaves.current = [];
      for (let i = 0; i < count; i++) {
        const size = 10 + Math.random() * 10;
        leaves.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: 0.5 + Math.random() * 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
        });
      }
    };

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initLeaves();
    };
    window.addEventListener('resize', resize);
    resize();

    // Draw a single leaf (stem + body)
    const drawLeaf = (leaf: Leaf) => {
      const { x, y, size, rotation } = leaf;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Brown stem
      ctx.beginPath();
      ctx.strokeStyle = '#8B5A2B';
      ctx.lineWidth = size * 0.1;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, size * 1.2);
      ctx.stroke();

      // Green leaf body
      ctx.beginPath();
      ctx.fillStyle = '#4ADE80';
      ctx.ellipse(0, size * 0.6, size * 0.4, size * 0.7, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      leaves.current.forEach(leaf => {
        leaf.x += leaf.speedX;
        leaf.y += leaf.speedY;
        leaf.rotation += leaf.rotSpeed;
        // Wrap leaves
        if (leaf.y > canvas.height + leaf.size) leaf.y = -leaf.size;
        if (leaf.x < -leaf.size) leaf.x = canvas.width + leaf.size;
        if (leaf.x > canvas.width + leaf.size) leaf.x = -leaf.size;
        drawLeaf(leaf);
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${className}`}
    />
  );
};

export default ParticleBackground;
