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

const generateShells = () => {
    const prevLiveRounds = liveRoundsText.textContent !== ''
        ? parseInt(liveRoundsText.textContent[0])
        : 0
    const prevBlanks = blanksText.textContent !== ''
        ? parseInt(blanksText.textContent[0])
        : 0

    const prevShellAmount = prevLiveRounds + prevBlanks;
    let shellAmount = 0;

    // Generate shell amount until we get a different value than last time
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
        // Reset variables from previous iteration if conditions were not met
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

const startNewRound = () => {
    const prevItems = itemsText.textContent !== ''
        ? parseInt(itemsText.textContent[0])
        : 0
    let items = 0;

    // Generate item amount until we get a different value than last time
    do {
        items = Math.ceil(Math.random() * MAX_ITEMS);
    } while (items === prevItems);
    
    itemsText.textContent = items > 1
        ? `${items} items`
        : `${items} item`

    const [liveRounds, blanks] = generateShells();
    liveRoundsText.textContent = liveRounds > 1
        ? `${liveRounds} live rounds`
        : `${liveRounds} live round`
    blanksText.textContent = blanks > 1
        ? `${blanks} blanks`
        : `${blanks} blank`

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

    const lives = Math.floor(Math.random() * MAX_LIVES) + MIN_LIVES;
    livesText.textContent = `${lives} lives`;

    startNewRound();
});

refreshBtn.addEventListener('click', () => { startNewRound(); });