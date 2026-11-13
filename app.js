import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';
import { generateClient } from 'aws-amplify/data';

Amplify.configure(outputs);
const client = generateClient();
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  getCurrentUser
} from 'aws-amplify/auth';
const transactions = [
{ id: 1, description: "Monthly paycheck", category: "Salary", type: "income", amount: 4500 },
{ id: 2, description: "Rent", category: "Housing", type: "expense", amount: 1400 },
{ id: 3, description: "Grocery shopping", category: "Groceries", type: "expense", amount: 185.50 },
{ id: 4, description: "Gas", category: "Transportation", type: "expense", amount: 55 },
{ id: 5, description: "Internet bill", category: "Housing", type: "expense", amount: 70 },
{ id: 6, description: "Movie night", category: "Entertainment", type: "expense", amount: 35 }
];
const savingsGoal = 5000;
let editingTransactionId = null;
function startEditing(transaction) {
  editingTransactionId = transaction.id;

  document.getElementById("description").value = transaction.description;
  document.getElementById("amount").value = transaction.amount;
  document.getElementById("type").value = transaction.type;
  document.getElementById("category").value = transaction.category;

  document.getElementById("edit-message").hidden = false;

  document.querySelector("#transaction-form button[type='submit']")
    .textContent = "Save changes";
}
function cancelEditing() {
  editingTransactionId = null;

  document.getElementById("transaction-form").reset();
  document.getElementById("edit-message").hidden = true;

  document.querySelector("#transaction-form button[type='submit']")
    .textContent = "+ Add transaction";
}

document.getElementById("cancel-edit").addEventListener("click", cancelEditing);
const savingsSaved = 1500;
const money = amount => amount.toLocaleString("en-US", {
style: "currency", currency: "USD"
});
function renderDashboard() {
const income = transactions
.filter(t => t.type === "income")
.reduce((sum, t) => sum + t.amount, 0);
const expenses = transactions
.filter(t => t.type === "expense")
.reduce((sum, t) => sum + t.amount, 0);
const balance = income - expenses;
const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
document.getElementById("balance").textContent = money(balance);
document.getElementById("income").textContent = money(income);
document.getElementById("expenses").textContent = money(expenses);
document.getElementById("savings-rate").textContent = `${savingsRate.toFixed(1)}%`;
document.getElementById("goal-amount").textContent = money(savingsGoal);
document.getElementById("goal-saved").textContent = `${money(savingsSaved)} saved`;
const goalPercent = Math.min((savingsSaved / savingsGoal) * 100, 100);
document.getElementById("goal-progress").style.width = `${goalPercent}%`;
document.getElementById("goal-percent").textContent = `${goalPercent.toFixed(0)}%`;
renderTransactions();
renderCategories();
}

function renderTransactions() {
  const list = document.getElementById("transaction-list");
  list.replaceChildren();
    if (transactions.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.textContent = "No transactions yet. Add your first transaction to get started.";
    cell.style.textAlign = "center";
    cell.style.padding = "24px";
    cell.style.color = "var(--muted)";

    row.appendChild(cell);
    list.appendChild(row);
    return;
  }

  [...transactions].reverse().forEach(t => {
    const row = document.createElement("tr");

    const values = [
  t.description,
  t.date
  ? new Date(t.date + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  : "—",
  t.category,
  t.type === "income" ? "Income" : "Expense",
  `${t.type === "income" ? "+" : "−"}${money(t.amount)}`
];

    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      if (index === 3) {
        cell.classList.add(
          "amount-cell",
          t.type === "income" ? "green" : "red"
        );
      }

      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");

// EDIT BUTTON
const editButton = document.createElement("button");
editButton.type = "button";
editButton.className = "edit-button";
editButton.textContent = "Edit";

editButton.addEventListener("click", () => {
  startEditing(t);
});

actionCell.appendChild(editButton);

// DELETE BUTTON
const deleteButton = document.createElement("button");

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${t.description}`);

    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm(
        `Are you sure you want to delete "${t.description}"?`
      );

      if (!confirmed) return;

      try {
        const { data, errors } = await client.models.Transaction.delete({
          id: t.id
        });

        if (errors || !data) {
          console.error("Database delete errors:", errors);
          alert("Could not delete this transaction.");
          return;
        }

        const index = transactions.findIndex(item => item.id === t.id);

        if (index !== -1) {
          transactions.splice(index, 1);
        }

        renderDashboard();

      } catch (error) {
        console.error("Delete failed:", error);
        alert("Unable to delete transaction: " + error.message);
      }
    });

    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    list.appendChild(row);
  });
}

function renderCategories() {
const expenses = transactions.filter(t => t.type === "expense");
const totals = {};
expenses.forEach(t => {
totals[t.category] = (totals[t.category] || 0) + t.amount;
});
const highest = Math.max(1, ...Object.values(totals));
const container = document.getElementById("category-breakdown");
container.replaceChildren();
Object.entries(totals).sort((a, b) => b[1] - a[1])
.forEach(([category, amount]) => {
const row = document.createElement("div");
row.className = "category-row";
const name = document.createElement("span");
name.textContent = category;
const bar = document.createElement("div");
bar.className = "category-bar";
const fill = document.createElement("span");
fill.style.width = `${(amount / highest) * 100}%`;
bar.appendChild(fill);
const value = document.createElement("span");
value.className = "category-amount";
value.textContent = money(amount);
row.append(name, bar, value);
container.appendChild(row);
});
if (Object.keys(totals).length === 0) {
const empty = document.createElement("p");
empty.className = "muted";
empty.textContent = "No expenses to display yet.";
container.appendChild(empty);
}
}


document.getElementById("transaction-form").addEventListener("submit", async event => {
  event.preventDefault();

  const description = document.getElementById("description").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!description || !Number.isFinite(amount) || amount <= 0) {
    alert("Enter a description and an amount greater than zero.");
    return;
  }

  const transactionData = {
    description,
    amount: Math.round(amount * 100) / 100,
    category,
    transactionType: type.toUpperCase()
  };
  console.log("Editing transaction ID:", editingTransactionId);

  try {
    if (editingTransactionId !== null) {
      // UPDATE EXISTING TRANSACTION
      const { data, errors } = await client.models.Transaction.update({
        id: editingTransactionId,
        ...transactionData
      });
    

      if (errors || !data) {
        console.error("Database update errors:", errors);
        alert("Could not update your transaction.");
        return;
      }

      const index = transactions.findIndex(
        item => item.id === editingTransactionId
      );

      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          description: data.description,
          amount: data.amount,
          category: data.category,
          type: data.transactionType.toLowerCase()
        };
      }

      cancelEditing();
      renderDashboard();
      alert("Transaction updated successfully!");

    } else {
      // CREATE NEW TRANSACTION
      const { data, errors } = await client.models.Transaction.create({
        ...transactionData,
        date: new Date().toISOString().split("T")[0]
      });

      if (errors || !data) {
        console.error("Database errors:", errors);
        alert("Could not save your transaction. Please try again.");
        return;
      }

      transactions.push({
        id: data.id,
        description: data.description,
        amount: data.amount,
        type: data.transactionType.toLowerCase(),
        category: data.category,
        date: data.date
      });

      event.target.reset();
      renderDashboard();
      alert("Transaction saved successfully!");
    }

  } catch (error) {
    console.error("Transaction operation failed:", error);
    alert("Unable to save changes: " + error.message);
  }
});


// LOAD TRANSACTIONS FROM DYNAMODB
async function loadTransactions() {
  try {
    const { data, errors } = await client.models.Transaction.list();

    if (errors) {
      console.error("Database errors:", errors);
      return;
    }

    transactions.length = 0;

    data.forEach(item => {
      transactions.push({
        id: item.id,
        description: item.description,
        category: item.category,
        type: item.transactionType.toLowerCase(),
        amount: item.amount,
        date: item.date
      });
    });

    renderDashboard();

  } catch (error) {
    console.error("Could not load transactions:", error);
  }
}
renderDashboard();

// =========================
// COGNITO AUTHENTICATION
// =========================

const authContainer = document.getElementById("auth-container");
const dashboardContainer = document.getElementById("dashboard-container");
const authMessage = document.getElementById("auth-message");

let pendingEmail = "";

function showAuthSection(section) {
  document.getElementById("login-section").hidden = section !== "login";
  document.getElementById("signup-section").hidden = section !== "signup";
  document.getElementById("confirm-section").hidden = section !== "confirm";
  authMessage.textContent = "";
}

async function showDashboard() {
  authContainer.hidden = true;
  dashboardContainer.hidden = false;

  await loadTransactions();
}

function showLogin(message = "") {
  dashboardContainer.hidden = true;
  authContainer.hidden = false;
  showAuthSection("login");
  authMessage.textContent = message;
}

// Switch between login and registration
document.getElementById("show-signup").addEventListener("click", () => {
  showAuthSection("signup");
});

document.getElementById("show-login").addEventListener("click", () => {
  showAuthSection("login");
});

document.getElementById("logout-button").addEventListener("click", async () => {
  try {
    await signOut();
    showLogin("You have successfully logged out.");
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Unable to log out: " + error.message);
  }
});


// Register a new user
document.getElementById("signup-form").addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try {
    const result = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    });

    pendingEmail = email;

    if (result.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
      showAuthSection("confirm");
      authMessage.textContent = "Check your email for your verification code.";
    } else {
      authMessage.textContent = "Registration step: " + result.nextStep.signUpStep;
    }
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

// Verify the registration code
document.getElementById("confirm-form").addEventListener("submit", async event => {
  event.preventDefault();

  const code = document.getElementById("confirm-code").value.trim();

  try {
    await confirmSignUp({
      username: pendingEmail,
      confirmationCode: code
    });

    showLogin("Your email is verified! You can now log in.");
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

// Log in an existing user
document.getElementById("login-form").addEventListener("submit", async event => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const result = await signIn({
      username: email,
      password
    });

    if (result.isSignedIn) {
      showDashboard();
    } else {
      authMessage.textContent =
        "Additional sign-in step required: " + result.nextStep.signInStep;
    }
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

// Check whether a user is already signed in
async function checkCurrentUser() {
  try {
    await getCurrentUser();
    showDashboard();
  } catch {
    showLogin();
  }
}

checkCurrentUser();
