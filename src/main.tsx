import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from './routes/routesConfig';
import './styles/main.scss';

const router = createBrowserRouter(routesConfig, { basename: '/buckshot-roulette-ui/' });

createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
