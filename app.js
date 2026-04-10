const express = require('express');
const app = express();

app.use(express.json());

app.post('/grade', (req, res) => {
    const { marks } = req.body;

    if (!marks || !Array.isArray(marks)) {
        return res.status(400).json({ error: "Please provide marks as an array." });
    }

    const total = marks.reduce((a, b) => a + b, 0);
    const avg = total / marks.length;

    let grade;
    if (avg >= 90) grade = "A";
    else if (avg >= 75) grade = "B";
    else if (avg >= 50) grade = "C";
    else grade = "Fail";

    res.json({ total, avg, grade });
});

app.get('/', (req, res) => {
    res.send("Grade App v1 is running!");
});

app.listen(3000, () => console.log("Running on port 3000"));
