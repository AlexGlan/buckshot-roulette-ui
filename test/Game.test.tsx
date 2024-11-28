import { screen, within } from '@testing-library/react';
import { renderWithProviders } from './test-utils';

describe('Game', () => {
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

    it('Should render game mode selection buttons on initial render', () => {
        renderWithProviders();
        expect(screen.getByRole('button', { name: /vanilla/i })).toBeEnabled();
        expect(screen.getByRole('button', { name: /multiplayer/i })).toBeEnabled();
    });

    it('Should display correct regular game mode state and controls', async () => {
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /vanilla/i }));

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

    it('Should display correct multiplayer game mode state and controls', async () => {
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /multiplayer/i }));

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

    it('Should display a modal showing which player goes first in the first round of a regular game', async () => {
        const { user } = renderWithProviders();

        // Should show modal
        await user.click(screen.getByRole('button', { name: /vanilla/i }));
        expect(screen.getByText(/round 1/i)).toBeInTheDocument();
        expect(screen.getByRole('dialog')).toBeVisible();
        expect(screen.getByText(/first/i)).toBeInTheDocument();
        // Should close modal
        await user.click(screen.getByRole('button', { name: /close/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Should not display any modals and first player in the first round of a multiplayer game', async () => {
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /multiplayer/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('Should remove or restore shells in the loadout when the respective control buttons are clicked', async () => {
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /vanilla/i }));
        await user.click(screen.getByRole('button', { name: /close/i }));

        const removeBtn = screen.getByRole('button', { name: /remove/i });
        const restoreBtn = screen.getByRole('button', { name: /restore/i });
        const loadoutContainer = screen.getByTestId('loadout');
        const initialShellCount = within(loadoutContainer).getAllByText('', { selector: 'span' }).length;

        // Remove shells
        await user.click(removeBtn);
        expect(within(loadoutContainer).getAllByText('', { selector: 'span' }).length).toEqual(initialShellCount - 1);
        await user.click(removeBtn);
        expect(within(loadoutContainer).queryAllByText('', { selector: 'span' }).length).toEqual(initialShellCount - 2);
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
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /vanilla/i }));
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
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /vanilla/i }));
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
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /vanilla/i }));
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
        // Clicking "Yes" should return to game mode selection screen
        await user.click(restartBtn);
        await user.click(screen.getByRole('button', { name: /yes/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /vanilla/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /multiplayer/i })).toBeInTheDocument();
        expect(screen.queryByText(/round [0-9]+/i)).not.toBeInTheDocument();
    });

    it('Should preserve the game state across route changes', async () => {
        const { user } = renderWithProviders();
        await user.click(screen.getByRole('button', { name: /vanilla/i }));
        await user.click(screen.getByRole('button', { name: /close/i }));
        await user.click(screen.getByRole('button', { name: /round/i }));

        const currentRound: string = screen.getByText(/round \d+/i).textContent!;
        const currentLives: string = screen.getByText(/\d+.*lives/i).textContent!;
        const currentItems: string = screen.getByText(/\d+.*items/i).textContent!;
        const currentLiveRounds: string = screen.getByText(/\d+.*live .*/i).textContent!;
        const currentBlankRounds: string = screen.getByText(/\d+.*blank/i).textContent!;

        await user.click(screen.getByRole('link', { name: /board/i }));
        await user.click(screen.getByRole('link', { name: /game|play/i }));

        expect(screen.getByText(/round \d+/i).textContent).toMatch(currentRound)
        expect(screen.getByText(/\d+.*lives/i).textContent).toMatch(currentLives);
        expect(screen.getByText(/\d+.*items/i).textContent).toMatch(currentItems);
        expect(screen.getByText(/\d+.*live .*/i).textContent).toMatch(currentLiveRounds);
        expect(screen.getByText(/\d+.*blank/i).textContent).toMatch(currentBlankRounds);
    });
});
