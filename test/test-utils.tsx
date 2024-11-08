import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import routesConfig from '../src/routes/routesConfig';

export const renderWithProviders = (
    options = {
        initialEntries: ['/'],
        initialIndex: 0,
    }
) => {
    const router = createMemoryRouter(routesConfig, options);
    const user = userEvent.setup();

    return {
        user,
        ...render(<RouterProvider router={router} />)
    }
}
