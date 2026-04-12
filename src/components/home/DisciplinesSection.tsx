'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const disciplineIds = ['textile', 'photo', 'performance', 'installation'] as const;
type DisciplineId = typeof disciplineIds[number];

const disciplineImages: Record<DisciplineId, string> = {
    textile: 'https://picsum.photos/seed/textile-d/600/800',
    photo: 'https://picsum.photos/seed/photo-d/600/800',
    performance: 'https://picsum.photos/seed/performance-d/600/800',
    installation: 'https://picsum.photos/seed/install-d/600/800',
};

const disciplineAccents: Record<DisciplineId, string> = {
    textile: '#c8a882',
    photo: '#a89070',
    performance: '#8a8078',
    installation: '#b8a090',
};

export function DisciplinesSection() {
    const [active, setActive] = useState<DisciplineId | null>(null);
    const t = useTranslations('disciplines');
    const tAbout = useTranslations('about');

    return (
        <section className="bg-paper py-24 md:py-36 overflow-hidden">
            {/* Header */}
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
                    className="font-cormorant text-title text-ink leading-head"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="italic">{tAbout('practiceTitle')}</span>
                </motion.h2>
            </div>

            {/* Discipline rows */}
            <div className="border-t border-grain">
                {disciplineIds.map((id, i) => (
                    <motion.div
                        key={id}
                        className="group relative border-b border-grain cursor-pointer overflow-hidden"
                        onMouseEnter={() => setActive(id)}
                        onMouseLeave={() => setActive(null)}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                        {/* Expanding bg */}
                        <motion.div
                            className="absolute inset-0 bg-ink pointer-events-none"
                            animate={{ opacity: active === id ? 1 : 0 }}
                            transition={{ duration: 0.35 }}
                        />

                        <div className="relative z-10 flex items-center px-8 md:px-20 py-7 md:py-8 gap-6 md:gap-12">
                            <motion.span
                                className="font-mono text-xs tabular-nums shrink-0 transition-colors duration-300"
                                animate={{ color: active === id ? '#c8a882' : '#8a8078' }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </motion.span>

                            <motion.h3
                                className="font-cormorant text-heading flex-1 leading-none"
                                animate={{
                                    color: active === id ? '#f4f0e8' : '#1a1714',
                                    fontStyle: active === id ? 'italic' : 'normal',
                                }}
                                transition={{ duration: 0.25 }}
                            >
                                {t(`${id}.title`)}
                            </motion.h3>

                            <motion.p
                                className="hidden md:block font-mono text-label tracking-label uppercase w-48 shrink-0 text-right"
                                animate={{ color: active === id ? '#c8a882' : '#8a8078' }}
                                transition={{ duration: 0.25 }}
                            >
                                {t(`${id}.subtitle`)}
                            </motion.p>

                            {/* Arrow */}
                            <motion.span
                                className="font-mono text-xs shrink-0"
                                animate={{
                                    color: active === id ? '#c8a882' : '#8a8078',
                                    x: active === id ? 4 : 0,
                                }}
                                transition={{ duration: 0.25 }}
                            >
                                →
                            </motion.span>
                        </div>

                        {/* Expanded description + image — grid-template-rows avoids height:auto jank */}
                        <motion.div
                            className="relative z-10"
                            style={{ display: 'grid' }}
                            animate={{
                                gridTemplateRows: active === id ? '1fr' : '0fr',
                                opacity: active === id ? 1 : 0,
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div style={{ overflow: 'hidden' }}>
                                <div className="flex gap-10 px-8 md:px-20 pb-10">
                                    <p className="font-garamond text-paper/70 text-body leading-body max-w-xl flex-1">{t(`${id}.description`)}</p>
                                    <div className="hidden lg:block w-32 h-40 relative shrink-0 overflow-hidden">
                                        <Image src={disciplineImages[id]} alt={t(`${id}.title`)} fill className="object-cover" sizes="128px" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
