import React, { useState } from "react";
import EditUser from "./editUse";
import "../css/AdminHome.css";

const AdminHome = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    const handleSearch = async () => {
        if (!accountNumber) {
            setError("Please enter an account number.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError("You are not authenticated. Please log in.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch account details.");
            }

            const result = await response.json();
            console.log(result);

            setData(result);
            setError("");
        } catch (err) {
            setError(err.message || "An error occurred.");
        }
    };

    const handleEditUser = (user) => {
        setUserToEdit(user);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setUserToEdit(null);
    };

    return (
        <div className="adminHome">
            <h1 className="adminTitle">Account Enquiry</h1>
            <div className="searchContainer">
                <input
                    className="searchInput"
                    type="text"
                    placeholder="Enter Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <button className="searchButton" onClick={handleSearch}>
                    Search
                </button>
            </div>
            {error && <p className="errorMessage">{error}</p>}
            {data && (
                <div className="resultsContainer">
                    <section className="userDetailsSection">
                        <h2>Personal Information</h2>
                        {data.userDetails.length ? (
                            <div>
                                <table className="dataTable">
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Ac. No</td>
                                            <td>{accountNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Name</td>
                                            <td>{data.userDetails[0].name}</td>
                                        </tr>
                                        <tr>
                                            <td>email</td>
                                            <td>{data.userDetails[0].email}</td>
                                        </tr>
                                        <tr>
                                            <td>Aadhaar</td>
                                            <td>{data.userDetails[0].aadhaar}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone</td>
                                            <td>{data.userDetails[0].phone}</td>
                                        </tr>
                                        <tr>
                                            <td>dob</td>
                                            <td>{data.userDetails[0].dob}</td>
                                        </tr>
                                        <tr>
                                            <td>Type</td>
                                            <td>{data.userDetails[0].account_type}</td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>{data.userDetails[0].address}</td>
                                        </tr>
                                        <tr>
                                            <td>Created At</td>
                                            <td>{new Date(data.userDetails[0].created_at).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Balance</td>
                                            <td>{data.userDetails[0].balance}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button
                                    className="editButton"
                                    onClick={() => handleEditUser(data.userDetails[0])}
                                >
                                    Edit User profile
                                </button>
                            </div>
                        ) : (
                            <p>No user details found.</p>
                        )}
                    </section>

                    <section className="transactionHistorySection">
                        <h2>Transaction History</h2>
                        {data.transactions.length ? (
                            <table className="dataTable">
                                <thead>
                                    <tr>

                                        <th>Account Number</th>
                                        <th>Amount</th>
                                        <th>Description</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.transactions.map((txn) => (
                                        <tr key={txn.id}>

                                            <td>{txn.account_number}</td>
                                            <td>{txn.amount}</td>
                                            <td>{txn.details}</td>
                                            <td>{txn.type}</td>
                                            <td>{new Date(txn.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No transactions found.</p>
                        )}
                    </section>

                    <section className="moneyTransfersSection">
                        <h2>Money Transfers</h2>
                        {data.moneyTransfers.length ? (
                            <table className="dataTable">
                                <thead>
                                    <tr>

                                        <th>Sender</th>
                                        <th>Sender Name</th>
                                        <th>Receiver</th>
                                        <th>Recevier Name</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.moneyTransfers.map((transfer) => (
                                        <tr key={transfer.id}>

                                            <td>{transfer.sender_account}</td>
                                            <td>{transfer.sender_name}</td>
                                            <td>{transfer.receiver_account}</td>
                                            <td>{transfer.receiver_name}</td>
                                            <td>{transfer.amount}</td>
                                            <td>{new Date(transfer.timestamp).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No money transfers found.</p>
                        )}
                    </section>
                </div>
            )}

            {isEditModalOpen && (
                <EditUser userData={userToEdit} onClose={closeEditModal} />
            )}
        </div>
    );
};

export default AdminHome;



