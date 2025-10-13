// ============================
// Hotel Management JS NIMA
// ============================

// DOM Elements
const hotelBtn = document.getElementById("hotelBtn");
const hotelForm = document.getElementById("hotelForm");
const hotelTableBody = document.getElementById("hotelTableBody");
const cancelBtn = hotelForm.querySelector(".search-btn");
const saveBtn = hotelForm.querySelector(".add-btn");
const rateTablesContainer = document.getElementById("rateTablesContainer");
const prevBtn = document.getElementById("prevHotelPageBtn");
const nextBtn = document.getElementById("nextHotelPageBtn");
const searchInput = document.getElementById("searchHotel");

const HOTELS_PER_PAGE = 15;
let currentPage = 1;
let editingHotelIndex = null;
let touristTypeTables = {}; 

// ============================
// Toggle Hotel Form
// ============================
hotelForm.style.display = "none";
hotelBtn.addEventListener("click", () => {
  const visible = hotelForm.style.display === "block";
  hotelForm.style.display = visible ? "none" : "block";
  hotelBtn.textContent = visible ? "Add New Hotel" : "Hide Form";
  if (visible) resetForm();
});

// ============================
// Reset Form
// ============================
function resetForm() {
  editingHotelIndex = null;
  hotelForm.reset();
  touristTypeTables = {};
  rateTablesContainer.innerHTML = "";
  ["deptEmailContainer", "deptPhoneContainer", "roomTypesContainer"].forEach(setupClone);
}

// ============================
// Dynamic Inputs (Dept / Room)
// ============================
function setupClone(containerId) {
  const container = document.getElementById(containerId);

  function updateRemoveBtns() {
    const wrappers = container.querySelectorAll(".qty-room-wrapper");
    wrappers.forEach((wrap) => {
      const removeBtn = wrap.querySelector(".remove-room-btn");
      removeBtn.disabled = wrappers.length <= 1;
    });
  }

  function removeItem(e) {
    if (container.querySelectorAll(".qty-room-wrapper").length > 1) {
      e.target.closest(".qty-room-wrapper").remove();
      updateRemoveBtns();
    }
  }

  function addItem() {
    const firstWrapper = container.querySelector(".qty-room-wrapper");
    const clone = firstWrapper.cloneNode(true);
    clone.querySelectorAll("input").forEach((inp) => (inp.value = inp.type === "number" ? "0" : ""));
    clone.querySelector(".remove-room-btn").addEventListener("click", removeItem);
    clone.querySelector(".add-room-btn").addEventListener("click", addItem);
    container.appendChild(clone);
    updateRemoveBtns();
  }

  container.querySelectorAll(".remove-room-btn").forEach((btn) => btn.addEventListener("click", removeItem));
  container.querySelectorAll(".add-room-btn").forEach((btn) => btn.addEventListener("click", addItem));
  updateRemoveBtns();
}

// Initialize clones
setupClone("deptEmailContainer");
setupClone("deptPhoneContainer");
setupClone("roomTypesContainer");

// ============================
// Add Rate Table
// ============================
document.getElementById("addTableBtn").addEventListener("click", () => {
  const type = document.getElementById("touristType").value.trim();
  const from = document.getElementById("rateFrom").value;
  const to = document.getElementById("rateTo").value;
  const remarks = document.getElementById("remarks").value.trim();
  const currency = document.getElementById("currency").value;

  const rooms = Array.from(document.querySelectorAll("#roomTypesContainer .qty-room-wrapper"))
    .map((wrap) => {
      const rt = wrap.querySelector('input[type="text"]').value.trim();
      const qty = parseInt(wrap.querySelector('input[type="number"]').value, 10);
      return rt && qty > 0 ? { rt, qty, ep: {}, cp: {}, map: {}, ap: {} } : null;
    })
    .filter(Boolean);

  if (!type || !from || !to || !currency || rooms.length === 0) {
    alert("Please fill all fields and add at least one room type with quantity > 0.");
    return;
  }

  // Allow multiple date ranges per type
  if (!Array.isArray(touristTypeTables[type])) touristTypeTables[type] = [];
  touristTypeTables[type].push({ from, to, remarks, currency, rooms });
  renderTables();
});

// ============================
// Render Rate Tables
// ============================
function renderTables() {
  rateTablesContainer.innerHTML = "";
  const categories = ["EP", "CP", "MAP", "AP"];
  const subCols = ["Dbl", "Sgl", "EB", "CWB", "CNB"];

  Object.keys(touristTypeTables).forEach((type) => {
    const entries = Array.isArray(touristTypeTables[type]) ? touristTypeTables[type] : [touristTypeTables[type]];

    entries.forEach((data, idx) => {
      const block = document.createElement("div");
      block.className = "saved-block";
      block.innerHTML = `
        <h3>${type} (Entry ${idx + 1})</h3>
        <p>Valid: ${data.from} to ${data.to} | Remarks: ${data.remarks}</p>
        <div style="overflow-x:auto;">
          <table border="1" cellpadding="5">
            <thead>
              <tr>
                <th rowspan="2">Room Type</th>
                <th rowspan="2">Qty</th>
                ${categories.map((c) => `<th colspan="5">${c}</th>`).join("")}
              </tr>
              <tr>
                ${categories.map((c) => subCols.map((sc) => `<th>${sc}</th>`).join("")).join("")}
              </tr>
            </thead>
            <tbody>
              ${data.rooms
                .map((r) => {
                  return `<tr>
                    <td>${r.rt}</td>
                    <td>${r.qty}</td>
                    ${categories.map((c) => subCols.map((sc) => {
                      const val = r[c.toLowerCase()]?.[sc] || "";
                      return `<td class="${c.toLowerCase()}"><input type="text" value="${val}"></td>`;
                    }).join("")).join("")}
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `;
      rateTablesContainer.appendChild(block);
    });
  });
}

// ============================
// Collect Rates
// ============================
function collectRates() {
  const rates = {};
  Object.keys(touristTypeTables).forEach((type) => {
    rates[type] = touristTypeTables[type].map((data, idx) => {
      const block = Array.from(document.querySelectorAll("#rateTablesContainer .saved-block"))
        .find((b) => b.querySelector("h3").textContent === `${type} (Entry ${idx + 1})`);
      const rooms = [];
      if (block) {
        block.querySelectorAll("tbody tr").forEach((tr, i) => {
          const room = data.rooms[i];
          const newRoom = { rt: room.rt, qty: room.qty, ep: {}, cp: {}, map: {}, ap: {} };
          ["ep", "cp", "map", "ap"].forEach((rc) => {
            ["Dbl", "Sgl", "EB", "CWB", "CNB"].forEach((sc, j) => {
              newRoom[rc][sc] = tr.querySelectorAll(`.${rc} input`)[j]?.value.trim() || "";
            });
          });
          rooms.push(newRoom);
        });
      }
      return { from: data.from, to: data.to, remarks: data.remarks, currency: data.currency, rooms };
    });
  });
  return rates;
}

// ============================
// Local Storage Helpers
// ============================
function getHotels() {
  return JSON.parse(localStorage.getItem("hotels")) || [];
}
function saveHotelsToLocal(hotels) {
  localStorage.setItem("hotels", JSON.stringify(hotels));
}
function getDeptData(containerId) {
  return Array.from(document.querySelectorAll(`#${containerId} input[type="text"]`))
    .map((i) => i.value.trim())
    .filter((v) => v)
    .join(",");
}

// ============================
// Render Hotel Table
// ============================
function addHotelRow(hotel, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index}</td>
    <td>${hotel.hotelName}</td>
    <td>${hotel.location}</td>
    <td>${hotel.tcbRating}</td>
    <td>${hotel.phones}</td>
    <td>${hotel.emails}</td>
    <td><button class="edit-btn">Edit</button></td>
  `;
  row.querySelector(".edit-btn").addEventListener("click", () => editHotel(hotel, index));
  hotelTableBody.appendChild(row);
}

function renderHotels() {
  hotelTableBody.innerHTML = "";
  const hotels = getHotels();
  const start = (currentPage - 1) * HOTELS_PER_PAGE;
  const end = start + HOTELS_PER_PAGE;
  hotels.slice(start, end).forEach((h, i) => addHotelRow(h, start + i + 1));
  updatePagination(hotels.length);
}

function updatePagination(total) {
  const totalPages = Math.ceil(total / HOTELS_PER_PAGE);
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderHotels();
  }
});
nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(getHotels().length / HOTELS_PER_PAGE);
  if (currentPage < totalPages) {
    currentPage++;
    renderHotels();
  }
});

// ============================
// Edit Hotel
// ============================
function editHotel(hotel, index) {
  editingHotelIndex = index - 1;
  hotelForm.style.display = "block";
  hotelBtn.textContent = "Hide Form";

  // Fill basic info
  const inputs = hotelForm.querySelectorAll(".form-row input[type='text'], select");
  inputs[0].value = hotel.hotelName;
  inputs[1].value = hotel.location;
  inputs[2].value = hotel.tcbRating;
  inputs[3].value = hotel.category;

  // Fill department emails
  const emailData = hotel.emails.split(",");
  const emailWrappers = document.querySelectorAll("#deptEmailContainer .qty-room-wrapper");
  emailWrappers.forEach((wrap, i) => {
    const inputs = wrap.querySelectorAll("input");
    inputs[0].value = emailData[i * 2] || "";
    inputs[1].value = emailData[i * 2 + 1] || "";
  });

  // Fill department phones
  const phoneData = hotel.phones.split(",");
  const phoneWrappers = document.querySelectorAll("#deptPhoneContainer .qty-room-wrapper");
  phoneWrappers.forEach((wrap, i) => {
    const inputs = wrap.querySelectorAll("input");
    inputs[0].value = phoneData[i * 2] || "";
    inputs[1].value = phoneData[i * 2 + 1] || "";
  });

  // Fill room types & quantities
  const roomWrappers = document.querySelectorAll("#roomTypesContainer .qty-room-wrapper");
  hotel.roomsData?.forEach((r, i) => {
    if (roomWrappers[i]) {
      roomWrappers[i].querySelector('input[type="text"]').value = r.rt;
      roomWrappers[i].querySelector('input[type="number"]').value = r.qty;
    }
  });

  // Restore rate tables
  touristTypeTables = {};
  Object.keys(hotel.rates || {}).forEach(type => {
    touristTypeTables[type] = Array.isArray(hotel.rates[type])
      ? JSON.parse(JSON.stringify(hotel.rates[type]))
      : [JSON.parse(JSON.stringify(hotel.rates[type]))];
  });
  renderTables();
}

// ============================
// Save Hotel
// ============================
saveBtn.type = "button";
saveBtn.addEventListener("click", () => {
  const inputs = hotelForm.querySelectorAll(".form-row input[type='text'], select");
  const hotelName = inputs[0].value.trim();
  const location = inputs[1].value.trim();
  const tcbRating = inputs[2].value.trim();
  const category = inputs[3].value.trim();

  if (!hotelName || !location) {
    alert("Hotel Name & Location required");
    return;
  }

  const confirmSave = confirm("Do you want to save this hotel?");
  if (!confirmSave) return;

  const emails = getDeptData("deptEmailContainer");
  const phones = getDeptData("deptPhoneContainer");
  const rooms = Array.from(document.querySelectorAll("#roomTypesContainer input[type='text']"))
    .map((i) => i.value.trim())
    .filter((v) => v)
    .join(",");
  const rates = collectRates();

  const newHotel = { hotelName, location, tcbRating, category, emails, phones, rooms, rates };
  const hotels = getHotels();
  if (editingHotelIndex !== null) {
    hotels[editingHotelIndex] = newHotel;
    editingHotelIndex = null;
  } else {
    hotels.push(newHotel);
  }

  saveHotelsToLocal(hotels);
  renderHotels();
  alert("Hotel saved successfully!");
});

// ============================
// Cancel Button
// ============================
cancelBtn.addEventListener("click", () => {
  resetForm();
  hotelForm.style.display = "none";
  hotelBtn.textContent = "Add New Hotel";
});

// ============================
// Search
// ============================
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll("#hotelTableBody tr").forEach((row) => {
    const name = row.cells[1].textContent.toLowerCase();
    row.style.display = name.includes(query) ? "" : "none";
  });
});

// ============================
// Initial Render
// ============================
window.addEventListener("load", renderHotels);

