import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import routesConfig from '../src/routes/routesConfig';
import { RootState, setupStore } from '../src/app/store';
import { Provider } from 'react-redux';

export const renderWithProviders = (
    options = {
        initialEntries: ['/'],
        initialIndex: 0,
    },
    preloadedState: Partial<RootState> = {}
) => {
    const router = createMemoryRouter(routesConfig, options);
    const store = setupStore(preloadedState);

    return {
        user: userEvent.setup(),
        ...render(
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        )
    }
}
