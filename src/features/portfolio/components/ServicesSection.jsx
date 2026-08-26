import { useState } from 'react';
import { Container, SectionHeading } from '@/components/ui';
import { useScrollReveal } from '@/hooks';
import { revealOnScroll, staggerReveal } from '@/animations';
import { services } from '../data';
import ServiceRow from './ServiceRow';

// The services background is --color-canvas, flat. service.webp shows a
// photographic cloud composite behind these rows, but the video at the same
// section (t=9.0, confirmed by autocontrast) shows a flat near-white page: the
// cloud is the presentation backdrop, not the site (design.md section 17,
// row 1). The SERVICE watermark, absent from the same screenshot, is present in
// the video and is reproduced (row 2).
//
// One row open at a time. The reference only ever shows a single expanded
// panel, and a single-open accordion keeps the page from growing unpredictably.
export const ServicesSection = () => {
  const [openId, setOpenId] = useState(services[0]?.id ?? null);

  const headingRef = useScrollReveal(revealOnScroll());
  const rowsRef = useScrollReveal(staggerReveal({ each: 130 }), {
    selector: '[data-reveal-row]',
  });

  return (
    <section
      id="service"
      aria-labelledby="service-heading"
      className="bg-canvas py-24 lg:py-32"
    >
      <Container variant="wide">
        <div ref={headingRef}>
          <SectionHeading
            id="service-heading"
            label="/Service"
            watermark="Service"
            className="pt-10 pl-1"
          />
        </div>

        <div ref={rowsRef} className="mt-20 flex flex-col gap-2 lg:mt-28">
          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
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
