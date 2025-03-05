// import { useState } from "react";
// import "../css/AdminHome.css";

// const DeleteRestoreUser = ({ userEmail, is_deleted: initialIsDeleted, onActionCompleted }) => {
//   const [error, setError] = useState("");
//   const token = localStorage.getItem("token");
//   const [isDeleted, setIsDeleted] = useState(initialIsDeleted);

//   const deleteUser = async () => {
//     setError("");
//     try {
//       const response = await fetch("http://localhost:8000/api/admin/deleteUser", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ email: userEmail }),
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result.message || "Action failed");
//       }

//       const result = await response.json();
//       alert(result.message);
//       setIsDeleted(true);
//       onActionCompleted();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const restoreUser = async () => {
//     setError("");
//     try {
//       const response = await fetch("http://localhost:8000/api/admin/restoreUser", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ email: userEmail }),
//       });

//       if (!response.ok) {
//         const result = await response.json();
//         throw new Error(result.message || "Action failed");
//       }

//       const result = await response.json();
//       alert(result.message);
//       setIsDeleted(false);
//       onActionCompleted();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="actionButtons">
//       {isDeleted ? (
//         <button onClick={restoreUser}>Restore User</button>
//       ) : (
//         <button onClick={deleteUser}>Delete User</button>
//       )}
//       {error && <p className="errorMessage">{error}</p>}
//     </div>
//   );
// };

// export default DeleteRestoreUser;
