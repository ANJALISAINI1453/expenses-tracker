document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list").getElementsByTagName('tbody')[0];
    const totalAmount = document.getElementById("total-amount");
    const filterMonth = document.getElementById("filter-month");
    const monthlyTotal = document.getElementById("monthly-total");

    // Load expenses from localStorage
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    // Handle form submission
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        expenseForm.reset();
        updateTotalAmount();
    });

    // Filter expenses by month
    filterMonth.addEventListener("change", (e) => {
        const month = e.target.value;
        displayExpenses(month);
    });

    // Function to display expenses
    function displayExpenses(month) {
        expenseList.innerHTML = "";
        let total = 0;

        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            const expenseMonth = expenseDate.toLocaleString('default', { month: 'long' });

            // Check if the expense matches the selected month
            if (month === "All" || expenseMonth === month) {
                const row = expenseList.insertRow();
                row.innerHTML = `
                    <td>${expense.name}</td>
                    <td>₹${expense.amount.toFixed(2)}</td>
                    <td>${expense.category}</td>
                    <td>${expenseDate.toLocaleDateString()}</td>
                    <td><button onclick="deleteExpense(${expense.id})">Delete</button></td>
                `;
                total += expense.amount; // Calculate total for the displayed expenses
            }
        });

        // Update the monthly total display
        monthlyTotal.innerText = `₹${total.toFixed(2)}`;
    }

    // Function to delete an expense
    window.deleteExpense = function(id) {
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        displayExpenses(filterMonth.value); // Refresh the displayed expenses
        updateTotalAmount();
    };

    // Function to update the total amount display
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.innerText = `₹${total.toFixed(2)}`;
    }

    // Initial display of expenses
    displayExpenses("All");
});