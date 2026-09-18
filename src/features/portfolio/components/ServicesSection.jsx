import { useState } from 'react';
import { Container, SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll } from '@/animations';
import { services } from '../data';
import ServiceRow from './ServiceRow';

export const ServicesSection = () => {
  const [openId, setOpenId] = useState(services[0]?.id ?? null);
  const headingRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );
  return (
    <section
      id="service"
      aria-labelledby="service-heading"
      className="border-y border-line bg-surface-raised py-16 lg:py-20"
    >
      <Container variant="base">
        <div ref={headingRef}>
          <SectionHeading id="service-heading" label="/Service" />
        </div>
        <div className="mt-8 border-t border-line">
          {services.map((service, index) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={index}
              expanded={openId === service.id}
              onToggle={() =>
                setOpenId((current) =>
                  current === service.id ? null : service.id
                )
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
export default ServicesSection;
