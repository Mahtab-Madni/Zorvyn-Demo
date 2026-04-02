import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  DESCRIPTIONS,
} from "./constants";

export const generateTransactions = () => {
  const txns = [];
  let id = 1;

  for (let m = 0; m < 6; m++) {
    const date = new Date(2025, 9 + m, 1);

    // Income transactions
    INCOME_CATEGORIES.forEach((cat) => {
      const count = cat === "Salary" ? 1 : Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const d = new Date(date.getFullYear(), date.getMonth(), day);
        txns.push({
          id: id++,
          date: d.toISOString().split("T")[0],
          description:
            DESCRIPTIONS[cat][
              Math.floor(Math.random() * DESCRIPTIONS[cat].length)
            ],
          category: cat,
          type: "income",
          amount:
            cat === "Salary"
              ? 5800 + Math.random() * 400
              : cat === "Freelance"
                ? 500 + Math.random() * 1500
                : 100 + Math.random() * 800,
        });
      }
    });

    // Expense transactions
    EXPENSE_CATEGORIES.forEach((cat) => {
      const count = cat === "Housing" ? 1 : Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < count; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const d = new Date(date.getFullYear(), date.getMonth(), day);
        txns.push({
          id: id++,
          date: d.toISOString().split("T")[0],
          description:
            DESCRIPTIONS[cat][
              Math.floor(Math.random() * DESCRIPTIONS[cat].length)
            ],
          category: cat,
          type: "expense",
          amount:
            cat === "Housing"
              ? 1800 + Math.random() * 400
              : cat === "Food"
                ? 20 + Math.random() * 120
                : cat === "Shopping"
                  ? 30 + Math.random() * 300
                  : 10 + Math.random() * 200,
        });
      }
    });
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const INITIAL_TRANSACTIONS = generateTransactions();
