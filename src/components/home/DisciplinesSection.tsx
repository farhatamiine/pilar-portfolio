'use client';

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const disciplineIds = ['textile', 'photo', 'performance', 'installation'] as const;
type DisciplineId = typeof disciplineIds[number];

const disciplineImages: Record<DisciplineId, string> = {
    textile:      'https://picsum.photos/seed/textile-d/600/800',
    photo:        'https://picsum.photos/seed/photo-d/600/800',
    performance:  'https://picsum.photos/seed/performance-d/600/800',
    installation: 'https://picsum.photos/seed/install-d/600/800',
};

export function DisciplinesSection() {
    const [active, setActive] = useState<DisciplineId | null>(null);
    const t      = useTranslations('disciplines');
    const tAbout = useTranslations('about');

    return (
        <section className="bg-paper py-24 md:py-36 overflow-hidden">

            {/* ── Header ── */}
            <div className="px-8 md:px-20 mb-16">
                <motion.p
                    className="font-mono text-label tracking-label uppercase text-ink/50 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {tAbout('practiceLabel')}
                </motion.p>
                <motion.h2
                    className="font-cormorant italic text-title text-ink leading-head"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    {tAbout('practiceTitle')}
                </motion.h2>
            </div>

            {/* ── Rows + side panel ── */}
            <LayoutGroup>
                <div
                    className="border-t border-grain lg:grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px]"
                    onMouseLeave={() => setActive(null)}
                >
                    {/* ── Left: fixed-height rows ── */}
                    <div>
                        {disciplineIds.map((id, i) => (
                            <motion.div
                                key={id}
                                className="relative border-b border-grain cursor-pointer"
                                onMouseEnter={() => setActive(id)}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07, duration: 0.45 }}
                            >
                                {/* Sliding ink background — layoutId makes it glide between rows */}
                                {active === id && (
                                    <motion.div
                                        layoutId="discipline-bg"
                                        className="absolute inset-0 bg-ink"
                                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                                    />
                                )}

                                <div className="relative z-10 flex items-center px-8 md:px-20 py-7 md:py-9 gap-6 md:gap-10">
                                    <span
                                        className="font-mono text-xs tabular-nums shrink-0 transition-colors duration-150"
                                        style={{ color: active === id ? '#c8a882' : '#8a8078' }}
                                    >
                                        {String(i + 1).padStart(2, '0')}
                                    </span>

                                    <h3
                                        className="font-cormorant text-heading flex-1 leading-none transition-all duration-150"
                                        style={{
                                            color:     active === id ? '#f4f0e8' : '#1a1714',
                                            fontStyle: active === id ? 'italic'  : 'normal',
                                        }}
                                    >
                                        {t(`${id}.title`)}
                                    </h3>

                                    <span
                                        className="hidden md:block font-mono text-label tracking-label uppercase shrink-0 transition-colors duration-150"
                                        style={{ color: active === id ? '#c8a882' : '#8a8078' }}
                                    >
                                        {t(`${id}.subtitle`)}
                                    </span>

                                    <span
                                        className="font-mono text-xs shrink-0 transition-all duration-150"
                                        style={{
                                            color:     active === id ? '#c8a882' : '#8a8078',
                                            transform: active === id ? 'translateX(4px)' : 'none',
                                        }}
                                    >
                                        →
                                    </span>
                                </div>

                                {/* Mobile: description inline, opacity-only (no height shift) */}
                                <div className="lg:hidden overflow-hidden">
                                    <AnimatePresence initial={false}>
                                        {active === id && (
                                            <motion.div
                                                key={id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="px-8 pb-6"
                                            >
                                                <p className="font-garamond text-paper/70 text-body leading-body">
                                                    {t(`${id}.description`)}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* ── Right: cross-fading description panel (desktop only) ── */}
                    <div className="hidden lg:flex flex-col border-l border-grain relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {active ? (
                                <motion.div
                                    key={active}
                                    className="absolute inset-0 flex flex-col"
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {/* Image */}
                                    <div className="relative flex-1 overflow-hidden">
                                        <Image
                                            src={disciplineImages[active]}
                                            alt={t(`${active}.title`)}
                                            fill
                                            className="object-cover"
                                            sizes="500px"
                                        />
                                        {/* Gradient into description area */}
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
                                    </div>

                                    {/* Text */}
                                    <div className="px-10 pt-6 pb-10 bg-paper shrink-0">
                                        <p className="font-mono text-label tracking-label uppercase text-ink/40 mb-3">
                                            {t(`${active}.subtitle`)}
                                        </p>
                                        <p className="font-garamond text-body leading-body text-ink/75">
                                            {t(`${active}.description`)}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="idle"
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <span className="font-cormorant italic text-2xl text-ink/15 select-none">
                                        {tAbout('practiceTitle')}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </LayoutGroup>

        </section>
    );
}
