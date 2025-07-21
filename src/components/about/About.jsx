import React from 'react';
import Taxi from "../../images/aboutUs.svg";
import { MdLocationOn } from "react-icons/md";
import { FaPhoneAlt, FaBuilding } from "react-icons/fa";
import { BsClockFill } from "react-icons/bs";
import { GrMail } from "react-icons/gr";

function About() {
    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-sm-12 col-md-6 col-12 align-self-center">
                        <img src={Taxi} alt="Vinayak Travels Outstation Taxi Service" className="img-fluid" />
                    </div>
                    <div className="col-lg-6 col-sm-12 col-md-6 col-12 py-5">
                        <div className="align-self-center">
                            <h2 className="font-bold text-brown" style={{borderBottom: '3px solid var(--darkOrange)', width: '50%'}}>
                                About Us
                            </h2>
                            <p className="font-16 my-3 text-brown font-regular">Contact us to make an order or get more information about any trip or tour you are interested in. Our operators will provide you with all the information about your future journey.</p>                    
                            <div className="font-regular font-15 text-brown mb-2" >
                                <span><FaBuilding className="font-20 text-orange" /> Vinayak Travels</span>
                            </div>
                            <div className="font-regular font-15 text-brown mb-2">
                                <span><MdLocationOn className="font-20 text-orange" /> Shastri Nagar Sigra, Varanasi, Uttar Pradesh-221010</span>
                            </div>
                            <div className="font-regular font-15 text-brown mb-2">
                                <span><FaPhoneAlt className="font-20 text-orange" /> <a href="tel:+91-9935474730" className="text-brown">+91-9935474730</a></span>
                            </div>
                            <div className="font-regular font-15 text-brown mb-2">
                                <span><BsClockFill className="font-20 text-orange" /> Mon-Sat 8:00-18:00 </span>
                            </div>
                            <div className="font-regular font-15 text-brown mb-2">
                                <span><GrMail className="font-20 text-orange" /> taxiinvaranasiii@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default About
