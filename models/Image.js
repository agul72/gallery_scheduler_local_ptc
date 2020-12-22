const {Schema, model} = require('mongoose');

const schema = new Schema({
    category: {type: String, required: true},
    link: [{type: String, required: true}],
})

module.exports = model('Image', schema);
