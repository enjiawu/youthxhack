import React, { Component } from 'react'
import Chart from 'chart.js/auto';
const { GoogleGenerativeAI } = require("@google/generative-ai");

export function normalizeURL(url) {
  // Remove leading/trailing whitespace
  url = url.trim();

  // Add 'https://' if not present
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  // Ensure 'www.' is present if it's a standard web domain
  if (!/^https?:\/\/www\./i.test(url)) {
    url = url.replace(/^https?:\/\//i, 'https://www.');
  }

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
        originOfUsers:{},
        error:null,
        isSubmitted: false,
        isVoted: false,
        totalVotes : 0,
        communityRating: 0,
        barColor: '#FF0000',
        issuer: 'NA',
        hasThreats: false,
        safetyRating: 'Unknown',
        overallRating: 0,
    };
    this.chartInstance = null; // Add chart instance reference
  }

  state = {
    link: '',
    isSubmitted: false,
    isVoted: false,
    totalVotes : 0,
    communityRating: 0,
    barColor: '#FF0000',
    issuer: 'NA',
    valid_from: 'NA',
    valid_to: 'NA',
    hasThreats: false,
    safetyRating: 'Unknown',
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
        // First, check if the SSL data already exists in your MongoDB collection
        const response1 = await fetch(`http://localhost:5050/api/ssl-data?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

      // Update the component's state with the fetched data
      this.setState({
        issuer: response1.issuer.O,
      });

      const trustedProviders = [
        'Amazon',
        'DigiCert',
        'Comodo',
        'GlobalSign',
        'Let\'s Encrypt',
        'Symantec',
        'GeoTrust',
        'Thawte',
        'RapidSSL',
        'Entrust',
        'GoDaddy',
        'SSL.com',
        'Actalis',
        'Certum',
        'Trustwave',
        'VeriSign',
        'QuoVadis',
        'Starfield',
        'WoSign',
        'SECTIGO',
        'Google Trust Services'
      ];    

      if (this.state.issuer === 'NA') {
        console.log("No SSL certificate found");
      }
      else if (trustedProviders.includes(this.state.issuer)) {
        this.state.overallRating += 25;
      }
      else {
        this.state.overallRating += 12.5;
      }

        if (response1.ok) {
            // If data exists in the collection, use it
            const sslData = await response1.json();
            console.log('SSL data found in collection:', sslData);
            this.setState({
                issuer: sslData.issuer.O, // Use the issuer from the stored data
                valid_from: sslData.valid_from,
                valid_to: sslData.valid_to
            });
            console.log(sslData.O);
        } else {
           // If no data in the collection, fetch the SSL certificate directly
           const response2 = await fetch(`http://localhost:5050/api/ssl-cert?url=${encodeURIComponent(url)}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (!response2.ok) {
              throw new Error('Network response was not ok');
          }

          const sslCertData = await response2.json();
          console.log('Fetched SSL cert successfully:', sslCertData);
          console.log(sslCertData.issuer);

          // Update the component's state with the fetched data
          this.setState({
              issuer: sslCertData.issuer.O,
              valid_from: sslCertData.valid_from,
              valid_to: sslCertData.valid_to
          });
          console.log(sslCertData.issuer.O);

          // After fetching the SSL certificate, store it in your MongoDB collection
          const postResponse = await fetch(`http://localhost:5050/api/ssl-data`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  url: url,
                  issuer: sslCertData.issuer.O,
                  valid_from: sslCertData.valid_from,
                  valid_to: sslCertData.valid_to
              })
          });

          if (postResponse.ok) {
              console.log('SSL data saved to collection successfully');
          } else {
              console.error('Failed to save SSL data to collection');
          }
        }
    } catch (error) {
        console.error('Error fetching SSL cert:', error);
    } finally {
      console.log(this.state.issuer)
      console.log("MY ISSUER")
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
      const normalizedUrl = normalizeURL(url);
      console.log(normalizeURL);
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

      if (this.state.pagesPerVisit > 5000) {
        this.state.overallRating += 5;
      }

      if (data == null) {
        this.setState({
          totalVisits: 'NA',
        })
        console.log("NULL DETECTED");
      } else {
        this.setState({
          totalVisits: data,
        });
      }
      
    } catch (error) {
      console.error('Error fetching total visits:', error);
    }
  };

  fetchVisitDuration = async (url) => {
    try {
      const normalizedUrl = normalizeURL(url);
      const response = await fetch(`http://localhost:5050/getVisitDuration?url=${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetched visit duration successfully:', response); // Debugging line

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched visit duration successfully:', data); // Debugging line
      if (data == null) {
        this.setState({
          visitDuration: 'NA',
        })
        console.log("NULL DETECTED");
      } else {
        this.setState({
          visitDuration: data,
        });
      }

      this.setState({
        visitDuration: data,
      });

      if (this.state.visitDuration > 2) {
        this.state.overallRating += 5;
      }
    } catch (error) {
      console.error('Error fetching visit duration:', error);
    }
  }; 

  fetchPagesPerVisit = async (url) => {
    try {
      const normalizedUrl = normalizeURL(url);
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

      if (this.state.pagesPerVisit > 2) {
        this.state.overallRating += 5;
      }

      if (data == null) {
        this.setState({
          pagesPerVisit: 'NA',
        })
        console.log("NULL DETECTED");
      } else {
        this.setState({
          pagesPerVisit: data,
        });
      }
      
    } catch (error) {
      console.error('Error fetching visit duration:', error);
    }
  }; 

  fetchBounceRate = async (url) => {
    try {
      const normalizedUrl = normalizeURL(url);
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

      this.setState({
        bounceRate: data,
      });

      if (this.state.bounceRate < 75) {
        this.state.overallRating += 5;
      }

      if (data == null) {
        this.setState({
          bounceRate: 'NA',
        })
        console.log("NULL DETECTED");
      } else {
        this.setState({
          bounceRate: data,
        });
      }
    } catch (error) {
      console.error('Error fetching bounce rate:', error);
    }
  };

  fetchOriginOfUsers = async (url) => {
    try {
      const normalizedUrl = encodeURIComponent(url);
      const response = await fetch(`http://localhost:5050/getOriginOfUsers?url=${normalizedUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Fetched origin of users successfully:', data); // Debugging line
  
      this.setState({
        originOfUsers: data,
      }, () => {
        this.renderDonutChart(data); // Render the donut chart with the fetched data
        this.renderBarChart(data);   // Render the bar chart with the fetched data
      });
    } catch (error) {
      console.error('Error fetching origin of users:', error);
    }
  };
  
  renderDonutChart = (data) => {
    // Extract labels and data for the chart
    const labels = Object.keys(data);
    const chartData = Object.values(data).map(value => {
      if (typeof value === 'object' && value.low !== undefined && value.high !== undefined) {
        return value.low + (value.high * Math.pow(2, 32));
      }
      return value;
    });
  
    const ctx = document.getElementById('originOfUsersPieChart').getContext('2d');
    
    // Destroy existing chart instance if it exists
    if (this.donutChartInstance) {
      this.donutChartInstance.destroy();
    }
  
    // Create chart data structure
    const dataForChart = {
      labels: labels,
      datasets: [{
        data: chartData,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      }]
    };
  
    // Create new chart instance
    this.donutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: dataForChart,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  };
  
  renderBarChart = (data) => {
    // Extract labels and data for the chart
    const labels = Object.keys(data);
    const chartData = Object.values(data).map(value => {
      if (typeof value === 'object' && value.low !== undefined && value.high !== undefined) {
        return value.low + (value.high * Math.pow(2, 32));
      }
      return value;
    });
  
    const ctx = document.getElementById('originOfUsersBarChart').getContext('2d');
    
    // Destroy existing chart instance if it exists
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }
  
    // Create chart data structure
    const dataForChart = {
      labels: labels,
      datasets: [{
        label: 'Number of Users',
        data: chartData,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderColor: '#ffffff',
        borderWidth: 1,
      }]
    };
  
    // Create new chart instance
    this.barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: dataForChart,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
          }
        }
      }
    });
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

      if (!this.state.hasThreats) {
        this.state.overallRating += 10;
      }

    } catch (error) {
      console.error('Error checking website safety:', error);
      // Handle error state if needed
      this.clearThreats(); // Optionally clear threats if an error occurs
    }
  };

  analyzeUrl = async (url) => {
    const genAI = new GoogleGenerativeAI('AIzaSyDnPeu43l-sXIt2HQ5V0aoqqP8KcS-L98c');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const prompt = `based on these factors analyse the safety and legitimacy of this url, ${url}, give me a rating low/medium/high in terms of safety and legitimacy. only return a clear rating of ow medium or high for the overall rating. high should be for safe and legitimate sites, low should be for unsafe and illegitimate sites. medium should be for sites that are in between. if there are any words like malicious or threats, it is likely to be a dangerous website. it does not matter if it is from google. without any elaboration. factors to consider are: 
  Domain Extension
  Domain Age
  Whois Information
  Professionalism of Content
  Contact Information
  HTTPS in URL
  Copyright and Privacy Policies
  Online Reviews
  Third-Party Certifications
  Social Media Presence
  SSL Certificate
  Payment Gateways
  Malware and Phishing Checks
  Domain Blacklist Checks
  Website Speed
  Suspicious Requests
  Intrusive Ads`;
  
    const result = await model.generateContent(prompt);
    const rating = result.response.text().toLowerCase();
    const safetyRating = rating.includes('low') ? 'Low!!' : rating.includes('medium') ? 'Medium!' : rating.includes('high') ? 'High' : 'Unknown';
    console.log('AI Safety Rating:', safetyRating);
    this.setState({ safetyRating: safetyRating });

    if (this.state.safetyRating === "High") {
      this.state.overallRating += 20;
    }
    else if (this.state.safetyRating === "Medium!") {
      this.state.overallRating += 10;
    }
  }

  // Function to format numbers
  formatNumber = (num) => {
    if (num == undefined){
      return 'NA';
    }
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num;
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
                    onClick={() => { this.fetchOriginOfUsers(this.state.link); this.fetchBounceRate(this.state.link); this.fetchPagesPerVisit(this.state.link); this.fetchVisitDuration(this.state.link); this.fetchTotalVisit(this.state.link); this.handleSubmit(); this.fetchLikesDislikes(this.state.link); this.getBarColor(); this.fetchSslCert(this.state.link); this.fetchGoogleSafeBrowsing(this.state.link); this.analyzeUrl(this.state.link); }}

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
              <h4 id="ssl-cert">{this.state.issuer}</h4>
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
              <h3>{this.formatNumber(this.state.totalVisits.monthly)}</h3>
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
              <h3>{this.formatNumber(this.state.pagesPerVisit.monthly)}</h3>
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
              <h3 style ={{color : 'white'}}>{this.formatNumber(this.state.visitDuration.monthly)}</h3>
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
              <h3 style ={{color : 'white'}}>{this.formatNumber(this.state.bounceRate.monthly)}</h3>
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
          <div className="small-box" style={{ backgroundColor: 
          this.state.safetyRating === "High" ? '#28a745' : 
          this.state.safetyRating === "Medium!" ? 'yellow' : 
          this.state.safetyRating === "Low!!" ? 'red' : 
          this.state.safetyRating === "Unknown" ? 'gray' : 
          '#6c757d' }}>
            <div className="inner">
              <h3 style ={{color : 'white'}}>{this.state.safetyRating}</h3>
              <p style ={{color : 'white'}}>AI Safety Rating <i className="fas fa-info-circle info-icon" title = {this.state.safetyRating === "High" ? 'According to AI evaluation, this link is safe and legitimate' : 
              this.state.safetyRating === "Medium!" ? 'According to AI evaluation, this link is neither safe nor dangerous' : 
              this.state.safetyRating === "Low!!" ? 'According to AI evaluation, this link is dangerous and illegitimate' : 
              this.state.safetyRating === "Unknown" ? 'gray' : 'AI was not able to evaluate this link'}></i></p>
            </div>
            <div className="icon">
              <i className="fas fa-robot" />
            </div>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-3 col-6">
          {/* small box */}
          <div className="small-box" style={{ backgroundColor: this.state.hasThreats ? 'red' : '#28a745' }}>
            <div className="inner">
              <h3 style ={{color : 'white'}}>{this.state.hasThreats ? 'Yes!' : 'No'}</h3>
              <p style ={{color : 'white'}}>Blacklisted <i className="fas fa-info-circle info-icon"  title={this.state.hasThreats ? 'This link is a known malicious site' : 'This link is not a known malicious site'}></i></p>
            </div>
            <div className="icon">
              <i className={this.state.hasThreats ? 'fas fa-exclamation-triangle' : 'fas fa-ban'} />
            </div>
          </div>
        </div>
        {/* ./col */}
        </div>
        {/* /.row */}
          {/* Main row */}
          <div className="row">
            <div className='col-12'>
              <div className="card" style={ {height:'700px'}}>
                    <div className="card-header">
                      <h3 className="card-title">
                        <i className="fas fa-chart-pie mr-1" />
                        Origin of Users
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
                        <div className="chart tab-pane active" id="revenue-chart" style={{position: 'relative', height: 500}}>
                          <canvas id="originOfUsersBarChart" height={300} style={{height: 300}} />                         
                        </div>
                        <div className="chart tab-pane" id="sales-chart" style={{position: 'relative', height: 500}}>
                          <canvas id="originOfUsersPieChart" height={300} style={{height: 300}} />                         
                        </div>  
                      </div>
                    </div>{/* /.card-body */}
              </div>
            </div>
          </div>
        {/* /.row (main row) */}
      </div>)}
      </div>{/* /.container-fluid */}
    </section>
    {/* /.content */}
  </div>
</div>

      )
    }
}