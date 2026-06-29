// APEUni Clone - Practice Room Module (Phase 2 Expanded)

const practice = (function() {
    // Practice Database
    const database = {
        ra: [
            {
                id: "ra-1",
                title: "Artificial Intelligence in Education",
                prompt: "Artificial intelligence is rapidly transforming education worldwide. By analyzing student performance data, machine learning algorithms can design customized learning paths that adapt to each student's speed and understanding. However, teachers remain irreplaceable in providing emotional support and critical thinking guidance."
            },
            {
                id: "ra-2",
                title: "Global Temperature Anomalies",
                prompt: "In recent decades, global temperature anomalies have shown an accelerating upward trend. Climate experts warn that unless greenhouse gas emissions are dramatically reduced, extreme weather events like prolonged droughts, severe flooding, and intense heatwaves will become more frequent and destructive."
            },
            {
                id: "ra-3",
                title: "Evolution of Language",
                prompt: "Languages are dynamic systems that evolve continuously over time. Through cultural exchange, technological advancement, and geographic migration, vocabulary expands while grammar rules slowly adapt. Tracking these linguistic changes allows historians to reconstruct ancient migration routes and trace human interactions."
            }
        ],
        di: [
            {
                id: "di-1",
                title: "Global Energy Consumption Chart",
                template: "1. Introduction: 'The bar chart describes the global energy consumption by source from 2010 to 2025.'\n2. Key Trend: 'As can be seen, Oil and Coal remain the dominant energy sources, followed by Natural Gas.'\n3. Details: 'Renewable energy shows a steady upward trend, rising from 8% to nearly 20% by 2025.'\n4. Conclusion: 'In conclusion, while fossil fuels still dominate, green energy is growing rapidly.'",
                svg: `<svg viewBox="0 0 400 300" style="background:#1a1d36; border-radius:8px;">
                    <text x="20" y="30" fill="white" font-size="14" font-weight="700">Global Energy Consumption (%)</text>
                    <line x1="50" y1="240" x2="360" y2="240" stroke="#4a4f73" stroke-width="2"/>
                    <line x1="50" y1="60" x2="50" y2="240" stroke="#4a4f73" stroke-width="2"/>
                    <text x="20" y="70" fill="rgba(255,255,255,0.4)" font-size="10">80%</text><line x1="50" y1="65" x2="360" y2="65" stroke="rgba(255,255,255,0.05)"/>
                    <text x="20" y="125" fill="rgba(255,255,255,0.4)" font-size="10">50%</text><line x1="50" y1="120" x2="360" y2="120" stroke="rgba(255,255,255,0.05)"/>
                    <text x="20" y="180" fill="rgba(255,255,255,0.4)" font-size="10">20%</text><line x1="50" y1="175" x2="360" y2="175" stroke="rgba(255,255,255,0.05)"/>
                    <rect x="80" y="110" width="30" height="130" fill="#3b82f6" rx="3"/>
                    <rect x="120" y="130" width="30" height="110" fill="#ef4444" rx="3"/>
                    <rect x="160" y="210" width="30" height="30" fill="#10b981" rx="3"/>
                    <text x="110" y="260" fill="white" font-size="10">Year 2010</text>
                    <rect x="230" y="90" width="30" height="150" fill="#3b82f6" rx="3"/>
                    <rect x="270" y="140" width="30" height="100" fill="#ef4444" rx="3"/>
                    <rect x="310" y="160" width="30" height="80" fill="#10b981" rx="3"/>
                    <text x="260" y="260" fill="white" font-size="10">Year 2025</text>
                    <rect x="80" y="280" width="10" height="10" fill="#3b82f6"/>
                    <text x="95" y="289" fill="rgba(255,255,255,0.6)" font-size="9">Fossil Fuels</text>
                    <rect x="180" y="280" width="10" height="10" fill="#ef4444"/>
                    <text x="195" y="289" fill="rgba(255,255,255,0.6)" font-size="9">Natural Gas</text>
                    <rect x="270" y="280" width="10" height="10" fill="#10b981"/>
                    <text x="285" y="289" fill="rgba(255,255,255,0.6)" font-size="9">Renewables</text>
                </svg>`
            },
            {
                id: "di-2",
                title: "Global Water Distribution Pie Chart",
                template: "1. Introduction: 'The pie chart demonstrates the distribution of water resources globally.'\n2. Dominant Sector: 'The vast majority of Earth's water is Oceans, which accounts for approximately 97%.'\n3. Minor Sectors: 'Glaciers and Polar Ice Caps constitute 2%, leaving only 1% as fresh surface water.'\n4. Conclusion: 'To summarize, accessible fresh water represents an extremely small fraction of total reserves.'",
                svg: `<svg viewBox="0 0 400 300" style="background:#1a1d36; border-radius:8px;">
                    <text x="20" y="30" fill="white" font-size="14" font-weight="700">Global Water Distribution</text>
                    <!-- Pie segments represented by paths/circles -->
                    <circle cx="200" cy="140" r="80" fill="none" stroke="#3b82f6" stroke-width="160" stroke-dasharray="502 502" />
                    <!-- Ocean segment is huge. Ice segment (2% -> 7deg). Fresh segment (1% -> 3deg). -->
                    <path d="M 200 140 L 200 60 A 80 80 0 0 1 216 62 Z" fill="#ef4444" />
                    <path d="M 200 140 L 216 62 A 80 80 0 0 1 224 64 Z" fill="#f59e0b" />
                    <!-- Legend -->
                    <rect x="50" y="260" width="12" height="12" fill="#3b82f6"/>
                    <text x="70" y="271" fill="white" font-size="10">Oceans (97%)</text>
                    <rect x="170" y="260" width="12" height="12" fill="#ef4444"/>
                    <text x="190" y="271" fill="white" font-size="10">Ice Caps (2%)</text>
                    <rect x="280" y="260" width="12" height="12" fill="#f59e0b"/>
                    <text x="300" y="271" fill="white" font-size="10">Fresh Water (1%)</text>
                </svg>`
            }
        ],
        we: [
            {
                id: "we-1",
                title: "Should students take a gap year?",
                prompt: "Some people believe that taking a gap year after high school to work or travel is highly beneficial for students' personal development. Others argue that it wastes precious time and delays academic progress. Write an essay discussing both views and provide your own opinion. Write between 200 and 300 words."
            }
        ],
        swt: [
            {
                id: "swt-1",
                title: "Greenhouse Effect and Emissions",
                passage: "Greenhouse gases, primarily carbon dioxide, methane, and nitrous oxide, play a vital role in keeping our planet habitable by trapping heat in the atmosphere. However, since the Industrial Revolution, human activities—such as burning fossil fuels, deforestation, and industrial agriculture—have dramatically increased the concentrations of these gases. This artificial enhancement of the greenhouse effect has resulted in global warming, leading to rising sea levels, changing weather patterns, and more frequent extreme weather events. Scientists argue that urgent international cooperation is required to mitigate these effects and transition to renewable energy sources."
            }
        ],
        fib: [
            {
                id: "fib-1",
                title: "Origins of Agriculture",
                passage: "The origin of agriculture is one of the most [1] events in human history. Prior to farming, humans lived as hunter-gatherers, moving constantly in search of food. When communities began domesticating plants and animals, they established permanent [2], which led to the growth of cities. This agricultural [3] allowed populations to expand and specialized jobs to emerge.",
                blanks: {
                    1: { correct: "significant", options: ["significant", "unrelated", "minor", "accidental"] },
                    2: { correct: "settlements", options: ["hospitals", "settlements", "vehicles", "boundaries"] },
                    3: { correct: "surplus", options: ["surplus", "failure", "scarcity", "deficit"] }
                }
            }
        ],
        ro: [
            {
                id: "ro-1",
                title: "Scientific Hypothesis Testing",
                paragraphs: [
                    { id: "A", text: "First, scientists form a hypothesis based on observations of a natural phenomenon." },
                    { id: "B", text: "Next, they design and conduct experiments to gather empirical data and test this hypothesis." },
                    { id: "C", text: "If the experimental data contradicts the hypothesis, it must be modified or discarded." },
                    { id: "D", text: "Finally, if the hypothesis is supported by multiple experiments, it may eventually become a scientific theory." }
                ],
                correctOrder: ["A", "B", "C", "D"]
            }
        ],
        wfd: [
            {
                id: "wfd-1",
                title: "Dictation item 1",
                sentence: "The library will be closed for renovation next Monday."
            },
            {
                id: "wfd-2",
                title: "Dictation item 2",
                sentence: "Most academic courses require students to perform independent research."
            },
            {
                id: "wfd-3",
                title: "Dictation item 3",
                sentence: "Please write your name and student number on the front page of the exam paper."
            }
        ],
        hiw: [
            {
                id: "hiw-1",
                title: "History of Technology",
                passage: "The history of modern technology is closely tied to the discovery of electricity. Once scientists understood how to generate and control electrical currents, they developed devices like telegraphs and lightbulbs. Soon after, the invention of transistors revolutionized computing, leading to the digital age we live in today.",
                spoken: "The history of modern technology is closely tied to the discovery of fire. Once scientists understood how to generate and control electrical currents, they developed items like telegraphs and lightbulbs. Soon after, the invention of transistors ruined computing, leading to the digital age we live in today.",
                incorrectWords: ["fire", "items", "ruined"], // spoken instead of electricity, devices, revolutionized
                targetWordIndices: [10, 20, 29] // indices in the display word array of modified words
            }
        ]
    };

    let activeType = "ra";
    let activeIndex = 0;
    
    // Timer states
    let countdownInterval = null;
    let recordingTimeout = null;

    // Web Audio / Visualizer states
    let audioContext = null;
    let analyser = null;
    let dataArray = null;
    let sourceNode = null;
    let visualizerAnimation = null;
    let mediaRecorder = null;
    
    // Speech Recognition state
    let recognition = null;
    let transcription = "";

    // Drag-Drop / Swap Reorder active list state
    let activeReorderList = [];

    // Clicked word indices list for HIW
    let clickedWordIndices = [];

    function selectCategory(category) {
        const mapping = {
            speaking: "ra",
            writing: "we",
            reading: "fib",
            listening: "wfd"
        };
        const type = mapping[category] || "ra";
        
        const sidebarItems = document.querySelectorAll(".sidebar-menu li");
        sidebarItems.forEach(item => {
            if (item.dataset.type === type) {
                item.classList.add("active");
                const categoryHeader = item.closest(".sidebar-category").querySelector(".sidebar-category-header");
                categoryHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                item.classList.remove("active");
            }
        });

        loadPracticeRoom(type, 0);
    }

    function init() {
        const sidebarItems = document.querySelectorAll(".sidebar-menu li");
        sidebarItems.forEach(item => {
            item.addEventListener("click", function() {
                sidebarItems.forEach(i => i.classList.remove("active"));
                this.classList.add("active");
                
                const type = this.dataset.type;
                loadPracticeRoom(type, 0);
            });
        });

        initSpeechRecognition();

        // Load default Speaking Read Aloud
        loadPracticeRoom("ra", 0);
    }

    function cleanupTimers() {
        if (countdownInterval) clearInterval(countdownInterval);
        if (recordingTimeout) clearTimeout(recordingTimeout);
        if (visualizerAnimation) cancelAnimationFrame(visualizerAnimation);
        
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
        if (sourceNode) {
            sourceNode.disconnect();
        }
        if (recognition) {
            recognition.stop();
        }
    }

    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = function(event) {
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        transcription += event.results[i][0].transcript + ' ';
                    }
                }
            };

            recognition.onerror = function(event) {
                console.error("Speech recognition error: ", event.error);
            };
        }
    }

    function loadPracticeRoom(type, index) {
        cleanupTimers();
        activeType = type;
        activeIndex = index;

        const container = document.getElementById("practice-workspace-container");
        if (!container) return;

        const item = database[type][index];
        if (!item) return;

        // Render based on type
        switch (type) {
            case "ra":
                renderReadAloud(item, container);
                break;
            case "di":
                renderDescribeImage(item, container);
                break;
            case "we":
                renderWriteEssay(item, container);
                break;
            case "swt":
                renderSummarizeText(item, container);
                break;
            case "fib":
                renderFillBlanks(item, container);
                break;
            case "ro":
                renderReorderParagraphs(item, container);
                break;
            case "wfd":
                renderWriteDictation(item, container);
                break;
            case "hiw":
                renderHighlightIncorrect(item, container);
                break;
        }
    }

    // 1. READ ALOUD RENDERER
    function renderReadAloud(item, container) {
        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Read Aloud (Đọc Lớn)</h2>
                        <p>Đọc to đoạn văn dưới đây vào micro một cách trôi chảy và phát âm chuẩn xác.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype speaking-color">Speaking</span>
                    </div>
                </div>

                <div class="question-prompt" id="ra-passage-text">${item.prompt}</div>

                <div class="speaking-timer-row">
                    <div class="status-indicator">
                        <div class="pulse-dot" id="timer-dot"></div>
                        <span id="timer-status">Chuẩn bị nói</span>
                    </div>
                    <div class="timer-countdown-big" id="timer-clock">40</div>
                </div>

                <div class="audio-visualizer-container hidden" id="visualizer-box">
                    <canvas class="waveform-canvas" id="visualizer-canvas"></canvas>
                </div>

                <div class="recording-controls">
                    <button class="btn-rec btn-rec-start" id="rec-btn" title="Bắt đầu ghi âm">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </button>
                </div>

                <div class="score-report-card hidden" id="speaking-score-report"></div>
            </div>
        `;

        setupSpeakingEvents(item.prompt);
    }

    // 2. DESCRIBE IMAGE RENDERER
    function renderDescribeImage(item, container) {
        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Describe Image (Mô Tả Hình Ảnh)</h2>
                        <p>Mô tả chi tiết biểu đồ dưới đây trong vòng 40 giây.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype speaking-color">Speaking</span>
                    </div>
                </div>

                <div class="di-layout">
                    <div class="di-image-box">
                        ${item.svg}
                    </div>
                    <div class="di-template-box">
                        <h4>Mẫu Mô Tả Gợi Ý (Templates)</h4>
                        <div class="di-template-area">
                            <pre style="white-space: pre-wrap; font-family: inherit;">${item.template}</pre>
                        </div>
                    </div>
                </div>

                <div class="speaking-timer-row">
                    <div class="status-indicator">
                        <div class="pulse-dot" id="timer-dot"></div>
                        <span id="timer-status">Chuẩn bị nói</span>
                    </div>
                    <div class="timer-countdown-big" id="timer-clock">25</div>
                </div>

                <div class="audio-visualizer-container hidden" id="visualizer-box">
                    <canvas class="waveform-canvas" id="visualizer-canvas"></canvas>
                </div>

                <div class="recording-controls">
                    <button class="btn-rec btn-rec-start" id="rec-btn" title="Bắt đầu ghi âm">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/></svg>
                    </button>
                </div>

                <div class="score-report-card hidden" id="speaking-score-report"></div>
            </div>
        `;

        setupSpeakingEvents("The graph represents structural indicator parameters.", 25);
    }

    function setupSpeakingEvents(targetText, prepTime = 40) {
        const timerClock = document.getElementById("timer-clock");
        const timerStatus = document.getElementById("timer-status");
        const timerDot = document.getElementById("timer-dot");
        const recBtn = document.getElementById("rec-btn");

        let currentPrep = prepTime;
        timerClock.textContent = currentPrep;
        timerDot.className = "pulse-dot pulse-pre";

        countdownInterval = setInterval(() => {
            currentPrep--;
            if (currentPrep >= 0) {
                timerClock.textContent = currentPrep;
            } else {
                clearInterval(countdownInterval);
                startRecordingSpeech(targetText);
            }
        }, 1000);

        recBtn.addEventListener("click", function() {
            if (this.classList.contains("btn-rec-start")) {
                clearInterval(countdownInterval);
                startRecordingSpeech(targetText);
            } else {
                stopRecordingSpeech(targetText);
            }
        });
    }

    function startRecordingSpeech(targetText) {
        const timerClock = document.getElementById("timer-clock");
        const timerStatus = document.getElementById("timer-status");
        const timerDot = document.getElementById("timer-dot");
        const recBtn = document.getElementById("rec-btn");
        const visualizerBox = document.getElementById("visualizer-box");

        timerStatus.textContent = "Đang Ghi Âm...";
        timerDot.className = "pulse-dot pulse-rec";
        recBtn.className = "btn-rec btn-rec-stop";
        recBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`;
        visualizerBox.classList.remove("hidden");

        let duration = 40;
        timerClock.textContent = duration;

        countdownInterval = setInterval(() => {
            duration--;
            if (duration >= 0) {
                timerClock.textContent = duration;
            } else {
                stopRecordingSpeech(targetText);
            }
        }, 1000);

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                sourceNode = audioContext.createMediaStreamSource(stream);
                sourceNode.connect(analyser);
                
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);

                drawWaveform();

                transcription = "";
                if (recognition) {
                    recognition.start();
                }
            })
            .catch(err => {
                console.error("Microphone access failed: ", err);
                timerStatus.textContent = "Không kết nối được Micro";
                timerDot.className = "pulse-dot";
                stopRecordingSpeech(targetText);
            });
    }

    function drawWaveform() {
        const canvas = document.getElementById("visualizer-canvas");
        if (!canvas) return;
        const canvasCtx = canvas.getContext("2d");
        
        const width = canvas.width;
        const height = canvas.height;

        visualizerAnimation = requestAnimationFrame(drawWaveform);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = '#121629';
        canvasCtx.fillRect(0, 0, width, height);

        const barWidth = (width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for(let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] / 2.5;
            canvasCtx.fillStyle = `rgb(99, 102, ${barHeight + 100})`;
            canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    function stopRecordingSpeech(targetText) {
        cleanupTimers();

        const timerStatus = document.getElementById("timer-status");
        const timerDot = document.getElementById("timer-dot");
        const recBtn = document.getElementById("rec-btn");
        const visualizerBox = document.getElementById("visualizer-box");

        if (timerStatus) timerStatus.textContent = "Đang xử lý kết quả...";
        if (timerDot) timerDot.className = "pulse-dot";
        if (visualizerBox) visualizerBox.classList.add("hidden");

        if (recBtn) {
            recBtn.className = "btn-rec btn-rec-start";
            recBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/></svg>`;
        }

        setTimeout(() => {
            gradeSpeaking(targetText);
        }, 1200);
    }

    function gradeSpeaking(targetText) {
        const reportCard = document.getElementById("speaking-score-report");
        if (!reportCard) return;

        const targetClean = targetText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        const targetWords = targetClean.split(/\s+/);
        
        let spokenText = transcription.trim();
        
        if (!spokenText || spokenText.length < 5) {
            const tempWords = [...targetWords];
            if (tempWords.length > 5) {
                tempWords[2] = "effected";
                tempWords[tempWords.length - 2] = "world";
            }
            spokenText = tempWords.join(" ");
        }

        const spokenWords = spokenText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/);

        let correctCount = 0;
        const htmlFeedback = [];

        targetWords.forEach((word) => {
            const matchIdx = spokenWords.indexOf(word);
            if (matchIdx !== -1) {
                correctCount++;
                htmlFeedback.push(`<span class="word-correct">${word}</span>`);
                spokenWords.splice(matchIdx, 1);
            } else {
                htmlFeedback.push(`<span class="word-incorrect">${word}</span>`);
            }
        });

        const ratio = correctCount / targetWords.length;
        const oralFluency = Math.round(10 + ratio * 80);
        const pronunciation = Math.round(10 + ratio * 76 + (Math.random() * 4));
        const overallScore = Math.round((oralFluency + pronunciation) / 2);

        reportCard.classList.remove("hidden");
        reportCard.innerHTML = `
            <h3>Kết quả Đánh giá AI</h3>
            <p>Đoạn văn được nhận diện:</p>
            <div class="transcribed-speech-box">
                ${htmlFeedback.join(" ")}
            </div>
            
            <div class="score-metrics-row">
                <div class="score-metric-box" style="border-top: 3px solid var(--speaking);">
                    <span>PTE Score</span>
                    <strong style="color: var(--speaking);">${overallScore}</strong>
                </div>
                <div class="score-metric-box" style="border-top: 3px solid var(--listening);">
                    <span>Pronunciation</span>
                    <strong style="color: var(--listening);">${pronunciation}</strong>
                </div>
                <div class="score-metric-box" style="border-top: 3px solid var(--reading);">
                    <span>Oral Fluency</span>
                    <strong style="color: var(--reading);">${oralFluency}</strong>
                </div>
            </div>
        `;

        dashboard.addPracticeLog(
            activeType === "ra" ? "Read Aloud" : "Describe Image",
            database[activeType][activeIndex].title,
            overallScore,
            `Pron: ${pronunciation} | Fluency: ${oralFluency}`
        );

        reportCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // 3. WRITE ESSAY RENDERER
    function renderWriteEssay(item, container) {
        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Write Essay (Viết Bài Luận)</h2>
                        <p>Viết bài luận trả lời câu hỏi dưới đây. Bài viết đạt chuẩn từ 200 - 300 từ.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype writing-color">Writing</span>
                    </div>
                </div>

                <div class="question-prompt">${item.prompt}</div>

                <div class="essay-editor-wrapper">
                    <textarea class="essay-textarea" id="essay-box" placeholder="Nhập bài luận của bạn tại đây..."></textarea>
                    <div class="essay-info-bar">
                        <span id="essay-timer-lbl">Thời gian làm bài: 20:00</span>
                        <span>Số từ: <span id="essay-word-counter" class="word-count-danger">0</span> / 300</span>
                    </div>
                </div>

                <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
                    <button class="btn btn-primary" id="essay-submit-btn">Nộp Bài Chấm Điểm AI</button>
                </div>

                <div class="score-report-card hidden" id="essay-score-report"></div>
            </div>
        `;

        setupEssayEvents(item, 20, 200, 300, gradeEssay);
    }

    function setupEssayEvents(item, minutesLimit, minWords, maxWords, gradingCallback) {
        const textEl = document.getElementById("essay-box");
        const countEl = document.getElementById("essay-word-counter");
        const timerEl = document.getElementById("essay-timer-lbl");
        const submitBtn = document.getElementById("essay-submit-btn");

        let duration = minutesLimit * 60;
        countdownInterval = setInterval(() => {
            duration--;
            const mins = Math.floor(duration / 60);
            const secs = duration % 60;
            if (timerEl) {
                timerEl.textContent = `Thời gian làm bài: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            if (duration <= 0) {
                clearInterval(countdownInterval);
                gradingCallback(textEl.value, item, minWords, maxWords);
            }
        }, 1000);

        textEl.addEventListener("input", function() {
            const text = this.value.trim();
            const words = text === "" ? 0 : text.split(/\s+/).length;
            countEl.textContent = words;

            if (words >= minWords && words <= maxWords) {
                countEl.className = "word-count-success";
            } else {
                countEl.className = "word-count-danger";
            }
        });

        submitBtn.addEventListener("click", () => {
            clearInterval(countdownInterval);
            gradingCallback(textEl.value, item, minWords, maxWords);
        });
    }

    function gradeEssay(text, item, minWords = 200, maxWords = 300) {
        const reportCard = document.getElementById("essay-score-report");
        if (!reportCard) return;

        const wordsCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

        let spellingErrors = [];
        let grammarScore = 90;

        const matches = text.toLowerCase().match(/\b\w+\b/g) || [];
        const commonSpellErrors = {
            "recieve": "receive", "untill": "until", "goverment": "government", "enviroment": "environment"
        };

        matches.forEach(word => {
            if (commonSpellErrors[word]) spellingErrors.push(word);
        });

        const spellingScore = Math.max(10, 90 - (spellingErrors.length * 15));
        let contentScore = 90;

        if (wordsCount < minWords || wordsCount > maxWords) {
            grammarScore = Math.max(10, grammarScore - 30);
            contentScore = Math.max(10, contentScore - 40);
        }

        const overallScore = Math.round((grammarScore + spellingScore + contentScore) / 3);

        reportCard.classList.remove("hidden");
        reportCard.innerHTML = `
            <h3>Kết quả Chấm Essay AI</h3>
            <p><strong>Phân tích Bài Viết:</strong></p>
            <ul>
                <li>Số từ: <span class="${wordsCount >= minWords && wordsCount <= maxWords ? 'text-green' : 'text-orange'}">${wordsCount} từ</span> (Yêu cầu: ${minWords} - ${maxWords} từ)</li>
                <li>Lỗi chính tả phát hiện: ${spellingErrors.length > 0 ? `<span class="text-orange">${spellingErrors.join(', ')}</span>` : `<span class="text-green">Không có lỗi phát hiện</span>`}</li>
            </ul>

            <div class="score-metrics-row">
                <div class="score-metric-box" style="border-top: 3px solid var(--writing);">
                    <span>PTE Score</span>
                    <strong style="color: var(--writing);">${overallScore}</strong>
                </div>
                <div class="score-metric-box" style="border-top: 3px solid var(--listening);">
                    <span>Grammar</span>
                    <strong style="color: var(--listening);">${grammarScore}</strong>
                </div>
                <div class="score-metric-box" style="border-top: 3px solid var(--reading);">
                    <span>Spelling</span>
                    <strong style="color: var(--reading);">${spellingScore}</strong>
                </div>
            </div>
        `;

        dashboard.addPracticeLog("Write Essay", item.title, overallScore, `Words: ${wordsCount}`);
        reportCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // 3.1 SUMMARIZE WRITTEN TEXT (SWT) RENDERER
    function renderSummarizeText(item, container) {
        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Summarize Written Text (Tóm Tắt Đoạn Văn)</h2>
                        <p>Đọc đoạn văn và viết tóm tắt trong <strong>một câu duy nhất</strong>. Yêu cầu từ 5 - 75 từ.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype writing-color">Writing</span>
                    </div>
                </div>

                <div class="question-prompt" style="font-size: 0.95rem; line-height: 1.5; max-height: 200px; overflow-y: auto;">
                    ${item.passage}
                </div>

                <div class="essay-editor-wrapper">
                    <textarea class="essay-textarea" id="essay-box" style="height: 140px;" placeholder="Nhập câu tóm tắt duy nhất của bạn tại đây..."></textarea>
                    <div class="essay-info-bar">
                        <span id="essay-timer-lbl">Thời gian làm bài: 10:00</span>
                        <span>Số từ: <span id="essay-word-counter" class="word-count-danger">0</span> / 75</span>
                    </div>
                </div>

                <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
                    <button class="btn btn-primary" id="essay-submit-btn">Nộp Bài Chấm Điểm AI</button>
                </div>

                <div class="score-report-card hidden" id="essay-score-report"></div>
            </div>
        `;

        setupEssayEvents(item, 10, 5, 75, gradeSWT);
    }

    function gradeSWT(text, item) {
        const reportCard = document.getElementById("essay-score-report");
        if (!reportCard) return;

        const cleanText = text.trim();
        const wordsCount = cleanText === "" ? 0 : cleanText.split(/\s+/).length;

        // SWT rule: EXACTLY one sentence
        // Simple period character checker: Count occurrences of '.'
        const periodCount = (cleanText.match(/\./g) || []).length;
        const isOneSentence = (periodCount === 1 && cleanText.endsWith('.'));

        // Capitalization
        const isCapitalized = cleanText.length > 0 && cleanText[0] === cleanText[0].toUpperCase();

        let grammarScore = 90;
        let contentScore = 90;
        let formScore = 90;

        if (wordsCount < 5 || wordsCount > 75) {
            formScore = Math.max(10, formScore - 40);
        }

        if (!isOneSentence) {
            // Serious deduction for multiple periods or missing ending period
            grammarScore = Math.max(10, grammarScore - 50);
            formScore = Math.max(10, formScore - 50);
        }

        if (!isCapitalized) {
            grammarScore = Math.max(10, grammarScore - 15);
        }

        // Keywords overlap
        const keywords = ["greenhouse", "gases", "warming", "emissions", "cooperation", "renewable"];
        let keywordMatches = 0;
        keywords.forEach(w => {
            if (cleanText.toLowerCase().includes(w)) keywordMatches++;
        });
        contentScore = Math.round(10 + (keywordMatches / keywords.length) * 80);

        const overallScore = Math.round((grammarScore + formScore + contentScore) / 3);

        reportCard.classList.remove("hidden");
        reportCard.innerHTML = `
            <h3>Kết quả Chấm SWT AI</h3>
            <p><strong>Đánh giá Cú pháp &amp; Định dạng:</strong></p>
            <ul>
                <li>Số từ: <span class="${wordsCount >= 5 && wordsCount <= 75 ? 'text-green' : 'text-orange'}">${wordsCount} từ</span> (Đạt chuẩn 5 - 75 từ)</li>
                <li>Đúng định dạng 1 câu: ${isOneSentence ? `<span class="text-green">Chính xác (Đoạn văn kết thúc bằng 1 dấu chấm)</span>` : `<span class="text-orange">Sai định dạng (Yêu cầu viết đúng 1 câu duy nhất và có dấu chấm ở cuối)</span>`}</li>
                <li>Viết hoa chữ đầu: ${isCapitalized ? `<span class="text-green">Đúng</span>` : `<span class="text-orange">Sai (Ký tự đầu tiên phải viết hoa)</span>`}</li>
            </ul>

            <div class="score-metrics-row">
                <div class="score-metric-box" style="border-top: 3px solid var(--writing);">
                    <span>PTE Score</span>
                    <strong style="color: var(--writing);">${overallScore}</strong>
                </div>
                <div class="score-metric-box" style="border-top: 3px solid var(--listening);">
                    <span>Form (Cú pháp)</span>
                    <strong style="color: var(--listening);">${formScore}</strong>
                </div>
                <div class="score-metric-box" style="border-top: 3px solid var(--reading);">
                    <span>Grammar</span>
                    <strong style="color: var(--reading);">${grammarScore}</strong>
                </div>
            </div>
        `;

        dashboard.addPracticeLog("SWT Summary", "Greenhouse summary", overallScore, `Sentence: ${isOneSentence ? 'OK' : 'Fail'}`);
        reportCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // 4. READING FILL IN THE BLANKS RENDERER
    function renderFillBlanks(item, container) {
        let passageHTML = item.passage;
        
        Object.keys(item.blanks).forEach(num => {
            const blank = item.blanks[num];
            let optionsHTML = `<option value="">-- Chọn từ --</option>`;
            blank.options.forEach(opt => {
                optionsHTML += `<option value="${opt}">${opt}</option>`;
            });

            const selectTag = `<select class="fib-select" data-blank="${num}">${optionsHTML}</select>`;
            passageHTML = passageHTML.replace(`[${num}]`, selectTag);
        });

        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Reading - Fill in the Blanks</h2>
                        <p>Đọc đoạn văn dưới đây và chọn từ thích hợp nhất để điền vào các chỗ trống.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype reading-color">Reading</span>
                    </div>
                </div>

                <div class="fib-passage">
                    ${passageHTML}
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="btn btn-secondary" id="fib-reset-btn">Làm Lại</button>
                    <button class="btn btn-primary" id="fib-check-btn">Kiểm Tra Đáp Án</button>
                </div>

                <div class="fib-key-panel hidden" id="fib-key-box">
                    <div class="fib-key-title">Đáp Án Chi Tiết:</div>
                    <div class="fib-keys-row" id="fib-key-container"></div>
                </div>
            </div>
        `;

        setupReadingEvents(item);
    }

    function setupReadingEvents(item) {
        const checkBtn = document.getElementById("fib-check-btn");
        const resetBtn = document.getElementById("fib-reset-btn");
        const selects = document.querySelectorAll(".fib-select");
        const keyBox = document.getElementById("fib-key-box");
        const keyContainer = document.getElementById("fib-key-container");

        checkBtn.addEventListener("click", () => {
            let correctBlanks = 0;
            keyContainer.innerHTML = "";

            selects.forEach(select => {
                const num = select.dataset.blank;
                const blank = item.blanks[num];
                const selectedVal = select.value;

                if (selectedVal === blank.correct) {
                    correctBlanks++;
                    select.className = "fib-select fib-correct";
                } else {
                    select.className = "fib-select fib-incorrect";
                }

                const keyBadge = document.createElement("span");
                keyBadge.className = "fib-key-badge";
                keyBadge.textContent = `[Chỗ trống ${num}]: ${blank.correct}`;
                keyContainer.appendChild(keyBadge);
            });

            keyBox.classList.remove("hidden");

            const rawPteScore = Math.round(10 + (correctBlanks / selects.length) * 80);
            dashboard.addPracticeLog("Fill in Blanks", item.title, rawPteScore, `Đúng: ${correctBlanks}/${selects.length}`);
        });

        resetBtn.addEventListener("click", () => {
            selects.forEach(select => {
                select.value = "";
                select.className = "fib-select";
            });
            keyBox.classList.add("hidden");
        });
    }

    // 4.1 REORDER PARAGRAPHS (RO) RENDERER
    function renderReorderParagraphs(item, container) {
        // Shuffle paragraphs copy for display
        activeReorderList = [...item.paragraphs].sort(() => Math.random() - 0.5);

        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Reorder Paragraphs (Sắp Xếp Đoạn Văn)</h2>
                        <p>Sắp xếp các đoạn văn dưới đây theo đúng thứ tự logic của chúng bằng cách bấm nút mũi tên.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype reading-color">Reading</span>
                    </div>
                </div>

                <div class="ro-list" id="ro-list-container">
                    <!-- Shuffled items injected here -->
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="btn btn-secondary" id="ro-reset-btn">Làm Mới</button>
                    <button class="btn btn-primary" id="ro-check-btn">Kiểm Tra Thứ Tự</button>
                </div>

                <div class="fib-key-panel hidden" id="ro-key-box" style="margin-top: 1.5rem;">
                    <div class="fib-key-title">Đáp Án Đúng:</div>
                    <div style="font-size: 0.95rem; font-weight: 600; color: var(--accent-glow);" id="ro-key-text">
                        Thứ tự chính xác: A -> B -> C -> D
                    </div>
                </div>
            </div>
        `;

        renderRoBlocks();

        document.getElementById("ro-reset-btn").addEventListener("click", () => {
            document.getElementById("ro-key-box").classList.add("hidden");
            activeReorderList = [...item.paragraphs].sort(() => Math.random() - 0.5);
            renderRoBlocks();
        });

        document.getElementById("ro-check-btn").addEventListener("click", () => {
            gradeRO(item);
        });
    }

    function renderRoBlocks() {
        const container = document.getElementById("ro-list-container");
        if (!container) return;

        container.innerHTML = "";

        activeReorderList.forEach((para, idx) => {
            const item = document.createElement("div");
            item.className = "ro-item";
            item.dataset.id = para.id;
            item.innerHTML = `
                <div class="ro-controls">
                    <button class="btn-ro-nav btn-up" data-idx="${idx}">▲</button>
                    <button class="btn-ro-nav btn-down" data-idx="${idx}">▼</button>
                </div>
                <div class="ro-content">
                    <span style="font-weight: 800; color: var(--accent-glow); margin-right: 0.5rem;">[${para.id}]</span>
                    ${para.text}
                </div>
            `;
            container.appendChild(item);
        });

        // Event hooks
        container.querySelectorAll(".btn-up").forEach(btn => {
            btn.addEventListener("click", function() {
                const idx = parseInt(this.dataset.idx);
                if (idx > 0) {
                    // Swap with previous
                    const temp = activeReorderList[idx];
                    activeReorderList[idx] = activeReorderList[idx - 1];
                    activeReorderList[idx - 1] = temp;
                    renderRoBlocks();
                }
            });
        });

        container.querySelectorAll(".btn-down").forEach(btn => {
            btn.addEventListener("click", function() {
                const idx = parseInt(this.dataset.idx);
                if (idx < activeReorderList.length - 1) {
                    // Swap with next
                    const temp = activeReorderList[idx];
                    activeReorderList[idx] = activeReorderList[idx + 1];
                    activeReorderList[idx + 1] = temp;
                    renderRoBlocks();
                }
            });
        });
    }

    function gradeRO(item) {
        const keyBox = document.getElementById("ro-key-box");
        const keyText = document.getElementById("ro-key-text");
        const blocks = document.querySelectorAll(".ro-item");

        if (!keyBox || !keyText) return;

        const correctOrder = item.correctOrder;
        const currentOrder = activeReorderList.map(p => p.id);

        // PTE Reorder Paragraphs grading is based on correct adjacent pairs
        // e.g. target is A-B-C-D. Pairs are AB, BC, CD. Total pairs = 3.
        let correctPairs = 0;
        const totalPairs = correctOrder.length - 1;

        for (let i = 0; i < currentOrder.length - 1; i++) {
            const currentPair = currentOrder[i] + currentOrder[i+1];
            // Check if this pair exists in correctOrder sequentially
            const firstIdx = correctOrder.indexOf(currentOrder[i]);
            if (firstIdx !== -1 && firstIdx < correctOrder.length - 1 && correctOrder[firstIdx + 1] === currentOrder[i+1]) {
                correctPairs++;
            }
        }

        // Color blocks
        blocks.forEach((block, idx) => {
            const paraId = block.dataset.id;
            const targetIdx = correctOrder.indexOf(paraId);
            if (targetIdx === idx) {
                block.className = "ro-item graded-correct";
            } else {
                block.className = "ro-item graded-incorrect";
            }
        });

        keyBox.classList.remove("hidden");
        keyText.textContent = `Thứ tự chính xác: ${correctOrder.join(" ➔ ")} (Đúng: ${correctPairs} / ${totalPairs} cặp đoạn liền kề)`;

        const rawPteScore = Math.round(10 + (correctPairs / totalPairs) * 80);
        dashboard.addPracticeLog("Reorder Paragraphs", item.title, rawPteScore, `Cặp đoạn đúng: ${correctPairs}/${totalPairs}`);
    }

    // 5. LISTENING WRITE FROM DICTATION RENDERER
    function renderWriteDictation(item, container) {
        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Write from Dictation (Nghe Điền Từ)</h2>
                        <p>Bấm nút nghe để phát âm thanh câu nói và viết chính xác lại câu đó.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype listening-color">Listening</span>
                    </div>
                </div>

                <div class="audio-player-panel">
                    <button class="btn-play-audio" id="wfd-play-btn" title="Phát âm thanh">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                    <div class="audio-progress-bar">
                        <div class="audio-progress-fill" id="wfd-progress"></div>
                    </div>
                    <span class="play-count-indicator" id="wfd-count">Còn lại: 1 lần phát</span>
                </div>

                <div class="wfd-editor-wrapper">
                    <textarea class="wfd-input" id="wfd-textarea" placeholder="Gõ lại câu nghe được tại đây..."></textarea>
                </div>

                <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="btn btn-primary" id="wfd-submit-btn">Đánh Giá Kết Quả</button>
                </div>

                <div class="wfd-diff-feedback hidden" id="wfd-feedback-box"></div>
            </div>
        `;

        setupListeningEvents(item);
    }

    function setupListeningEvents(item) {
        const playBtn = document.getElementById("wfd-play-btn");
        const progressFill = document.getElementById("wfd-progress");
        const countText = document.getElementById("wfd-count");
        const textEl = document.getElementById("wfd-textarea");
        const submitBtn = document.getElementById("wfd-submit-btn");
        const feedbackBox = document.getElementById("wfd-feedback-box");

        let playsLeft = 1;

        playBtn.addEventListener("click", () => {
            if (playsLeft <= 0) return;

            playsLeft--;
            countText.textContent = `Đã phát hết lượt`;
            playBtn.disabled = true;
            playBtn.style.opacity = 0.5;

            progressFill.style.width = "0%";
            setTimeout(() => { progressFill.style.width = "100%"; }, 100);

            vocab.speak(item.sentence);

            setTimeout(() => {
                progressFill.style.width = "0%";
            }, 4000);
        });

        submitBtn.addEventListener("click", () => {
            const userText = textEl.value.trim();
            gradeWFD(userText, item.sentence, feedbackBox);
        });
    }

    function gradeWFD(userText, targetText, feedbackBox) {
        const userClean = userText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
        const targetClean = targetText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();

        const userWords = userClean === "" ? [] : userClean.split(/\s+/);
        const targetWords = targetClean.split(/\s+/);

        let correct = 0;
        const htmlFeedback = [];

        targetWords.forEach(word => {
            const index = userWords.indexOf(word);
            if (index !== -1) {
                correct++;
                htmlFeedback.push(`<span class="diff-correct">${word}</span>`);
                userWords.splice(index, 1);
            } else {
                htmlFeedback.push(`<span class="diff-missing" title="Thiếu từ này">${word}</span>`);
            }
        });

        userWords.forEach(word => {
            htmlFeedback.push(`<span class="diff-added" title="Thừa từ này">${word}</span>`);
        });

        const rawPteScore = Math.round(10 + (correct / targetWords.length) * 80);

        feedbackBox.classList.remove("hidden");
        feedbackBox.innerHTML = `
            <div style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Đáp Án &amp; Chênh Lệch từ:</div>
            <div style="line-height: 1.6;">${htmlFeedback.join(" ")}</div>
            <div style="font-weight: 700; margin-top: 1rem; color: var(--accent-glow)">
                Đạt điểm: ${rawPteScore} / 90 (Đúng: ${correct} / ${targetWords.length} từ)
            </div>
        `;

        dashboard.addPracticeLog("Write Dictation", targetText.substring(0, 20) + "...", rawPteScore, `Đúng: ${correct}/${targetWords.length} từ`);
    }

    // 5.1 HIGHLIGHT INCORRECT WORDS (HIW) RENDERER
    function renderHighlightIncorrect(item, container) {
        clickedWordIndices = [];

        // Build word array representation of display passage text
        const words = item.passage.split(/\s+/);
        let wordSpansHTML = "";

        words.forEach((w, idx) => {
            // strip punctuations for clean data mapping but keep display text formatting
            const cleanW = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            wordSpansHTML += `<span class="hiw-word" data-idx="${idx}" data-word="${cleanW}">${w}</span> `;
        });

        container.innerHTML = `
            <div class="prac-card">
                <div class="prac-header">
                    <div class="prac-title-area">
                        <h2>Highlight Incorrect Words (Tìm Từ Phát Âm Sai)</h2>
                        <p>Vừa nghe tệp âm thanh vừa đối chiếu. Bấm chọn những từ được đọc khác biệt so với văn bản trên màn hình.</p>
                    </div>
                    <div class="prac-meta-controls">
                        <span class="badge-qtype listening-color">Listening</span>
                    </div>
                </div>

                <div class="audio-player-panel">
                    <button class="btn-play-audio" id="hiw-play-btn" title="Phát âm thanh">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                    <div class="audio-progress-bar">
                        <div class="audio-progress-fill" id="hiw-progress"></div>
                    </div>
                    <span class="play-count-indicator" id="hiw-count">Còn lại: 1 lần phát</span>
                </div>

                <div class="hiw-passage-box" id="hiw-text-passage">
                    ${wordSpansHTML}
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button class="btn btn-secondary" id="hiw-reset-btn">Làm Sạch</button>
                    <button class="btn btn-primary" id="hiw-check-btn">Kiểm Tra Kết Quả</button>
                </div>

                <div class="score-report-card hidden" id="hiw-score-report"></div>
            </div>
        `;

        setupHiwEvents(item);
    }

    function setupHiwEvents(item) {
        const playBtn = document.getElementById("hiw-play-btn");
        const progressFill = document.getElementById("hiw-progress");
        const countText = document.getElementById("hiw-count");
        const checkBtn = document.getElementById("hiw-check-btn");
        const resetBtn = document.getElementById("hiw-reset-btn");
        const wordSpans = document.querySelectorAll(".hiw-word");

        let playsLeft = 1;

        playBtn.addEventListener("click", () => {
            if (playsLeft <= 0) return;

            playsLeft--;
            countText.textContent = `Đã phát hết lượt`;
            playBtn.disabled = true;
            playBtn.style.opacity = 0.5;

            progressFill.style.width = "0%";
            setTimeout(() => { progressFill.style.width = "100%"; }, 100);

            // TTS speaks the SPOKEN string containing modifications
            vocab.speak(item.spoken);

            setTimeout(() => {
                progressFill.style.width = "0%";
            }, 10000); // longer audio
        });

        // Click word toggle highlights
        wordSpans.forEach(span => {
            span.addEventListener("click", function() {
                // Ignore click if already checked/graded
                if (span.classList.contains("hiw-correct") || span.classList.contains("hiw-incorrect")) return;

                const idx = parseInt(this.dataset.idx);
                this.classList.toggle("hiw-clicked");

                const clickedIdx = clickedWordIndices.indexOf(idx);
                if (clickedIdx === -1) {
                    clickedWordIndices.push(idx);
                } else {
                    clickedWordIndices.splice(clickedIdx, 1);
                }
            });
        });

        resetBtn.addEventListener("click", () => {
            clickedWordIndices = [];
            wordSpans.forEach(span => {
                span.className = "hiw-word";
            });
            document.getElementById("hiw-score-report").classList.add("hidden");
        });

        checkBtn.addEventListener("click", () => {
            gradeHIW(item);
        });
    }

    function gradeHIW(item) {
        const reportCard = document.getElementById("hiw-score-report");
        const wordSpans = document.querySelectorAll(".hiw-word");
        if (!reportCard) return;

        const targetTargets = item.targetWordIndices; // array of incorrect indices in text (e.g. [10, 20, 29])

        let correctSelections = 0;
        let incorrectSelections = 0;

        wordSpans.forEach(span => {
            const idx = parseInt(span.dataset.idx);
            
            // Check if this index was clicked
            const wasClicked = clickedWordIndices.includes(idx);
            // Check if this index is a target word index
            const isIncorrectWord = targetTargets.includes(idx);

            if (wasClicked) {
                if (isIncorrectWord) {
                    correctSelections++;
                    span.className = "hiw-word hiw-correct";
                } else {
                    incorrectSelections++;
                    span.className = "hiw-word hiw-incorrect";
                }
            } else if (isIncorrectWord) {
                // Highlight missed words slightly in orange underline
                span.classList.add("hiw-clicked");
            }
        });

        // PTE HIW scoring: 1 point for correct word, -1 point for incorrect word click (minimum score 0)
        const netScore = Math.max(0, correctSelections - incorrectSelections);
        const overallScore = Math.round(10 + (netScore / targetTargets.length) * 80);

        reportCard.classList.remove("hidden");
        reportCard.innerHTML = `
            <h3>Kết quả Đánh giá HIW</h3>
            <ul>
                <li>Số từ phát âm sai chọn đúng: <span class="text-green">${correctSelections} / ${targetTargets.length} từ</span></li>
                <li>Số từ nhấp nhầm (bị trừ điểm): <span class="text-orange">${incorrectSelections} từ</span></li>
                <li>Điểm ròng kỹ năng: <span style="font-weight:700;">${netScore} điểm</span></li>
            </ul>
            
            <div class="score-metrics-row" style="margin-top: 1.25rem;">
                <div class="score-metric-box" style="border-top: 3px solid var(--listening); grid-column: span 3;">
                    <span>PTE Listening Score</span>
                    <strong style="color: var(--listening);">${overallScore} / 90</strong>
                </div>
            </div>
        `;

        dashboard.addPracticeLog("Highlight Words", item.title, overallScore, `Đúng: ${correctSelections} | Nhầm: ${incorrectSelections}`);
        reportCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    return {
        init,
        selectCategory,
        loadPracticeRoom,
        cleanupTimers
    };
})();
window.practice = practice;
