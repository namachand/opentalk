const mongoose =require('mongoose');
const commentSchema=new mongoose.Schema({
comment:{
    type:String,
    default:''
},
userId:{
    type:String,
    default:''
},
mail:{
    type:String,
    default:''
},
storyId:{
    type:String,
    default:''
},
date:{
    type:Date,
    default:Date.now()
}
})
module.exports=mongoose.model('Comment',commentSchema)