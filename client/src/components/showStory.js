import React from 'react';
import { getFromStorage } from './storage';
import axios from 'axios';
import '../css/showStory.css'
import {setInStorage} from '../components/storage'
import { Card, CardBody,Button, Container, CardFooter, Input} from 'reactstrap';
const userid=getFromStorage('id');
const email=getFromStorage('email');
class ShowStory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            title:'',
            story:'',
            id:'',
            likes:0,
            number:0,
            update:true,
            success:true,
            iscomment:true,
            comments:[]
        }
        this.clickLike=this.clickLike.bind(this);
        this.watchList=this.watchList.bind(this);
        this.fatalRemove=this.fatalRemove.bind(this);
        this.ShowStory=this.ShowStory.bind(this);
        this.showlikes=this.showlikes.bind(this);
        this.isSaved=this.isSaved.bind(this);
        this.inputComment=this.inputComment.bind(this);
        this.submitComment=this.submitComment.bind(this);
        this.showComments=this.showComments.bind(this);
    }
    componentDidMount(){
        var story=this.props.location.data;
        if(story!=undefined){
            setInStorage('viewstory',story);
        }
        console.log('inside mount');
        this.showlikes();
        this.isSaved();
        this.ShowStory();
        this.showComments();
    }
    componentDidUpdate(){
        console.log('inside update');
        this.ShowStory();
        this.showComments();
    }
    ShowStory(){
        const storyId=getFromStorage('viewstory');
        if(this.state.update==true){
            console.log('fetching');
            axios.get(`http://localhost:3231/users/showFullStory?id=${storyId}`)
            .then((data)=>{
                if(data.data.success==true){
                    this.setState({update:false})
                    this.setState({success:true})
                    this.setState({title:data.data.story[0].mytitle});
                    this.setState({story:data.data.story[0].mystory});
                    this.setState({id:data.data.story[0]._id});
                    this.setState({likes:data.data.story[0].likes});
                } 
            else{
                this.setState({success:false})
                this.setState({update:false})

            }      
            })
        }
       
    }

    //show comments
    showComments(){
        if(this.state.iscomment===true){
            const storyId=getFromStorage('viewstory');
            axios.get(`http://localhost:3231/users/showComments?storyid=${storyId}`)
            .then((result)=>{
                this.setState({comments:result.data.result});
                this.setState({iscomment:false});

            })
        }
    }

    //submitting comments
    submitComment(event){
        event.preventDefault();
        const storyId=getFromStorage('viewstory');
        var comment=document.getElementById('commentbox').value
        document.getElementById('commentbox').value=''
        axios.post('http://localhost:3231/users/postComment',{userid:userid,comment:comment,mail:email,storyId:storyId})
        .then((res)=>{
            if(res.data.success===true){
                this.setState({iscomment:true})
            }
            else{
                return(
                    <p>{res.data.err}</p>
                )
            }
        })
    }
    showlikes(){
        // const data=this.props.location.data;
        const storyId=getFromStorage('viewstory');

        // console.log(data)
        axios.get(`http://localhost:3231/users/lkedstry?id=${storyId}&userid=${userid}`)
        .then((res)=>{
            if(res.data.success===true){
                console.log('blue');
                document.getElementById('likeButton').style.color='blue'
            }
            else{
                console.log('black');
                document.getElementById('likeButton').style.color='black'
            }
        })
    }

    isSaved(){
        // const data=this.props.location.data;
        const storyId=getFromStorage('viewstory');

        // console.log(data)
        axios.get(`http://localhost:3231/users/savedWatchlist?id=${storyId}&userid=${userid}`)
        .then((res)=>{
            if(res.data.success===true){
                console.log('blue');
                document.getElementById('savedWatchlist').style.color='green'
                document.getElementById('savedWatchlist').innerHTML='saved'

            }
            else{
                console.log('black');
                document.getElementById('savedWatchlist').style.color='black'
                document.getElementById('savedWatchlist').innerHTML='save'

            }
        })
    }

    //comment input box
    inputComment(){
        if(document.getElementById('commentbox').value.length>0){
            document.getElementById('commentButton').style.display='block';
        }
        else{
            document.getElementById('commentButton').style.display='none';
       }
    }

//Like the story
    clickLike(event){ 
    event.preventDefault();
    console.log('click like');  
    var id=this.state.id 
    console.log(id);
    console.log(userid);
    var likes=parseInt(this.state.likes);
    axios.get(`http://localhost:3231/users/isLiked?id=${id}&userid=${userid}`)
    .then((res)=>{
        console.log(res.data.liked);
        if(res.data.liked==true){
            document.getElementById('likeButton').style.color='blue'
            console.log('liked');
            axios.post('http://localhost:3231/users/updateLikes',{id:id,likes:likes+1})
            .then((res)=>{
                console.log(res);
                this.setState({update:true}) 
            })
        }
        else{
            console.log('unliked');
            document.getElementById('likeButton').style.color='black'
            axios.post('http://localhost:3231/users/updateLikes',{id:id,likes:likes-1})
            .then((res)=>{
            console.log(res);
            this.setState({update:true}) 
        })
        }
    })
    }
//watchlist update and create
    watchList(event){
        event.preventDefault();
        var id=this.state.id 
        var title=this.state.title
        axios.post('http://localhost:3231/users/updateWatchlist',{id:id,userid:userid,title:title})
        .then((res)=>{
            if(res.data.success===true){
                document.getElementById('savedWatchlist').style.color='green'
                document.getElementById('savedWatchlist').innerHTML='saved'
            }
            else{
                document.getElementById('savedWatchlist').style.color='black'
                document.getElementById('savedWatchlist').innerHTML='save'
            }
        })
    }

fatalRemove(event){
    event.preventDefault();
    var id=this.props.location.data;
    axios.post('http://localhost:3231/users/updateWatchlist',{id:id,userid:userid})
    .then((res)=>{
        alert(res.data.message)
        this.props.history.push('/myProfile');      
    })
}

    render(){
  
        console.log(this.state.likes);
        if(this.state.success==true){
            return(
                <Container>
                <Card style={{
                minHeight:'30vh',
                marginTop:'5vh'
                }}>
                <CardBody>
                <p className='myTitle' >{this.state.title.toUpperCase()}</p>
                <p >{this.state.story}</p>
              
                </CardBody>
                <CardFooter>
                <div className='row'>
                    <div className='col-md-2 offset-3'>
                        <span className='fa fa-thumbs-up fa-lg like' id='likeButton' onClick={this.clickLike}><span style={{fontSize:'medium'}}> Like</span></span> 
                    </div>
                    <div className='col-md-2 offset-5'>
                        <span className='fa fa-check fa-lg' id='savedWatchlist' onClick={this.watchList}> <span style={{fontSize:'medium'}} id='textsavedWatchlist'> save</span></span>
                    </div>

                </div>
                    </CardFooter>
                </Card>
                <h1 style={{marginTop:'50px'}}>Post your comments</h1>
                <Input type='text' className='nooutline mt-3' placeholder="Type your comment here" id='commentbox' style={{borderRadius:'0px',borderTopStyle:'hidden',
                    borderLeftStyle:'hidden',borderRightStyle:'hidden',WebkitBoxShadow:'none',boxShadow:'none'
                    }} onKeyUp={this.inputComment}></Input>
                <Button id='commentButton' style={{marginTop:'4px',float:'right',display:'none'}} onClick={this.submitComment}>Comment</Button>
                <h3 style={{marginTop:'5vh'}}>{this.state.comments.length} Comments</h3>
                <div style={{marginTop:'5vh'}}>
                {this.state.comments.map((comment)=>{
                    return(
                        <div className="row" style={{marginTop:'3vh'}} key={comment._id}> 
                        <div className='col-md-1'>
                         {/* <Card style={{ width: '12rem',
                       height:'70px',
                       width:'70px',
                        backgroundSize:'cover',
                       display:'block',
                       borderRadius:'100px'
                    }}>
                        </Card> */}
{/* 
                    <img
                        id="img"
                        src='http://localhost:3231/users/getImage/${this.state.myDetails.image}'
                        style={{
                            width: '12rem',
                            height:'70px',
                            width:'70px',
                             backgroundSize:'cover',
                            display:'block',
                            border:'solid 1px grey',
                            borderRadius:'100px'
                        }}>
                    </img> */}
                    </div>
                    <div className='col-md-10'>
                        <span style={{'fontWeight':'bold',fontSize:'20px'}}>{comment.mail.split('@')[0]}</span>
                        <p style={{fontSize:'20px',marginTop:'2px'}}>{comment.comment}</p>
                        </div>
                        </div>
                     )
                })}
                </div>
                </Container>
        );
        }
        if(this.state.success==false){
            return(
            <div className='ml-3'>
                <h1>404 fatal error: data not found</h1>
                <p>Either the User has deleted the story or there must me network issue with the story</p>
                <p>you can remove the story by clicking on the button</p>
                <Button onClick={this.fatalRemove} >Remove</Button>
            </div>
            )     
        }       
    }
}
export default ShowStory;