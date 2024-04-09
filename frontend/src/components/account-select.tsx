import { Account } from "../lib/types";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { accounts } from "../lib/types";

interface Props {
  value?: Account;
  onChange: (value: Account) => void;
}

export function AccountSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const onAmount = (amount: number) => {
    onChange({ ...value, amount });
  };

  return (
    <div>
      {value && (
        <div className="h-[30px] mb-4 flex items-center gap-1">
          <span className="mr-1">Address</span>
          <span className="flex-grow text-[10px] font-semibold">
            {value.address}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              className=" text-primary text-[8px] border-primary rounded-full h-[15px] w-[30px]"
              onClick={() => onAmount(value.balance)}
            >
              max
            </Button>
            <Button
              variant="outline"
              type="button"
              className=" text-primary text-[8px] border-primary rounded-full h-[15px] w-[30px]"
              onClick={() => onAmount(value.balance / 2)}
            >
              half
            </Button>
            <span>Balance:</span>
            <span className=" text-white">{value.balance}</span>
          </div>
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            {!value && (
              <div
                className={cn(
                  "w-full flex items-center justify-between p-2 border bg-gray-900",
                  !value && "text-muted-foreground"
                )}
              >
                <span>Select...</span>
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[576px]">
          <Input
            className="m-2 w-full"
            type="text"
            id="search"
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search..."
          />
          {accounts
            .filter((option) => option.name.includes(searchValue))
            .map((acc) => (
              <div
                key={acc.id}
                className=" hover:bg-gray-800 flex w-[576px] items-center gap-2 p-2 cursor-pointer"
                onClick={() => {
                  onChange(acc);
                  setOpen(false);
                }}
              >
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="flex flex-col flex-grow">
                  <span>{acc.name}</span>
                  <span className=" text-xs">{acc.address}</span>
                </span>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    acc.id === value?.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
            ))}
        </PopoverContent>
      </Popover>

      {value && (
        <div className="relative">
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <span className=" text-white">{value?.name}</span>
            <Image src={value?.icon} width={30} height={30} alt=""></Image>
          </div>
          <Input
            type="number" max={value.balance}
            className="text-right"
            value={value.amount}
            onChange={(e) => onAmount(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
