const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.static('dist/cv_2.0'));

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist/cv_2.0' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
