const express=require('express');
const router=express.Router();
const _=require('lodash');

const db=require('./utils/db');

router.get('/', (req, res)=>{
    res.render('index');
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
        const post=_.pick(p, ['_id', 'author', 'date', 'text']);
        const counts=_.countBy(p.votes, (v)=>{return v.with;});
        post.with=counts.true||0;
        post.against=counts.false||0;
        if (!auth){
            post.state=0;
        }
        else if (_.find(p.votes, ['voter', user])){
            post.state=2;
        }
        else {
            post.state=1;
        }
        posts.push(post);
    });
    res.status(200).json(posts);
});

router.post('/api/post', (req, res)=>{
    res.status(200).json({});
});

router.post('/api/vote', (req, res)=>{
    res.status(200).json({});
});

module.exports=router;
