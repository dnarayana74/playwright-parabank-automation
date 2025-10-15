async function findTransactionByAmount(request, customerId, amount) {
    const url = `/parabank/services/bank/customers/${customerId}/transactions/amount/${amount}`;
    const res = await request.get(url);

    if (res.status() === 404) {
        console.warn(`⚠️ No transactions found for amount ${amount}.`);
        return { transactions: [] };
    }

    if (!res.ok()) throw new Error(`API failed with ${res.status()} for ${url}`);
    return res.json();
}

module.exports = { findTransactionByAmount };
