"use client";

import { useState } from "react";
import { FilterContext } from "./context";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type FiltersProvider = {
  children: React.ReactNode;
};

export const FiltersProvider = ({ children }: FiltersProvider) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const open = () => {
    setIsFilterOpen(true);
  };
  const dismiss = () => {
    setIsFilterOpen(false);
  };
  return (
    <FilterContext.Provider value={{ open, dismiss }}>
      {children}
      <CommandDialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem className="gap-3" value="new" on />
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </FilterContext.Provider>
  );
};
