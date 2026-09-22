import { Link } from 'react-router-dom';
import { Container, Pill } from '@/components/ui';
import { ArrowLeft, Compass } from '@/components/ui/icons';
import { useAnimation, useDocumentTitle } from '@/hooks';
import { revealDown, revealUp } from '@/animations';
import { profile } from '@/features/portfolio';

// The numeral is the page's only ornament, so it carries the display face at a
// size no heading uses elsewhere. The gradient mask fades its lower third into
// the canvas, which keeps it from competing with the message beneath it - the
// same device as the reference, expressed as a Tailwind mask utility rather
// than a second stacked element.
const NUMERAL =
  'font-display text-[clamp(7rem,26vw,16rem)] leading-[0.8] font-extrabold ' +
  'tracking-[0.02em] text-ink mask-b-from-30% mask-b-to-95%';

export const NotFound = () => {
  useDocumentTitle(`Page not found - ${profile.documentTitle}`);

  // Both elements are authored in their final state, so the reduced-motion
  // path in useAnimation leaves a correct page (CLAUDE.md section 8, rule 4).
  const numeralRef = useAnimation(revealDown({ translateY: [-18, 0] }));
  const bodyRef = useAnimation(revealUp({ translateY: [24, 0], delay: 120 }));

  return (
    <Container
      variant="base"
      className="flex min-h-[80dvh] flex-col items-center justify-center py-24 text-center"
    >
      <p
        ref={numeralRef}
        className={NUMERAL}
        // The numeral restates the heading below it; announcing both would
        // read as "404, page not found, 404".
        aria-hidden="true"
      >
        404
      </p>

      <div ref={bodyRef} className="-mt-2 flex flex-col items-center sm:-mt-4">
        <h1 className="font-display text-display-md leading-[0.95] font-bold tracking-[0.02em] text-ink uppercase">
          Page not found
        </h1>
        <p className="mt-4 max-w-[46ch] text-balance text-lg text-ink-muted">
          That address does not match anything on this site. It may have been
          renamed, or the link that brought you here may be out of date.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Pill
            as={Link}
            to="/"
            tone="solid"
            size="md"
            className="hover:bg-ink"
          >
            <ArrowLeft size={16} />
            Back to home
          </Pill>
          {/* A plain anchor, not a router Link: react-router does not scroll
              to a hash target on navigation, so `to="/#work"` would land at the
              top of the home page. A full document request resolves the
              fragment natively, which is what the navbar's links already do. */}
          <Pill
            as="a"
            href="/#work"
            tone="raised"
            size="md"
            className="border-control hover:bg-surface"
          >
            <Compass size={16} />
            View the work
          </Pill>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
