import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
<<<<<<< HEAD
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
=======
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
>>>>>>> 4d1eafa (impoved frontend UI)
        className
      )}
      {...props}
    />
  );
}

export { Input };
