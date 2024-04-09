"use client";
import { Account, pools } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

export type AnalyzeState =
  | "Init"
  | "Detect"
  | "Swap"
  | "Waiting"
  | "Success"
  | "Error";

export function useAnalyze() {
  const [state, setState] = useState<AnalyzeState>("Init");
  const [accounts, setAccounts] = useState<Account[]>([]);

  const onDetect = () => {
    setState("Detect");
    setAccounts([...pools[0].items]);
  };

  const onAnalyze = () => {
    setState("Waiting");

    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => {
          setState("Success");
          resolve({ name: "Sonner" });
        }, 3000)
      );

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        return `has been done`;
      },
      error: "Error",
    });
  };

  const removeAccount = (accountToRemove: Account) => {
    const newAccounts = accounts.filter(
      (account) => account.id !== accountToRemove.id
    );
    if (newAccounts.length === 0) {
      newAccounts.push(...pools[0].items);
    }
    setAccounts(newAccounts);
  };

  const onAmount = (account: Account, amount: number) => {
    const newAccounts = accounts.map((a) => {
      if (a.id === account.id) {
        return { ...a, amount };
      }
      return a;
    });
    setAccounts(newAccounts);
  };

  return {
    state,
    accounts,
    onDetect,
    removeAccount,
    onAnalyze,
    onAmount,
  };
}
