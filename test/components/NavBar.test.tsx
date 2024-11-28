import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";

describe('NavBar', () => {
    it('Should render route links for navigation', () => {
        renderWithProviders();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /game|play/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /board/i })).toBeInTheDocument();
    });

    it('Should take user to another page when navigation link is clicked', async () => {
        const { user } = renderWithProviders();
        // Go to leaderboard page
        await user.click(screen.getByRole('link', { name: /board/i }));
        expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
        // Go to gameplay page
        await user.click(screen.getByRole('link', { name: /game|play/i }));
        expect(screen.getByRole('button', { name: /vanilla/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /multiplayer/i })).toBeInTheDocument();
    });
});
