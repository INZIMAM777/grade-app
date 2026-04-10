const express = require('express');
const app = express();

const path = require('path');

app.use(express.json());
app.use(express.static('public'));

app.post('/grade', (req, res) => {
    try {
        const { marks } = req.body;

        if (!marks || !Array.isArray(marks) || marks.length === 0) {
            return res.status(400).json({ 
                error: "Invalid input", 
                message: "Please provide an array of marks." 
            });
        }

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
        if (avg >= 95) grade = "A+";
        else if (avg >= 90) grade = "A";
        else if (avg >= 85) grade = "B+";
        else if (avg >= 80) grade = "B";
        else if (avg >= 75) grade = "C+";
        else if (avg >= 70) grade = "C";
        else if (avg >= 60) grade = "D";
        else if (avg >= 50) grade = "E";
        else grade = "Fail";

        res.json({ 
            version: "v3",
            status: "Success",
            data: { 
                total, 
                avg: avg.toFixed(2), 
                grade,
                count: marks.length
            } 
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error", message: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log("Running on port 3000"));
