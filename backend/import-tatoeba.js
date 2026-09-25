const { get, run } = require("./database");

const LESSON_ID = 1;

const initialUrl =
    "https://api.tatoeba.org/v1/sentences" +
    "?q=run" +
    "&lang=eng" +
    "&trans:lang=ita" +
    "&trans:is_direct=yes" +
    "&word_count=3-8" +
    "&sort=words" +
    "&limit=100";

async function importSentences() {
    let url = initialUrl;
    let position = 1;
    let imported = 0;

    while (url) {
        console.log(`Fetching: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Tatoeba API error: ${response.status} ${response.statusText}`
            );
        }

        const result = await response.json();

        for (const sentence of result.data) {
            const translation = sentence.translations.find(
                item => item.lang === "ita" && item.is_direct
            );

            if (!translation) {
                continue;
            }

            const existingSentence = await get(
                `
                SELECT id
                FROM sentences
                WHERE source = ?
                AND source_id = ?
                `,
                ["tatoeba", sentence.id]
            );

            let sentenceId;

            if (existingSentence) {
                sentenceId = existingSentence.id;
            } else {
                const inserted = await run(
                    `
                    INSERT INTO sentences (
                        english_text,
                        italian_text,
                        source,
                        source_id
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        sentence.text,
                        translation.text,
                        "tatoeba",
                        sentence.id
                    ]
                );

                sentenceId = inserted.id;
                imported++;
            }

            const existingLessonSentence = await get(
                `
                SELECT sentence_id
                FROM lesson_sentences
                WHERE lesson_id = ?
                AND sentence_id = ?
                `,
                [LESSON_ID, sentenceId]
            );

            if (!existingLessonSentence) {
                await run(
                    `
                    INSERT INTO lesson_sentences (
                        lesson_id,
                        sentence_id,
                        position
                    )
                    VALUES (?, ?, ?)
                    `,
                    [
                        LESSON_ID,
                        sentenceId,
                        position
                    ]
                );

                position++;
            }
        }

        if (result.paging.has_next) {
            url = result.paging.next;
        } else {
            url = null;
        }
    }

    console.log(`Imported ${imported} sentences.`);
}

importSentences().catch(error => {
    console.error(error);
    process.exit(1);
});