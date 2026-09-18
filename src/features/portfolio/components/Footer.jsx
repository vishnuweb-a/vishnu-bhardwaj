import { useLocation } from 'react-router-dom';
import { assets, navigation, profile } from '../data';
import SocialRail from './SocialRail';

export const Footer = ({ className = '' }) => {
  const { pathname } = useLocation();
  return (
    <footer className={`border-t border-line py-8 ${className}`}>
      <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
        <a
          href={pathname === '/' ? '#home' : '/'}
          className="inline-flex w-fit items-center gap-3 rounded-sm"
        >
          <img
            src={assets.avatar}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            className="size-10 rounded-full object-cover"
          />
          <span className="text-sm font-semibold">{profile.fullName}</span>
        </a>
        <SocialRail />
      </div>
      <nav aria-label="Footer" className="mt-5">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {navigation.map((item) => (
            <li key={item.id}>
              <a
                href={pathname === '/' ? item.href : `/${item.href}`}
                className="inline-flex min-h-11 items-center rounded-sm text-xs text-ink-muted hover:text-ink hover:underline underline-offset-4"
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* The same file the hero offers, repeated where a visitor who has
              read to the end would look for it. */}
          <li>
            <a
              href={profile.resumeHref}
              download
              className="inline-flex min-h-11 items-center rounded-sm text-xs text-ink-muted hover:text-ink hover:underline underline-offset-4"
            >
              {profile.resumeLabel}
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};
export default Footer;
