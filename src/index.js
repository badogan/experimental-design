import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// const scriptTag = document.createElement('script')
// scriptTag.type = "text/javascript"
// scriptTag.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_KEY}&libraries=places`
// document.head.append(scriptTag)

ReactDOM.render(<Router>
    <Route path="/" render={props => <App {...props} />} />
</Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
