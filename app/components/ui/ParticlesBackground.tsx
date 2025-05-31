import React, { useEffect, useRef, useState } from 'react';
import { classNames } from '~/utils/classNames';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface ParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
  speed?: number;
  interactive?: boolean;
}

export function ParticlesBackground({
  className,
  particleCount = 80,
  speed = 0.3,
  interactive = true,
}: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking for interactive effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const maxLife = Math.random() * 200 + 100;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          life: Math.random() * maxLife,
          maxLife,
        });
      }
    };

    initParticles();

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Get theme colors
      const particleColor = isDarkMode ? 'rgba(139, 92, 246, 0.6)' : 'rgba(139, 92, 246, 0.4)';
      const connectionColor = isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';

      particlesRef.current.forEach((particle, index) => {
        // Update particle life
        particle.life += 1;

        if (particle.life > particle.maxLife) {
          particle.life = 0;
          particle.x = Math.random() * rect.width;
          particle.y = Math.random() * rect.height;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Interactive mouse effect
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
          }
        }

        // Boundary wrapping
        if (particle.x < 0) {
          particle.x = rect.width;
        }

        if (particle.x > rect.width) {
          particle.x = 0;
        }

        if (particle.y < 0) {
          particle.y = rect.height;
        }

        if (particle.y > rect.height) {
          particle.y = 0;
        }

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Calculate opacity based on life
        const lifeRatio = particle.life / particle.maxLife;
        const fadeOpacity = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1;
        const currentOpacity = particle.opacity * fadeOpacity;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections to nearby particles
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.5 * currentOpacity;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = connectionColor;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);

      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, speed, interactive, isDarkMode]);

  return (
    <canvas ref={canvasRef} className={classNames('fixed inset-0 pointer-events-none z-0 w-full h-full', className)} />
  );
}

// Main particles background component - ReactBits.dev style
export function ReactBitsParticlesBackground({ className }: { className?: string }) {
  // Performance optimization: reduce particles on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particleCount = isMobile ? 50 : 100;

  return (
    <div className={classNames('fixed inset-0 pointer-events-none z-0', className)}>
      <ParticlesBackground
        particleCount={particleCount}
        speed={0.2}
        interactive={!isMobile} // Disable interaction on mobile for better performance
      />
    </div>
  );
}
