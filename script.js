const startBtn = document.getElementById('start-btn');
const refreshBtn = document.getElementById('refresh-btn');
const roundText = document.getElementById('round');
const livesText = document.getElementById('lives');
const itemsText = document.getElementById('items');
const liveRoundsText = document.getElementById('shell-live-rounds');
const blanksText = document.getElementById('shell-blanks');

const MIN_LIVES = 2;
const MAX_LIVES = 5;
const MAX_ITEMS = 4;
const MIN_SHELLS = 2;
const MAX_SHELLS = 8;

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

/**
 * Generates random shells in a loadout.
 * 
 * @returns {number[]} Array containing two numbers representing live and blank rounds.
 */
const generateShells = () => {
    const prevLiveRounds = liveRoundsText.textContent !== ''
        ? parseInt(liveRoundsText.textContent[0])
        : 0
    const prevBlanks = blanksText.textContent !== ''
        ? parseInt(blanksText.textContent[0])
        : 0

    const prevShellAmount = prevLiveRounds + prevBlanks;
    let shellAmount = 0;

    // Generate random amount of shells until we get a different value than last time
    do {
        shellAmount = Math.floor(Math.random() * (MAX_SHELLS - MIN_SHELLS + 1)) + MIN_SHELLS;
    } while (shellAmount === prevShellAmount);

    let liveRounds = 0;
    let blanks = 0;

    while (
        liveRounds === 0 ||
        blanks === 0 ||
        liveRounds < Math.ceil(shellAmount / 3)
    ) {
        // Reset variables from previous iteration
        liveRounds = 0;
        blanks = 0;

        for (let i = 0; i < shellAmount; i++) {
            if (Math.random() > 0.5 || blanks === 4) {
                liveRounds++;
            } else {
                blanks++;
            }
        }
    }

    return [liveRounds, blanks];
}

/**
 * Starts a new round by generating and setting the random amount of items and shells.
 * Updates DOM with the result.
 */
const startNewRound = () => {
    const prevItems = itemsText.textContent !== ''
        ? parseInt(itemsText.textContent[0])
        : 0
    let items = 0;

    // Generate random amount of items until we get a different value than last time
    do {
        items = Math.ceil(Math.random() * MAX_ITEMS);
    } while (items === prevItems);
    
    itemsText.textContent = items > 1
        ? `${items} items`
        : `${items} item`
    triggerTypewriterAnimation(itemsText);

    const [liveRounds, blanks] = generateShells();
    liveRoundsText.textContent = liveRounds > 1
        ? `${liveRounds} live rounds`
        : `${liveRounds} live round`
    blanksText.textContent = blanks > 1
        ? `${blanks} blanks`
        : `${blanks} blank`
    triggerTypewriterAnimation(liveRoundsText);
    triggerTypewriterAnimation(blanksText);

    const [text, count] = roundText.textContent.split(' ');
    if (text !== '' && count !== '') {
        roundText.textContent = `${text} ${parseInt(count) + 1}`;
    } else {
        roundText.textContent = 'Round 1';
    }
}

startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden');
    roundText.classList.remove('hidden');
    refreshBtn.classList.remove('hidden');

    const lives = Math.floor(Math.random() * (MAX_LIVES - MIN_LIVES + 1)) + MIN_LIVES;
    livesText.textContent = `${lives} lives`;
    triggerTypewriterAnimation(livesText);

    startNewRound();
});

refreshBtn.addEventListener('click', () => { 
    startNewRound(); 
});