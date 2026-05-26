document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle Logic
    const menuToggle = document.getElementById('menuToggle');
    const gnbNav = document.getElementById('gnbNav');

    if (menuToggle && gnbNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            gnbNav.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!gnbNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                gnbNav.classList.remove('active');
            }
        });

        const navLinks = gnbNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                gnbNav.classList.remove('active');
            });
        });
    }

    // 2. Intersection Observer for Scroll Reveal Animations
    const animatedElements = document.querySelectorAll('.fade-up, .slide-left, .slide-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => revealObserver.observe(el));

    // 3. Parallax Camera 100x Space Zoom Animation
    const cameraSection = document.getElementById('camera');
    const parallaxBg = document.getElementById('parallaxBg');

    if (cameraSection && parallaxBg) {
        window.addEventListener('scroll', () => {
            const rect = cameraSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                const totalScrollableRange = windowHeight + rect.height;
                const scrolledAmount = windowHeight - rect.top;
                const scrollPercent = scrolledAmount / totalScrollableRange;

                // Scale starts from 1.1 up to 1.8
                const targetScale = 1.1 + (scrollPercent * 0.7);
                const targetTranslateY = (scrollPercent - 0.5) * 50;

                parallaxBg.style.transform = `scale(${targetScale}) translateY(${targetTranslateY}px)`;
            }
        });
    }

    // 4. Active GNB Link Highlighting Based on Scroll Position
    const sections = document.querySelectorAll('section, footer');
    const menuLinks = document.querySelectorAll('.gnb-menu a');

    const highlightActiveMenu = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightActiveMenu);
    highlightActiveMenu();

    // ==========================================================================
    // 4.5. Design Gallery Color Swapper
    // ==========================================================================
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const galleryImg1 = document.getElementById('galleryImg1');
    const galleryImg2 = document.getElementById('galleryImg2');
    const galleryTitle1 = document.getElementById('galleryTitle1');
    const galleryTitle2 = document.getElementById('galleryTitle2');

    galleryDots.forEach(dot => {
        dot.addEventListener('click', () => {
            galleryDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const colorName = dot.getAttribute('data-color-name');
            const img1 = dot.getAttribute('data-img1');
            const img2 = dot.getAttribute('data-img2');

            if (galleryImg1 && img1) {
                galleryImg1.style.opacity = '0.3';
                setTimeout(() => {
                    galleryImg1.src = img1;
                    galleryImg1.style.opacity = '1';
                }, 200);
            }
            if (galleryImg2 && img2) {
                galleryImg2.style.opacity = '0.3';
                setTimeout(() => {
                    galleryImg2.src = img2;
                    galleryImg2.style.opacity = '1';
                }, 200);
            }
            if (galleryTitle1) {
                galleryTitle1.textContent = `${colorName} (전면)`;
            }
            if (galleryTitle2) {
                if (colorName.includes("그레이")) {
                    galleryTitle2.textContent = "초슬림 베젤 디스플레이";
                } else {
                    galleryTitle2.textContent = `${colorName} (후면 & S펜)`;
                }
            }
        });
    });

    // ==========================================================================
    // 5. Live Translate Interactive Simulation (Infinite Loop)
    // ==========================================================================
    const btnTranslateDemo = document.getElementById('btnTranslateDemo');
    const translateMockScreen = document.getElementById('translateMockScreen');
    const closeTranslateMock = document.getElementById('closeTranslateMock');
    const translateChatArea = document.getElementById('translateChatArea');
    const translateStatusBar = document.getElementById('translateStatusBar');
    
    let translateTimeouts = [];
    let isTranslateRunning = false;

    const translateConversation = [
        { lang: 'KO', isIncoming: true, text: '안녕하세요, 이번 갤럭시 S25 울트라의 혜택이 궁금합니다.' },
        { lang: 'EN', isIncoming: false, text: 'Hello, I am curious about the benefits of this Galaxy S25 Ultra.' },
        { lang: 'EN', isIncoming: true, text: 'Sure! You get a free double storage upgrade and Samsung Care+ for 1 year.' },
        { lang: 'KO', isIncoming: false, text: '물론이죠! 1년 동안 무상 삼성 케어플러스 혜택과 무료 더블 스토리지 용량 업그레이드가 제공됩니다.' },
        { lang: 'KO', isIncoming: true, text: '카메라 줌 성능도 많이 좋아졌나요?' },
        { lang: 'EN', isIncoming: false, text: 'Has the camera zoom performance improved a lot as well?' },
        { lang: 'EN', isIncoming: true, text: 'Yes, it features a 100x Space Zoom system with enhanced Nightography.' },
        { lang: 'KO', isIncoming: false, text: '네, 강화된 나이토그래피를 통해 저조도에서도 강력한 100배 스페이스 줌을 지원합니다.' }
    ];

    if (btnTranslateDemo && translateMockScreen && translateChatArea) {
        btnTranslateDemo.addEventListener('click', () => {
            translateMockScreen.classList.add('active');
            isTranslateRunning = true;
            startTranslateLoop();
        });

        closeTranslateMock.addEventListener('click', () => {
            translateMockScreen.classList.remove('active');
            isTranslateRunning = false;
            stopTranslateLoop();
        });
    }

    function stopTranslateLoop() {
        translateTimeouts.forEach(t => clearTimeout(t));
        translateTimeouts = [];
        if (translateChatArea) translateChatArea.innerHTML = '';
    }

    function startTranslateLoop() {
        if (!isTranslateRunning) return;
        
        stopTranslateLoop();
        if (translateStatusBar) translateStatusBar.textContent = 'AI 실시간 번역 진행 중';

        let delaySum = 500;

        translateConversation.forEach((msg, idx) => {
            const timeout = setTimeout(() => {
                if (!isTranslateRunning) return;
                
                const bubble = document.createElement('div');
                bubble.className = `chat-bubble ${msg.isIncoming ? 'incoming' : 'outgoing'}`;
                bubble.innerHTML = `
                    <span class="lang-tag">${msg.lang}</span>
                    <p>${msg.text}</p>
                `;
                translateChatArea.appendChild(bubble);
                
                // Trigger transition reflow
                setTimeout(() => bubble.classList.add('show'), 50);

                translateChatArea.scrollTop = translateChatArea.scrollHeight;

                // If last message, queue restart
                if (idx === translateConversation.length - 1) {
                    const restartTimeout = setTimeout(() => {
                        if (!isTranslateRunning) return;
                        if (translateStatusBar) translateStatusBar.textContent = '통역이 완료되었습니다. 곧 초기화됩니다...';
                        
                        const loopTimeout = setTimeout(() => {
                            startTranslateLoop();
                        }, 2500);
                        translateTimeouts.push(loopTimeout);
                    }, 2000);
                    translateTimeouts.push(restartTimeout);
                }
            }, delaySum);

            translateTimeouts.push(timeout);
            delaySum += 2200; // Time interval between chat message reveals
        });
    }

    // ==========================================================================
    // 6. Circle to Search Interactive Simulation (Infinite Multi-Target Loop)
    // ==========================================================================
    const btnCircleDemo = document.getElementById('btnCircleDemo');
    const circleMockScreen = document.getElementById('circleMockScreen');
    const closeCircleMock = document.getElementById('closeCircleMock');
    const drawCircle = document.getElementById('drawCircle');
    const searchResultCard = document.getElementById('searchResultCard');
    const circlePointerHint = document.querySelector('.circle-pointer-hint');

    let circleTimeouts = [];
    let isCircleRunning = false;
    let circleIndex = 0;

    const circleTargets = [
        {
            title: 'Galaxy S25 Ultra (티타늄 실버 블루)',
            category: '스마트폰 정보',
            desc: '삼성전자의 차세대 플래그십 AI 스마트폰. 더욱 가벼워진 초경량 티타늄 프레임과 온디바이스 실시간 AI 통역, 스페이스 줌 탑재.',
            top: '48%',
            left: '52%',
            size: '220px'
        },
        {
            title: '갤럭시 빌트인 S펜',
            category: '악세서리 정보',
            desc: '초정밀 2.8ms 지연율을 자랑하는 빌트인 스타일러스 펜. 화면에서 바로 메모 작성 및 서클 투 서치 기능 활용이 가능합니다.',
            top: '75%',
            left: '32%',
            size: '140px'
        },
        {
            title: '2억 화소 광학 카메라 렌즈',
            category: '카메라 정보',
            desc: '2억 화소 광각 센서와 쿼드 텔레 시스템 탑재. OIS 보정과 AI 센서를 조합하여 밤낮 상관없이 압도적인 디테일을 구현합니다.',
            top: '32%',
            left: '68%',
            size: '150px'
        }
    ];

    if (btnCircleDemo && circleMockScreen) {
        btnCircleDemo.addEventListener('click', () => {
            circleMockScreen.classList.add('active');
            isCircleRunning = true;
            circleIndex = 0;
            startCircleLoop();
        });

        closeCircleMock.addEventListener('click', () => {
            circleMockScreen.classList.remove('active');
            isCircleRunning = false;
            stopCircleLoop();
        });
    }

    function stopCircleLoop() {
        circleTimeouts.forEach(t => clearTimeout(t));
        circleTimeouts = [];
        if (drawCircle) {
            drawCircle.classList.remove('draw');
            drawCircle.style.transform = 'translate(-50%, -50%) scale(0)';
        }
        if (searchResultCard) searchResultCard.classList.remove('slide-up');
    }

    function startCircleLoop() {
        if (!isCircleRunning) return;

        stopCircleLoop();

        const currentTarget = circleTargets[circleIndex];
        
        if (circlePointerHint) {
            circlePointerHint.textContent = `AI가 사물을 탐색 중입니다... [대상: ${currentTarget.title.split(' ')[0]}]`;
        }

        // Configure circle dimensions and position
        if (drawCircle) {
            drawCircle.style.top = currentTarget.top;
            drawCircle.style.left = currentTarget.left;
            drawCircle.style.width = currentTarget.size;
            drawCircle.style.height = currentTarget.size;
        }

        // 1. Draw Circle
        const drawTimeout = setTimeout(() => {
            if (!isCircleRunning) return;
            drawCircle.classList.add('draw');

            // 2. Slide up card with updated values
            const cardTimeout = setTimeout(() => {
                if (!isCircleRunning) return;

                const resultCategory = searchResultCard.querySelector('.result-category');
                const resultTitle = searchResultCard.querySelector('.result-title');
                const resultSnippet = searchResultCard.querySelector('.result-snippet');

                if (resultCategory) resultCategory.textContent = currentTarget.category;
                if (resultTitle) resultTitle.textContent = currentTarget.title;
                if (resultSnippet) resultSnippet.textContent = currentTarget.desc;

                searchResultCard.classList.add('slide-up');

                // 3. Queue next item loop
                const nextTimeout = setTimeout(() => {
                    if (!isCircleRunning) return;
                    circleIndex = (circleIndex + 1) % circleTargets.length;
                    startCircleLoop();
                }, 4000);
                circleTimeouts.push(nextTimeout);

            }, 1200);
            circleTimeouts.push(cardTimeout);

        }, 500);

        circleTimeouts.push(drawTimeout);
    }

    // ==========================================================================
    // 7. Interactive Pre-order Modal & Form Handler
    // ==========================================================================
    const preorderModal = document.getElementById('preorderModal');
    const closePreorderModal = document.getElementById('closePreorderModal');
    const preorderForm = document.getElementById('preorderForm');
    const preorderPreviewImg = document.getElementById('preorderPreviewImg');
    const selectedDeviceTitle = document.getElementById('selectedDeviceTitle');
    const priceDiscount = document.querySelector('.price-discount');
    const userPhone = document.getElementById('userPhone');
    const toastContainer = document.getElementById('toastContainer');

    // Trigger buttons
    const triggerButtons = document.querySelectorAll('a[href="#buy"].btn, .header-cta a, .btn-glow');

    let selectedColor = 'Silver Blue';
    let selectedStorage = '512GB';

    // Show modal
    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (preorderModal) {
                preorderModal.classList.add('active');
            }
        });
    });

    // Close modal
    if (closePreorderModal && preorderModal) {
        closePreorderModal.addEventListener('click', () => {
            preorderModal.classList.remove('active');
        });

        preorderModal.addEventListener('click', (e) => {
            if (e.target === preorderModal) {
                preorderModal.classList.remove('active');
            }
        });
    }

    // Color swapper
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            const imgPath = dot.getAttribute('data-img');
            selectedColor = dot.getAttribute('title');

            if (preorderPreviewImg && imgPath) {
                preorderPreviewImg.style.transform = 'scale(0.85)';
                setTimeout(() => {
                    preorderPreviewImg.src = imgPath;
                    preorderPreviewImg.style.transform = 'scale(1)';
                }, 200);
            }
            updateTitle();
        });
    });

    // Storage selector
    const storageButtons = document.querySelectorAll('.storage-btn');
    storageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            storageButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            selectedStorage = btn.getAttribute('data-storage');
            const price = btn.getAttribute('data-price');

            if (priceDiscount) {
                priceDiscount.textContent = price;
            }
            updateTitle();
        });
    });

    function updateTitle() {
        if (selectedDeviceTitle) {
            selectedDeviceTitle.textContent = `Galaxy S25 Ultra (${selectedStorage})`;
        }
    }

    // Auto hyphen for phone input
    if (userPhone) {
        userPhone.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 3 && val.length <= 7) {
                val = val.substr(0, 3) + '-' + val.substr(3);
            } else if (val.length > 7) {
                val = val.substr(0, 3) + '-' + val.substr(3, 4) + '-' + val.substr(7);
            }
            e.target.value = val;
        });
    }

    // Form submit
    if (preorderForm) {
        preorderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Close modal
            preorderModal.classList.remove('active');
            
            // Reset form fields
            preorderForm.reset();
            
            // Show toast notification
            if (toastContainer) {
                const toastCard = toastContainer.querySelector('.toast-card');
                if (toastCard) {
                    toastCard.classList.add('show');
                    setTimeout(() => {
                        toastCard.classList.remove('show');
                    }, 4000);
                }
            }
        });
    }
});
