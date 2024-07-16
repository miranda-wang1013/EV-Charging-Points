import { useState, createContext } from "react";

export const UserLocationContext = createContext({
  location: null,
  setLocation: () => {},
});
