import { useEffect, useId, useRef, useState } from 'react';
import { Container, Pill, ThemeToggle } from '@/components/ui';
import { ArrowUpRight, Close, Menu } from '@/components/ui/icons';
import { navigation, profile } from '../data';

const NavLink = ({ item, active, onNavigate, className = '' }) => (
  <a
    href={item.href}
    onClick={onNavigate}
    aria-current={active ? 'location' : undefined}
    className={`group inline-flex min-h-11 items-center gap-1.5 border-b-2 text-xs font-medium transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${active ? 'border-ink text-ink' : 'border-transparent text-ink-muted'} ${className}`}
  >
    {item.label}
    {item.count != null ? (
      <span className="text-[0.625rem] tabular-nums text-ink-subtle">
        [{item.count}]
      </span>
    ) : null}
  </a>
);

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const menuId = useId();
  const triggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-15% 0px -55% 0px' }
    );
    document
      .querySelectorAll('section[id]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      data-hero-nav
      className="sticky top-0 z-30 border-b border-line bg-canvas"
    >
      <Container variant="base">
        <nav
          aria-label="Primary"
          className="flex min-h-20 items-center justify-between gap-3"
        >
          <a
            href="#home"
            aria-label={profile.fullName}
            className="flex shrink-0 items-center gap-3 rounded-sm"
          >
            <span
              aria-hidden="true"
              className="font-display text-3xl font-medium tracking-[-0.12em]"
            >
              {profile.firstName[0]}
              {profile.lastName[0]}
            </span>
            <span className="hidden text-xs font-semibold sm:block">
              {profile.fullName}
            </span>
          </a>

          <ul className="hidden items-center justify-center gap-6 lg:flex xl:gap-8">
            {navigation.map((item) => (
              <li key={item.id}>
                <NavLink item={item} active={active === item.id} />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* In the persistent control group rather than inside the
                collapsible menu, so the theme is one press away at every
                breakpoint instead of being buried on mobile. */}
            <ThemeToggle />

            <Pill
              as="a"
              href={profile.contactHref}
              tone="solid"
              size="md"
              className="px-4 hover:bg-ink sm:px-5"
            >
              Let&apos;s Talk
              <ArrowUpRight size={15} />
            </Pill>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="inline-flex size-11 items-center justify-center rounded-md border border-control bg-surface-raised text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 lg:hidden"
            >
              {open ? <Close size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        <div id={menuId} hidden={!open} className="lg:hidden">
          <div>
            <ul className="flex flex-col gap-1 border-t border-line py-3">
              {navigation.map((item) => (
                <li key={item.id}>
                  <NavLink
                    item={item}
                    active={active === item.id}
                    onNavigate={closeMenu}
                    className="w-full px-4 py-3"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
