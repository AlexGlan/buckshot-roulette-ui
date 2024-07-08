// Button elements
const startBtn = document.getElementById('start-btn');
const refreshBtn = document.getElementById('refresh-btn');
const decrementBtn = document.getElementById('decrement-btn');
const incrementBtn = document.getElementById('increment-btn');
const phoneBtn = document.getElementById('phone-btn');
const closePhoneModalBtn = document.getElementById('close-phone-modal-btn');
const closePlayerModalBtn = document.getElementById('close-player-modal-btn');
const restartBtn = document.getElementById('restart-btn');
const confirmRestartBtn = document.getElementById('confirm-restart-btn');
const cancelRestartBtn = document.getElementById('cancel-restart-btn');

// Text elements
const roundText = document.getElementById('round');
const firstPlayerText = document.getElementById('first-player');
const livesText = document.getElementById('lives');
const itemsText = document.getElementById('items');
const liveRoundsText = document.getElementById('shell-live-rounds');
const blanksText = document.getElementById('shell-blanks');
const phoneText = document.getElementById('phone-output');

// Other elements
const phoneModal = document.getElementById('phone-modal');
const playerModal = document.getElementById('player-modal');
const gameRestartModal = document.getElementById('restart-modal');
const loadoutDiv = document.getElementById('loadout');

const MIN_LIVES = 3;
const MAX_LIVES = 5;
const MIN_ITEMS = 2;
const MAX_ITEMS = 3;
const MIN_SHELLS = 2;
const MAX_SHELLS = 8;
const PLAYER_ONE_NAME = 'Skull';
const PLAYER_TWO_NAME = 'Pilot';
const LOADOUT = [];
const USED_SHELLS = [];
const SHELL_LOCATIONS = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eigth'
];

/**
 * Starts a new game and first round.
 * Initializes the first player, random amounts of lives, items, and shells.
 * Updates DOM with new game state.
 * 
 * @returns {void}
 */
const generateFirstRound = () => {
    startBtn.classList.add('hidden');
    decrementBtn.classList.remove('hidden');
    phoneBtn.classList.remove('hidden');
    incrementBtn.classList.remove('hidden');
    roundText.classList.remove('hidden');
    refreshBtn.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    
    roundText.textContent = 'Round 1';

    // Set first player
    const firstPlayer = Math.random() > 0.5 ? PLAYER_ONE_NAME : PLAYER_TWO_NAME;
    firstPlayerText.textContent = `"${firstPlayer}" goes first`;
    playerModal.showModal();

    // Set lives
    const lives = Math.floor(Math.random() * (MAX_LIVES - MIN_LIVES + 1)) + MIN_LIVES;
    livesText.textContent = `${lives} lives`;
    triggerTypewriterAnimation(livesText);

    setShells();
    setItems();
}

/**
 * Starts a new round by updating the amount of items and shells.
 * Updates DOM with new game state.
 * 
 * @returns {void}
 */
const generateNextRound = () => {
    // Set round counter
    const [text, count] = roundText.textContent.split(' ');
    roundText.textContent = `${text} ${parseInt(count) + 1}`;

    setShells();
    setItems();
}

/**
 * Generates and sets random shells in a loadout.
 * Updates DOM with the result.
 * 
 * @returns {void}
 */
const setShells = () => {
    let loadoutSize = 0;

    // Generate random amount of shells until we get a different value than last time
    do {
        loadoutSize = Math.floor(Math.random() * (MAX_SHELLS - MIN_SHELLS + 1)) + MIN_SHELLS;
    } while (loadoutSize === LOADOUT.length);

    // Empty loadout array from previous shells
    LOADOUT.length = 0;
    USED_SHELLS.length = 0;
    loadoutDiv.innerHTML = '';

    let amountLive = Math.max(1, Math.floor(loadoutSize / 2));
    let amountBlank = loadoutSize - amountLive;
    
    // Add live and blank rounds to loadout array
    for (let i = 0; i < loadoutSize; i++ ) {
        if (i < amountLive) {
            LOADOUT.push({
                type: 'live',
                id: `shell-${i + 1}`
            });
        } else {
            LOADOUT.push({
                type: 'blank',
                id: `shell-${i + 1}`
            });
        }
    }

    // Shuffle loadout array to simulate inserting shells in a hidden sequence
    for (let i = LOADOUT.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = LOADOUT[i];

        LOADOUT[i] = LOADOUT[j];
        LOADOUT[j] = temp;
    }
    
    liveRoundsText.textContent = amountLive > 1
        ? `${amountLive} live rounds`
        : `${amountLive} live round`
    triggerTypewriterAnimation(liveRoundsText);

    blanksText.textContent = amountBlank > 1
        ? `${amountBlank} blanks`
        : `${amountBlank} blank`
    triggerTypewriterAnimation(blanksText);
    
    LOADOUT.forEach(shell => {
        loadoutDiv.innerHTML += `
            <span
                id="${shell.id}"
                class="shell ${shell.type}"
            >
            </span>
        `;
    });
}

/**
 * Generates and sets random amount of items.
 * Updated DOM with the result.
 * 
 * @returns {void}
 */
const setItems = () => {
    const prevItems = itemsText.textContent !== ''
        ? parseInt(itemsText.textContent[0])
        : 0
    let items = 0;

    // Generate random amount of items until we get a different value than last time
    do {
        items = Math.floor(Math.random() * (MAX_ITEMS - MIN_ITEMS + 1)) + MIN_ITEMS;
    } while (items === prevItems);

    if (LOADOUT.length > 6) {
        items += 1;
    }

    itemsText.textContent = `${items} items`;
    triggerTypewriterAnimation(itemsText);
}

/**
 * Shows the location and type of a random shell in loadout.
 * Updates DOM with the result.
 * 
 * @returns {void}
 */
const usePhone = () => {
    if (LOADOUT.length > 1) {
        const randomVal = Math.floor(Math.random() * (LOADOUT.length - 1)) + 1;
        const revealShell = LOADOUT[randomVal];
        const revealLocation= SHELL_LOCATIONS[randomVal];
        phoneText.textContent = `${revealLocation} shell ${revealShell.type} round`
    } else {
        phoneText.textContent = 'How Unfortunate';
    } 
}

/**
 * Triggers CSS typewriter animation on the specified element.
 * 
 * @param {HTMLElement} elem - HTML element on which to run the animation.
 * @returns {void}
 */
const triggerTypewriterAnimation = (elem) => {
    if (elem.classList.contains('typewriter-animation')) {
        elem.classList.remove('typewriter-animation');
        // Restart CSS animation
        elem.offsetWidth;
    }
    elem.classList.add('typewriter-animation');
}

startBtn.addEventListener('click', generateFirstRound);
refreshBtn.addEventListener('click', generateNextRound);

decrementBtn.addEventListener('click', () => {
    if (USED_SHELLS.length === 0) {
        return;
    }
    // Put last removed shell back into loadout
    const prevShell = USED_SHELLS.pop();
    LOADOUT.unshift(prevShell);
    
    // Disable fade-in animation on re-render
    const prevShellElem = document.getElementById(prevShell.id);
    prevShellElem.style.animation = 'none';
    prevShellElem.style.opacity = 1;
    prevShellElem.classList.toggle('hidden');
});

incrementBtn.addEventListener('click', () => {
    if (LOADOUT.length === 0) {
        return;
    }
    // Remove current shell from a loudout
    const currentShell = LOADOUT.shift();
    document.getElementById(currentShell.id).classList.toggle('hidden');
    USED_SHELLS.push(currentShell);
});

phoneBtn.addEventListener('click', () => {
    usePhone();
    phoneModal.showModal();
});

closePhoneModalBtn.addEventListener('click', () => {
    phoneModal.close();
});

closePlayerModalBtn.addEventListener('click', () => {
    playerModal.close();
});

restartBtn.addEventListener('click', () => {
    gameRestartModal.showModal();
});

confirmRestartBtn.addEventListener('click', () => {
    gameRestartModal.close();
    generateFirstRound();
});

cancelRestartBtn.addEventListener('click', () => {
    gameRestartModal.close();
});