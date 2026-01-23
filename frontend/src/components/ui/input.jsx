import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(

        // Base styles
        'flex h-10 w-full min-w-0 rounded-xl border bg-white/5 px-4 py-2 text-sm text-white transition-all duration-200',
        // Border & placeholder
        'border-white/10 placeholder:text-zinc-500',
        // Focus states
        'focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:bg-white/10',
        // File input
        'file:border-0 file:bg-violet-500/20 file:text-violet-400 file:text-sm file:font-medium file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:cursor-pointer hover:file:bg-violet-500/30',
        // Selection
        'selection:bg-violet-500 selection:text-white',
        // Disabled
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Invalid
        'aria-invalid:border-red-500/50 aria-invalid:ring-red-500/20',
        className
      )}
      {...props}
    />
  );
}

export { Input };
