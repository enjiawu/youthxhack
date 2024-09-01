import React, { Component } from 'react'

export default class Header extends Component {
    render() {
        return (
           <div>
  <nav className="main-header navbar navbar-expand navbar-white navbar-light">
    {/* Left navbar links */}
    <ul className="navbar-nav">
      <li className="nav-item">
        <a className="nav-link" data-widget="pushmenu" href="#"><i className="fas fa-bars" /></a>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <a href="#" className="nav-link ">Home</a>
      </li>
      <li className="nav-item d-none d-sm-inline-block">
        <a href="/info" className="nav-link ">Info</a>
      </li>
    </ul>
    {/* Right navbar links */}
    <ul className="navbar-nav ml-auto">
      <li class="nav-item">
          <a class="nav-link" data-widget="fullscreen" href="#" role="button">
            <i class="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
    </ul>
  </nav>
</div>

        )
    }
}
