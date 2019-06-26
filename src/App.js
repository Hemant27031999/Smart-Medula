import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognization from './components/FaceRecognization/FaceRecognization';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';
import Particles from 'react-particles-js';

const app = new Clarifai.App({
  apiKey:'83fd2afe82af4e1baa340d30fc8fea60'
})

const particleOptions = {
              particles: {
                number: {
                  value: 200,
                  density: {
                    enable: true,
                    value_area: 1000
                  }
                }
              }
            }


  const initialState = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin',
      user: {
        'id': '',
        'name':'',
        'email':'',
        'entries':0,
        'joined': ''
      }
    }


  class App extends Component { 

  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState(initialState);
    this.setState({user: {
        'id': data.id,
        'name':data.name,
        'email':data.email,
        'entries': data.entries,
        'joined': data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return{
      leftCol: clarifaiface.left_col * width,
      topRow: clarifaiface.top_row * height,
      rightCol: width - clarifaiface.right_col * width,
      bottomRow: height - clarifaiface.bottom_row * height,
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box}); 
    console.log(box);
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => { 
    this.setState({imageUrl: this.state.input});
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response => {
          if(response){
            fetch('https://glacial-garden-73611.herokuapp.com/image',{
            method: 'put',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
          }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        .catch(err => console.log(err));  
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState);
    }
    this.setState({route: route});
  }

  render(){
  return (
    <div className="App">
        <Particles className='particles'
                params={particleOptions} />

        { this.state.route === 'home'?
            <div>     
              <Navigation onRouteChange = { this.onRouteChange } />
              <Logo />
              <Rank name={ this.state.user.name } entries={ this.state.user.entries }/>
              <ImageLinkForm onInputChange= { this.onInputChange } onButtonSubmit = { this.onButtonSubmit }/>
              <FaceRecognization box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div> :
            (
              this.state.route === 'signin'?
                <Signin loadUser = { this.loadUser } onRouteChange = { this.onRouteChange } /> :
                <Register loadUser = { this.loadUser } onRouteChange = { this.onRouteChange } />  
            )
        }
    </div>
  );
}

}

export default App;


// https://arborenterprises.com/wp-content/uploads/2018/07/Landscape-Maintenance.png
// response.outputs[0].data.regions[0].region_info.bounding_box
