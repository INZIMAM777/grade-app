const express = require('express');
const app = express();

app.use(express.json());

app.post('/grade', (req, res) => {
    try {
        const { marks } = req.body;

        if (!marks || !Array.isArray(marks) || marks.length === 0) {
            return res.status(400).json({ 
                error: "Invalid input", 
                message: "Please provide an array of marks." 
            });
        }

        // Validate that all marks are numbers and within range 0-100
        for (let mark of marks) {
            if (typeof mark !== 'number' || mark < 0 || mark > 100) {
                return res.status(400).json({ 
                    error: "Invalid marks", 
                    message: "Each mark must be a number between 0 and 100." 
                });
            }
        }

        const total = marks.reduce((a, b) => a + b, 0);
        const avg = total / marks.length;

        let grade;
        if (avg >= 90) grade = "A";
        else if (avg >= 75) grade = "B";
        else if (avg >= 50) grade = "C";
        else grade = "Fail";

        res.json({ 
            version: "v2",
            status: "Success",
            data: { total, avg: avg.toFixed(2), grade } 
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error", message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send("Grade App v2 is running with enhanced validation!");
});

app.listen(3000, () => console.log("Running on port 3000"));
