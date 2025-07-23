document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle with animation and accessibility
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const header = document.querySelector('header');
    
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menu.classList.contains('show');
            
            menu.classList.toggle('show');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Update ARIA attributes for accessibility
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.setAttribute('aria-label', !isExpanded ? 'Закрити мобільне меню' : 'Відкрити мобільне меню');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('show')) {
                menu.classList.remove('show');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Відкрити мобільне меню');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menu.classList.contains('show')) {
                menu.classList.remove('show');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Відкрити мобільне меню');
                menuToggle.focus();
            }
        });
    }
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('header nav ul li a, .footer-links ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close mobile menu if open
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            }
            
            // Only apply smooth scroll for links with hash
            if (this.hash !== '') {
                e.preventDefault();
                
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without jumping
                    history.pushState(null, null, hash);
                    
                    // Update active link
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Active Navigation Link on Scroll and Animate Elements
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                
                // Add animation class to section when it comes into view
                if (!section.classList.contains('animated')) {
                    section.classList.add('animated');
                    animateSection(section);
                }
            }
        });
    });
    
    // Function to animate elements within a section
    function animateSection(section) {
        // Find elements to animate
        const animateElements = section.querySelectorAll('.card, .resource-card, .quiz-container, .comparison, h2.section-title, .tab-btn');
        
        // Apply staggered animations
        animateElements.forEach((element, index) => {
            setTimeout(() => {
                // Choose animation based on element type
                if (element.classList.contains('card')) {
                    element.classList.add('animate', 'animate--fade-in-up');
                } else if (element.classList.contains('resource-card')) {
                    element.classList.add('animate', 'animate--zoom-in');
                } else if (element.classList.contains('quiz-container')) {
                    element.classList.add('animate', 'animate--fade-in');
                } else if (element.classList.contains('comparison')) {
                    if (index % 2 === 0) {
                        element.classList.add('animate', 'animate--slide-in-left');
                    } else {
                        element.classList.add('animate', 'animate--slide-in-right');
                    }
                } else if (element.classList.contains('section-title')) {
                    element.classList.add('animate', 'animate--fade-in-down');
                } else if (element.classList.contains('tab-btn')) {
                    element.classList.add('animate', 'animate--fade-in');
                    element.style.animationDelay = `${index * 0.1}s`;
                }
            }, index * 100); // Stagger the animations
        });
    }
    
    // Initial check for elements in viewport on page load
    setTimeout(() => {
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }, 300);
    
    // Enhanced Example Tabs with Smooth Transitions
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabContainer = document.querySelector('#examples');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
        // Set first tab as active by default if none is active
        if (!document.querySelector('.tab-btn.active')) {
            tabButtons[0].classList.add('active');
            const firstTabId = tabButtons[0].getAttribute('data-tab');
            document.getElementById(`${firstTabId}-content`).classList.add('active');
        }
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                const targetContent = document.getElementById(`${tabId}-content`);
                
                if (this.classList.contains('active')) return; // Skip if already active
                
                // Add transition class to container
                tabContainer.classList.add('tab-transitioning');
                
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to current button
                this.classList.add('active');
                
                // Fade out all contents first
                tabContents.forEach(content => {
                    if (content.classList.contains('active')) {
                        content.classList.add('fade-out');
                        
                        // After fade out animation completes
                        setTimeout(() => {
                            content.classList.remove('active');
                            content.classList.remove('fade-out');
                            
                            // Then fade in the target content
                            targetContent.classList.add('active');
                            targetContent.classList.add('fade-in');
                            
                            // Remove the fade-in class after animation completes
                            setTimeout(() => {
                                targetContent.classList.remove('fade-in');
                                tabContainer.classList.remove('tab-transitioning');
                                
                                // Animate comparison items within the active tab
                                animateComparisonItems(targetContent);
                            }, 300);
                        }, 300);
                    }
                });
            });
        });
        
        // Initial animation for the default active tab
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            setTimeout(() => animateComparisonItems(activeTab), 500);
        }
    }
    
    // Function to animate comparison items
    function animateComparisonItems(tabContent) {
        const wrongItem = tabContent.querySelector('.comparison-item.wrong');
        const correctItem = tabContent.querySelector('.comparison-item.correct');
        
        if (wrongItem) {
            wrongItem.classList.add('animate', 'animate--slide-in-left');
        }
        
        if (correctItem) {
            setTimeout(() => {
                correctItem.classList.add('animate', 'animate--slide-in-right');
            }, 200);
        }
    }
    
    // Quiz Functionality
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressBar = document.querySelector('.progress');
    const currentQuestionEl = document.getElementById('current-question');
    const totalQuestionsEl = document.getElementById('total-questions');
    const totalQuestionsResultEl = document.getElementById('total-questions-result');
    const scorePercentEl = document.getElementById('score-percent');
    const correctAnswersEl = document.getElementById('correct-answers');
    const resultMessageEl = document.getElementById('result-message');
    
    // Quiz accessibility announcements
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Quiz Questions
    const quizQuestions = [
        {
            question: "Який з наведених паролів є найбезпечнішим?",
            options: [
                "password123",
                "імя_прізвище",
                "P@ssw0rd!2023",
                "12345678"
            ],
            correctAnswer: 2,
            explanation: "Найбезпечніший пароль містить комбінацію великих і малих літер, цифр та спеціальних символів, а також має достатню довжину."
        },
        {
            question: "Що таке двофакторна автентифікація?",
            options: [
                "Використання двох різних паролів для входу",
                "Додатковий рівень захисту, що вимагає другий спосіб підтвердження особи (код, відбиток пальця тощо)",
                "Вхід у соціальну мережу з двох різних пристроїв",
                "Перевірка пароля двічі при вході"
            ],
            correctAnswer: 1,
            explanation: "Двофакторна автентифікація додає другий рівень захисту, вимагаючи не лише пароль, але й інший спосіб підтвердження особи, наприклад, код з SMS або з додатка автентифікації."
        },
        {
            question: "Яка інформація НЕ рекомендується для публічного розміщення в соціальних мережах?",
            options: [
                "Ваші хобі та інтереси",
                "Фотографії з публічних заходів",
                "Точна домашня адреса та номер телефону",
                "Думки про улюблені фільми"
            ],
            correctAnswer: 2,
            explanation: "Особиста контактна інформація, така як домашня адреса та номер телефону, не повинна бути публічно доступною, оскільки це може призвести до крадіжки особистих даних або переслідування."
        },
        {
            question: "Що таке фішинг?",
            options: [
                "Пошук друзів у соціальних мережах",
                "Шахрайська спроба отримати конфіденційну інформацію через підроблені сайти або повідомлення",
                "Публікація великої кількості фотографій одночасно",
                "Видалення старих постів з профілю"
            ],
            correctAnswer: 1,
            explanation: "Фішинг — це вид шахрайства, коли зловмисники намагаються отримати конфіденційну інформацію (паролі, дані карток) через підроблені сайти або повідомлення, що імітують надійні джерела."
        },
        {
            question: "Як правильно реагувати на повідомлення від незнайомців у соціальних мережах?",
            options: [
                "Завжди ігнорувати всі повідомлення від незнайомців",
                "Відповідати на всі повідомлення, щоб бути ввічливим",
                "Перевіряти профіль відправника та бути обережним з особистою інформацією",
                "Одразу додавати їх у друзі, щоб розширити коло спілкування"
            ],
            correctAnswer: 2,
            explanation: "Перш ніж відповідати на повідомлення від незнайомців, варто перевірити їхній профіль. Будьте обережні з тим, яку інформацію ви розкриваєте, і не переходьте за підозрілими посиланнями."
        },
        {
            question: "Яке з наведених налаштувань приватності є найбезпечнішим для підлітка?",
            options: [
                "Публічний профіль, щоб знайти більше друзів",
                "Профіль, видимий лише для друзів",
                "Профіль, видимий для друзів та їхніх друзів",
                "Профіль без обмежень, щоб отримати більше підписників"
            ],
            correctAnswer: 1,
            explanation: "Для підлітків найбезпечнішим є налаштування, коли профіль видимий лише для друзів. Це обмежує доступ до особистої інформації та публікацій лише для перевірених контактів."
        },
        {
            question: "Що слід робити, якщо ви помітили, що ваш акаунт було зламано?",
            options: [
                "Нічого не робити, зловмисник сам втратить інтерес",
                "Створити новий акаунт і забути про старий",
                "Негайно змінити пароль, увімкнути двофакторну автентифікацію та повідомити адміністрацію сайту",
                "Написати про це в соціальних мережах, щоб попередити друзів"
            ],
            correctAnswer: 2,
            explanation: "При виявленні злому акаунту необхідно негайно змінити пароль, увімкнути додаткові методи захисту та повідомити про інцидент адміністрацію платформи для отримання допомоги."
        },
        {
            question: "Яка практика є найбезпечнішою щодо публікації фотографій у соціальних мережах?",
            options: [
                "Публікувати всі фотографії з геотегами для кращого охоплення",
                "Публікувати фотографії лише в приватному режимі для обмеженого кола друзів",
                "Публікувати фотографії з детальним описом місця та часу",
                "Публікувати фотографії з відміткою всіх присутніх людей без їхньої згоди"
            ],
            correctAnswer: 1,
            explanation: "Найбезпечніше публікувати фотографії в приватному режимі для обмеженого кола друзів. Це захищає вашу приватність і знижує ризик неправомірного використання ваших зображень."
        },
        {
            question: "Що означає термін 'цифровий слід'?",
            options: [
                "Кількість друзів у соціальних мережах",
                "Історія всіх ваших дій в інтернеті, яка може залишатися назавжди",
                "Спеціальна програма для відстеження активності в інтернеті",
                "Кількість лайків на ваших публікаціях"
            ],
            correctAnswer: 1,
            explanation: "Цифровий слід — це сукупність інформації, яку ви залишаєте в інтернеті через свою активність: публікації, коментарі, лайки, пошукові запити тощо. Ця інформація може зберігатися тривалий час і бути доступною для інших."
        },
        {
            question: "Яка з наведених дій є ознакою кібербулінгу?",
            options: [
                "Конструктивна критика в коментарях",
                "Дружнє спілкування в груповому чаті",
                "Систематичні образливі повідомлення та погрози",
                "Обговорення спільних інтересів"
            ],
            correctAnswer: 2,
            explanation: "Кібербулінг — це форма цькування з використанням цифрових технологій. Він включає систематичні образи, погрози, поширення неправдивої інформації та інші дії, спрямовані на приниження або залякування людини."
        },
        {
            question: "Яке налаштування Facebook є найважливішим для захисту приватності користувача?",
            options: [
                "Дозвіл на позначення вас у публікаціях без вашого схвалення",
                "Публічний список друзів",
                "Приватний акаунт з переглядом позначень перед публікацією",
                "Дозвіл на пошук за номером телефону"
            ],
            correctAnswer: 2,
            explanation: "Приватний акаунт з переглядом позначень перед публікацією дає вам контроль над тим, хто може бачити ваш профіль і в яких публікаціях ви з'являєтесь, що є критично важливим для захисту приватності та запобігання несанкціонованому використанню ваших даних."
        },
        {
            question: "Яка функція Instagram допомагає захистити користувачів від небажаного контенту та цільових атак?",
            options: [
                "Автоматичне збереження історій",
                "Фільтри коментарів та обмеження взаємодії",
                "Показ активності (був/була в мережі)",
                "Публічний акаунт"
            ],
            correctAnswer: 1,
            explanation: "Фільтри коментарів та обмеження взаємодії в Instagram дозволяють блокувати образливі слова та обмежувати, хто може коментувати ваші публікації, що захищає користувачів від небажаного контенту, потенційного кібербулінгу та соціальної інженерії."
        },
        {
            question: "Яка функція TikTok забезпечує найвищий рівень контролю над приватністю?",
            options: [
                "Дозвіл на дуети з вашими відео",
                "Синхронізація контактів",
                "Розширені налаштування приватності",
                "Публічний акаунт"
            ],
            correctAnswer: 2,
            explanation: "Розширені налаштування приватності в TikTok дозволяють контролювати такі параметри, як обмеження часу використання, фільтрація контенту та обмеження прямих повідомлень, що значно підвищує рівень безпеки вашого акаунту."
        },
        {
            question: "Яке налаштування часу екрану є рекомендованим для збереження продуктивності при використанні соціальних мереж?",
            options: [
                "Необмежений час використання для розвитку соціальних навичок",
                "Встановлення чітких часових обмежень та перерв",
                "Використання соціальних мереж лише у вихідні",
                "Повна заборона на використання соціальних мереж"
            ],
            correctAnswer: 1,
            explanation: "Встановлення чітких часових обмежень та регулярних перерв допомагає запобігти надмірному використанню соціальних мереж, що може негативно впливати на продуктивність, психічне здоров'я та якість сну."
        },
        {
            question: "Яка з цих дій є найбезпечнішою при використанні Instagram?",
            options: [
                "Приймати запити на підписку від усіх користувачів",
                "Ділитися своєю геолокацією в реальному часі в історіях",
                "Регулярно перевіряти та оновлювати налаштування приватності",
                "Використовувати однаковий пароль для всіх соціальних мереж"
            ],
            correctAnswer: 2,
            explanation: "Регулярна перевірка та оновлення налаштувань приватності є важливою практикою безпеки, оскільки соціальні мережі часто оновлюють свої функції та політики приватності, і це допомагає забезпечити, що ваш акаунт залишається захищеним."
        },
        {
            question: "Як розпізнати спробу соціальної інженерії в соціальних мережах?",
            options: [
                "Повідомлення з терміновими запитами особистої інформації",
                "Звичайні повідомлення від друзів",
                "Публічні пости з новинами",
                "Реклама товарів"
            ],
            correctAnswer: 0,
            explanation: "Соціальна інженерія часто використовує тактики тиску, терміновості та емоційного впливу для отримання конфіденційної інформації."
        },
        {
            question: "Чому небезпечно використовувати публічний Wi-Fi для входу в соціальні мережі?",
            options: [
                "Дані можуть бути перехоплені зловмисниками",
                "Інтернет працює повільніше",
                "Це коштує дорожче",
                "Акаунт може бути заблокований"
            ],
            correctAnswer: 0,
            explanation: "Публічні Wi-Fi мережі часто не захищені, що дозволяє зловмисникам перехоплювати передані дані, включаючи паролі та особисту інформацію."
        },
        {
            question: "Які ознаки можуть вказувати на фейковий профіль?",
            options: [
                "Мало фото, нові акаунти, підозрілі запити в друзі",
                "Багато підписників",
                "Регулярні пости",
                "Верифікований акаунт"
            ],
            correctAnswer: 0,
            explanation: "Фейкові профілі часто мають обмежену кількість контенту, створені недавно, використовують чужі фото та надсилають підозрілі повідомлення."
        },
        {
            question: "Що слід робити для безпечного управління персональними даними?",
            options: [
                "Регулярно переглядати та видаляти непотрібні дані",
                "Зберігати всі дані назавжди",
                "Надавати доступ усім додаткам",
                "Ігнорувати налаштування приватності"
            ],
            correctAnswer: 0,
            explanation: "Регулярний аудит персональних даних, видалення непотрібної інформації та контроль доступу додатків допомагають мінімізувати ризики витоку даних."
        }
    ];
    
    let currentQuestion = 0;
    let userAnswers = [];
    
    // Initialize quiz if elements exist
    if (quizContent && prevBtn && nextBtn && submitBtn) {
        // Set total questions count
        if (totalQuestionsEl) totalQuestionsEl.textContent = quizQuestions.length;
        if (totalQuestionsResultEl) totalQuestionsResultEl.textContent = quizQuestions.length;
        
        // Initialize user answers array
        userAnswers = Array(quizQuestions.length).fill(null);
        
        // Load first question
        loadQuestion(currentQuestion);
        
        // Event listeners for quiz navigation
        prevBtn.addEventListener('click', showPreviousQuestion);
        nextBtn.addEventListener('click', showNextQuestion);
        submitBtn.addEventListener('click', submitQuiz);
        
        if (restartBtn) {
            restartBtn.addEventListener('click', restartQuiz);
        }
    }
    
    // Load question function with animation
    function loadQuestion(index) {
        if (!quizContent) return;
        
        const question = quizQuestions[index];
        const prevQuestion = currentQuestion;
        
        // Determine animation direction
        const direction = prevQuestion < index ? 'left' : 'right';
        
        // Add exit animation
        if (quizContent.children.length > 0) {
            quizContent.classList.add(`slide-out-${direction}`);
            
            // Wait for exit animation to complete
            setTimeout(() => {
                // Update progress
                if (progressBar) {
                    progressBar.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
                }
                
                if (currentQuestionEl) {
                    currentQuestionEl.textContent = index + 1;
                }
                
                // Create question HTML
                let questionHTML = `
                    <div class="quiz-question">
                        <h3>${index + 1}. ${question.question}</h3>
                        <div class="quiz-options">
                `;
                
                // Add options
                question.options.forEach((option, i) => {
                    const isSelected = userAnswers[index] === i;
                    questionHTML += `
                        <div class="quiz-option ${isSelected ? 'selected' : ''}" data-index="${i}">
                            <div class="option-marker">${String.fromCharCode(65 + i)}</div>
                            <div class="option-text">${option}</div>
                        </div>
                    `;
                });
                
                questionHTML += `
                        </div>
                    </div>
                `;
                
                quizContent.innerHTML = questionHTML;
                
                // Add event listeners to options
                const options = document.querySelectorAll('.quiz-option');
                options.forEach((option, i) => {
                    // Make options focusable and add ARIA attributes
                    option.setAttribute('tabindex', '0');
                    option.setAttribute('role', 'radio');
                    option.setAttribute('aria-checked', userAnswers[index] === i ? 'true' : 'false');
                    option.setAttribute('aria-describedby', `question-${index}`);
                    
                    // Click handler
                    option.addEventListener('click', function() {
                        const optionIndex = parseInt(this.getAttribute('data-index'));
                        selectOption(optionIndex);
                    });
                    
                    // Keyboard navigation
                    option.addEventListener('keydown', function(e) {
                        const optionIndex = parseInt(this.getAttribute('data-index'));
                        
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            selectOption(optionIndex);
                            announceToScreenReader(`Вибрано варіант ${String.fromCharCode(65 + optionIndex)}`);
                        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                            e.preventDefault();
                            const nextOption = options[Math.min(i + 1, options.length - 1)];
                            nextOption.focus();
                        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                            e.preventDefault();
                            const prevOption = options[Math.max(i - 1, 0)];
                            prevOption.focus();
                        }
                    });
                    
                    // Add staggered entrance animation for options
                    setTimeout(() => {
                        option.classList.add('option-appear');
                    }, 50 * i);
                });
                
                // Update button states
                updateButtonStates();
                
                // Add entrance animation
                quizContent.classList.remove(`slide-out-${direction}`);
                quizContent.classList.add(`slide-in-${direction === 'left' ? 'right' : 'left'}`);
                
                // Remove animation class after completion
                setTimeout(() => {
                    quizContent.classList.remove(`slide-in-${direction === 'left' ? 'right' : 'left'}`);
                }, 500);
                
            }, 300); // Match this with the CSS transition duration
        } else {
            // No animation for initial load
            // Update progress
            if (progressBar) {
                progressBar.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
            }
            
            if (currentQuestionEl) {
                currentQuestionEl.textContent = index + 1;
            }
            
            // Create question HTML
            let questionHTML = `
                <div class="quiz-question">
                    <h3>${index + 1}. ${question.question}</h3>
                    <div class="quiz-options">
            `;
            
            // Add options
            question.options.forEach((option, i) => {
                const isSelected = userAnswers[index] === i;
                questionHTML += `
                    <div class="quiz-option ${isSelected ? 'selected' : ''}" data-index="${i}">
                        <div class="option-marker">${String.fromCharCode(65 + i)}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `;
            });
            
            questionHTML += `
                    </div>
                </div>
            `;
            
            quizContent.innerHTML = questionHTML;
            
            // Add event listeners to options
            const options = document.querySelectorAll('.quiz-option');
            options.forEach(option => {
                option.addEventListener('click', function() {
                    const optionIndex = parseInt(this.getAttribute('data-index'));
                    selectOption(optionIndex);
                });
            });
            
            // Update button states
            updateButtonStates();
        }
    }
    
    // Select option function
    function selectOption(optionIndex) {
        userAnswers[currentQuestion] = optionIndex;
        
        // Update UI to show selected option with animation
        const options = document.querySelectorAll('.quiz-option');
        
        // First remove selected class with animation and update ARIA
        options.forEach((option, i) => {
            option.setAttribute('aria-checked', 'false');
            if (option.classList.contains('selected')) {
                // Add a quick transition out animation
                option.classList.add('deselect-animation');
                
                // Remove the animation and selected class after animation completes
                setTimeout(() => {
                    option.classList.remove('deselect-animation');
                    option.classList.remove('selected');
                }, 150);
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Add selected class with animation after a small delay
        setTimeout(() => {
            const selectedOption = document.querySelector(`.quiz-option[data-index="${optionIndex}"]`);
            if (selectedOption) {
                // Update ARIA attributes
                selectedOption.setAttribute('aria-checked', 'true');
                
                // Add selection animation
                selectedOption.classList.add('select-animation');
                selectedOption.classList.add('selected');
                
                // Remove the animation class after it completes
                setTimeout(() => {
                    selectedOption.classList.remove('select-animation');
                }, 300);
                
                // Announce selection to screen readers
                const optionText = selectedOption.querySelector('.option-text').textContent;
                announceToScreenReader(`Вибрано: ${optionText}`);
            }
            
            // Enable next button if it was disabled
            updateButtonStates();
        }, 150);
    }
    
    // Update navigation button states
    function updateButtonStates() {
        // Prev button - disable on first question
        prevBtn.disabled = currentQuestion === 0;
        
        // Next/Submit buttons
        if (currentQuestion === quizQuestions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    // Show previous question with enhanced animation
    function showPreviousQuestion() {
        if (currentQuestion > 0) {
            // Add button press animation
            prevBtn.classList.add('btn-pressed');
            setTimeout(() => {
                prevBtn.classList.remove('btn-pressed');
            }, 200);
            
            currentQuestion--;
            loadQuestion(currentQuestion);
            
            // Announce navigation to screen readers
            announceToScreenReader(`Питання ${currentQuestion + 1} з ${quizQuestions.length}`);
            
            // Scroll to top of quiz container if needed
            const quizContainer = document.querySelector('.quiz-container');
            if (quizContainer) {
                const containerTop = quizContainer.getBoundingClientRect().top;
                if (containerTop < 0) {
                    quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }
    
    // Show next question with enhanced animation
    function showNextQuestion() {
        if (currentQuestion < quizQuestions.length - 1) {
            // Add button press animation
            nextBtn.classList.add('btn-pressed');
            setTimeout(() => {
                nextBtn.classList.remove('btn-pressed');
            }, 200);
            
            currentQuestion++;
            loadQuestion(currentQuestion);
            
            // Announce navigation to screen readers
            announceToScreenReader(`Питання ${currentQuestion + 1} з ${quizQuestions.length}`);
            
            // Scroll to top of quiz container if needed
            const quizContainer = document.querySelector('.quiz-container');
            if (quizContainer) {
                const containerTop = quizContainer.getBoundingClientRect().top;
                if (containerTop < 0) {
                    quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    }
    
    // Submit quiz with enhanced animations and feedback
    function submitQuiz() {
        if (!quizResults) return;
        
        // Add loading animation
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.classList.add('processing');
        
        // Create and append loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'quiz-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Обробка результатів...</p>
        `;
        quizContainer.appendChild(loadingOverlay);
        
        // Process results with a slight delay for better UX
        setTimeout(() => {
            // Calculate score
            let correctCount = 0;
            userAnswers.forEach((answer, index) => {
                if (answer === quizQuestions[index].correctAnswer) {
                    correctCount++;
                }
            });
            
            const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
            
            // Remove loading overlay
            quizContainer.removeChild(loadingOverlay);
            quizContainer.classList.remove('processing');
            
            // Prepare results display
            if (scorePercentEl) scorePercentEl.textContent = `${scorePercent}%`;
            if (correctAnswersEl) correctAnswersEl.textContent = correctCount;
            
            // Add score text
            const scoreText = document.getElementById('score-text');
            if (scoreText) {
                scoreText.textContent = `${correctCount} з ${quizQuestions.length} правильних відповідей`;
            }
            
            // Set feedback message and class based on score
            let feedbackMessage = '';
            let feedbackClass = '';
            
            if (scorePercent >= 90) {
                feedbackMessage = 'Відмінно! Ви дуже добре розумієте принципи безпеки в соціальних мережах.';
                feedbackClass = 'good';
            } else if (scorePercent >= 70) {
                feedbackMessage = 'Добре! Ви маєте хороші знання про безпеку в соціальних мережах, але є ще деякі аспекти, які варто вивчити.';
                feedbackClass = 'good';
            } else if (scorePercent >= 50) {
                feedbackMessage = 'Непогано, але вам варто приділити більше уваги вивченню принципів безпеки в соціальних мережах.';
                feedbackClass = 'average';
            } else {
                feedbackMessage = 'Вам необхідно серйозно покращити свої знання про безпеку в соціальних мережах. Рекомендуємо уважно вивчити матеріали на цьому сайті.';
                feedbackClass = 'poor';
            }
            
            if (resultMessageEl) {
                resultMessageEl.textContent = feedbackMessage;
                resultMessageEl.className = `result-feedback ${feedbackClass}`;
            }
            
            // Hide quiz content and controls with fade out
            quizContent.classList.add('fade-out');
            document.querySelector('.quiz-controls').classList.add('fade-out');
            
            setTimeout(() => {
                quizContent.style.display = 'none';
                document.querySelector('.quiz-controls').style.display = 'none';
                quizContent.classList.remove('fade-out');
                document.querySelector('.quiz-controls').classList.remove('fade-out');
                
                // Show results with animations
                quizResults.style.display = 'block';
                quizResults.classList.add('fade-in');
                
                // Animate score circle filling
                const scoreCircle = document.querySelector('.score-circle');
                if (scoreCircle) {
                    scoreCircle.style.background = `conic-gradient(var(--primary-color) ${scorePercent * 3.6}deg, rgba(66, 103, 178, 0.1) 0deg)`;
                    
                    // Add counter animation for percentage
                    let count = 0;
                    const counter = setInterval(() => {
                        if (count >= scorePercent) {
                            clearInterval(counter);
                        } else {
                            count++;
                            scorePercentEl.textContent = `${count}%`;
                        }
                    }, 20);
                }
                
                setTimeout(() => {
                    quizResults.classList.remove('fade-in');
                }, 1000);
            }, 300);
        }, 1200); // Delay for loading animation
    }
    
    // Restart quiz with enhanced animations
    function restartQuiz() {
        // Announce restart to screen readers
        announceToScreenReader('Квіз перезапускається. Підготовка першого питання.');
        
        // Add restart animation to results container
        quizResults.classList.add('fade-out');
        
        setTimeout(() => {
            // Reset variables
            currentQuestion = 0;
            userAnswers = Array(quizQuestions.length).fill(null);
            
            // Reset UI
            quizResults.style.display = 'none';
            quizResults.classList.remove('fade-out');
            
            // Show loading spinner briefly for better UX
            const quizContainer = document.querySelector('.quiz-container');
            quizContainer.classList.add('processing');
            
            // Create and append loading overlay
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'quiz-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Підготовка тесту...</p>
            `;
            quizContainer.appendChild(loadingOverlay);
            
            setTimeout(() => {
                // Remove loading overlay
                quizContainer.removeChild(loadingOverlay);
                quizContainer.classList.remove('processing');
                
                // Show quiz content with animation
                quizContent.style.display = 'block';
                quizContent.classList.add('fade-in');
                
                document.querySelector('.quiz-controls').style.display = 'flex';
                document.querySelector('.quiz-controls').classList.add('fade-in');
                
                // Load first question
                loadQuestion(currentQuestion);
                
                // Reset progress bar with animation and ARIA attributes
                if (progressBar) {
                    const progressContainer = progressBar.parentElement.parentElement;
                    progressContainer.setAttribute('aria-valuenow', Math.round((1 / quizQuestions.length) * 100));
                    
                    progressBar.style.transition = 'width 0.8s ease';
                    progressBar.style.width = `${(1 / quizQuestions.length) * 100}%`;
                    
                    setTimeout(() => {
                        progressBar.style.transition = '';
                    }, 800);
                }
                
                // Remove animation classes after completion
                setTimeout(() => {
                    quizContent.classList.remove('fade-in');
                    document.querySelector('.quiz-controls').classList.remove('fade-in');
                    
                    // Announce that quiz is ready
                    announceToScreenReader('Квіз готовий. Перше питання завантажено.');
                    
                    // Focus on the first quiz option for better accessibility
                    const firstOption = document.querySelector('.quiz-option');
                    if (firstOption) {
                        firstOption.focus();
                    }
                }, 500);
                
                // Scroll to top of quiz container
                quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1000);
        }, 300);
    }
    
    // Create placeholder images if real images are not available
    createPlaceholderImages();
});

// Function to create placeholder SVG images with enhanced animations
function createPlaceholderImages() {
    // Create img directory if it doesn't exist
    const imgElements = document.querySelectorAll('img');
    
    imgElements.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('img/')) {
            // Create a placeholder SVG based on the image type
            let svgContent = '';
            let gradientColors = ['#4267B2', '#3b5998']; // Default Facebook blue gradient
            let textColor = '#FFFFFF';
            let text = 'Image';
            let icon = '';
            let pattern = '';
            
            if (src.includes('profile-wrong')) {
                gradientColors = ['#dc3545', '#c82333']; // Danger red gradient
                text = 'Неправильний профіль';
                icon = `<circle cx="50%" cy="40%" r="15%" fill="rgba(255,255,255,0.2)" />
                       <path d="M40%,50% L60%,70% M40%,70% L60%,50%" stroke="white" stroke-width="3" />`;
            } else if (src.includes('profile-correct')) {
                gradientColors = ['#28a745', '#218838']; // Success green gradient
                text = 'Правильний профіль';
                icon = `<circle cx="50%" cy="40%" r="15%" fill="rgba(255,255,255,0.2)" />
                       <path d="M40%,55% L50%,65% L65%,45%" stroke="white" stroke-width="3" fill="none" />`;
            } else if (src.includes('profile-pic-wrong')) {
                gradientColors = ['#dc3545', '#c82333']; // Danger red gradient
                text = 'НП';
                icon = `<path d="M40%,40% L60%,60% M40%,60% L60%,40%" stroke="white" stroke-width="3" />`;
            } else if (src.includes('profile-pic-correct')) {
                gradientColors = ['#28a745', '#218838']; // Success green gradient
                text = 'ПП';
                icon = `<path d="M40%,50% L50%,60% L65%,40%" stroke="white" stroke-width="3" fill="none" />`;
            } else if (src.includes('vacation-post-wrong')) {
                gradientColors = ['#dc3545', '#c82333']; // Danger red gradient
                text = 'Небезпечний пост';
                pattern = `<defs>
                    <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
                        <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#diagonalHatch)" />`;
            } else if (src.includes('vacation-post-correct')) {
                gradientColors = ['#28a745', '#218838']; // Success green gradient
                text = 'Безпечний пост';
                pattern = `<defs>
                    <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
                        <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />`;
            } else if (src.includes('hero-bg')) {
                gradientColors = ['#1DA1F2', '#0d8ecf']; // Twitter blue gradient
                text = 'Соціальні мережі';
                pattern = `<defs>
                    <pattern id="socialPattern" patternUnits="userSpaceOnUse" width="60" height="60" patternTransform="rotate(45)">
                        <path d="M10,0 L20,0 L20,60 L10,60 Z" fill="rgba(255,255,255,0.05)" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#socialPattern)" />`;
            }
            
            // Create SVG placeholder with animations
            const width = img.classList.contains('avatar') || img.classList.contains('post-avatar') ? 80 : 300;
            const height = img.classList.contains('avatar') || img.classList.contains('post-avatar') ? 80 : 200;
            
            svgContent = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                    <defs>
                        <linearGradient id="grad-${src.replace(/\W/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="${gradientColors[0]}" />
                            <stop offset="100%" stop-color="${gradientColors[1]}" />
                        </linearGradient>
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)" />
                        </filter>
                    </defs>
                    <rect width="${width}" height="${height}" rx="8" ry="8" fill="url(#grad-${src.replace(/\W/g, '')})" filter="url(#shadow)"/>
                    ${pattern}
                    ${icon}
                    <text x="50%" y="${height - height/4}" font-family="Arial, sans-serif" font-size="${width > 100 ? 20 : 14}" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
                    <rect width="${width}" height="${height}" rx="8" ry="8" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
                </svg>
            `;
            
            // Convert SVG to data URL with fade-in effect
            const svgBlob = new Blob([svgContent], {type: 'image/svg+xml'});
            const url = URL.createObjectURL(svgBlob);
            
            // Add fade-in animation
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            img.src = url;
            
            // Trigger fade-in when loaded
            img.onload = function() {
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            };
        }
    });
}

// Security Tools Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSecurityTools();
});

function initializeSecurityTools() {
    // Password Generator
    const passwordLength = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const generatedPassword = document.getElementById('generated-password');
    const generateBtn = document.getElementById('generate-password');
    const copyBtn = document.getElementById('copy-password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordLength && lengthValue) {
        passwordLength.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener('click', generatePassword);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', copyPassword);
    }

    function generatePassword() {
        const length = parseInt(passwordLength.value);
        let charset = 'abcdefghijklmnopqrstuvwxyz';
        
        if (includeUppercase.checked) {
            charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (includeNumbers.checked) {
            charset += '0123456789';
        }
        if (includeSymbols.checked) {
            charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        generatedPassword.value = password;
        updatePasswordStrength(password);
    }

    function updatePasswordStrength(password) {
        let score = 0;
        let feedback = '';

        // Length check
        if (password.length >= 12) score += 25;
        else if (password.length >= 8) score += 15;
        else score += 5;

        // Character variety checks
        if (/[a-z]/.test(password)) score += 15;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;

        // Bonus for length
        if (password.length >= 16) score += 10;

        // Update visual feedback
        strengthFill.style.width = score + '%';
        
        if (score >= 80) {
            strengthFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
            feedback = 'Дуже надійний пароль';
        } else if (score >= 60) {
            strengthFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
            feedback = 'Надійний пароль';
        } else if (score >= 40) {
            strengthFill.style.background = 'linear-gradient(90deg, #f97316, #ea580c)';
            feedback = 'Середній пароль';
        } else {
            strengthFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
            feedback = 'Слабкий пароль';
        }

        strengthText.textContent = feedback;
    }

    function copyPassword() {
        if (generatedPassword.value) {
            navigator.clipboard.writeText(generatedPassword.value).then(() => {
                copyBtn.textContent = 'Скопійовано!';
                setTimeout(() => {
                    copyBtn.textContent = 'Копіювати';
                }, 2000);
            });
        }
    }

    // Breach Checker
    const emailCheck = document.getElementById('email-check');
    const checkBreachBtn = document.getElementById('check-breach');
    const breachResult = document.getElementById('breach-result');

    if (checkBreachBtn) {
        checkBreachBtn.addEventListener('click', checkDataBreach);
    }

    function checkDataBreach() {
        const email = emailCheck.value.trim();
        if (!email || !isValidEmail(email)) {
            showBreachResult('Будь ласка, введіть дійсну електронну адресу.', 'error');
            return;
        }

        checkBreachBtn.textContent = 'Перевіряю...';
        checkBreachBtn.disabled = true;

        // Simulate API call (in real implementation, use HaveIBeenPwned API)
        setTimeout(() => {
            const isBreached = Math.random() > 0.7; // 30% chance of breach for demo
            
            if (isBreached) {
                showBreachResult(
                    `⚠️ Увага! Ваша електронна адреса була знайдена в ${Math.floor(Math.random() * 5) + 1} витоках даних. Рекомендуємо змінити паролі для всіх пов'язаних акаунтів.`,
                    'warning'
                );
            } else {
                showBreachResult(
                    '✅ Хороші новини! Ваша електронна адреса не була знайдена в відомих витоках даних.',
                    'success'
                );
            }

            checkBreachBtn.textContent = 'Перевірити';
            checkBreachBtn.disabled = false;
        }, 2000);
    }

    function showBreachResult(message, type) {
        const resultContent = breachResult.querySelector('.result-content');
        resultContent.innerHTML = `<p class="result-${type}">${message}</p>`;
        breachResult.classList.remove('hidden');
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Privacy Analyzer
    const analyzePrivacyBtn = document.getElementById('analyze-privacy');
    const privacyResult = document.getElementById('privacy-result');
    const privacySelects = document.querySelectorAll('.privacy-select');

    if (analyzePrivacyBtn) {
        analyzePrivacyBtn.addEventListener('click', analyzePrivacy);
    }

    function analyzePrivacy() {
        let totalScore = 0;
        let maxScore = 0;

        privacySelects.forEach(select => {
            const weight = parseInt(select.dataset.weight);
            const value = parseInt(select.value);
            totalScore += (value * weight) / 100;
            maxScore += weight;
        });

        const finalScore = Math.round((totalScore / maxScore) * 100);
        showPrivacyResult(finalScore);
    }

    function showPrivacyResult(score) {
        const scoreNumber = privacyResult.querySelector('.score-number');
        const recommendations = privacyResult.querySelector('.recommendations');
        const scoreCircle = privacyResult.querySelector('.score-circle');

        scoreNumber.textContent = score;
        
        // Update circle color based on score
        if (score >= 80) {
            scoreCircle.style.background = `conic-gradient(from 0deg, #10b981 0%, #10b981 ${score}%, #374151 ${score}%, #374151 100%)`;
        } else if (score >= 60) {
            scoreCircle.style.background = `conic-gradient(from 0deg, #f59e0b 0%, #f59e0b ${score}%, #374151 ${score}%, #374151 100%)`;
        } else {
            scoreCircle.style.background = `conic-gradient(from 0deg, #ef4444 0%, #ef4444 ${score}%, #374151 ${score}%, #374151 100%)`;
        }

        let recommendationText = '';
        if (score >= 80) {
            recommendationText = '🎉 Відмінно! Ваші налаштування приватності на високому рівні. Продовжуйте дотримуватися цих принципів.';
        } else if (score >= 60) {
            recommendationText = '👍 Добре! У вас є базовий захист, але є місце для покращення. Розгляньте можливість посилення приватності.';
        } else if (score >= 40) {
            recommendationText = '⚠️ Увага! Ваші налаштування приватності потребують покращення. Рекомендуємо переглянути налаштування.';
        } else {
            recommendationText = '🚨 Критично! Ваші дані під загрозою. Негайно змініть налаштування приватності!';
        }

        recommendations.innerHTML = `<p>${recommendationText}</p>`;
        privacyResult.classList.remove('hidden');
    }

    // URL Checker
    const urlCheck = document.getElementById('url-check');
    const checkUrlBtn = document.getElementById('check-url');
    const urlResult = document.getElementById('url-result');

    if (checkUrlBtn) {
        checkUrlBtn.addEventListener('click', checkURL);
    }

    function checkURL() {
        const url = urlCheck.value.trim();
        if (!url || !isValidURL(url)) {
            showURLResult('Будь ласка, введіть дійсне посилання.', 'error');
            return;
        }

        checkUrlBtn.textContent = 'Перевіряю...';
        checkUrlBtn.disabled = true;

        // Simulate URL analysis
        setTimeout(() => {
            const analysis = analyzeURL(url);
            showURLResult(analysis.message, analysis.type);
            
            checkUrlBtn.textContent = 'Перевірити';
            checkUrlBtn.disabled = false;
        }, 1500);
    }

    function analyzeURL(url) {
        const suspiciousDomains = ['.tk', '.ml', '.ga', '.cf'];
        const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];
        
        let riskScore = 0;
        let warnings = [];

        // Check for suspicious TLDs
        if (suspiciousDomains.some(domain => url.includes(domain))) {
            riskScore += 30;
            warnings.push('Підозрілий домен верхнього рівня');
        }

        // Check for URL shorteners
        if (shorteners.some(shortener => url.includes(shortener))) {
            riskScore += 20;
            warnings.push('Скорочене посилання - будьте обережні');
        }

        // Check for suspicious patterns
        if (url.includes('login') || url.includes('verify') || url.includes('secure')) {
            riskScore += 25;
            warnings.push('Містить підозрілі ключові слова');
        }

        // Check for HTTPS
        if (!url.startsWith('https://')) {
            riskScore += 15;
            warnings.push('Не використовує безпечне з\'єднання HTTPS');
        }

        let message, type;
        if (riskScore >= 50) {
            message = `🚨 Високий ризик! Це посилання може бути небезпечним.<br><strong>Попередження:</strong><br>• ${warnings.join('<br>• ')}`;
            type = 'danger';
        } else if (riskScore >= 25) {
            message = `⚠️ Середній ризик. Будьте обережні з цим посиланням.<br><strong>Попередження:</strong><br>• ${warnings.join('<br>• ')}`;
            type = 'warning';
        } else {
            message = '✅ Посилання виглядає безпечно, але завжди будьте обережні при переході за незнайомими посиланнями.';
            type = 'success';
        }

        return { message, type };
    }

    function showURLResult(message, type) {
        const resultContent = urlResult.querySelector('.result-content');
        resultContent.innerHTML = `<div class="result-${type}">${message}</div>`;
        urlResult.classList.remove('hidden');
    }

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}