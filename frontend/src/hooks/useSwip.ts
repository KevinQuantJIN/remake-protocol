import { Account } from "../lib/types";
import { useState } from "react";
import { toast } from "sonner";

export function useSwip() {
  const [tab, setTab] = useState(0);
  const [account, setAccount] = useState<Account>();
  const [loading, setLoading] = useState(false);

  const canSwap = () => {
    if (!account?.amount || account.amount > account.balance) {
      return false;
    }
    return true;
  };

  const onSwap = () => {
    if (loading) return;
    if (!account?.amount || account.amount > account.balance) {
      return false;
    }

    setLoading(true);

    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => {
          setLoading(false);
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

  return {
    tab,
    setTab,
    account,
    setAccount,
    loading,
    setLoading,
    canSwap,
    onSwap,
  };
}
