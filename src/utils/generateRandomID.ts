const generateRandomID = (idLength: number = 10): string => {
    if (typeof idLength !== 'number') {
        idLength = 10;
    }
    let uid: string = '';
    for (let i = 0; i < idLength; i++) {
        const random: string = Math.random() > 0.5
            ? Math.floor(Math.random() * 10).toString()
            : Math.random() > 0.5
                ? String.fromCharCode(Math.floor(Math.random() * (90 - 65 + 1)) + 65)
                : String.fromCharCode(Math.floor(Math.random() * (122 - 97 + 1)) + 97)
        uid += random;
    }
    return uid;
}

export default generateRandomID;
