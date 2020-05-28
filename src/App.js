import React, { Component } from 'react';
import './App.css';
import Auxiliary from './components/Auxiliary/Auxiliary';

import Sketch from './Sketch/Sketch';

class App extends Component {

  componentDidMount() {
    const sketch = new Sketch(this.mount);
  }

  render() {
    return (
      <Auxiliary>
        <div ref={ref => (this.mount = ref)} />
        {/* <div className="sourceButton">Source</div> */}
        <div className="btn" onClick={() => { window.location.href = 'https://github.com/KessonDalef/cloudy_planet'; }}>
          <span>SOURCE CODE</span>
        </div>
      </Auxiliary>
    );
  }
}

export default App;
