import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { checkWebsiteSafe } from './services/googleSafeBrowsingService'; 

const LinkAuthentication = () => {
  const location = useLocation();
  const [link, setLink] = useState(location.state?.link || '');
  console.log(link);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [safetyStatus, setSafetyStatus] = useState({});
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (isSubmitted) {
      checkSafety(link);
    }
  }, [isSubmitted, link]);

  const handleInputChange = (event) => {
    setLink(event.target.value);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleUpvote = () => {
    // Handle upvote logic
  };

  const handleDownvote = () => {
    // Handle downvote logic
  };

  const getRatingClass = () => {
    if (rating >= 80) return 'bg-success'; 
    if (rating >= 60) return 'bg-warning'; 
    return 'bg-danger'; 
  };

  const checkSafety = async (url) => {
    try {
      const result = await checkWebsiteSafe(url);
      const isSafe = !result.matches || result.matches.length === 0; 

      setSafetyStatus(prevState => ({
        ...prevState,
        [url]: isSafe ? 'Safe' : 'Not Safe'
      }));
    } catch (error) {
      setSafetyStatus(prevState => ({
        ...prevState,
        [url]: 'Error' 
      }));
    }
  };

  const ratingClass = getRatingClass();
  const urlSafety = safetyStatus[link] || 'Unknown'; 

  return (
    <div>
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Link Authentication</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href="#">Home</a></li>
                  <li className="breadcrumb-item active">Link Authentication</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="container-fluid">
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
                        value={link} 
                        onChange={handleInputChange}
                      />
                      <button 
                        type="button" 
                        className="btn btn-primary"
                        style={{ marginLeft: "10px" }}
                        onClick={handleSubmit}
                      >
                        Check
                      </button>
                    </div>
                    {isSubmitted && (
                      <div className="mt-4 d-flex flex-column align-items-center">
                        <p className="mb-1">Do you think this link is legit?</p>
                        <div className="d-flex">
                          <button 
                            type="button" 
                            className="btn btn-success btn-sm me-2"
                            onClick={handleUpvote}
                          >
                            <i className="bi bi-caret-up" style={{ fontSize: '0.5rem' }}></i> Yes
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-danger btn-sm"
                            onClick={handleDownvote}
                            style={{ marginLeft: "10px" }}
                          >
                            <i className="bi bi-caret-down" style={{ fontSize: '0.5rem' }}></i> No
                          </button>
                        </div>
                        <div className="mt-4 w-100">
                          <p className="mb-2">Overall Rating</p>
                          <div className="progress">
                            <div 
                              className={`progress-bar ${ratingClass}`} 
                              role="progressbar" 
                              style={{ width: `${rating}%` }}
                              aria-valuenow={rating} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            >
                              {rating}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isSubmitted && (
                <div>
                  {/* First row with four boxes */}
                  <div className="row">
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: '#17a2b8' }}>
                        <div className="inner">
                          <h3 id="ssl-cert">Yes</h3>
                          <p>SSL Certificate <i className="fas fa-info-circle info-icon" title="Indicates if the site has a valid SSL certificate"></i></p>
                        </div>
                        <div className="icon">
                          <i className="fas fa-lock" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-6">
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
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: '#ffc107' }}>
                        <div className="inner">
                          <h3>44</h3>
                          <p>Visits <i className="fas fa-info-circle info-icon" title="Number of times users have visited the site"></i></p>
                        </div>
                        <div className="icon">
                          <i className="fas fa-eye" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: '#dc3545' }}>
                        <div className="inner">
                          <h3>65</h3>
                          <p>Pages per Visit <i className="fas fa-info-circle info-icon" title="Average number of pages viewed per visit"></i></p>
                        </div>
                        <div className="icon">
                          <i className="fas fa-file-alt" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Second row with four boxes */}
                  <div className="row">
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: '#6f42c1' }}>
                        <div className="inner">
                          <h3 style={{ color: 'white' }}>80</h3>
                          <p style={{ color: 'white' }}>Average Visit Duration <i className="fas fa-info-circle info-icon" title="Average duration of a single visit to the site, in seconds"></i></p>
                        </div>
                        <div className="icon">
                          <i className="fas fa-clock" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: '#fd7e14' }}>
                        <div className="inner">
                          <h3 style={{ color: 'white' }}>120</h3>
                          <p style={{ color: 'white' }}>Bounce Rate <i className="fas fa-info-circle info-icon" title="Percentage of visitors who leave the site after viewing only one page"></i></p>
                        </div>
                        <div className="icon">
                          <i className="fas fa-percent" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: '#2c3e50' }}>
                        <div className="inner">
                          <h3 style={{ color: 'white' }}>65</h3>
                          <p style={{ color: 'white' }}>AI Risk Rating <i className="fas fa-info-circle info-icon" title="Risk rating of link according to AI evaluation"></i></p>
                        </div>
                        <div className="icon">
                          <i className="fas fa-robot" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-6">
                      <div className="small-box" style={{ backgroundColor: "#9b59b6" }}>
                        <div className="inner">
                          <h3 style={{ color: 'white' }}>{urlSafety === 'Safe' ? 'Yes' : 'No'}</h3>
                          <p style={{ color: 'white' }}>Blacklists <i className="fas fa-info-circle info-icon" title="Check if link is a known malicious site"></i></p>
                        </div>
                        <div className="icon">
                          <i className={urlSafety === 'Safe' ? 'fas fa-check-circle' : 'fas fa-ban'} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                        <div className="chart tab-pane active" id="revenue-chart" style={{ position: 'relative', height: 300 }}>
                          <canvas id="revenue-chart-canvas" height={300} style={{ height: 300 }} />
                        </div>
                        <div className="chart tab-pane" id="sales-chart" style={{ position: 'relative', height: 300 }}>
                          <canvas id="sales-chart-canvas" height={300} style={{ height: 300 }} />
                        </div>
                      </div>
                    </div>{/* /.card-body */}
                  </div>
                  {/* /.card */}
                </section>
                {/* /.Left col */}
                {/* Right col (We are only adding the ID to make the widgets sortable) */}
                <section className="col-lg-5 connectedSortable">
                  {/* Map card */}
                  <div className="card bg-gradient-primary">
                    <div className="card-header border-0">
                      <h3 className="card-title">
                        <i className="fas fa-map-marker-alt mr-1" />
                        Visitors
                      </h3>
                      <div className="card-tools">
                        <button type="button" className="btn btn-primary btn-sm daterange" data-toggle="tooltip" title="Date range">
                          <i className="far fa-calendar-alt" />
                        </button>
                        <button type="button" className="btn btn-primary btn-sm" data-card-widget="collapse" data-toggle="tooltip" title="Collapse">
                          <i className="fas fa-minus" />
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <div id="world-map" style={{ height: 250, width: '100%' }} />
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="row">
                        <div className="col-4 text-center">
                          <div id="sparkline-1" />
                          <div className="text-white">Visitors</div>
                        </div>
                        <div className="col-4 text-center">
                          <div id="sparkline-2" />
                          <div className="text-white">Online</div>
                        </div>
                        <div className="col-4 text-center">
                          <div id="sparkline-3" />
                          <div className="text-white">Sales</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.card */}
                </section>
                {/* /.Right col */}
              </div>
              {/* /.row (main row) */}
            </div>
          </section>
        </div>
      </div>
  );
};

export default LinkAuthentication;
