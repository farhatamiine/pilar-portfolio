'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const disciplines = [
    {
        id: 'textile',
        number: '01',
        title: 'Arte Textil',
        subtitle: 'Bordado · Instalación · Tejido',
        description:
            'The needle as a tool of inscription. Thread as language. Each stitch is a decision, a scar, a mark of presence. Textile work that crosses the boundaries between craft, archive, and political gesture.',
        image: 'https://picsum.photos/seed/textile-d/600/800',
        accent: '#c8a882',
    },
    {
        id: 'photo',
        number: '02',
        title: 'Fotografía Alternativa',
        subtitle: 'Cianotipo · Wet plate · Gelatina de plata',
        description:
            "Light as memory. Obsolete processes reactivated to hold what digital cannot: the grain, the accident, the body's impression on the emulsion. Photography as contact, not capture.",
        image: 'https://picsum.photos/seed/photo-d/600/800',
        accent: '#a89070',
    },
    {
        id: 'performance',
        number: '03',
        title: 'Performance',
        subtitle: 'Cuerpo · Duración · Ritual',
        description:
            'The body as the primary site of knowledge. Performance as research — slow, durational, often painful. Acts that refuse documentation even as they demand witnesses.',
        image: 'https://picsum.photos/seed/performance-d/600/800',
        accent: '#8a8078',
    },
    {
        id: 'installation',
        number: '04',
        title: 'Instalación',
        subtitle: 'In situ · Espacio · Material',
        description:
            'Space made porous. Installations that activate rooms, corridors, thresholds — turning architecture into a body and the visitor into a participant. Site-specificity as a condition of meaning.',
        image: 'https://picsum.photos/seed/install-d/600/800',
        accent: '#b8a090',
    },
];

export function DisciplinesSection() {
    const [active, setActive] = useState<string | null>(null);
    const activeData = disciplines.find((d) => d.id === active);

    return (
        <section className="bg-paper py-24 md:py-36 overflow-hidden">
            {/* Header */}
            <div className="px-8 md:px-20 mb-16">
                <motion.p
                    className="font-mono text-xs tracking-[0.4em] uppercase text-ink/50 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Práctica
                </motion.p>
                <motion.h2
                    className="font-cormorant text-[clamp(2.5rem,5vw,5rem)] text-ink leading-tight"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    Cuatro formas de
                    <br />
                    <span className="italic">tocar el mundo</span>
                </motion.h2>
            </div>

            {/* Discipline rows */}
            <div className="border-t border-grain">
                {disciplines.map((d, i) => (
                    <motion.div
                        key={d.id}
                        className="group relative border-b border-grain cursor-pointer overflow-hidden"
                        onMouseEnter={() => setActive(d.id)}
                        onMouseLeave={() => setActive(null)}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                    >
                        {/* Expanding bg */}
                        <motion.div
                            className="absolute inset-0 bg-ink pointer-events-none"
                            animate={{ opacity: active === d.id ? 1 : 0 }}
                            transition={{ duration: 0.35 }}
                        />

                        <div className="relative z-10 flex items-center px-8 md:px-20 py-7 md:py-8 gap-6 md:gap-12">
                            <motion.span
                                className="font-mono text-xs tabular-nums shrink-0 transition-colors duration-300"
                                animate={{ color: active === d.id ? '#c8a882' : '#8a8078' }}
                            >
                                {d.number}
                            </motion.span>

                            <motion.h3
                                className="font-cormorant text-[clamp(1.6rem,3.5vw,3rem)] flex-1 leading-none"
                                animate={{
                                    color: active === d.id ? '#f4f0e8' : '#1a1714',
                                    fontStyle: active === d.id ? 'italic' : 'normal',
                                }}
                                transition={{ duration: 0.25 }}
                            >
                                {d.title}
                            </motion.h3>

                            <motion.p
                                className="hidden md:block font-mono text-[10px] tracking-widest uppercase w-48 shrink-0 text-right"
                                animate={{ color: active === d.id ? '#c8a882' : '#8a8078' }}
                                transition={{ duration: 0.25 }}
                            >
                                {d.subtitle}
                            </motion.p>

                            {/* Arrow */}
                            <motion.span
                                className="font-mono text-xs shrink-0"
                                animate={{
                                    color: active === d.id ? '#c8a882' : '#8a8078',
                                    x: active === d.id ? 4 : 0,
                                }}
                                transition={{ duration: 0.25 }}
                            >
                                →
                            </motion.span>
                        </div>

                        {/* Expanded description + image */}
                        <AnimatePresence>
                            {active === d.id && (
                                <motion.div
                                    className="relative z-10 flex gap-10 px-8 md:px-20 pb-10 overflow-hidden"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <p className="font-garamond text-paper/70 text-lg leading-relaxed max-w-xl flex-1">{d.description}</p>
                                    <div className="hidden lg:block w-32 h-40 relative shrink-0 overflow-hidden">
                                        <Image src={d.image} alt={d.title} fill className="object-cover" sizes="128px" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
