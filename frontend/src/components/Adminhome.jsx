import React, { useState } from 'react';

const Adminhome = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!accountNumber) {
            setError("Please enter an account number.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`);
            if (!response.ok) {
                throw new Error("Failed to fetch account details.");
            }

            const result = await response.json();
            setData(result);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred.");
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {data && (
                <div>
                    <h2>User Details</h2>
                    {data.userDetails.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Account Number</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.userDetails.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.account_number}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.balance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No user details found.</p>
                    )}

                    <h2>Transaction History</h2>
                    {data.transactions.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td>{new Date(txn.timestamp).toLocaleString()}</td>
                                        <td>{txn.amount}</td>
                                        <td>{txn.details}</td>
                                        <td>{txn.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No transactions found.</p>
                    )}

                    <h2>Money Transfers</h2>
                    {data.moneyTransfers.length ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Sender</th>
                                    <th>Receiver</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.moneyTransfers.map((transfer) => (
                                    <tr key={transfer.id}>
                                        <td>{new Date(transfer.timestamp).toLocaleString()}</td>
                                        <td>{transfer.sender_account}</td>
                                        <td>{transfer.receiver_account}</td>
                                        <td>{transfer.amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No money transfers found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Adminhome;
