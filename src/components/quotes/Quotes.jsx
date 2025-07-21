import React, { useState, useEffect } from "react";

function Quotes(){
  const [collection , setCollection] = useState('')
  const quotes = [
    "Take your touring experience to another level with the finest car rental",    
    "Reach from varanasi airport to kashi vishwanath or any place at lowest fare",
    "Planning a trip to varansi? Do it with outstation taxi service",
    "Kashi Vishwanath, Sarnath, Assi ghat, name the place we'll take you there",    
    "Enjoy a hassle free ride in our frequently sanitized cabs",  
    "Presenting the best outstation taxi service and car rental in varanasi",
    "We partnered up with city's best cab driver to give you an amazing experience",
    "Panic mode : OFF! ❌ ESSENTIALS ARE ON! ✔️ with outstation taxi service",    
  ];
  useEffect(() => {
    const interval = setInterval(() => {
        setQuote()
    }, 5000);
    return() => {
        clearInterval(interval)
    }
  })
  const setQuote = () => {
    const rand = Math.floor(Math.random() * (8 - 0)) + 0;
    setCollection(quotes[rand])
  }
  return (
    <React.Fragment>
      <div className="text-brown text-center py-1 font-15 font-regular" style={{background: "#fff3cd"}}>{collection}</div>
    </React.Fragment>
  );
}

export default Quotes;