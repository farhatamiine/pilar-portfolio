'use client';

import { Magnetic } from '@/components/ui/Magnetic';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;
type Status = 'idle' | 'loading' | 'success' | 'error';

/** Wraps a field with a pen-stroke underline that draws left→right on focus */
function FormField({ children, focused }: { children: React.ReactNode; focused: boolean }) {
    return (
        <div className="relative">
            {children}
            {/* Base underline */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-grain" />
            {/* Accent underline draws in on focus */}
            <motion.div
                className="absolute bottom-0 left-0 h-px bg-accent"
                initial={false}
                animate={{ scaleX: focused ? 1 : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
            />
        </div>
    );
}

export default function ContactPage() {
    const t = useTranslations('contact');
    const [status, setStatus] = useState<Status>('idle');
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [focused, setFocused] = useState<'name' | 'email' | 'message' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        setStatus(res.ok ? 'success' : 'error');
    };

    return (
        <div className="min-h-dvh bg-paper grid grid-cols-1 lg:grid-cols-2">
            {/* ── Left: info panel (dark) ─────────────────── */}
            <div className="bg-ink flex flex-col justify-between px-10 md:px-16 pt-36 pb-16 min-h-[50dvh] lg:min-h-dvh">
                <div>
                    <motion.p
                        className="font-mono text-label tracking-label uppercase text-accent mb-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {t('label')}
                    </motion.p>

                    <motion.h1
                        className="font-cormorant italic text-headline text-paper leading-display mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8, ease }}
                    >
                        {t('heading')}
                    </motion.h1>

                    <motion.p
                        className="font-garamond text-paper/70 text-body leading-body max-w-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.7 }}
                    >
                        {t('description')}
                    </motion.p>
                </div>

                {/* Contact details */}
                <motion.div className="space-y-7 mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
                    {(
                        [
                            { label: t('emailLabel'), value: 'pilar@pilarolivero.com', href: 'mailto:pilar@pilarolivero.com' },
                            { label: t('instagramLabel'), value: '@pilarolivero', href: 'https://instagram.com/pilarolivero_' },
                            { label: t('locationLabel'), value: t('locationValue'), href: null },
                        ] as const
                    ).map(({ label, value, href }) => (
                        <div key={label}>
                            <p className="font-mono text-label tracking-meta uppercase text-paper/40 mb-1">{label}</p>
                            {href ? (
                                <a
                                    href={href}
                                    target={href.startsWith('http') ? '_blank' : undefined}
                                    rel="noopener noreferrer"
                                    className="font-garamond text-paper/80 hover:text-accent transition-colors text-body"
                                >
                                    {value}
                                </a>
                            ) : (
                                <p className="font-garamond text-paper/80 text-body">{value}</p>
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* ── Right: form panel (light) ───────────────── */}
            <div className="flex items-center justify-center px-10 md:px-16 py-20 lg:py-0">
                <motion.div
                    className="w-full max-w-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease }}
                >
                    {status === 'success' ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <p className="font-cormorant italic text-4xl text-ink mb-4">{t('successHeading')}</p>
                            <p className="font-garamond text-ink/60 text-lg">{t('success')}</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-10">
                            <p className="font-mono text-label tracking-label uppercase text-ink/50">{t('formLabel')}</p>

                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="contact-name" className="block font-mono text-label tracking-meta uppercase text-ink/60">
                                    {t('name')} <span className="text-accent">*</span>
                                </label>
                                <FormField focused={focused === 'name'}>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused(null)}
                                        className="w-full bg-transparent border-b border-transparent outline-none pb-3 pt-1 font-garamond text-xl text-ink placeholder:text-ink/20"
                                        placeholder="—"
                                    />
                                </FormField>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="contact-email" className="block font-mono text-label tracking-meta uppercase text-ink/60">
                                    {t('email')} <span className="text-accent">*</span>
                                </label>
                                <FormField focused={focused === 'email'}>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        className="w-full bg-transparent border-b border-transparent outline-none pb-3 pt-1 font-garamond text-xl text-ink placeholder:text-ink/20"
                                        placeholder="—"
                                    />
                                </FormField>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label htmlFor="contact-message" className="block font-mono text-label tracking-meta uppercase text-ink/60">
                                    {t('message')} <span className="text-accent">*</span>
                                </label>
                                <FormField focused={focused === 'message'}>
                                    <textarea
                                        id="contact-message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused(null)}
                                        className="w-full bg-transparent border-b border-transparent outline-none pb-3 pt-1 font-garamond text-xl text-ink placeholder:text-ink/20 resize-none"
                                        placeholder="—"
                                    />
                                </FormField>
                            </div>

                            {status === 'error' && (
                                <p className="font-mono text-xs text-red-700 tracking-wide">
                                    {t('error')}{' '}
                                    <a href="mailto:pilar@pilarolivero.com" className="underline underline-offset-2">
                                        pilar@pilarolivero.com
                                    </a>
                                </p>
                            )}

                            <Magnetic strength={0.28}>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="group inline-flex items-center gap-4 font-mono text-label tracking-label uppercase bg-ink text-paper px-10 py-4 hover:bg-accent transition-colors disabled:opacity-50 active:scale-[0.98]"
                                >
                                    {status === 'loading' ? '…' : t('submit')}
                                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                </button>
                            </Magnetic>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
