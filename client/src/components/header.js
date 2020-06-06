import React from "react";
import {Navbar,Nav,NavbarToggler,Collapse,NavItem,NavbarBrand} from "reactstrap"
import {NavLink, Redirect, withRouter} from 'react-router-dom'
import axios from 'axios';
import { getFromStorage } from "./storage";
import {Link } from 'react-router-dom'
const id=getFromStorage('id');
class Header  extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isOpen:false, 
            token:true,
            headerName:'',
            searchedStories:[]
        }
        this.searchItem=this.searchItem.bind(this);
        this.toggle=this.toggle.bind(this);
    }
    componentDidMount(){ 
        //for verifying the token in header
        const token=getFromStorage('token');
        axios.post('http://localhost:3231/users/verify',{token:token})        
        .then((res)=>{
            console.log(res.data);
            if(res.data.success){
                this.setState({token:true});
            }
            else{
                this.setState({token:false})
            }
            console.log(this.state.token);
        })

        axios.get(`http://localhost:3231/users/getName?id=${id}`)
        .then((res)=>{
                this.setState({headerName:res.data.result.name});
        });
    }

    searchItem(event){
        event.preventDefault();
        var searchValue=document.getElementById('search').value;
        console.log('here',searchValue.length);
            axios.get(`http://localhost:3231/users/searchText?a=${searchValue}`)
            .then((res)=>{
                console.log(res.data);
                if(res.data.success==true){
                    this.setState({searchedStories:res.data.stories})
                }
                else{
                    this.setState({searchedStories:[]})
                }
            })
        
      
        
    }
    

    toggle(){
        this.setState({isOpen:true});
    }
    render(){
        if(this.state.token===false){
            alert('please authenticate yourself');
            var url='/signin';
            return(<Redirect to={url}/>);
    }
    else{
        return(
        <React.Fragment>
        <div >
            <Navbar dark expand='md' fixed='top' style={{
                backgroundColor:"grey",
                height:50,   
            }}>
            <NavbarToggler  onClick={this.toggle}/>
            <NavbarBrand className="mr-auto">Aman</NavbarBrand>
            <Nav navbar>
            <NavItem className="col-sm-6 offset-1" 
            style={{
                // minHeight:'50vh',
                top:'.5vh',
                left:'2px',
                position:'fixed'
            }}>
            <form className="m-1">
                <input type="text" placeholder="   search stories here eg.The old mermaid"  name='term' id='search' onChange={this.searchItem} style={{
                    width:"70vw",
                    minHeight:'4vh'
                }} />
            </form>  
            <div style={{
                    backgroundColor:'grey',
                    width:'60vw',
                    marginBottom:'10px',
                    marginLeft:'5px'
                }}>
                    {
                        this.state.searchedStories.map((searchStory)=>{
                            return(
                                <div style={
                                    {
                                        color:'white',
                                    }
                                } key={searchStory._id}>
                               <p  className='fa fa-search ml-2 mt-2' > <Link to={{pathname:'showStory',data:searchStory._id}} style={{
                                   color:'white'
                               }}> {searchStory.mytitle}</Link></p>
                                </div>
                            )
                        })
                    }
                </div>
            </NavItem>
            </Nav>
            <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
            <NavItem>
                <NavLink className="nav-link" to="/"><span className="fa fa-home fa-lg m-1" style={{fontSize:'20px'}}> home</span></NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="nav-link" to="/create"><span className="fa fa-plus fa-lg m-1" style={{fontSize:'20px'}}> create</span></NavLink>
            </NavItem>
            <NavItem>
                <NavLink className="nav-link" to="/myProfile"><span className="fa fa-user fa-lg m-1" style={{fontSize:'20px'}}> {this.state.headerName}</span></NavLink>
            </NavItem>
            </Nav>
            </Collapse>

            </Navbar>
            
        </div>

        </React.Fragment>
    );         
    }
    
    }
}
export default Header;