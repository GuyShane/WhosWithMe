const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const voteSchema=new Schema({
    voter: {type: String, required: true},
    with: {type: Boolean, required: true}
});

module.exports=voteSchema;
