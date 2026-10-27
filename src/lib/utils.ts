import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// utility function to conditionally join and merge tailwind class names
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
