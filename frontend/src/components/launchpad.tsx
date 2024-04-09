"use client";
import { AccountSelect } from "../components/account-select";
import { Button } from "../components/ui/button";
import { useSwip } from "../hooks/useSwip";
import { Account, accounts } from "../lib/types";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Swap() {
  const { tab, setTab, account, setAccount, loading, canSwap, onSwap } =
    useSwip();

  const q = useSearchParams();

  useEffect(() => {
    if (q.get("id")) {
      setAccount(accounts[1]);
    } else {
      setAccount(null);
    }
  }, [q]);

  return (
    <div className="flex justify-center mt-5">
      <div className="w-[656px] bg-[#111318] text-[#637592] p-10 flex flex-col gap-6 pb-6">
        <h4 className=" text-center text-white uppercase">swap</h4>

        <div className=" flex items-center gap-7 my-8">
          <button
            className={`flex-grow h-10 rounded-md text-white ${
              tab === 0 ? "bg-primary" : "bg-[#29313D]"
            }`}
            onClick={() => setTab(0)}
          >
            Buy
          </button>
          <button
            className={`flex-grow h-10 rounded-md text-white ${
              tab === 1 ? " bg-[#EA4E1D]" : "bg-[#29313D]"
            }`}
            onClick={() => setTab(1)}
          >
            Sell
          </button>
        </div>

        <AccountSelect value={account} onChange={setAccount} />

        <Button
          className={`w-full text-white mt-6 ${
            canSwap() ? "" : " cursor-not-allowed"
          }`}
          onClick={onSwap}
        >
          {loading ? "Waiting..." : "Swap"}
        </Button>
      </div>
    </div>
  );
}
