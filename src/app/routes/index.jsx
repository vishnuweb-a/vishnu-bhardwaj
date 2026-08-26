import { lazy, Suspense } from 'react';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/pages/Home/Home';
import NotFound from '@/pages/NotFound/NotFound';

// The project detail view is a genuine second page (design.md section 15), so
// it is split into its own chunk rather than shipped with the home route.
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail/ProjectDetail'));

// A deliberately blank hold rather than a spinner: the chunk resolves in a
// frame or two on any normal connection, and a flashing loader reads worse than
// nothing. The reserved height stops the page collapsing while it loads.
const RouteFallback = () => (
  <div className="min-h-[100dvh]" aria-hidden="true" />
);

const withLayout = (element) => <MainLayout>{element}</MainLayout>;

export const routes = [
  {
    path: '/',
    element: withLayout(<Home />),
  },
  {
    path: '/project/:slug',
    element: withLayout(
      <Suspense fallback={<RouteFallback />}>
        <ProjectDetail />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: withLayout(<NotFound />),
  },
];

export default routes;
