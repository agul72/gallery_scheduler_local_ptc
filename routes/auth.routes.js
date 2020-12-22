const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const {check, validationResult} = require('express-validator');

const router = Router();

const service = require('../services/UserService').UserService;

function getUserJson(user) {

    const token = jwt.sign(
        {user: user.email},
        config.get('jwtSecret'),
        {expiresIn: '1d'}
    );
    return ({
        token,
        email: user.email,
    })
}

router.post(
    '/register',
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'Minimum 6 symbols').isLength({min: 6}),
        check('password', 'Please enter the password').exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data'
                })
            }

            const {email, password} = req.body;
            const candidate = await service.findByEmail(email);
            if (candidate) {
                return res.status(400).json({message: 'The same user already exists'})
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = ({
                email, password: hashedPassword
            });
            const newUser = await service.addUser(user);

            const token = jwt.sign(
                {user: newUser.email},
                config.get('jwtSecret'),
                {expiresIn: '1d'}
            );
            res.status(201).json(getUserJson(newUser));

        } catch (e) {
            console.log('auth.routes, register: ', e.message)
            res.status(500).json({message: e.message})
        }
    })

router.post(
    '/login',
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'Please enter the password').exists(),
        check('password', 'Password cann\'t be empty').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect login data'
                })
            }

            const {email, password} = req.body;
            const candidate = await service.findByEmail(email);
            if (!candidate) {
                return res.status(400).json({message: 'User not found'})
            }
            const isMatch = await bcrypt.compare(password, candidate.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'Wrong password'
                })
            }
            res.json(getUserJson(candidate));

        } catch (e) {
            console.log('auth.routes, login: ', e.message)
            res.status(500).json({message: e.message})
        }
    })

router.post('/token',
    [],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect token data'
                })
            }

            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                console.log(' Not token');
                return res.status(401).json({message: 'There are not authorization'});
            }
            req.user = jwt.verify(
                token,
                config.get('jwtSecret'),
                async function (err, verifiedJwt) {
                    if (err) {
                        console.log(err); // Token has expired, has been tampered with, etc
                    } else {
                        const user = service.findByEmail(verifiedJwt.email);
                        if (!user) {
                            return res.status(400).json({message: 'User not found'})
                        }
                        res.json(getUserJson(user));
                    }
                });

        } catch (e) {
            console.log('auth.routes error, token: ', e.message)
            res.status(500).json({message: e.message})
        }
    })

module.exports = router;
