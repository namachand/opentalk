import React from 'react'
import {Form,Button,Input, FormGroup, Container} from 'reactstrap'
import axios from 'axios';

class OptVerification extends React.Component{
    constructor(props){
        super(props)
        this.state={
            otp:'',
            details:'',
            active:false,
            minutes:1,
            seconds:0,
            update:true
        }
        this.submitOtp=this.submitOtp.bind(this);
        this.otpText=this.otpText.bind(this);
        this.resendOTP=this.resendOTP.bind(this);


    }
    componentDidMount(){
        console.log(this.props.location.state);
        this.setState({otp:this.props.location.state.otp})
        this.setState({details:this.props.location.state.details})

        document.getElementById('buttonSubmit').setAttribute('disabled',true)
        document.getElementById('resendOTP').setAttribute('disabled',true)

        this.myInterval=setInterval(() => {
            console.log('inside setinterval');
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval)
                    document.getElementById('resendOTP').removeAttribute('disabled',true)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,
                        seconds: 59
                    }))
                }
            } 
        }, 1000)
  
    }
    
    timer(e){
        e.preventDefault();
        console.log('i am inside timer')
        if(e.target.value==='submit'){
            clearInterval(this.myInterval)
        }
        else{
            document.getElementById('resendOTP').setAttribute('disabled',true)
            this.myInterval=setInterval(() => {
                console.log('inside setinterval');
                const { seconds, minutes } = this.state
    
                if (seconds > 0) {
                    this.setState(({ seconds }) => ({
                        seconds: seconds - 1
                    }))
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(this.myInterval)
                        document.getElementById('resendOTP').removeAttribute('disabled',true)
                    } else {
                        this.setState(({ minutes }) => ({
                            minutes: minutes - 1,
                            seconds: 59
                        }))
                    }
                } 
            }, 1000)
        }
    }

    resendOTP(event){
        event.preventDefault();
        this.setState({minutes:1})
        this.setState({seconds:0})
        this.timer(event);
        axios.post('http://localhost:3231/users/create', this.props.location.state.details)
        .then((data)=>{
          if(data.data.success===true){
            this.setState({otp:data.data.otp})
            this.setState({details:data.data.details})
    
          }
        })
    }
    
    otpText(){
        if(document.getElementById('otptext').value.length<6){
            document.getElementById('buttonSubmit').setAttribute('disabled',true)

        }
        if(document.getElementById('otptext').value.length===6){
            document.getElementById('buttonSubmit').removeAttribute('disabled',true)

        }
    }
    submitOtp(event){
        event.preventDefault();
        this.timer(event);
        if(this.state.otp===document.getElementById('otptext').value){
            axios.post('http://localhost:3231/users/otpVerified',{details:this.state.details})
            this.props.history.push('/signin');
        }
        else{
            alert("Incorrect OTP please enter the correct OTP")
        }

    }
    render(){
        return(
            <Container>
            <div style={{
                display:'flex',
                justifyContent:'center'
            }}>
            <Form>
                <FormGroup style={{
                    marginTop:'10vh'
                }}> 
                    <h1 className=''>Enter the OTP</h1>
                    <Input type='text' placeholder='OTP' id='otptext' maxLength="6" style={{
                        height:'5vh',
                        width:'30vw',
                        marginTop:'2vh'
                    }} onKeyUp={this.otpText}/>
                </FormGroup>

            <FormGroup>
                <Button className='btn bg-primary' id='buttonSubmit' style={{
                    height:'5vh',
                    width:'30vw',
                    marginTop:'2vh'
                }}
                onClick={this.submitOtp}
                value='submit'
                >Submit</Button>    
            </FormGroup>   
            <FormGroup>
                <div className='row'>
                <div className='col-md-5'>
                    <button id='resendOTP' className='btn ' onClick={this.resendOTP}>resend OTP</button>
                    </div>
                <div className='col-md-2 offset-5'>
                {<p> {this.state.minutes}:{this.state.seconds < 10 ? `0${this.state.seconds}` : this.state.seconds}</p>
                }
                    </div>
                </div>
            </FormGroup>     
            </Form>
            </div>
            </Container>    
        )
    }
}
export default OptVerification;