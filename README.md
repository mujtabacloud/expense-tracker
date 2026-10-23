
# 💰 Expense Tracker

A simple, responsive Expense Tracker Web App built with HTML, CSS, and vanilla JavaScript. Add expenses, organize them by category, view your total spending, and save your records in your browser.

## ✨ Features

- **Add Expenses:** Enter a title, amount, category, and date.
- **Expense Categories:** Food, Transport, Education, Shopping, and Other.
- **Total Spending:** View the total amount of all recorded expenses.
- **Expense List:** View each expense with its title, category, date, and amount.
- **Delete Expenses:** Remove expenses you no longer need.
- **Local Storage:** Keep expenses saved in your browser after refreshing the page.
- **Input Validation:** Require all fields and amounts greater than zero.
- **Consistent Formatting:** Display amounts with two decimal places.
- **Responsive Design:** Works on mobile, tablet, and desktop.
- **Empty State:** Shows a friendly message when no expenses have been added.

## 🛠️ Technologies Used

- HTML5 — page structure
- CSS3 — styling and responsive layout
- JavaScript — application logic and validation
- localStorage — saving expenses in the browser

No frameworks, external APIs, databases, or backend are required.

## 📁 Project Structure

```text
expense-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

A modern web browser such as Chrome, Firefox, Edge, or Safari.

### Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/mujtabacloud/expense-tracker.git
   ```

2. Open the project folder:

   ```bash
   cd expense-tracker
   ```

3. Open `index.html` in your browser.

For more reliable local storage behavior, you can use the Live Server extension in Visual Studio Code and open the project through its local server.

## 🌐 GitHub Pages Demo

**Live Demo:** https://mujtabacloud.github.io/expense-tracker/

To publish the app:

1. Upload all project files to your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the `main` branch and `/ (root)` folder.
5. Click **Save** and wait for deployment.
6. Visit the demo URL above.

Replace `mujtabacloud` with your GitHub username.

## 💾 Data Storage

Expenses are saved in the browser using `localStorage`.

- Records remain available after refreshing the page.
- Data is specific to the browser and origin being used.
- Clearing browser storage or site data can delete saved expenses.
- Records are not automatically synchronized between devices.

## 🔒 Privacy

This app runs entirely in the browser and does not send expense data to an external server. Avoid relying on browser storage as the only copy of important financial records.

## 📄 License

This project is available for learning and personal use. Add a `LICENSE` file if you want to specify formal reuse and distribution terms.

---

Built with ❤️ using HTML, CSS, and JavaScript.
