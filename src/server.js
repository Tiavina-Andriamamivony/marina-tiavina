const express = require('express');
const { execFile } = require('child_process');

const app = express();

app.get('/marina', (req, res) => {
    const laza = req.query.laza;
    if (!laza) {
        return res.status(400).json({ error: "Missing 'laza' parameter" });
    }

    execFile('./marina', [laza], (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr || error.message });
        }
        res.json({ result: stdout.trim() });
    });
});

app.listen(5000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5000');
});