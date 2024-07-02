let expenses = [];
let totalAmount = 0;

const expname = document.getElementById('expense-name');
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const searchInput = document.getElementById('search-input');
const monthSelect = document.getElementById('month-select');
const sortCategorySelect = document.getElementById('sort-category');
const sortAscDescSelect = document.getElementById('sort-ad');
const sortAmountBtn = document.getElementById('sort-amount-btn');

function updateTableAndTotal() {
    expensesTableBody.innerHTML = '';
    totalAmount = 0;

    let displayedExpenses = expenses;

    // Filter by search term
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        displayedExpenses = displayedExpenses.filter(expense =>
            expense.category.toLowerCase().includes(searchTerm) ||
            expense.amount.toString().includes(searchTerm) ||
            expense.date.includes(searchTerm) ||
            expense.ename.toLowerCase().includes(searchTerm)
        );
    }

    // Filter by month
    const selectedMonth = monthSelect.value;
    if (selectedMonth) {
        displayedExpenses = displayedExpenses.filter(expense =>
            expense.date.startsWith(selectedMonth)
        );
    }

    // Display only the recent 10 expenses
    const recentExpenses = displayedExpenses.slice(-10);

    recentExpenses.forEach(expense => {
        totalAmount += expense.amount;

        const newRow = expensesTableBody.insertRow();
        const nameCell = newRow.insertCell();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const actionsCell = newRow.insertCell();

        nameCell.textContent = expense.ename;
        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
            expenses.splice(expenses.indexOf(expense), 1);
            updateTableAndTotal();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', function() {
            expname.value = expense.ename;
            categorySelect.value = expense.category;
            amountInput.value = expense.amount;
            dateInput.value = expense.date;
            expenses.splice(expenses.indexOf(expense), 1);
            updateTableAndTotal();
        });

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
    });

    totalAmountCell.textContent = totalAmount;
}

addBtn.addEventListener('click', function() {
    const ename = expname.value;
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (!category || isNaN(amount) || amount <= 0 || !date || ename == '') {
        alert('Please enter valid details');
        return;
    }

    expenses.push({ ename, category, amount, date });
    updateTableAndTotal();

    expname.value = '';
    categorySelect.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

sortAmountBtn.addEventListener('click', function() {
    const sortBy = sortCategorySelect.value.toLowerCase();
    const sortOrder = sortAscDescSelect.value;

    expenses.sort((a, b) => {
        if (sortBy === 'amount') {
            return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortBy === 'date') {
            return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'name') {
            return sortOrder === 'asc' ? a.ename.localeCompare(b.ename) : b.ename.localeCompare(a.ename);
        } else if (sortBy === 'category') {
            return sortOrder === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
        }
    });

    updateTableAndTotal();
});

searchInput?.addEventListener('input', updateTableAndTotal);
monthSelect.addEventListener('change', updateTableAndTotal);

// Initial load without sorting
updateTableAndTotal();
