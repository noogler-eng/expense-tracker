const sendMsg = (
  firstName: string,
  lastName: string,
  sortedHistory: any[]
) => {
  const userName =
    `${firstName} ${lastName}`.trim() || "User";

  let incoming = 0;
  let outgoing = 0;

  sortedHistory.forEach(item => {
    if (item.type === "outgoing") outgoing += item.amount;
    else incoming += item.amount;
  });

  const netBalance = incoming - outgoing;

  const transactionsText = sortedHistory
    .map((item, index) => {
      const sign = item.type === "outgoing" ? "−" : "+";
      const amount = Number(item.amount).toFixed(2);
      const date = new Date(item.date).toLocaleDateString();
      const desc = item.description || "No description";

      return `${index + 1}. ${desc}
   ${sign} ₹${amount} • ${date}`;
    })
    .join("\n\n");

  return `
Resolve — Expense Summary

Hi brue, ${userName}
Total Transactions: ${sortedHistory.length}

Summary
• You have to give me: ₹${incoming.toFixed(2)}
• I have to give you: ₹${outgoing.toFixed(2)}
• Net Balance: ₹${netBalance.toFixed(2)}

Transactions
${transactionsText}
`.trim();
};

export default sendMsg;
