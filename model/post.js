const mongoose = require('mongoose')
const MSchema = mongoose.Schema;

const postSchema = new MSchema({
    post: String,
    userId: String
})
module.exports = mongoose.model('Post', postSchema);