import * as React from 'react';

import { cn } from '@/lib/utils';

<<<<<<< HEAD
function Card({ className, ...props }) {
=======
function Card({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-card border border-white/5 shadow-xl',
    glass: 'glass-card',
    gradient: 'bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-white/10 backdrop-blur-xl',
  };

>>>>>>> 4d1eafa (impoved frontend UI)
  return (
    <div
      data-slot="card"
      className={cn(
<<<<<<< HEAD
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
=======
        'text-card-foreground flex flex-col gap-6 rounded-2xl py-6',
        variants[variant] || variants.default,
>>>>>>> 4d1eafa (impoved frontend UI)
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
<<<<<<< HEAD
      className={cn('leading-none font-semibold', className)}
=======
      className={cn('leading-none font-semibold text-white', className)}
>>>>>>> 4d1eafa (impoved frontend UI)
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
<<<<<<< HEAD
      className={cn('text-muted-foreground text-sm', className)}
=======
      className={cn('text-zinc-400 text-sm', className)}
>>>>>>> 4d1eafa (impoved frontend UI)
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
