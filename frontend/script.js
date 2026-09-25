 let exercises = [];
        let currentExercise = 0;
        let exercise;
        let selectedWords = [];
        let xp = 0;

        function renderExercise() {
            exercise = exercises[currentExercise];
            selectedWords = [];
            document.getElementById("instruction").textContent = exercise.instruction;
            document.getElementById("translation").textContent = exercise.data.translation;
            document.getElementById("result").textContent = exercise.result;
            document.getElementById("correct-answer").textContent = exercise.correctAnswer;
            document.getElementById("progress").max = exercises.length;
            document.getElementById("progress").value = currentExercise + 1;
            renderWords();
            renderAnswer();
        }

        function restartLesson() {
            currentExercise = 0;
            const progress = document.getElementById("progress");
            progress.value = 0;
            loadExercise();
        }

        async function loadExercise() {
            const response = await fetch("/api/lessons/1/session");
            exercises = await response.json();
            renderExercise();
        }

        function renderWords() {
            const container = document.getElementById("words");

            container.innerHTML = "";

            const availableWords = exercise.data.words.filter((word, index) => {
                return !selectedWords.includes(word);
            });

            for (const word of availableWords) {
                const button = document.createElement("button");

                button.className = "word";
                button.textContent = word;

                button.addEventListener("click", () => {
                    selectedWords.push(word);

                    renderWords();
                    renderAnswer();
                });

                container.appendChild(button);
            }
        }

        function renderAnswer() {
            const container = document.getElementById("answer");

            container.innerHTML = "";

            for (let i = 0; i < selectedWords.length; i++) {
                const word = selectedWords[i];

                const button = document.createElement("button");

                button.className = "selected-word";
                button.textContent = word;

                button.addEventListener("click", () => {
                    selectedWords.splice(i, 1);

                    renderWords();
                    renderAnswer();
                });

                container.appendChild(button);
            }
        }

        document.getElementById("check").addEventListener("click", () => {
            const result = document.getElementById("result");
            const correctAnswer = document.getElementById("correct-answer");

            const answer = selectedWords.join(" ");
            const expectedAnswer = exercise.data.words.join(" ");

            if (answer === expectedAnswer) {
                result.textContent = "Correct!";
                correctAnswer.textContent = "";
                currentExercise++;
                if (currentExercise < exercises.length) {
                    renderExercise();
                } else {
                    currentExercise = 0;
                    loadExercise();
                }
            } else {
                result.textContent = "Incorrect.";
                correctAnswer.textContent =
                    "Correct answer: " + expectedAnswer;
            }
        });

        loadExercise();