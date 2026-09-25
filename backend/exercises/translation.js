function generate(sentence) {
    return {
        type: "translation",
        instruction: "Translate this sentence.",
        data: {
            sentence: sentence.english_text,
            answer: sentence.italian_text
        }
    };
}

module.exports = { generate };