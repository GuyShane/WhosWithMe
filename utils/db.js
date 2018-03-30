const mongoose=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;
const _=require('lodash');

const Post=require('../models/post');

function connect(){
    mongoose.Promise=global.Promise;
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.WHOS_WITH_ME_DB_URL);

        mongoose.connection.on('connected', ()=>{
            resolve();
        });

        mongoose.connection.on('error', (err)=>{
            reject(err);
        });
    });
}

async function savePost(author, text){
    const p=new Post({
        author: author,
        text: text
    });
    return await p.save();
}

async function vote(pid, voter, wth){
    const post=await Post.findOneById(new ObjectId(pid));
    if (!!_.find(post.votes, ['voter', voter])){
        return {};
    }
    post.votes.push({
        voter: voter,
        with: wth
    });
    return await post.save();
}

async function getPosts(){
    return await Post.find({}).sort({date: 'desc'});
}

module.exports={
    connect: connect,
    savePost: savePost,
    vote: vote,
    getPosts: getPosts
};
