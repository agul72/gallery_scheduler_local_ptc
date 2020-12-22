import React, {useContext} from "react";
import {NavLink, useHistory} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";

import s from './navbar.module.css';

export const NavBar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const logoutHandler = event => {
        auth.logout();
        history.push('/');
    }

    return (
        <nav>
            <div className="nav-wrapper blue darken-1">
                <div className={s.wrapper}>
                    <div className="brand-logo left">Gallery Scheduler</div>
                    <NavLink className="right" to='/' onClick={logoutHandler}>Sign out</NavLink>
                </div>
            </div>
        </nav>
    )
}
