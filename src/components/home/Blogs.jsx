import React, { useContext } from 'react'
import { DetailsContext } from "../../context/context";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import {Link} from "react-router-dom"

function Blogs() {
    const { homeBlogs } = useContext(DetailsContext);
    const { article } = homeBlogs;
    return (
        <React.Fragment>
          <div id="news" >
            <div className="container py-3">            
            <div className="text-dark my-5 pt-4">
                <h2 className="mutual-heading font-weight-bold">Popular Destinations</h2>
            </div>
                <div className="row">
                    {article.map(blog => {
                        return (
                            <div className="col-lg-4 col-md-12 col-sm-12 col-12"><Link to = {`./blogs/${blog.name}`}>
                                <div className="card card-news mb-4" >
                                    <div className="blogs-img">
                                        <img src={blog.image} alt={blog.name} className="img-fluid card-img-top blogs-img" />
                                        <h3 className="font-demi text-white font-25 blogs-heading">{blog.name}</h3>
                                    </div>
                                    <div className="card-body bg-white">                                                                        
                                    <p className="text-brown font-15 font-regular my-0 pt-0">{blog.paragraph}</p>
                                    <hr className="py-0 my-0 bg-brown"/>
                                    <div className="row mt-2">                                        
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                            <div className="text-brown font-medium font-14 align-middle">
                                                <FaRegCommentDots className="text-brown align-baseline mt-n3" /> {blog.comments} <span className="font-regular font-12">comments</span><br />
                                                <FaRegHeart className="text-brown align-baseline mt-n3"/> {blog.likes} <span className="font-regular font-12">likes</span>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6 d-flex justify-content-end">
                                        <button className="btn call-now-button mt-2 font-weight-bold text-white px-4 text-center font-medium">&#x20B9;{blog.price}</button>
                                        </div>
                                    </div>                                                                        
                                    </div>
                                </div></Link>
                            </div>  
                        )
                    })}
                </div>
            </div>
      </div>
        </React.Fragment>
    )
}

export default Blogs
