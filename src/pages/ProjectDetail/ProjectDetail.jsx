import { useLayoutEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, MediaFrame, Pill, SectionHeading } from '@/components/ui';
import { ArrowLeft, ArrowUpRight } from '@/components/ui/icons';
import { useDocumentTitle, useScrollReveal } from '@/hooks';
import { revealOnScroll, staggerReveal } from '@/animations';
import {
  AvailabilityPill,
  ContactSection,
  ProjectCard,
  getOtherProjects,
  getProjectBySlug,
  profile,
} from '@/features/portfolio';
import NotFound from '@/pages/NotFound/NotFound';

// The project detail view measured from video t=17.2-21.0 (design.md 15).
// This is a genuine second page, not a modal: it has its own URL, survives a
// refresh, and the browser's back button returns to the home route.
//
// The top bar is not sticky, matching the home route's navbar.

const MetaBlock = ({ label, children }) => (
  <div className="sm:text-right">
    <dt className="text-xs tracking-[0.08em] text-ink-subtle uppercase">
      {label}
    </dt>
    <dd className="mt-1.5 text-base leading-snug text-ink">{children}</dd>
  </div>
);

export const ProjectDetail = () => {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  const headerRef = useScrollReveal(
    staggerReveal({ each: 40, translateY: [12, 0], duration: 400 }),
    {
      selector: '[data-reveal-item]',
    }
  );
  const mediaRef = useScrollReveal(
    staggerReveal({ each: 40, translateY: [12, 0], duration: 400 }),
    {
      selector: '[data-reveal-media]',
    }
  );
  const moreRef = useScrollReveal(
    revealOnScroll({ translateY: [12, 0], duration: 400 })
  );

  // An unknown slug falls through to NotFound below, which sets its own title.
  useDocumentTitle(
    project ? `${project.name} - ${profile.documentTitle}` : null
  );

  // A route change keeps the previous scroll offset by default, which would
  // drop the visitor into the middle of a page they have not seen.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return <NotFound />;
  }

  const more = getOtherProjects(project.slug, 2);

  return (
    <>
      <Container variant="base" className="border-b border-line py-5">
        <div className="flex items-center justify-between gap-4">
          <Pill
            as={Link}
            to="/"
            tone="raised"
            size="md"
            className="hover:border-ink"
          >
            <ArrowLeft size={16} />
            Back
          </Pill>
          <AvailabilityPill className="hidden sm:block" />
        </div>
      </Container>

      <Container variant="base" className="py-12 lg:py-16">
        <div
          ref={headerRef}
          className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20"
        >
          <div>
            <ul data-reveal-item className="flex flex-wrap gap-2">
              {(project.tags ?? []).map((tag) => (
                <li key={tag}>
                  <Pill tone="chip" size="xs">
                    {tag}
                  </Pill>
                </li>
              ))}
            </ul>

            <h1
              data-reveal-item
              className="mt-6 font-display text-display-md leading-[0.98] font-bold tracking-[0.01em] text-ink uppercase"
            >
              {project.name}{' '}
              <span className="font-normal text-ink-muted">
                /{project.category}
              </span>
            </h1>

            <p
              data-reveal-item
              className="mt-6 max-w-[60ch] text-base text-ink-muted"
            >
              {project.description}
            </p>

            <div data-reveal-item className="mt-9 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <Pill
                  as="a"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  tone="solid"
                  size="md"
                  className="hover:bg-ink"
                >
                  Live Preview
                  <ArrowUpRight size={15} />
                </Pill>
              ) : null}
              {/* Contact Me carries no arrow here, unlike every other CTA on
                  the site ([measured], design.md section 15). */}
              <Pill
                as="a"
                href={profile.contactHref}
                tone="raised"
                size="md"
                className="hover:border-ink"
              >
                {profile.contact.cta}
              </Pill>
            </div>
          </div>

          <dl
            data-reveal-item
            className="flex flex-col gap-8 lg:w-[280px] lg:items-end"
          >
            <MetaBlock label="Service">{project.service}</MetaBlock>
            <MetaBlock label="Role">{project.role}</MetaBlock>
            <div className="sm:text-right">
              <dt className="text-xs tracking-[0.08em] text-ink-subtle uppercase">
                Tools
              </dt>
              <dd className="mt-2 flex flex-wrap gap-2 sm:justify-end">
                {(project.tools ?? []).map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex h-9 items-center rounded-lg border border-line bg-surface-raised px-3 text-sm text-ink-muted shadow-pill"
                  >
                    {tool}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </Container>

      <Container variant="base">
        {/* Only projects with a capture on record render a showcase. An empty
            `images` array collapses the stack rather than filling the page with
            frames for screenshots that do not exist. */}
        <div ref={mediaRef} className="flex flex-col gap-8 lg:gap-12">
          {(project.images ?? []).map((image) => (
            <figure
              key={image.alt}
              data-reveal-media
              className="rounded-lg border border-line bg-surface p-3 sm:p-4"
            >
              <MediaFrame
                src={image.src}
                alt={image.alt}
                ratio="page"
                // A tall device capture is shown whole here, not cropped: this
                // is the one place on the site where the complete screen is
                // the point.
                fit={image.fit ?? 'cover'}
                width={1040}
                height={780}
                rounded="rounded-md"
              />
            </figure>
          ))}
        </div>

        <p className="mt-8 border-l-2 border-accent py-3 pl-6 text-base text-ink-muted max-w-prose">
          {project.caption}
        </p>
      </Container>

      {more.length > 0 ? (
        <Container variant="base" className="pt-16 pb-16 lg:pt-20">
          <div ref={moreRef}>
            <SectionHeading label="/More Work" />
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {more.map((item) => (
              <li key={item.slug}>
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}

      <ContactSection />
    </>
  );
};

export default ProjectDetail;
