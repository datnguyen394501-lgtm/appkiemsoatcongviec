// APEUni Clone - Mock Test Simulator Module

const mocktest = (function() {
    let testTimer = null;
    let secondsRemaining = 5 * 60; // 5 minute timed test
    let currentQuestionIdx = 0;
    
    // User responses captured during test
    let answers = {
        ra: "",
        we: "",
        fib: {},
        wfd: ""
    };

    const examQuestions = [
        {
            section: "Section 1: Speaking",
            type: "ra",
            title: "Read Aloud",
            instruction: "Look at the text below. In 15 seconds, you must read this text aloud as naturally and clearly as possible. You have 30 seconds to read aloud.",
            content: "Modern architectural engineering relies heavily on material science research. By implementing composite materials that are both lightweight and structurally resilient, engineers can construct skyscrapers that withstand extreme environmental stress, including hurricanes and high-magnitude earthquakes.",
            html: `
                <div class="exam-q-prompt-box">
                    <div class="exam-instructions" id="mock-ins">Look at the text below. In 15 seconds, you must read this text aloud.</div>
                    <div style="font-size: 1.15rem; line-height: 1.6; font-weight: 500;" id="mock-q-body">
                        Modern architectural engineering relies heavily on material science research. By implementing composite materials that are both lightweight and structurally resilient, engineers can construct skyscrapers that withstand extreme environmental stress, including hurricanes and high-magnitude earthquakes.
                    </div>
                </div>
                <div class="exam-control-box">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                        <span style="font-weight: 600;" id="mock-rec-status">Chuẩn bị ghi âm...</span>
                        <span style="font-family: monospace; font-weight: 700; color: #003666;" id="mock-timer">15</span>
                    </div>
                    <div class="audio-progress-bar" style="background: rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                        <div class="audio-progress-fill" id="mock-rec-progress" style="width: 0%; background: #003666;"></div>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <button class="btn-exam-primary" id="mock-speaking-rec-btn" disabled>Ghi Âm Micro</button>
                    </div>
                </div>
            `,
            setup: function() {
                const recBtn = document.getElementById("mock-speaking-rec-btn");
                const clock = document.getElementById("mock-timer");
                const status = document.getElementById("mock-rec-status");
                const progress = document.getElementById("mock-rec-progress");

                let prep = 15;
                let rec = 30;

                // Preparation count down
                const interval = setInterval(() => {
                    prep--;
                    if (clock) clock.textContent = prep;
                    if (prep <= 0) {
                        clearInterval(interval);
                        
                        // Start recording phase
                        if (status) status.textContent = "Đang Ghi Âm nói (Microphone hoạt động)...";
                        if (clock) clock.textContent = rec;
                        if (recBtn) recBtn.textContent = "Đang thu âm...";
                        if (progress) progress.style.width = "100%";
                        if (progress) progress.style.transition = "width 30s linear";

                        // Trigger SpeechRecognition if allowed
                        answers.ra = "";
                        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                        let recObj = null;
                        if (SpeechRecognition) {
                            recObj = new SpeechRecognition();
                            recObj.continuous = true;
                            recObj.lang = 'en-US';
                            recObj.onresult = function(event) {
                                for (let i = event.resultIndex; i < event.results.length; ++i) {
                                    if (event.results[i].isFinal) {
                                        answers.ra += event.results[i][0].transcript + " ";
                                    }
                                }
                            };
                            try { recObj.start(); } catch(e) {}
                        }

                        const recInterval = setInterval(() => {
                            rec--;
                            if (clock) clock.textContent = rec;
                            if (rec <= 0) {
                                clearInterval(recInterval);
                                if (recObj) { try { recObj.stop(); } catch(e){} }
                                if (status) status.textContent = "Ghi âm thành công. Vui lòng bấm Tiếp Theo.";
                                if (recBtn) recBtn.textContent = "Đã xong";
                                if (progress) {
                                    progress.style.transition = "none";
                                    progress.style.width = "0%";
                                }
                            }
                        }, 1000);
                    }
                }, 1000);
            }
        },
        {
            section: "Section 2: Writing",
            type: "we",
            title: "Write Essay",
            instruction: "You will have 2 minutes to write a short essay on the prompt below. Write between 50 and 100 words. (Reduced format)",
            content: "Do you agree or disagree that artificial intelligence will replace human jobs in the next 20 years?",
            html: `
                <div class="exam-q-prompt-box">
                    <div class="exam-instructions">Write a short response discussing the prompt below:</div>
                    <div style="font-size: 1.1rem; line-height: 1.5; font-weight: 500;">
                        Do you agree or disagree that artificial intelligence will replace human jobs in the next 20 years? Explain your reasoning.
                    </div>
                </div>
                <div class="exam-control-box" style="padding: 0;">
                    <textarea id="mock-essay-text" style="width: 100%; height: 180px; border: 1px solid #dcdde1; padding: 1rem; font-family: sans-serif; font-size: 0.95rem; resize: none; outline: none; border-radius: 4px;" placeholder="Nhập bài luận của bạn tại đây..."></textarea>
                    <div style="padding: 0.5rem 1rem; background: #eaecef; border-top: 1px solid #dcdde1; display: flex; justify-content: flex-end; font-size: 0.8rem; color: #3b3f4c;">
                        <span>Số từ: <span id="mock-essay-wordcount" style="font-weight: 700;">0</span> từ</span>
                    </div>
                </div>
            `,
            setup: function() {
                const textarea = document.getElementById("mock-essay-text");
                const wordcount = document.getElementById("mock-essay-wordcount");

                textarea.addEventListener("input", function() {
                    const text = this.value.trim();
                    const words = text === "" ? 0 : text.split(/\s+/).length;
                    wordcount.textContent = words;
                    answers.we = text;
                });
            }
        },
        {
            section: "Section 3: Reading",
            type: "fib",
            title: "Fill in the Blanks",
            instruction: "In the passage below, select the most appropriate option from each drop-down list to complete the reading passage.",
            content: "",
            html: `
                <div class="exam-q-prompt-box">
                    <div class="exam-instructions">Select the correct words in the dropdown inputs:</div>
                    <div style="font-size: 1.1rem; line-height: 2.2; color: #1e2026;">
                        Human brain cells are incredibly complex and consume a huge amount of [1] relative to their weight. Although the brain constitutes only 2% of total body weight, it demands nearly 20% of the body's primary fuel, glucose. This heavy energy requirement explains why cognitive [2] quickly leads to fatigue. In times of stress, the brain [3] glucose even more rapidly, pulling energy from other organ reserves.
                    </div>
                </div>
            `,
            setup: function() {
                // Ingest dropdowns dynamically into mock exam container
                const body = document.getElementById("exam-question-body");
                let contentHTML = body.innerHTML;

                const options = {
                    1: ["oxygen", "water", "electricity", "oxygen"],
                    2: ["effort", "sleep", "laziness", "effort"],
                    3: ["burns", "creates", "rejects", "burns"]
                };

                Object.keys(options).forEach(num => {
                    let selectHTML = `<select class="fib-select-mock" data-blank="${num}" style="background: white; border: 1px solid #c2c5cc; color: black; font-size: 0.95rem; padding: 0.2rem 0.5rem; border-radius: 4px; margin: 0 0.2rem; cursor: pointer;">`;
                    selectHTML += `<option value="">-- Chọn --</option>`;
                    options[num].forEach(opt => {
                        selectHTML += `<option value="${opt}">${opt}</option>`;
                    });
                    selectHTML += `</select>`;
                    contentHTML = contentHTML.replace(`[${num}]`, selectHTML);
                });

                body.innerHTML = contentHTML;

                // Event listener
                const selects = document.querySelectorAll(".fib-select-mock");
                selects.forEach(select => {
                    select.addEventListener("change", function() {
                        answers.fib[this.dataset.blank] = this.value;
                    });
                });
            }
        },
        {
            section: "Section 4: Listening",
            type: "wfd",
            title: "Write from Dictation",
            instruction: "You will hear a sentence spoken. Write the sentence exactly as you hear it. You will only hear the audio once.",
            content: "Artificial intelligence is changing the nature of modern education.",
            html: `
                <div class="exam-q-prompt-box">
                    <div class="exam-instructions">Click play, listen, and type the sentence:</div>
                    <div style="display: flex; align-items: center; gap: 1.5rem; background: #eaecef; border: 1px solid #dcdde1; padding: 1rem; border-radius: 4px;">
                        <button class="btn-exam-primary" id="mock-wfd-play" style="width: 40px; height: 40px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                        <span id="mock-wfd-lbl" style="font-size: 0.85rem; font-weight: 600; color: #003666;">Bấm nghe (Chỉ phát 1 lần)</span>
                    </div>
                </div>
                <div class="exam-control-box" style="padding: 0;">
                    <textarea id="mock-wfd-text" style="width: 100%; height: 100px; border: 1px solid #dcdde1; padding: 1rem; font-family: sans-serif; font-size: 0.95rem; resize: none; outline: none; border-radius: 4px;" placeholder="Gõ lại câu nghe được tại đây..."></textarea>
                </div>
            `,
            setup: function() {
                const playBtn = document.getElementById("mock-wfd-play");
                const lbl = document.getElementById("mock-wfd-lbl");
                const textarea = document.getElementById("mock-wfd-text");

                playBtn.addEventListener("click", () => {
                    playBtn.disabled = true;
                    playBtn.style.opacity = 0.5;
                    lbl.textContent = "Đang phát...";
                    
                    // Speech voice synthesis
                    vocab.speak("Artificial intelligence is changing the nature of modern education.");

                    setTimeout(() => {
                        lbl.textContent = "Đã phát xong";
                    }, 3500);
                });

                textarea.addEventListener("input", function() {
                    answers.wfd = this.value;
                });
            }
        }
    ];

    function init() {
        const startBtn = document.getElementById("start-mock-btn");
        const quitBtn = document.getElementById("exam-quit-btn");
        const nextBtn = document.getElementById("exam-next-btn");
        const restartBtn = document.getElementById("restart-mock-btn");

        if (startBtn) {
            startBtn.addEventListener("click", startExamFlow);
        }

        if (quitBtn) {
            quitBtn.addEventListener("click", quitExamFlow);
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", handleNextQuestion);
        }

        if (restartBtn) {
            restartBtn.addEventListener("click", () => {
                document.getElementById("mock-results-pane").classList.add("hidden");
                startExamFlow();
            });
        }
    }

    function startExamFlow() {
        practice.cleanupTimers();

        // Initialize variables
        secondsRemaining = 5 * 60;
        currentQuestionIdx = 0;
        answers = { ra: "", we: "", fib: {}, wfd: "" };

        // Hide welcome, show exam container
        document.getElementById("mock-welcome-pane").classList.add("hidden");
        document.getElementById("mock-results-pane").classList.add("hidden");
        document.getElementById("mock-exam-pane").classList.remove("hidden");

        // Start countdown
        updateTimerDisplay();
        testTimer = setInterval(() => {
            secondsRemaining--;
            updateTimerDisplay();
            if (secondsRemaining <= 0) {
                clearInterval(testTimer);
                finishExam();
            }
        }, 1000);

        renderQuestion();
    }

    function quitExamFlow() {
        if (confirm("Bạn có chắc chắn muốn thoát khỏi bài thi thử? Tiến trình làm bài sẽ bị mất.")) {
            clearInterval(testTimer);
            document.getElementById("mock-exam-pane").classList.add("hidden");
            document.getElementById("mock-welcome-pane").classList.remove("hidden");
        }
    }

    function updateTimerDisplay() {
        const timerClock = document.getElementById("exam-timer");
        if (timerClock) {
            const mins = Math.floor(secondsRemaining / 60);
            const secs = secondsRemaining % 60;
            timerClock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    function renderQuestion() {
        const q = examQuestions[currentQuestionIdx];
        if (!q) return;

        // Render Section Header Labels
        const sectionLabel = document.getElementById("exam-section-label");
        if (sectionLabel) sectionLabel.textContent = q.section;

        // Render Question Type Header / Counter
        const progressIndicators = document.getElementById("exam-progress-indicators");
        if (progressIndicators) {
            progressIndicators.innerHTML = "";
            examQuestions.forEach((_, idx) => {
                const dot = document.createElement("div");
                dot.className = `prog-dot ${idx === currentQuestionIdx ? 'active' : (idx < currentQuestionIdx ? 'completed' : '')}`;
                progressIndicators.appendChild(dot);
            });
        }

        // Render Question Content Layouts
        const body = document.getElementById("exam-question-body");
        if (body) {
            body.innerHTML = `
                <div style="font-weight: 700; color: #3b3f4c; font-size: 1rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">${q.title}</div>
                <div style="font-size: 0.85rem; font-style: italic; color: #626775; margin-bottom: 1.5rem;">Instructions: ${q.instruction}</div>
                ${q.html}
            `;
        }

        // Trigger individual question event scripts
        q.setup();

        // Footer button states
        const nextBtn = document.getElementById("exam-next-btn");
        if (nextBtn) {
            if (currentQuestionIdx === examQuestions.length - 1) {
                nextBtn.innerHTML = "Hoàn Thành &amp; Chấm Điểm &rarr;";
            } else {
                nextBtn.innerHTML = "Tiếp Theo &rarr;";
            }
        }
    }

    function handleNextQuestion() {
        // Clean timers of previous speaking recordings
        practice.cleanupTimers();

        if (currentQuestionIdx < examQuestions.length - 1) {
            currentQuestionIdx++;
            renderQuestion();
        } else {
            finishExam();
        }
    }

    function finishExam() {
        clearInterval(testTimer);
        document.getElementById("mock-exam-pane").classList.add("hidden");
        document.getElementById("mock-results-pane").classList.remove("hidden");

        // Calculate and render scores
        calculatePteReport();
    }

    function calculatePteReport() {
        // Grade answers of Speaking (ra)
        let speakingScore = 10;
        const raText = answers.ra.toLowerCase().trim();
        const targetRa = examQuestions[0].content.toLowerCase();
        
        if (raText.length > 5) {
            let matches = 0;
            const targetWords = targetRa.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/);
            targetWords.forEach(w => {
                if (raText.includes(w)) matches++;
            });
            speakingScore = Math.round(10 + (matches / targetWords.length) * 80);
        } else {
            // Default simulated average score if microphone did not pick up
            speakingScore = 55 + Math.round(Math.random() * 20);
        }

        // Grade Writing (we)
        let writingScore = 10;
        const weText = answers.we.trim();
        const wordsCount = weText === "" ? 0 : weText.split(/\s+/).length;
        if (wordsCount >= 10 && wordsCount <= 120) {
            writingScore = 50 + Math.min(40, wordsCount * 0.8);
        } else if (wordsCount > 0) {
            writingScore = 35;
        } else {
            writingScore = 58; // simulated baseline
        }

        // Grade Reading (fib)
        let readingScore = 10;
        let correctBlanks = 0;
        const correctAnswers = { 1: "oxygen", 2: "effort", 3: "burns" };
        Object.keys(correctAnswers).forEach(num => {
            if (answers.fib[num] === correctAnswers[num]) {
                correctBlanks++;
            }
        });
        readingScore = Math.round(10 + (correctBlanks / 3) * 80);

        // Grade Listening (wfd)
        let listeningScore = 10;
        const wfdText = answers.wfd.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        const targetWfd = examQuestions[3].content.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        if (wfdText.length > 5) {
            let wfdMatches = 0;
            const wfdWords = targetWfd.split(/\s+/);
            wfdWords.forEach(w => {
                if (wfdText.includes(w)) wfdMatches++;
            });
            listeningScore = Math.round(10 + (wfdMatches / wfdWords.length) * 80);
        } else {
            listeningScore = 63; // simulated baseline
        }

        // Compute enabling skills
        const oralFluency = Math.round(speakingScore - 2 + Math.random() * 5);
        const pronunciation = Math.round(speakingScore - 8 + Math.random() * 5);
        const grammar = Math.round(writingScore - 3 + Math.random() * 4);
        const spelling = Math.round(writingScore + 4 + Math.random() * 4);
        const vocabulary = Math.round((readingScore + listeningScore) / 2);
        const writtenDiscourse = Math.round(writingScore - 1 + Math.random() * 3);

        // Compute overall score
        const overallScore = Math.round((speakingScore + writingScore + readingScore + listeningScore) / 4);

        // Update results scorecard DOM
        document.getElementById("report-overall-score").textContent = overallScore;
        
        // Update bar values
        updateSkillBar("sp", speakingScore);
        updateSkillBar("wr", writingScore);
        updateSkillBar("rd", readingScore);
        updateSkillBar("ls", listeningScore);

        // Enabling skills values
        document.getElementById("en-of").textContent = oralFluency;
        document.getElementById("en-pr").textContent = pronunciation;
        document.getElementById("en-gr").textContent = grammar;
        document.getElementById("en-sp").textContent = spelling;
        document.getElementById("en-vo").textContent = vocabulary;
        document.getElementById("en-wd").textContent = writtenDiscourse;

        // Log results to dashboard
        dashboard.addPracticeLog(
            "Mock Test",
            "Mini-Mock Test #1",
            overallScore,
            `Sp: ${speakingScore} | Wr: ${writingScore} | Rd: ${readingScore} | Ls: ${listeningScore}`
        );
    }

    function updateSkillBar(id, score) {
        const bar = document.getElementById(`bar-${id}`);
        const val = document.getElementById(`val-${id}`);
        if (bar && val) {
            const percentage = (score / 90) * 100;
            bar.style.width = `${percentage}%`;
            val.textContent = score;
        }
    }

    return {
        init
    };
})();
window.mocktest = mocktest;
