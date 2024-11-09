import { useState } from "react";
import { generateItems, generateLives, generateShells, usePhone } from "../utils/gameUtils";
import Button from "../components/Button";
import Modal from "../components/Modal";
import generateRandomID from "../utils/generateRandomID";
import NavBar from "../components/NavBar";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setFirstPlayer, setGameObj, setGameStatus, setLives, setRound } from "../app/gameSlice";

export type Shell = {
    type: string,
    id: string
}

const MIN_LIVES: number = 3;
const MAX_LIVES: number = 4;
const MIN_ITEMS: number = 2;
const MAX_ITEMS: number = 3;
const MIN_SHELLS: number = 2;
const MAX_SHELLS: number = 8;
const PLAYER_ONE_NAME: string = 'Skull';
const PLAYER_TWO_NAME: string = 'Pilot';
const SHELL_LOCATIONS: string[] = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eigth'
];

const App = () => {
    const dispatch = useAppDispatch();
    const isGameStarted = useAppSelector(state => state.game.isGameStarted);
    const firstPlayer = useAppSelector(state => state.game.firstPlayer);
    const round = useAppSelector(state => state.game.round);
    const lives = useAppSelector(state => state.game.lives);
    const gameObj = useAppSelector(state => state.game.gameObj);

    const [playerModalStatus, setPlayerModalStatus] = useState<boolean>(false);
    const [phoneModalStatus, setPhoneModalStatus] = useState<boolean>(false);
    const [restartModalStatus, setRestartModalStatus] = useState<boolean>(false);
    const [livesKey, setLivesKey] = useState<string>(generateRandomID());
    const [itemsKey, setItemsKey] = useState<string>(generateRandomID());
    const [liveShellsKey, setLiveShellsKey] = useState<string>(generateRandomID());
    const [blankShellsKey, setBlankShellsKey] = useState<string>(generateRandomID());

    const generateFirstRound = (): void => {
        dispatch(setRound(1));
        dispatch(setLives(generateLives(MIN_LIVES, MAX_LIVES)));
        dispatch(setFirstPlayer(Math.random() > 0.5 ? PLAYER_ONE_NAME : PLAYER_TWO_NAME));

        const startLoadout: Shell[] = generateShells(MIN_SHELLS, MAX_SHELLS)
        const startItems: number = generateItems(MIN_ITEMS, MAX_ITEMS, startLoadout.length);
        const liveShells: number = startLoadout.reduce((acc, curr) => {
            return curr.type === 'live' ? acc += 1 : acc
        }, 0);
        const blankShells: number = startLoadout.length - liveShells;
        dispatch(setGameObj({
            ...gameObj,
            items: startItems,
            loadout: startLoadout,
            liveShells,
            blankShells
        }));
        
        dispatch(setGameStatus(true));
        toggleModal('player-modal');
        // Restart CSS amination
        setLivesKey(generateRandomID());
        setItemsKey(generateRandomID());
        setLiveShellsKey(generateRandomID());
        setBlankShellsKey(generateRandomID());
    }

    const generateNextRound = (): void => {
        dispatch(setRound());
        const newLoadout: Shell[] = generateShells(MIN_SHELLS, MAX_SHELLS, gameObj.loadout.length);
        const newItems: number = generateItems(MIN_ITEMS, MAX_ITEMS, newLoadout.length, gameObj.items);
        const liveShells: number = newLoadout.reduce((acc, curr) => {
            return curr.type === 'live' ? acc += 1 : acc
        }, 0);
        const blankShells: number = newLoadout.length - liveShells;
        dispatch(setGameObj({
            ...gameObj,
            items: newItems,
            loadout: newLoadout,
            usedShells: [],
            liveShells,
            blankShells
        }));
        // Restart CSS amination
        setItemsKey(generateRandomID());
        setLiveShellsKey(generateRandomID());
        setBlankShellsKey(generateRandomID());
    }

    const removeShell = (): void => {
        if (gameObj.loadout.length === 0) {
            return;
        }
        // Remove current shell from a loudout
        dispatch(setGameObj({
            ...gameObj,
            loadout: [...gameObj.loadout.slice(1)],
            usedShells: [...gameObj.usedShells, gameObj.loadout[0]]
        }))
    }

    const restoreShell = (): void => {
        if (gameObj.usedShells.length === 0) {
            return;
        }
        // Put last removed shell back into loadout
        dispatch(setGameObj({
            ...gameObj,
            loadout: [...gameObj.usedShells.slice(-1), ...gameObj.loadout],
            usedShells: [...gameObj.usedShells.slice(0, -1)] 
        }))
    }

    const toggleModal = (modalID: string): void => {
        switch (modalID) {
            case 'player-modal':
                setPlayerModalStatus(prevStatus => !prevStatus);
                break;
            case 'phone-modal':
                setPhoneModalStatus(prevStatus => !prevStatus);
                break;
            case 'restart-modal':
                setRestartModalStatus(prevStatus => !prevStatus);
                break;
            default:
                break;
        }
    }

    let content: React.ReactNode;

    if (!isGameStarted) {
        content = (
            <Button label="Start Game" handleClick={generateFirstRound} variant="start" />
        );
    } else {
        content = (
            <>
                <h1>Round {round}</h1>
                <div className="container">
                    <div className="outputs">
                        <p key={livesKey} className="stats typewriter-animation">{lives} lives</p>
                        <p key={itemsKey} className="stats typewriter-animation">{gameObj.items} items</p>
                    </div>
                    <div className="outputs">
                        <p key={liveShellsKey} className="stats typewriter-animation">{gameObj.liveShells} live rounds</p>
                        <p key={blankShellsKey} className="stats typewriter-animation">{gameObj.blankShells} blanks</p>
                    </div>
                    <div className="loadout-container" data-testid="loadout">
                        {
                            gameObj.loadout.map(shell => (
                                <span key={shell.id} className={`shell ${shell.type}`}></span>
                            ))
                        }
                    </div>
                    <div className="controls-container">
                        <Button label="−" handleClick={restoreShell} variant="control" ariaLabel="Restore shell" />
                        <Button
                            label="Brn Phone"
                            handleClick={() => { toggleModal('phone-modal'); }}
                            variant="standard"
                        />
                        <Button label="+" handleClick={removeShell} variant="control" ariaLabel="Remove shell" />
                    </div>
                    <Button label="New Round" handleClick={generateNextRound} variant="standard" />
                    <Button
                        label="Restart"
                        handleClick={() => { toggleModal('restart-modal'); }}
                        variant="standard"
                    />
                </div>
            </>
        )
    }

    return (
        <>
            <NavBar />
            <main className="game-content">
                {content}
            </main>
            <Modal
                id="player-modal"
                modalStatus={playerModalStatus}
                children={(
                <>
                    <p className="typewriter-animation-modal">"{firstPlayer}" goes first</p>
                    <Button
                        label="Close"
                        handleClick={() => { toggleModal('player-modal'); }}
                        variant="standard"
                    />
                </>
                )}
            />
            <Modal
                id="phone-modal"
                modalStatus={phoneModalStatus}
                children={(
                <>
                    <p className="typewriter-animation-modal">{usePhone(gameObj.loadout, SHELL_LOCATIONS)}</p>
                    <Button
                        label="Close"
                        handleClick={() => { toggleModal('phone-modal'); }}
                        variant="standard"
                    />
                </>
                )}
            />
            <Modal
                id="restart-modal"
                modalStatus={restartModalStatus}
                children={(
                <>
                    <p className="typewriter-animation-modal">Are you sure?</p>
                    <Button
                        label="Yes"
                        handleClick={() => {
                            toggleModal('restart-modal');
                            generateFirstRound();
                        }}
                        variant="standard"
                    />
                    <Button
                        label="No"
                        handleClick={() => { toggleModal('restart-modal'); }}
                        variant="standard"
                    />
                </>
                )}
            />
        </>
    )
}

export default App;
