const express=require('express');
const router=express.Router();
const _=require('lodash');

const db=require('./utils/db');

router.get('/', (req, res)=>{
    const ctx={
        authenticated: res.locals.authenticated
    };
    res.render('index', ctx);
});

router.get('/api/posts', async (req, res)=>{
    let user;
    const auth=res.locals.authenticated;
    const page=req.query.page||0;
    if (auth){
        user=res.locals.decoded.user.username;
    }
    const posts=[];
    (await db.getPosts({page: page})).forEach((p)=>{
        posts.push(formatPost(p, user, auth));
    });
    res.status(200).json(posts);
});

router.post('/api/post', async (req, res)=>{
    if (!res.locals.authenticated){
        res.status(401).json({});
        return;
    }
    const user=res.locals.decoded.user.username;
    const newPost=await db.savePost(user, req.body.text);
    res.status(200).json(formatPost(newPost, user, true));
});

router.post('/api/vote', async (req, res)=>{
    if (!res.locals.authenticated){
        res.status(401).json({});
        return;
    }
    const user=res.locals.decoded.user.username;
    const newPost=await db.vote(req.body.id, user, req.body.with);
    res.status(200).json(formatPost(newPost, user, true));
});

function formatPost(post, user, auth){
    const formatted=_.pick(post, ['_id', 'author', 'date', 'text']);
    const counts=_.countBy(post.votes, (v)=>{return v.with;});
    formatted.with=counts.true||0;
    formatted.against=counts.false||0;
    if (!auth){
        post.state=0;
    }
    else if (_.find(post.votes, ['voter', user])){
        post.state=2;
    }
    else {
        post.state=1;
    }
    return formatted;
}

module.exports=router;
