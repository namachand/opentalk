const mongoose=require('mongoose');
const UserWatchlistSchema= new mongoose.Schema({
watchlistId:{
    type:String,
    required:true
},
watchlistTitle:{
    type:String,
    required:true
},
userId:{
    type:String,
    default:""
},
watchlist:{
    type:Boolean,
    default:false
},
date:{
    type:Date,
    default:Date.now()
}
});
module.exports=mongoose.model('UserWatchlist',UserWatchlistSchema);