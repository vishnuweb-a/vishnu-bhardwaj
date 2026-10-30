import { describe, expect, it } from 'vitest';
import projects, { getOtherProjects, getProjectBySlug } from './projects';

const [first] = projects;

describe('getProjectBySlug', () => {
  it('resolves every project by its own slug', () => {
    for (const project of projects) {
      expect(getProjectBySlug(project.slug)).toBe(project);
    }
  });

  it('returns null for an unknown, empty or missing slug', () => {
    expect(getProjectBySlug('petzo')).toBeNull();
    expect(getProjectBySlug('')).toBeNull();
    expect(getProjectBySlug(undefined)).toBeNull();
  });

  it('keeps slugs unique so a route can never resolve ambiguously', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });
});

describe('getOtherProjects', () => {
  it('excludes the current project', () => {
    expect(getOtherProjects(first.slug)).not.toContain(first);
  });

  it('returns 2 by default and honours an explicit count', () => {
    expect(getOtherProjects(first.slug)).toHaveLength(2);
    expect(getOtherProjects(first.slug, 4)).toHaveLength(4);
  });

  it('keeps catalogue order, so the first project is skipped, not reshuffled', () => {
    expect(getOtherProjects(first.slug, 2)).toEqual([projects[1], projects[2]]);
    expect(getOtherProjects(projects[1].slug, 2)).toEqual([
      projects[0],
      projects[2],
    ]);
  });

  it('caps at the available projects and ignores an unknown slug', () => {
    expect(getOtherProjects(first.slug, 999)).toHaveLength(projects.length - 1);
    expect(getOtherProjects('petzo', 999)).toHaveLength(projects.length);
  });
});
