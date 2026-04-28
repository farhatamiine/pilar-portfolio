import { CollaborateCTA } from '@/components/home/CollaborateCTA';
import { DisciplinesSection } from '@/components/home/DisciplinesSection';
import { ExhibitionsTicker } from '@/components/home/ExhibitionsTicker';
import { Hero } from '@/components/home/Hero';
import { ProcessSection } from '@/components/home/ProcessSection';
import { ProjectGrid } from '@/components/home/ProjectGrid';
import { ProjectList } from '@/components/home/ProjectList';
import { SpotlightSection } from '@/components/home/SpotlightSection';
import { StatementSection } from '@/components/home/StatementSection';
import { getAllProjects } from '@/lib/strapi';
import { setRequestLocale } from 'next-intl/server';

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;
    setRequestLocale(locale);
    let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
    try {
        projects = await getAllProjects(locale);
    } catch (err) {
        console.error('[Home] Strapi fetch failed:', err);
    }
    const heroProject = projects[0] ?? null;

    return (
        <>
            {/* 1. Dark full-viewport hero */}
            <Hero featuredProject={heroProject} />

            {/* 2. Ticker: exhibitions & residencies */}
            <ExhibitionsTicker />

            {/* 3. Hover project list (desktop) / grid (mobile) */}
            <ProjectList projects={projects} />
            <ProjectGrid projects={projects} locale={locale} />

            {/* 4. Manifesto — word-by-word reveal on dark */}
            <StatementSection />

            {/* 5. Spotlight — 3 selected works with parallax */}
            <SpotlightSection projects={projects} />

            {/* 6. Disciplines — 4 expanding hover rows */}
            <DisciplinesSection />

            {/* 7. Process + bio + stats */}
            <ProcessSection />

            {/* 8. Collaborate CTA */}
            <CollaborateCTA />
        </>
    );
}
