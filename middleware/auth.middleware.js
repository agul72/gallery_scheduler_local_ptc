const jwt = require("jsonwebtoken");
const config = require('config');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            console.log(' Not token');
            return res.status(401).json({ message: 'There are not authorization'});
        }

        req.user = jwt.verify(token, config.get('jwtad Secret'));
        next();

    } catch (e) {
        console.error('Error:', e.message);
        res.status(401).json({ message: 'There are not authorization'});
    }
}
