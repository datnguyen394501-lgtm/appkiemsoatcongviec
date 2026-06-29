// APEUni Clone - Vocabulary Module

const vocab = (function() {
    // Vocab database
    const books = {
        academic: [
            { word: "Simulate", ipa: "/ˈsɪm.jə.leɪt/", translation: "Mô phỏng, giả vờ", definition: "To create a representation or model of a real-world process or system.", example: "Our simulator can simulate the actual PTE test environment.", memorized: "high" },
            { word: "Acquire", ipa: "/əˈkwaɪər/", translation: "Đạt được, thu được", definition: "To buy or obtain an asset, object, or skill.", example: "Practice is the best way to acquire language skills.", memorized: "medium" },
            { word: "Coherent", ipa: "/koʊˈhɪr.ənt/", translation: "Mạch lạc, chặt chẽ", definition: "Logical and consistent, forming a unified whole.", example: "The essay must be coherent and flow naturally.", memorized: "high" },
            { word: "Assess", ipa: "/əˈses/", translation: "Đánh giá, ước định", definition: "To evaluate or estimate the nature, ability, or quality of something.", example: "The AI engine will assess your speaking pronunciation.", memorized: "low" },
            { word: "Fluency", ipa: "/ˈfluː.ən.si/", translation: "Sự trôi chảy, lưu loát", definition: "The ability to speak or write a language easily, smoothly, and quickly.", example: "Oral fluency is highly graded in the PTE Speaking module.", memorized: "high" },
            { word: "Coordinate", ipa: "/koʊˈɔːr.dən.eɪt/", translation: "Phối hợp, điều phối", definition: "To bring the different elements of a complex activity or organization into a harmonious relation.", example: "You must coordinate your breathing while reading aloud.", memorized: "medium" },
            { word: "Empirical", ipa: "/ɪmˈpɪr.ɪ.kəl/", translation: "Thực nghiệm", definition: "Based on, concerned with, or verifiable by observation or experience rather than theory.", example: "They provided empirical evidence to support their research paper.", memorized: "low" },
            { word: "Hypothesis", ipa: "/haɪˈpɑː.θə.sɪs/", translation: "Giả thuyết", definition: "A proposed explanation made on the basis of limited evidence as a starting point for further investigation.", example: "The researchers designed an experiment to test their hypothesis.", memorized: "medium" }
        ],
        collocations: [
            { word: "Academic achievement", ipa: "/ˌæk.əˈdem.ɪk əˈtʃiːv.mənt/", translation: "Thành tích học tập", definition: "The extent to which a student, teacher or institution has achieved their short or long-term educational goals.", example: "PTE certificates are widely used to prove academic achievement.", memorized: "high" },
            { word: "Perform analysis", ipa: "/pɚˈfɔːrm əˈnæl.ə.sɪs/", translation: "Tiến hành phân tích", definition: "To examine something methodically and in detail.", example: "The laboratory was set up to perform chemical analysis on soil samples.", memorized: "medium" },
            { word: "Significantly increase", ipa: "/sɪɡˈnɪf.ɪ.kənt.li ɪnˈkriːs/", translation: "Tăng lên đáng kể", definition: "To grow or raise in amount, level, or value by a large, noticeable margin.", example: "Constant practice will significantly increase your overall PTE score.", memorized: "high" },
            { word: "Crucial role", ipa: "/ˈkruː.ʃəl roʊl/", translation: "Vai trò quan trọng", definition: "A vital, critical function or position in an event or process.", example: "Fluency plays a crucial role in getting a 79+ target score.", memorized: "high" },
            { word: "Address the issue", ipa: "/əˈdres ði ˈɪʃ.uː/", translation: "Giải quyết vấn đề", definition: "To direct attention to or deal with a problem or challenge.", example: "The government took immediate measures to address the issue of unemployment.", memorized: "medium" },
            { word: "Conduct research", ipa: "/kənˈdʌkt rɪˈsɜːrtʃ/", translation: "Tiến hành nghiên cứu", definition: "To design and carry out a systematic investigation to discover new facts.", example: "Scientists conduct research to find cures for genetic diseases.", memorized: "low" }
        ]
    };

    let currentBook = "academic";
    let currentIndex = 0;

    function init() {
        const card = document.getElementById("vocab-flashcard");
        const nextBtn = document.getElementById("btn-vocab-next");
        const prevBtn = document.getElementById("btn-vocab-prev");
        const audioBtn = document.getElementById("vocab-audio-btn");
        const bookItems = document.querySelectorAll(".vocab-book-item");

        if (card) {
            // Flip card on click
            card.addEventListener("click", function(e) {
                // If clicked audioBtn, don't flip
                if (e.target.closest("#vocab-audio-btn")) return;
                card.classList.toggle("flipped");
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const list = books[currentBook];
                if (currentIndex < list.length - 1) {
                    currentIndex++;
                    card.classList.remove("flipped");
                    setTimeout(renderFlashcard, 150);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    card.classList.remove("flipped");
                    setTimeout(renderFlashcard, 150);
                }
            });
        }

        if (audioBtn) {
            audioBtn.addEventListener("click", () => {
                const item = books[currentBook][currentIndex];
                speak(item.word);
            });
        }

        // Book category toggle
        bookItems.forEach(item => {
            item.addEventListener("click", function() {
                bookItems.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                currentBook = this.dataset.book;
                currentIndex = 0;
                card.classList.remove("flipped");
                renderFlashcard();
                renderVocabTable();
            });
        });

        // Initial render
        renderFlashcard();
        renderVocabTable();
    }

    function renderFlashcard() {
        const item = books[currentBook][currentIndex];
        const wordEl = document.getElementById("card-word");
        const ipaEl = document.getElementById("card-ipa");
        const transEl = document.getElementById("card-translation");
        const defEl = document.getElementById("card-definition");
        const exEl = document.getElementById("card-example");
        const counterEl = document.getElementById("vocab-counter");

        if (!item) return;

        if (wordEl) wordEl.textContent = item.word;
        if (ipaEl) ipaEl.textContent = item.ipa;
        if (transEl) transEl.textContent = item.translation;
        if (defEl) defEl.textContent = item.definition;
        if (exEl) exEl.textContent = item.example;
        if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${books[currentBook].length}`;
    }

    function renderVocabTable() {
        const tbody = document.querySelector("#vocab-word-table tbody");
        if (!tbody) return;

        tbody.innerHTML = "";
        const list = books[currentBook];

        list.forEach(item => {
            const tr = document.createElement("tr");
            
            // Level badge class helper
            let levelClass = "level-medium";
            let levelText = "Trung bình";
            if (item.memorized === "high") {
                levelClass = "level-high";
                levelText = "Đã thuộc";
            } else if (item.memorized === "low") {
                levelClass = "level-low";
                levelText = "Cần học lại";
            }

            tr.innerHTML = `
                <td style="font-weight: 700;">${item.word}</td>
                <td style="font-style: italic; color: var(--text-muted);">${item.ipa}</td>
                <td>${item.translation}</td>
                <td><span class="level-badge ${levelClass}">${levelText}</span></td>
            `;

            // Click row to jump flashcard to that index
            tr.style.cursor = "pointer";
            tr.addEventListener("click", () => {
                const idx = list.findIndex(x => x.word === item.word);
                if (idx !== -1) {
                    currentIndex = idx;
                    const card = document.getElementById("vocab-flashcard");
                    if (card) card.classList.remove("flipped");
                    renderFlashcard();
                    // Scroll flashcard deck into view smoothly if responsive
                    document.querySelector(".flashcard-deck").scrollIntoView({ behavior: "smooth", block: "end" });
                }
            });

            tbody.appendChild(tr);
        });
    }

    // Text to Speech engine
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Cancel active speaches
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85; // slightly slower for clarity
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Trình duyệt không hỗ trợ Text-to-Speech.");
        }
    }

    return {
        init,
        speak
    };
})();
window.vocab = vocab;
