import { useEffect, useId, useRef, useState } from 'react';
import { Container, Pill } from '@/components/ui';
import { ArrowUpRight, Close, Menu } from '@/components/ui/icons';
import { navigation, profile } from '../data';
import AvailabilityPill from './AvailabilityPill';

// The navbar is NOT sticky. Measured at video t=4.17 the nav ink falls to
// 0.52/255 and never returns through t=16, so it scrolls away with the hero and
// stays gone (design.md section 8). No fixed positioning, no shrink-on-scroll,
// no scroll-spy and no progress bar - all four are on the NOT OBSERVED list.
//
// The anchors themselves are an accessibility requirement rather than an
// observed behaviour: the reference never demonstrates a nav click, but links
// that lead nowhere are a defect, so they are real in-page anchors against
// sections carrying scroll-margin-top (rule.md Rule 4, Rule 17).
//
// The mobile disclosure below is INFERRED. The references are desktop-only at a
// single 1440px viewport; a menu is a responsive necessity, logged as inferred
// in design.md section 16 rather than presented as reproduction.

const NavLink = ({ item, onNavigate, className = '' }) => (
  <a
    href={item.href}
    onClick={onNavigate}
    className={`group inline-flex items-baseline gap-1.5 rounded-sm text-base font-medium text-ink transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 ${className}`}
  >
    {item.label}
    {item.count != null ? (
      <span className="relative -top-1 text-xs tracking-tight text-ink-subtle">
        [{item.count}]
      </span>
    ) : null}
  </a>
);

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  // Escape closes the menu and returns focus to the control that opened it.
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

      if (event.key !== 'Tab') {
        return;
      }

      // Keep focus inside the open panel.
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!focusables || focusables.length === 0) {
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header data-hero-nav className="relative z-30 pt-10 lg:pt-14">
      <Container variant="wide">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between gap-6"
        >
          <AvailabilityPill className="hidden md:block" />

          <ul className="hidden flex-1 items-center justify-center gap-10 lg:flex xl:gap-[8.5rem] xl:pl-40">
            {navigation.map((item) => (
              <li key={item.id}>
                <NavLink item={item} />
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Pill
              as="a"
              href={profile.contactHref}
              tone="solid"
              size="md"
              className="px-4 text-[0.9375rem] hover:bg-ink sm:px-5 sm:text-base"
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
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface-raised text-ink shadow-pill transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 lg:hidden"
            >
              {open ? <Close size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* The wrapper is the sanctioned grid-template-rows collapse, so
            nothing animates a height. `inert` while closed keeps the clipped
            links out of the tab order instead of focusing something invisible. */}
        <div
          id={menuId}
          ref={panelRef}
          data-expanded={open}
          inert={!open}
          className="collapsible lg:hidden"
        >
          <div>
            <ul className="mt-6 flex flex-col gap-1 rounded-2xl border border-line bg-surface-raised p-2 shadow-pill">
              {navigation.map((item) => (
                <li key={item.id}>
                  <NavLink
                    item={item}
                    onNavigate={closeMenu}
                    className="w-full px-4 py-3"
                  />
                </li>
              ))}
              <li className="px-4 py-3">
                <AvailabilityPill className="md:hidden" />
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
