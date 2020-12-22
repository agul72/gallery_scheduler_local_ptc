const {Router} = require('express');
const {check, validationResult} = require('express-validator');


const router = Router();

const service = require('../services/UserService');

router.get(
    '/all',
    [],
    async (req, res) => {
        console.log('router /api/user/all')
        const users = await service.UserService.getAllUsers();
        res.send(users);
    }
);

router.post('/add', [],
    async (req, res) => {
    const user = req.body;
    const newUser = await service.UserService.addUser(user);
    res.send(newUser);
});

router.post('/email/', [],
    async (req, res) => {
        const email = req.body.email;
        console.log(email)
        const user = await service.UserService.findByEmail(email);
        res.send(user);

    });

module.exports = router;
