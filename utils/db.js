const mongoose=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;
const _=require('lodash');

const Post=require('../models/post');

function connect(){
    mongoose.Promise=global.Promise;
    return new Promise((resolve, reject)=>{
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            user: process.env.MONGO_INITDB_ROOT_USERNAME,
            pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
            dbName: 'whoswithme',
            reconnectTries: 5,
            reconnectInterval: 1000
        }, err=>{
            reject(err);
        });
        mongoose.connection.on('connected', resolve);
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
    const post=await Post.findById(new ObjectId(pid));
    if (!!_.find(post.votes, ['voter', voter])){
        return post;
    }
    post.votes.push({
        voter: voter,
        with: wth
    });
    return await post.save();
}

async function getPosts(opts){
    if (!_.isUndefined(opts.page)){
        return await Post.find({}).sort({date: 'desc'}).skip(50*opts.page).limit(50);
    }
    else {
        return await Post.find({}).where('author', opts.user).sort({date: 'desc'});
    }
}

async function getTotals(user){
    const totals={};
    const data=await Post.aggregate([
        {$match: {author: user}},
        {$unwind: '$votes'},
        {$group: {_id: '$votes.with', count: {$sum: 1}}}
    ]);
    const withs=_.find(data, ['_id', true]);
    const againsts=_.find(data, ['_id', false]);
    totals.with=withs?withs.count:0;
    totals.against=againsts?againsts.count:0;
    return totals;
}

module.exports={
    connect: connect,
    savePost: savePost,
    vote: vote,
    getPosts: getPosts,
    getTotals: getTotals
};
