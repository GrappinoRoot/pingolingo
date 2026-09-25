const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database/english.db");

async function getWord(word) {
    const response = await axios.get("https://api.datamuse.com/words", {
        params: {
            sp: word,
            md: "dpsr",
            ipa: 1
        }
    });

    return response.data[0];
}

async function main() {
    const data = await getWord("run");

    console.log(data);

    db.run(
        `INSERT INTO words
    (word, score, num_syllables, pronunciation)
    VALUES (?, ?, ?, ?)`,
        [
            data.word,
            data.score,
            data.numSyllables,
            data.tags.find(tag => tag.startsWith("ipa_pron:"))?.replace("ipa_pron:", "") || null
        ],
        function (error) {
            if (error) {
                console.error(error);
                return;
            }

            const wordId = this.lastID;

            console.log("Word salvata con ID:", wordId);

            const stmt = db.prepare(
                `INSERT INTO definitions
            (word_id, part_of_speech, definition)
            VALUES (?, ?, ?)`
            );

            for (const item of data.defs) {
                const [partOfSpeech, definition] = item.split("\t");

                stmt.run(
                    wordId,
                    partOfSpeech,
                    definition.trim()
                );
            }

            stmt.finalize(() => {
                console.log("Definizioni salvate:", data.defs.length);
                db.close();
            });
        }
    );
}

main();