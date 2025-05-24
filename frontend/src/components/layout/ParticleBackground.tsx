import React, { useRef, useEffect } from 'react';

interface ParticleBackgroundProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  
  // Colors
  const colors = [
    'rgba(8, 247, 254, 0.3)',  // neon cyan
    'rgba(254, 83, 187, 0.3)',  // neon magenta
    'rgba(121, 83, 254, 0.3)',  // neon violet
    'rgba(255, 120, 70, 0.3)'   // neon orange
  ];
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initialize particles
    const initParticles = () => {
      const numParticles = Math.floor(window.innerWidth * window.innerHeight / 15000);
      particles.current = [];
      
      for (let i = 0; i < numParticles; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.2 - 0.1,
          speedY: Math.random() * 0.2 - 0.1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });
      
      // Connect particles with lines if they are close enough
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationRef.current = requestAnimationFrame(drawParticles);
    };
    
    setCanvasSize();
    initParticles();
    drawParticles();
    
    window.addEventListener('resize', () => {
      setCanvasSize();
      initParticles();
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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