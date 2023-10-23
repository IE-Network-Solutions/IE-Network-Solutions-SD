const getFormattedTime = (expirationTime) => {
    const currentTime = Date.now();
    const timeDifference = expirationTime - currentTime;
    const minutes = Math.max(0, Math.floor(timeDifference / (1000 * 60))); // Calculate minutes, ensuring it doesn't go negative
    const seconds = Math.max(0, Math.floor((timeDifference / 1000) % 60)); // Calculate seconds, ensuring it doesn't go negative
    const formattedMinutes = minutes.toString().padStart(2, '0'); // Pad minutes with leading zero if needed
    const formattedSeconds = seconds.toString().padStart(2, '0'); // Pad seconds with leading zero if needed
    return `${formattedMinutes}:${formattedSeconds}`;
}

const startCountdown = (minutes) => {
    let seconds = minutes * 60;
    const countdownInterval = setInterval(() => {
        const formattedMinutes = Math.floor(seconds / 60).toString().padStart(2, '0');
        const formattedSeconds = (seconds % 60).toString().padStart(2, '0');
        console.log(`${formattedMinutes}:${formattedSeconds}`);

        // Check if the countdown has reached 00:00
        if (seconds <= 0) {
            clearInterval(countdownInterval); // Stop the countdown
            console.log("Countdown has ended!");
        }

        seconds--;
    }, 1000); // Update the countdown every 1 second (1000 milliseconds)
}

const generateVerificationCode = async () => {
    const expirationTimestamp = getFormattedTime(Date.now() + 60 * 60 * 1000);
    console.log("time", expirationTimestamp)
    startCountdown(expirationTimestamp);
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    return { code: verificationCode, expiresAt: expirationTimestamp };
}

module.exports = { generateVerificationCode };
