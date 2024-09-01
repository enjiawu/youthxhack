import React, { Component } from 'react'

export default class LinkSafe extends Component {
  constructor(props) {
    super(props);
    this.state = {
        link: '',
        isSubmitted: false
    };
  }

  handleInputChange = (event) => {
      this.setState({ link: event.target.value });
  };

  handleSubmit = () => {
      this.setState({ isSubmitted: true });
      // Perform any action needed for the link validation
  };

    render() {
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
                                onClick={this.handleSubmit}
                              >
                                Check
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.row */}
                </section>
              </div>
            </div>
        )
    }
}


