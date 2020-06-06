const mongoose= require('mongoose');
const imageSchema=new mongoose.Schema({
    name:{
        type:String,
        defaut:'',
    },
   userId:{
    type:String,
    default:'', 
   },
    date:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model('Image',imageSchema);