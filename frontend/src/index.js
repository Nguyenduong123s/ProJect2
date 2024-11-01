import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyles from './components/GlobalStyles';
import allReducers from './reducers';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(allReducers);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <GlobalStyles>
                <App />
            </GlobalStyles>
        </Provider>
    </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
