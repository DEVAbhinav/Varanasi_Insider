import React, { useState } from "react";
import { DataHome } from "../data/home";
import { DataHomeBlogs } from "../data/homeBlogs";


export const DetailsContext = React.createContext();

export function DetailsProvider({ children }) {
  const initialState = {
    home: DataHome,
    homeBlogs: DataHomeBlogs
  };
  const [state, setState] = useState(initialState);
  return (
    <DetailsContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </DetailsContext.Provider>
  );
}
