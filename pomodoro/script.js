const timerDisplay = document.getElementById('timer-display');
const modeDisplay = document.getElementById('mode-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const testWorkSoundBtn = document.getElementById('test-work-sound');
const testBreakSoundBtn = document.getElementById('test-break-sound');

// HTMLからaudio要素を取得
const workSound = document.getElementById('work-sound-audio');
const breakSound = document.getElementById('break-sound-audio');

let timer;
let isWorkTime = true;
let timeLeft = 25 * 60;

// 音声再生関数
function playSound(audioElement) {
    if (!audioElement) {
        console.error("Audio element not found!");
        return;
    }

    // play()はPromiseを返す
    const playPromise = audioElement.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("Playback failed:", error);
            // ユーザーに具体的な対処法を提示
            alert(
                `音声の再生がブラウザにブロックされました。\n\n` +
                `このサイトの音声を許可するには、アドレスバーの左側にあるアイコン（鍵マークなど）をクリックし、` +
                `サイトの設定から「音声」を「許可」に変更してください。\n\n` +
                `設定変更後にページを再読み込みすると、音が鳴るようになります。`
            );
        });
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateMode() {
    if (isWorkTime) {
        modeDisplay.textContent = '作業中';
        document.body.classList.remove('break-time');
    } else {
        modeDisplay.textContent = '休憩中';
        document.body.classList.add('break-time');
    }
}

function startTimer() {
    if (timer) clearInterval(timer);

    // 最初のスタート時に一度だけ、無音で再生を試みる（iOS対策）
    workSound.muted = true;
    workSound.play().catch(() => {});
    workSound.muted = false;

    timer = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft < 0) {
            clearInterval(timer);
            isWorkTime = !isWorkTime;
            timeLeft = (isWorkTime ? 25 : 5) * 60;
            updateMode();
            updateDisplay();
            
            if (isWorkTime) {
                playSound(workSound);
            } else {
                playSound(breakSound);
            }
            
            startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    isWorkTime = true;
    timeLeft = 25 * 60;
    updateMode();
    updateDisplay();
}

// イベントリスナー
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

testWorkSoundBtn.addEventListener('click', () => {
    playSound(workSound);
});

testBreakSoundBtn.addEventListener('click', () => {
    playSound(breakSound);
});

// 初期表示
updateMode();
updateDisplay();