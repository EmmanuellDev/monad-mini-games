/**
 * Framer Motion Animation Variants
 * Reusable animation primitives for consistent motion throughout the app
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const slideInFromRight = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "100%", opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

export const slideInFromLeft = {
  initial: { x: "-100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Hover and tap animations (use with whileHover/whileTap)
export const hoverLift = {
  y: -4,
  transition: { duration: 0.18 }
};

export const buttonTap = {
  scale: 0.98
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

// Word reveal animation for headlines
export const wordReveal = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 }
};
