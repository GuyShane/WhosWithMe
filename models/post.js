const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const Vote=require('./vote');

const postSchema=new Schema({
    author: {type: String, required: true},
    text: {type: String, required: true},
    votes: [Vote]
}, {
    timestamps: {
        createdAt: 'date',
        updatedAt: 'updated'
    }
});

const Post=mongoose.model('Post', postSchema);

module.exports=Post;
