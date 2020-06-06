import React from 'react';
import {Form,Button,Input, FormGroup, Container} from 'reactstrap'
import Header from '../components/header';
import axios from 'axios';
import {setInStorage} from '../components/storage'
import { getFromStorage } from './storage';

import '../css/createStory.css'
class EditStory extends React.Component{
    constructor(props){
        super(props);
        this.state={
            category:true,
            title:true,
            story:true,
            update:true
        }
       
        this.editStory=this.editStory.bind(this);
        this.deleteStory=this.deleteStory.bind(this);
        this.storyCategory=this.storyCategory.bind(this);
    }

  componentDidMount(){
    var id=this.props.location.data
    if(id!=undefined){
        setInStorage('editstory',id);
    }
     this.getEditedStory()
  }

  componentDidUpdate(){
    this.getEditedStory()
  }

  getEditedStory(){
    // console.log(this.props.location.data);
    // var id=this.props.location.data
    const storyId=getFromStorage('editstory');

    if(this.state.update==true){
        axios.get(`http://localhost:3231/users/getForEdit?id=${storyId}`)
        .then((res)=>{
            console.log(res.data.result)
          document.getElementById('storieCategory').value=res.data.result.mycategory;
          document.getElementById('storieText').value=res.data.result.mystory;
          document.getElementById('storieTitle').value=res.data.result.mytitle;
          this.setState({update:false});
        })
    }
  }

    editStory(event){
        event.preventDefault();
        if(this.state.category==true && this.state.story==true && this.state.title==true){
            var storyCategory=document.getElementById('storieCategory');
            var storyText=document.getElementById('storieText');
            var storyTitle=document.getElementById('storieTitle');
            var storyTextVal=storyText.value;
            var storyTitleVal=storyTitle.value;
            var storyCategoryVal=storyCategory.value;

        
            axios.put(`http://localhost:3231/users/editStory?id=${this.props.location.data}`,{storyTextVal:storyTextVal, storyTitleVal:storyTitleVal,storyCategoryVal:storyCategoryVal}) 
            .then((response)=>{
                console.log(response);
                this.setState({update:true});
            });
        }
        else{
            alert('Enter the required fields');
        }
     
    }

    deleteStory(event){
        event.preventDefault();
        const storyId=getFromStorage('editstory');
        axios.get(`http://localhost:3231/users/deleteData?id=${storyId}`)
        .then((res)=>{
            if(res.data.success==true){
               this.props.history.push('/myProfile');
            }
        })
    }

    storyCategory(event){

        event.preventDefault();
        if(event.target.id=='storieCategory'){
        var a=document.getElementById('storieCategory')
        if(/ /.test(a.value)){
            a.style.borderColor='red'
            var b=document.getElementById('categoryPara');
            b.innerHTML='story category must be in one word'
            b.style.color='red'
        }
        else if(a.value==''){
            a.style.borderColor='red'
            var b=document.getElementById('categoryPara');
            b.innerHTML="story title can't be left blank"
            b.style.color='red'
        }
        else{
            a.style.border='solid 1px green';
            document.getElementById('categoryPara').innerHTML='';
            this.setState({category:true});
        } 
        }

        if(event.target.id=='storieTitle'){
            var a=document.getElementById('storieTitle')
            if(a.value==''){
                a.style.borderColor='red'
                var b=document.getElementById('titlePara');
                b.innerHTML="story title can't be left blank"
                b.style.color='red'
            }
            else{
                a.style.border='solid 1px green';
                document.getElementById('titlePara').innerHTML='';
                this.setState({title:true});
            }
        }


        if(event.target.id=='storieText'){
            var a=document.getElementById('storieText')
            if(a.value==''){
                a.style.borderColor='red'
                var b=document.getElementById('storiePara');
                b.innerHTML="story can't be left blank"
                b.style.color='red'
            }
            else if(a.value.length<100){
                a.style.borderColor='red'
                var b=document.getElementById('storiePara');
                b.innerHTML="story too short atleast contains 100 words"
                b.style.color='red' 
            }
            else{
                a.style.border='solid 1px green';
                document.getElementById('storiePara').innerHTML='';
                this.setState({story:true});
            }
        }
        
    }
render(){

    return(
    <React.Fragment>
    <div>
    <Header/>
    </div>
    <div className="createStory">
       
        <Container>
        <Form >
            <FormGroup>
                Category<span > </span>
                <Input type='text' id='storieCategory'  onBlur={this.storyCategory}/>
                <p id='categoryPara'></p>
            </FormGroup>
            
            <FormGroup>
                Title<span ></span>
                <Input type='text' id='storieTitle'  onBlur={this.storyCategory}/>
                <p id='titlePara'></p>
            </FormGroup>

            <FormGroup>
                Story<span></span>
                <Input type='textarea' id='storieText'  onBlur={this.storyCategory}/>
                <p id='storiePara'></p>
            </FormGroup>
            <FormGroup>
            <Button className='bg-primary' id='submitStory' onClick={this.editStory}>Submit</Button>
            <Button className='bg-danger ml-2' id='submitDelete' onClick={this.deleteStory}>Delete</Button>
            </FormGroup>        
        </Form>
        </Container>

    </div>   
    </React.Fragment>
    )
}

}
export default EditStory;