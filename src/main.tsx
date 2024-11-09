import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routesConfig from './routes/routesConfig';
import './styles/main.scss';
import { setupStore } from './app/store';
import { Provider } from 'react-redux';

const router = createBrowserRouter(routesConfig, { basename: '/buckshot-roulette-ui/' });
const store = setupStore();

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
