import { Link } from 'react-router-dom';
import { Container, Pill } from '@/components/ui';
import { ArrowLeft } from '@/components/ui/icons';
import { useDocumentTitle } from '@/hooks';
import { profile } from '@/features/portfolio';

export const NotFound = () => {
  useDocumentTitle(`Page not found - ${profile.documentTitle}`);

  return (
    <Container
      variant="wide"
      className="flex min-h-[80dvh] flex-col justify-center py-24"
    >
      <p className="text-xs tracking-[0.14em] text-ink-subtle uppercase">404</p>
      <h1 className="mt-4 font-display text-display-md leading-[0.95] font-bold tracking-[0.02em] text-ink uppercase">
        Page not found
      </h1>
      <p className="mt-5 max-w-[48ch] text-lg text-ink-muted">
        That address does not match anything on this site. It may have been
        renamed, or the link that brought you here may be out of date.
      </p>
      <div className="mt-9">
        <Pill as={Link} to="/" tone="solid" size="md" className="hover:bg-ink">
          <ArrowLeft size={16} />
          Back to home
        </Pill>
      </div>
    </Container>
  );
};

export default NotFound;
