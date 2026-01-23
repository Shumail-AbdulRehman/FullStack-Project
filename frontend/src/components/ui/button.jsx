import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(

  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:

          'bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-500 hover:shadow-violet-500/40',
        destructive:
          'bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-500 hover:shadow-red-500/40',
        outline:
          'border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20',
        secondary:
          'bg-white/10 text-white hover:bg-white/20',
        ghost:
          'text-zinc-400 hover:text-white hover:bg-white/10',
        link:
          'text-violet-400 underline-offset-4 hover:underline hover:text-violet-300',
        gradient:
          'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-500/40 hover:scale-[1.02]',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-lg gap-1.5 px-3 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
