import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// Supported locales
export const locales = ['ro', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'ro',
  localePrefix: 'as-needed'
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
