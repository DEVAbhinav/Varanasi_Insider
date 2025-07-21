
import React from "react";
import Package from "./package-info/Package-blog";
import VehicleTable from './vehicletable';
import './package.css';
import { FaUserAlt, FaCommentDots} from "react-icons/fa";
import { AiFillHeart, AiFillCalendar, AiFillEye} from "react-icons/ai";

export default function Four(props){

    return <>
    <Package {...props}  />
    <div className="vehicle-info">
      {/* <h1>Vehicle Information</h1> */}
      {/* <ImageGallery /> */}
      
      <hr className="bg-orange" />
          <div className="blog-post mb-3 mt-0 font-medium text-brown font-14">
            <FaUserAlt /> 4500+ pickups&nbsp;&nbsp;&nbsp;
            <AiFillCalendar /> We will wait for
            you&nbsp;&nbsp;&nbsp;
            <FaCommentDots /> Fastest Cab in
            Varanasi&nbsp;&nbsp;&nbsp;
            <AiFillHeart /> 5 favourites&nbsp;&nbsp;&nbsp;
            <AiFillEye /> 1.128k views
          </div>
    </div>
    </>
}