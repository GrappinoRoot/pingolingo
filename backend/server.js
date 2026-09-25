const express = require("express");
const lessonsRouter = require("./lessons");
const { generateSession } = require("./session-generator");

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));
app.use("/api/lessons", lessonsRouter);

app.get("/api/lessons/:lessonId/session", async (req, res) => {
    try {
        const exercises = await generateSession(req.params.lessonId);

        res.json(exercises);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});