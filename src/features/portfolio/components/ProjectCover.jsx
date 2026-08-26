// Stands in for the card image on a project with no interface capture on
// record.
//
// The alternative was a stock photograph, which would misrepresent the work -
// a card in Selected Work reads as a picture of the thing that was built. This
// is a typographic cover instead: unmistakably a graphic rather than a
// screenshot, and made from the project's own name and stack.
//
// It reuses the site's existing move - a large low-contrast ghost of a word
// with the solid word set against it, the same pairing SectionHeading uses -
// so a card without a capture still reads as part of the same design rather
// than as a gap. Inverted, because the light surface cards already carry the
// captures and the dark ground gives the grid a deliberate rhythm.
//
// Decorative: the card's own h3 carries the title, so this is aria-hidden.
export const ProjectCover = ({ project }) => (
  <div
    aria-hidden="true"
    className="absolute inset-0 overflow-hidden bg-panel select-none"
  >
    <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[62%] font-display text-[clamp(2.75rem,8.5vw,5rem)] leading-none font-light tracking-[0.08em] whitespace-nowrap text-panel-ghost uppercase">
      {project.name}
    </span>

    <div className="absolute inset-x-0 bottom-0 p-5">
      <p className="font-display text-xl leading-none tracking-[0.02em] text-on-panel uppercase sm:text-2xl">
        {project.name}
      </p>
      <p className="mt-2 text-xs tracking-[0.08em] text-on-panel-muted uppercase">
        {(project.tools ?? []).slice(0, 3).join(' / ')}
      </p>
    </div>
  </div>
);

export default ProjectCover;
