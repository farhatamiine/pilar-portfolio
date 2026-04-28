'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRef } from 'react';

const MotionLink = motion(Link);

function MagneticLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 200, damping: 20 });
    const springY = useSpring(y, { stiffness: 200, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set((e.clientX - cx) * 0.35);
        y.set((e.clientY - cy) * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <MotionLink
            ref={ref}
            href={href}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            {children}
        </MotionLink>
    );
}

export function CollaborateCTA() {
    const locale = useLocale();
    const t = useTranslations('collaborate');

    return (
        <section className="relative bg-ink overflow-hidden py-36 md:py-56 px-8 md:px-20">
            {/* Decorative large italic text in bg — floats slowly */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                aria-hidden
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
            >
                <span className="font-cormorant italic text-[clamp(8rem,22vw,18rem)] text-paper/[0.025] leading-none whitespace-nowrap">{t('heading')}</span>
            </motion.div>

            <div className="relative z-10 max-w-3xl">
                <motion.p
                    className="font-mono text-label tracking-label uppercase text-accent/90 mb-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {t('label')}
                </motion.p>

                <motion.h2
                    className="font-cormorant italic text-headline text-paper leading-display mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {t('heading')}
                </motion.h2>

                <motion.p
                    className="font-garamond text-paper/70 text-body leading-relaxed max-w-lg mb-14"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    {t('description')}
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                >
                    <MagneticLink
                        href={`/${locale}/contact`}
                        className="inline-flex items-center gap-3 font-mono text-label tracking-label uppercase bg-accent text-ink px-8 py-4 hover:bg-paper transition-colors group"
                    >
                        {t('cta')}
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </MagneticLink>

                    <a
                        href="mailto:mariapilarolivero@gmail.com"
                        className="font-mono text-label tracking-label uppercase text-paper/40 hover:text-paper/70 transition-colors"
                    >
                        mariapilarolivero@gmail.com
                    </a>
                </motion.div>
            </div>

            {/* Bottom rule */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-accent/10"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
            />
        </section>
    );
}
