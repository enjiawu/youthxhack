import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import logo from './logo.jpg';

export default class Menu extends Component {
    render() {
        return (
            <div>
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    {/* Brand Logo */}
                    <div className="d-flex align-items-center">
                        <div className="brand-logo"></div>
                        <img src={logo} alt="Logo" className="brand-image img-circle elevation-3" style={{ marginLeft: "20px", width: "40px", height: "40px", opacity: ".8", marginRight: "10px" }} />
                        <a href="/" className="brand-link">
                            <span className="brand-text font-weight-bold">Legit anot?</span>
                        </a>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar">
                        {/* Sidebar Menu */}
                        <nav className="mt-2">
                            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                                {/* Add icons to the links using the .nav-icon class
                                with font-awesome or any other icon font library */}
                                <li className="nav-item">
                                    <NavLink 
                                        to="/" 
                                        className="nav-link"
                                        activeClassName="active" // Apply "active" class when the link is active
                                    >
                                        <i className="nav-icon fas fa-link" />
                                        <p>
                                            Link Authentication
                                        </p>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        to="/link-safe" 
                                        className="nav-link"
                                        activeClassName="active" // Apply "active" class when the link is active
                                    >
                                        <i className="nav-icon fas fa-shield-alt" />
                                        <p>
                                            Link Safe
                                        </p>
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        to="/info" 
                                        className="nav-link"
                                        activeClassName="active" // Apply "active" class when the link is active
                                    >
                                        <i className="nav-icon fas fa-info-circle" />
                                        <p>
                                            Info
                                        </p>
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                        {/* /.sidebar-menu */}
                    </div>
                    {/* /.sidebar */}
                </aside>
            </div>
        );
    }
}
