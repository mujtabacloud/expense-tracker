
// Get elements from the page
const expenseForm = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const totalAmount = document.getElementById("total-amount");
const expenseList = document.getElementById("expense-list");
const emptyState = document.getElementById("empty-state");
const expenseCount = document.getElementById("expense-count");
const formMessage = document.getElementById("form-message");

// Save expenses under this key in localStorage
const STORAGE_KEY = "expenseTrackerExpenses";

// Currency formatting: change USD to PKR, GBP, EUR, etc. if desired.
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Icons for each category
const categoryIcons = {
  Food: "🍎",
  Transport: "🚌",
  Education: "📚",
  Shopping: "🛍️",
  Other: "📌"
};

// Keep all expenses in an array
let expenses = loadExpenses();

// Set today's date as the default
dateInput.value = getLocalDate();

// Display saved expenses when the page loads
renderExpenses();

// Load expenses safely from localStorage
function loadExpenses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Ignore invalid records if stored data is damaged
    return parsed.filter((expense) =>
      expense &&
      typeof expense.id === "string" &&
      typeof expense.title === "string" &&
      expense.title.trim() !== "" &&
      Number.isSafeInteger(expense.amountCents) &&
      expense.amountCents > 0 &&
      ["Food", "Transport", "Education", "Shopping", "Other"]
        .includes(expense.category) &&
      typeof expense.date === "string" &&
      isValidDate(expense.date)
    );
  } catch (error) {
    return [];
  }
}

// Get today's date in local time, not UTC
function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Check whether a date is a real YYYY-MM-DD date
function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

// Format an amount consistently
function formatAmount(cents) {
  return currencyFormatter.format(cents / 100);
}

// Save the current expenses in the browser
function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    return true;
  } catch (error) {
    formMessage.textContent =
      "Unable to save data. Browser storage may be unavailable or full.";
    return false;
  }
}

// Add a new expense
expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  // Validate required fields
  if (!title || !amountInput.value.trim() || !date) {
    formMessage.textContent = "Please fill in all required fields.";
    return;
  }

  // Check the amount is a valid positive number with at most 2 decimals
  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !/^\d+(\.\d{1,2})?$/.test(amountInput.value.trim())
  ) {
    formMessage.textContent =
      "Enter an amount greater than zero with up to 2 decimal places.";
    return;
  }

  // Ensure the amount can safely be stored as cents
  const amountCents = Math.round(amount * 100);

  if (
    !Number.isSafeInteger(amountCents) ||
    amountCents <= 0
  ) {
    formMessage.textContent = "Please enter a valid amount.";
    return;
  }

  // Validate the category and date
  const validCategories = Object.keys(categoryIcons);

  if (!validCategories.includes(category)) {
    formMessage.textContent = "Please select a valid category.";
    return;
  }

  if (!isValidDate(date)) {
    formMessage.textContent = "Please enter a valid date.";
    return;
  }

  // Create a unique ID for this expense
  const id = crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const expense = {
    id,
    title,
    amountCents,
    category,
    date
  };

  // Add the expense and save it
  expenses.unshift(expense);

  if (!saveExpenses()) {
    expenses.shift();
    return;
  }

  // Refresh the list and clear the form
  renderExpenses();
  expenseForm.reset();
  dateInput.value = getLocalDate();
  titleInput.focus();
});

// Display all expenses and update the total
function renderExpenses() {
  // Clear old list items
  expenseList.replaceChildren();

  // Calculate using integer cents to avoid floating-point sum errors
  const totalCents = expenses.reduce(
    (sum, expense) => sum + expense.amountCents,
    0
  );

  totalAmount.textContent = formatAmount(totalCents);
  expenseCount.textContent =
    `${expenses.length} ${expenses.length === 1 ? "expense" : "expenses"}`;

  // Show the friendly empty state when there are no expenses
  emptyState.hidden = expenses.length > 0;

  // Build each expense row safely
  expenses.forEach((expense) => {
    const item = document.createElement("article");
    item.className = "expense-item";

    const icon = document.createElement("div");
    icon.className = "category-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = categoryIcons[expense.category];

    const details = document.createElement("div");
    details.className = "expense-details";

    const title = document.createElement("h3");
    title.textContent = expense.title;

    const meta = document.createElement("p");
    meta.className = "expense-meta";
    meta.textContent =
      `${expense.category} · ${formatDate(expense.date)}`;

    details.append(title, meta);

    const right = document.createElement("div");
    right.className = "expense-right";

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = formatAmount(expense.amountCents);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete expense: ${expense.title}`
    );

    // Attach the expense ID to its delete button
    deleteButton.addEventListener("click", () => {
      deleteExpense(expense.id);
    });

    right.append(amount, deleteButton);
    item.append(icon, details, right);
    expenseList.appendChild(item);
  });
}

// Format the date for display
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );
}

// Delete an expense
function deleteExpense(id) {
  const previousExpenses = expenses;

  expenses = expenses.filter((expense) => expense.id !== id);

  if (!saveExpenses()) {
    // Restore the previous list if saving fails
    expenses = previousExpenses;
    renderExpenses();
    return;
  }

  renderExpenses();
}

// Clear validation messages when the user edits the form
expenseForm.addEventListener("input", () => {
  formMessage.textContent = "";
});
