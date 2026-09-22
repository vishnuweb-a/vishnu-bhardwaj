import { useBytePet } from '../hooks/useBytePet';
import ByteCharacter from './ByteCharacter';
import ByteSpeechBubble from './ByteSpeechBubble';
import '../byte.css';

/**
 * BYTE - the site-wide companion.
 *
 * Pointer discipline, which is the part that decides whether the site still
 * works: the fixed shell spans nothing. It is sized exactly to the pet and
 * positioned by `translate3d`, so there is no full-viewport overlay to
 * intercept anything. `pointer-events-none` on the shell and `auto` on the
 * button means even the transparent corners of BYTE's own bounding box stay
 * click-through; only the body itself is a target.
 *
 * Layering: the navbar is `sticky z-30` and the skip link focuses to `z-50`.
 * BYTE takes `z-40` - above the page content it walks over, below the skip
 * link, and low enough that any dialog or drawer added later at `z-50`+ will
 * cover it without needing to know BYTE exists.
 *
 * The interactive element is a real `<button>`, so focus, Enter and Space come
 * from the platform rather than from re-implemented key handling. Nothing on
 * the site depends on BYTE: it carries no information a visitor needs, which
 * is why the character itself is `aria-hidden` and only the button is exposed.
 */
export const BytePet = () => {
  const {
    shellRef,
    bodyRef,
    mood,
    section,
    bubble,
    gaze,
    ready,
    blocking,
    handlers,
    bodyHandlers,
  } = useBytePet();

  return (
    <div
      ref={shellRef}
      data-byte-shell
      data-mood={mood}
      data-section={section}
      className="byte-shell pointer-events-none fixed top-0 left-0 z-40"
      style={{ opacity: ready ? 1 : 0 }}
    >
      <div className="relative size-[74px] md:size-[104px]">
        <ByteSpeechBubble text={bubble} />

        <button
          type="button"
          {...handlers}
          aria-label="BYTE, interactive portfolio companion"
          // The page always wins. While BYTE is over a link, button or field,
          // it stops taking pointer events entirely, so the control underneath
          // is clickable straight through the pet. It stays keyboard
          // reachable throughout - only pointer targeting is yielded.
          className={`byte-button block size-full cursor-grab rounded-full active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            blocking ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <span
            ref={bodyRef}
            {...bodyHandlers}
            data-byte-body
            className="byte-body block size-full"
          >
            {/* The gait wrapper owns the walk bounce alone, so a looped
                bounce and a one-off gesture never write the same transform. */}
            <span data-byte-gait className="byte-gait block size-full">
              <ByteCharacter mood={mood} gaze={gaze} />
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default BytePet;
