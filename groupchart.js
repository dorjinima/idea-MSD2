document.addEventListener("DOMContentLoaded", () => {
  // ====== HEADER CLOCK ======
  const clockEl = document.getElementById("groupchart-clock");
  const dayEl = document.getElementById("groupchart-day");
  const dateEl = document.getElementById("groupchart-date");

  function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString();
    dayEl.textContent = now.toLocaleDateString("en-US", { weekday: "long" });
    dateEl.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // ====== ELEMENTS ======
  const addGroupBtn = document.getElementById("addgroupbht");
  const groupForm = document.getElementById("addGroupchartForm");
  const tableContainer = document.querySelector(".table-container5");
  const searchInput = document.getElementById("searchHotel");
  const searchBtn = document.getElementById("searchHotelBtn");
  const tableBody = document.querySelector(".styled-table5 tbody");

  // ====== LOCAL STORAGE ======
  const STORAGE_KEY = "groupChartRecords";
  let groupChartData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // ====== PAGINATION ======
  let currentPage = 1;
  const rowsPerPage = 5;

  // ====== TOGGLE FORM ======
  addGroupBtn.addEventListener("click", () => {
    const showForm = groupForm.style.display === "none";
    groupForm.style.display = showForm ? "block" : "none";
    tableContainer.style.display = showForm ? "none" : "block";
  });

  // ====== TAB SWITCHING ======
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.toggle("active", tab.id === target);
      });
    });
  });

  // ====== RENDER TABLE ======
  function renderTable(data) {
    tableBody.innerHTML = "";

    if (!data.length) {
      tableBody.innerHTML = `<tr><td colspan="19" style="text-align:center; color:#888;">No records found</td></tr>`;
      return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const pageData = data.slice(start, start + rowsPerPage);

    pageData.forEach((record, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${start + index + 1}</td>
        <td>${record.confirmationDate || "-"}</td>
        <td>${record.fileNo || ""} / ${record.groupName || ""}</td>
        <td>${record.company || "-"}</td>
        <td>${record.hotelDetails || "-"}</td>
        <td>${record.paxTotal || 0}</td>
        <td>${record.paxRgnl || 0}</td>
        <td>${record.paxIntl || 0}</td>
        <td>${(record.paxRgnl || 0) + (record.paxIntl || 0)}</td>
        <td>${record.arrivalDate || "-"}</td>
        <td>${record.departureDate || "-"}</td>
        <td>${record.noOfNights || "-"}</td>
        <td>${record.arrivalSector || "-"}</td>
        <td>${record.departureSector || "-"}</td>
        <td>${record.guideDetails || "-"}</td>
        <td>${record.vehicleDetailsBhutan || "-"}</td>
        <td>${record.vehicleDetailsIndia || "-"}</td>
        <td>${record.notes || "-"}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);

      row.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Are you sure to delete this record?")) {
          groupChartData.splice(start + index, 1);
          saveData();
          renderTable(groupChartData);
        }
      });

      row.querySelector(".edit-btn").addEventListener("click", () => {
        alert("Edit functionality can be implemented here.");
      });
    });
  }

  // ====== SAVE TO STORAGE ======
  function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groupChartData));
  }

  // ====== SEARCH ======
  searchBtn.addEventListener("click", () => {
    const term = searchInput.value.toLowerCase();
    const filtered = groupChartData.filter(
      (r) =>
        (r.groupName && r.groupName.toLowerCase().includes(term)) ||
        (r.company && r.company.toLowerCase().includes(term))
    );
    currentPage = 1;
    renderTable(filtered);
  });

  // ====== PAGINATION ======
  document.getElementById("prevHotelPageBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable(groupChartData);
    }
  });

  document.getElementById("nextHotelPageBtn").addEventListener("click", () => {
    if (currentPage * rowsPerPage < groupChartData.length) {
      currentPage++;
      renderTable(groupChartData);
    }
  });

  // ====== ITINERARY DATES EXTRACTION ======
  function extractItineraryDates() {
    return groupChartData.map((record, index) => ({
      itinerary: index + 1,
      startDate: record.arrivalDate || "N/A",
      endDate: record.departureDate || "N/A",
    }));
  }

  // Example usage:
  console.log("Itinerary Dates:", extractItineraryDates());

  // ====== INITIAL RENDER ======
  renderTable(groupChartData);
});

// ====== GUIDE FORM HANDLING ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("allocateGuideForm");
  const addBtn = document.querySelector("#guideForm .add-btn");

  addBtn.addEventListener("click", () => {
    const firstEntry = form.querySelector(".guide-entry");
    const newEntry = firstEntry.cloneNode(true);

    newEntry.querySelectorAll("input").forEach((input) => {
      if (input.placeholder !== "Sl") input.value = "";
    });

    const allEntries = form.querySelectorAll(".guide-entry");
    newEntry.querySelector('input[placeholder="Sl"]').value =
      allEntries.length + 1;
    form.appendChild(newEntry);
  });

  form.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const entries = form.querySelectorAll(".guide-entry");
      if (entries.length > 1) {
        e.target.closest(".guide-entry").remove();
        form.querySelectorAll(".guide-entry").forEach((entry, i) => {
          entry.querySelector('input[placeholder="Sl"]').value = i + 1;
        });
      } else {
        alert("At least one guide entry is required.");
      }
    }
  });
});

// PULL FUNCTION FOR DATE IN ITNERARY //
function generateItinerary() {
  const arrivalInput = document.getElementById("arrivalDate");
  const arrivalStationInput = document.getElementById("arrivalStation");
  const departureInput = document.getElementById("departureDate");
  const departureStationInput = document.getElementById("departureStation");
  const tbody = document.querySelector("#itineraryTable tbody");
  tbody.innerHTML = "";

  const arrivalDateStr = arrivalInput.value;
  const departureDateStr = departureInput.value;
  const arrivalStation = arrivalStationInput.value.trim();
  const departureStation = departureStationInput.value.trim();

  if (!arrivalDateStr || !departureDateStr) {
    alert("Please enter both arrival and departure dates.");
    return;
  }

  const startDate = new Date(arrivalDateStr);
  const endDate = new Date(departureDateStr);

  if (endDate < startDate) {
    alert("Departure date must be after arrival date.");
    return;
  }

  const totalDays =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const row = document.createElement("tr");

    // Day label
    const dayCell = document.createElement("td");
    dayCell.textContent = `Day ${i + 1}`;
    row.appendChild(dayCell);

    // Date label
    const dateCell = document.createElement("td");
    dateCell.textContent = currentDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    row.appendChild(dateCell);

    // Editable input fields
    const fromCell = document.createElement("td");
    const dayTripCell = document.createElement("td");
    const toCell = document.createElement("td");

    const fromInput = document.createElement("input");
    fromInput.type = "text";
    fromInput.placeholder = "From";
    fromInput.value = i === 0 ? arrivalStation : "";

    const dayTripInput = document.createElement("input");
    dayTripInput.type = "text";
    dayTripInput.placeholder = "Day Trip";

    const toInput = document.createElement("input");
    toInput.type = "text";
    toInput.placeholder = "To";
    toInput.value = i === totalDays - 1 ? departureStation : "";

    fromCell.appendChild(fromInput);
    dayTripCell.appendChild(dayTripInput);
    toCell.appendChild(toInput);

    row.appendChild(fromCell);
    row.appendChild(dayTripCell);
    row.appendChild(toCell);

    tbody.appendChild(row);
  }
}

//prompt//
document.addEventListener("DOMContentLoaded", () => {
  let expenses = [];
  let total = 0;
  let isViewMode = false;

  const impButton = document.querySelector(".action-btn");
  const addButton = document.querySelector(".add-btn");

  // IMP button logic
  impButton.addEventListener("click", () => {
    if (isViewMode) {
      let summary = "💰 Imprest Summary:\n\n";
      expenses.forEach((e, i) => {
        summary += `${i + 1}. ${e.type}: Nu. ${e.amount.toFixed(2)}\n`;
      });
      summary += `\n🧾 Total: Nu. ${total.toFixed(2)}`;
      alert(summary);
      return;
    }

    expenses = [];
    total = 0;

    const count = parseInt(
      prompt("HOW MANY EXPENSE TYPES WOULD YOU LIKE TO ENTER?"),
      10
    );
    if (isNaN(count) || count <= 0) {
      alert("INVALID NUMBER OF ENTRIES!");
      return;
    }

    for (let i = 0; i < count; i++) {
      const type = prompt(`ENTER EXPENSE TYPE #${i + 1}:`);
      if (!type) {
        alert("EXPENSE TYPE CANNOT BE EMPTY!");
        return;
      }

      const amount = parseFloat(prompt(`ENTER AMOUNT FOR: \"${type}\":`));
      if (isNaN(amount) || amount < 0) {
        alert("INVALID AMOUNT!");
        return;
      }

      expenses.push({ type, amount });
      total += amount;
    }

    isViewMode = true;
    impButton.textContent = "View IMP";
    alert("✅YOUR ENTRIES HAVE BEEN SAVED — CLICK AGAIN TO SEE THE SUMMARY.");
  });

  // Clone button triggers refresh
  addButton.addEventListener("click", () => {
    // Then trigger IMP refresh
    document.dispatchEvent(new Event("cloneGuideEntry"));
  });

  // Reset IMP state and auto-trigger entry
  document.addEventListener("cloneGuideEntry", () => {
    expenses = [];
    total = 0;
    isViewMode = false;
    impButton.textContent = "IMP";
    impButton.click();
  });
});

// ====== VEHICLE FORM HANDLING ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("allocateVech3Form");
  const addBtn = document.querySelector("#vehicleForm .add-btn");

  // Clone and reset new vehicle entry
  addBtn.addEventListener("click", () => {
    const firstEntry = form.querySelector(".vech3-entry");
    const newEntry = firstEntry.cloneNode(true);

    // Clear all inputs except Sl
    newEntry.querySelectorAll("input").forEach((input) => {
      if (input.placeholder !== "Sl") input.value = "";
    });

    // Reset select dropdown to first option
    const select = newEntry.querySelector("select");
    if (select) select.selectedIndex = 0;

    // Update serial number
    const allEntries = form.querySelectorAll(".vech3-entry");
    newEntry.querySelector('input[placeholder="Sl"]').value =
      allEntries.length + 1;

    form.appendChild(newEntry);
  });

  // Remove vehicle entry
  form.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const entries = form.querySelectorAll(".vech3-entry");
      if (entries.length > 1) {
        e.target.closest(".vech3-entry").remove();
        form.querySelectorAll(".vech3-entry").forEach((entry, i) => {
          entry.querySelector('input[placeholder="Sl"]').value = i + 1;
        });
      } else {
        alert("At least one vehicle entry is required.");
      }
    }
  });
});

// ====== VEHICLE FORM HANDLING (v4) ======
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("allocateVech4Form");
  const addBtn = document.querySelector("#vehicleFormV4 .add-btn-v4");

  // Clone and reset new vehicle entry
  addBtn.addEventListener("click", () => {
    const firstEntry = form.querySelector(".vech4-entry");
    const newEntry = firstEntry.cloneNode(true);

    // Clear all inputs except Sl
    newEntry.querySelectorAll("input").forEach((input) => {
      if (input.placeholder !== "Sl") input.value = "";
    });

    // Reset all selects to first option
    newEntry.querySelectorAll("select").forEach((select) => {
      select.selectedIndex = 0;
    });

    // Update serial number
    const allEntries = form.querySelectorAll(".vech4-entry");
    newEntry.querySelector('input[placeholder="Sl"]').value =
      allEntries.length + 1;

    form.appendChild(newEntry);
  });

  // Remove vehicle entry
  form.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn-v4")) {
      const entries = form.querySelectorAll(".vech4-entry");
      if (entries.length > 1) {
        e.target.closest(".vech4-entry").remove();
        form.querySelectorAll(".vech4-entry").forEach((entry, i) => {
          entry.querySelector('input[placeholder="Sl"]').value = i + 1;
        });
      } else {
        alert("At least one vehicle entry is required.");
      }
    }
  });
});

// HOTEL MANAGE SECTION UNDER THE GROUP CHRT
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#hotelDetailsTable5 tbody");

  // Auto-calculate nights when dates change
  tableBody.addEventListener("change", (e) => {
    const row = e.target.closest("tr");
    const checkInInput = row.querySelector('input[name="checkIn"]');
    const checkOutInput = row.querySelector('input[name="checkOut"]');
    const nightsInput = row.querySelector('input[name="nights"]');

    if (checkInInput && checkOutInput && nightsInput) {
      const checkInDate = new Date(checkInInput.value);
      const checkOutDate = new Date(checkOutInput.value);

      if (!isNaN(checkInDate) && !isNaN(checkOutDate)) {
        const diffTime = checkOutDate - checkInDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        nightsInput.value = diffDays > 0 ? diffDays : 0;
      }
    }
  });

  // Clone and remove row logic
  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr");

    // Clone row
    if (e.target.classList.contains("add-btn")) {
      const clone = row.cloneNode(true);

      // Clear input/select values except dropdown defaults
      clone.querySelectorAll("input").forEach((input) => (input.value = ""));
      clone
        .querySelectorAll("select")
        .forEach((select) => (select.selectedIndex = 0));

      tableBody.appendChild(clone);
    }
    if (e.target.classList.contains("remove-btn")) {
      const allRows = tableBody.querySelectorAll("tr");
      if (allRows.length > 1) {
        row.remove();
      } else {
        alert("At least one hotel entry is required.");
      }
    }
  });
});

// Traveler /Document//

document.addEventListener("DOMContentLoaded", () => {
  const inputTable = document.querySelector("#travelerForm .table-wrapper table tbody");
  const summaryTable = document.querySelector(".form-middlefields .uniform-table tbody");

  const updateSummary = () => {
    const inputRows = inputTable.querySelectorAll("tr");
    const summaryRows = summaryTable.querySelectorAll("tr");

    let totalRgnl = 0, totalIntl = 0, totalOthr = 0;

    inputRows.forEach((row, i) => {
      const inputs = row.querySelectorAll("input");
      const rgnl = parseInt(inputs[0].value) || 0;
      const intl = parseInt(inputs[1].value) || 0;
      const othr = parseInt(inputs[2].value) || 0;

      // Update summary row cells
      summaryRows[i].children[1].textContent = rgnl;
      summaryRows[i].children[2].textContent = intl;
      summaryRows[i].children[3].textContent = othr;

      totalRgnl += rgnl;
      totalIntl += intl;
      totalOthr += othr;
    });

    // Update total row
    const totalRow = summaryRows[3];
    totalRow.children[1].innerHTML = `<b>${totalRgnl}</b>`;
    totalRow.children[2].innerHTML = `<b>${totalIntl}</b>`;
    totalRow.children[3].innerHTML = `<b>${totalOthr}</b>`;
  };

  // Attach listeners to all inputs
  inputTable.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateSummary);
  });

  // Initial sync
  updateSummary();
});

//services Inclusion //
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (e) {
    // ===== ADD BUTTON =====
    if (e.target.classList.contains("add-btn")) {
      const type = e.target.dataset.type; // e.g., data-type="guide" or "hotel"
      const entry = e.target.closest(`.${type}-entry`);
      if (!entry) return;

      const clone = entry.cloneNode(true);

      // Reset input, select, and textarea fields
      clone.querySelectorAll("input, select, textarea").forEach((el) => {
        if (el.type === "checkbox" || el.type === "radio") {
          el.checked = false;
        } else {
          el.value = "";
        }
      });

      // Append new cloned entry
      entry.parentNode.appendChild(clone);
    }
    if (e.target.classList.contains("remove-btn")) {
      const entry = e.target.closest("div.flex-row");
      if (!entry) return;

      const parent = entry.parentNode;
      if (parent.children.length > 1) {
        entry.remove();
      } else {
        alert("At least one entry must remain.");
      }
    }
  });
});

//Travelers document//
document.addEventListener("DOMContentLoaded", () => {
  const departureInput = document.querySelector("#departureDate");
  const tableBody = document.querySelector("#permitForm tbody");
  const addRowBtn = document.querySelector("#addRowBtn");
  const cloneRowBtn = document.querySelector(".clone-row-btn");

  // === Validity Calculation ===
  function calculateValidity(row) {
    const expiryInput = row.querySelector('input[name="expiryDate"]');
    const validityInput = row.querySelector('input[name="validity"]');
    const expiryDate = new Date(expiryInput.value);
    const departureDate = new Date(departureInput.value);

    if (isNaN(expiryDate) || isNaN(departureDate)) {
      validityInput.value = "";
      return;
    }

    if (expiryDate < departureDate) {
      validityInput.value = "Expired";
      return;
    }

    let years = expiryDate.getFullYear() - departureDate.getFullYear();
    let months = expiryDate.getMonth() - departureDate.getMonth();
    let days = expiryDate.getDate() - departureDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), 0).getDate();
      days += prevMonthDays;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    validityInput.value = `${totalMonths} month${totalMonths !== 1 ? "s" : ""}, ${days} day${days !== 1 ? "s" : ""}`;
  }

  // === Age Calculation ===
  function calculateAge(row) {
    const dobInput = row.querySelector('input[name="dob"]');
    const ageInput = row.querySelector('input[name="age"]');
    const dob = new Date(dobInput.value);
    const today = new Date();

    if (isNaN(dob.getTime())) {
      ageInput.value = "";
      return;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    ageInput.value = age >= 0 ? age : "";
  }

  // === Remarks Add/Remove ===
  function bindRemarks(row) {
    const addBtn = row.querySelector(".add-btn");
    const remarksContainer = row.querySelector("td > div");

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "display:flex; align-items:center; gap:6px; margin-top:6px;";

        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.name = "remarks";
        newInput.placeholder = "Remarks";
        newInput.style.cssText = "flex:1; padding:6px; border:1px solid #ccc; border-radius:4px;";

        const removeIcon = document.createElement("button");
        removeIcon.type = "button";
        removeIcon.innerHTML = "❌";
        removeIcon.style.cssText = "padding:4px 8px; border:none; background:#e74c3c; color:#fff; border-radius:4px; cursor:pointer;";
        removeIcon.addEventListener("click", () => {
          wrapper.remove();
        });

        wrapper.appendChild(newInput);
        wrapper.appendChild(removeIcon);
        remarksContainer.insertBefore(wrapper, addBtn);
      });
    }
  }
  function bindRowEvents(row) {
    const expiryInput = row.querySelector('input[name="expiryDate"]');
    const dobInput = row.querySelector('input[name="dob"]');

    if (expiryInput) expiryInput.addEventListener("change", () => calculateValidity(row));
    if (departureInput) departureInput.addEventListener("change", () => calculateValidity(row));
    if (dobInput) {
      dobInput.addEventListener("change", () => calculateAge(row));
      dobInput.addEventListener("input", () => calculateAge(row));
    }

    bindRemarks(row);
  }
  function cloneRow() {
    const firstRow = tableBody.querySelector("tr");
    if (!firstRow) return;

    const newRow = firstRow.cloneNode(true);
    newRow.querySelectorAll("input, select").forEach(input => input.value = "");

    const remarksContainer = newRow.querySelector("td > div");
    if (remarksContainer) {
      remarksContainer.querySelectorAll("div").forEach(div => {
        if (div.querySelector('input[name="remarks"]')) div.remove();
      });
    }

    bindRowEvents(newRow);
    tableBody.appendChild(newRow);
  }

  document.querySelectorAll("#permitForm tbody tr").forEach(bindRowEvents);
  if (addRowBtn) addRowBtn.addEventListener("click", cloneRow);
  if (cloneRowBtn) cloneRowBtn.addEventListener("click", cloneRow);
});

  document.querySelectorAll(".sideBtn").forEach(btn => {
    btn.addEventListener("click", function () {

      document.querySelectorAll(".sideBtn").forEach(b => b.style.background = "#4b9b4b");
      this.style.background = "#6fa96e";

      document.querySelectorAll(".content-section").forEach(sec => sec.style.display = "none");
      const target = this.dataset.content;
      document.getElementById(target).style.display = "block";
    });
  });

  //wellcome letter//
function printWelcomeLetter() {
  const buttons = document.querySelectorAll('.action-btn');
  buttons.forEach(btn => btn.style.display = 'none');

  const content = document.getElementById('welcome').innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Welcome Letter</title>');
  printWindow.document.write('<style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;} h3{color:#2e5939;}</style>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(content);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    buttons.forEach(btn => btn.style.display = '');
  };
}

//Rooming List Js//
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('addInnerRowBtn')) {
      const table = e.target.closest('.guestInnerTable').querySelector('tbody');
      const newRow = table.rows[0].cloneNode(true);
      newRow.querySelectorAll('input').forEach(input => input.value = '');
      table.appendChild(newRow);
    }

    if (e.target.classList.contains('removeInnerRowBtn')) {
      const row = e.target.closest('tr');
      const table = e.target.closest('.guestInnerTable').querySelector('tbody');
      if (table.rows.length > 1) row.remove();
    }

    if (e.target.classList.contains('addMainRowBtn')) {
      const mainTable = document.querySelector('#roomingListTable tbody');
      const newRow = e.target.closest('.mainRow').cloneNode(true);
      newRow.querySelectorAll('input').forEach(input => input.value = '');
      mainTable.appendChild(newRow);
    }

    if (e.target.classList.contains('removeMainRowBtn')) {
      const row = e.target.closest('.mainRow');
      const mainTable = document.querySelector('#roomingListTable tbody');
      if (mainTable.rows.length > 1) row.remove();
    }
  });

 // Function to auto-pull data Pax name conformation
  function autoFillVoucher() {
    const fileNo = document.getElementById('groupchart-fileNo').value;
    const groupName = document.getElementById('groupchart-groupName').value;
    const company = document.getElementById('groupchart-company').value;
    const voucherInputs = document.querySelectorAll('#voucher input');

    voucherInputs[0].value = fileNo;       
    voucherInputs[1].value = groupName;    
    voucherInputs[2].value = company;      
  }

  // Arrival and Departure
  const groupChartInputs = document.querySelectorAll('#addGroupchartForm input');
  groupChartInputs.forEach(input => {
    input.addEventListener('input', autoFillVoucher);
  });

  function autoFillArrivalDeparture() {
   
    const arrivalDate = document.querySelectorAll('#arrivalDate')[0].value;
    const arrivalTime = document.querySelectorAll('#arrivalDate')[0].closest('table').querySelector('input[type="time"]').value;
    const arrivalStation = document.querySelectorAll('#arrivalStation')[0].value;
    const arrivalFlight = document.querySelectorAll('#arrivalStation')[0].closest('table').querySelectorAll('input[type="text"]')[1].value;

    
    const departureDate = document.querySelectorAll('#departureDate')[0].value;
    const departureTime = document.querySelectorAll('#departureDate')[0].closest('table').querySelector('input[type="time"]').value;
    const departureStation = document.querySelectorAll('#departureStation')[0].value;
    const departureFlight = document.querySelectorAll('#departureStation')[0].closest('table').querySelectorAll('input[type="text"]')[1].value;
    
    const targetArrivalInputs = document.querySelectorAll('#arrivalDate')[1].closest('table').querySelectorAll('input');
    targetArrivalInputs[0].value = arrivalDate;
    targetArrivalInputs[1].value = arrivalTime;
    targetArrivalInputs[2].value = arrivalStation;
    targetArrivalInputs[3].value = arrivalFlight;

    const targetDepartureInputs = document.querySelectorAll('#departureDate')[1].closest('table').querySelectorAll('input');
    targetDepartureInputs[0].value = departureDate;
    targetDepartureInputs[1].value = departureTime;
    targetDepartureInputs[2].value = departureStation;
    targetDepartureInputs[3].value = departureFlight;
  }
  const arrivalDepartureInputs = document.querySelectorAll('#arrivalDate, #departureDate, #arrivalStation, #departureStation');
  arrivalDepartureInputs.forEach(input => {
    input.addEventListener('input', autoFillArrivalDeparture);
  });

  //auto pax detail /Nationality//
  function updateDisplayTable() {
    const inputRows = document.querySelectorAll('#Data-Details tbody tr');
    const displayRows = document.querySelectorAll('#Display-Details tbody tr');

    let totalRgnl = 0, totalIntl = 0, totalOthr = 0;

    inputRows.forEach((row, i) => {
      const inputs = row.querySelectorAll('input');
      const displayCells = displayRows[i].querySelectorAll('td');

      const rgnl = Number(inputs[0].value) || 0;
      const intl = Number(inputs[1].value) || 0;
      const othr = Number(inputs[2].value) || 0;

      displayCells[1].textContent = rgnl;
      displayCells[2].textContent = intl;
      displayCells[3].textContent = othr;
      totalRgnl += rgnl;
      totalIntl += intl;
      totalOthr += othr;
    });
    const totalCells = displayRows[displayRows.length - 1].querySelectorAll('td');
    totalCells[1].textContent = totalRgnl;
    totalCells[2].textContent = totalIntl;
    totalCells[3].textContent = totalOthr;
  }
  const paxInputs = document.querySelectorAll('#Data-Details input');
  paxInputs.forEach(input => {
    input.addEventListener('input', updateDisplayTable);
  });
  updateDisplayTable();


// === AUTO CLONE TRAVELER ROWS BASED ON TOTAL PAX ===
function autoCloneTravelerRows() {
  // 🔹 Get total pax count from the last row of the Display-Details table
  const paxTable = document.querySelector('#Display-Details');
  let totalVisitors = 0;

  if (paxTable) {
    const rows = paxTable.querySelectorAll('tbody tr');
    const totalRow = rows[rows.length - 1]; // Last row = "Total"
    if (totalRow) {
      const cells = totalRow.querySelectorAll('td');
      // Sum of Rgnl', Intl', and Othr' columns
      totalVisitors = [...cells].slice(1).reduce((sum, cell) => {
        const num = parseInt(cell.textContent.trim()) || 0;
        return sum + num;
      }, 0);
    }
  }

  // Fallback if table is empty
  if (totalVisitors <= 0) totalVisitors = 1;

  // 🔹 Now clone traveler rows according to total pax
  const permitTable = document.querySelector('#travelerTable tbody');
  const firstRow = permitTable.querySelector('tr');
  permitTable.innerHTML = '';

  for (let i = 0; i < totalVisitors; i++) {
    const clone = firstRow.cloneNode(true);
    clone.querySelectorAll('input, select').forEach(el => el.value = '');
    const numCell = clone.querySelector('.row-num');
    if (numCell) numCell.textContent = i + 1;
    const nameField = clone.querySelector('input[name="name"]');
    if (nameField) nameField.placeholder = "Traveler " + (i + 1);
    permitTable.appendChild(clone);
  }

  attachAutoCalculations();
}

// === AUTO CALCULATE VALIDITY (Expiry - Today) & AGE (DOB) ===
function attachAutoCalculations() {
  const rows = document.querySelectorAll('#travelerTable tbody tr');

  rows.forEach(row => {
    const expiryInput = row.querySelector('input[name="expiryDate"]');
    const validityInput = row.querySelector('input[name="validity"]');
    const dobInput = row.querySelector('input[name="dob"]');
    const ageInput = row.querySelector('input[name="age"]');

    if (!expiryInput || !validityInput || !dobInput || !ageInput) return;
    expiryInput.onchange = null;
    dobInput.onchange = null;
    expiryInput.addEventListener('change', () => {
      const today = new Date();
      const expiry = new Date(expiryInput.value);
      if (expiry && expiry > today) {
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        validityInput.value = diffDays + " days";
      } else {
        validityInput.value = "Expired";
      }
    });
    dobInput.addEventListener('change', () => {
      const dob = new Date(dobInput.value);
      if (dob) {
        const diff = Date.now() - dob.getTime();
        const ageDate = new Date(diff);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        ageInput.value = age + " yrs";
      }
    });
  });
}
attachAutoCalculations();
document.querySelector('#permitForm .clone-row-btn')
  .addEventListener('click', autoCloneTravelerRows);


