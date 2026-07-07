let current = 0;
const flow = Array.from(document.querySelectorAll('.scene, .image-scene'));
const progress = document.querySelector('.progress');
const bgMusic = document.getElementById('bgMusic');

function initializeProgress() {
    if (!progress) return;
    progress.innerHTML = flow.map((_, index) => `<span class="dot${index === 0 ? ' active' : ''}"></span>`).join('');
}

function playBackgroundMusic() {
    if (bgMusic) {
        bgMusic.volume = 0.4;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Background music play failed:', error);
            });
        }
    }
}

function show(index) {
    flow.forEach((element, itemIndex) => {
        const active = itemIndex === index;
        element.classList.toggle('active', active);
        element.setAttribute('aria-hidden', String(!active));
    });

    updateProgress(index);
    const actionButton = flow[index].querySelector('button');
    if (actionButton) {
        actionButton.focus({ preventScroll: true });
    }
}

function updateProgress(index) {
    if (!progress) return;
    progress.querySelectorAll('.dot').forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
    });
}

function nextScene() {
    if (current >= flow.length - 1) {
        return;
    }

    current += 1;
    
    if (current === 1) {
        playBackgroundMusic();
    }

    show(current);

    if (flow[current].id === 'scene8') {
        triggerFinalFade();
    }

    if (flow[current].classList.contains('image-scene')) {
        setTimeout(() => {
            if (current < flow.length - 1 && flow[current].classList.contains('image-scene')) {
                nextScene();
            }
        }, 3200);
    }
}

function revealAudio() {
    const hiddenAudio = document.getElementById('hiddenAudio');
    hiddenAudio.classList.add('revealed');
    hiddenAudio.setAttribute('aria-hidden', 'false');

    const audio = hiddenAudio.querySelector('audio');
    if (audio) {
        audio.play().catch(() => {});
        audio.focus({ preventScroll: true });
    }

    const scene = hiddenAudio.closest('.scene');
    const button = scene?.querySelector('button');
    if (button) {
        button.textContent = 'Continue';
        button.onclick = nextScene;
        button.focus({ preventScroll: true });
    }
}

function triggerFinalFade() {
    const final = document.getElementById('finalFade');
    if (!final) return;

    setTimeout(() => {
        final.classList.add('visible');
    }, 2400);
}

function restartFlow() {
    current = 0;
    const final = document.getElementById('finalFade');
    final?.classList.remove('visible');

    const hiddenAudio = document.getElementById('hiddenAudio');
    if (hiddenAudio) {
        hiddenAudio.classList.remove('revealed');
        hiddenAudio.setAttribute('aria-hidden', 'true');
        const audio = hiddenAudio.querySelector('audio');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        const scene = hiddenAudio.closest('.scene');
        const button = scene?.querySelector('button');
        if (button) {
            button.textContent = 'Continue';
            button.onclick = revealAudio;
        }
    }

    show(current);
}

window.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        if (document.activeElement?.tagName !== 'BUTTON') {
            event.preventDefault();
            nextScene();
        }
    }
});

initializeProgress();
show(current);