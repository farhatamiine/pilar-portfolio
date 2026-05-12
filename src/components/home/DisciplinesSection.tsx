'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const disciplineIds = ['textile', 'photo', 'performance', 'installation'] as const;
type DisciplineId = typeof disciplineIds[number];

const disciplineImages: Record<DisciplineId, string> = {
    textile:      'https://fastly.picsum.photos/seed/textile-d/800/600',
    photo:        'https://fastly.picsum.photos/seed/photo-d/800/600',
    performance:  'https://fastly.picsum.photos/seed/performance-d/800/600',
    installation: 'https://fastly.picsum.photos/seed/install-d/800/600',
};

export function DisciplinesSection() {
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

            {/* ── Accordion ── */}
            <Accordion
                type="single"
                defaultValue="textile"
                collapsible
                className="border-t border-grain"
            >
                {disciplineIds.map((id, i) => (
                    <AccordionItem
                        key={id}
                        value={id}
                        className="relative border-b border-grain group"
                    >
                        <AccordionTrigger
                            className="
                                px-8 md:px-20 py-7 md:py-9 gap-6 md:gap-10
                                cursor-pointer text-left
                                data-[state=open]:bg-ink
                                transition-colors duration-300
                            "
                        >
                            {/* Number */}
                            <span
                                className="
                                    font-mono text-xs tabular-nums shrink-0
                                    text-muted group-data-[state=open]:text-accent
                                    transition-colors duration-200
                                "
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>

                            {/* Title */}
                            <h3
                                className="
                                    font-cormorant text-heading flex-1 leading-none
                                    text-ink group-data-[state=open]:text-paper
                                    group-data-[state=open]:italic
                                    transition-all duration-200
                                "
                            >
                                {t(`${id}.title`)}
                            </h3>

                            {/* Subtitle (desktop) */}
                            <span
                                className="
                                    hidden md:block font-mono text-label tracking-label uppercase shrink-0
                                    text-muted group-data-[state=open]:text-accent
                                    transition-colors duration-200
                                "
                            >
                                {t(`${id}.subtitle`)}
                            </span>

                            {/* Arrow — rotates on open */}
                            <span
                                className="
                                    font-mono text-xs shrink-0
                                    text-muted group-data-[state=open]:text-accent
                                    transition-all duration-300
                                    group-data-[state=open]:rotate-90
                                "
                            >
                                →
                            </span>
                        </AccordionTrigger>

                        <AccordionContent
                            className="
                                bg-ink relative
                                grid grid-cols-1 md:grid-cols-2
                            "
                        >
                            {/* Text panel */}
                            <div className="px-8 md:px-20 py-8 md:py-12 space-y-4">
                                <p className="font-mono text-label tracking-label uppercase text-accent md:hidden">
                                    {t(`${id}.subtitle`)}
                                </p>
                                <p className="font-garamond text-body leading-body text-paper/75 max-w-prose">
                                    {t(`${id}.description`)}
                                </p>
                            </div>

                            {/* Image panel — desktop only */}
                            <div className="hidden md:block relative min-h-[320px] md:min-h-[420px] border-l border-paper/10">
                                <Image
                                    src={disciplineImages[id]}
                                    alt={t(`${id}.title`)}
                                    fill
                                    className="object-cover"
                                    sizes="50vw"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

        </section>
    );
}
