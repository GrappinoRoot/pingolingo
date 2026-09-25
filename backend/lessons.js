const express = require("express");

const { get, all } = require("./database");

const router = express.Router();

router.get("/:lessonId", async (req, res) => {
    try {
        const lesson = await get(`
            SELECT
                l.id,
                l.title,
                l.position,
                u.id AS unit_id,
                u.title AS unit_title
            FROM lessons l
            JOIN units u
                ON u.id = l.unit_id
            WHERE l.id = ?
        `, [req.params.lessonId]);

        if (!lesson) {
            return res.status(404).json({
                error: "Lesson not found"
            });
        }

        const words = await all(`
            SELECT
                w.id,
                w.word,
                w.score,
                w.num_syllables,
                w.pronunciation
            FROM lesson_words lw
            JOIN words w
                ON w.id = lw.word_id
            WHERE lw.lesson_id = ?
            ORDER BY lw.position
        `, [req.params.lessonId]);

        const sentences = await all(`
            SELECT
                s.id,
                s.english_text,
                s.italian_text
            FROM lesson_sentences ls
            JOIN sentences s
                ON s.id = ls.sentence_id
            WHERE ls.lesson_id = ?
            ORDER BY ls.position
        `, [req.params.lessonId]);

        res.json({
            id: lesson.id,
            title: lesson.title,
            position: lesson.position,
            unit: {
                id: lesson.unit_id,
                title: lesson.unit_title
            },
            words,
            sentences
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

module.exports = router;