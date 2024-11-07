import { render, screen } from '@testing-library/react';
import Modal from '../../src/components/Modal';

describe('Modal', () => {
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

    const modalId: string = 'test';
    const children: React.ReactNode = (
        <>
            <h1>Title</h1>
            <p>Text</p>
            <button>Click Me</button>
        </>
    );

    it('Should render modal element with correct state', () => {
        const { rerender } = render(<Modal id={modalId} modalStatus={false} children={children} />);
        expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
        rerender(<Modal id={modalId} modalStatus={true} children={children} />);
        expect(screen.getByRole('heading')).toBeInTheDocument();
        expect(screen.getByRole('paragraph')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('Should handle toggle behaviour correctly', () => {
        const { rerender } = render(<Modal id={modalId} modalStatus={false} children={children} />);
        expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();

        rerender(<Modal id={modalId} modalStatus={true} children={children} />);
        expect(screen.getByRole('dialog', { hidden: false })).toBeVisible();

        rerender(<Modal id={modalId} modalStatus={false} children={children} />);
        expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
    });
});
