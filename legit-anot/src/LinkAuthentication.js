import React, { Component } from 'react'

export function normalizeURL(url) {
  // Remove leading/trailing whitespace
  url = url.trim();

  // Add 'https://' if not present
  if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
  }

  // Remove 'www.' if it is not present, and add it
  url = url.replace(/^https:\/\/(?:www\.)?/, 'https://www.');

  return url;
}

export default class LinkAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
        link: '',  // State to manage the input value
        totalVisits:{},// initialize as empty object
        visitDuration:{},
        pagesPerVisit:{},
        bounceRate:{},
        error:null
    };
  }

  state = {
    link: '',
    isSubmitted: false,
    isVoted: false,
    totalVotes : 0,
    communityRating: 0,
    barColor: '#FF0000',
    issuer: 'NA',
    hasThreats: false,
  };

  handleInputChange = (event) => {
    this.setState({ link: event.target.value }); // Update the link state on input change
  };

  handleSubmit = () => {
    this.setState({
      isSubmitted: true,
      isVoted: false,
    });
  };
  
  fetchSslCert = async (url) => {
    url = normalizeURL(url);
    try {
      // Make a GET request to the /api/likes-dislikes endpoint
      const response = await fetch(`http://localhost:5050/api/ssl-cert?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse and handle the JSON response
      const data = await response.json();
      console.log('Fetched ssl cert successfully:', data);
      console.log(data.issuer)

      // Update the component's state with the fetched data
      this.setState({
        issuer: data.issuer.O,
      });
      console.log(data.issuer.O);
    } catch (error) {
      console.error('Error fetching ssl cert:', error);
    }
  }

  fetchLikesDislikes = async (url) => {
    try {
      // Make a GET request to the /api/likes-dislikes endpoint
      const response = await fetch(`http://localhost:5050/api/likes-dislikes?url=${encodeURIComponent(normalizeURL(url))}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse and handle the JSON response
      const data = await response.json();
      console.log('Fetched likes/dislikes successfully:', data);
  
      // Calculate total votes and community rating
      const totalVotes = data.likes + data.dislikes;
      const communityRating = totalVotes > 0 ? (data.likes / totalVotes) * 100 : 0;
  
      // Update the component's state with the fetched data
      this.setState({
        totalVotes: totalVotes,
        communityRating: Math.round(communityRating),
      });
    } catch (error) {
      console.error('Error fetching likes/dislikes:', error);
    }
  };

  fetchTotalVisit = async (url) => {
    try {
      const normalizedUrl = encodeURIComponent(url);
      const response = await fetch(`http://localhost:5050/getTrafficObject?url=${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched total visits successfully:', data); // Debugging line

      this.setState({
        totalVisits: data,
      });
    } catch (error) {
      console.error('Error fetching total visits:', error);
    }
  };

  fetchVisitDuration = async (url) => {
    try {
      const normalizedUrl = encodeURIComponent(url);
      const response = await fetch(`http://localhost:5050/getVisitDuration?url=${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched visit duration successfully:', data); // Debugging line

      this.setState({
        visitDuration: data,
      });
    } catch (error) {
      console.error('Error fetching visit duration:', error);
    }
  }; 

  fetchPagesPerVisit = async (url) => {
    try {
      const normalizedUrl = encodeURIComponent(url);
      const response = await fetch(`http://localhost:5050/getPagesPerVisit?url=${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched pages per visit successfully:', data); // Debugging line

      this.setState({
        pagesPerVisit: data,
      });
    } catch (error) {
      console.error('Error fetching visit duration:', error);
    }
  }; 

  fetchBounceRate = async (url) => {
    try {
      const normalizedUrl = encodeURIComponent(url);
      const response = await fetch(`http://localhost:5050/getBounceRate?url=${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched bounce rate successfully:', data); // Debugging line

      this.setState({
        bounceRate: data,
      });
    } catch (error) {
      console.error('Error fetching bounce rate:', error);
    }
  };

  getBarColor() {
    const communityRating = this.state.communityRating;
    if (communityRating < 60) {
      this.state.barColor = '#FF0000'; // Red
    } else if (communityRating < 80) {
      this.state.barColor = '#FFC107'; // Amber 
    } else {
      this.state.barColor = '#28A745'; // Green
    }
    console.log(this.state.communityRating);
  }

  handleVote = () => {
    this.setState({ isVoted: true });
  }

  handleUpvote = async (url) => {
    if (this.state.isVoted) {
      return;
    }
    try {
      // Make a POST request to the /api/upvote endpoint
      const response = await fetch('http://localhost:5050/api/upvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizeURL(url) }), // Send the URL in the body
      });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse and handle the JSON response
      const data = await response.json();
      console.log('Upvote successful:', data);
      this.handleVote();
    } catch (error) {
      console.error('Error during upvote:', error);
    }
  };

  handleDownvote = async (url) => {
    if (this.state.isVoted) {
      return;
    }
    try {
      // Make a POST request
      const response = await fetch('http://localhost:5050/api/downvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizeURL(url) }), // Send the URL in the body
      });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Parse and handle the JSON response
      const data = await response.json();
      console.log('Upvote successful:', data);
      this.handleVote();
    } catch (error) {
      console.error('Error during downvote:', error);
    }
  };

  getRatingClass = () => {
    const { rating } = this.state;
    if (rating >= 80) return 'bg-success'; // Green for high rating
    if (rating >= 60) return 'bg-warning'; // Yellow for medium rating
    return 'bg-danger'; // Red for low rating
  };

  hasThreats = () => {
    this.setState({ hasThreats: true });
  };
  
  clearThreats = () => {
    this.setState({ hasThreats: false });
  };
  
  fetchGoogleSafeBrowsing = async (url) => {
    try {
      const response = await fetch('http://localhost:5050/api/check-safe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizeURL(url) }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Google Safe Browsing API response:', data);
  
      // Determine if threats are found or not
      const hasThreats = data.hasThreats;
      console.log('Threats found:', hasThreats);
  
      // Update the UI based on the response
      if (hasThreats) {
        this.hasThreats(); // Call to set state indicating threats
      } else {
        this.clearThreats(); // Call to set state indicating no threats
      }
    } catch (error) {
      console.error('Error checking website safety:', error);
      // Handle error state if needed
      this.clearThreats(); // Optionally clear threats if an error occurs
    }
  };

  render() {
      const ratingClass = this.getRatingClass();
      return (
          <div>
  <div className="content-wrapper">
    {/* Content Header (Page header) */}
    <div className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark">Link Authentication</h1>
          </div>{/* /.col */}
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-right">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item active">Link Authentication</li>
            </ol>
          </div>{/* /.col */}
        </div>{/* /.row */}
      </div>{/* /.container-fluid */}
    </div>
    {/* /.content-header */}
    {/* Main content */}
    <section className="content">
      <div className="container-fluid">
        {/* Link Input Section */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Check your link</h3>
              </div>
              <div className="card-body">
                <div className="d-flex">
                  <input 
                    type="text" 
                    className="form-control me-2" 
                    placeholder="Enter link here..." 
                    value={this.state.link} 
                    onChange={this.handleInputChange}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style ={{marginLeft: "10px"}}
                    disabled={!this.state.link} // Disable button if link state is empty
                    onClick={() => { this.fetchBounceRate(this.state.link); this.fetchPagesPerVisit(this.state.link); this.fetchVisitDuration(this.state.link); this.fetchTotalVisit(this.state.link); this.handleSubmit(); this.fetchLikesDislikes(this.state.link); this.getBarColor(); this.fetchSslCert(this.state.link); this.fetchGoogleSafeBrowsing(this.state.link); }}

                  >
                    Check
                  </button>
                </div>
                {this.state.isSubmitted && (
                <div className="mt-4 d-flex flex-column align-items-center">
                  <p className="mb-1">Do you think this link is legit?</p>
                  <div className="d-flex">
                    <button 
                      type="button" 
                      className="btn btn-success btn-sm me-2"
                      onClick={() => this.handleUpvote(this.state.link)}
                    >
                      <i className="bi bi-caret-up" style={{ fontSize: '0.5rem' }}></i> Yes
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm "
                      onClick={() => this.handleDownvote(this.state.link)}
                      style = {{ marginLeft: "10px" }}
                    >
                      <i className="bi bi-caret-down" style={{ fontSize: '0.5rem'}}></i> No
                    </button>
                  </div>
                  {this.state.isVoted && (
                    <div>
                      <p className="mb-1">Thank you for voting!</p>
                    </div>  
                    )}
                  <div className="mt-4 w-100">
                    <p className="mb-2">Community Rating</p>
                    <div className="progress">
                      <div 
                        className={`progress-bar ${ratingClass}`} 
                        role="progressbar" 
                        style={{ width: `${this.state.communityRating}%` }}
                        aria-valuenow={this.state.communityRating} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
                        {this.state.communityRating}% total votes: {this.state.totalVotes}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 w-100">
                    <p className="mb-2">Overall Rating</p>
                    <div className="progress">
                      <div 
                        className={`progress-bar ${ratingClass}`} 
                        role="progressbar" 
                        style={{ width: `${this.state.rating}%` }}
                        aria-valuenow={this.state.rating} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      >
                        {this.state.rating}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
      </div>
      {/* /.row */}

      {this.state.isSubmitted && (
        <div>
      {/* Two rows with three boxes each */}
      <div className="row">
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#17a2b8' }}>
            <div className="inner">
              <h3 id="ssl-cert">{this.state.issuer}</h3>
              <p>SSL Certificate Authority<i className="fas fa-info-circle info-icon" title="Indicates if the site has a valid SSL certificate"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-lock" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#28a745' }}>
            <div className="inner">
              <h3>53<sup style={{ fontSize: 20 }}>%</sup></h3>
              <p>Checks <i className="fas fa-info-circle info-icon" title="Shows the percentage of checks performed for this link within our website"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-check-circle" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#ffc107' }}>
            <div className="inner">
              <h3>{this.state.totalVisits.monthly}</h3>
              <p>Visits <i className="fas fa-info-circle info-icon" title="Number of times users have visited the site"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-eye" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#dc3545' }}>
            <div className="inner">
              <h3>{this.state.pagesPerVisit.monthly}</h3>
              <p>Pages per visit <i className="fas fa-info-circle info-icon" title="Average number of pages viewed per visit"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-file-alt" />
            </div>
          </div>
        </div>
        {/* ./col */}
      </div>
      {/* /.row */}

      <div className="row">
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#6f42c1' }}>
            <div className="inner">
              <h3 style ={{color : 'white'}}>{this.state.visitDuration.monthly}</h3>
              <p style ={{color : 'white'}}>Average Visit Duration <i className="fas fa-info-circle info-icon" title="Average duration of a single visit to the site, in seconds"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-clock" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#fd7e14' }}>
            <div className="inner">
              <h3 style ={{color : 'white'}}>{this.state.bounceRate.monthly}</h3>
              <p style ={{color : 'white'}}>Bounce Rate <i className="fas fa-info-circle info-icon" title="Percentage of visitors who leave the site after viewing only one page"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-percent" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#2c3e50' }}>
            <div className="inner">
              <h3 style ={{color : 'white'}}>65</h3>
              <p style ={{color : 'white'}}>AI Risk Rating <i className="fas fa-info-circle info-icon" title="Risk rating of link according to AI evaluation"></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-robot" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: '#9b59b6' }}>
            <div className="inner">
              <h3 style ={{color : this.state.hasThreats ? 'darkred' : 'white'}}>{this.state.hasThreats ? 'Yes' : 'No'}</h3>
              <p style ={{color : this.state.hasThreats ? 'darkred' : 'white'}}>Blacklisted <i className="fas fa-info-circle info-icon"  title={this.state.hasThreats ? 'This link is a known malicious site' : 'Check if link is a known malicious site'}></i></p>
            </div>
            <div className="icon">
              <i className={this.state.hasThreats ? 'fas fa-exclamation-triangle' : 'fas fa-ban'} />
            </div>
          </div>
        </div>
        {/* ./col */}
      </div>
      </div>)}
      {/* /.row */}
      
        {/* Main row */}
        <div className="row">
          {/* Left col */}
          <section className="col-lg-7 connectedSortable">
            {/* Custom tabs (Charts with tabs)*/}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="fas fa-chart-pie mr-1" />
                  Sales
                </h3>
                <div className="card-tools">
                  <ul className="nav nav-pills ml-auto">
                    <li className="nav-item">
                      <a className="nav-link active" href="#revenue-chart" data-toggle="tab">Area</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#sales-chart" data-toggle="tab">Donut</a>
                    </li>
                  </ul>
                </div>
              </div>{/* /.card-header */}
              <div className="card-body">
                <div className="tab-content p-0">
                  {/* Morris chart - Sales */}
                  <div className="chart tab-pane active" id="revenue-chart" style={{position: 'relative', height: 300}}>
                    <canvas id="revenue-chart-canvas" height={300} style={{height: 300}} />                         
                  </div>
                  <div className="chart tab-pane" id="sales-chart" style={{position: 'relative', height: 300}}>
                    <canvas id="sales-chart-canvas" height={300} style={{height: 300}} />                         
                  </div>  
                </div>
              </div>{/* /.card-body */}
            </div>
            {/* /.card */}
            {/* DIRECT CHAT */}
            <div className="card direct-chat direct-chat-primary">
              <div className="card-header">
                <h3 className="card-title">Direct Chat</h3>
                <div className="card-tools">
                  <span data-toggle="tooltip" title="3 New Messages" className="badge badge-primary">3</span>
                  <button type="button" className="btn btn-tool" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  <button type="button" className="btn btn-tool" data-toggle="tooltip" title="Contacts" data-widget="chat-pane-toggle">
                    <i className="fas fa-comments" />
                  </button>
                  <button type="button" className="btn btn-tool" data-card-widget="remove"><i className="fas fa-times" />
                  </button>
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body">
                {/* Conversations are loaded here */}
                <div className="direct-chat-messages">
                  {/* Message. Default to the left */}
                  <div className="direct-chat-msg">
                    <div className="direct-chat-infos clearfix">
                      <span className="direct-chat-name float-left">Alexander Pierce</span>
                      <span className="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>
                    </div>
                    {/* /.direct-chat-infos */}
                    <img className="direct-chat-img" src="dist/img/user1-128x128.jpg" alt="message user image" />
                    {/* /.direct-chat-img */}
                    <div className="direct-chat-text">
                      Is this template really for free? That's unbelievable!
                    </div>
                    {/* /.direct-chat-text */}
                  </div>
                  {/* /.direct-chat-msg */}
                  {/* Message to the right */}
                  <div className="direct-chat-msg right">
                    <div className="direct-chat-infos clearfix">
                      <span className="direct-chat-name float-right">Sarah Bullock</span>
                      <span className="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>
                    </div>
                    {/* /.direct-chat-infos */}
                    <img className="direct-chat-img" src="dist/img/user3-128x128.jpg" alt="message user image" />
                    {/* /.direct-chat-img */}
                    <div className="direct-chat-text">
                      You better believe it!
                    </div>
                    {/* /.direct-chat-text */}
                  </div>
                  {/* /.direct-chat-msg */}
                  {/* Message. Default to the left */}
                  <div className="direct-chat-msg">
                    <div className="direct-chat-infos clearfix">
                      <span className="direct-chat-name float-left">Alexander Pierce</span>
                      <span className="direct-chat-timestamp float-right">23 Jan 5:37 pm</span>
                    </div>
                    {/* /.direct-chat-infos */}
                    <img className="direct-chat-img" src="dist/img/user1-128x128.jpg" alt="message user image" />
                    {/* /.direct-chat-img */}
                    <div className="direct-chat-text">
                      Working with AdminLTE on a great new app! Wanna join?
                    </div>
                    {/* /.direct-chat-text */}
                  </div>
                  {/* /.direct-chat-msg */}
                  {/* Message to the right */}
                  <div className="direct-chat-msg right">
                    <div className="direct-chat-infos clearfix">
                      <span className="direct-chat-name float-right">Sarah Bullock</span>
                      <span className="direct-chat-timestamp float-left">23 Jan 6:10 pm</span>
                    </div>
                    {/* /.direct-chat-infos */}
                    <img className="direct-chat-img" src="dist/img/user3-128x128.jpg" alt="message user image" />
                    {/* /.direct-chat-img */}
                    <div className="direct-chat-text">
                      I would love to.
                    </div>
                    {/* /.direct-chat-text */}
                  </div>
                  {/* /.direct-chat-msg */}
                </div>
                {/*/.direct-chat-messages*/}
                {/* Contacts are loaded here */}
                <div className="direct-chat-contacts">
                  <ul className="contacts-list">
                    <li>
                      <a href="#">
                        <img className="contacts-list-img" src="dist/img/user1-128x128.jpg" />
                        <div className="contacts-list-info">
                          <span className="contacts-list-name">
                            Count Dracula
                            <small className="contacts-list-date float-right">2/28/2015</small>
                          </span>
                          <span className="contacts-list-msg">How have you been? I was...</span>
                        </div>
                        {/* /.contacts-list-info */}
                      </a>
                    </li>
                    {/* End Contact Item */}
                    <li>
                      <a href="#">
                        <img className="contacts-list-img" src="dist/img/user7-128x128.jpg" />
                        <div className="contacts-list-info">
                          <span className="contacts-list-name">
                            Sarah Doe
                            <small className="contacts-list-date float-right">2/23/2015</small>
                          </span>
                          <span className="contacts-list-msg">I will be waiting for...</span>
                        </div>
                        {/* /.contacts-list-info */}
                      </a>
                    </li>
                    {/* End Contact Item */}
                    <li>
                      <a href="#">
                        <img className="contacts-list-img" src="dist/img/user3-128x128.jpg" />
                        <div className="contacts-list-info">
                          <span className="contacts-list-name">
                            Nadia Jolie
                            <small className="contacts-list-date float-right">2/20/2015</small>
                          </span>
                          <span className="contacts-list-msg">I'll call you back at...</span>
                        </div>
                        {/* /.contacts-list-info */}
                      </a>
                    </li>
                    {/* End Contact Item */}
                    <li>
                      <a href="#">
                        <img className="contacts-list-img" src="dist/img/user5-128x128.jpg" />
                        <div className="contacts-list-info">
                          <span className="contacts-list-name">
                            Nora S. Vans
                            <small className="contacts-list-date float-right">2/10/2015</small>
                          </span>
                          <span className="contacts-list-msg">Where is your new...</span>
                        </div>
                        {/* /.contacts-list-info */}
                      </a>
                    </li>
                    {/* End Contact Item */}
                    <li>
                      <a href="#">
                        <img className="contacts-list-img" src="dist/img/user6-128x128.jpg" />
                        <div className="contacts-list-info">
                          <span className="contacts-list-name">
                            John K.
                            <small className="contacts-list-date float-right">1/27/2015</small>
                          </span>
                          <span className="contacts-list-msg">Can I take a look at...</span>
                        </div>
                        {/* /.contacts-list-info */}
                      </a>
                    </li>
                    {/* End Contact Item */}
                    <li>
                      <a href="#">
                        <img className="contacts-list-img" src="dist/img/user8-128x128.jpg" />
                        <div className="contacts-list-info">
                          <span className="contacts-list-name">
                            Kenneth M.
                            <small className="contacts-list-date float-right">1/4/2015</small>
                          </span>
                          <span className="contacts-list-msg">Never mind I found...</span>
                        </div>
                        {/* /.contacts-list-info */}
                      </a>
                    </li>
                    {/* End Contact Item */}
                  </ul>
                  {/* /.contacts-list */}
                </div>
                {/* /.direct-chat-pane */}
              </div>
              {/* /.card-body */}
              <div className="card-footer">
                <form action="#" method="post">
                  <div className="input-group">
                    <input type="text" name="message" placeholder="Type Message ..." className="form-control" />
                    <span className="input-group-append">
                      <button type="button" className="btn btn-primary">Send</button>
                    </span>
                  </div>
                </form>
              </div>
              {/* /.card-footer*/}
            </div>
            {/*/.direct-chat */}
            {/* TO DO List */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <i className="ion ion-clipboard mr-1" />
                  To Do List
                </h3>
                <div className="card-tools">
                  <ul className="pagination pagination-sm">
                    <li className="page-item"><a href="#" className="page-link">«</a></li>
                    <li className="page-item"><a href="#" className="page-link">1</a></li>
                    <li className="page-item"><a href="#" className="page-link">2</a></li>
                    <li className="page-item"><a href="#" className="page-link">3</a></li>
                    <li className="page-item"><a href="#" className="page-link">»</a></li>
                  </ul>
                </div>
              </div>
              {/* /.card-header */}
              <div className="card-body">
                <ul className="todo-list" data-widget="todo-list">
                  <li>
                    {/* drag handle */}
                    <span className="handle">
                      <i className="fas fa-ellipsis-v" />
                      <i className="fas fa-ellipsis-v" />
                    </span>
                    {/* checkbox */}
                    <div className="icheck-primary d-inline ml-2">
                      <input type="checkbox" defaultValue name="todo1" id="todoCheck1" />
                      <label htmlFor="todoCheck1" />
                    </div>
                    {/* todo text */}
                    <span className="text">Design a nice theme</span>
                    {/* Emphasis label */}
                    <small className="badge badge-danger"><i className="far fa-clock" /> 2 mins</small>
                    {/* General tools such as edit or delete*/}
                    <div className="tools">
                      <i className="fas fa-edit" />
                      <i className="fas fa-trash-o" />
                    </div>
                  </li>
                  <li>
                    <span className="handle">
                      <i className="fas fa-ellipsis-v" />
                      <i className="fas fa-ellipsis-v" />
                    </span>
                    <div className="icheck-primary d-inline ml-2">
                      <input type="checkbox" defaultValue name="todo2" id="todoCheck2" defaultChecked />
                      <label htmlFor="todoCheck2" />
                    </div>
                    <span className="text">Make the theme responsive</span>
                    <small className="badge badge-info"><i className="far fa-clock" /> 4 hours</small>
                    <div className="tools">
                      <i className="fas fa-edit" />
                      <i className="fas fa-trash-o" />
                    </div>
                  </li>
                  <li>
                    <span className="handle">
                      <i className="fas fa-ellipsis-v" />
                      <i className="fas fa-ellipsis-v" />
                    </span>
                    <div className="icheck-primary d-inline ml-2">
                      <input type="checkbox" defaultValue name="todo3" id="todoCheck3" />
                      <label htmlFor="todoCheck3" />
                    </div>
                    <span className="text">Let theme shine like a star</span>
                    <small className="badge badge-warning"><i className="far fa-clock" /> 1 day</small>
                    <div className="tools">
                      <i className="fas fa-edit" />
                      <i className="fas fa-trash-o" />
                    </div>
                  </li>
                  <li>
                    <span className="handle">
                      <i className="fas fa-ellipsis-v" />
                      <i className="fas fa-ellipsis-v" />
                    </span>
                    <div className="icheck-primary d-inline ml-2">
                      <input type="checkbox" defaultValue name="todo4" id="todoCheck4" />
                      <label htmlFor="todoCheck4" />
                    </div>
                    <span className="text">Let theme shine like a star</span>
                    <small className="badge badge-success"><i className="far fa-clock" /> 3 days</small>
                    <div className="tools">
                      <i className="fas fa-edit" />
                      <i className="fas fa-trash-o" />
                    </div>
                  </li>
                  <li>
                    <span className="handle">
                      <i className="fas fa-ellipsis-v" />
                      <i className="fas fa-ellipsis-v" />
                    </span>
                    <div className="icheck-primary d-inline ml-2">
                      <input type="checkbox" defaultValue name="todo5" id="todoCheck5" />
                      <label htmlFor="todoCheck5" />
                    </div>
                    <span className="text">Check your messages and notifications</span>
                    <small className="badge badge-primary"><i className="far fa-clock" /> 1 week</small>
                    <div className="tools">
                      <i className="fas fa-edit" />
                      <i className="fas fa-trash-o" />
                    </div>
                  </li>
                  <li>
                    <span className="handle">
                      <i className="fas fa-ellipsis-v" />
                      <i className="fas fa-ellipsis-v" />
                    </span>
                    <div className="icheck-primary d-inline ml-2">
                      <input type="checkbox" defaultValue name="todo6" id="todoCheck6" />
                      <label htmlFor="todoCheck6" />
                    </div>
                    <span className="text">Let theme shine like a star</span>
                    <small className="badge badge-secondary"><i className="far fa-clock" /> 1 month</small>
                    <div className="tools">
                      <i className="fas fa-edit" />
                      <i className="fas fa-trash-o" />
                    </div>
                  </li>
                </ul>
              </div>
              {/* /.card-body */}
              <div className="card-footer clearfix">
                <button type="button" className="btn btn-info float-right"><i className="fas fa-plus" /> Add item</button>
              </div>
            </div>
            {/* /.card */}
          </section>
          {/* /.Left col */}
          {/* right col (We are only adding the ID to make the widgets sortable)*/}
          <section className="col-lg-5 connectedSortable">
            {/* Map card */}
            <div className="card bg-gradient-primary">
              <div className="card-header border-0">
                <h3 className="card-title">
                  <i className="fas fa-map-marker-alt mr-1" />
                  Visitors
                </h3>
                {/* card tools */}
                <div className="card-tools">
                  <button type="button" className="btn btn-primary btn-sm daterange" data-toggle="tooltip" title="Date range">
                    <i className="far fa-calendar-alt" />
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                    <i className="fas fa-minus" />
                  </button>
                </div>
                {/* /.card-tools */}
              </div>
              <div className="card-body">
                <div id="world-map" style={{height: 250, width: '100%'}} />
              </div>
              {/* /.card-body*/}
              <div className="card-footer bg-transparent">
                <div className="row">
                  <div className="col-4 text-center">
                    <div id="sparkline-1" />
                    <div className="text-white">Visitors</div>
                  </div>
                  {/* ./col */}
                  <div className="col-4 text-center">
                    <div id="sparkline-2" />
                    <div className="text-white">Online</div>
                  </div>
                  {/* ./col */}
                  <div className="col-4 text-center">
                    <div id="sparkline-3" />
                    <div className="text-white">Sales</div>
                  </div>
                  {/* ./col */}
                </div>
                {/* /.row */}
              </div>
            </div>
            {/* /.card */}
            {/* solid sales graph */}
            <div className="card bg-gradient-info">
              <div className="card-header border-0">
                <h3 className="card-title">
                  <i className="fas fa-th mr-1" />
                  Sales Graph
                </h3>
                <div className="card-tools">
                  <button type="button" className="btn bg-info btn-sm" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  <button type="button" className="btn bg-info btn-sm" data-card-widget="remove">
                    <i className="fas fa-times" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <canvas className="chart" id="line-chart" style={{minHeight: 250, height: 250, maxHeight: 250, maxWidth: '100%'}} />
              </div>
              {/* /.card-body */}
              <div className="card-footer bg-transparent">
                <div className="row">
                  <div className="col-4 text-center">
                    <input type="text" className="knob" data-readonly="true" defaultValue={20} data-width={60} data-height={60} data-fgcolor="#39CCCC" />
                    <div className="text-white">Mail-Orders</div>
                  </div>
                  {/* ./col */}
                  <div className="col-4 text-center">
                    <input type="text" className="knob" data-readonly="true" defaultValue={50} data-width={60} data-height={60} data-fgcolor="#39CCCC" />
                    <div className="text-white">Online</div>
                  </div>
                  {/* ./col */}
                  <div className="col-4 text-center">
                    <input type="text" className="knob" data-readonly="true" defaultValue={30} data-width={60} data-height={60} data-fgcolor="#39CCCC" />
                    <div className="text-white">In-Store</div>
                  </div>
                  {/* ./col */}
                </div>
                {/* /.row */}
              </div>
              {/* /.card-footer */}
            </div>
            {/* /.card */}
            {/* Calendar */}
            <div className="card bg-gradient-success">
              <div className="card-header border-0">
                <h3 className="card-title">
                  <i className="far fa-calendar-alt" />
                  Calendar
                </h3>
                {/* tools card */}
                <div className="card-tools">
                  {/* button with a dropdown */}
                  <div className="btn-group">
                    <button type="button" className="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown">
                      <i className="fas fa-bars" /></button>
                    <div className="dropdown-menu float-right" role="menu">
                      <a href="#" className="dropdown-item">Add new event</a>
                      <a href="#" className="dropdown-item">Clear events</a>
                      <div className="dropdown-divider" />
                      <a href="#" className="dropdown-item">View calendar</a>
                    </div>
                  </div>
                  <button type="button" className="btn btn-success btn-sm" data-card-widget="collapse">
                    <i className="fas fa-minus" />
                  </button>
                  <button type="button" className="btn btn-success btn-sm" data-card-widget="remove">
                    <i className="fas fa-times" />
                  </button>
                </div>
                {/* /. tools */}
              </div>
              {/* /.card-header */}
              <div className="card-body pt-0">
                {/*The calendar */}
                <div id="calendar" style={{width: '100%'}} />
              </div>
              {/* /.card-body */}
            </div>
            {/* /.card */}
          </section>
          {/* right col */}
        </div>
        {/* /.row (main row) */}
      </div>{/* /.container-fluid */}
    </section>
    {/* /.content */}
  </div>
</div>

        )
    }
}