const mongoose= require('mongoose');
const userSessionSchema=new mongoose.Schema({
    userToken:{
        type:String,
        default:'',
    },
    userMail:{
        type:String,
        default:''
    },
    userId:{
        type:String,
        default:''
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model('UserSession',userSessionSchema);