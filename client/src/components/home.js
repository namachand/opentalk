import React from "react";
import axios from 'axios';
import Header from '../components/header'
import {Link} from 'react-router-dom'
import '../css/home.css'
// import clickViews from './clickViews';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Card, CardBody,Table} from 'reactstrap';
class Home  extends React.Component{
    constructor(props){
        super(props)
        this.state={
            read:'read full story',
            pager:{},
            allStories:[],
            likedMostStories:[]
        }
        this.clickViews=this.clickViews.bind(this);
    }
    componentDidMount(){
       

        this.loadStories();  
        this.loadMostLikedStories();
    }

    componentDidUpdate(){
        this.loadStories();
        // this.loadMostLikedStories();
    }
    
    loadMostLikedStories(){
        axios.get('http://localhost:3231/users/loadMostlikedStories')
        .then((res)=>{
            console.log(res.data.result);
            this.setState({likedMostStories:res.data.result});
        })
    }

    loadStories(){
        const param=new URLSearchParams(this.props.location.search);
        const page=parseInt(param.get('page')) || 1;
        if(page !== this.state.pager.currentPage){
            axios.get(`http://localhost:3231/users/storiePages?page=${page}`)
            .then((data)=>{
                console.log(data.data.allStories);
                console.log(data.data.pager);
                this.setState({pager:data.data.pager});
                this.setState({allStories:data.data.allStories});
        })
        }
    }

    clickViews(event){
        var id=event.target.id;
        var views=parseInt(event.target.name)
        var addView=views+1;
        console.log(addView);
       axios.post('http://localhost:3231/users/updateViews',{id:id,views:addView})
       .then((res)=>{
           console.log(res);
       });
    }
    render(){   
        console.log(this.state.allStories);
        console.log(this.state.likedMostStories);
    return(
       
        <React.Fragment>
        <div>
        <Header/>
        </div>
    <div className='row mt-5 ml-5'>
    <div className='col-md-3 mt-3'>
     <ListGroup>
      <ListGroupItem style={{fontSize:'12px',height:'5vh'}}>Most liked stories</ListGroupItem>
      {this.state.likedMostStories.map((likedMostStory)=>{
        return(
            <ListGroupItem style={{fontSize:'12px',height:'5vh'}} className='likedStory' key={likedMostStory._id}><span className='fa fa-book'> <Link to={{pathname:'showStory',data:likedMostStory._id}} style={{textDecoration:'none',marginLeft:'3px'}} id={likedMostStory._id} name={likedMostStory.views} onClick={this.clickViews}>  {likedMostStory.mytitle}</Link></span>
            </ListGroupItem>

        )
    
        })}   
    </ListGroup>    

        </div>
        <div className='col-md-6'>
            {this.state.allStories.map((story)=>{
            return(
            <div className='col-md-12' key={story._id}>
            <div className='row mt-3 mb-3 storyCard' >
            <Card style={{
            maxHeight:'25vh',
            maxWidth:'45vw'   
            }}>
            <CardBody>
            <div className='row'>
                <div className='col-md-9'>
                 <p className='myTitle'style={{fontSize:'small'}}>{story.mytitle}</p>
                 </div>
                 <div className='col-md-3'>
                    <p style={{fontSize:'small'}}>-{story.myemail.split('@')[0]}</p>
                    </div>              
                </div>
                     <p className='myStory' style={{fontSize:'small'}}>{story.mystory}</p>
                <div className='row'> 
                <div className='col-md-3'> 
                    <Link to={{pathname:'/showStory',data:story._id}} id={story._id} name={story.views} onClick={this.clickViews} >{this.state.read}</Link>
                </div>
                <div className='col-md-3 offset-3'>
               <span style={{fontSize:'small'}}>{story.likes} Likes</span>
                </div>
                <div className='col-md-3'>
                <span style={{fontSize:'small'}}>{story.views} views</span>
                </div>
                </div>
            </CardBody>
            </Card>
            </div>
            </div>
        )
        })}    
        </div> 
        <div className='col-md-3'>     
        </div>
    </div>
    <div className="pb-0 pt-3 pageList">
        {this.state.pager.pages && this.state.pager.pages.length &&
        <ul className="pagination">
            {this.state.pager.pages.map(page =>
                <li key={page} className={`page-item number-item ${this.state.pager.currentPage === page ? 'active' : ''}`}>
                    <Link to={{ search: `?page=${page}` }} className="page-link">{page}</Link>
                </li>
            )}
        </ul>
        }                    
    </div>  
        </React.Fragment>
    );         
    } 
}

export default Home;
