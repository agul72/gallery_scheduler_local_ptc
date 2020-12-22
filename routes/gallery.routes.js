const {check, validationResult} = require("express-validator");
const {Router} = require('express');

const router = Router();

const service = require('../services/GalleryService');


router.get('/category/name/:name', [],
    (req, res) => {
        const name = req.params.name;
        const images = service.GalleryService.findByCategory(name);
        if (images && images.length) {
            res.send(images);
        } else {
            res.status(404).json({message: 'No category'})
        }
    });

router.get('/category/all', [], (
    (req, res) => {
        const categories = service.GalleryService.getCategories();

        if (categories && categories.length) {
            res.send(categories);
        } else {
            res.status(500).json({message: 'DB empty'})
        }
    }
));

module.exports = router;
