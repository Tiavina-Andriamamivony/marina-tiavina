const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.get('/marina', (req, res) => {
    const laza = req.query.laza;
    
    if (!laza) {
        return res.status(400).json({ error: "Missing 'laza' parameter" });
    }

    const marinaProcess = spawn('./marina', [laza]);
    
    let result = '';
    let errorOutput = '';

    marinaProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    marinaProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    marinaProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: errorOutput.trim() });
        }
        res.json({ result: result.trim() });
    });

    marinaProcess.on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});