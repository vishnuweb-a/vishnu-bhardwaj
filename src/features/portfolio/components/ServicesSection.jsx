import { useState } from 'react';
import { Container, Pill } from '@/components/ui';
import { ArrowUpRight } from '@/components/ui/icons';
import { services } from '../data';
import { useServicesMotion } from '../hooks/useServicesMotion';
import ServiceCard from './ServiceCard';
import TechnologyTicker from './TechnologyTicker';

export const ServicesSection = () => {
  const [paused, setPaused] = useState(false);
  const ref = useServicesMotion(paused);

  return (
    <section
      ref={ref}
      id="service"
      aria-labelledby="service-heading"
      className="border-y border-line py-16 lg:py-20"
    >
      <Container variant="base">
        <div className="flex items-center justify-between gap-12">
          <div data-service-reveal>
            <p className="font-mono text-xs text-ink-muted">
              Services / What I Build
            </p>
            <h2
              id="service-heading"
              className="mt-5 font-display text-display-lg leading-tight font-medium tracking-tight text-ink"
            >
              From idea to
              <br />
              working product.
            </h2>
            <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-ink-muted">
              I build production-focused digital products across web, mobile,
              backend systems and AI — designed to solve a real problem, not
              just look impressive.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="relative mr-10 hidden size-32 shrink-0 items-center justify-center lg:flex"
          >
            <div
              data-build-ring
              className="absolute inset-0 rounded-full border border-dashed border-control"
            />
            <div className="absolute inset-3 rounded-full border border-line" />
            <span className="font-mono text-xs tracking-[0.2em] text-ink-muted">
              BUILD
            </span>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12 lg:mt-12 lg:gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
        <TechnologyTicker
          paused={paused}
          onToggle={() => setPaused((value) => !value)}
        />
        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-3xl border border-line bg-surface-raised p-6 sm:p-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs text-ink-muted">Have something in mind?</p>
            <h3 className="mt-2 max-w-[36ch] font-display text-2xl leading-snug font-medium tracking-tight text-ink sm:text-3xl">
              Let’s turn it into something people can actually use.
            </h3>
          </div>
          <Pill
            as="a"
            href="#contact"
            tone="solid"
            size="lg"
            className="hover:bg-ink active:opacity-80"
          >
            Start a project
            <ArrowUpRight size={18} />
          </Pill>
        </div>
      </Container>
    </section>
  );
};

export default ServicesSection;
