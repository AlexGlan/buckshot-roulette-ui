import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Button from '../../src/components/Button';

describe('Button', () => {
    const label = 'Click Me';
    const eventHandler = vi.fn();
    const ariaLabel = 'Accessible title';

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('Should render a button element with correct label', async () => {
        render(<Button label={label} handleClick={eventHandler} />);
        const button = screen.getByRole('button');
        expect(button).toBeEnabled();
        expect(button).toHaveTextContent(label);
    });

    it('Should render a button element with correct accessible label if provided', async () => {
        render(<Button ariaLabel={ariaLabel} label={'+'} handleClick={eventHandler} />);
        expect(screen.getByRole('button')).toHaveAccessibleName(ariaLabel);
    });

    it('Should call event handler once when clicked', async () => {
        render(<Button label={label} handleClick={eventHandler} />);
        const user = userEvent.setup();
        await user.click(screen.getByRole('button'));
        expect(vi.isMockFunction(eventHandler)).toBe(true);
        expect(eventHandler).toHaveBeenCalledOnce();
    });
});
