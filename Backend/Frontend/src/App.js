import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Carousel from './Carousel'
import './css/App.css'
import Info from './Info'
import Footer from './Footer'
import CurrentAuth from './CurrentAuth.js'
import Storage from './Storage'
import Encrypt from './Encrypt'
import Files from './Files'

function App() {
  return (
    <div className="App">

      <CurrentAuth>

        <Router>
          <div>
            {/* =======================header=========================== */}

            <Route path="/">
              <div className="app_header">
                <Header />
              </div>
            </Route>



            {/* ============================body================================== */}

            <div className="app_body">

              <Route exact path="/storage">
                <Storage />
              </Route>

              <Route exact path="/">
                <Carousel />
                <Info />
              </Route>

              {/* <Route exact path="/encryptData">
                <Encrypt />
              </Route> */}

              <Route exact path="/storage/:folderName">
                <Files />
              </Route>


            </div>

          </div>
        </Router>

      </CurrentAuth>


      {/* ============footer================= */}

      {/*     
     <div className="Footer">
      <Footer/>
    </div> */}


    </div>
  );
}

export default App;
