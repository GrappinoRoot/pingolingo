const TATOEBA_URL = "https://api.tatoeba.org/v1/sentences";

async function getSentences(word, limit = 10) {
    const params = new URLSearchParams({
        q: word,
        lang: "eng",
        "trans:lang": "ita",
        showtrans: "all",
        sort: "relevance",
        limit: limit
    });
    
    const response = await fetch(`${TATOEBA_URL}?${params}`);

    if (!response.ok) {
        throw new Error(`Tatoeba API error: ${response.status}`);
    }

    const data = await response.json();

    return data.data.map(sentence => {
        const italianTranslation = sentence.translations.find(
            translation => translation.lang === "ita"
        );

        if (!italianTranslation) {
            return null;
        }

        return {
            id: sentence.id,
            english_text: sentence.text,
            italian_text: italianTranslation.text
        };
    })
    .filter(Boolean);
}

module.exports = { getSentences }; 