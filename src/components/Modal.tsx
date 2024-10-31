import { useEffect, useRef } from "react"

type ModalProps = {
    id: string,
    modalStatus: boolean,
    children: React.ReactNode
}

const Modal = ({id, modalStatus, children}: ModalProps) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const timesRendered = useRef<number>(0);

    useEffect(() => {
        timesRendered.current++;
        /**
         * Prevent modal from opening up on first render 
         * when the app just loaded and has no state data yet
         */
        if (timesRendered.current === 1) {
            return;
        }

        if (dialogRef.current?.open) {
            dialogRef.current?.close();
        } else {
            dialogRef.current?.showModal();
        }
    }, [modalStatus]);

    return (
        <dialog ref={dialogRef} key={id}>
            {children}
        </dialog>
    )
}

export default Modal;
