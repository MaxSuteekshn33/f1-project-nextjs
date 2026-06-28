'use client';
import { motion, useInView, Variants } from 'motion/react';
import { useRef, ElementType, ComponentPropsWithoutRef, RefObject } from 'react';

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.1,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

type TimelineContentProps<T extends ElementType = 'div'> = {
  as?: T;
  animationNum?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timelineRef?: RefObject<any>;
  customVariants?: Variants;
  children?: React.ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

// Build a typed map of motion components for common HTML tags
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  main: motion.main,
  article: motion.article,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
  a: motion.a,
  ul: motion.ul,
  li: motion.li,
  button: motion.button,
  nav: motion.nav,
  footer: motion.footer,
} as const;

type MotionTag = keyof typeof MOTION_TAGS;

export function TimelineContent<T extends ElementType = 'div'>({
  as,
  animationNum = 0,
  timelineRef: _timelineRef,
  customVariants,
  children,
  className,
  ...props
}: TimelineContentProps<T>) {
  const localRef = useRef<HTMLElement>(null);
  const isInView = useInView(localRef, { once: true, margin: '-8% 0px' });
  const variants = customVariants ?? defaultVariants;
  const tag = (as as string) ?? 'div';
  const MotionTag = (MOTION_TAGS[tag as MotionTag] ?? motion.div) as typeof motion.div;

  return (
    <MotionTag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={localRef as any}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={animationNum}
      className={className}
      {...(props as object)}
    >
      {children}
    </MotionTag>
  );
}
