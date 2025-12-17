// --- GLOBAL LOGIN ENFORCEMENT FOR FEATURES ---
function requireLoginThen(view) {
    const user = getCurrentUser && getCurrentUser();
    if (!user) {
        window._afterLoginRedirect = view;
        showLoginModal();
        return;
    }
    switchView(view);
}
/* ================= TRACKENGINE MASTER LOGIC ================= */

let userProfile = { name: "Divyansh", railStars: 58 };
let currentActiveTrain = "12423"; 
let currentPantrySeat = "B1, 45"; 

/* --- PANTRY MENU DATA --- */
const pantryMenu = [
    { id: 1, name: "Veg Noodles", price: 50, icon: "🍜", desc: "300g Veg Noodles + 1 Tomato Sauce Sachet + 1 Paper Napkin + 1 Spoon" },
    { id: 2, name: "Standard Tea", price: 10, icon: "🍵", desc: "150ml Tea + 1 Sugar Pouch + 1 Paper Cup" },
    { id: 3, name: "Coffee", price: 15, icon: "☕", desc: "150ml Coffee + 1 Sugar Pouch + 1 Paper Cup" },
    { id: 4, name: "Rail Neer (1L)", price: 14, icon: "💧", desc: "1 Litre Sealed Bottle" },
    { id: 5, name: "Rail Neer (500ml)", price: 9, icon: "💧", desc: "500ml Sealed Bottle" },
    { id: 6, name: "Veg Biryani", price: 80, icon: "🥗", desc: "270g Biryani + 70g Veg + Curd + Pickle + Tissue + Spoon" },
    { id: 7, name: "Egg Biryani", price: 90, icon: "🍛", desc: "270g Biryani + 2 Eggs + Curd + Pickle + Tissue + Spoon" },
    { id: 8, name: "Veg Meal (Std)", price: 80, icon: "🍽️", desc: "150g Rice + 2 Parathas + 100g Dal + Mix Veg + Curd + Pickle + Napkin" },
    { id: 9, name: "Veg Breakfast", price: 40, icon: "🥪", desc: "2 Bread Slices + 2 Veg Cutlets + Butter + Ketchup + Napkin" },
    { id: 10, name: "Idli Vada", price: 40, icon: "🍥", desc: "2 Idlis + 2 Vadas + Sambar + Chutney + Spoon" },
    { id: 11, name: "Omelette", price: 50, icon: "🍳", desc: "2 Bread Slices + 2 Egg Omelette + Butter + Ketchup + Salt" },
    { id: 12, name: "Paneer Pakora", price: 50, icon: "🧀", desc: "2 Paneer Pakoras (60g each) + Ketchup + Napkin" },
    { id: 13, name: "Bread Pakora", price: 30, icon: "🍞", desc: "2 Bread Pakoras + Ketchup + Napkin" },
    { id: 14, name: "Samosa (2pcs)", price: 20, icon: "🥟", desc: "2 Samosas + Ketchup + Napkin" },
    { id: 15, name: "Janta Meal", price: 20, icon: "🍲", desc: "7 Pooris + Aloo Curry + Pickle" }
];

let cart = {}; // Stores { itemId: quantity }

/* --- DATABASES & ROUTES (UNCHANGED) --- */
const trainDatabase = [
    { number: "12367", name: "Vikramshila Express" }, { number: "12368", name: "Vikramshila Express" },
    { number: "22405", name: "Bhagalpur Garib Rath" }, { number: "22406", name: "Anand Vihar Garib Rath" },
    { number: "12423", name: "Dibrugarh Rajdhani" }, { number: "12424", name: "New Delhi Rajdhani" },
    { number: "22309", name: "Howrah Vande Bharat" }, { number: "22310", name: "Jamalpur Vande Bharat" }
];

const stationDatabase = [
    { code: "BGP", name: "Bhagalpur Jn" }, { code: "JMP", name: "Jamalpur Jn" }, { code: "KIUL", name: "Kiul Jn" },
    { code: "PNBE", name: "Patna Jn" }, { code: "DDU", name: "Pt DD Upadhyaya Jn" }, { code: "CNB", name: "Kanpur Central" },
    { code: "ANVT", name: "Anand Vihar Terminal" }, { code: "NDLS", name: "New Delhi" }, { code: "DBRG", name: "Dibrugarh" },
    { code: "DMV", name: "Dimapur" }, { code: "GHY", name: "Guwahati" }, { code: "NJP", name: "New Jalpaiguri" },
    { code: "KIR", name: "Katihar Jn" }, { code: "BJU", name: "Barauni Jn" }, { code: "DNR", name: "Danapur" },
    { code: "PRYJ", name: "Prayagraj Jn" }, { code: "HWH", name: "Howrah Jn" }, { code: "BHP", name: "Bolpur Shantiniketan" },
    { code: "RPH", name: "Rampurhat" }, { code: "DUMK", name: "Dumka" }, { code: "NNHT", name: "Nonihat" },
    { code: "HSDA", name: "Hansdiha" }, { code: "MDLE", name: "Mandar Hill" }, { code: "BHLE", name: "Barahat Jn" }
];

const trainRoutes = {
    "12367": [ { station: "Bhagalpur (BGP)", arr: "Start", actArr: "Start", dep: "12:00", actDep: "12:00", status: "passed", platform: "1", dist: "0 km" }, { station: "Jamalpur Jn (JMP)", arr: "13:00", actArr: "13:05", dep: "13:05", actDep: "13:10", status: "passed", platform: "2", dist: "53 km", delay: "5 mins" }, { station: "Kiul Jn (KIUL)", arr: "14:10", actArr: "14:15", dep: "14:15", actDep: "14:20", status: "passed", platform: "3", dist: "98 km", delay: "5 mins" }, { station: "Patna Jn (PNBE)", arr: "16:30", actArr: "17:00", dep: "16:40", actDep: "17:15", status: "active", platform: "4", dist: "221 km", delay: "35 mins", note: "Departed Patna (Late)" }, { station: "Pt DD Upadhyaya (DDU)", arr: "20:55", actArr: "21:30", dep: "21:05", actDep: "21:40", status: "future", platform: "6", dist: "433 km", delay: "35 mins" }, { station: "Kanpur Central (CNB)", arr: "01:30", actArr: "02:05", dep: "01:35", actDep: "02:10", status: "future", platform: "5", dist: "780 km" }, { station: "Anand Vihar (ANVT)", arr: "07:20", actArr: "08:00", dep: "End", actDep: "End", status: "future", platform: "1", dist: "1208 km" } ],
    "12368": [ { station: "Anand Vihar (ANVT)", arr: "Start", actArr: "Start", dep: "13:15", actDep: "13:15", status: "passed", platform: "1", dist: "0 km" }, { station: "Kanpur Central (CNB)", arr: "19:00", actArr: "19:00", dep: "19:10", actDep: "19:10", status: "passed", platform: "9", dist: "428 km" }, { station: "Pt DD Upadhyaya (DDU)", arr: "00:35", actArr: "00:35", dep: "00:45", actDep: "00:45", status: "active", platform: "2", dist: "775 km", note: "Arrived on time" }, { station: "Patna Jn (PNBE)", arr: "03:45", actArr: "03:45", dep: "03:55", actDep: "03:55", status: "future", platform: "1", dist: "987 km" }, { station: "Kiul Jn (KIUL)", arr: "06:10", actArr: "06:10", dep: "06:15", actDep: "06:15", status: "future", platform: "4", dist: "1110 km" }, { station: "Jamalpur Jn (JMP)", arr: "07:15", actArr: "07:15", dep: "07:20", actDep: "07:20", status: "future", platform: "1", dist: "1155 km" }, { station: "Bhagalpur (BGP)", arr: "08:15", actArr: "08:15", dep: "End", actDep: "End", status: "future", platform: "1", dist: "1208 km" } ],
    "12423": [ { station: "Dibrugarh (DBRG)", arr: "Start", actArr: "Start", dep: "20:55", actDep: "20:55", status: "passed", platform: "1", dist: "0 km" }, { station: "Dimapur (DMV)", arr: "02:00", actArr: "02:00", dep: "02:07", actDep: "02:07", status: "passed", platform: "1", dist: "310 km" }, { station: "Guwahati (GHY)", arr: "06:30", actArr: "06:30", dep: "06:45", actDep: "06:45", status: "passed", platform: "3", dist: "560 km" }, { station: "New Jalpaiguri (NJP)", arr: "13:20", actArr: "13:20", dep: "13:30", actDep: "13:30", status: "passed", platform: "2", dist: "980 km" }, { station: "Katihar Jn (KIR)", arr: "16:30", actArr: "16:40", dep: "16:40", actDep: "16:50", status: "active", platform: "1", dist: "1180 km", delay: "10 mins", note: "Crossing Bridge", pfStatus: "Usual" }, { station: "Barauni Jn (BJU)", arr: "19:30", actArr: "19:45", dep: "19:40", actDep: "19:55", status: "future", platform: "4", dist: "1360 km", delay: "15 mins", pfStatus: "Changed from PF 2" }, { station: "Danapur (DNR)", arr: "21:30", actArr: "21:45", dep: "21:32", actDep: "21:47", status: "future", platform: "1", dist: "1480 km" }, { station: "Pt DD Upadhyaya (DDU)", arr: "00:45", actArr: "01:00", dep: "00:55", actDep: "01:10", status: "future", platform: "4", dist: "1680 km" }, { station: "Prayagraj Jn (PRYJ)", arr: "03:15", actArr: "03:30", dep: "03:17", actDep: "03:32", status: "future", platform: "1", dist: "1830 km" }, { station: "Kanpur Central (CNB)", arr: "05:30", actArr: "05:45", dep: "05:35", actDep: "05:50", status: "future", platform: "1", dist: "2025 km" }, { station: "New Delhi (NDLS)", arr: "10:30", actArr: "10:45", dep: "End", actDep: "End", status: "future", platform: "16", dist: "2465 km" } ],
    "12424": [ { station: "New Delhi (NDLS)", arr: "Start", actArr: "Start", dep: "16:20", actDep: "16:20", status: "passed", platform: "16", dist: "0 km" }, { station: "Kanpur Central (CNB)", arr: "21:00", actArr: "21:00", dep: "21:05", actDep: "21:05", status: "passed", platform: "4", dist: "440 km" }, { station: "Prayagraj Jn (PRYJ)", arr: "23:00", actArr: "23:00", dep: "23:02", actDep: "23:02", status: "active", platform: "1", dist: "635 km", note: "High Speed Run" }, { station: "Pt DD Upadhyaya (DDU)", arr: "01:25", actArr: "01:25", dep: "01:35", actDep: "01:35", status: "future", platform: "2", dist: "788 km" }, { station: "Danapur (DNR)", arr: "04:10", actArr: "04:10", dep: "04:12", actDep: "04:12", status: "future", platform: "1", dist: "990 km" }, { station: "Katihar Jn (KIR)", arr: "09:30", actArr: "09:30", dep: "09:40", actDep: "09:40", status: "future", platform: "2", dist: "1280 km" }, { station: "New Jalpaiguri (NJP)", arr: "12:50", actArr: "12:50", dep: "13:00", actDep: "13:00", status: "future", platform: "1", dist: "1480 km" }, { station: "Guwahati (GHY)", arr: "19:30", actArr: "19:30", dep: "19:45", actDep: "19:45", status: "future", platform: "2", dist: "1900 km" }, { station: "Dibrugarh (DBRG)", arr: "05:00", actArr: "05:00", dep: "End", actDep: "End", status: "future", platform: "1", dist: "2465 km" } ],
    "22309": [ { station: "Howrah Jn (HWH)", arr: "Start", actArr: "Start", dep: "05:55", actDep: "05:55", status: "passed", platform: "12", dist: "0 km" }, { station: "Bolpur (BHP)", arr: "07:37", actArr: "07:37", dep: "07:39", actDep: "07:39", status: "passed", platform: "1", dist: "146 km" }, { station: "Rampurhat (RPH)", arr: "08:30", actArr: "08:30", dep: "08:32", actDep: "08:32", status: "active", platform: "2", dist: "207 km", note: "On Time" }, { station: "Dumka (DUMK)", arr: "09:25", actArr: "09:25", dep: "09:27", actDep: "09:27", status: "future", platform: "1", dist: "271 km" }, { station: "Nonihat (NNHT)", arr: "09:50", actArr: "09:50", dep: "09:51", actDep: "09:51", status: "future", platform: "1", dist: "295 km" }, { station: "Hansdiha (HSDA)", arr: "10:15", actArr: "10:15", dep: "10:17", actDep: "10:17", status: "future", platform: "1", dist: "312 km" }, { station: "Mandar Hill (MDLE)", arr: "10:40", actArr: "10:40", dep: "10:42", actDep: "10:42", status: "future", platform: "1", dist: "336 km" }, { station: "Barahat (BHLE)", arr: "10:55", actArr: "10:55", dep: "10:57", actDep: "10:57", status: "future", platform: "1", dist: "349 km" }, { station: "Bhagalpur (BGP)", arr: "11:35", actArr: "11:35", dep: "11:40", actDep: "11:40", status: "future", platform: "3", dist: "386 km" }, { station: "Jamalpur Jn (JMP)", arr: "12:35", actArr: "12:35", dep: "End", actDep: "End", status: "future", platform: "1", dist: "439 km" } ],
    "22310": [ { station: "Jamalpur Jn (JMP)", arr: "Start", actArr: "Start", dep: "14:15", actDep: "14:15", status: "passed", platform: "1", dist: "0 km" }, { station: "Bhagalpur (BGP)", arr: "15:05", actArr: "15:05", dep: "15:10", actDep: "15:10", status: "passed", platform: "3", dist: "53 km" }, { station: "Barahat (BHLE)", arr: "15:45", actArr: "15:45", dep: "15:47", actDep: "15:47", status: "passed", platform: "1", dist: "90 km" }, { station: "Mandar Hill (MDLE)", arr: "16:00", actArr: "16:00", dep: "16:02", actDep: "16:02", status: "active", platform: "1", dist: "103 km", note: "Departing" }, { station: "Hansdiha (HSDA)", arr: "16:25", actArr: "16:25", dep: "16:27", actDep: "16:27", status: "future", platform: "1", dist: "127 km" }, { station: "Nonihat (NNHT)", arr: "16:45", actArr: "16:45", dep: "16:46", actDep: "16:46", status: "future", platform: "1", dist: "144 km" }, { station: "Dumka (DUMK)", arr: "17:10", actArr: "17:10", dep: "17:12", actDep: "17:12", status: "future", platform: "1", dist: "168 km" }, { station: "Rampurhat (RPH)", arr: "18:15", actArr: "18:15", dep: "18:17", actDep: "18:17", status: "future", platform: "2", dist: "232 km" }, { station: "Bolpur (BHP)", arr: "19:05", actArr: "19:05", dep: "19:07", actDep: "19:07", status: "future", platform: "1", dist: "293 km" }, { station: "Howrah Jn (HWH)", arr: "21:20", actArr: "21:20", dep: "End", actDep: "End", status: "future", platform: "12", dist: "439 km" } ],
    "22405": [ { station: "Bhagalpur (BGP)", arr: "Start", actArr: "Start", dep: "13:55", actDep: "13:55", status: "passed", platform: "3", dist: "0 km" }, { station: "Jamalpur Jn (JMP)", arr: "14:50", actArr: "14:50", dep: "14:55", actDep: "14:55", status: "active", platform: "1", dist: "53 km", note: "Arriving JMP" }, { station: "Abhaipur (AHA)", arr: "15:20", actArr: "15:20", dep: "15:22", actDep: "15:22", status: "future", platform: "2", dist: "75 km" }, { station: "Kiul Jn (KIUL)", arr: "15:55", actArr: "15:55", dep: "16:00", actDep: "16:00", status: "future", platform: "3", dist: "98 km" }, { station: "Patna Jn (PNBE)", arr: "18:10", actArr: "18:10", dep: "18:20", actDep: "18:20", status: "future", platform: "3", dist: "221 km" }, { station: "Pt DD Upadhyaya (DDU)", arr: "21:55", actArr: "21:55", dep: "22:05", actDep: "22:05", status: "future", platform: "4", dist: "433 km" }, { station: "Prayagraj Jn (PRYJ)", arr: "00:10", actArr: "00:10", dep: "00:12", actDep: "00:12", status: "future", platform: "1", dist: "586 km" }, { station: "Kanpur Central (CNB)", arr: "03:00", actArr: "03:00", dep: "03:05", actDep: "03:05", status: "future", platform: "2", dist: "780 km" }, { station: "Anand Vihar (ANVT)", arr: "08:50", actArr: "08:50", dep: "End", actDep: "End", status: "future", platform: "1", dist: "1208 km" } ],
    "22406": [ { station: "Anand Vihar (ANVT)", arr: "Start", actArr: "Start", dep: "17:20", actDep: "17:20", status: "passed", platform: "1", dist: "0 km" }, { station: "Aligarh Jn (ALJN)", arr: "18:50", actArr: "19:10", dep: "18:55", actDep: "19:15", status: "passed", platform: "2", dist: "120 km", delay: "20 mins" }, { station: "Tundla Jn (TDL)", arr: "20:00", actArr: "20:45", dep: "20:05", actDep: "20:50", status: "active", platform: "3", dist: "200 km", delay: "45 mins", note: "Delayed due to Fog" }, { station: "Kanpur Central (CNB)", arr: "23:45", actArr: "00:30", dep: "23:55", actDep: "00:40", status: "future", platform: "4", dist: "428 km" }, { station: "Prayagraj Jn (PRYJ)", arr: "02:30", actArr: "03:15", dep: "02:35", actDep: "03:20", status: "future", platform: "1", dist: "623 km" }, { station: "Patna Jn (PNBE)", arr: "07:30", actArr: "08:15", dep: "07:40", actDep: "08:25", status: "future", platform: "1", dist: "987 km" }, { station: "Bhagalpur (BGP)", arr: "10:55", actArr: "11:40", dep: "End", actDep: "End", status: "future", platform: "4", dist: "1208 km" } ]
};

/* --- DEMO PNR DATABASE --- */
const pnrDatabase = {
    "2435678901": { trainNo: "12423", coach: "B1", seat: "45" },
    "1111111111": { trainNo: "12367", coach: "S5", seat: "12" },
    "2222222222": { trainNo: "22309", coach: "A1", seat: "3" }
};

/* --- DEMO PASS DATABASE --- */
const passDatabase = {
    "998877": { holder: "Rohit Kumar", from: "DBRG", to: "NDLS", daysValid: 90, expiry: "2026-03-31" },
    "123450": { holder: "Anjali Sharma", from: "BGP", to: "ANVT", daysValid: 365, expiry: "2025-11-30" },
    "555666": { holder: "S. Verma", from: "NDLS", to: "PNBE", daysValid: 180, expiry: "2026-07-15" }
};

/* --- Prediction feedback store --- */
const predictionFeedbacks = [];

// --- FUNCTIONS ---
window.onload = function() {
    updateHeaderAuthUI();
    const user = getCurrentUser();
    if (!user) {
        // Hide dashboard and show only login/register modal
        document.querySelector('.app-container').style.display = 'none';
        showLoginModal();
        // When login/register is successful, show dashboard
        window._afterLoginRedirect = 'home';
    } else {
        // Show dashboard
        document.querySelector('.app-container').style.display = '';
        if (document.getElementById("username-display")) { document.getElementById("username-display").innerText = `, ${user.name}`; document.getElementById("username-display").classList.remove('hidden'); }
        if (document.getElementById("username-top")) document.getElementById("username-top").innerText = user.name;
        const avatar = document.querySelector('.user-avatar'); if (avatar) { avatar.innerText = user.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase(); avatar.style.display = 'flex'; }
        // Always show home view on reload if logged in
        switchView('home');
    }
    setupTrainSearch();
    setupStationAutocomplete();
    console.log("TrackEngine Loaded");
};

// --- PANTRY FLOW FUNCTIONS ---
function startPantryFlow() {
    const user = getCurrentUser();
    if (!user) {
        window._afterLoginRedirect = 'pantry-auth';
        showLoginModal();
        return;
    }
    switchView('pantry-auth');
    document.getElementById('pnr-input').value = "";
}

function verifyPnr() {
    const pnr = document.getElementById('pnr-input').value;
    if (pnr.length !== 10 || isNaN(pnr)) {
        alert("Please enter a valid 10-digit PNR.");
        return;
    }
    
    // Simulate Fetching Data
    const coaches = ["B1", "B2", "B3", "A1", "S5", "S6"];
    const randCoach = coaches[Math.floor(Math.random() * coaches.length)];
    const randSeat = Math.floor(Math.random() * 72) + 1;
    currentPantrySeat = `${randCoach}, ${randSeat}`;
    
    document.getElementById('conf-coach').innerText = randCoach;
    document.getElementById('conf-seat').innerText = randSeat;
    
    switchView('pantry-confirm');
}

function loadPantryMenu() {
    document.getElementById('menu-seat-display').innerText = `Seat: ${currentPantrySeat}`;
    renderMenuGrid();
    switchView('pantry-menu');
}

// --- MENU & CART LOGIC ---
function renderMenuGrid() {
    const grid = document.getElementById('pantry-grid');
    grid.innerHTML = "";
    const palette = [
        {bg:'#fff0f6', color:'#c41d7f'}, {bg:'#e6f7ff', color:'#096dd9'}, {bg:'#f6ffed', color:'#389e0d'},
        {bg:'#fff7e6', color:'#d46b08'}, {bg:'#f0f5ff', color:'#2f54eb'}, {bg:'#fff1f0', color:'#cf1322'}
    ];

    pantryMenu.forEach(item => {
        const qty = cart[item.id] || 0;
        let btnHTML = "";
        
        if (qty === 0) {
            btnHTML = `<button class="btn-add-init" onclick="updateCart(${item.id}, 1)">ADD</button>`;
        } else {
            btnHTML = `
                <div class="btn-counter">
                    <button onclick="updateCart(${item.id}, -1)">-</button>
                    <span>${qty}</span>
                    <button onclick="updateCart(${item.id}, 1)">+</button>
                </div>
            `;
        }

        const card = document.createElement('div');
        card.className = "food-card";
        const pal = palette[item.id % palette.length];
        card.innerHTML = `
            <div class="food-img-box" style="background:${pal.bg}; color:${pal.color}; font-size:2.2em;">${item.icon}</div>
            <div class="food-info">
                <span class="food-name">${item.name}</span>
                <span class="food-price">₹${item.price}</span>
                <div class="add-btn-wrapper" id="btn-wrap-${item.id}">
                    ${btnHTML}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    updateCartBar();
}

function updateCart(id, change) {
    if (!cart[id]) cart[id] = 0;
    cart[id] += change;
    if (cart[id] <= 0) delete cart[id];
    
    // Quick Update UI without full re-render
    const qty = cart[id] || 0;
    const wrap = document.getElementById(`btn-wrap-${id}`);
    if(wrap) {
        if (qty === 0) {
            wrap.innerHTML = `<button class="btn-add-init" onclick="updateCart(${id}, 1)">ADD</button>`;
        } else {
            wrap.innerHTML = `
                <div class="btn-counter">
                    <button onclick="updateCart(${id}, -1)">-</button>
                    <span>${qty}</span>
                    <button onclick="updateCart(${id}, 1)">+</button>
                </div>`;
        }
    }
    updateCartBar();
}

function updateCartBar() {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    let totalPrice = 0;
    for (const [id, q] of Object.entries(cart)) {
        const item = pantryMenu.find(i => i.id == id);
        totalPrice += item.price * q;
    }

    const bar = document.getElementById('cart-bar');
    if (totalItems > 0) {
        document.getElementById('cart-count').innerText = `${totalItems} ITEM${totalItems > 1 ? 'S' : ''}`;
        document.getElementById('cart-total').innerText = `₹${totalPrice}`;
        bar.classList.remove('hidden');
    } else {
        bar.classList.add('hidden');
    }
}

function openCartModal() {
    const container = document.getElementById('cart-items-list');
    container.innerHTML = "";
    let total = 0;

    for (const [id, q] of Object.entries(cart)) {
        const item = pantryMenu.find(i => i.id == id);
        total += item.price * q;
        
        container.innerHTML += `
            <div class="cart-item-row">
                <div style="flex:1;">
                    <strong style="font-size:14px; color:#333;">${item.name}</strong>
                    <div style="font-size:12px; color:#777;">${q} x ₹${item.price}</div>
                </div>
                <strong style="color:#333;">₹${item.price * q}</strong>
            </div>
        `;
    }
    document.getElementById('cart-final-total').innerText = `₹${total}`;
    // set payment modal total as well
    const payTotal = document.getElementById('payment-total-pay'); if (payTotal) payTotal.innerText = `₹${total}`;
    document.getElementById('cart-modal').classList.remove('hidden');
}

function openPaymentModal() {
    // require login
    const user = getCurrentUser();
    if (!user) { showLoginModal(); return; }

    // ensure totals are up-to-date
    const totalText = document.getElementById('cart-final-total').innerText || document.getElementById('payment-total-pay').innerText;
    const payTotal = document.getElementById('payment-total-pay'); if (payTotal) payTotal.innerText = totalText;
    document.getElementById('payment-confirm-btn').disabled = true;
    // clear selection
    document.querySelectorAll('.payment-option').forEach(x => x.classList.remove('selected'));
    _selectedPaymentMethod = null;

    // compute discounts based on user history
    const total = parseInt((totalText || '₹0').replace(/[^0-9]/g, '')) || 0;
    const userStats = computeUserStats(user);
    let discountPct = 0;
    if (userStats.count >= 4) discountPct = Math.max(discountPct, 5);
    if (userStats.spent >= 500) discountPct = Math.max(discountPct, 10);
    const discountAmt = Math.round((total * discountPct) / 100);
    const payable = total - discountAmt;

    document.getElementById('payment-discount-percent').innerText = `${discountPct}%`;
    document.getElementById('payment-discount-amount').innerText = `₹${discountAmt}`;
    document.getElementById('payment-payable-amount').innerText = `₹${payable}`;

    document.getElementById('payment-modal').classList.remove('hidden');
}

function confirmOrder() { openPaymentModal(); }

let _selectedPaymentMethod = null;
function selectPaymentMethod(method, el) {
    _selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option').forEach(x => x.classList.remove('selected'));
    if (el) el.classList.add('selected');
    document.getElementById('payment-confirm-btn').disabled = false;
}

function finalizeOrder() {
    // require login
    const user = getCurrentUser(); if (!user) { showLoginModal(); return; }
    // require payment method
    if (!_selectedPaymentMethod) {
        alert('Please select a payment method.');
        return;
    }
    // compute grand total and prepare receipt
    let grandTotal = 0;
    const receiptList = document.getElementById('receipt-summary');
    receiptList.innerHTML = "";
    for (const [id, q] of Object.entries(cart)) {
        const item = pantryMenu.find(i => i.id == id);
        grandTotal += item.price * q;
        receiptList.innerHTML += `
            <div class="receipt-row">
                <div class="receipt-item-name">
                    <span>${q} x ${item.name}</span>
                    <span>₹${item.price * q}</span>
                </div>
                <div class="receipt-item-desc">${item.desc}</div>
            </div>
        `;
    }
    processOrderAndShowReceipt(_selectedPaymentMethod, grandTotal, receiptList);
}

// function processOrderAndShowReceipt(paymentMethod, grandTotal, receiptList) {
//     closeModal('cart-modal');
//     closeModal('pantry-menu'); // Hide menu view behind modal
//     closeModal('payment-modal');

//     const orderId = "#ORD-" + Math.floor(10000 + Math.random() * 90000);
//     // Show order ID
//     document.getElementById('receipt-id').innerText = orderId;
//     // compute discount again and store the order under user's history
//     const user = getCurrentUser();
//     const userStats = computeUserStats(user);
//     let discountPct = 0;
//     if (userStats.count >= 4) discountPct = Math.max(discountPct, 5);
//     if (userStats.spent >= 500) discountPct = Math.max(discountPct, 10);
//     const discountAmt = Math.round((grandTotal * discountPct) / 100);
//     const payable = grandTotal - discountAmt;

//     // append payment method row to receipt list
//     if (paymentMethod) {
//         receiptList.innerHTML += `<div class="receipt-row"><div style="font-size:13px; color:#666;">Payment Method: <strong>${paymentMethod.toUpperCase()}</strong></div></div>`;
//     }

//     // Show all order details
//     document.getElementById('receipt-total-pay').innerText = `₹${grandTotal}`;
//     document.getElementById('receipt-payment-method').innerText = paymentMethod ? paymentMethod.toUpperCase() : '--';
//     const status = paymentMethod === 'cod' ? 'Pending' : 'Paid';
    // document.getElementById('receipt-payment-status').innerText = status;
    // document.getElementById('receipt-discount-amount').innerText = `₹${discountAmt}`;
    // document.getElementById('receipt-payable-amount').innerText = `₹${payable}`;
    // // Add summary for clarity
    // document.getElementById('receipt-summary').innerHTML += `<div style="margin-top:10px; font-size:14px; color:#444;">Order Status: <strong>${status}</strong></div>`;
    // document.getElementById('receipt-summary').innerHTML += `<div style="font-size:13px; color:#888;">Order ID: <strong>${orderId}</strong></div>`;

    // // allow cancel only for COD and pending
    // const cancelRow = document.getElementById('receipt-cancel-row');
    // if (paymentMethod === 'cod') {
    //     cancelRow.style.display = 'block';
    //     // store a temp pointer to last order id
    //     window._lastOrder = { id: orderId, status: status };
    // } else {
    //     cancelRow.style.display = 'none';
    // }

    // document.getElementById('receipt-modal').classList.remove('hidden');

    // // persist order into user's history
    // if (user) {
    //     const ord = { id: orderId, method: paymentMethod, status: status, items: JSON.parse(JSON.stringify(cart)), total: grandTotal, discount: discountAmt, payable: payable, ts: Date.now() };
    //     if (!user.orders) user.orders = [];
    //     user.orders.push(ord);
    //     saveUser(user);
    //     // store pointer to last order id for cancellation
    //     localStorage.setItem('te_last_order', ord.id);
    // }

    // Reset
//     cart = {};
//     updateCartBar();
// }
function processOrderAndShowReceipt(paymentMethod, grandTotal, receiptList) {
    closeModal('cart-modal');
    closeModal('payment-modal');

    const orderId = "#ORD-" + Math.floor(10000 + Math.random() * 90000);
    // Show all order details in receipt
    document.getElementById('receipt-id').innerText = orderId;
    document.getElementById('receipt-total-pay').innerText = `₹${grandTotal}`;
    document.getElementById('receipt-payment-method').innerText = paymentMethod ? paymentMethod.toUpperCase() : '--';
    const status = paymentMethod === 'cod' ? 'Pending' : 'Paid';
    document.getElementById('receipt-payment-status').innerText = status;
    // Compute discount again for receipt
    // Reward system: 5% discount after 4 orders, 10% after 400 spent (global orders)
    const allOrders = loadOrders();
    let orderCount = allOrders.length;
    let orderSpent = 0;
    for (const o of allOrders) orderSpent += (o.payable || o.total || 0);
    let discountPct = 0;
    if (orderCount >= 4) discountPct = Math.max(discountPct, 5); // 5% after 4 orders
    if (orderSpent >= 400) discountPct = Math.max(discountPct, 10); // 10% after 400 spent
    const discountAmt = Math.round((grandTotal * discountPct) / 100);
    const payable = grandTotal - discountAmt;
    document.getElementById('receipt-discount-amount').innerText = `₹${discountAmt}`;
    document.getElementById('receipt-payable-amount').innerText = `₹${payable}`;
    document.getElementById('receipt-summary').innerHTML += `<div style="margin-top:10px; font-size:14px; color:#444;">Order Status: <strong>${status}</strong></div>`;
    document.getElementById('receipt-summary').innerHTML += `<div style="font-size:13px; color:#888;">Order ID: <strong>${orderId}</strong></div>`;

    // Save order to global order list (localStorage)
    const ord = { id: orderId, method: paymentMethod, status: status, items: JSON.parse(JSON.stringify(cart)), total: grandTotal, discount: discountAmt, payable: payable, ts: Date.now() };
    let orders = loadOrders();
    orders.push(ord);
    saveOrders(orders);
    // store pointer to last order id for cancellation
    localStorage.setItem('te_last_order', ord.id);

    document.getElementById('receipt-modal').classList.remove('hidden');

    cart = {};
    updateCartBar();
}


function cancelCurrentOrder() {
    const lastId = localStorage.getItem('te_last_order');
    if (!lastId) { alert('No cancellable order found.'); return; }
    cancelOrder(lastId);
}

// --- STANDARD FUNCTIONS (UNCHANGED) ---
function setupTrainSearch() {
    const inputField = document.getElementById("train-input");
    const suggestionBox = document.getElementById("suggestion-box");
    if (!inputField || !suggestionBox) return;

    // show logged in username if any
    const user = getCurrentUser();
    if (user) {
        if (document.getElementById("username-display")) document.getElementById("username-display").innerText = user.name;
        if (document.getElementById("username-top")) document.getElementById("username-top").innerText = user.name;
        document.querySelector('.user-avatar').innerText = user.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
    }


    inputField.addEventListener("input", function() {
        const query = this.value.trim();
        suggestionBox.innerHTML = "";
        if (query.length < 3 || isNaN(query)) { suggestionBox.classList.add("hidden"); return; }
        const matches = trainDatabase.filter(train => train.number.startsWith(query));
        if (matches.length > 0) {
            suggestionBox.classList.remove("hidden");
            matches.forEach(train => {
                const div = document.createElement("div");
                div.className = "suggestion-item";
                div.innerText = `${train.number} - ${train.name}`;
                div.onclick = function() {
                    inputField.value = `${train.number} (${train.name})`;
                    suggestionBox.classList.add("hidden");
                };
                suggestionBox.appendChild(div);
            });
        } else { suggestionBox.classList.add("hidden"); }
    });
    document.addEventListener("click", function(e) {
        if (!inputField.contains(e.target) && !suggestionBox.contains(e.target)) suggestionBox.classList.add("hidden");
    });
}

function setupStationAutocomplete() {
    const fromInput = document.getElementById("station-from");
    const fromBox = document.getElementById("suggest-from");
    const toInput = document.getElementById("station-to");
    const toBox = document.getElementById("suggest-to");

    const attachListener = (input, box) => {
        input.addEventListener("input", function() {
            const query = this.value.trim().toUpperCase();
            box.innerHTML = "";
            if (query.length < 1) { box.classList.add("hidden"); return; }

            const matches = stationDatabase.filter(stn => 
                stn.code.startsWith(query) || stn.name.toUpperCase().includes(query)
            );

            if (matches.length > 0) {
                box.classList.remove("hidden");
                matches.forEach(stn => {
                    const div = document.createElement("div");
                    div.className = "suggestion-item";
                    div.innerText = `${stn.name} (${stn.code})`;
                    div.onclick = function() {
                        input.value = stn.code;
                        box.classList.add("hidden");
                    };
                    box.appendChild(div);
                });
            } else { box.classList.add("hidden"); }
        });
        document.addEventListener("click", function(e) {
            if (!input.contains(e.target) && !box.contains(e.target)) box.classList.add("hidden");
        });
    };

    if(fromInput && fromBox) attachListener(fromInput, fromBox);
    if(toInput && toBox) attachListener(toInput, toBox);
}

function switchView(viewName) {
    const views = ['home-view', 'search-view', 'status-view', 'train-list-view', 'pnr-view', 'pass-view', 'orders-view', 'pantry-auth-view', 'pantry-confirm-view', 'pantry-menu-view'];
    // All views are accessible without login
    views.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    });
    document.body.style.backgroundColor = "#f5f7fa"; 

    if (viewName === 'home') document.getElementById('home-view').classList.remove('hidden');
    else if (viewName === 'search') {
        document.getElementById('search-view').classList.remove('hidden');
        document.body.style.backgroundColor = "#00428d"; 
    }
    else if (viewName === 'status') document.getElementById('status-view').classList.remove('hidden');
    else if (viewName === 'list') document.getElementById('train-list-view').classList.remove('hidden');
    else if (viewName === 'pnr') {
        document.getElementById('pnr-view').classList.remove('hidden');
        const inp = document.getElementById('pnr-check-input'); if (inp) inp.value = '';
        const res = document.getElementById('pnr-result'); if (res) res.classList.add('hidden');
    }
    else if (viewName === 'pass') {
        document.getElementById('pass-view').classList.remove('hidden');
        const p = document.getElementById('pass-input'); if (p) p.value = '';
        const r = document.getElementById('pass-result'); if (r) r.classList.add('hidden');
    }
    else if (viewName === 'pantry-auth') document.getElementById('pantry-auth-view').classList.remove('hidden');
    else if (viewName === 'pantry-confirm') document.getElementById('pantry-confirm-view').classList.remove('hidden');
    else if (viewName === 'pantry-menu') document.getElementById('pantry-menu-view').classList.remove('hidden');
    else if (viewName === 'orders') { document.getElementById('orders-view').classList.remove('hidden'); renderOrders(); }
}

/* --- ORDERS RENDER & MANAGEMENT --- */
function loadOrders() {
    try { return JSON.parse(localStorage.getItem('te_orders') || '[]'); } catch(e) { return []; }
}

function saveOrders(arr) { localStorage.setItem('te_orders', JSON.stringify(arr || [])); }

function getOrderStats() {
    const orders = loadOrders();
    let c = orders.length, s = 0; for (const o of orders) s += (o.payable || o.total || 0);
    return { count: c, spent: s };
}

function renderOrders() {
    const list = document.getElementById('orders-list');
    if (!list) return;
    list.innerHTML = '';
    const orders = loadOrders().slice().reverse();
    if (orders.length === 0) {
        list.innerHTML = `<div class="small-muted">You have no orders yet. Place one from Pantry Menu.</div>`;
        return;
    }

    orders.forEach(o => {
        const card = document.createElement('div');
        card.className = 'order-card';
        // items summary
        let itemsHtml = '';
        for (const [id, q] of Object.entries(o.items || {})) {
            const it = pantryMenu.find(x => x.id == id);
            if (it) itemsHtml += `<div class="order-items">${q} x ${it.name} <span style="float:right;">₹${it.price * q}</span></div>`;
        }
        const date = new Date(o.ts).toLocaleString();
        card.innerHTML = `
            <div>
                <div class="order-meta"><strong>Order ID:</strong> <span style="color:#2ecc71;">${o.id}</span> &nbsp; <span class="small-muted">${date}</span></div>
                <div class="order-meta">Payment: <strong>${(o.method||'--').toUpperCase()}</strong> &nbsp; Status: <strong style="color:${o.status==='Paid'?'#2ecc71':'#e67e22'}">${o.status}</strong></div>
                ${itemsHtml}
                <div class="order-meta" style="margin-top:6px;">Total: <strong>₹${o.total}</strong> &nbsp; Discount: <strong>₹${o.discount}</strong> &nbsp; Payable: <strong>₹${o.payable}</strong></div>
            </div>
            <div class="order-actions">
                <button class="btn-add-init" onclick="viewOrder('${o.id}')">View</button>
                ${o.method === 'cod' && o.status === 'Pending' ? `<button class="btn-remove" onclick="cancelOrder('${o.id}')">Cancel</button>` : ''}
            </div>
        `;
        list.appendChild(card);
    });
}

function viewOrder(orderId) {
    const user = getCurrentUser(); if(!user) { showLoginModal(); return; }
    const ord = user.orders && user.orders.find(o => o.id === orderId);
    if (!ord) { alert('Data not found. Retry.'); return; }

    // populate receipt modal with this order
    document.getElementById('receipt-id').innerText = ord.id;
    const receiptList = document.getElementById('receipt-summary'); receiptList.innerHTML = '';
    for (const [id, q] of Object.entries(ord.items || {})) {
        const it = pantryMenu.find(x => x.id == id);
        if (it) {
            receiptList.innerHTML += `<div class="receipt-row"><div class="receipt-item-name"><span>${q} x ${it.name}</span><span>₹${it.price * q}</span></div><div class="receipt-item-desc">${it.desc}</div></div>`;
        }
    }
    document.getElementById('receipt-total-pay').innerText = `₹${ord.total}`;
    document.getElementById('receipt-payment-method').innerText = (ord.method||'--').toUpperCase();
    document.getElementById('receipt-payment-status').innerText = ord.status;
    document.getElementById('receipt-discount-amount').innerText = `₹${ord.discount}`;
    document.getElementById('receipt-payable-amount').innerText = `₹${ord.payable}`;

    // show cancel button when appropriate
    const cancelRow = document.getElementById('receipt-cancel-row');
    if (ord.method === 'cod' && ord.status === 'Pending') { cancelRow.style.display = 'block'; window._lastOrder = { id: ord.id, status: ord.status }; }
    else { cancelRow.style.display = 'none'; }

    document.getElementById('receipt-modal').classList.remove('hidden');
}

function openOrdersFromPantry() {
    // mark that we should return to pantry when leaving orders
    window._ordersReturnTo = 'pantry-menu';
    switchView('orders');
    renderOrders();
}

function returnFromOrders() {
    const to = window._ordersReturnTo || 'home';
    window._ordersReturnTo = null;
    switchView(to);
}

function handleAvatarClick() {
    const user = getCurrentUser();
    const menu = document.getElementById('profile-menu');
    if (!user) { showLoginModal(); return; }
    if (!menu) { switchView('orders'); return; }
    // toggle
    if (menu.classList.contains('hidden')) showProfileMenu(); else hideProfileMenu();
}

function showProfileMenu() {
    const menu = document.getElementById('profile-menu'); if (!menu) return;
    menu.classList.remove('hidden');
}

function hideProfileMenu() {
    const menu = document.getElementById('profile-menu'); if (!menu) return;
    menu.classList.add('hidden');
}

function updateHeaderAuthUI() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('login-top-btn');
    const menu = document.getElementById('profile-menu');
    if (user) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (menu) menu.classList.remove('hidden'); // keep it visible only when clicked; we'll hide immediately
        // hide the menu until user clicks
        if (menu) setTimeout(()=> menu.classList.add('hidden'), 50);
        // show avatar and name
        const avatar = document.querySelector('.user-avatar'); if (avatar) avatar.style.display = 'flex';
        if (document.getElementById('username-display')) { document.getElementById('username-display').classList.remove('hidden'); }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (menu) menu.classList.add('hidden');
        if (document.getElementById('username-top')) document.getElementById('username-top').innerText = 'User';
        if (document.getElementById('username-display')) { document.getElementById('username-display').classList.add('hidden'); }
        const avatar = document.querySelector('.user-avatar'); if (avatar) avatar.style.display = 'none';
    }
}

// Hide profile menu on outside clicks
document.addEventListener('click', function(e) {
    const menu = document.getElementById('profile-menu');
    const avatar = document.querySelector('.user-avatar');
    if (!menu) return;
    if (menu.classList.contains('hidden')) return;
    if (menu.contains(e.target) || (avatar && avatar.contains(e.target))) return;
    menu.classList.add('hidden');
});

// Interaction check helpers
function runInteractionCheck() {
    const blockers = [];
    const w = window.innerWidth, h = window.innerHeight;
    const elems = Array.from(document.querySelectorAll('body *'));
    elems.forEach(el => {
        try {
            const cs = window.getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
            const r = el.getBoundingClientRect();
            const z = parseInt(cs.zIndex) || 0;
            if (r.width >= w - 2 && r.height >= h - 2 && z >= 100) {
                blockers.push({ el, rect: r, z, cs });
            }
        } catch (e) { /* ignore */ }
    });

    if (blockers.length === 0) {
        alert('No obvious full-screen blocking element found. Check browser console for errors.');
        console.log('Interaction Check: no blockers detected');
        return;
    }

    // Highlight and offer to hide
    blockers.forEach((b, i) => {
        b.el.classList.add('blocker-highlight');
        console.warn(`Blocker ${i}:`, b.el, b.rect, b.z, b.cs);
    });

    const ok = confirm(`Found ${blockers.length} blocking element(s). Hide them now so clicks work?`);
    if (ok) {
        blockers.forEach(b => {
            b.el.classList.remove('blocker-highlight');
            if (b.el.classList) b.el.classList.add('hidden'); else b.el.style.display = 'none';
        });
        alert('Hidden blocking element(s) — try clicking now.');
    } else {
        alert('Blocked elements logged to console. You can inspect and remove manually.');
    }
}

function cancelOrder(orderId) {
    const user = getCurrentUser(); if(!user) { showLoginModal(); return; }
    const ord = user.orders && user.orders.find(o => o.id === orderId);
    if (!ord) { alert('Data not found. Retry.'); return; }
    if (ord.method !== 'cod') { alert('Only COD orders can be cancelled'); return; }
    if (ord.status === 'Cancelled') { alert('Order already cancelled'); return; }
    ord.status = 'Cancelled';
    saveUser(user);
    // clear last order pointer if it matches
    const last = localStorage.getItem('te_last_order'); if (last === orderId) localStorage.removeItem('te_last_order');
    // update UI
    renderOrders();
    const statusEl = document.getElementById('receipt-payment-status'); if (statusEl && document.getElementById('receipt-id').innerText === orderId) statusEl.innerText = 'Cancelled';
    alert('Order cancelled');
}

function handleCheckStatus() {
    const input = document.getElementById("train-input");
    let val = input.value.trim();
    if(val === "") { alert("Please enter a Train Number."); return; }
    
    let trainNo = val.split(" ")[0]; 
    if (trainRoutes[trainNo]) {
        currentActiveTrain = trainNo; 
        switchView('status');
        loadRouteStatus(trainNo, val.substring(6));
    } else {
        alert("Data not found. Retry.");
    }
}

function handleStationSearch() {
    const fromVal = document.getElementById("station-from").value.trim().toUpperCase();
    const toVal = document.getElementById("station-to").value.trim().toUpperCase();

    if(fromVal === "" || toVal === "") {
        alert("Please enter both stations (e.g. DBRG and BJU)");
        return;
    }

    const getCodes = (val) => {
        if(["NDLS", "ANVT", "DLI"].includes(val)) return ["NDLS", "ANVT", "DLI", "NEW DELHI", "ANAND VIHAR"];
        return [val];
    };

    const fromCodes = getCodes(fromVal);
    const toCodes = getCodes(toVal);

    let foundTrains = [];

    for (const [trainNo, route] of Object.entries(trainRoutes)) {
        let fromIndex = -1;
        let toIndex = -1;

        for(let i=0; i<route.length; i++) {
            const stnString = route[i].station.toUpperCase(); 
            if(fromIndex === -1 && fromCodes.some(c => stnString.includes(`(${c})`) || stnString.startsWith(c))) {
                fromIndex = i;
            }
            if(toCodes.some(c => stnString.includes(`(${c})`) || stnString.startsWith(c))) {
                toIndex = i;
            }
        }

        if(fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
            const trainName = trainDatabase.find(t => t.number === trainNo)?.name || "Express";
            foundTrains.push({
                no: trainNo,
                name: trainName,
                fromStn: route[fromIndex],
                toStn: route[toIndex],
                currentStatus: determineTrainStatus(route)
            });
        }
    }

    if(foundTrains.length > 0) {
        renderTrainList(fromVal, toVal, foundTrains);
        switchView('list');
    } else {
        alert("No direct trains found between these stations in Demo Database.");
    }
}

function determineTrainStatus(route) {
    let lastEvent = null;
    for(let i=0; i<route.length; i++) {
        if(route[i].status === "active" || route[i].status === "passed") {
            lastEvent = route[i];
        }
    }

    if(lastEvent) {
        let txt = lastEvent.status === "active" ? `Arrived at ${lastEvent.station}` : `Crossed ${lastEvent.station}`;
        let time = lastEvent.actDep || lastEvent.actArr || lastEvent.dep;
        if(time === "Start") time = route[0].dep; 
        
        let delayTxt = lastEvent.delay ? ` <span class="delay-text">(Delay ${lastEvent.delay})</span>` : ` <span style="color:green">(On Time)</span>`;
        return `<i class="fas fa-map-marker-alt"></i> ${txt} at ${time} ${delayTxt}`;
    } else {
        return `<i class="fas fa-clock"></i> Train will start from ${route[0].station} at ${route[0].dep}`;
    }
}

function renderTrainList(from, to, trains) {
    const listContainer = document.getElementById("train-list-content");
    document.getElementById("train-list-header").innerText = `${from} ➔ ${to}`;
    document.getElementById("train-list-sub").innerText = `${trains.length} Trains Found`;
    
    listContainer.innerHTML = "";

    trains.forEach(t => {
        const div = document.createElement("div");
        div.className = "train-list-card";
        div.onclick = function() { 
            currentActiveTrain = t.no;
            switchView('status'); 
            loadRouteStatus(t.no, t.name); 
        };

        const html = `
            <div class="card-header"><span class="t-name">${t.no} - ${t.name}</span></div>
            <div class="t-time-row">
                <div class="t-stn">
                    <span class="t-time">${t.fromStn.dep}</span>
                    <span class="t-code">${t.fromStn.station.split('(')[1]?.replace(')', '') || t.fromStn.station}</span>
                </div>
                <div class="arrow" style="color:#aaa">---------------></div>
                <div class="t-stn right">
                    <span class="t-time">${t.toStn.arr}</span>
                    <span class="t-code">${t.toStn.station.split('(')[1]?.replace(')', '') || t.toStn.station}</span>
                </div>
            </div>
            <div class="run-status">${t.currentStatus}</div>
        `;
        div.innerHTML = html;
        listContainer.appendChild(div);
    });
}

function loadRouteStatus(trainNo, trainName) {
    const timelineContainer = document.getElementById("timeline-content");
    document.getElementById("status-train-name").innerText = `${trainNo} - ${trainName || "Express"}`;
    timelineContainer.innerHTML = ""; 

    const routeData = trainRoutes[trainNo];
    const isPremium = ["12423", "12424", "22309", "22310"].includes(trainNo);

    routeData.forEach((stop) => {
        let centerMarker = `<div class="dot"></div>`;
        if (stop.status === "active") centerMarker = `<div class="train-icon-marker"><i class="fas fa-train"></i></div>`;

        let rowClass = "station-row";
        if (stop.status === "passed") rowClass += " passed";
        if (stop.status === "active") rowClass += " current-station";

        const genScore = isPremium ? null : Math.floor(Math.random() * (10 - 7 + 1)) + 7;
        const slScore = isPremium ? null : Math.floor(Math.random() * (8 - 5 + 1)) + 5;
        const acScore = isPremium ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        const pfStat = stop.pfStatus ? stop.pfStatus : "Usual";

        let statusTag = `<span class="status-tag ontime">(On Time)</span>`;
        if (stop.delay) statusTag = `<span class="status-tag delayed">(Delayed by ${stop.delay})</span>`;

        const html = `
            <div class="${rowClass}">
                <div class="time-col left">
                    <span class="scheduled-time">${stop.arr}</span>
                    <span class="${stop.delay ? 'delayed-time' : 'actual-time'}">${stop.actArr || stop.arr}</span>
                </div>
                <div class="timeline-col">${centerMarker}</div>
                <div class="info-col">
                    <div class="station-name station-clickable" 
                         onclick="openStationModal('${stop.station}', '${stop.platform}', ${genScore}, ${slScore}, ${acScore}, '${pfStat}')">
                        ${stop.station} ${statusTag} <i class="fas fa-info-circle" style="font-size:12px; color:#00428d; margin-left:5px;"></i>
                    </div>
                    <div class="station-meta">${stop.dist} | PF #${stop.platform}</div>
                    ${stop.note ? `<div class="status-bar">${stop.note}</div>` : ''}
                </div>
                 <div class="time-col right">
                    <span class="scheduled-time">${stop.dep}</span>
                    <span class="${stop.delay ? 'delayed-time' : 'actual-time'}">${stop.actDep || stop.dep}</span>
                </div>
            </div>`;
        timelineContainer.innerHTML += html;
    });
}

function openStationModal(name, pf, gen, sl, ac, pfStatus) {
    document.getElementById("modal-station-name").innerText = name;
    document.getElementById("modal-pf").innerText = pf;
    document.getElementById("modal-pf-status").innerText = `(${pfStatus})`;

    const isAcOnly = ["12423", "12424", "22309", "22310"].includes(currentActiveTrain);

    if (isAcOnly) {
        document.getElementById("crowd-gen-box").style.display = "none";
        document.getElementById("crowd-sl-box").style.display = "none";
    } else {
        document.getElementById("crowd-gen-box").style.display = "block";
        document.getElementById("crowd-sl-box").style.display = "block";
        document.getElementById("score-gen").innerText = `${gen}/10`;
        document.getElementById("score-sl").innerText = `${sl}/10`;
        setBar("bar-gen", "text-gen", gen);
        setBar("bar-sl", "text-sl", sl);
    }

    document.getElementById("score-ac").innerText = `${ac}/10`;
    setBar("bar-ac", "text-ac", ac);
    document.getElementById("station-modal").classList.remove("hidden");

    // Reset prediction feedback UI
    const fb = document.getElementById('pred-feedback'); if (fb) fb.classList.add('hidden');
    const th = document.getElementById('pred-thanks'); if (th) th.classList.add('hidden');
}

/* --- USER AUTH & STORAGE --- */
function loadUsers() {
    try { return JSON.parse(localStorage.getItem('te_users') || '{}'); } catch(e) { return {}; }
}

function saveUsers(map) { localStorage.setItem('te_users', JSON.stringify(map || {})); }

function getCurrentUser() {
    const id = localStorage.getItem('te_user');
    if (!id) return null;
    const users = loadUsers();
    return users[id] || null;
}

function saveUser(user) {
    if (!user) return;
    const users = loadUsers();
    const key = user.id || user.email;
    if (!key) return;
    users[key] = user;
    saveUsers(users);
}

function showLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
    showLogin();
}

function showRegister() { document.getElementById('login-form').classList.add('hidden'); document.getElementById('register-form').classList.remove('hidden'); document.getElementById('login-modal-title').innerText='Register'; }
function showLogin() { document.getElementById('login-form').classList.remove('hidden'); document.getElementById('register-form').classList.add('hidden'); document.getElementById('login-modal-title').innerText='Login'; }

function registerUser() {
    const first = document.getElementById('reg-first').value.trim();
    const last = document.getElementById('reg-last').value.trim();
    const email = (document.getElementById('reg-email').value || '').trim().toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    if (!first || !pass || !email) {
        alert('Please provide first name, password, and email.');
        return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) { alert('Please provide a valid email address.'); return; }

    const users = loadUsers();
    const id = email;
    if (users[id]) { alert('User already exists. Please login.'); showLogin(); return; }

    const name = (first + (last ? ' ' + last : '')).trim();
    const user = { id: id, email: email, name: name, pass: pass, orders: [] };
    users[id] = user; saveUsers(users);
    localStorage.setItem('te_user', id);
    document.getElementById('login-modal').classList.add('hidden');
    document.querySelector('.app-container').style.display = '';
    if (document.getElementById('username-display')) document.getElementById('username-display').innerText = `, ${name}`;
    if (document.getElementById('username-top')) document.getElementById('username-top').innerText = name;
    document.querySelector('.user-avatar').innerText = name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
    updateHeaderAuthUI();
    // redirect after login/register if an intended view was stored
    const intended = window._afterLoginRedirect || null;
    window._afterLoginRedirect = null;
    if (intended) { switchView(intended); } else { switchView('home'); }
}

function loginUser() {
    const identifier = (document.getElementById('login-identifier').value || '').trim();
    const identifierLower = identifier.toLowerCase();
    const pass = document.getElementById('login-pass').value;
    const users = loadUsers();

    // Try direct key match (emails are stored lowercased)
    let u = users[identifier] || users[identifierLower];
    // If not found, try to search by email in user records
    if (!u) {
        for (const k of Object.keys(users)) {
            const uu = users[k];
            if (uu.email && uu.email === identifierLower) { u = uu; break; }
        }
    }

    if (!u || u.pass !== pass) { alert('Invalid credentials.'); return; }
    localStorage.setItem('te_user', u.id || u.email);
    document.getElementById('login-modal').classList.add('hidden');
    document.querySelector('.app-container').style.display = '';
    if (document.getElementById('username-display')) document.getElementById('username-display').innerText = `, ${u.name}`;
    if (document.getElementById('username-top')) document.getElementById('username-top').innerText = u.name;
    document.querySelector('.user-avatar').innerText = u.name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
    updateHeaderAuthUI();
    const intended = window._afterLoginRedirect || null;
    window._afterLoginRedirect = null;
    if (intended) { switchView(intended); } else { switchView('home'); }
}

function logoutUser() {
    localStorage.removeItem('te_user');
    if (document.getElementById('username-display')) document.getElementById('username-display').innerText = 'User';
    if (document.getElementById('username-top')) document.getElementById('username-top').innerText = 'User';
    document.querySelector('.user-avatar').innerText = 'DK';
    hideProfileMenu();
    updateHeaderAuthUI();
    showLoginModal();
}

function computeUserStats(user) {
    if (!user || !user.orders) return { count: 0, spent: 0 };
    let c = user.orders.length; let s = 0; for (const o of user.orders) s += (o.payable || o.total || 0);
    return { count: c, spent: s };
}

function markPredictionCorrect() {
    const name = document.getElementById('modal-station-name').innerText;
    predictionFeedbacks.push({ train: currentActiveTrain, station: name, correct: true, ts: Date.now() });
    const th = document.getElementById('pred-thanks'); if (th) th.classList.remove('hidden');
    const fb = document.getElementById('pred-feedback'); if (fb) fb.classList.add('hidden');
}

function openPredictionFeedback() {
    const fb = document.getElementById('pred-feedback'); if (fb) fb.classList.remove('hidden');
    const th = document.getElementById('pred-thanks'); if (th) th.classList.add('hidden');
}

function submitPredictionFeedback() {
    const rating = parseFloat(document.getElementById('pred-rating').value);
    const comment = document.getElementById('pred-comment').value.trim();
    const name = document.getElementById('modal-station-name').innerText;
    predictionFeedbacks.push({ train: currentActiveTrain, station: name, correct: false, rating: rating, comment: comment, ts: Date.now() });
    const fb = document.getElementById('pred-feedback'); if (fb) fb.classList.add('hidden');
    const th = document.getElementById('pred-thanks'); if (th) th.classList.remove('hidden');
    // clear comment
    document.getElementById('pred-comment').value = '';
    console.log('Prediction feedback saved', predictionFeedbacks[predictionFeedbacks.length - 1]);
}

function setBar(barId, textId, score) {
    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);
    bar.style.width = `${score * 10}%`;
    bar.className = "fill"; 
    
    if (score >= 9) {
        bar.classList.add("red"); text.innerText = "Extremely High (Less Chances)"; text.style.color = "#ff4d4f";
    } else if (score >= 7) {
        bar.classList.add("red"); text.innerText = "More Than Usual"; text.style.color = "#ff4d4f";
    } else if (score >= 5) {
        bar.classList.add("orange"); text.innerText = "Moderate / Slightly Higher"; text.style.color = "#ffa940";
    } else if (score >= 4) {
        bar.classList.add("yellow"); text.innerText = "Moderate"; text.style.color = "#d4b106";
    } else {
        bar.classList.add("green"); text.innerText = "Perfect / Low Crowd"; text.style.color = "#73d13d";
    }
}

function closeModal(modalId) {
    const id = modalId || 'station-modal';
    document.getElementById(id).classList.add("hidden");
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.add("hidden");
    }
}

/* --- PNR CHECK FLOW (Standalone PNR Status page) --- */
function handlePnrCheck() {
    const pnr = document.getElementById('pnr-check-input').value.trim();
    const resultDiv = document.getElementById('pnr-result');
    if (!pnr || pnr.length !== 10 || !/^[0-9]{10}$/.test(pnr)) {
        alert('Please enter a valid 10-digit PNR.');
        if(resultDiv) resultDiv.classList.add('hidden');
        return;
    }

    const rec = pnrDatabase[pnr];
    if (rec) {
        const trainName = trainDatabase.find(t => t.number === rec.trainNo)?.name || '';
        document.getElementById('pnr-train').innerText = `${rec.trainNo}${trainName ? ' - ' + trainName : ''}`;
        document.getElementById('pnr-coach').innerText = rec.coach;
        document.getElementById('pnr-seat').innerText = rec.seat;
    } else {
        document.getElementById('pnr-train').innerText = '--';
        document.getElementById('pnr-coach').innerText = '--';
        document.getElementById('pnr-seat').innerText = '--';
        alert('Data not found. Retry.');
    }
    resultDiv.classList.remove('hidden');
}

/* --- PASS CHECK FLOW --- */
function handlePassCheck() {
    const passNo = document.getElementById('pass-input').value.trim();
    const resultDiv = document.getElementById('pass-result');
    if (!passNo || passNo.length !== 6 || !/^[0-9]{6}$/.test(passNo)) {
        alert('Please enter a valid 6-digit pass number.');
        if (resultDiv) resultDiv.classList.add('hidden');
        return;
    }

    const rec = passDatabase[passNo];
    if (rec) {
        document.getElementById('pass-holder').innerText = rec.holder;
        document.getElementById('pass-route').innerText = `${rec.from} → ${rec.to}`;
        document.getElementById('pass-days').innerText = `${rec.daysValid} days`;
        document.getElementById('pass-expiry').innerText = rec.expiry;

        // compute days left until expiry
        try {
            const expiry = new Date(rec.expiry);
            const now = new Date();
            const diff = Math.ceil((expiry - now) / (1000*60*60*24));
            const leftText = diff >= 0 ? ` (${diff} days left)` : ' (Expired)';
            document.getElementById('pass-days').innerText = `${rec.daysValid} days${leftText}`;
        } catch (e) {
            // ignore
        }

    } else {
        document.getElementById('pass-holder').innerText = '--';
        document.getElementById('pass-route').innerText = '--';
        document.getElementById('pass-days').innerText = '--';
        document.getElementById('pass-expiry').innerText = '--';
        alert('Data not found. Retry.');
    }
    if (resultDiv) resultDiv.classList.remove('hidden');
}

// Auto-fix: Find full-screen blocking elements and disable pointer-events temporarily

// Run auto-fix on load (in case something left an overlay) and bind a keyboard shortcut Shift+I
window.addEventListener('load', function() {
    try { setTimeout(() => { autoInteractionFix(); }, 60); } catch (e) {}
});

window.addEventListener('keydown', function(e) {
    if (e.shiftKey && e.key.toLowerCase() === 'i') { autoInteractionFix(); }
});