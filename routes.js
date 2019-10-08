const express=require('express');
const router=express.Router();
const _=require('lodash');

const db=require('./utils/db');

router.get('/', (req, res)=>{
    const ctx={
        title: 'Who\'s with me?',
        authenticated: res.locals.authenticated
    };
    res.render('index', ctx);
});

router.get('/account', async (req, res)=>{
    if (!res.locals.authenticated){
        res.redirect('/login');
        return;
    }
    const user=res.locals.decoded.user.email.replace(/@.*/, '');
    const posts=[];
    (await db.getPosts({user})).forEach((p)=>{
        posts.push(formatPost(p));
    });
    const ctx={
        title: 'This is you',
        username: user,
        totals: await db.getTotals(user),
        posts: posts
    };
    res.render('account', ctx);
});

router.get('/login', (req, res)=>{
    if (res.locals.authenticated){
        res.redirect('account');
        return;
    }
    const ctx={
        title: 'Who are you?'
    };
    res.render('login', ctx);
});

router.get('/about', (req, res)=>{
    const ctx={
        title: 'What\'s it all about'
    };
    res.render('about', ctx);
});

router.get('/api/posts', async (req, res)=>{
    const page=req.query.page||0;
    const posts=[];
    (await db.getPosts({page: page})).forEach((p)=>{
        posts.push(formatPost(p));
    });
    res.status(200).json(posts);
});

router.post('/api/post', async (req, res)=>{
    if (!res.locals.authenticated){
        res.status(401).json({});
        return;
    }
    if (req.body.text===''){
        res.status(401).json({});
        return;
    }
    const user=res.locals.decoded.user.email.replace(/@.*/, '');
    const newPost=await db.savePost(user, req.body.text);
    res.status(200).json(formatPost(newPost));
});

router.post('/api/vote', async (req, res)=>{
    if (!res.locals.authenticated){
        res.status(401).json({});
        return;
    }
    const user=res.locals.decoded.user.email.replace(/@.*/, '');
    const newPost=await db.vote(req.body.id, user, req.body.with);
    res.status(200).json(formatPost(newPost));
});

function formatPost(post){
    const formatted=_.pick(post, ['_id', 'author', 'date', 'text']);
    const counts=_.countBy(post.votes, (v)=>{return v.with;});
    formatted.with=counts.true||0;
    formatted.against=counts.false||0;
    if (formatted.with===0 && formatted.against===0) {
        formatted.percent=0;
    }
    else {
        let percent=(formatted.with/(formatted.with+formatted.against))*100;
        formatted.percent=round(percent, 2);
    }
    return formatted;
}

function round(num, digits){
    return parseFloat(num.toFixed(digits));
}

module.exports=router;
