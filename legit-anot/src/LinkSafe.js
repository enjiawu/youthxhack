import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class LinkSafe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: '',
      isSubmitted: false,
      websites: [
        { id: 1, url: 'https://example.com', upvotes: 10, downvotes: 2 },
        { id: 2, url: 'https://anotherexample.com', upvotes: 5, downvotes: 0 },
      ],
      sortBy: 'upvotes', // Default sorting criteria
    };
  }

  handleInputChange = (event) => {
    this.setState({ link: event.target.value });
  };

  handleUpvote = (id) => {
    this.setState(prevState => ({
      websites: prevState.websites.map(website =>
        website.id === id
          ? { ...website, upvotes: website.upvotes + 1 }
          : website
      )
    }));
  };

  handleDownvote = (id) => {
    this.setState(prevState => ({
      websites: prevState.websites.map(website =>
        website.id === id
          ? { ...website, downvotes: website.downvotes + 1 }
          : website
      )
    }));
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
                <div className="col-md-6">
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
                              onClick={() => this.handleUpvote(website.id)}
                            >
                              <i className="bi bi-caret-up" /> {website.upvotes}
                            </button>
                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() => this.handleDownvote(website.id)}
                            >
                              <i className="bi bi-caret-down" /> {website.downvotes}
                            </button>
                          </div>
                        </div>
                        <div className="card-footer text-center">
                          <Link
                            to={{
                              pathname: '/',
                              state: { link: website.url }
                            }}
                            className="btn btn-primary btn-sm px-5"
                          >
                            See More
                          </Link>
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
