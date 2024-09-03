import React, { Component } from 'react';
import { normalizeURL } from './LinkAuthentication';
import { Link } from 'react-router-dom'; // Import Link component
import { withLink } from './LinkContext'; // Import withLink HOC

class LinkSafe extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      link: '',
      isSubmitted: false,
      sortBy: 'likes', // Default sorting criteria
      websites: [], // Initialize as an empty array
    };
  }
  async fetchData(){
    try {
      // Make a GET request to the /api/likes-dislikes endpoint
      const response = await fetch(`http://localhost:5050/api/all-likes`, {
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
      
      this.setState({
        websites: data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  componentDidMount() {
    //this.fetchData();
    this.fetchURLs();
  }
  handleInputChange = (event) => {
    this.setState({ link: event.target.value });
  };

  handleUpvote = async (url) => {
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
    } catch (error) {
      console.error('Error during upvote:', error);
    }
  };

  handleDownvote = async (url) => {
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
    } catch (error) {
      console.error('Error during downvote:', error);
    }
  };

  async fetchURLs() {
    try {
      const response = await fetch('http://localhost:5050/getURLs');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Fetched URLs successfully:', data);

      // Map the fetched data into the desired format
      const websites = data.map((item,index) => ({
        id: index + 1, // Generate a unique ID (e.g., sequential)
        url: item.url,
        likes: item.likes,
        dislikes: item.dislikes,
      }));
  
      this.setState({
        websites: websites,
      });
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  }
  handleClick = (website) => {
    const { setLink } = this.props; // Access setLink from props
    if (setLink) { // Check if setLink exists
      console.log(website); // Log the `website` object for debugging
      setLink(website.url); // Set the link in context
    } else {
      console.error('setLink function is not available in props.');
    }
  };
  

  render() {
    const { link, websites, sortBy } = this.state;

    // Filter websites based on the search input
    const filteredWebsites = websites.filter(website =>
      website.url.toLowerCase().includes(link.toLowerCase())
    );

    // Sort websites based on the selected sortBy criteria
    const sortedWebsites = [...filteredWebsites].sort((a, b) => b[sortBy] - a[sortBy]);
    return (
      <div>
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0 text-dark">Link Safe</h1>
                </div>{/* /.col */}
                <div className="col-sm-6">
                  <ol className="breadcrumb float-sm-right">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active">Link Safe</li>
                  </ol>
                </div>{/* /.col */}
              </div>{/* /.row */}
            </div>{/* /.container-fluid */}
          </div>
          {/* /.content-header */}
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              {/* Search and Sort Section */}
              <div className="row mb-3">
                <div className="col-md-12">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for websites..."
                      value={link}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Websites List */}
              <div className="row">
                {sortedWebsites.length > 0 ? (
                  sortedWebsites.map(website => (
                    <div className="col-12" key={website.id}>
                      <div className="card mb-3">
                        <div className="card-body d-flex align-items-center">
                          <a 
                            href={website.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="me-3 flex-grow-1 text-truncate"
                          >
                            {website.url}
                          </a>
                          <div className="d-flex align-items-center me-3">
                            <button
                              className="btn btn-success btn-sm me-2 mx-2"
                              onClick={() => this.handleUpvote(website.url)}
                            >
                              <i className="bi bi-caret-up" /> {website.likes}
                            </button>
                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() => this.handleDownvote(website.url)}
                            >
                              <i className="bi bi-caret-down" /> {website.dislikes}
                            </button>
                          </div>
                        </div>
                        <div className="card-footer text-center">
                        {/*<Link
                          to={{
                            pathname: '/',
                            state: { link: website.url }
                          }}
                          className="btn btn-primary btn-sm px-5"
                        >
                          See More
                        </Link>*/}

                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>No websites found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default withLink(LinkSafe); 