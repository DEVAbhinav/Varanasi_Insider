import React, { useState, useContext } from "react";
import Carousel from "react-bootstrap/Carousel";
import { DetailsContext } from "../../context/context";

function HomeCarousel() {
  const { home } = useContext(DetailsContext);
  const { article } = home;
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  return (
    <React.Fragment>      
        <div className="container mt-3">
          <div className="carousel-custom">
            <Carousel activeIndex={index} onSelect={handleSelect} fade indicators={false}>
              {article.map(slide => (
                <Carousel.Item className="carousel-custom">
                  <div className="row no-gutters">
                    <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                      <div className="card carousel-image">
                        <div className="card-body py-2 px-0 pt-0">
                          <img
                            className="carousel-image img-fluid w-100 px-5"
                            src={slide.image}
                            alt={slide.name}
                          />
                        </div>
                      </div>
                    </div>              
                    <div className="col-lg-6 col-md-12 col-sm-12 col-12 px-3">
                      <div className="center-aligned">
                        <div className="carousel-alignment">
                          <h3 className="text-brown font-weight-bold">{slide.name}</h3>
                          <p className="text-brown pb-3 blogs-paragraph font-regular">{slide.paragraph}</p>
                        </div>                      
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr className="pb-0">
                              <th className="table-headings py-2">
                                <p className="text-center text-white py-0 my-0">
                                  City Ride
                                </p>
                              </th>
                              <th className="table-headings py-2">
                                <p className="text-center text-white py-0 my-0">
                                  Outstation
                                </p>
                              </th>
                              <th className="table-headings py-2">
                                <p className="text-center text-white py-0 my-0">
                                  Airport
                                </p>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="pb-0">
                              <td className="bg-white py-2">
                                <p className="text-center font-weight-bold text-brown py-0 my-0">
                                  {slide.city == "-" ? <span>{slide.city}</span> : <span>&#x20B9;{slide.city}<span className="font-regular font-12">km/day</span></span>}
                                </p>
                              </td>
                              <td className="bg-white py-2">
                                <p className="text-center font-weight-bold text-brown py-0 my-0">
                                  &#x20B9;{slide.outstation}<span className="font-regular font-12">km/hr</span>
                                </p>
                              </td>
                              <td className="bg-white py-2">
                                <p className="text-center font-weight-bold text-brown py-0 my-0">
                                  &#x20B9;{slide.airport}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      </div>                      
                    </div>              
                  </div>                        
              </Carousel.Item>
            ))}
            </Carousel>
          </div>
        </div>          
    </React.Fragment>
  );
}

export default HomeCarousel;
