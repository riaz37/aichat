"use client";

import { createContext, useContext } from "react";

export type FilterContext = {
  open: () => void;
  dismiss: () => void;
};

export const FilterContext = createContext<FilterContext | undefined>(
  undefined
);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};
