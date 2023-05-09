import React, {Fragment} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Simplemaps from './Simplemaps/Simplemaps.component';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
    return (<Router>
        <Fragment>
        <div>
          <Routes>
            <Route path="/map" element={<Simplemaps/>}/>
          </Routes>
        </div>
      </Fragment>
    </Router>);
}
export default App;
