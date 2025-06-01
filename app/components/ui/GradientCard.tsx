import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '~/utils/classNames';

// Modern gradient colors with enhanced vibrancy
const GRADIENT_COLORS = [
  'from-indigo-500/15 to-purple-500/10 via-blue-500/12',
  'from-blue-500/15 to-cyan-500/10 via-sky-500/12',
  'from-cyan-500/15 to-emerald-500/10 via-teal-500/12',
  'from-emerald-500/15 to-lime-500/10 via-green-500/12',
  'from-amber-500/15 to-orange-500/10 via-yellow-500/12',
  'from-orange-500/15 to-red-500/10 via-pink-500/12',
  'from-pink-500/15 to-purple-500/10 via-rose-500/12',
  'from-purple-500/15 to-indigo-500/10 via-violet-500/12',
  'from-slate-500/15 to-gray-500/10 via-zinc-500/12',
  'from-fuchsia-500/15 to-pink-500/10 via-rose-500/12',
];

interface GradientCardProps {
  /** Custom gradient class (overrides seed-based gradient) */
  gradient?: string;

  /** Seed string to determine gradient color */
  seed?: string;

  /** Whether to apply hover animation effect */
  hoverEffect?: boolean;

  /** Whether to apply border effect */
  borderEffect?: boolean;

  /** Card content */
  children: React.ReactNode;

  /** Additional class name */
  className?: string;

  /** Additional props */
  [key: string]: any;
}

/**
 * GradientCard component
 *
 * A card with a gradient background that can be determined by a seed string.
 */
export function GradientCard({
  gradient,
  seed,
  hoverEffect = true,
  borderEffect = true,
  className,
  children,
  ...props
}: GradientCardProps) {
  // Get gradient color based on seed or use provided gradient
  const gradientClass = gradient || getGradientColorFromSeed(seed);

  // Enhanced animation variants for hover effect
  const hoverAnimation = hoverEffect
    ? {
        whileHover: {
          scale: 1.03,
          y: -4,
          rotateX: 2,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 17,
            duration: 0.2
          },
        },
        whileTap: {
          scale: 0.97,
          transition: { duration: 0.1 }
        },
      }
    : undefined;

  return (
    <motion.div
      className={classNames(
        'p-5 rounded-xl bg-gradient-to-br relative overflow-hidden',
        gradientClass,
        borderEffect
          ? 'border border-bolt-elements-borderColor dark:border-bolt-elements-borderColor-dark hover:border-indigo-500/50'
          : '',
        'transition-all duration-300 shadow-sm backdrop-blur-sm',
        hoverEffect ? 'hover:shadow-lg hover:shadow-indigo-500/10' : '',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...hoverAnimation}
      {...props}
    >
      {/* Subtle animated background overlay */}
      {hoverEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Calculate a gradient color based on the seed string for visual variety
 */
function getGradientColorFromSeed(seedString?: string): string {
  if (!seedString) {
    return GRADIENT_COLORS[0];
  }

  const index = seedString.length % GRADIENT_COLORS.length;

  return GRADIENT_COLORS[index];
}
