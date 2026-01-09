'use client';

import React from 'react';
import { useInView } from '@/shared/hooks/useInView';
import { cn } from '@/shared/lib/utils';

type AnimationType = 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
type AnimationSpeed = 'fast' | 'normal' | 'slow';

interface AnimateProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation?: AnimationType;
  speed?: AnimationSpeed;
  delay?: AnimationSpeed | number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  as?: React.ElementType;
  critical?: boolean;
}

export const Animate = ({
  children,
  animation = 'fadeInUp',
  speed = 'normal',
  delay = 'fast',
  className,
  threshold = 0.1,
  triggerOnce = true,
  as = 'div',
  critical = false,
  ...props
}: AnimateProps) => {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold, triggerOnce });

  const Component = as as React.ElementType;

  const shouldAnimate = critical ? true : isInView;

  const delayValue = typeof delay === 'number' ? `${delay}ms` : undefined;
  const delayClass = typeof delay === 'string' ? `animation-delay-${delay}` : '';

  return (
    <Component
      ref={critical ? undefined : ref}
      className={cn(
        shouldAnimate ? `animate-${animation}` : 'opacity-0',
        `animation-duration-${speed}`,
        delayClass,
        'gpu-accelerated',
        className
      )}
      style={{
        animationDelay: delayValue,
        ...(critical && { opacity: 1 }),
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export const FadeInUp = (props: Omit<AnimateProps, 'animation'>) =>
  <Animate animation="fadeInUp" {...props} />;

export const FadeInLeft = (props: Omit<AnimateProps, 'animation'>) =>
  <Animate animation="fadeInLeft" speed="fast" {...props} />;

export const FadeInRight = (props: Omit<AnimateProps, 'animation'>) =>
  <Animate animation="fadeInRight" speed="fast" {...props} />;

export const ScaleIn = (props: Omit<AnimateProps, 'animation'>) =>
  <Animate animation="scaleIn" speed="slow" {...props} />;

export const HeroAnimate = ({ children, ...props }: Omit<AnimateProps, 'critical'>) => (
  <Animate critical={true} animation="fadeInUp" speed="normal" {...props}>
    {children}
  </Animate>
);

export const ContentAnimate = ({ children, ...props }: AnimateProps) => (
  <Animate critical={false} {...props}>
    {children}
  </Animate>
);

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 150,
  animation = 'fadeInUp',
  speed = 'normal',
  ...props
}: AnimateProps & { staggerDelay?: number }) => {
  const { ref, isInView } = useInView<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div ref={ref} className={className} {...props}>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={cn(
            isInView ? `animate-${animation}` : 'opacity-0',
            `animation-duration-${speed}`,
            'gpu-accelerated'
          )}
          style={{
            animationDelay: isInView ? `${index * staggerDelay}ms` : '0ms'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default {
  Animate,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  HeroAnimate,
  ContentAnimate,
  StaggerContainer
};
