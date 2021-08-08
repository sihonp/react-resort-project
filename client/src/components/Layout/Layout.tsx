import React, { Component } from 'react';
import './Layout.css';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import Register from '../Register/Register';
import Admin from '../Admin/Admin';
import Client from '../Client/Client';
import ClientNavbar from '../ClientNavbar/ClientNavbar';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import AdminAddResort from '../AdminAddResort/AdminAddResort';
import AdminResortChart from '../AdminResortChart/AdminResortChart';
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import AdminUpdateResort from '../AdminUpdateResort/AdminUpdateResort';
import ClientWelcomeNote from '../ClientWelcomeNote/ClientWelcomeNote';
import GoogleMap from '../GoogleMap/GoogleMap';

export default class Layout extends Component {


    render() {
        return (
            <div>
                <BrowserRouter>
                    <section className="layoutContainer">

                        <header className="headerContainer">
                            <Switch>
                                <Route path="/login"/>
                                <Route path="/admin" component={AdminNavbar} exact/>
                                <Route path="/client" component={ClientNavbar} exact/>
                            </Switch>
                        </header>

                        <main className='mainContainer'>
                            <Switch>
                                <Route path="/login" component={Login} exact />
                                <Route path="/register" component={Register} exact />
                                <Route path="/admin" component={Admin} exact />
                                <Route path="/client" component={Client} exact />
                                <Route path="/clientwelcomenote" component={ClientWelcomeNote} exact />
                                <Route path="/googlemap" component={GoogleMap} exact />
                                <Route path="/adminaddresort" component={AdminAddResort} exact />
                                <Route path="/adminresortchart" component={AdminResortChart} exact />
                                <Route path="/adminupdateresort" component={AdminUpdateResort} exact />
                                <Redirect from="/" to="/login" exact />
                            </Switch>
                        </main>
                        <footer className="footerContainer">
                            <Footer />
                        </footer>

                    </section>
                </BrowserRouter>
            </div>
        )
    }
}
