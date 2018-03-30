const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Vote=require('./vote');

const postSchema=new Schema({
    author: {type: String, required: true},
    date: {type: Date, default: new Date()},
    text: {type: String, required: true},
    votes: [Vote]
});

const Post=mongoose.model('Post', postSchema);

module.exports=Post;
