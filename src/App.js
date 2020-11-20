import React from 'react';
import './App.css';
import Post from './post/Post'

function App() {

  
  return (
    <div className="app">
      <div className="app__header">
      <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="instagram logo" />
     </div>

    <Post username='Kendayao' caption='Lets begin the day' imageUrl='https://images.unsplash.com/photo-1517404215738-15263e9f9178?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'/>
   




    </div>
  );
}

export default App;
