import React from "react";
import './home.css';
import HomeCarousel from "./HomeCarousel";
import Buttons from "./Buttons";
import Package from "./Package";
import Blogs from "./Blogs";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <React.Fragment>
      <Helmet>
        <title>
          Travel Agent in Varanasi for Corporate, Spiritual & Leisure Tour
        </title>
        <meta
          name="description"
          content="Vinayak Travels offers the best tour services in Varanasi, catering to corporate, spiritual, and leisure tours at affordable prices."
        />
        <meta
          name="keywords"
          content="Travel Agent Varanasi, Vinayak Travels, Corporate Tour Varanasi, Spiritual Tour Varanasi, Leisure Tour Varanasi, Tour Operator Varanasi"
        />
      </Helmet>
      <div className="bg-home center-aligned-home">
        <div>
          <HomeCarousel />
          <Buttons />
        </div>
      </div>
      <section>
        <h1>Best Travel Agent in Varanasi for Corporate, Spiritual & Leisure Tour</h1>
        <p>
          Welcome to Vinayak Travels Varanasi, your one-stop destination for all travel needs in the spiritual capital of India. 
          Being a top travel agent from Varanasi, we are here to help you create unique and memorable itineraries that allow you 
          to get spiritual, cultural, and adventurous experiences. Our clients include individuals who travel alone, business 
          people traveling in a group, families, or any other travelers in general who wish to spend their vacation exploring 
          the mystic alleys of Varanasi amidst a comfortable and meaningfully fulfilling experience.
        </p>
        <p>
          At Vinayak Travels Varanasi, we believe that all travelers are different and have different preferences when traveling. 
          Our highly qualified tour operators make sure to create itineraries for your vacations that will address your specific 
          requirements. So, what are you waiting for? Make your travel experience memorable with the best tour operators in Varanasi.
        </p>
      </section>
      <section>
        <h2>Key Highlights of Our Tour & Travel Services in Varanasi</h2>
        <p>
          Whether you want to visit the temples, explore the boat ride up the Ganges, or the nighttime prayer ceremony of the Ganga Aarti, 
          we at Vinayak Travels have it all with our packages for the Varanasi tours. We also organize corporate travel for companies 
          planning to have their meetings, conferences, or team build-up events in Varanasi. All our tour operators are fully 
          knowledgeable about Varanasi’s history, culture, and tradition. As locals, they give valuable advice and make sure you get 
          the best out of your visit to this ancient city.
        </p>
        <p>
          Being one of the most trusted travel agents in Varanasi, we always maintain a proper rapport with the hotels, transport 
          service providers, and guides. This means that we can set reasonably cheap prices and at the same time ensure that our 
          clients enjoy their travel.
        </p>
      </section>
      <Package />
      <Blogs />
    </React.Fragment>
  );
}

export default Home;
