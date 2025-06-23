const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve frontend files from /public

app.post('/generate-readme', (req, res) => {
  const inputPath = req.body.inputPath;
//   const pythonScript = '/Users/shubhamkumarsingh/PycharmProjects/ReadmeGenerator/generate_readme.py';
  const pythonScript = './generate_readme.py';

  const pyProc = spawn('python3', [pythonScript, inputPath]);

  let output = '';
  let errorOutput = '';

  pyProc.stdout.on('data', (data) => {
    output += data.toString();
  });

  pyProc.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pyProc.on('close', (code) => {
    if (code === 0) {
      res.json({ readme: output.trim() }); // trim trailing newlines/spaces
    } else {
      res.status(500).json({ error: 'Python script failed', details: errorOutput.trim() });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
