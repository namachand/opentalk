import React from 'react';
import {Form,Button,Input, FormGroup, Container} from 'reactstrap'
import Header from '../components/header';
import axios from 'axios';
import { getFromStorage } from './storage';
import '../css/createStory.css'
const id=getFromStorage('id');
const email=getFromStorage('email');
class CreateStories extends React.Component{
    constructor(props){
        super(props);
        this.state={
            category:false,
            title:false,
            story:false
        }
       
        this.sendStories=this.sendStories.bind(this);
        this.storyCategory=this.storyCategory.bind(this);
    }

  

    sendStories(event){
        event.preventDefault();
        if(this.state.category==true && this.state.story==true && this.state.title==true){
            var storyCategory=document.getElementById('storieCategory');
            var storyText=document.getElementById('storieText');
            var storyTitle=document.getElementById('storieTitle');
            var storyTextVal=storyText.value;
            var storyTitleVal=storyTitle.value;
            var storyCategoryVal=storyCategory.value;

        
            axios.post('http://localhost:3231/users/createStories',{storyTextVal:storyTextVal, storyTitleVal:storyTitleVal ,id:id,email:email,storyCategoryVal:storyCategoryVal}) 
            .then((response)=>{
                console.log(response);
                this.props.history.push('/');
            });
            storyText.value='';
            storyTitle.value=''; 
            storyCategory.value='';
        }
        else{
            alert('Enter the required fields');
        }
     
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
        <Form onSubmit={this.sendStories}>
            <FormGroup>
                Category<span className='reddot'> *</span>
                <Input type='text' id='storieCategory' placeholder='type your story category eg. Quest, Revenge, Love, Comedy' onBlur={this.storyCategory}/>
                <p id='categoryPara'></p>
            </FormGroup>
            
            <FormGroup>
                Title<span className='reddot'> *</span>
                <Input type='text' id='storieTitle' placeholder='type your story title eg. The intelligent Donkey' onBlur={this.storyCategory}/>
                <p id='titlePara'></p>
            </FormGroup>

            <FormGroup>
                Story<span className='reddot'> *</span>
                <Input type='textarea' id='storieText' placeholder='type your story here' onBlur={this.storyCategory}/>
                <p id='storiePara'></p>
            </FormGroup>
            <FormGroup>
            <Button className='bg-primary' id='submitStory'>Submit</Button>
            </FormGroup>        
        </Form>
        </Container>

    </div>   
    </React.Fragment>
    )
}

}
export default CreateStories;