let currentVideo;
let previousVideo = null;
let correctAnswer;
let videoPaths = [
    { path: "CUT/Bijwerkingen/clip1.mp4", answer: "Bijwwerkingen" },
    { path: "CUT/Bijwerkingen/clip2.mp4", answer: "Bijwwerkingen" },
    { path: "CUT/Schijnvertoning/clip1.mp4", answer: "Schijnvertoning" },
    { path: "CUT/Schijnvertoning/clip2.mp4", answer: "Schijnvertoning" },
    { path: "CUT/Vriezenendooien/clip1.mp4", answer: "Vriezen & dooien" },
    { path: "CUT/Vriezenendooien/clip2.mp4", answer: "Vriezen & dooien" },
    { path: "CUT/Vandewereld/clip1.mp4", answer: "Van de wereld" },
    { path: "CUT/Vandewereld/clip2.mp4", answer: "Van de wereld" }
];

let videoLocked = false;

function startVideo() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('logo').classList.add('small-logo');
    document.getElementById('videoContainer').style.display = 'block';
    document.getElementById('optionsContainer').style.display = 'flex';
    document.getElementById("content").style.display = "none";
    playRandomVideo(); // Start direct een video
}

function playRandomVideo() {
    let randomClip;
    do {
        randomClip = videoPaths[Math.floor(Math.random() * videoPaths.length)];
    } while (randomClip.path === previousVideo);

    const videoElement = document.getElementById('video');
    const videoSource = document.getElementById('videoSource');
    videoSource.src = randomClip.path;
    correctAnswer = randomClip.answer;
    previousVideo = randomClip.path;
    videoElement.load();
    videoElement.play();
    videoLocked = false;
    updateOptions(); // Werk de opties bij na het starten van de video
}

function updateOptions() {
    const options = getRandomOptions();
    const randomizedOptions = shuffleArray(options); // Willekeurige volgorde
    const buttons = document.querySelectorAll('#optionsContainer button');
    randomizedOptions.forEach((option, index) => {
        buttons[index].innerText = option;
    });
}

// Hulpfunctie om een array te shufflen (Fisher-Yates algoritme)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomOptions() {
    const uniqueAnswers = new Set();
    uniqueAnswers.add(correctAnswer);

    // Voeg tot maximaal 2 andere random opties toe, exclusief de correcte optie
    while (uniqueAnswers.size < 3) {
        const randomCategory = videoPaths[Math.floor(Math.random() * videoPaths.length)].answer;
        uniqueAnswers.add(randomCategory);
    }

    return Array.from(uniqueAnswers);
}

function checkAnswer(answer, button) {
    disableButtons(true);

    const buttons = document.querySelectorAll('#optionsContainer button');
    buttons.forEach(btn => {
        if (btn.innerText === correctAnswer) {
            btn.style.backgroundColor = "green";
            btn.style.color = "white";
        } else if (btn === button) {
            btn.style.backgroundColor = "red";
            btn.style.color = "white";
        } else {
            btn.style.backgroundColor = "#e4e145";
            btn.style.color = "red";
        }
        btn.style.pointerEvents = 'none';  // Disable hover effect after answer
    });

    setTimeout(() => {
        resetButtons();
        playRandomVideo(); // Start een nieuwe video
    }, 5000);
}

function disableButtons(disable) {
    const buttons = document.querySelectorAll('#optionsContainer button');
    buttons.forEach(button => {
        button.disabled = disable;
    });
}

function resetButtons() {
    const buttons = document.querySelectorAll('#optionsContainer button');
    buttons.forEach(button => {
        button.disabled = false;
        button.style.backgroundColor = "#e4e145";
        button.style.color = "red";
        button.style.pointerEvents = '';  // Enable hover effect again
    });
}

// Voeg touchstart en click toe om de knop te activeren op zowel desktops als touchscreens
document.querySelectorAll('#optionsContainer button').forEach(button => {
    button.addEventListener('click', (event) => handleButtonClick(event));
    button.addEventListener('touchstart', (event) => handleButtonClick(event), { passive: true });
});

function handleButtonClick(event) {
    const button = event.target;
    const answer = button.innerText;
    checkAnswer(answer, button);
}
