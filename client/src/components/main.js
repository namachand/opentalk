import React from 'react';
import {Switch,Route} from 'react-router-dom';
import Home from './home';
import SignIn from './signin';
import CreateStories from './createStories';
import ShowStory from './showStory'
import ShowProfile from './showProfile'
import SignUp from './signup'
import EditStory from './editStory'
import OptVerification from './optverified'
class Main extends React.Component{
  render(){
    return (  
      <div>
        <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/signin" component={SignIn}/>
        <Route exact path="/create" component={CreateStories}/>
        <Route exact path="/showStory" component={ShowStory}/>
        <Route exact path="/myProfile" component={ShowProfile}/>
        <Route exact path="/editstory" component={EditStory}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/optverification" component={OptVerification}/>
        </Switch>
      </div>
    );
  }
}
export default Main;