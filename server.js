const express = require('express');
const config = require('config');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || config.get('port') || 5000;

async function start() {

    try {
        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}`);
        })
    } catch (e) {
        console.log('Server error: ', e.message);
        process.exit(1);
    }
}

start();


