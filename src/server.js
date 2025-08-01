const express = require('express');
const { execFile } = require('child_process');

const app = express();

app.get('/marina', (req, res) => {
    let laza = req.query.laza;

    if (!laza) {
        return res.status(400).json({ error: "Missing 'laza' parameter" });
    }

    laza = laza.trim();
    if ((laza.startsWith("'") && laza.endsWith("'")) || (laza.startsWith('"') && laza.endsWith('"'))) {
        laza = laza.slice(1, -1);
    }

    const open = (laza.match(/\(/g) || []).length;
    const close = (laza.match(/\)/g) || []).length;
    if (open !== close) {
        return res.status(400).json({ error: "Unbalanced parentheses in formula" });
    }

    execFile('./marina', [laza], (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr || error.message });
        }

        const result = stdout.trim();
        res.json({ result });
    });
});

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
