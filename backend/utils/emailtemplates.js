const adminAccountCreationTemplate = (userDetails) => {
  return {
    subject: "New Account Created",
    text: `
      Hello,

      A new account has been successfully created for ${userDetails.name}.

      **Account Details:**
      Account Number: ${userDetails.account_number}
      Initial Balance: ₹${userDetails.balance}

      Thank you for using Magadha Bank services.

      **Best regards,**
      Magadha Bank
    `,
  };
};

const depositTemplate = (details) => {
  return {
    subject: "Deposit Successful - Account Credited",
    text: `
      Hello ${details.user_name},

      Your account has been successfully credited with ₹${details.amount}.

      **Account Number:** ${details.account_number}
      **New Balance:** ₹${details.new_balance}

      Thank you for banking with us!

      **Best regards,**
      Magadha Bank
    `,
  };
};

const withdrawalTemplate = (details) => {
  return {
    subject: "Withdrawal Successful - Account Debited",
    text: `
      Hello ${details.user_name},

      Your account has been successfully debited with ₹${details.amount}.

      **Account Number:** ${details.account_number}
      **New Balance:** ₹${details.new_balance}

      Thank you for banking with us!

      **Best regards,**
      Magadha Bank
    `,
  };
};

const moneyTransferSenderTemplate = (details) => {
  return {
    subject: "Transaction Successful - Money Transferred",
    text: `
      Hello ${details.sender_name},

      You have successfully transferred ₹${details.amount} to ${details.receiver_name} (Account No: ${details.receiver_account}).

      **Your updated balance:** ₹${details.newBalance}

      Thank you for using our services!

      **Best regards,**
      Magadha Bank
    `,
  };
};

const moneyTransferReceiverTemplate = (details) => {
  return {
    subject: "Transaction Received - Money Transfer",
    text: `
      Hello ${details.receiver_name},

      You have received ₹${details.amount} from ${details.sender_name} (Account No: ${details.sender_account}).

      **Your updated balance:** ₹${details.newBalance}

      Thank you for using our services!

      **Best regards,**
      Magadha Bank
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
