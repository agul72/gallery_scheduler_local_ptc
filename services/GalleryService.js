const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(__dirname);

function getDirectories(path) {
    return fs.readdirSync(path).filter((file) => {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function getFilesList(path) {
    return fs.readdirSync(path).filter((file) => {
        return fs.statSync(path + '/' + file).isFile();
    });
}

const categories = getDirectories(path.resolve(rootDir, 'client', 'public', 'images'));


exports.GalleryService = {

    getCategories: () => {
        return categories;
    },

    findByCategory: (category) => {
        const dirName = path.resolve(rootDir, 'client', 'public', 'images', category);
        const files = getFilesList(dirName);
        const pictures = files.map(file => 'images/' + category + '/' + file);
        return pictures;
    },


}
