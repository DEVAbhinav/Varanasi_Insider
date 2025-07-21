import React from "react";
import "./footer.css";
import Copyright from "./Copyright";
import { Link } from "react-router-dom";
import Logo from "../../images/main-logo.png";
import { IoIosArrowForward } from "react-icons/io";
import IconContext from "react-icons";

function Footer() {
  return (
    <React.Fragment>
      <div className="container-fluid">
        <div className="row bg-orange">
          <div className="col-lg-8 col-md-10 col-sm-10 col-11 mx-auto py-4">
            <img src={Logo} alt="Taxi in Varansi Vinayak Travels"/>
            <span className="font-bold text-white font-20">Oustation Taxi Service</span>
            <p className="font-regular text-white font-16 py-0 my-0">
              Since the dawn of time people have come to varanasi to attain salvation and enhancing this experience with the best outstation taxi service is just the cherry on the top. We are available 24*7 and have been providing the finest outstation taxi service since 1986. Had an impromptu 6 friends trip ride in style with our brand new XUV. Planning a romantic weekend getaway? sedan would make an excellent choice.
            </p>
            <a href="tel:+91-9935474730">
              <div className="text-white font-bold font-16">
                <i className="fas fa-phone-alt text-white" /> +91-9935474730
              </div>
            </a>     
            <a href="https://www.kashitaxi.in/" className="font-medium text-brown font-16 py-0 my-0">
              https://www.kashitaxi.in/
            </a>
          </div>
        </div>
        <div className="row bg-dark-brown">
          <div className="col-lg-8 col-md-10 col-sm-11 col-11 mx-auto py-4">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 col-12">            
                <Link to="/blogs/Prayagraj">
                  <li className="text-white font-medium my-1">
                    <IoIosArrowForward className="text-white align-baseline" /> Varanasi to Prayagraj
                  </li>
                </Link>
                <Link to="/blogs/Vindhyachal">
                  <li className="text-white font-medium my-1">
                    <IoIosArrowForward className="text-white align-baseline" /> Varanasi to Vindhyachal
                  </li>
                </Link>
                <Link to="/blogs/Kashi Vishwanath">
                  <li className="text-white font-medium my-1">
                    <IoIosArrowForward className="text-white align-baseline" /> Kashi Vishwanath Darshan
                  </li>
                </Link>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                <Link to="/blogs/Gaya">
                  <li className="text-white font-medium my-1">
                    <IoIosArrowForward className="text-white align-baseline" /> Varanasi to Gaya Cab Rental
                  </li>
                </Link>
                <Link to="/blogs/Sarnath Darshan">
                  <li className="text-white font-medium my-1">
                    <IoIosArrowForward className="text-white align-baseline" /> Sarnath Darshan
                  </li>
                </Link>
                <Link to="/blogs/Durga Mandir">
                  <li className="text-white font-medium my-1">
                    <IoIosArrowForward className="text-white align-baseline" /> Durga Mandir Darshan
                  </li>
                </Link>
              </div>
            </div>                      
          </div>
        </div>
      </div>
      <Copyright />
    </React.Fragment>
  );
}

export default Footer;
