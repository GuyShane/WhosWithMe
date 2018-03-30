const express=require('express');
const router=express.Router();

router.get('/', (req, res)=>{
    res.render('index');
});

router.get('/api/posts', (req, res)=>{
    res.status(200).json({});
});

router.post('/api/post', (req, res)=>{
    res.status(200).json({});
});

router.post('/api/vote', (req, res)=>{
    res.status(200).json({});
});

module.exports=router;
