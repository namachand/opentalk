import React from 'react';
import './App.css'
import Main from './components/main'
import {  BrowserRouter as Router } from 'react-router-dom';
class App extends React.Component {
render(){
return (  
    <Router>
        <Main/>
    </Router>
);
}
}
export default App;
