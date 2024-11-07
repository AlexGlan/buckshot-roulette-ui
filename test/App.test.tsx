import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from '../src/App';

describe('App', () => {
    beforeEach(() => {
        // Workaround since jsdom does not support <dialog> html element
        HTMLDialogElement.prototype.showModal = vi.fn().mockImplementation(
            function mock(this: HTMLDialogElement) { 
                this.open = true;
             }
        );
        HTMLDialogElement.prototype.close = vi.fn().mockImplementation(
            function mock(this: HTMLDialogElement) {
                this.open = false;
            }
        );
    });
    
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('Should render "Start Game" button on initial render', () => {
        render(<App />);
        expect(screen.getByRole('button')).toHaveTextContent(/start/i);
    });

    it('Should display game state and controls', async () => {
        render(<App />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));

        // Game state display
        expect(screen.getByText(/round \d+/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*lives/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*items/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*live .*/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*blank/i)).toBeInTheDocument();
        // Loadout display
        expect(within(screen.getByTestId('loadout')).getAllByText('', { selector: 'span' }));
        // Buttons for gameplay
        expect(screen.getByRole('button', { name: /restore/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /phone/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /round/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
    });

    it('Should display a modal showing which player goes first in the first round', async () => {
        render(<App />);
        const user = userEvent.setup();

        // Should show modal
        await user.click(screen.getByRole('button'));
        expect(screen.getByText(/round 1/i)).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeVisible();
        expect(screen.getByText(/first/i)).toBeInTheDocument();
        // Should close modal
        await user.click(screen.getByRole('button', { name: /close/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Should remove or restore shells in the loadout when the respective control buttons are clicked', async () => {
        render(<App />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByRole('button', { name: /close/i }));

        let initialShellCount: number = 0;
        const removeBtn = screen.getByRole('button', { name: /remove/i });
        const restoreBtn = screen.getByRole('button', { name: /restore/i });
        const loadoutContainer = screen.getByTestId('loadout');
        initialShellCount = within(loadoutContainer).getAllByText('', { selector: 'span' }).length;

        // Remove shells
        await user.click(removeBtn);
        expect(within(loadoutContainer).getAllByText('', { selector: 'span' }).length).toEqual(initialShellCount - 1);
        await user.click(removeBtn);
        expect(within(loadoutContainer).getAllByText('', { selector: 'span' }).length).toEqual(initialShellCount - 2);
        // Restore shells
        await user.click(restoreBtn);
        expect(within(loadoutContainer).getAllByText('', { selector: 'span' }).length).toEqual(initialShellCount - 1);
        await user.click(restoreBtn);
        expect(within(loadoutContainer).getAllByText('', { selector: 'span' }).length).toEqual(initialShellCount);
        // Should not add new shells in a loadout
        await user.click(restoreBtn);
        expect(within(loadoutContainer).getAllByText('', { selector: 'span' }).length).toEqual(initialShellCount);
    });

    it('Should display a modal showing random shell location when burner phone button is clicked', async () => {
        render(<App />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByRole('button', { name: /close/i }));

        // Should show modal
        await user.click(screen.getByRole('button', { name: /phone/i }));
        expect(screen.getByRole('dialog')).toBeVisible();
        expect(screen.getByText(/shell.*round/i)).toBeInTheDocument();
        // Should close modal
        await user.click(screen.getByRole('button', { name: /close/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Should generate and display next game round state after "New Round" button is clicked', async () => {
        render(<App />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByRole('button', { name: /close/i }));

        expect(screen.getByText(/round 1/i)).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: /round/i }));
        expect(screen.getByText(/round 2/i)).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByText(/\d+.*lives/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*items/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*live .*/i)).toBeInTheDocument();
        expect(screen.getByText(/\d+.*blank/i)).toBeInTheDocument();
        expect(within(screen.getByTestId('loadout')).getAllByText('', { selector: 'span' }));
    });

    it('Should display a restart confirmation modal when restart button is clicked', async () => {
        render(<App />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        await user.click(screen.getByRole('button', { name: /close/i }));
        await user.click(screen.getByRole('button', { name: /round/i }));

        const restartBtn = screen.getByRole('button', { name: /restart/i });
        await user.click(restartBtn);
        // Should show confirmation modal
        expect(screen.getByRole('dialog')).toBeVisible();
        expect(screen.getByText(/are you sure/i));
        expect(screen.getByRole('button', { name: /yes/i }));
        expect(screen.getByRole('button', { name: /no/i }));
        // Clicking "No" should not make any changes in game state and close the modal
        await user.click(screen.getByRole('button', { name: /no/i }));
        expect(screen.getByText(/round 2/i)).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        // Clicking "Yes" should reset the game state to the first round
        await user.click(restartBtn);
        await user.click(screen.getByRole('button', { name: /yes/i }));
        expect(screen.getByText(/round 1/i)).toBeInTheDocument();
        expect(screen.getByText(/first/i)).toBeInTheDocument();
    });
});
