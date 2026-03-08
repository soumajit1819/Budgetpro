"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type CategoryType = {
  value: string;
  label: string;
};

interface Props {
  onChange?: (value: CategoryType) => void;
  value?: CategoryType | null;
}

export default function CataGory({ onChange, value }: Props) {
  const [open, setOpen] = React.useState(false);
  const [statuses, setStatuses] = React.useState<CategoryType[]>([]);
  const [selectedStatus, setSelectedStatus] = React.useState<CategoryType | null>(value || null);
  const [searchValue, setSearchValue] = React.useState("");

  // -----------------------------
  //  Load categories ONLY from DB
  // -----------------------------
  React.useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/monthbudget");
        const data = await res.json();

        // Extract unique DB categories only
        const dbCategories = Array.from(
          new Set(data.map((item) => item.category))
        ).map((cat) => ({
          value: cat.toLowerCase().replace(/\s+/g, "-"),
          label: cat,
        }));

        setStatuses(dbCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[180px] justify-start">
            {selectedStatus ? selectedStatus.label : "Select Category"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[220px] p-0">
          <Command>
            <CommandInput
              placeholder="Search category..."
              value={searchValue}
              onValueChange={(val: string) => setSearchValue(val)}
            />

            <CommandList>
              <CommandEmpty>No category found</CommandEmpty>

              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={() => {
                      setSelectedStatus(status);
                      onChange?.(status);
                      setOpen(false);
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
