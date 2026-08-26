import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';

// react-router-dom was approved for the project detail route (design.md 21.1).
// A view-state switch would have cost shareable URLs and correct back-button
// semantics, both of which test.md requires.
const router = createBrowserRouter(routes);

export const App = () => <RouterProvider router={router} />;

export default App;
