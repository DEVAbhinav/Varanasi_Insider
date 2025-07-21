import React from 'react';
import Airport from "../../images/packageOne.png"
import Prayagraj from "../../images/packageTwo.jpeg"
import Gaya from "../../images/packageThree.jpeg"
import Vindhyachal from "../../images/packageFour.jpeg"
import { Link } from 'react-router-dom';

function Package() {
    return (<>
        <div className="container pb-5 mb-5">
            <div className="text-dark my-5 pt-4">
                
                <h2 className="mutual-heading font-weight-bold font-bold">Packages</h2>
                
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-6"><Link to ="/package/Airport" >
                    <a href="tel:+91-9935474730">
                        <img src={Airport} alt={Airport} className="rounded mb-3 img-fluid"/>
                    </a>
                    </Link>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6"><Link to ="/package/Prayagraj" >
                    <a href="tel:+91-9935474730">
                        <img src={Prayagraj} alt={Prayagraj} className="rounded mb-3 img-fluid"/>
                    </a></Link>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6"><Link to ="/package/Gaya" >
                    <a href="tel:+91-9935474730">
                        <img src={Gaya} alt={Gaya} className="rounded mb-3 img-fluid"/>
                    </a>
                    </Link>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6"><Link to ="/package/Vindhyachal" >
                    <a href="tel:+91-9935474730">
                        <img src={Vindhyachal} alt={Vindhyachal} className="rounded mb-3 img-fluid"/>
                    </a></Link>
                </div>
            </div>
        </div>
        </>
    )
}

export default Package
