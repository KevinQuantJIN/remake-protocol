export type Account = {
  id: string;
  name: string;
  icon: string;
  address: string;
  balance: number;
  amount: number | undefined;
};

export type Pool = {
  id: string;
  name: string;
  amount: number;
  collectibles: number;
  items: Account[];

  showMore: boolean;
  amountWaiting: boolean;
  collectiblesWaiting: boolean;
};

export const accounts: Account[] = [
  {
    id: "1",
    name: "Shark cat",
    icon: "https://avatars.dicebear.com/api/avataaars/1.svg",
    address: "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui",
    balance: 1000,
    amount: undefined,
  },
  {
    id: "2",
    name: "Slerf",
    icon: "https://avatars.dicebear.com/api/avataaars/2.svg",
    address: "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3",
    balance: 2000,
    amount: undefined,
  },
  {
    id: "3",
    name: "Nubcat",
    icon: "https://avatars.dicebear.com/api/avataaars/3.svg",
    address: "GtDZKAqvZMnti46ZewMiXCa4oXF4bZxwQPoKzXPFxZn",
    balance: 3000,
    amount: undefined,
  },
];

export const pools: Pool[] = [
  {
    id: "1",
    name: "Pool 1",
    amount: 1000,
    collectibles: 1000,
    amountWaiting: false,
    collectiblesWaiting: false,
    showMore: false,
    items: [...accounts],
  },
  {
    id: "2",
    name: "Pool 2",
    amount: 1000,
    collectibles: 1000,
    amountWaiting: false,
    collectiblesWaiting: false,
    showMore: false,
    items: [...accounts],
  },
  {
    id: "3",
    name: "Pool 3",
    amount: 1000,
    collectibles: 1000,
    amountWaiting: false,
    collectiblesWaiting: false,
    showMore: false,
    items: [...accounts],
  },
];
