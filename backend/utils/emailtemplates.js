
const adminAccountCreationTemplate = (userDetails) => {
  return {
    subject: "New Account Created",
    text: `
      Hello Admin,

      A new account has been successfully created for ${userDetails.name}.

      Account Details:
      Account Number: ${userDetails.account_number}
      Initial Balance: ₹${userDetails.balance}

      Thank you for managing our accounts.

      Best regards,
      Your Bank
    `,
  };
};


const depositTemplate = (details, isAdmin) => {
  return {
    subject: "Deposit Successful - Account Credited",
    text: `
      Hello ${isAdmin ? "Admin" : details.user_name},

      ${isAdmin ? `A deposit of ₹${details.amount} has been made into ${details.user_name}'s account.` : `Your account has been successfully credited with ₹${details.amount}.`}

      Account Number: ${details.account_number}
      New Balance: ₹${details.new_balance}

      ${isAdmin ? "Thank you for your assistance." : "Thank you for banking with us!"}

      Best regards,
      Your Bank
    `,
  };
};


const withdrawalTemplate = (details, isAdmin) => {
  return {
    subject: "Withdrawal Successful - Account Debited",
    text: `
      Hello ${isAdmin ? "Admin" : details.user_name},

      ${isAdmin ? `A withdrawal of ₹${details.amount} has been made from ${details.user_name}'s account.` : `Your account has been successfully debited with ₹${details.amount}.`}

      Account Number: ${details.account_number}
      New Balance: ₹${details.new_balance}

      ${isAdmin ? "Thank you for your assistance." : "Thank you for banking with us!"}

      Best regards,
      Your Bank
    `,
  };
};


const moneyTransferSenderTemplate = (details, isAdmin) => {
  return {
    subject: "Transaction Successful - Money Transferred",
    text: `
      Hello ${details.sender_name},

      You have successfully transferred ₹${details.amount} to ${details.receiver_name} (Account No: ${details.receiver_account}).

      Your updated balance is ₹${details.newBalance}.

      Thank you for using our services!

      Best regards,
      Your Bank
    `,
  };
};

const moneyTransferReceiverTemplate = (details, isAdmin) => {
  return {
    subject: "Transaction Received - Money Transfer",
    text: `
      Hello ${details.receiver_name},

      You have received ₹${details.amount} from ${details.sender_name} (Account No: ${details.sender_account}).

      Your updated balance is ₹${details.newBalance}.

      Thank you for using our services!

      Best regards,
      Your Bank
    `,
  };
};

module.exports = {
  adminAccountCreationTemplate,
  depositTemplate,
  withdrawalTemplate,
  moneyTransferSenderTemplate,
  moneyTransferReceiverTemplate,
};
