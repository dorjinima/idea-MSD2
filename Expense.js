document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const expenseBtn = document.getElementById("expenseBtn");
  const expenseForm = document.getElementById("expenseForm");
  const cancelBtn = expenseForm.querySelector(".cancel-btn");
  const saveBtn = expenseForm.querySelector(".save-btn");
  const expenseTableContainer = document.querySelector(".expense-table-container");
  const expenseTableBody = document.getElementById("expenseTableBody");
  const searchInput = document.getElementById("searchHotel");
  const prevBtn = document.getElementById("prevExpensePageBtn");
  const nextBtn = document.getElementById("nextExpensePageBtn");
  const shareBtn = document.getElementById("shareExpenseBtn");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let editIndex = null;
  let currentPage = 1;
  const rowsPerPage = 10;

  // Break text after n words
  function breakWords(text, n = 16) {
    return text.split(" ").reduce((acc, word, i) => {
      return acc + word + ((i + 1) % n === 0 ? "<br>" : " ");
    }, "").trim();
  }

  // Show Form
  expenseBtn.addEventListener("click", () => {
    expenseForm.style.display = "block";
    expenseForm.reset();
    expenseTableContainer.style.display = "none";
    editIndex = null;
  });

  // Cancel Form
  cancelBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
      expenseForm.style.display = "none";
      expenseForm.reset();
      expenseTableContainer.style.display = "block";
    }
  });

  // Save Expense
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("Name").value.trim();
    const location = document.getElementById("expensePlace/Location").value.trim();
    const visitingHours = document.getElementById("expenseVisiting Hours").value.trim();
    const intlTourists = document.getElementById("expenseIntl'Tourists").value.trim();
    const reglTourists = document.getElementById("expenseRegl'Tourists").value.trim();
    const remarks = document.getElementById("expenseRemarks").value.trim();

    if (!name || !location || !visitingHours || !intlTourists || !reglTourists || !remarks) {
      alert("All fields are required to save.");
      return;
    }

    if (editIndex === null && expenses.some(exp => exp.Name.toLowerCase() === name.toLowerCase())) {
      alert("An expense with this name already exists.");
      return;
    }

    if (!confirm("Do you want to save this expense record?")) return;

    const expenseData = { Name: name, Location: location, VisitingHours: visitingHours, IntlTourists: intlTourists, ReglTourists: reglTourists, Remarks: remarks };

    if (editIndex !== null) {
      expenses[editIndex] = expenseData;
      editIndex = null;
    } else {
      expenses.push(expenseData);
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.style.display = "none";
    expenseForm.reset();
    expenseTableContainer.style.display = "block";
    currentPage = 1;
    renderTable();
  });

  // Render Table
  function renderTable(list = expenses) {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedExpenses = list.slice(start, end);

    expenseTableBody.innerHTML = "";
    paginatedExpenses.forEach((expense, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${expense.Name}</td>
        <td>${expense.Location}</td>
        <td>${breakWords(expense.VisitingHours)}</td>
        <td>${breakWords(expense.IntlTourists)}</td>
        <td>${breakWords(expense.ReglTourists)}</td>
        <td>${breakWords(expense.Remarks)}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;

      // Edit with confirmation prompt
      row.querySelector(".edit-btn").addEventListener("click", () => {
        const proceed = confirm("Do you want to edit this expense record?");
        if (!proceed) return;

        // Optional: prompt to edit Name immediately
        const newName = prompt("Edit Name:", expense.Name);
        if (newName !== null && newName.trim() !== "") expense.Name = newName.trim();

        document.getElementById("Name").value = expense.Name;
        document.getElementById("expensePlace/Location").value = expense.Location;
        document.getElementById("expenseVisiting Hours").value = expense.VisitingHours;
        document.getElementById("expenseIntl'Tourists").value = expense.IntlTourists;
        document.getElementById("expenseRegl'Tourists").value = expense.ReglTourists;
        document.getElementById("expenseRemarks").value = expense.Remarks;
        expenseForm.style.display = "block";
        expenseTableContainer.style.display = "none";
        editIndex = start + index;
      });

      // Delete
      row.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this record?")) {
          expenses.splice(start + index, 1);
          localStorage.setItem("expenses", JSON.stringify(expenses));
          renderTable();
        }
      });

      expenseTableBody.appendChild(row);
    });
  }

  // Live Search
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = expenses.filter(exp =>
      exp.Name.toLowerCase().includes(searchTerm) ||
      exp.Location.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable(filtered);
  });

  // Pagination
  prevBtn.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTable(); } });
  nextBtn.addEventListener("click", () => { if (currentPage * rowsPerPage < expenses.length) { currentPage++; renderTable(); } });

  // Share PDF (only specific columns)
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Expense Records", 14, 15);

      const table = document.querySelector(".expense-table");
      const rows = [];
      
      const headers = ["SI NO", "Temples & Monuments", "Place/Location", "Visiting Hours", "Intl'Tourists", "Regl'Tourists", "Remarks"];
      
      Array.from(table.querySelectorAll("tbody tr")).forEach(tr => {
        const tds = tr.querySelectorAll("td");
        rows.push([
          tds[0].innerText,
          tds[1].innerText, 
          tds[2].innerText, 
          tds[3].innerText, 
          tds[4].innerText, 
          tds[5].innerText, 
          tds[6].innerText  
        ]);
      });

      doc.autoTable({ 
        head: [headers], 
        body: rows, 
        startY: 20, 
        styles: { fontSize: 9, cellPadding: 1 }, 
        headStyles: { fillColor: [230, 230, 230] } 
      });
      doc.save("Expense_Records.pdf");
      alert("PDF generated successfully!");
    });
  }

  // Initial render
  renderTable();
});
