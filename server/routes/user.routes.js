const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();
var nodemailer = require("nodemailer");
const User=require('../modals/modal');
const UserSession=require('../modals/userSession');
const UserWatchlist=require('../modals/userWatchlist');
const UserStories=require('../modals/storiesModal');
const UserLikes=require('../modals/UserLikes')
const Comment=require('../modals/comments')
const jwt=require('jsonwebtoken');
process.env.TOKEN_KEY='axcgyukmlpjsfihasbao';
const paginate = require('jw-paginate');
const multer  = require('multer');
const GridFsStorage = require('multer-gridfs-storage'); 
const crypto=require('crypto');
// const Image=require('../modals/imageSchema');
const Grid = require("gridfs-stream");
const mongoURI="mongodb+srv://caman3874:qwertyuiopaman1234@@amanco-pexfz.mongodb.net/test?retryWrites=true&w=majority"

let gfs
const conn = mongoose.createConnection(mongoURI,{useNewUrlParser:true})
conn.once('open', () => {
//     console.log('connection',conn.db)
  gfs = Grid(conn.db, mongoose.mongo)
  gfs.collection('uploads')
//   console.log(gfs.db.collection('uploads.chunks'));
  console.log('Connection Successful')
})





//to get the details of the user
router.route('/myDetails').get((req,res)=>{
    User.findOne({_id:req.query.id})
    .then((result)=>{
    if(!result){
        console.log("user not found");
    }
    else{
        res.status(200).send({
            success:true,
            message:'users details',
            result:result
        })
    }
    });
    })


//for verifying the otp

router.route('/create').post((req,res,next)=>{
console.log("inserting to database");
const details={
name:req.body.name,
email:req.body.email,
password:req.body.password
}


User.findOne({ email: req.body.email}, function(err, user) {
    console.log('called me thanks');
    if(err) {
        return res.status(500).send({
            message:'server responded with internal error'
        });
    }
    if (user) {
        console.log(user);
        console.log("hey");
        res.send("Email already exists");
    } 
    else {
        var digits = '0123456789'; 
        var OTP = ''; 
        for (let i = 0; i < 6; i++ ) { 
            OTP += digits[Math.floor(Math.random() * 10)]; 
        } 
        console.log(OTP)
        var transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:'mystoriesfun@gmail.com',
                pass:'qwertyuiopaman1234@'
            }
        })
        mailOptions={
            from:'namaStoriesWorld',
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br>Your One Time Password is<br>"+OTP 
        }
        transporter.sendMail(mailOptions, function(err) {
            if(err){ 
                console.log('err');
                return res.status(500).send({ msg: err.message }); 
            }
            else{
                console.log('emailed');
                return res.status(200).send({
                    success:true,
                    otp:OTP,
                    details:details,
                    message:"OTP has been send to your email submit the otp to verify"
                });
            }
        })
            
    }
});
});
router.route('/otpVerified').post((req,res,next)=>{
console.log('for verifying');
// User.insertOne(req.body.details)
const datas=new User({
    name:req.body.details.name,
    email:req.body.details.email,
    password:req.body.details.password

})
datas.save()
.then(()=>{
    console.log("inserted");
   })
});
 
//users information is authenticated and creating user token
router.route('/signin').post((req,res,err)=>{
    console.log("i am here");
    console.log(req.body);
    console.log(req.body.email);
User.findOne({email:req.body.email})
.then((user)=>{
if(!user){
    return res.status(404).send({
        success:false,
        message:"The user with the email address doesn't exists",
    })
}
else if(user.password!=req.body.password){
       return res.status(204).send({
            success:false,
            message:"password doesn't match with the original password"
        })
}
else{
        console.log("logged in successfully");
        console.log(process.env.TOKEN_KEY);
        const token=jwt.sign({_id:user._id},process.env.TOKEN_KEY);
        const id=user._id
        const userSession=new UserSession({
        userToken:token,
        userMail:req.body.email,
        userId:id
});
userSession.save((err,doc)=>{
if(err){
    console.log(err);
}

return res.send({
success:true,
message:'valid sign in',
token:doc.userToken,
email:doc.userMail,
userId:doc.userId
});
});

}
})
.catch((err)=>{
if(err){
    res.status(500).send({
        success:false,
        message:"can't login due to some error"
    })
}
})
});

//verifying user when user enters into the site conforing as if users token hasn't expire
router.route('/verify').post((req,res,next)=>{
UserSession.findOne({userToken:req.body.token},(err,user)=>{
console.log(" i am fine here");
if(err){
    console.log(err);
}
if(!user){
    console.log("invalid token");
    return res.send({
        success:false,
        message:'not verified'
    }) 
}
else{
    console.log("here inside else");
    return res.status(200).send(JSON.stringify({
        success:true,
        message:'verified'
    }));     
}
});
});

//here user can create stories and can save the stories in the database
router.route('/createStories').post((req,res,next)=>{
const userStories=new UserStories({
    mytitle:req.body.storyTitleVal.toUpperCase(),
    mystory:req.body.storyTextVal,
    myemail:req.body.email,
    mycategory:req.body.storyCategoryVal.toUpperCase(),
    userId:req.body.id

});

userStories.save((err,doc)=>{
    if(err){
        console.log('i am inside error sec');
        console.log(err);
    }
    else{
        console.log('i am inside else');
        return res.status(200).send({
            success:true,
            message:"your story is posted"
        });
    }
});
});

//this is for search bar where user can search for a particular stories
router.route('/searchText').get((req,res,next)=>{
console.log(typeof(req.query.a));
let r=req.query.a
console.log(r);
let q={
    "mytitle":new RegExp('^'+r,'i')
}
console.log('query is',q);
if(r!=''){
    UserStories.find(q,'mytitle',(err,stories)=>{
        if(err){
            console.log(err);
        }
        
        if(stories.length==0){
        console.log('no results found');
        }
        
        else{
        console.log('results found');
        console.log(stories);
        return res.send({
         success:true,
         stories:stories
        });
        }
        })
        .limit(10)
}
else{
    return res.send({
        success:false
    });
}
})
//this is for paginatio n where 10 users are displayed per page
router.route('/storiepages').get((req,res,next)=>{
UserStories.find((err,collection)=>{
var page=parseInt(req.query.page)  || 1;
var pager=paginate(collection.length,page,2);
var allStories=collection.slice(pager.startIndex , pager.endIndex+1);
res.send({allStories,pager});
})
.sort({date:-1})
});

//this is for displaying the whole story in the next page
router.route('/showFullStory').get((req,res,next)=>{
    console.log('inside showFullStory');
    UserStories.find({_id:req.query.id},(err,story)=>{
            if(err){
                console.log(err);
            }
            if(!story){
                console.log('NO STORY');
                res.status(404).send({
                    success:false,
                })                
            }
            else{
                console.log('STORY');
                res.send({
                    success:true,
                    story:story
                });
            }
    })
})

//this is for the updadation of the likes.
router.route('/updateLikes').post((req,res,next)=>{
UserStories.findOneAndUpdate({_id:req.body.id,},{$set:{likes:req.body.likes}})
.then((updatedStory)=>{
if(!updatedStory){
    console.log("can't fetch the story as may be owner has removed that story");
}
else{
console.log("story is updated");
res.send('thanks for liking my story');
}
})
.catch((err)=>{
if(err){
    console.log(err);
}
})
})
//this is for updadation of views
router.route('/updateViews').post((req,res,next)=>{
    UserStories.findOneAndUpdate({_id:req.body.id},{$set:{views:req.body.views}},(err,updatedStory)=>{
    if(err){
        console.log(err);
    }
    if(!updatedStory){
        console.log("can't fetch the story as may be owner has removed that story");
    }
    else{
    console.log("story is updated");
    res.send('thanks for viewing my story');
    }
    })
})

//this is for the updation of watch list
router.route('/updateWatchlist').post((req,res,next)=>{
    UserWatchlist.findOneAndDelete({watchlistId:req.body.id,userId:req.body.userid},(err,watchlist)=>{
        if(err){
            console.log(err);
        }
        if(!watchlist){
            const userWatchlist=new UserWatchlist({
                watchlistId:req.body.id,
                userId:req.body.userid,
                watchlistTitle:req.body.title,
                watchlist:true
            })
            userWatchlist.save()
            .then(()=>{
               return res.send({
                success:true
            });
            })
        }
        else{
          return res.send({
            success:false            
        })
        }
    });
})
//updating user images
router.route('/updateUserImage').put((req,res)=>{
User.findOneAndUpdate({_id:req.body.id},{$set:{image:req.body.image}})
.then((result)=>{
if(!result){
    // res.status(404).send({
    //     success:false,
    //     message:"User not found"
    // })
    console.log('can"t upload user pic');
}
else{
    console.log('uploaded user pic');
    return res.send('uploaded pic')
}

})
})


//adding likes
router.route('/isLiked').get((req,res)=>{
    console.log(req.query);
UserLikes.findOneAndDelete({storyid:req.query.id,userId:req.query.userid},(err,likedStory)=>{
if(err){
    console.log(err);
}
if(!likedStory){
    console.log('i am isnide liked story');
    const userLikes=new UserLikes({
        liked:true,
        storyid:req.query.id,
        userId:req.query.userid,
    })
    userLikes.save()
    .then(()=>{
        return res.send({
            liked:true
        });
    })
 

}
else{
console.log('data is deleted');
return res.send({liked:false});
}
})
})
//this is for the loading of the most liked stories
router.route('/loadMostlikedStories').get((req,res,next)=>{
UserStories.find({likes:{$gt:0}},(err,result)=>{
    if(err){
        console.log(err);
    }
    if(!result){
        return res.send({
            title:"no stories are liked yet",
            message:"get your story among most liked lists"
        })
    }
    else{
       return res.send({
         result:result.slice(0,9)
       });
    }
}).sort({likes:-1});
})
//getting my stories
router.route('/myStories').get((req,res,next)=>{
UserStories.find({userId:req.query.id})
.sort({date:-1})
.then((mystory)=>{
if(!mystory){
    console.log('no stories posted');
}
else{
    // console.log(mystory);
    return res.send(mystory);
}
})
.catch((err)=>{
    if(err){
        res.status(500).send({
            success:false,
            message:"server error"
        })
    }
})

})

//getting my watchlist
router.route('/myWatchlist').get((req,res,next)=>{
    UserWatchlist.find({userId:req.query.id})
    .then((watchlist)=>{
        if(!watchlist){
            res.send('add items to watchlist');
        }
        else{
           return res.send(watchlist);
        }
    })
})

//getting name
router.route('/getName').get((req,res)=>{
    console.log("for get name",req.query.id)
User.findOne({_id:req.query.id})
.then((result)=>{
if(!result){
    console.log('no user');
}
else{
    res.status(200).send({
        result:result
    })
}
})
})

//get for the edit purpose
router.route('/getForEdit').get((req,res)=>{
UserStories.findOne({_id:req.query.id})
.then((result)=>{
if(!result){
    console.log('no results are found');
}
else{
    res.status(200).json({
        result:result
    });
}
})
})

//put for modifying the story
router.route('/editStory').put((req,res)=>{
UserStories.findOneAndUpdate({_id:req.query.id},{$set:{mystory:req.body.storyTextVal,mytitle:req.body.storyTitleVal.toUpperCase(),mycategory:req.body.storyCategoryVal.toUpperCase()}})
.then((result)=>{
if(!result){
    console.log("data not found")
}
else{
    res.status(200).send({
        success:true,
        message:"your data is updated"
    })
    }
})
})

//delete of the  data
router.route('/deleteData').get((req,res)=>{
    UserStories.findByIdAndDelete({_id:req.query.id})
    .then((result)=>{
    if(!result){
        console.log("data not found")
    }
    else{
        res.status(200).send({
            success:true,
            message:"your data is deleted"
        })
        }
    })
    })

//log out the user

router.route('/logOut').get((req,res)=>{
    console.log(req.query)
UserSession.deleteMany({userId:req.query.id},(err,result)=>{
    if(err){
        console.log(err);
    }
    if(!result){
    res.status(404).send({
        sucess:false,
        message:"user is not found"
    })
}
else{
    console.log('deleted')
    res.status(200).send({
        success:true
    })
}
})
})

//remove the user account
router.route('/remove').get((req,res)=>{
console.log('inside remove')
User.findOneAndDelete({_id:req.query.id})
.then((result)=>{
if(!result)
{
    console.log('in')
return res.status(404).send({
    success:false,
    message:"user not found in the database"
})
}
else{
//     console.log('in in')
//   return res.status(200).send({
//         success:true
//     })
UserSession.deleteMany({userId:req.query.id},()=>{
UserWatchlist.deleteMany({userId:req.query.id},()=>{
UserLikes.deleteMany({userId:req.query.id},()=>{
    UserStories.deleteMany({userId:req.query.id},()=>{
        return res.send({
            success:true
        })
})
})
})
})
}
})
.catch((err)=>{
if(err){
    res.status(500).send({
        success:false,
        message:"can't remove the account server not available "
    })
}
})
})

//is story liked or not
router.route('/lkedstry').get((req,res)=>{
    UserLikes.findOne({storyid:req.query.id,userId:req.query.userid})
    .then((result)=>{
        if(!result){
            console.log('not present');
            return res.send({
                success:false
            })
        }
        else{
            console.log('present');

            return res.send({
                success:true
            })
        }
    })
})
//is story saved to watchlish or not
router.route('/savedWatchlist').get((req,res)=>{
    UserWatchlist.findOne({watchlistId:req.query.id,userId:req.query.userid})
    .then((result)=>{
        if(!result){
            console.log('not present');
            return res.send({
                success:false
            })
        }
        else{
            console.log('present');
            return res.send({
                success:true
            })
        }
    })
})
//posting comments
router.route('/postComment').post((req,res)=>{
const commentDetails=new Comment({
    comment:req.body.comment,
    userId:req.body.userid,
    storyId:req.body.storyId,
    mail:req.body.mail
})
commentDetails.save()
.then(()=>{
    res.send({
        success:true
    })
})
.catch((err)=>{
    res.send(500).send({err:err})
})
})

//getting all the comments
router.route('/showComments').get((req,res)=>{
Comment.find({storyId:req.query.storyid},(err,result)=>{
    if(err){
        console.log(err);
    }
if(!result){
   return res.send({
        message:'no comments posted yet'
    })
}
else{
   return res.status(200).send({
        success:true,
        result:result
    })
}
})
.sort({date:1})
})

// for profile pic
const promise = mongoose.connect(mongoURI, { useNewUrlParser: true });
const storage = new GridFsStorage({
    db: promise,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err)
          }
          const filename = file.originalname
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads',
          }
          resolve(fileInfo)
        })
      })
    },
    options: {useUnifiedTopology: true}
  })
  const upload = multer({ storage })

router.route('/userprofilepic/:prevFile').put(upload.single('image'),(req,res,next)=>{
  console.log('saved image');
  console.log(req.params.prevFile)
  if(req.params.prevFile==='default-user-image.png'){
    return res.send('picture is added')
  }
  else{
    gfs.db.collection('uploads.files').findOneAndDelete({ filename:req.params.prevFile},(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result.value===null){
            console.log('no data found and new picture is added');
            return res.send('picture is added');
    
        }
        else{
            console.log('deleted old pic');
            gfs.db.collection('uploads.chunks').deleteMany({ files_id:result.value._id},(err,result)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log('deleted whole file',result);
                    return res.send('picture is added and previous one is deleted');
                }
            })
        }
    })
  }

})


// get the image
router.route('/getImage/:filename').get((req, res) => {
    console.log('inside fetching image');

    gfs.files.findOne({ filename: req.params.filename }, (err,file) => {
      // Check if file
      if(err){
          console.log(err);
      }
      if (!file || file.length === 0) {
        // return res.status(404).json({
        //   err: 'No file exists',
        // })
        console.log('no image found');
      }
  
      // Check if image
      else if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        console.log(file);
        const readstream = gfs.createReadStream(file.filename)
        readstream.pipe(res)
        // console.log('your image',readstream)
      } 
      else {
       return res.status(404).json({
          err: 'Not an image',
        })
      }
    })
  })

//   router.route('/deletePic').post((req,res)=>{
//       console.log(req.body.image)
//       let a="trader.png"
//     //   var b=new mongoose.mongo.ObjectId(a);

//     // console.log(gfs.db.collection('uploads.chunks'))
//     // gfs.db.collection('uploads').findOne({_id:b},(err,result)=>{
//     //     if(err){
//     //         console.log(err);
//     //     }
//     //       if(!result){
//     //           console.log('can"t find the id');
//     //       }
//     //       else{
//     //           console.log('found the data',result);
//     //       }
//     // })
//       gfs.db.collection('uploads.files').findOneAndDelete({ filename:a},(err,result)=>{
//         if(err){
//             console.log(err);
//         }
//         if(!result){
//             console.log('no data found');
//         }
//         else{
//             console.log('deleted',result);
//             gfs.db.collection('uploads.chunks').deleteMany({ files_id:result.value._id},(err,result)=>{
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     console.log('deleted whole file',result);
//                 }
//             })
//         }
//     })
//   })
module.exports=router;