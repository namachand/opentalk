const mongoose= require('mongoose');
const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        index:true, unique:true,sparse:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:'default-user-image.png'
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model('User',schema);