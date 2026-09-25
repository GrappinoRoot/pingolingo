const { getSentences } = require("./tatoeba");
const wordOrder = require("./exercises/word_order");

async function generateSession(lessonId) {
    const words = ["eat", "go", "sleep"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const sentences = await getSentences(randomWord, 10);
    const exercises = [];

    for (const sentence of sentences) {
        exercises.push(wordOrder.generate(sentence));
    }

    return exercises;
}

module.exports = { generateSession };