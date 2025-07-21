import React from 'react';
import Error from '../images/error.png';
import { Link } from 'react-router-dom';

function Default() {
    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-xl-5 col-lg-6 col-md-6 col-sm-10 col-12 mx-auto">
                        <div className="text-center">
                            <img src={Error} className="img-fluid" alt="404 page not found"/>
                        </div>
                        <h2 className="font-bold font-22 text-brown text-center">Oops....Page Not Found!</h2>
                        <p className="font-regular font-15 text-brown text-center">
                            We usually have every thing for our customers, but we couldn't find what you are looking for.
                        </p>
                        <Link to="/">
                            <div className="text-center">
                                <button className="call-now-button px-4 mx-auto py-2 text-center btn text-white font-bold font-18 mt-4 mb-5">
                                    Go to Home
                                </button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Default
