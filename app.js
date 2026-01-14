const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<h1>Server is Running!</h1>');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});