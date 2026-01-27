"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer" data-testid="language-switcher">
            <select
                defaultValue={locale}
                className="bg-transparent py-2 pl-3 pr-8 text-sm font-medium outline-none appearance-none cursor-pointer"
                onChange={handleChange}
                disabled={isPending}
                data-testid="language-select"
            >
                <option value="en" data-testid="lang-en">English</option>
                <option value="uk" data-testid="lang-uk">Українська</option>
            </select>
            <span className="absolute right-2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
        </label>
    );
}
