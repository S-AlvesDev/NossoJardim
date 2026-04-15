document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Controle de Música ---
    const bgMusic = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-btn");
    let isPlaying = false;
    
    if (bgMusic) bgMusic.volume = 0.4;

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            if (isPlaying) {
                bgMusic.pause();
            } else {
                bgMusic.play().catch(e => console.log("Interação necessária para autoplay"));
            }
            isPlaying = !isPlaying;
        });
    }

    // --- 2. Gerador Automático da Galeria (20 Fotos) ---
    const galleryContainer = document.getElementById("gallery-container");
    const totalFotos = 21;
    
    const frasesRomanticas = [
        "Você é o mel da minha vida.",
        "Tão doce quanto o néctar das flores.",
        "Meu coração sorri por você.",
        "Cada instante ao seu lado é mágico.",
        "Meu lugar favorito no mundo é o seu abraço.",
        "Você é a luz do meu dia.",
        "O destino mais lindo que eu poderia ter.",
        "Te amo mais a cada amanhecer.",
        "Minha paz tem o seu nome.",
        "Com você, a vida tem mais cor.",
        "Meu girassol em dias nublados.",
        "A melhor parte da minha história.",
        "Um amor que floresce a cada dia.",
        "Você é o meu sonho que virou realidade.",
        "Te devoro com os olhos e com a alma."
    ];

    if (galleryContainer) {
        for (let i = 1; i <= totalFotos; i++) {
            let frase = frasesRomanticas[(i - 1) % frasesRomanticas.length];
            let card = document.createElement("div");
            card.className = "premium-card fade-in";
            card.innerHTML = `
                <div class="image-container">
                    <img src="Amor${i}.webp" alt="Nosso Momento ${i}" loading="lazy">
                </div>
                <div class="card-info">
                    <p>“${frase}”</p>
                </div>
            `;
            galleryContainer.appendChild(card);
        }
    }

    // --- 3. Animação de Scroll (Fade-In) ---
    const fadeElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));

    // --- 4. Controle dos Modais Simples ---
    const poemModal = document.getElementById("poem-modal");
    const gameModal = document.getElementById("game-modal");

    const btnReadPoem = document.getElementById("btn-read-poem");
    const btnPlayGame = document.getElementById("btn-play-game");

    if (btnReadPoem && poemModal) btnReadPoem.onclick = () => poemModal.classList.add("active");
    if (btnPlayGame && gameModal) btnPlayGame.onclick = () => gameModal.classList.add("active");

    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.onclick = () => {
            if (poemModal) poemModal.classList.remove("active");
            if (gameModal) gameModal.classList.remove("active");
            if (typeof stopGame === "function") stopGame();
        };
    });

    // --- 5. Partículas Decorativas de Fundo ---
    function spawnBackgroundParticles() {
        const garden = document.getElementById("garden-background");
        if (!garden) return;
        const items = ['🌻', '✨', '💛'];
        
        for(let i = 0; i < 20; i++){
            const span = document.createElement("span");
            span.innerText = items[Math.floor(Math.random() * items.length)];
            span.style.position = "absolute";
            span.style.left = Math.random() * 100 + "vw";
            span.style.top = Math.random() * 100 + "vh";
            span.style.fontSize = (Math.random() * 15 + 10) + "px";
            span.style.opacity = Math.random() * 0.4 + 0.1;
            span.style.pointerEvents = "none";
            garden.appendChild(span);
        }
    }
    spawnBackgroundParticles();

    // --- 6. Carta DO TEMPO ---
    const btnOpenCarta = document.getElementById('btn-open-carta');
    const cartaModal = document.getElementById('carta-modal');
    const closeCartaBtn = document.getElementById('close-carta-btn');
    const lockedView = document.getElementById('carta-locked');
    const unlockedView = document.getElementById('carta-unlocked');

    if (btnOpenCarta && cartaModal) {
        btnOpenCarta.addEventListener('click', () => {
            cartaModal.classList.add('active');
            checkcartaDate();
        });
    }

    if (closeCartaBtn) {
        closeCartaBtn.addEventListener('click', () => {
            cartaModal.classList.remove('active');
        });
    }

    function checkCartaDate() {
        const today = new Date();
        const currentDay = today.getDate();

        // ATENÇÃO: Aqui está o 15 para você testar hoje. 
        // Lembre-se de mudar para 7 quando quiser que funcione só no dia 7!
        if (currentDay === 15) {
            if (lockedView) lockedView.classList.add('hidden');
            if (unlockedView) unlockedView.classList.remove('hidden');
        } else {
            if (unlockedView) unlockedView.classList.add('hidden');
            if (lockedView) lockedView.classList.remove('hidden');
        }
    }

    // --- 7. Motor do Jogo de Abelha ---
    const canvas = document.getElementById("beeGame");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const startScreen = document.getElementById("start-screen");
        const gameOverScreen = document.getElementById("game-over-screen");
        const scoreDisplay = document.getElementById("score-display");
        const finalScore = document.getElementById("final-score");

        let score = 0;
        let gameActive = false;
        let animationId;
        let potes = [];
        let bee = { x: 0, y: 0, w: 40, h: 40 };

        function initCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            bee.y = canvas.height - 60; 
            bee.x = canvas.width / 2;   
        }

        function createPote() {
            if (!gameActive) return;
            potes.push({
                x: Math.random() * (canvas.width - 40) + 20,
                y: -30,
                speed: 2 + (score * 0.3) 
            });
            let spawnRate = Math.max(500, 1500 - (score * 50));
            setTimeout(createPote, spawnRate);
        }

        function updateGame() {
            if (!gameActive) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.font = "40px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🐝", bee.x, bee.y);

            for (let i = potes.length - 1; i >= 0; i--) {
                let p = potes[i];
                p.y += p.speed;

                ctx.font = "35px Arial";
                ctx.fillText("🍯", p.x, p.y);

                let distX = Math.abs(bee.x - p.x);
                let distY = Math.abs(bee.y - p.y);

                if (distX < 35 && distY < 35) {
                    potes.splice(i, 1); 
                    score++;
                    scoreDisplay.innerText = `Potes: ${score}`;
                } 
                else if (p.y > canvas.height + 20) {
                    endGame();
                }
            }
            animationId = requestAnimationFrame(updateGame);
        }

        function startGame() {
            initCanvas();
            score = 0;
            potes = [];
            gameActive = true;
            scoreDisplay.innerText = "Potes: 0";
            startScreen.classList.add("hidden");
            gameOverScreen.classList.add("hidden");
            createPote();
            updateGame();
        }

        function endGame() {
            gameActive = false;
            cancelAnimationFrame(animationId);
            finalScore.innerText = score;
            gameOverScreen.classList.remove("hidden");
        }

        window.stopGame = function() {
            gameActive = false;
            cancelAnimationFrame(animationId);
            if (startScreen) startScreen.classList.remove("hidden");
            if (gameOverScreen) gameOverScreen.classList.add("hidden");
        }

        const handleMove = (e) => {
            if(!gameActive) return;
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX; 
            bee.x = clientX - rect.left;
            if (bee.x < 20) bee.x = 20;
            if (bee.x > canvas.width - 20) bee.x = canvas.width - 20;
        };

        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("touchmove", (e) => {
            e.preventDefault(); 
            handleMove(e);
        }, { passive: false });

        const btnStart = document.getElementById("start-game-btn");
        const btnRestart = document.getElementById("restart-btn");
        if (btnStart) btnStart.onclick = startGame;
        if (btnRestart) btnRestart.onclick = startGame;
        
        window.addEventListener("resize", () => {
            if(gameActive) initCanvas();
        });
    }

    // --- 8. Banco de Dados e Lógica do Museu de Poemas ---
    const poemasAntigos = [
        {
            titulo: "Tempestade Boa",
            texto: `No silêncio da noite,
a lua sussurra segredos,
estrelas dançam no céu,
e o vento leva meus medos.

É como uma brisa leve;
ela, com seus cabelos cacheados,
dançando sob a luz do luar,
na presença suave do vento…

Ainda assim, chegava como o sol,
com uma alegria que transbordava
e enchia tudo ao redor.

Sua alegria… ah.. era tempestade boa,
vinha de repente… e mudava tudo.

Podiam se passar dias,
ela sempre me surpreendia…
Espantando ausências,
e curando silêncios.

Ainda assim… não importava onde eu estava,
e nem com quem eu estaria,
todos podiam estar olhando para mim,
mas… ahh…
era nela em que eu me via…`
        },
        {
            titulo: "O Dom de Amar",
            texto: `No abraço que o destino me negou,
é você quem meu peito insiste em buscar.
Mesmo longe, o amor não recuou.

Se disserem pra eu te esquecer,
sorrio dizendo que nem de graça.
Porque amar você é querer viver,
e fazer de conta que o tempo não passa.

Guardo teu nome no canto mais bonito,
onde a saudade não pode tocar.
Pois foi no brilho suave do teu sorriso
que eu descobri o dom de amar.

Se o amor é feito de poesia,
és o verso mais belo que encontrei,
doce presença que adoça meus dias,
melhor destino que encontrei.`
        },
        {
            titulo: "Sopro Leve",
            texto: `No sopro leve da tarde,
o mundo dorme devagar,
e é o contorno dela que invade,
o silêncio do luar.

Num instante, entre cachos e brisas do vento,
flores nascem no coração,
e um sonho antigo se assenta
na palma da emoção.

Entre o vento que embaraça seus cachos
e o sorriso que sabe encantar,
há magia no doce abraço
de quem nasceu pra inspirar.

Aos dezessete, te encontrei…
seja bem-vinda, ah..
e jamais se viu coisa tão linda,
caminha comigo, pois ainda
há tempo para viver…

E se nossas vidas,
forem causas perdidas,
que sejamos poesia,
insistindo em florescer…

Seja amor ou leve brisa,
é nela que o verso insiste em florir:
poesia que a alma eterniza
só pra nunca se partir.`
        },
        {
            titulo: "Princípios",
            texto: `Entre silêncios que a noite guarda,
a lua borda reflexos no rio,
como se o tempo, em passos lentos,
dançasse escondido no frio.

As estrelas, tímidas, piscam segredos,
sussurrando histórias ao vento,
e cada folha que cai no caminho
traz um eco do eterno momento.

O campeão se ergue da luta,
não teme o frio da solidão,
pois sabe que em cada derrota
há sementes de superação.

E quando a vitória desponta,
não é sorte, nem simples paixão:
é fruto de treino e coragem,
os princípios de um campeão.

Dentro de mim, uma luz desperta,
feita de sonho, saudade e esperança,
um canto breve, mas tão profundo,
que veste de paz a lembrança.`
        },
        {
            titulo: "Silêncio da Tarde",
            texto: `Te encontrei no silêncio da tarde….
Seus olhos… ah.. são estrelas que acalmam,
meu porto, e meu chão.

O vento escreve no céu um recado,
que tudo é efêmero, mas nunca é em vão.
Até o mais frágil instante passado
se deita tranquilo no colo do coração.

Você é o doce da minha estrada,
a melodia que não canso de ouvir,
e a razão que me faz sorrir.

Nos seus gestos mora a calma,
Ah… e é você quem adoça minha alma,
quem dá vida ao meu coração.

Se um dia a distância vier,
lembre que nunca vou te esquecer,
pois, só quero você,
pra sempre comigo viver.

E assim seguimos, entre luz e escuro,
tecendo no agora um futuro maduro.
Pois a vida é ponte, e não prisão,
um rio que corre pedindo canção.`
        },
        {
            titulo: "Entre os Silêncios",
            texto: `Há palavras que não se dizem por completo,
preferem se vestir de silêncio e melodia.
Como se o coração, tímido,
escrevesse versos sem assinar o nome.

O sentimento corre leve,
feito rio que não precisa anunciar sua nascente.
Está ali, em cada gesto escondido,
em cada pausa que carrega mais do que o som.

Se eu pudesse transformar lembranças em notas,
deixaria que a música falasse por mim.
E em meio a tantos acordes dispersos,
um segredo repousaria, suave, e discreto.

Pois entre versos que ninguém suspeita,
há sempre um tom que se oferece à emoção.
E nele, ahhh… quase imperceptível,
mora a vontade antiga de dizer que amo,
como quem confessa apenas num poema.

E sigo, com passos tranquilos,
por caminhos que o coração traça,
porque a vida é feita de instantes,
e a poesia, de eterna esperança.`
        },
        {
            titulo: "Meu Girassol",
            texto: `Não preciso mais adivinhar teus silêncios,
eles já falam na língua do costume.
Teu riso é abrigo, tua voz é norte,
e em cada toque, o mundo fica mais alegre.

O silêncio que antes guardava segredos
hoje repousa em paz entre nossos risos.
Já não preciso esconder o que sinto;
Já que é demonstrado a cada riso meu.

Se antes eu escrevia à distância,
hoje o poema é corpo e presença.
Te amar é viver o verso inteiro,
sem vírgulas, sem pressa,
apenas certeza.

Porque amar, enfim, é estar presente,
é dividir o café e o sossego,
é descobrir que a poesia não acabou;
ela apenas encontrou a razão em ti,
Te amo!`
        },
        {
            titulo: "Onda de Batimentos",
            texto: `Eu amo você de um jeito simples,
mas profundo como o mar.
Amo no silêncio dos dias comuns
e no pensamento que insiste em ficar.

Amo o teu nome sem dizer em voz alta,
amo o teu jeito de me desmontar.
Mesmo quando o mundo pesa,
é em você que eu quero descansar.

Se amar fosse escolha,
eu ainda escolheria você.
Porque em cada versão de mim,
é o teu sorriso que eu quero viver.

Não é promessa grandiosa,
nem palavra difícil de explicar.
É só amor, do tipo que fica,
mesmo quando tudo tenta passar.`
        }
    ];

    const museumModal = document.getElementById("museum-modal");
    const openMuseumBtn = document.getElementById("open-museum-btn");
    const closeMuseumBtn = document.getElementById("close-museum-btn");
    const poemGallery = document.getElementById("poem-gallery");

    if (poemGallery) {
        poemGallery.innerHTML = ""; 
        poemasAntigos.forEach(poema => {
            const card = document.createElement("div");
            card.classList.add("museum-card");
            card.innerHTML = `<h3>${poema.titulo}</h3><p>${poema.texto}</p>`;
            poemGallery.appendChild(card);
        });
    }

    if (openMuseumBtn && museumModal) {
        openMuseumBtn.addEventListener("click", () => museumModal.classList.add("active"));
    }
    if (closeMuseumBtn && museumModal) {
        closeMuseumBtn.addEventListener("click", () => museumModal.classList.remove("active"));
    }

    // --- 9. MÓDULO DA NOSSA HISTÓRIA (TEMPO / SENHA) ---
    const btnOpenTime = document.getElementById('btn-open-time');
    const passwordModal = document.getElementById('password-modal');
    const closePasswordBtn = document.getElementById('close-password-btn');
    const passwordInput = document.getElementById('password-input');
    const submitPasswordBtn = document.getElementById('submit-password');
    const passwordError = document.getElementById('password-error');
    const timePage = document.getElementById('time-page');
    const closeTimePageBtn = document.getElementById('close-time-page');

    if (btnOpenTime && passwordModal) {
        btnOpenTime.addEventListener('click', () => {
            passwordModal.classList.add('active');
            if (passwordInput) {
                passwordInput.value = ''; 
                passwordInput.focus();
            }
            if (passwordError) passwordError.style.display = 'none'; 
        });
    }

    if (closePasswordBtn && passwordModal) {
        closePasswordBtn.addEventListener('click', () => passwordModal.classList.remove('active'));
    }

    function validatePassword() {
        if (!passwordInput) return;
        const password = passwordInput.value;
        
        if (password === '071225') {
            passwordModal.classList.remove('active');
            if (timePage) timePage.classList.remove('hidden');
            startTimeCounter(); 
        } else {
            if (passwordError) passwordError.style.display = 'block';
            passwordInput.value = '';
            const glassContent = passwordModal.querySelector('.modal-glass-content');
            if (glassContent) {
                glassContent.classList.add('shake');
                setTimeout(() => glassContent.classList.remove('shake'), 400);
            }
        }
    }

    if (submitPasswordBtn) submitPasswordBtn.addEventListener('click', validatePassword);

    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') validatePassword();
        });
    }

    if (closeTimePageBtn && timePage) {
        closeTimePageBtn.addEventListener('click', () => {
            timePage.classList.add('hidden');
            clearInterval(timeInterval); 
        });
    }

    let timeInterval;
    function startTimeCounter() {
        const startDate = new Date(2025, 11, 7, 0, 0, 0).getTime();
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        clearInterval(timeInterval);

        timeInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = now - startDate;

            if (distance < 0) {
                if(daysEl) daysEl.innerText = "00";
                if(hoursEl) hoursEl.innerText = "00";
                if(minutesEl) minutesEl.innerText = "00";
                if(secondsEl) secondsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if(daysEl) daysEl.innerText = days.toString().padStart(2, '0');
            if(hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
            if(minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
            if(secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
        }, 1000);
    }

    // --- Fechar Modais clicando fora ---
    window.addEventListener("click", (event) => {
        if (museumModal && event.target === museumModal) museumModal.classList.remove("active");
        if (cartaModal && event.target === cartaModal) cartaModal.classList.remove("active");
    });

}); // <--- FIM DA CAIXA PROTETORA (AGORA NO LUGAR CERTO!)