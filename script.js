document.addEventListener("DOMContentLoaded", () => {
    
    /* ==========================================================================
       1. ENVELOPE INTERACTIVE TRANSITION & AUDIO AUTOPLAY
       ========================================================================== */
    const waxSeal = document.getElementById("wax-seal");
    const envelope = document.querySelector(".envelope");
    const openBtn = document.getElementById("open-btn");
    const envelopeScreen = document.getElementById("envelope-screen");
    const invitationScreen = document.getElementById("invitation-screen");
    const musicBtn = document.getElementById("music-btn");
    const bgAudio = document.getElementById("bg-audio");
    
    let isMusicPlaying = false;

    // Toggle Music Playback Function
    const toggleMusic = (play = null) => {
        const shouldPlay = play !== null ? play : bgAudio.paused;
        if (shouldPlay) {
            bgAudio.play()
                .then(() => {
                    isMusicPlaying = true;
                    musicBtn.classList.add("playing");
                })
                .catch(err => {
                    console.log("Audio play blocked or error:", err);
                    isMusicPlaying = false;
                    musicBtn.classList.remove("playing");
                });
        } else {
            bgAudio.pause();
            isMusicPlaying = false;
            musicBtn.classList.remove("playing");
        }
    };

    // Click wax seal to open envelope flap
    if (waxSeal) {
        waxSeal.addEventListener("click", () => {
            envelope.classList.add("open");
            // Play background music instantly on user interaction (envelope click)
            toggleMusic(true);
        });
    }

    // Click "Open Scroll" to transition into the main invitation scroll
    if (openBtn) {
        openBtn.addEventListener("click", () => {
            // Fade out the envelope screen
            envelopeScreen.style.opacity = "0";
            envelopeScreen.style.visibility = "hidden";
            
            // Show the invitation screen after fade out
            setTimeout(() => {
                envelopeScreen.classList.add("hidden");
                invitationScreen.classList.remove("hidden");
                
                // Force a browser reflow
                invitationScreen.offsetHeight;
                
                invitationScreen.classList.add("visible");
                
                // Reveal the floating music button
                musicBtn.classList.remove("hidden");
                
                // Trigger hero section animations
                const heroFadeInElements = document.querySelectorAll(".hero-content .fade-in-up");
                heroFadeInElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add("appear");
                    }, index * 150);
                });
                
                // Re-trigger music playback check just in case
                if (bgAudio.paused && isMusicPlaying) {
                    toggleMusic(true);
                }
            }, 1000);
        });
    }

    // Toggle music on floating button click
    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            toggleMusic();
        });
    }

    /* ==========================================================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const scrollReveal = () => {
        const scrollElements = document.querySelectorAll(".fade-in-scroll");
        
        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };
        
        const displayScrollElement = (element) => {
            element.classList.add("appear");
        };
        
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.15)) {
                    displayScrollElement(el);
                }
            });
        };
        
        // Listen to scroll events
        window.addEventListener("scroll", () => {
            handleScrollAnimation();
        });
        
        // Run once on load
        handleScrollAnimation();
    };

    // Init scroll reveal
    scrollReveal();


    /* ==========================================================================
       3. LIVE COUNTDOWN TIMER TO 26 NOVEMBER 2026
       ========================================================================== */
    // Wedding Date: November 26, 2026 00:00:00 (IST: Indian Standard Time)
    const weddingDate = new Date("2026-11-26T00:00:00+05:30").getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft <= 0) {
            // Wedding has started!
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            clearInterval(countdownInterval);
            
            // Optional: change countdown subtitle to 'The Big Day is Here!'
            const subtitle = document.querySelector(".countdown-section .section-subtitle");
            if (subtitle) {
                subtitle.innerText = "The Big Day is Here!";
            }
            return;
        }
        
        // Time calculations
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Display results with leading zeros
        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    };
    
    // Run countdown immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);


    /* ==========================================================================
       4. CANVASES: FALLING CHERRY BLOSSOM PETALS
       ========================================================================== */
    const canvas = document.getElementById("petals-canvas");
    const ctx = canvas.getContext("2d");

    // Setup canvas size
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Petal Particle class
    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height - 20;
            this.size = Math.random() * 8 + 6; // Petal sizes
            this.speedY = Math.random() * 1.2 + 0.8;
            this.speedX = Math.random() * 1.5 - 0.5; // Wind direction sway
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = Math.random() * 0.02 - 0.01;
            this.opacity = Math.random() * 0.4 + 0.5;
            
            // Elegant shades of pink and soft rose red for cherry blossoms
            const colorChoices = [
                "rgba(255, 183, 197, ", // Soft light pink
                "rgba(255, 192, 203, ", // Pastel Pink
                "rgba(255, 150, 170, ", // Blossom pink
                "rgba(244, 172, 183, ", // Warm pink
                "rgba(216, 226, 220, "  // Soft sage-green leaf hint
            ];
            this.color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.angle) * 0.3; // Horizontal sway
            this.angle += this.spinSpeed;

            // Reset when fall below screen
            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
                this.speedY = Math.random() * 1.2 + 0.8;
                this.speedX = Math.random() * 1.5 - 0.5;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            
            // Draw a realistic elliptical petal shape
            ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ")";
            ctx.fill();
            
            // Add subtle white highlight outline
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            ctx.restore();
        }
    }

    // Create array of petals
    const petalsArray = [];
    const petalCount = Math.min(65, Math.floor(window.innerWidth / 15)); // Adjust petal density by viewport width

    for (let i = 0; i < petalCount; i++) {
        petalsArray.push(new Petal());
    }

    // Animation Loop
    const animatePetals = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petalsArray.forEach(petal => {
            petal.update();
            petal.draw();
        });
        
        requestAnimationFrame(animatePetals);
    };

    // Start animation loop
    animatePetals();

});
