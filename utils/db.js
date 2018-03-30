const mongoose=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;

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

async function getPosts(){
    return await Post.find({}).sort({date: 'desc'});
}

module.exports={
    connect: connect,
    getPosts: getPosts
};
