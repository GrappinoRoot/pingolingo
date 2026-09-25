function generate(sentence) {
    const words = sentence.english_text.split(/\s+/);
    
    for (let i = words.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [words[i], words[j]] = [words[j], words[i]];
    }
    return {
        type: "word_order",
        instruction: "Build the correct sentence.",
        data: {
            translation: sentence.italian_text,
            words
        }
    };
}

module.exports = { generate };