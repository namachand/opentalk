import React from 'react';
import Header from '../components/header'
import {Card, CardBody, CardText,Button} from 'reactstrap'
import {Link} from 'react-router-dom' 
import '../css/showProfile.css'
import { getFromStorage, setInStorage } from './storage';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
const id=getFromStorage('id');
const email=getFromStorage('email');
class ShowProfile extends React.Component{
    constructor(props){
        super(props)
        this.state={
            myDetails:[],
            myStories:[],
            myWatchlists:[],
            showLogout:false,
            showRemove:false,
        }
        this.logout=this.logout.bind(this);
        this.handleClose=this.handleClose.bind(this);
        this.handleOpen=this.handleOpen.bind(this);
        this.remove=this.remove.bind(this);
        this.submitFile=this.submitFile.bind(this);
        this.fileChange=this.fileChange.bind(this);
    }
    componentDidMount(){
        document.getElementById('uploadPicButton').setAttribute('disabled',true);
        console.log('inside show profile');
        axios.get(`http://localhost:3231/users/myStories?id=${id}`)
        .then((res)=>{
            // console.log(res);
            this.setState({myStories:res.data});
        })

        axios.get(`http://localhost:3231/users/myWatchlist?id=${id}`)
        .then((res)=>{
            this.setState({myWatchlists:res.data});
        })

        axios.get(`http://localhost:3231/users/myDetails?id=${id}`)
        .then((res)=>{
            console.log("this is the details of the user");
            this.setState({myDetails:res.data.result});
        })

    }
    componentDidUpdate(){
        console.log('mydetails are',this.state.myDetails)
        document.getElementById('img').setAttribute('src', `http://localhost:3231/users/getImage/${this.state.myDetails.image}`)

    }
    handleOpen(event){
        event.preventDefault();
        if(event.target.id==="logout"){
            this.setState({showLogout:true})
        }
        if(event.target.id==="remove"){
            this.setState({showRemove:true})

        }
    }

    fileChange(event){
        event.preventDefault();
        document.getElementById('uploadPicButton').removeAttribute('disabled',true);

    }

    handleClose(event){
        // event.preventDefault();
        this.setState({showLogout:false})
        this.setState({showRemove:false})

    }

    remove(){
        console.log('inside remove')
        axios.get(`http://localhost:3231/users/remove?id=${id}`)
        .then((res)=>{
            console.log(res)

                    if(res.data.success===true){
                        localStorage.removeItem('email');
                        localStorage.removeItem('token');
                        localStorage.removeItem('id');
                        localStorage.removeItem('viewstory');
                        localStorage.removeItem('editstory');
                        this.props.history.push('/signin');
                    }
              
        //    else{
        //        alert(res.data.message)
        //    }
        })
       
    }

    logout(){
        axios.get(`http://localhost:3231/users/logOut?id=${id}`)
        .then((res)=>{
            if(res.data.success===true){
                localStorage.removeItem('email');
                localStorage.removeItem('token');
                localStorage.removeItem('id');
                localStorage.removeItem('viewstory');
                localStorage.removeItem('editstory');
                this.props.history.push('/signin');
            }
        })
    }

    submitFile(e){
        e.preventDefault();
        const imageName=this.state.myDetails.image;
        const file = document.getElementById('inputGroupFile01').files
        const formData = new FormData()
        formData.append('image', file[0])
        axios.put(`http://localhost:3231/users/userprofilepic/${imageName}`, formData)
        .then((res) => {
            console.log(res.data)
            // document.getElementById('img').setAttribute('src', `http://localhost:3231/users/getImage/${file[0].name}`)
            axios.put("http://localhost:3231/users/updateUserImage",{image:file[0].name,id:id})
            .then(()=>{
                // document.getElementById('inputGroupFile01').value=''
                window.location.href='/myProfile'
            })
    })
    }
    render(){  
        return(
            <React.Fragment>
                <div>
                    <Header/>
                    <div className='row' style={{
                      marginTop:'10vh'
                    }} >
                    <Modal show={this.state.showLogout} onHide={this.handleClose}>
                        <Modal.Body >Are you sure you want to logout?</Modal.Body>
                        <Modal.Footer>
                        <Button className='bg-danger' onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button className='bg-primary' onClick={this.logout}>
                           Log Out
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showRemove} onHide={this.handleClose}>
                        <Modal.Body >Are you sure you want to Permanently remove this account?</Modal.Body>
                        <Modal.Footer>
                        <Button className='bg-danger' onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button className='bg-primary' onClick={this.remove}>
                           Remove
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className='col-md-5' style={{
                   marginLeft:'30px',   
                    }}>
                    <img
                        id="img"
                        style={{
                        display: "block",
                        height:'200px',
                        width:'200px'
                        }}>
                    </img>
                        <input type='file' id="inputGroupFile01" onChange={this.fileChange} style={{ marginTop:'3px'}}/><Button id='uploadPicButton' style={{marginRight:'10px'}} onClick={this.submitFile}>upload profile</Button>
                        <p className='mt-3 ml-4 profileText'>{this.state.myDetails.name}</p>
                        <p className='profileTt ml-4 '><span>{this.state.myStories.length} Stories Posted</span><span></span></p>
                        <p className='profileTt mt-1 ml-4'>joined at {this.state.myDetails.date}</p>
                        <p className='mt-1 ml-4 profileTt'>{email}</p>

                    </div>
                    <div className='col-md-2 offset-4'
                    style={{
                        height:'20vh'
                    }}>
                        <span className='mt-2 offset-2 logout fa fa-sign-out fa-lg ' id="logout" onClick={this.handleOpen}><span className='ml-3'>user logout</span></span>
                        <span className='mt-3 offset-2 logout fa fa-trash fa-lg' id="remove" onClick={this.handleOpen}><span className='ml-3'>remove account</span></span>
                        </div>
                    </div>
                  
                        <div className='col-md-7 ml-3'>
                            <hr></hr>
                      </div>
                        
                    <div className='row ' >
                        <div className='col-md-8' style={{
                   marginLeft:'30px',   
                    }}>
                            <p className='mt-3 ml-2 profileTt'>Stories Posted</p>
                            {this.state.myStories.map((myStory)=>{
                                return(
                                <Card
                                style={{
                                    height:'8vh',
                                    width:'50vw'    
                                }} className='mt-2' key={myStory._id}>
                                    <CardBody>
                                        <div className='row' style={{display:'flex'}}>
                                             <CardText className='pl-2 ml-1' style={{fontSize:'12px'}} >{myStory.mytitle}</CardText> 
                                            </div>
                                        <div className='row'>  
                                            <div className='col-md-4'>
                                                    <Link to={{pathname:'editstory',data:myStory._id}} style={{fontSize:'13px',paddingBottom:'2px',textDecoration:'none'}}>Edit</Link>
                                                </div>
                                            <div className='col-md-6 offset-2'>        
                                                 <p className='dateOfMyStory mb-5'>Last updated at {myStory.date.slice(0,10)}</p> 
                                                </div>
                                            </div>
                                            </CardBody>
                                    </Card>
                                
                                    )
                            })}
                            </div>

                            <div className='col-md-3 profileTt'>
                                <p  className='mt-3 '>Watchlists</p>
                                {
                                    this.state.myWatchlists.map((watchlist)=>{
                                        return(
                                            <p key={watchlist.watchlistId} style={{
                                                fontSize:'small'
                                            }}>
                                                <Link to={{pathname:'showStory',data:watchlist.watchlistId}}>{watchlist.watchlistTitle}</Link> 
                                            </p>)
                                    })
                                }
                                </div>
                        </div>
                </div>
               
            </React.Fragment>        
        )
    }
}
export default ShowProfile;