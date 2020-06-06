const mongoose=require('mongoose');
const UserLikesSchema=new mongoose.Schema({
liked:{
type:Boolean
},
storyid:{
    type:String,
    default:''
},
userId:{
type:String,
default:""
},
views:{
type:Boolean,
},
date:{
    type:Date,
    default:Date.now()
}
});
module.exports=mongoose.model('UserLikes',UserLikesSchema);