"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
  emoji: string;
};

interface Props {
  value?: CategoryType | null;
  onChange?: (value: CategoryType) => void;
}

//  full categories array here
const categories: CategoryType[] = [
  { label: "Food", value: "food", emoji: "🍔" },
  { label: "Rent", value: "rent", emoji: "🏠" },
  { label: "Travel", value: "travel", emoji: "✈️" },
  { label: "Shopping", value: "shopping", emoji: "🛍️" },
  { label: "Groceries", value: "groceries", emoji: "🛒" },
  { label: "Electricity", value: "electricity", emoji: "💡" },
  { label: "Water Bill", value: "water-bill", emoji: "🚰" },
  { label: "Internet", value: "internet", emoji: "📶" },
  { label: "Mobile Recharge", value: "mobile-recharge", emoji: "📱" },
  { label: "Fuel", value: "fuel", emoji: "⛽" },
  { label: "Medical", value: "medical", emoji: "💊" },
  { label: "Education", value: "education", emoji: "📚" },
  { label: "Entertainment", value: "entertainment", emoji: "🎬" },
  { label: "Subscription", value: "subscription", emoji: "🔁" },
  { label: "Insurance", value: "insurance", emoji: "🛡️" },
  { label: "EMI", value: "emi", emoji: "💳" },
  { label: "Gift", value: "gift", emoji: "🎁" },
  { label: "Personal Care", value: "personal-care", emoji: "🧴" },
  { label: "Maintenance", value: "maintenance", emoji: "🛠️" },
  { label: "Savings", value: "savings", emoji: "💰" },
  { label: "House Cleaning", value: "house-cleaning", emoji: "🧹" },
  { label: "Laundry", value: "laundry", emoji: "🧺" },
  { label: "Car Wash", value: "car-wash", emoji: "🚗" },
  { label: "Bike Service", value: "bike-service", emoji: "🏍️" },
  { label: "Public Transport", value: "public-transport", emoji: "🚌" },
  { label: "Taxi", value: "taxi", emoji: "🚕" },
  { label: "Train Ticket", value: "train-ticket", emoji: "🚆" },
  { label: "Bus Ticket", value: "bus-ticket", emoji: "🎫" },
  { label: "Flight Ticket", value: "flight-ticket", emoji: "🛫" },
  { label: "Hotel Booking", value: "hotel-booking", emoji: "🏨" },
  { label: "Hostel", value: "hostel", emoji: "🛏️" },
  { label: "Vacation", value: "vacation", emoji: "🏖️" },
  { label: "Tour Package", value: "tour-package", emoji: "🧳" },
  { label: "Temple Donation", value: "temple-donation", emoji: "🛕" },
  { label: "Church Donation", value: "church-donation", emoji: "⛪" },
  { label: "Mosque Donation", value: "mosque-donation", emoji: "🕌" },
  { label: "Charity", value: "charity", emoji: "❤️" },
  { label: "NGO Donation", value: "ngo-donation", emoji: "🤝" },
  { label: "Gym Membership", value: "gym-membership", emoji: "🏋️" },
  { label: "Yoga Class", value: "yoga-class", emoji: "🧘" },
  { label: "Swimming", value: "swimming", emoji: "🏊" },
  { label: "Sports Equipment", value: "sports-equipment", emoji: "⚽" },
  { label: "Cricket", value: "cricket", emoji: "🏏" },
  { label: "Football", value: "football", emoji: "⚽" },
  { label: "Badminton", value: "badminton", emoji: "🏸" },
  { label: "Tennis", value: "tennis", emoji: "🎾" },
  { label: "Books", value: "books", emoji: "📖" },
  { label: "Stationery", value: "stationery", emoji: "✏️" },
  { label: "Exam Fees", value: "exam-fees", emoji: "📝" },
  { label: "Coaching Fees", value: "coaching-fees", emoji: "🏫" },
  { label: "Online Course", value: "online-course", emoji: "💻" },
  { label: "Software Purchase", value: "software-purchase", emoji: "🖥️" },
  { label: "App Subscription", value: "app-subscription", emoji: "📲" },
  { label: "Cloud Storage", value: "cloud-storage", emoji: "☁️" },
  { label: "Domain Hosting", value: "domain-hosting", emoji: "🌐" },
  { label: "Server Cost", value: "server-cost", emoji: "🖧" },
  { label: "Freelancer Payment", value: "freelancer-payment", emoji: "👨‍💻" },
  { label: "Office Rent", value: "office-rent", emoji: "🏢" },
  { label: "Office Supplies", value: "office-supplies", emoji: "📎" },
  { label: "Printer Ink", value: "printer-ink", emoji: "🖨️" },
  { label: "Courier", value: "courier", emoji: "📦" },
  { label: "Postage", value: "postage", emoji: "✉️" },
  { label: "Packaging", value: "packaging", emoji: "📦" },
  { label: "Marketing", value: "marketing", emoji: "📢" },
  { label: "Advertising", value: "advertising", emoji: "📣" },
  { label: "Facebook Ads", value: "facebook-ads", emoji: "📘" },
  { label: "Google Ads", value: "google-ads", emoji: "🔍" },
  { label: "Influencer Payment", value: "influencer-payment", emoji: "🤳" },
  { label: "Photography", value: "photography", emoji: "📸" },
  { label: "Videography", value: "videography", emoji: "🎥" },
  { label: "Editing Software", value: "editing-software", emoji: "🎞️" },
  { label: "Music Instruments", value: "music-instruments", emoji: "🎸" },
  { label: "Music Class", value: "music-class", emoji: "🎶" },
  { label: "Dance Class", value: "dance-class", emoji: "💃" },
  { label: "Art Supplies", value: "art-supplies", emoji: "🎨" },
  { label: "Painting", value: "painting", emoji: "🖌️" },
  { label: "Craft Materials", value: "craft-materials", emoji: "✂️" },
  { label: "Kids Toys", value: "kids-toys", emoji: "🧸" },
  { label: "Baby Care", value: "baby-care", emoji: "👶" },
  { label: "Diapers", value: "diapers", emoji: "🍼" },
  { label: "Pet Food", value: "pet-food", emoji: "🐶" },
  { label: "Pet Grooming", value: "pet-grooming", emoji: "🐕" },
  { label: "Vet Fees", value: "vet-fees", emoji: "🐾" },
  { label: "Gardening", value: "gardening", emoji: "🌱" },
  { label: "Plants", value: "plants", emoji: "🪴" },
  { label: "Seeds", value: "seeds", emoji: "🌾" },
  { label: "Fertilizer", value: "fertilizer", emoji: "🧪" },
  { label: "Home Decor", value: "home-decor", emoji: "🖼️" },
  { label: "Furniture", value: "furniture", emoji: "🛋️" },
  { label: "Mattress", value: "mattress", emoji: "🛏️" },
  { label: "Curtains", value: "curtains", emoji: "🪟" },
  { label: "Lighting", value: "lighting", emoji: "💡" },
  { label: "Kitchenware", value: "kitchenware", emoji: "🍳" },
  { label: "Cookware", value: "cookware", emoji: "🥘" },
  { label: "Gas Cylinder", value: "gas-cylinder", emoji: "🔥" },
  { label: "Water Can", value: "water-can", emoji: "💧" },
  { label: "RO Service", value: "ro-service", emoji: "🚰" },
  { label: "Pest Control", value: "pest-control", emoji: "🐜" },
  { label: "House Repair", value: "house-repair", emoji: "🔧" },
  { label: "Plumber", value: "plumber", emoji: "🚿" },
  { label: "Electrician", value: "electrician", emoji: "⚡" },
  { label: "Car Repair", value: "car-repair", emoji: "🔩" },
  { label: "Insurance Premium", value: "insurance-premium", emoji: "📄" },
  { label: "Health Checkup", value: "health-checkup", emoji: "🩺" },
  { label: "Doctor Visit", value: "doctor-visit", emoji: "👨‍⚕️" },
  { label: "Medicines", value: "medicines", emoji: "💊" },
  { label: "Hospital Bills", value: "hospital-bills", emoji: "🏥" },
  { label: "Emergency Fund", value: "emergency-fund", emoji: "🚨" },
  { label: "Tax Payment", value: "tax-payment", emoji: "🧾" },
  { label: "CA Fees", value: "ca-fees", emoji: "📊" },
  { label: "Legal Fees", value: "legal-fees", emoji: "⚖️" },
  { label: "Court Fees", value: "court-fees", emoji: "🏛️" },
  { label: "Passport Fees", value: "passport-fees", emoji: "🛂" },
  { label: "Visa Fees", value: "visa-fees", emoji: "🌍" },
  { label: "License Renewal", value: "license-renewal", emoji: "🪪" },
  { label: "ID Card", value: "id-card", emoji: "🆔" },
  { label: "Miscellaneous", value: "miscellaneous", emoji: "📌" }
];


export default function CataGory({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<CategoryType | null>(value || null);

  const handleSelect = (val: CategoryType) => {
    setSelected(val);
    onChange?.(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selected ? `${selected.emoji} ${selected.label}` : "Select category..."}
          <ChevronsUpDown className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((cat) => (
                <CommandItem
                  key={cat.value}
                  value={cat.value}
                  onSelect={() => handleSelect(cat)}
                >
                  {cat.emoji} {cat.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selected?.value === cat.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
