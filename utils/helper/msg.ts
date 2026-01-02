const sendMsg = (firstname: string, lastname: string, sortedHistory: any) => {
  const userName = firstname + " " + lastname || "User";

  const totalAmount = sortedHistory.reduce((acc: any, item: any) => {
    return item.type === "outgoing" ? acc - item.amount : acc + item.amount;
  }, 0);

  const formattedTotal = totalAmount.toFixed(2);

  const allTransactionsText = sortedHistory
    .map((item: any, i: any) => {
      const typeFormatted =
        item.type.charAt(0).toUpperCase() + item.type.slice(1);
      const sign = item.type === "outgoing" ? "-" : "+";
      const amount = Number(item.amount).toFixed(2);
      const dateStr = new Date(item.date).toLocaleString();
      const desc = item.description || "No description";

      return `${i + 1}. ${desc} 
      Type: ${typeFormatted}
      Amount: ${sign}₹${amount}
      Date: ${dateStr}`;
    })
    .join("\n\n");

  const message = `Split Mate - Expense Tracker
    User: ${userName}
    Total Transactions: ${sortedHistory.length}
    Net Balance: ₹${formattedTotal}
    Transaction History:
    ${allTransactionsText}
    `.trim();

  return message;
};

export default sendMsg;
