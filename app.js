/**
 * Vel Murugan Finance - Single Page Application Engine
 * Pure ES6+ JavaScript implementing clean State Management, Responsive Routing,
 * Local Canvas-based Image Compression, Database Backups, and an EMI declining ledger.
 */

const firebaseConfig = {
  apiKey: "AIzaSyD063RHy5P6l9VqBCuaL9jY6uW48uxTtBg",
  authDomain: "vel-murugan-finance123.firebaseapp.com",
  projectId: "vel-murugan-finance123",
  storageBucket: "vel-murugan-finance123.firebasestorage.app",
  messagingSenderId: "196128046249",
  appId: "1:196128046249:web:b3ceca4d3dc04e5d8abdb8"
};

// Initialize Firebase Compat Safely and Dynamically
let db = null;
let firebaseEnabled = false;
let firebaseInitializationPromise = null;
const isLocalProtocol = window.location.protocol === 'file:';

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initializeFirebaseDynamic() {
  if (isLocalProtocol) {
    console.warn("Running on file:// protocol. Local storage fallback active.");
    return false;
  }
  try {
    // Load Firebase App Compat first, then load dependencies in parallel
    await loadScript("https://www.gstatic.com/firebasejs/12.14.0/firebase-app-compat.js");
    await Promise.all([
      loadScript("https://www.gstatic.com/firebasejs/12.14.0/firebase-auth-compat.js"),
      loadScript("https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore-compat.js")
    ]);
    
    if (typeof firebase !== 'undefined') {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      firebaseEnabled = true;
      return true;
    }
  } catch (error) {
    console.error("Failed to load or initialize Firebase SDKs dynamically:", error);
  }
  return false;
}

// Start loading immediately in the background
firebaseInitializationPromise = initializeFirebaseDynamic();

// Custom SVG Avatars & Icons for Preloaded Mock Data to give it an instant premium feel
const SVG_MOCK_AVATARS = {
  devi: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231e293b'/><circle cx='50' cy='40' r='22' fill='%23f59e0b'/><path d='M15 85 C15 65, 30 55, 50 55 C70 55, 85 65, 85 85 Z' fill='%23d97706'/></svg>`,
  ganesh: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231e293b'/><circle cx='50' cy='40' r='22' fill='%233b82f6'/><path d='M15 85 C15 65, 30 55, 50 55 C70 55, 85 65, 85 85 Z' fill='%232563eb'/></svg>`,
  arun: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231e293b'/><circle cx='50' cy='40' r='20' fill='%2310b981'/><path d='M20 85 C20 68, 32 58, 50 58 C68 58, 80 68, 80 85 Z' fill='%23059669'/></svg>`,
  meena: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100'><rect width='100' height='100' fill='%231e293b'/><circle cx='50' cy='40' r='20' fill='%238b5cf6'/><path d='M20 85 C20 68, 32 58, 50 58 C68 58, 80 68, 80 85 Z' fill='%237c3aed'/></svg>`,
  aadharMock: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 180' width='300' height='180'><rect width='300' height='180' rx='10' fill='%23ffffff' stroke='%23cbd5e1' stroke-width='3'/><rect x='15' y='15' width='270' height='30' rx='4' fill='%231e3a8a'/><text x='150' y='35' fill='%23ffffff' font-size='14' font-weight='bold' font-family='sans-serif' text-anchor='middle'>GOVERNMENT OF INDIA - AADHAR</text><circle cx='50' cy='100' r='30' fill='%23e2e8f0'/><rect x='100' y='70' width='150' height='10' rx='2' fill='%2394a3b8'/><rect x='100' y='90' width='120' height='10' rx='2' fill='%2394a3b8'/><rect x='100' y='110' width='170' height='10' rx='2' fill='%2394a3b8'/><text x='150' y='155' fill='%231e3a8a' font-size='16' font-weight='bold' font-family='monospace' text-anchor='middle'>1234  5678  9012</text></svg>`,
  chequeMock: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 150' width='320' height='150'><rect width='320' height='150' fill='%23ecfdf5' stroke='%23059669' stroke-width='2'/><text x='20' y='25' fill='%23065f46' font-size='10' font-weight='bold' font-family='sans-serif'>VEL MURUGAN FINANCE BANK</text><line x1='20' y1='50' x2='220' y2='50' stroke='%23047857' stroke-width='1'/><text x='230' y='50' fill='%23065f46' font-size='9' font-family='sans-serif'>Or Order</text><line x1='20' y1='80' x2='250' y2='80' stroke='%23047857' stroke-width='1'/><rect x='255' y='65' width='55' height='20' fill='none' stroke='%23047857' stroke-width='1'/><text x='260' y='78' fill='%23065f46' font-size='10' font-weight='bold'>Rs. 4,000/-</text><text x='40' y='135' fill='%23047857' font-size='10' font-family='monospace'>⑈012345⑈ 600240123⑆ 012345⑈ 10</text></svg>`
};

class FinanceApp {
  constructor() {
    // Application State Variables
    this.state = {
      groups: [],
      currentGroupId: null,
      currentCategory: null,     // "KL", "ML", "WL", "STL"
      currentSubgroupId: null,
      currentMemberId: null,
      searchQuery: ""
    };

    // Temporary upload storage variables (base64)
    this.tempLeaderPhoto = null;
    this.tempMemberPhoto = null;
    this.tempAadharPhoto = null;
    this.tempChequePhoto = null;

    // References to DOM Elements
    this.dom = {
      groupsContainer: document.getElementById("groups-container"),
      subgroupsContainer: document.getElementById("subgroups-container"),
      membersListContainer: document.getElementById("members-list-container"),
      memberProfileColumn: document.getElementById("member-profile-column"),
      memberTableColumn: document.getElementById("member-table-column"),
      breadcrumbsNav: document.getElementById("breadcrumbs-nav"),
      storageStatus: document.getElementById("storage-status"),
      
      // View Sections
      viewGroups: document.getElementById("view-groups"),
      viewCategories: document.getElementById("view-categories"),
      viewSubgroups: document.getElementById("view-subgroups"),
      viewPortal: document.getElementById("view-portal"),
      
      // Dynamic Headers
      categoriesTitleText: document.getElementById("categories-title-text"),
      subgroupsTitleText: document.getElementById("subgroups-title-text"),
      portalTitleText: document.getElementById("portal-title-text"),
      
      // Form Input Elements
      inputNewSubgroupName: document.getElementById("input-new-subgroup-name"),
      inputMemberSearch: document.getElementById("input-member-search")
    };

    // Initialize Theme
    this.currentTheme = localStorage.getItem("vm_finance_theme") || "dark";
    this.applyTheme(this.currentTheme);

    // Initialize application events
    this.initEventListeners();
    
    // Initialize Auth state listener after Firebase dynamic scripts load
    firebaseInitializationPromise.then((success) => {
      if (success && firebaseEnabled) {
        let authResolved = false;
        firebase.auth().onAuthStateChanged((user) => {
          authResolved = true;
          this.handleAuthStateChange(user);
        });
        
        // Safety timeout: if Firebase Auth doesn't resolve in 3 seconds, force hide loader
        setTimeout(() => {
          if (!authResolved) {
            console.warn("Firebase Auth resolution timed out. Falling back to local/cached status check.");
            this.initLocalAuth();
          }
        }, 3000);
      } else {
        this.initLocalAuth();
      }
    }).catch((err) => {
      console.error("Firebase init promise rejected:", err);
      this.initLocalAuth();
    });
  }

  // Handle Firebase Auth changes
  handleAuthStateChange(user) {
    const loginOverlay = document.getElementById("login-overlay");
    const btnSettingsToggle = document.getElementById("btn-settings-toggle");
    const appBodyLayout = document.getElementById("app-body-layout");
    const authLoadingOverlay = document.getElementById("auth-loading-overlay");
    
    if (user) {
      if (loginOverlay) loginOverlay.classList.remove("active");
      if (btnSettingsToggle) btnSettingsToggle.style.display = "inline-flex";
      this.loadFromStorage();
    } else {
      // Check if we have an active local/offline backdoor session
      const localUser = localStorage.getItem("vm_finance_local_user");
      if (localUser) {
        this.isLocalLoggedIn = true;
        if (loginOverlay) loginOverlay.classList.remove("active");
        if (btnSettingsToggle) btnSettingsToggle.style.display = "inline-flex";
        this.loadFromStorageLocalOnly();
      } else {
        if (loginOverlay) loginOverlay.classList.add("active");
        if (btnSettingsToggle) btnSettingsToggle.style.display = "none";
        if (appBodyLayout) appBodyLayout.classList.remove("settings-open");
        
        this.state.groups = [];
        this.render();
      }
    }

    if (authLoadingOverlay) {
      authLoadingOverlay.style.display = "none";
    }
  }

  // Initialize Local Authentication Offline Fallback
  initLocalAuth() {
    const loginOverlay = document.getElementById("login-overlay");
    const btnSettingsToggle = document.getElementById("btn-settings-toggle");
    const appBodyLayout = document.getElementById("app-body-layout");
    const authLoadingOverlay = document.getElementById("auth-loading-overlay");

    const localUser = localStorage.getItem("vm_finance_local_user");
    if (localUser) {
      this.isLocalLoggedIn = true;
      if (loginOverlay) loginOverlay.classList.remove("active");
      if (btnSettingsToggle) btnSettingsToggle.style.display = "inline-flex";
      this.loadFromStorageLocalOnly();
    } else {
      this.isLocalLoggedIn = false;
      if (loginOverlay) loginOverlay.classList.add("active");
      if (btnSettingsToggle) btnSettingsToggle.style.display = "none";
      if (appBodyLayout) appBodyLayout.classList.remove("settings-open");
      
      this.state.groups = [];
      this.render();
    }

    if (authLoadingOverlay) {
      authLoadingOverlay.style.display = "none";
    }
  }

  // Load database from LocalStorage only (Offline Mode)
  loadFromStorageLocalOnly() {
    const rawData = localStorage.getItem("vm_finance_groups");
    if (rawData) {
      try {
        this.state.groups = JSON.parse(rawData);
        this.migrateLegacyData();
        this.render();
      } catch (e) {
        console.error("Error parsing localStorage data, resetting...", e);
      }
    } else {
      this.loadMockData();
    }
    this.updateStorageStatusBadge();
    this.updateCloudStatus("error", "Local Mode (Offline) ⚠️");
  }

  // Save changes to LocalStorage and update the storage metrics badge, then sync to Firestore
  async saveToStorage(specificGroup = null) {
    try {
      const dataStr = JSON.stringify(this.state.groups);
      localStorage.setItem("vm_finance_groups", dataStr);
      this.updateStorageStatusBadge();
    } catch (e) {
      alert("Local storage is full! Canvas compressor prevented crash. Please export backup and clear data.");
      console.error(e);
    }

    if (firebaseEnabled && db) {
      this.updateCloudStatus("syncing");
      try {
        const groupToSync = specificGroup || this.getActiveGroup();
        if (groupToSync) {
          await db.collection("groups").doc(groupToSync.id).set(groupToSync);
          this.updateCloudStatus("synced");
        } else {
          this.updateCloudStatus("synced");
        }
      } catch (error) {
        console.error("Firestore sync error:", error);
        this.updateCloudStatus("error");
      }
    } else {
      this.updateCloudStatus("error", "Local Mode (Offline) ⚠️");
    }
  }

  // Load database from LocalStorage (cache-first), then fetch and merge from Firestore
  async loadFromStorage() {
    // 1. Immediately load local cache to keep it fast and responsive
    const rawData = localStorage.getItem("vm_finance_groups");
    if (rawData) {
      try {
        this.state.groups = JSON.parse(rawData);
        this.migrateLegacyData();
        this.render();
      } catch (e) {
        console.error("Error parsing localStorage data, resetting...", e);
      }
    } else {
      this.loadMockData();
    }
    this.updateStorageStatusBadge();

    // 2. Fetch latest data from Firestore in the background
    if (firebaseEnabled && db) {
      this.updateCloudStatus("syncing", "Cloud: Loading data...");
      try {
        const querySnapshot = await db.collection("groups").get();
        const fetchedGroups = [];
        querySnapshot.forEach((document) => {
          fetchedGroups.push(document.data());
        });

        if (fetchedGroups.length > 0) {
          this.state.groups = fetchedGroups;
          this.migrateLegacyData();
          // Update local storage cache
          try {
            localStorage.setItem("vm_finance_groups", JSON.stringify(this.state.groups));
            this.updateStorageStatusBadge();
          } catch (e) {
            console.error(e);
          }
          this.render();
          this.updateCloudStatus("synced", "Cloud Synced ✓");
        } else {
          // Firestore is empty. If we have local groups, upload them.
          if (this.state.groups.length > 0) {
            this.updateCloudStatus("syncing", "Cloud: Initializing database...");
            await this.uploadAllGroupsToFirestore();
          } else {
            this.updateCloudStatus("synced");
          }
        }
      } catch (error) {
        console.error("Error loading from Firestore:", error);
        this.updateCloudStatus("error", "Offline / Sync Error ⚠️");
      }
    } else {
      this.updateCloudStatus("error", "Local Mode (Offline) ⚠️");
    }
  }

  // Helper to migrate quotes in legacy SVG mock data
  migrateLegacyData() {
    let migrated = false;
    const replaceQuotes = (str) => {
      if (typeof str === 'string' && str.startsWith('data:image/svg+xml;') && str.includes('"')) {
        migrated = true;
        return str.replace(/"/g, "'");
      }
      return str;
    };

    this.state.groups.forEach(g => {
      if (g.leaderPhoto) g.leaderPhoto = replaceQuotes(g.leaderPhoto);
      if (g.categories) {
        Object.values(g.categories).forEach(catList => {
          if (Array.isArray(catList)) {
            catList.forEach(sub => {
              if (sub.members) {
                sub.members.forEach(m => {
                  if (m.photo) m.photo = replaceQuotes(m.photo);
                  if (m.aadharPhoto) m.aadharPhoto = replaceQuotes(m.aadharPhoto);
                  if (m.chequePhoto) m.chequePhoto = replaceQuotes(m.chequePhoto);
                });
              }
            });
          }
        });
      }
    });

    if (migrated) {
      try {
        localStorage.setItem("vm_finance_groups", JSON.stringify(this.state.groups));
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Update cloud sync status UI badge
  updateCloudStatus(status, message = "") {
    const el = document.getElementById("cloud-status");
    if (!el) return;
    
    el.classList.remove("cloud-syncing", "cloud-synced", "cloud-error");
    
    const textEl = document.getElementById("cloud-status-text");
    const iconEl = document.getElementById("cloud-status-icon");
    
    if (status === "syncing") {
      el.classList.add("cloud-syncing");
      if (textEl) textEl.innerText = message || "Cloud: Syncing...";
      if (iconEl) iconEl.innerText = "🔄";
    } else if (status === "synced") {
      el.classList.add("cloud-synced");
      if (textEl) textEl.innerText = message || "Cloud Synced ✓";
      if (iconEl) iconEl.innerText = "☁️";
    } else if (status === "error") {
      el.classList.add("cloud-error");
      if (textEl) textEl.innerText = message || "Sync Error ⚠️";
      if (iconEl) iconEl.innerText = "❌";
    }
  }

  // Upload all memory groups to Firestore (used on first-run mock loading or JSON imports)
  async uploadAllGroupsToFirestore() {
    if (!firebaseEnabled || !db) return;
    this.updateCloudStatus("syncing", "Cloud: Syncing database...");
    try {
      const syncPromises = [];
      for (const group of this.state.groups) {
        syncPromises.push(db.collection("groups").doc(group.id).set(group));
      }
      await Promise.all(syncPromises);
      this.updateCloudStatus("synced");
    } catch (e) {
      console.error("Error uploading all groups:", e);
      this.updateCloudStatus("error");
    }
  }

  // Clear all group documents from Firestore (used during Reset Database and before JSON imports)
  async clearAllGroupsFromFirestore() {
    if (!firebaseEnabled || !db) return;
    this.updateCloudStatus("syncing", "Cloud: Clearing database...");
    try {
      const querySnapshot = await db.collection("groups").get();
      const deletePromises = [];
      querySnapshot.forEach((document) => {
        deletePromises.push(document.ref.delete());
      });
      await Promise.all(deletePromises);
      this.updateCloudStatus("synced");
    } catch (e) {
      console.error("Error clearing Firestore:", e);
      this.updateCloudStatus("error");
    }
  }

  // Delete specific group document from Firestore
  async deleteGroupFromFirestore(groupId) {
    if (!firebaseEnabled || !db) return;
    this.updateCloudStatus("syncing");
    try {
      await db.collection("groups").doc(groupId).delete();
      this.updateCloudStatus("synced");
    } catch (e) {
      console.error("Firestore delete error:", e);
      this.updateCloudStatus("error");
    }
  }

  // Update storage size monitor badge at the top
  updateStorageStatusBadge() {
    const rawData = localStorage.getItem("vm_finance_groups") || "[]";
    const bytes = new Blob([rawData]).size;
    const mb = bytes / (1024 * 1024);
    if (this.dom.storageStatus) {
      this.dom.storageStatus.innerHTML = `
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        Storage Used: ${mb.toFixed(3)} MB
      `;
    }
  }

  // Injects premium responsive preloaded data for an instant out-of-the-box experience
  loadMockData() {
    const mockGroups = [
      {
        id: "group-1700000000000",
        name: "Mahalaxmi Primary Group",
        leaderPhoto: SVG_MOCK_AVATARS.devi,
        categories: {
          KL: [
            {
              id: "sub-101",
              name: "Kuruvai Trichy Sub-Group A",
              members: [
                {
                  id: "member-201",
                  name: "Arun Prasad S",
                  photo: SVG_MOCK_AVATARS.arun,
                  phone1: "9876543210",
                  phone2: "9443210987",
                  gender: "Male",
                  aadharNo: "523489012345",
                  memberId: "VM-201",
                  amount: 64000,
                  interest: 0,
                  installments: 16,
                  emi: 4000,
                  issueDate: "2026-01-10",
                  firstEmiMonth: "2026-02",
                  lastEmiMonth: "2027-05",
                  address: "Plot 12A, Gandhi Nagar First Street, Trichy - 620002",
                  aadharPhoto: SVG_MOCK_AVATARS.aadharMock,
                  chequePhoto: SVG_MOCK_AVATARS.chequeMock,
                  ticks: [true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false]
                },
                {
                  id: "member-202",
                  name: "Meena Krishnasamy",
                  photo: SVG_MOCK_AVATARS.meena,
                  phone1: "8123456789",
                  phone2: "",
                  gender: "Female",
                  aadharNo: "823489012345",
                  memberId: "VM-202",
                  amount: 80000,
                  interest: 0,
                  installments: 16,
                  emi: 5000,
                  issueDate: "2026-03-05",
                  firstEmiMonth: "2026-04",
                  lastEmiMonth: "2027-07",
                  address: "No. 45, West Car Street, Srirangam, Trichy - 620006",
                  aadharPhoto: SVG_MOCK_AVATARS.aadharMock,
                  chequePhoto: null,
                  ticks: [true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
                }
              ]
            }
          ],
          ML: [],
          WL: [],
          STL: []
        }
      },
      {
        id: "group-1700000000001",
        name: "Vinayagar Primary Group",
        leaderPhoto: SVG_MOCK_AVATARS.ganesh,
        categories: {
          KL: [],
          ML: [],
          WL: [
            {
              id: "sub-102",
              name: "Weekly Salem Retail A",
              members: []
            }
          ],
          STL: []
        }
      }
    ];
    this.state.groups = mockGroups;
    this.saveToStorage();
  }

  // Active client-side image compression with HTML5 Canvas to squeeze photos down to ~20-50KB
  compressImage(file, maxWidth, maxHeight, quality, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize algorithm maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with custom quality
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        callback(compressedBase64);
      };
    };
  }

  // Attaches event handlers to UI inputs, form submissions, and buttons
  initEventListeners() {
    // Settings sidebar toggle
    const btnSettings = document.getElementById("btn-settings-toggle");
    const btnCloseSettings = document.getElementById("btn-close-settings");
    const appBodyLayout = document.getElementById("app-body-layout");
    
    if (btnSettings && appBodyLayout) {
      btnSettings.addEventListener("click", (e) => {
        e.stopPropagation();
        appBodyLayout.classList.toggle("settings-open");
      });
    }
    if (btnCloseSettings && appBodyLayout) {
      btnCloseSettings.addEventListener("click", (e) => {
        e.stopPropagation();
        appBodyLayout.classList.remove("settings-open");
      });
    }

    // Login form submission handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const errorMsg = document.getElementById("login-error-msg");
        const btnSubmit = document.getElementById("btn-login-submit");
        const loginOverlay = document.getElementById("login-overlay");
        const btnSettingsToggle = document.getElementById("btn-settings-toggle");
        
        if (errorMsg) errorMsg.style.display = "none";
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerText = "Signing in...";
        }
        
        // Define local/backdoor accounts
        const isLocalAccount = (email === "admin@finance.com" && password === "admin123") || (email === "velmurugan" && password === "finance");
        
        if (firebaseEnabled && !isLocalAccount) {
          firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
              if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerText = "LOGIN";
              }
            })
            .catch((error) => {
              console.error("Login error:", error);
              if (errorMsg) {
                errorMsg.innerText = error.message || "Invalid credentials. Please try again.";
                errorMsg.style.display = "block";
              }
              if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerText = "LOGIN";
              }
            });
        } else {
          // Local Offline / Backdoor verification mode
          setTimeout(() => {
            if (isLocalAccount || (!firebaseEnabled && email && password)) {
              localStorage.setItem("vm_finance_local_user", email);
              this.isLocalLoggedIn = true;
              
              if (loginOverlay) loginOverlay.classList.remove("active");
              if (btnSettingsToggle) btnSettingsToggle.style.display = "inline-flex";
              
              this.loadFromStorageLocalOnly();
              
              if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerText = "LOGIN";
              }
            } else {
              if (errorMsg) {
                errorMsg.innerText = "Invalid credentials. Running offline? Enter any non-empty Email & Password.";
                errorMsg.style.display = "block";
              }
              if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerText = "LOGIN";
              }
            }
          }, 800);
        }
      });
    }

    // Logout button click handler
    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        if (confirm("Are you sure you want to sign out of the ledger portal?")) {
          if (firebaseEnabled) {
            firebase.auth().signOut().then(() => {
              window.location.reload();
            });
          } else {
            localStorage.removeItem("vm_finance_local_user");
            window.location.reload();
          }
        }
      });
    }

    // Export database backup
    document.getElementById("btn-export").addEventListener("click", () => this.exportData());
    
    // Import database backup
    document.getElementById("file-import").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.importData(e.target.files[0]);
      }
    });

    // Reset database to blank/empty
    document.getElementById("btn-reset").addEventListener("click", () => {
      if (confirm("Are you sure you want to RESET the database? This wipes all primary groups, subgroups, and member records. This action cannot be undone.")) {
        localStorage.removeItem("vm_finance_groups");
        this.state.groups = [];
        this.state.currentGroupId = null;
        this.state.currentCategory = null;
        this.state.currentSubgroupId = null;
        this.state.currentMemberId = null;
        this.saveToStorage();
        this.clearAllGroupsFromFirestore();
        this.render();
      }
    });

    // Level 1: View Chart Trigger
    document.getElementById("btn-view-chart").addEventListener("click", () => this.openChartModal());

    // Level 1: Add Group Trigger
    document.getElementById("btn-add-group-top").addEventListener("click", () => this.openGroupModal(null));

    // Level 2: Group Chart Trigger
    const btnGroupChart = document.getElementById("btn-view-group-chart");
    if (btnGroupChart) {
      btnGroupChart.addEventListener("click", () => this.openGroupChartModal());
    }

    // Level 3: Subgroup Chart Trigger
    const btnSubgroupChart = document.getElementById("btn-view-subgroup-chart");
    if (btnSubgroupChart) {
      btnSubgroupChart.addEventListener("click", () => this.openSubgroupChartModal());
    }

    // Chart Export PDF and CSV bindings
    const bindExport = (btnId, actionFn) => {
      const btn = document.getElementById(btnId);
      if (btn) btn.addEventListener("click", actionFn);
    };

    // Subgroup Chart Print/CSV
    bindExport("btn-print-subgroup-chart", () => this.printChart("subgroup-chart-table", "Vel Murugan Finance - Subgroup Analytics"));
    bindExport("btn-csv-subgroup-chart", () => this.exportChartToCSV("subgroup-chart-table", "subgroup_analytics.csv"));

    // Group Chart Print/CSV
    bindExport("btn-print-group-chart", () => this.printChart("group-chart-table", "Vel Murugan Finance - Group Members Analytics"));
    bindExport("btn-csv-group-chart", () => this.exportChartToCSV("group-chart-table", "group_members_analytics.csv"));

    // Main Chart Print/CSV
    bindExport("btn-print-main-chart", () => this.printChart("chart-table", "Vel Murugan Finance - Group Outstanding Analytics"));
    bindExport("btn-csv-main-chart", () => this.exportChartToCSV("chart-table", "group_outstanding_analytics.csv"));

    // File selection event compressing Group Leader's photo
    document.getElementById("input-leader-photo").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.compressImage(e.target.files[0], 250, 250, 0.6, (base64) => {
          this.tempLeaderPhoto = base64;
          document.getElementById("preview-leader-photo").src = base64;
          document.getElementById("preview-leader-photo").style.display = "block";
          document.getElementById("preview-leader-placeholder").style.display = "none";
          document.getElementById("btn-remove-leader-photo").style.display = "block";
        });
      }
    });

    // Remove Group Leader photo preview
    document.getElementById("btn-remove-leader-photo").addEventListener("click", () => {
      this.tempLeaderPhoto = null;
      document.getElementById("preview-leader-photo").src = "";
      document.getElementById("preview-leader-photo").style.display = "none";
      document.getElementById("preview-leader-placeholder").style.display = "flex";
      document.getElementById("btn-remove-leader-photo").style.display = "none";
      document.getElementById("input-leader-photo").value = "";
    });

    // Level 3: Add Sub-group Action trigger
    document.getElementById("btn-add-subgroup").addEventListener("click", () => this.createSubgroupAction());

    // Level 4: Member search query input
    this.dom.inputMemberSearch.addEventListener("input", (e) => {
      this.state.searchQuery = e.target.value.toLowerCase().trim();
      this.renderPortalMembersList();
    });

    // Level 4: Add Member Trigger
    document.getElementById("btn-add-member-sidebar").addEventListener("click", () => this.openMemberModal(null));

    // File selections compressing member photo, Aadhar and Cheque
    document.getElementById("input-member-photo").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.compressImage(e.target.files[0], 250, 250, 0.6, (base64) => {
          this.tempMemberPhoto = base64;
          document.getElementById("preview-member-photo").src = base64;
          document.getElementById("preview-member-photo").style.display = "block";
          document.getElementById("preview-member-placeholder").style.display = "none";
        });
      }
    });

    document.getElementById("input-m-aadhar").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.compressImage(e.target.files[0], 800, 600, 0.5, (base64) => {
          this.tempAadharPhoto = base64;
          document.getElementById("preview-m-aadhar").src = base64;
          document.getElementById("preview-m-aadhar").style.display = "block";
          document.getElementById("preview-m-aadhar-placeholder").style.display = "none";
          document.getElementById("label-m-aadhar-status").innerText = "Ready to upload";
        });
      }
    });

    document.getElementById("input-m-cheque").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.compressImage(e.target.files[0], 800, 600, 0.5, (base64) => {
          this.tempChequePhoto = base64;
          document.getElementById("preview-m-cheque").src = base64;
          document.getElementById("preview-m-cheque").style.display = "block";
          document.getElementById("preview-m-cheque-placeholder").style.display = "none";
          document.getElementById("label-m-cheque-status").innerText = "Ready to upload";
        });
      }
    });

    // Dynamic flat EMI calculation trigger: (Loan + Interest Amount) / Installments
    document.getElementById("btn-calc-emi").addEventListener("click", (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("input-m-amount").value) || 0;
      const interestINR = parseFloat(document.getElementById("input-m-interest").value) || 0;
      const installments = parseInt(document.getElementById("input-m-installments").value) || 16;
      
      if (amount <= 0 || installments <= 0) {
        alert("Please enter a valid loan Amount and Installment count.");
        return;
      }
      
      const rawEmi = (amount + interestINR) / installments;
      const emi = Math.round(rawEmi / 1000) * 1000;
      document.getElementById("input-m-emi").value = emi;
    });

    // Theme toggle switcher action
    document.getElementById("btn-theme-toggle").addEventListener("click", () => {
      const newTheme = this.currentTheme === "dark" ? "light" : "dark";
      this.applyTheme(newTheme);
    });

    // Enforce digit-only inputs and restrict length/type dynamically
    const enforceNumericOnly = (elId) => {
      const inputEl = document.getElementById(elId);
      if (inputEl) {
        inputEl.addEventListener("input", (e) => {
          e.target.value = e.target.value.replace(/\D/g, "");
        });
      }
    };
    enforceNumericOnly("input-m-phone1");
    enforceNumericOnly("input-m-phone2");
    enforceNumericOnly("input-m-aadhar-no");
  }

  // Applies Light/Dark theme styles and saves preferences
  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem("vm_finance_theme", theme);
    const body = document.body;
    const icon = document.getElementById("theme-toggle-icon");
    if (theme === "light") {
      body.classList.add("light-theme");
      if (icon) icon.innerText = "🌙";
    } else {
      body.classList.remove("light-theme");
      if (icon) icon.innerText = "☀️";
    }
  }

  // Displays custom pop-up warning the user of duplicate Aadhar, offering viewing choice
  showDuplicateAadharAlert(member, group, category, subgroup, memberId) {
    const alertDiv = document.createElement("div");
    alertDiv.id = "custom-duplicate-alert";
    alertDiv.className = "modal-overlay active";
    alertDiv.style.zIndex = "2000"; // Display above all other modals

    alertDiv.innerHTML = `
      <div class="modal-container" style="max-width: 420px; padding: 25px; text-align: center; display: flex; flex-direction: column; gap: 15px;">
        <div style="font-size: 40px; margin-bottom: 5px;">⚠️</div>
        <h3 class="modal-title" style="color: var(--accent-red); font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 700;">Duplicate Aadhar Number</h3>
        <p style="font-size: 13px; line-height: 1.5; color: var(--text-secondary);">
          Aadhar Number <strong>${member.aadharNo}</strong> is already assigned to:
          <br><br>
          <strong style="color: var(--text-primary); font-size: 15px;">${member.name} (ID: ${member.memberId})</strong>
          <br>
          Group: <strong>${group.name}</strong>
          <br>
          Subgroup: <strong>${subgroup.name}</strong> (${category} category)
        </p>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
          <button class="btn btn-primary" id="btn-alert-view-details" style="background: var(--grad-gold); color: #000; font-weight:600; width: 100%;">
            👁️ View ${member.name}'s Profile
          </button>
          <button class="btn btn-secondary" id="btn-alert-dismiss" style="width: 100%;">
            Dismiss & Save Details
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(alertDiv);

    document.getElementById("btn-alert-dismiss").onclick = () => {
      document.body.removeChild(alertDiv);
      this.saveMemberAction(memberId, true);
    };

    document.getElementById("btn-alert-view-details").onclick = () => {
      document.body.removeChild(alertDiv);
      this.closeModal("modal-member");
      this.navigateToMemberDetails(group.id, category, subgroup.id, member.id);
    };
  }

  // Opens the Group segment outstanding analytics chart summary modal
  openChartModal() {
    const tbody = document.getElementById("chart-table-body");
    if (!tbody) return;

    let html = "";
    
    // Iterate over all groups
    this.state.groups.forEach(g => {
      // Calculate outstanding for each category
      const klOut = this.getCategoryOutstanding(g.categories.KL || []);
      const mlOut = this.getCategoryOutstanding(g.categories.ML || []);
      const wlOut = this.getCategoryOutstanding(g.categories.WL || []);
      const stlOut = this.getCategoryOutstanding(g.categories.STL || []);
      const totalOut = klOut + mlOut + wlOut + stlOut;

      const formatVal = (val) => val > 0 ? "₹" + val.toLocaleString('en-IN') : "₹0";

      // Group leader profile photo or default
      const photoHtml = g.leaderPhoto 
        ? `<img src="${g.leaderPhoto}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">`
        : `<span style="font-size:16px;">👤</span>`;

      html += `
        <tr>
          <td style="display: flex; align-items: center; gap: 10px; font-weight: 600;">
            ${photoHtml}
            <span>${g.name}</span>
          </td>
          <td style="text-align: right; font-family: monospace;">${formatVal(klOut)}</td>
          <td style="text-align: right; font-family: monospace;">${formatVal(mlOut)}</td>
          <td style="text-align: right; font-family: monospace;">${formatVal(wlOut)}</td>
          <td style="text-align: right; font-family: monospace;">${formatVal(stlOut)}</td>
          <td style="text-align: right; font-family: monospace; font-weight: 700; color: var(--accent-gold);">${formatVal(totalOut)}</td>
        </tr>
      `;
    });

    // Add a Grand Total row
    let totalKL = 0, totalML = 0, totalWL = 0, totalSTL = 0;
    this.state.groups.forEach(g => {
      totalKL += this.getCategoryOutstanding(g.categories.KL || []);
      totalML += this.getCategoryOutstanding(g.categories.ML || []);
      totalWL += this.getCategoryOutstanding(g.categories.WL || []);
      totalSTL += this.getCategoryOutstanding(g.categories.STL || []);
    });
    const grandTotal = totalKL + totalML + totalWL + totalSTL;

    html += `
      <tr style="border-top: 2px solid var(--border-color); font-weight: 700; background: rgba(0,0,0,0.02);">
        <td>GRAND TOTAL</td>
        <td style="text-align: right; font-family: monospace;">₹${totalKL.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace;">₹${totalML.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace;">₹${totalWL.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace;">₹${totalSTL.toLocaleString('en-IN')}</td>
        <td style="text-align: right; font-family: monospace; color: var(--accent-gold);">₹${grandTotal.toLocaleString('en-IN')}</td>
      </tr>
    `;

    tbody.innerHTML = html;
    this.openModal("modal-chart");
  }

  // Opens the Subgroups analytics chart summary modal
  openSubgroupChartModal() {
    const group = this.getActiveGroup();
    if (!group || !this.state.currentCategory) return;

    const tbody = document.getElementById("subgroup-chart-table-body");
    if (!tbody) return;

    const list = group.categories[this.state.currentCategory] || [];
    let html = "";
    let grandTotalMembers = 0;
    let grandTotalEmi = 0;
    let grandTotalOutstanding = 0;

    if (list.length === 0) {
      html = `<tr><td colspan="4" style="text-align:center;">No subgroups found in this category.</td></tr>`;
    } else {
      list.forEach(sub => {
        const memberCount = sub.members ? sub.members.length : 0;
        let subgroupOutstanding = 0;
        let subgroupTotalEmi = 0;
        if (sub.members) {
          sub.members.forEach(m => {
            subgroupOutstanding += this.getMemberOutstanding(m);
            subgroupTotalEmi += (m.emi || 0);
          });
        }
        
        grandTotalMembers += memberCount;
        grandTotalEmi += subgroupTotalEmi;
        grandTotalOutstanding += subgroupOutstanding;

        html += `
          <tr>
            <td style="font-weight: 600;">${sub.name}</td>
            <td style="text-align: center;">${memberCount}</td>
            <td style="text-align: right; font-family: monospace; font-weight: 600;">
              ₹${subgroupTotalEmi.toLocaleString('en-IN')}
            </td>
            <td style="text-align: right; font-family: monospace; font-weight: 600; color: var(--accent-gold);">
              ₹${subgroupOutstanding.toLocaleString('en-IN')}
            </td>
          </tr>
        `;
      });

      // Add grand total row
      html += `
        <tr style="border-top: 2px solid var(--border-color); font-weight: 700; background: rgba(0,0,0,0.02);">
          <td>GRAND TOTAL</td>
          <td style="text-align: center;">${grandTotalMembers}</td>
          <td style="text-align: right; font-family: monospace;">
            ₹${grandTotalEmi.toLocaleString('en-IN')}
          </td>
          <td style="text-align: right; font-family: monospace; color: var(--accent-gold);">
            ₹${grandTotalOutstanding.toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }

    // Set title dynamically based on category
    const titleEl = document.getElementById("subgroup-chart-title");
    if (titleEl) {
      titleEl.innerText = `📊 Subgroup Analytics - ${group.name} (${this.state.currentCategory})`;
    }

    tbody.innerHTML = html;
    this.openModal("modal-subgroup-chart");
  }

  // Opens the Group members analytics chart summary modal
  openGroupChartModal() {
    const group = this.getActiveGroup();
    if (!group) return;

    const tbody = document.getElementById("group-chart-table-body");
    if (!tbody) return;

    let html = "";
    let grandTotalLoanInterest = 0;
    let grandTotalOutstanding = 0;
    let memberFound = false;

    // Collect all members from all categories of the active group
    const categories = ["KL", "ML", "WL", "STL"];
    categories.forEach(cat => {
      const sublist = group.categories[cat] || [];
      sublist.forEach(sub => {
        if (sub.members) {
          sub.members.forEach(m => {
            memberFound = true;
            const principal = m.amount || 64000;
            const interest = m.interest || 0;
            const totalLoanInterest = principal + interest;
            const outstanding = this.getMemberOutstanding(m);

            grandTotalLoanInterest += totalLoanInterest;
            grandTotalOutstanding += outstanding;

            html += `
              <tr>
                <td>
                  <div style="font-weight: 600; color: var(--text-primary);">${m.name}</div>
                  <div style="font-size: 11px; color: var(--text-secondary);">${m.memberId}</div>
                </td>
                <td>
                  <span style="font-size: 12px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.05); margin-right: 5px;">${cat}</span>
                  <span style="font-size: 12px; color: var(--text-secondary);">${sub.name}</span>
                </td>
                <td style="text-align: right; font-family: monospace;">₹${totalLoanInterest.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-family: monospace; font-weight: 600; color: var(--accent-gold);">₹${outstanding.toLocaleString('en-IN')}</td>
              </tr>
            `;
          });
        }
      });
    });

    if (!memberFound) {
      html = `<tr><td colspan="4" style="text-align:center;">No members found in this primary group.</td></tr>`;
    } else {
      html += `
        <tr style="border-top: 2px solid var(--border-color); font-weight: 700; background: rgba(0,0,0,0.02);">
          <td colspan="2">GRAND TOTAL</td>
          <td style="text-align: right; font-family: monospace;">₹${grandTotalLoanInterest.toLocaleString('en-IN')}</td>
          <td style="text-align: right; font-family: monospace; color: var(--accent-gold);">₹${grandTotalOutstanding.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }

    const titleEl = document.getElementById("group-chart-title");
    if (titleEl) {
      titleEl.innerText = `📊 Member Analytics - ${group.name}`;
    }

    tbody.innerHTML = html;
    this.openModal("modal-group-chart");
  }

  // Opens a print popup and saves/prints chart table to PDF format
  printChart(tableId, title) {
    const tableEl = document.getElementById(tableId);
    if (!tableEl) return;

    // Create a new window
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Popup blocker prevented printing. Please allow popups for this site.");
      return;
    }

    // Clone the table to avoid modifying the active DOM
    const tableClone = tableEl.cloneNode(true);
    
    // Write printable content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            padding: 40px;
            margin: 0;
          }
          h2 {
            font-family: 'Outfit', sans-serif;
            color: #0f172a;
            margin-bottom: 5px;
            font-size: 24px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
          }
          p.date-printed {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            border-bottom: 2px solid #cbd5e1;
            padding: 12px 8px;
          }
          td {
            padding: 12px 8px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          tr:nth-child(even) td {
            background-color: #fdfdfd;
          }
          tr.summary-row td, tr:last-child td {
            font-weight: 700;
            background-color: #f8fafc;
            border-top: 2px solid #94a3b8;
            border-bottom: 2px solid #94a3b8;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <p class="date-printed">Printed on: ${new Date().toLocaleString('en-IN')}</p>
        <div class="print-table-wrapper">
          ${tableClone.outerHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Exports tabular data directly to a downloadable CSV file
  exportChartToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csvContent = "";
    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {
      const cols = row.querySelectorAll("th, td");
      const rowData = [];
      cols.forEach(col => {
        let text = col.innerText;
        
        // Remove currency symbols, newlines, and double quotes
        text = text.replace(/₹/g, "");
        text = text.replace(/"/g, '""');
        if (text.includes(",") || text.includes("\n") || text.includes('"')) {
          text = `"${text}"`;
        }
        rowData.push(text.trim());
      });
      csvContent += rowData.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Helper navigating dynamically to specific member details card
  navigateToMemberDetails(groupId, category, subgroupId, memberId) {
    this.state.currentGroupId = groupId;
    this.state.currentCategory = category;
    this.state.currentSubgroupId = subgroupId;
    this.state.currentMemberId = memberId;
    this.render();
  }

  // Opens overlay modals
  openModal(modalId) {
    document.getElementById(modalId).classList.add("active");
  }

  // Closes overlay modals
  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  }

  // ── Camera Capture Methods ──────────────────────────────────────────────────

  // Opens the live camera modal and starts the device camera stream
  openCameraModal(targetInputId) {
    this._cameraTargetId = targetInputId;
    const video = document.getElementById("camera-video-stream");
    const noSupportMsg = document.getElementById("camera-no-support-msg");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      video.style.display = "none";
      noSupportMsg.style.display = "block";
      this.openModal("modal-camera");
      return;
    }

    video.style.display = "block";
    noSupportMsg.style.display = "none";

    // Prefer the rear camera on mobile devices
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then(stream => {
        this._cameraStream = stream;
        video.srcObject = stream;
      })
      .catch(err => {
        alert("Camera access denied or unavailable: " + err.message);
        return;
      });

    this.openModal("modal-camera");
  }

  // Stops the camera stream and closes the modal
  closeCameraModal() {
    if (this._cameraStream) {
      this._cameraStream.getTracks().forEach(t => t.stop());
      this._cameraStream = null;
    }
    const video = document.getElementById("camera-video-stream");
    video.srcObject = null;
    this.closeModal("modal-camera");
  }

  // Captures the current video frame and saves it to the target upload area
  capturePhoto() {
    const video = document.getElementById("camera-video-stream");
    const canvas = document.getElementById("camera-capture-canvas");

    if (!video.videoWidth || !video.videoHeight) {
      alert("Camera is not ready yet. Please wait a moment and try again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    // Mapping of input IDs to their preview/placeholder/status elements
    const map = {
      "input-leader-photo": {
        prev: "preview-leader-photo",
        placeholder: "preview-leader-placeholder",
        removeBtn: "btn-remove-leader-photo",
        status: null
      },
      "input-member-photo": {
        prev: "preview-member-photo",
        placeholder: "preview-member-placeholder",
        removeBtn: null,
        status: null
      },
      "input-m-aadhar": {
        prev: "preview-m-aadhar",
        placeholder: "preview-m-aadhar-placeholder",
        removeBtn: null,
        status: "label-m-aadhar-status",
        statusText: "Photo Captured"
      },
      "input-m-cheque": {
        prev: "preview-m-cheque",
        placeholder: "preview-m-cheque-placeholder",
        removeBtn: null,
        status: "label-m-cheque-status",
        statusText: "Photo Captured"
      }
    };

    const cfg = map[this._cameraTargetId];
    if (cfg) {
      const prevEl = document.getElementById(cfg.prev);
      const phEl = document.getElementById(cfg.placeholder);
      prevEl.src = dataUrl;
      prevEl.style.display = "block";
      if (phEl) phEl.style.display = "none";
      if (cfg.removeBtn) {
        const rb = document.getElementById(cfg.removeBtn);
        if (rb) rb.style.display = "block";
      }
      if (cfg.status) {
        document.getElementById(cfg.status).innerText = cfg.statusText;
      }

      // Store in temp vars so save actions pick them up
      if (this._cameraTargetId === "input-leader-photo") this.tempLeaderPhoto = dataUrl;
      if (this._cameraTargetId === "input-member-photo") this.tempMemberPhoto = dataUrl;
      if (this._cameraTargetId === "input-m-aadhar")     this.tempAadharPhoto = dataUrl;
      if (this._cameraTargetId === "input-m-cheque")     this.tempChequePhoto = dataUrl;
    }

    this.closeCameraModal();
  }

  // ── End Camera Capture Methods ──────────────────────────────────────────────

  // Clears group modal fields
  openGroupModal(group = null) {
    const title = document.getElementById("group-modal-title");
    const nameInput = document.getElementById("input-group-name");
    const btnSave = document.getElementById("btn-save-group");

    // Clear photo upload temp variables
    this.tempLeaderPhoto = null;
    document.getElementById("preview-leader-photo").src = "";
    document.getElementById("preview-leader-photo").style.display = "none";
    document.getElementById("preview-leader-placeholder").style.display = "flex";
    document.getElementById("btn-remove-leader-photo").style.display = "none";
    document.getElementById("input-leader-photo").value = "";

    if (group) {
      title.innerText = "Rename Primary Group";
      nameInput.value = group.name;
      btnSave.onclick = () => this.saveGroupAction(group.id);
      
      if (group.leaderPhoto) {
        this.tempLeaderPhoto = group.leaderPhoto;
        document.getElementById("preview-leader-photo").src = group.leaderPhoto;
        document.getElementById("preview-leader-photo").style.display = "block";
        document.getElementById("preview-leader-placeholder").style.display = "none";
        document.getElementById("btn-remove-leader-photo").style.display = "block";
      }
    } else {
      title.innerText = "Create New Primary Group";
      nameInput.value = "";
      btnSave.onclick = () => this.saveGroupAction(null);
    }
    
    this.openModal("modal-group");
  }

  // Saves or updates a primary group with double-click guard
  saveGroupAction(groupId = null) {
    const btnSave = document.getElementById("btn-save-group");
    if (btnSave && btnSave.disabled) return;
    if (btnSave) btnSave.disabled = true;

    const nameInput = document.getElementById("input-group-name");
    const nameVal = nameInput.value.trim();

    if (!nameVal) {
      alert("Please provide a valid Group Name.");
      if (btnSave) btnSave.disabled = false;
      return;
    }

    let targetGroup = null;
    if (groupId) {
      // Edit mode
      const group = this.state.groups.find(g => g.id === groupId);
      if (group) {
        group.name = nameVal;
        group.leaderPhoto = this.tempLeaderPhoto;
        targetGroup = group;
      }
    } else {
      // Create mode
      const newGroup = {
        id: "group-" + Date.now(),
        name: nameVal,
        leaderPhoto: this.tempLeaderPhoto,
        categories: { KL: [], ML: [], WL: [], STL: [] }
      };
      this.state.groups.push(newGroup);
      targetGroup = newGroup;
    }

    this.saveToStorage(targetGroup);
    this.closeModal("modal-group");
    this.render();

    if (btnSave) btnSave.disabled = false;
  }

  // Deletes a primary group directory
  deleteGroupAction(groupId, e) {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to delete this primary group? Everything nested inside (categories, subgroups, members, document records) will be deleted permanently.")) {
      this.state.groups = this.state.groups.filter(g => g.id !== groupId);
      
      if (this.state.currentGroupId === groupId) {
        this.state.currentGroupId = null;
        this.state.currentCategory = null;
        this.state.currentSubgroupId = null;
        this.state.currentMemberId = null;
      }
      
      this.saveToStorage();
      this.deleteGroupFromFirestore(groupId);
      this.render();
    }
  }

  // Subgroup creation form handler
  createSubgroupAction() {
    const nameVal = this.dom.inputNewSubgroupName.value.trim();
    if (!nameVal) {
      alert("Please enter a name for the subgroup.");
      return;
    }

    const group = this.getActiveGroup();
    if (!group || !this.state.currentCategory) return;

    const list = group.categories[this.state.currentCategory];
    
    const newSub = {
      id: "subgroup-" + Date.now(),
      name: nameVal,
      members: []
    };

    list.push(newSub);
    this.dom.inputNewSubgroupName.value = "";
    
    this.saveToStorage();
    this.renderSubgroupsList();
  }

  // Subgroup deletion handler
  deleteSubgroupAction(subId, e) {
    if (e) e.stopPropagation();
    if (confirm("Are you sure you want to delete this subgroup? All members nested inside will be deleted permanently.")) {
      const group = this.getActiveGroup();
      if (!group || !this.state.currentCategory) return;

      group.categories[this.state.currentCategory] = group.categories[this.state.currentCategory].filter(s => s.id !== subId);
      
      if (this.state.currentSubgroupId === subId) {
        this.state.currentSubgroupId = null;
        this.state.currentMemberId = null;
      }

      this.saveToStorage();
      this.renderSubgroupsList();
    }
  }

  // Opens Add / Edit Member form Modal
  openMemberModal(member = null) {
    const title = document.getElementById("member-modal-title");
    const btnSave = document.getElementById("btn-save-member");

    // Reset temporary variables & forms elements
    this.tempMemberPhoto = null;
    this.tempAadharPhoto = null;
    this.tempChequePhoto = null;

    document.getElementById("preview-member-photo").src = "";
    document.getElementById("preview-member-photo").style.display = "none";
    document.getElementById("preview-member-placeholder").style.display = "flex";

    document.getElementById("preview-m-aadhar").src = "";
    document.getElementById("preview-m-aadhar").style.display = "none";
    document.getElementById("preview-m-aadhar-placeholder").style.display = "flex";
    document.getElementById("label-m-aadhar-status").innerText = "No Document Uploaded";

    document.getElementById("preview-m-cheque").src = "";
    document.getElementById("preview-m-cheque").style.display = "none";
    document.getElementById("preview-m-cheque-placeholder").style.display = "flex";
    document.getElementById("label-m-cheque-status").innerText = "No Document Uploaded";

    // Standard resets — KL defaults: 50000 principal, 14000 interest, 16 installments, 4000 EMI
    document.getElementById("input-m-name").value = "";
    document.getElementById("input-m-id").value = "";
    document.getElementById("input-m-phone1").value = "";
    document.getElementById("input-m-phone2").value = "";
    document.getElementById("input-m-aadhar-no").value = "";
    document.getElementById("input-m-amount").value = 50000;
    document.getElementById("input-m-interest").value = 14000;
    document.getElementById("input-m-installments").value = 16;
    document.getElementById("input-m-emi").value = 4000;
    document.getElementById("input-m-issue-date").value = new Date().toISOString().substring(0, 10);
    document.getElementById("input-m-first-emi").value = "";
    document.getElementById("input-m-last-emi").value = "";
    document.getElementById("input-m-address").value = "";

    // Clear input values
    document.getElementById("input-member-photo").value = "";
    document.getElementById("input-m-aadhar").value = "";
    document.getElementById("input-m-cheque").value = "";

    if (member) {
      title.innerText = "Edit Member Ledger Details";
      btnSave.onclick = () => this.saveMemberAction(member.id);

      // Pre-fill values
      document.getElementById("input-m-name").value = member.name || "";
      document.getElementById("input-m-id").value = member.memberId || "";
      document.getElementById("input-m-phone1").value = member.phone1 || "";
      document.getElementById("input-m-phone2").value = member.phone2 || "";
      document.getElementById("input-m-aadhar-no").value = member.aadharNo || "";
      document.getElementById("input-m-amount").value = member.amount || 64000;
      document.getElementById("input-m-interest").value = member.interest !== undefined ? member.interest : 0;
      document.getElementById("input-m-installments").value = member.installments || 16;
      document.getElementById("input-m-emi").value = member.emi || 4000;
      document.getElementById("input-m-issue-date").value = member.issueDate || "";
      document.getElementById("input-m-first-emi").value = member.firstEmiMonth || "";
      document.getElementById("input-m-last-emi").value = member.lastEmiMonth || "";
      document.getElementById("input-m-address").value = member.address || "";

      // Populate Gender radio buttons
      const genderVal = member.gender || "Male";
      if (genderVal === "Female") {
        document.getElementById("gender-female").checked = true;
      } else {
        document.getElementById("gender-male").checked = true;
      }

      if (member.photo) {
        this.tempMemberPhoto = member.photo;
        document.getElementById("preview-member-photo").src = member.photo;
        document.getElementById("preview-member-photo").style.display = "block";
        document.getElementById("preview-member-placeholder").style.display = "none";
      }

      if (member.aadharPhoto) {
        this.tempAadharPhoto = member.aadharPhoto;
        document.getElementById("preview-m-aadhar").src = member.aadharPhoto;
        document.getElementById("preview-m-aadhar").style.display = "block";
        document.getElementById("preview-m-aadhar-placeholder").style.display = "none";
        document.getElementById("label-m-aadhar-status").innerText = "Uploaded Card Saved";
      }

      if (member.chequePhoto) {
        this.tempChequePhoto = member.chequePhoto;
        document.getElementById("preview-m-cheque").src = member.chequePhoto;
        document.getElementById("preview-m-cheque").style.display = "block";
        document.getElementById("preview-m-cheque-placeholder").style.display = "none";
        document.getElementById("label-m-cheque-status").innerText = "Uploaded Cheque Saved";
      }
    } else {
      title.innerText = "Add New Subgroup Member";
      btnSave.onclick = () => this.saveMemberAction(null);
      
      // Default Gender radio to Male
      document.getElementById("gender-male").checked = true;
      
      // Auto pre-fill First / Last EMI months based on today's date
      const today = new Date();
      const firstEmiDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const firstEmiStr = firstEmiDate.toISOString().substring(0, 7);
      const installments = parseInt(document.getElementById("input-m-installments").value) || 16;
      const lastEmiDate = new Date(today.getFullYear(), today.getMonth() + 1 + (installments - 1), 1);
      const lastEmiStr = lastEmiDate.toISOString().substring(0, 7);

      document.getElementById("input-m-first-emi").value = firstEmiStr;
      document.getElementById("input-m-last-emi").value = lastEmiStr;
    }

    // WL Category Customizations
    const isWL = this.state.currentCategory === "WL";
    const groupFirstEmi = document.getElementById("form-group-first-emi");
    const groupLastEmi = document.getElementById("form-group-last-emi");
    const inputInstallments = document.getElementById("input-m-installments");

    if (isWL) {
      if (groupFirstEmi) groupFirstEmi.style.display = "none";
      if (groupLastEmi) groupLastEmi.style.display = "none";
      inputInstallments.value = 10;
      inputInstallments.readOnly = true;
    } else {
      if (groupFirstEmi) groupFirstEmi.style.display = "";
      if (groupLastEmi) groupLastEmi.style.display = "";
      inputInstallments.readOnly = false;
    }

    // Helper: compute last EMI month from first EMI + (installments - 1) months
    const computeLastEmi = () => {
      const firstVal = document.getElementById("input-m-first-emi").value;
      const inst = parseInt(document.getElementById("input-m-installments").value) || 16;
      if (!firstVal) return;
      // Parse year and month from "yyyy-mm" string safely
      const [yr, mo] = firstVal.split("-").map(Number);
      // last EMI = firstEMI + (installments - 1) months
      // e.g. Feb 2026 + 15 months = May 2027
      const lastDate = new Date(yr, mo - 1 + (inst - 1), 1);
      const lastYr = lastDate.getFullYear();
      const lastMo = String(lastDate.getMonth() + 1).padStart(2, "0");
      document.getElementById("input-m-last-emi").value = `${lastYr}-${lastMo}`;
    };

    // On issue-date change → auto-set first EMI to next month, recalculate last EMI
    const updateEmiFromIssueDate = () => {
      const val = document.getElementById("input-m-issue-date").value;
      if (!val) return;
      // Parse date parts safely (avoids UTC timezone shift from new Date("yyyy-mm-dd"))
      const [iYr, iMo] = val.split("-").map(Number);
      // First EMI = next month after issue month
      const firstEmiDate = new Date(iYr, iMo, 1); // iMo is already 0-indexed next month (Jan=1 → Feb=iMo=1 → new Date(yr,1,1)=Feb)
      const firstYr = firstEmiDate.getFullYear();
      const firstMo = String(firstEmiDate.getMonth() + 1).padStart(2, "0");
      document.getElementById("input-m-first-emi").value = `${firstYr}-${firstMo}`;
      computeLastEmi();
    };

    const issueDateInput = document.getElementById("input-m-issue-date");
    issueDateInput.onchange = updateEmiFromIssueDate;
    issueDateInput.oninput = updateEmiFromIssueDate;

    // On first EMI change → recalculate last EMI
    const firstEmiInput = document.getElementById("input-m-first-emi");
    firstEmiInput.onchange = () => computeLastEmi();
    firstEmiInput.oninput = () => computeLastEmi();

    // On installments change → recalculate last EMI
    const installmentsInput = document.getElementById("input-m-installments");
    installmentsInput.onchange = () => computeLastEmi();
    installmentsInput.oninput = () => computeLastEmi();

    this.openModal("modal-member");
  }

  // Saves or updates a member's full profile with double-click guard
  saveMemberAction(memberId = null, bypassDuplicate = false) {
    const btnSave = document.getElementById("btn-save-member");
    if (btnSave && btnSave.disabled) return;
    if (btnSave) btnSave.disabled = true;

    const name = document.getElementById("input-m-name").value.trim();
    const mId = document.getElementById("input-m-id").value.trim();
    const phone1 = document.getElementById("input-m-phone1").value.trim();
    const phone2 = document.getElementById("input-m-phone2").value.trim();
    const aadharNo = document.getElementById("input-m-aadhar-no").value.trim();
    const amount = parseFloat(document.getElementById("input-m-amount").value) || 0;
    const interest = parseFloat(document.getElementById("input-m-interest").value) || 0;
    const installments = parseInt(document.getElementById("input-m-installments").value) || 16;
    const emi = parseFloat(document.getElementById("input-m-emi").value) || 0;
    const issueDate = document.getElementById("input-m-issue-date").value;
    const firstEmiMonth = document.getElementById("input-m-first-emi").value;
    const lastEmiMonth = document.getElementById("input-m-last-emi").value;
    const address = document.getElementById("input-m-address").value.trim();

    // Get selected Gender value
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const gender = genderEl ? genderEl.value : "Male";

    if (!name || !mId || !phone1 || amount <= 0 || installments <= 0 || emi <= 0) {
      alert("Please fill in all required fields (*) with valid values.");
      if (btnSave) btnSave.disabled = false;
      return;
    }

    // Aadhar number validation: exactly 12 numeric digits (only if entered)
    if (aadharNo && !/^\d{12}$/.test(aadharNo)) {
      alert("Aadhar number must be exactly 12 numeric digits.");
      if (btnSave) btnSave.disabled = false;
      return;
    }

    // Phone number validation: exactly 10 numeric digits
    if (!/^\d{10}$/.test(phone1)) {
      alert("Primary Phone number must be exactly 10 digits.");
      if (btnSave) btnSave.disabled = false;
      return;
    }

    if (phone2 && !/^\d{10}$/.test(phone2)) {
      alert("Secondary Phone number must be exactly 10 digits.");
      if (btnSave) btnSave.disabled = false;
      return;
    }

    // Duplicate Aadhar verification across all groups/subgroups
    let duplicateMember = null;
    let duplicateGroup = null;
    let duplicateCategory = null;
    let duplicateSubgroup = null;

    if (!bypassDuplicate && aadharNo) {
      for (const g of this.state.groups) {
        for (const [catName, subList] of Object.entries(g.categories)) {
          for (const sub of subList) {
            if (sub.members) {
              for (const m of sub.members) {
                if (m.id !== memberId && m.aadharNo === aadharNo) {
                  duplicateMember = m;
                  duplicateGroup = g;
                  duplicateCategory = catName;
                  duplicateSubgroup = sub;
                  break;
                }
              }
            }
            if (duplicateMember) break;
          }
          if (duplicateMember) break;
        }
        if (duplicateMember) break;
      }
    }

    if (duplicateMember) {
      this.showDuplicateAadharAlert(duplicateMember, duplicateGroup, duplicateCategory, duplicateSubgroup, memberId);
      if (btnSave) btnSave.disabled = false;
      return;
    }

    const subgroup = this.getActiveSubgroup();
    if (!subgroup) {
      if (btnSave) btnSave.disabled = false;
      return;
    }

    if (memberId) {
      // Edit Mode
      const member = subgroup.members.find(m => m.id === memberId);
      if (member) {
        member.name = name;
        member.memberId = mId;
        member.phone1 = phone1;
        member.phone2 = phone2;
        member.gender = gender; // Save gender
        member.aadharNo = aadharNo;
        member.amount = amount;
        member.interest = interest;
        
        // If installments number changed, dynamically adjust ticks array
        if (member.installments !== installments) {
          const oldTicks = member.ticks || [];
          const newTicks = Array(installments).fill(false);
          for (let i = 0; i < Math.min(oldTicks.length, installments); i++) {
            newTicks[i] = oldTicks[i];
          }
          member.ticks = newTicks;
        }
        
        member.installments = installments;
        member.emi = emi;
        member.issueDate = issueDate;
        member.firstEmiMonth = firstEmiMonth;
        member.lastEmiMonth = lastEmiMonth;
        member.address = address;
        member.photo = this.tempMemberPhoto;
        member.aadharPhoto = this.tempAadharPhoto;
        member.chequePhoto = this.tempChequePhoto;
      }
    } else {
      // Create Mode
      const newMember = {
        id: "member-" + Date.now(),
        name: name,
        memberId: mId,
        phone1: phone1,
        phone2: phone2,
        gender: gender, // Save gender
        aadharNo: aadharNo,
        amount: amount,
        interest: interest,
        installments: installments,
        emi: emi,
        issueDate: issueDate,
        firstEmiMonth: firstEmiMonth,
        lastEmiMonth: lastEmiMonth,
        address: address,
        photo: this.tempMemberPhoto,
        aadharPhoto: this.tempAadharPhoto,
        chequePhoto: this.tempChequePhoto,
        ticks: Array(installments).fill(false) // initialize installment ticks
      };
      
      if (!subgroup.members) subgroup.members = [];
      subgroup.members.push(newMember);
      this.state.currentMemberId = newMember.id; // Auto select new member
    }

    this.saveToStorage();
    this.closeModal("modal-member");
    this.renderPortalMembersList();
    this.renderActiveMemberDetails();

    if (btnSave) btnSave.disabled = false;
  }

  // Deletes a member profile record from a subgroup
  deleteMemberAction(mId) {
    if (confirm("Are you sure you want to delete this member's entire ledger card? This action is irreversible.")) {
      const subgroup = this.getActiveSubgroup();
      if (!subgroup) return;

      subgroup.members = subgroup.members.filter(m => m.id !== mId);
      
      if (this.state.currentMemberId === mId) {
        this.state.currentMemberId = subgroup.members.length > 0 ? subgroup.members[0].id : null;
      }

      this.saveToStorage();
      this.renderPortalMembersList();
      this.renderActiveMemberDetails();
    }
  }

  // Deletes uploaded image documents from active member record
  deleteDocumentAction(docType) {
    if (confirm(`Are you sure you want to delete this ${docType === 'aadharPhoto' ? 'Aadhar Card' : 'Cheque Leaf'} document?`)) {
      const member = this.getActiveMember();
      if (member) {
        member[docType] = null;
        this.saveToStorage();
        this.renderActiveMemberDetails();
      }
    }
  }

  // Download document utility
  downloadDocument(base64Data, filename) {
    if (!base64Data) return;
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Opens a custom beautiful Overlay Modal viewing Aadhar or Cheque leaf at full scale
  viewDocumentModal(base64Data, title) {
    if (!base64Data) return;
    document.getElementById("doc-viewer-title").innerText = title;
    
    const imgElement = document.getElementById("doc-viewer-img");
    imgElement.src = base64Data;
    
    // Set download action button
    const btnDownload = document.getElementById("btn-download-doc");
    btnDownload.onclick = () => this.downloadDocument(base64Data, title.toLowerCase().replace(/\s+/g, "_") + ".jpg");

    this.openModal("modal-doc-viewer");
  }

  // Handles checkbox tick changes on EMI declining table
  toggleInstallmentTick(rowIdx) {
    const member = this.getActiveMember();
    if (!member) return;

    const totalRows = this.state.currentCategory === "WL" ? 10 : (member.installments || 16);
    if (!member.ticks || member.ticks.length !== totalRows) {
      const old = member.ticks || [];
      member.ticks = Array(totalRows).fill(false);
      for (let i = 0; i < Math.min(old.length, totalRows); i++) {
        member.ticks[i] = old[i];
      }
    }

    const currentlyTicked = member.ticks[rowIdx];
    if (!currentlyTicked) {
      // Checking: mark all prior rows as ticked
      for (let i = 0; i <= rowIdx; i++) {
        member.ticks[i] = true;
      }
    } else {
      // Unchecking: mark all subsequent rows as unticked
      for (let i = rowIdx; i < totalRows; i++) {
        member.ticks[i] = false;
      }
    }
    
    this.saveToStorage();
    
    // Re-render only columns columns to avoid profile reloading flicker
    this.renderActiveMemberTable();
  }

  // Helper to calculate outstanding balance for a member
  getMemberOutstanding(member) {
    if (!member) return 0;
    const principalAmount = member.amount || 64000;
    const interestAmount = member.interest || 0;
    const startingReferenceAmount = principalAmount + interestAmount;
    const emi = member.emi || 4000;
    const totalRows = member.installments || 16;
    
    let paidCount = 0;
    if (member.ticks) {
      paidCount = member.ticks.filter(t => t).length;
    }
    const totalAmountPaid = paidCount * emi;
    return Math.max(0, startingReferenceAmount - totalAmountPaid);
  }

  // Helper to calculate total outstanding balance for a category segment
  getCategoryOutstanding(categoryList) {
    let total = 0;
    if (categoryList) {
      categoryList.forEach(sub => {
        if (sub.members) {
          sub.members.forEach(m => {
            total += this.getMemberOutstanding(m);
          });
        }
      });
    }
    return total;
  }

  // Helper getters retrieving active context states
  getActiveGroup() {
    return this.state.groups.find(g => g.id === this.state.currentGroupId);
  }

  getActiveSubgroup() {
    const group = this.getActiveGroup();
    if (!group || !this.state.currentCategory || !this.state.currentSubgroupId) return null;
    return group.categories[this.state.currentCategory].find(s => s.id === this.state.currentSubgroupId);
  }

  getActiveMember() {
    const sub = this.getActiveSubgroup();
    if (!sub || !this.state.currentMemberId) return null;
    return sub.members.find(m => m.id === this.state.currentMemberId);
  }

  // Renders the overall webpage based on active directory depths
  render() {
    this.renderBreadcrumbs();
    
    // De-activate all view panels
    this.dom.viewGroups.classList.remove("active");
    this.dom.viewCategories.classList.remove("active");
    this.dom.viewSubgroups.classList.remove("active");
    this.dom.viewPortal.classList.remove("active");

    if (this.state.currentGroupId === null) {
      // Level 1: Primary Groups Grid View
      this.dom.viewGroups.classList.add("active");
      this.renderGroupsGrid();
    } else if (this.state.currentCategory === null) {
      // Level 2: 4 Category Dashboard View
      this.dom.viewCategories.classList.add("active");
      this.renderCategoriesDashboard();
    } else if (this.state.currentSubgroupId === null) {
      // Level 3: Sub-groups List View
      this.dom.viewSubgroups.classList.add("active");
      this.renderSubgroupsList();
    } else {
      // Level 4: 3-Column Member Portal
      this.dom.viewPortal.classList.add("active");
      
      const sub = this.getActiveSubgroup();
      // Auto select first member if selection is empty and list is populated
      if (sub && sub.members && sub.members.length > 0 && !this.state.currentMemberId) {
        this.state.currentMemberId = sub.members[0].id;
      }
      
      this.renderPortalMembersList();
      this.renderActiveMemberDetails();
    }
  }

  // Dynamic breadcrumb indicators tracking folder depths and clicks
  renderBreadcrumbs() {
    let html = `<div class="breadcrumb-item" onclick="app.navigateToHome()">Vel Murugan Finance 📁</div>`;
    
    if (this.state.currentGroupId !== null) {
      const g = this.getActiveGroup();
      if (g) {
        html += `
          <div class="breadcrumb-separator">></div>
          <div class="breadcrumb-item" onclick="app.navigateToGroup('${g.id}')">${g.name}</div>
        `;
      }
    }

    if (this.state.currentCategory !== null) {
      html += `
        <div class="breadcrumb-separator">></div>
        <div class="breadcrumb-item" onclick="app.navigateToCategory('${this.state.currentCategory}')">${this.state.currentCategory} Category</div>
      `;
    }

    if (this.state.currentSubgroupId !== null) {
      const sub = this.getActiveSubgroup();
      if (sub) {
        html += `
          <div class="breadcrumb-separator">></div>
          <div class="breadcrumb-item active">${sub.name}</div>
        `;
      }
    }

    this.dom.breadcrumbsNav.innerHTML = html;
  }

  // Navigation handlers
  navigateToHome() {
    this.state.currentGroupId = null;
    this.state.currentCategory = null;
    this.state.currentSubgroupId = null;
    this.state.currentMemberId = null;
    this.render();
  }

  navigateToGroup(groupId) {
    this.state.currentGroupId = groupId;
    this.state.currentCategory = null;
    this.state.currentSubgroupId = null;
    this.state.currentMemberId = null;
    this.render();
  }

  navigateToCategory(cat) {
    this.state.currentCategory = cat;
    this.state.currentSubgroupId = null;
    this.state.currentMemberId = null;
    this.render();
  }

  navigateBack() {
    if (this.state.currentSubgroupId !== null) {
      this.state.currentSubgroupId = null;
      this.state.currentMemberId = null;
    } else if (this.state.currentCategory !== null) {
      this.state.currentCategory = null;
    } else if (this.state.currentGroupId !== null) {
      this.state.currentGroupId = null;
    }
    this.render();
  }

  // Render Grid of Primary Groups (Level 1)
  renderGroupsGrid() {
    let html = "";
    
    this.state.groups.forEach(g => {
      const photoHtml = g.leaderPhoto 
        ? `<img class="leader-avatar" src="${g.leaderPhoto}" alt="${g.name} Leader">`
        : `<span class="leader-avatar-placeholder">👤</span>`;
      
      html += `
        <div class="group-card" onclick="app.navigateToGroup('${g.id}')">
          <div class="leader-avatar-container">
            ${photoHtml}
          </div>
          <div class="group-name">${g.name}</div>
          <div class="leader-label">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7-8v2m0 0v2m0-2h2m-2 0h-2"/></svg>
            Group Leader
          </div>
          
          <div class="group-card-actions">
            <button class="btn btn-secondary btn-icon-only" title="Rename Group" onclick="app.openGroupEditModal('${g.id}', event)">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="btn btn-danger btn-icon-only" title="Delete Group" onclick="app.deleteGroupAction('${g.id}', event)">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      `;
    });

    // Elegant dashed add group card
    html += `
      <div class="add-card" onclick="app.openGroupModal(null)">
        <div class="add-card-icon">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <span>Add Group</span>
      </div>
    `;

    this.dom.groupsContainer.innerHTML = html;
  }

  // Opens modal directly in edit mode preventing bubble click navigation
  openGroupEditModal(groupId, e) {
    if (e) e.stopPropagation();
    const group = this.state.groups.find(g => g.id === groupId);
    if (group) this.openGroupModal(group);
  }

  // Render Category Picker dashboard (Level 2)
  renderCategoriesDashboard() {
    const group = this.getActiveGroup();
    if (!group) return;
    
    this.dom.categoriesTitleText.innerText = `${group.name} - Loan Segments`;

    // Calculate subgroup counts and outstanding amounts dynamically for badges
    const updateCategoryBadge = (catKey, countBadgeId, amountBadgeId) => {
      const list = group.categories[catKey] || [];
      const count = list.length;
      document.getElementById(countBadgeId).innerText = `${count} Subgroups`;
      
      const outstanding = this.getCategoryOutstanding(list);
      const amountEl = document.getElementById(amountBadgeId);
      if (amountEl) {
        amountEl.innerText = `Outstanding: ₹${outstanding.toLocaleString('en-IN')}`;
      }
    };

    updateCategoryBadge("KL", "badge-kl-count", "badge-kl-amount");
    updateCategoryBadge("ML", "badge-ml-count", "badge-ml-amount");
    updateCategoryBadge("WL", "badge-wl-count", "badge-wl-amount");
    updateCategoryBadge("STL", "badge-stl-count", "badge-stl-amount");
  }

  // Selects a category option and pushes to Level 3
  selectCategory(cat) {
    this.state.currentCategory = cat;
    this.render();
  }

  // Render Subgroups List page (Level 3)
  renderSubgroupsList() {
    const group = this.getActiveGroup();
    if (!group || !this.state.currentCategory) return;

    this.dom.subgroupsTitleText.innerText = `${group.name} > ${this.state.currentCategory} Category Sub-Groups`;
    
    const list = group.categories[this.state.currentCategory] || [];
    let html = "";

    if (list.length === 0) {
      html = `
        <div class="empty-state">
          <div class="empty-state-icon">📁</div>
          <h3>No Subgroups in this segment</h3>
          <p>Provide a name above and click "Add Subgroup" to create directory branches.</p>
        </div>
      `;
    } else {
      list.forEach(sub => {
        const memberCount = sub.members ? sub.members.length : 0;
        
        let subgroupOutstanding = 0;
        if (sub.members) {
          sub.members.forEach(m => {
            subgroupOutstanding += this.getMemberOutstanding(m);
          });
        }

        html += `
          <div class="subgroup-item" onclick="app.enterSubgroup('${sub.id}')">
            <div class="subgroup-info">
              <svg class="subgroup-folder-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <span class="subgroup-name-text">${sub.name}</span>
            </div>
            
            <div style="display:flex; align-items:center; gap:15px;">
              <span class="subgroup-members-badge">
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
                ${memberCount} Members
              </span>
              <span class="subgroup-amount-badge" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 5px;">
                Outstanding: ₹${subgroupOutstanding.toLocaleString('en-IN')}
              </span>
              <div class="subgroup-actions">
                <button class="btn btn-secondary btn-icon-only" title="Rename Subgroup" onclick="app.renameSubgroupAction('${sub.id}', event)">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>
                <button class="btn btn-danger btn-icon-only" title="Delete Subgroup" onclick="app.deleteSubgroupAction('${sub.id}', event)">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    this.dom.subgroupsContainer.innerHTML = html;
  }

  // Opens rename dialog directly for subgroup
  renameSubgroupAction(subId, e) {
    if (e) e.stopPropagation();
    const subgroup = this.getActiveSubgroup();
    const group = this.getActiveGroup();
    if (!group || !this.state.currentCategory) return;
    
    const sub = group.categories[this.state.currentCategory].find(s => s.id === subId);
    if (!sub) return;

    const newName = prompt("Rename Subgroup:", sub.name);
    if (newName && newName.trim()) {
      sub.name = newName.trim();
      this.saveToStorage();
      this.renderSubgroupsList();
    }
  }

  // Enters Subgroup pushing views depth to Member Portal Level 4
  enterSubgroup(subId) {
    this.state.currentSubgroupId = subId;
    this.state.currentMemberId = null; // resets selected member first
    this.state.searchQuery = "";
    this.dom.inputMemberSearch.value = "";
    this.render();
  }

  // ==========================================================================
  // LEVEL 4 RENDERING ENGINE: MEMBER PORTAL 3-COLUMNS
  // ==========================================================================
  
  // 1. Render Left Column members list
  renderPortalMembersList() {
    const subgroup = this.getActiveSubgroup();
    if (!subgroup) return;

    this.dom.portalTitleText.innerText = `${this.getActiveGroup().name} > ${this.state.currentCategory} > ${subgroup.name}`;

    const container = this.dom.membersListContainer;
    let html = "";

    // Apply filtering query
    const filteredMembers = (subgroup.members || []).filter(m => {
      const q = this.state.searchQuery;
      return m.name.toLowerCase().includes(q) || m.memberId.toLowerCase().includes(q);
    });

    if (filteredMembers.length === 0) {
      html = `
        <div class="empty-state" style="padding: 20px 10px;">
          <div class="empty-state-icon">👥</div>
          <p style="font-size:12px;">No members found.</p>
        </div>
      `;
    } else {
      filteredMembers.forEach(m => {
        const isSelected = m.id === this.state.currentMemberId ? "selected" : "";
        const thumb = m.photo ? m.photo : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2394a3b8'><circle cx='50' cy='50' r='45'/></svg>`;
        
        html += `
          <div class="member-list-item ${isSelected}" onclick="app.selectMember('${m.id}')">
            <img class="member-item-thumb" src="${thumb}" alt="${m.name} Thumb">
            <div class="member-item-details">
              <span class="member-item-name">${m.name}</span>
              <span class="member-item-meta">${m.memberId} | Principal: ₹${(m.amount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = html;
  }

  // Swaps selected member profile
  selectMember(mId) {
    this.state.currentMemberId = mId;
    
    // Highlight list visually
    const items = this.dom.membersListContainer.querySelectorAll(".member-list-item");
    items.forEach(el => el.classList.remove("selected"));
    
    // Re-render middle details & right table columns
    this.renderActiveMemberDetails();
  }

  // 2. Render Middle Column details profile card
  renderActiveMemberDetails() {
    const container = this.dom.memberProfileColumn;
    const member = this.getActiveMember();

    if (!member) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">👤</div>
          <h3>No Member Selected</h3>
          <p>Select a member from the left panel, or click the gold plus button to create a new client card.</p>
          <button class="btn btn-primary" onclick="app.openMemberModal(null)">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            Add New Member
          </button>
        </div>
      `;
      // Clear right table column as well
      this.dom.memberTableColumn.innerHTML = "";
      return;
    }

    const avatar = member.photo ? member.photo : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%2394a3b8'><circle cx='50' cy='50' r='45'/><path d='M10 90 Q50 40 90 90 Z' fill='%23475569'/></svg>`;

    const isWL = this.state.currentCategory === "WL";

    // Format numbers
    const formatINR = (val) => "₹" + (val || 0).toLocaleString('en-IN');
    
    // Format document upload tags
    const renderDocCard = (label, hasDoc, typeKey) => {
      const dataUrl = member[typeKey];
      const statusText = hasDoc ? "Document Uploaded ✓" : "No Document Uploaded";
      
      let actionsHtml = "";
      if (hasDoc) {
        actionsHtml = `
          <div class="doc-actions">
            <button class="btn btn-secondary btn-icon-only" style="width:26px; height:26px;" title="View Document" onclick="app.viewDocumentModal('${dataUrl}', '${label}')">👁️</button>
            <button class="btn btn-secondary btn-icon-only" style="width:26px; height:26px;" title="Download" onclick="app.downloadDocument('${dataUrl}', '${label.toLowerCase().replace(/\s+/g,'_')}.jpg')">⬇️</button>
            <button class="btn btn-danger btn-icon-only" style="width:26px; height:26px; font-size:10px;" title="Delete Document" onclick="app.deleteDocumentAction('${typeKey}')">&times;</button>
          </div>
        `;
      }
      
      return `
        <div class="document-item">
          <div class="doc-info">
            <span class="doc-icon">${typeKey === 'aadharPhoto' ? '📄' : '🏦'}</span>
            <div class="doc-details">
              <span class="doc-name">${label}</span>
              <span class="doc-status" style="color: ${hasDoc ? '#10b981' : '#6b7280'};">${statusText}</span>
            </div>
          </div>
          ${actionsHtml}
        </div>
      `;
    };

    let phoneHtml = member.phone1;
    if (member.phone2) phoneHtml += ` / ${member.phone2}`;

    container.innerHTML = `
      <!-- Header with Avatar and Admin controls -->
      <div class="profile-card-header">
        <div class="profile-avatar-wrapper">
          <img class="profile-avatar" src="${avatar}" alt="${member.name}">
        </div>
        <div class="profile-title-area">
          <div class="profile-name">${member.name}</div>
          <div class="profile-id-badge">ID: ${member.memberId}</div>
        </div>
        
        <div class="profile-actions">
          <button class="btn btn-secondary btn-icon-only" title="Edit Member Profile" onclick="app.openMemberModal(app.getActiveMember())">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="btn btn-danger btn-icon-only" title="Delete Member Record" onclick="app.deleteMemberAction('${member.id}')">
            <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Financial and contact metadata -->
      <div class="profile-meta-grid">
        <div class="meta-item">
          <span class="meta-label">Gender</span>
          <span class="meta-value">${member.gender || 'Male'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Primary Mobile</span>
          <span class="meta-value">${phoneHtml}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Principal Amount</span>
          <span class="meta-value amount">${formatINR(member.amount)}</span>
        </div>
        
        <div class="meta-item">
          <span class="meta-label">Interest Amount (Flat)</span>
          <span class="meta-value amount">${formatINR(member.interest)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Installments Plan</span>
          <span class="meta-value">${member.installments || (isWL ? 10 : 16)} ${isWL ? 'Weeks' : 'Months'}</span>
        </div>

        <div class="meta-item">
          <span class="meta-label">Aadhar Number</span>
          <span class="meta-value">${member.aadharNo || 'N/A'}</span>
        </div>
        
        <div class="meta-item">
          <span class="meta-label">EMI Premium</span>
          <span class="meta-value amount">${formatINR(member.emi)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Loan Issue Date</span>
          <span class="meta-value">${member.issueDate || 'N/A'}</span>
        </div>

        ${isWL ? '' : `
        <div class="meta-item">
          <span class="meta-label">First EMI Month</span>
          <span class="meta-value">${this.formatMonthString(member.firstEmiMonth)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Last EMI Month</span>
          <span class="meta-value">${this.formatMonthString(member.lastEmiMonth)}</span>
        </div>
        `}

        <div class="meta-item meta-value-full">
          <span class="meta-label">Resident Address</span>
          <span class="meta-value" style="font-weight: 500; font-size: 12px; line-height:1.4;">${member.address || 'Address details empty.'}</span>
        </div>
      </div>

      <!-- Document Hub with files View and delete controls -->
      <div class="documents-panel">
        <h4 class="documents-title">Verification Documents Hub</h4>
        ${renderDocCard("Aadhar Card Identification", member.aadharPhoto !== null && member.aadharPhoto !== undefined, "aadharPhoto")}
        ${renderDocCard("Cheque Leaf Document", member.chequePhoto !== null && member.chequePhoto !== undefined, "chequePhoto")}
      </div>
    `;

    // Triggers rendering for column 3 tables immediately
    this.renderActiveMemberTable();
  }

  // Format HTML date picker month strings beautifully, e.g. "2026-07" -> "Jul 2026"
  formatMonthString(monthStr) {
    if (!monthStr) return "N/A";
    const parts = monthStr.split("-");
    if (parts.length !== 2) return monthStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1]) - 1;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[monthIdx]} ${year}`;
  }

  // Increment month/year string dynamically for table schedules, e.g., "2026-07" + 2 months -> "Sep 2026"
  calculateIncrementedMonth(baseMonthStr, incrementCount) {
    if (!baseMonthStr) return "N/A";
    const parts = baseMonthStr.split("-");
    if (parts.length !== 2) return baseMonthStr;
    
    let year = parseInt(parts[0]);
    let monthIdx = parseInt(parts[1]) - 1; // 0-indexed month
    
    monthIdx += incrementCount;
    
    // adjust year leaps
    if (monthIdx >= 12) {
      year += Math.floor(monthIdx / 12);
      monthIdx = monthIdx % 12;
    }
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[monthIdx]} ${year}`;
  }

  // 3. Render Right Column: Declining balance table with checkboxes
  renderActiveMemberTable() {
    const container = this.dom.memberTableColumn;
    const member = this.getActiveMember();

    if (!member) {
      container.innerHTML = "";
      return;
    }

    // Save scroll position of table-wrapper before re-rendering
    const tableWrapper = container.querySelector(".table-wrapper");
    const savedScrollTop = tableWrapper ? tableWrapper.scrollTop : 0;

    const isWL = this.state.currentCategory === "WL";
    const totalRows = isWL ? 10 : (member.installments || 16);
    const emi = member.emi || 4000;
    
    // Retrieve principal amount. If missing, fallback to 64000
    const principalAmount = member.amount || 64000;
    const interestAmount = member.interest || 0;
    const startingReferenceAmount = principalAmount + interestAmount;

    // Build array list ticks
    if (!member.ticks || member.ticks.length !== totalRows) {
      const old = member.ticks || [];
      member.ticks = Array(totalRows).fill(false);
      for (let i = 0; i < Math.min(old.length, totalRows); i++) {
        member.ticks[i] = old[i];
      }
    }

    // Count ticks
    const paidCount = member.ticks.filter(t => t).length;
    const paidPercent = Math.round((paidCount / totalRows) * 100) || 0;
    
    // Math formulas: 4th column is 'Balance Amount' which has initialization at Loan Amount minus EMI of that row
    // and subsequent row subtracts further EMIs.
    // Summing columns totals:
    let emiColSum = 0;
    let tableRowsHtml = "";
    let currentBalance = startingReferenceAmount;

    for (let i = 0; i < totalRows; i++) {
      const sno = i + 1;
      
      // Calculate row date (or week index for WL segment)
      const rowDate = isWL ? `W${sno}` : this.calculateIncrementedMonth(member.firstEmiMonth, i);
      
      // Declining mathematical schedule: currentRow Balance = priorRow Balance - rowEMI
      currentBalance = currentBalance - emi;
      
      // Safeguard against negatives
      const displayBalance = Math.max(0, currentBalance);
      
      // Sum totals
      emiColSum += emi;
      
      const isTicked = member.ticks[i];
      const rowClass = isTicked ? "paid-row" : "";
      const tickClass = isTicked ? "ticked" : "";
      
      tableRowsHtml += `
        <tr class="${rowClass}">
          <td class="col-sno">${sno}</td>
          <td class="col-date">${rowDate}</td>
          <td class="col-emi">₹${emi.toLocaleString('en-IN')}</td>
          <td class="col-balance">₹${displayBalance.toLocaleString('en-IN')}</td>
          <td class="col-action">
            <button class="tick-btn ${tickClass}" onclick="app.toggleInstallmentTick(${i})" title="${isTicked ? 'Mark Unpaid' : 'Mark Paid'}">
              ✓
            </button>
          </td>
        </tr>
      `;
    }

    // Calculation total sum for final row
    const totalAmountPaid = paidCount * emi;
    const remainingBalance = Math.max(0, startingReferenceAmount - totalAmountPaid);

    container.innerHTML = `
      <!-- Table Top Analytics -->
      <div class="ledger-header">
        <div class="progress-circular-wrapper">
          <div class="circular-progress" id="progress-conic" style="background: conic-gradient(#10b981 ${paidPercent * 3.6}deg, #232e48 0deg)">
            <span class="progress-text">${paidPercent}%</span>
          </div>
          <div class="progress-info">
            <span class="progress-info-title">Installments Track</span>
            <span class="progress-info-subtitle" style="color:var(--accent-emerald); font-weight:600;">
              ${paidCount} of ${totalRows} EMIs Cleared
            </span>
          </div>
        </div>
        
        <div style="text-align: right;">
          <div style="font-size:10px; color:var(--text-secondary); text-transform:uppercase;">Outstanding</div>
          <div style="font-size: 15px; font-weight: 700; color:var(--accent-gold);">
            ₹${remainingBalance.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <!-- EMI DECLINING SCHEDULE TABLE -->
      <div class="table-wrapper">
        <table class="emi-table">
          <thead>
            <tr>
              <th class="col-sno">S.No</th>
              <th class="col-date">EMI Date</th>
              <th class="col-emi">EMI Amount</th>
              <th class="col-balance">Balance</th>
              <th class="col-action">Paid</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
            
            <!-- Summary Total Final Row -->
            <tr class="summary-row">
              <td colspan="2">TOTAL SCHED.</td>
              <td class="col-emi">₹${emiColSum.toLocaleString('en-IN')}</td>
              <td class="col-balance" style="color:var(--accent-gold)">₹${remainingBalance.toLocaleString('en-IN')}</td>
              <td style="font-size:10px; text-align:center; color:var(--text-secondary);">
                ₹${totalAmountPaid.toLocaleString('en-IN')} Paid
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Restore scroll position
    const newTableWrapper = container.querySelector(".table-wrapper");
    if (newTableWrapper) {
      newTableWrapper.scrollTop = savedScrollTop;
    }
  }

  // Dynamic CSV/JSON backup exporter
  exportData() {
    try {
      const dataStr = JSON.stringify(this.state.groups, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `vel_murugan_finance_backup_${new Date().toISOString().substring(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Error exporting database backup JSON.");
      console.error(e);
    }
  }

  // Dynamic JSON backup importer
  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) {
          // simple schema validation
          this.state.groups = parsed;
          this.saveToStorage();
          this.clearAllGroupsFromFirestore().then(() => {
            this.uploadAllGroupsToFirestore();
          });
          this.navigateToHome();
          alert("Database Backup Imported Successfully! UI updated.");
        } else {
          alert("Invalid backup file. The uploaded JSON must contain a standard primary groups array.");
        }
      } catch (err) {
        alert("Failed to parse JSON backup file. Please ensure it is a valid backup file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }
}

// Instantiate application safely, executing immediately if DOM is already fully loaded
try {
  if (document.readyState === "complete" || document.readyState === "interactive") {
    window.app = new FinanceApp();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      try {
        window.app = new FinanceApp();
      } catch (e) {
        console.error("Critical app instantiation error:", e);
        const loader = document.getElementById("auth-loading-overlay");
        if (loader) loader.style.display = "none";
        const loginOverlay = document.getElementById("login-overlay");
        if (loginOverlay) loginOverlay.classList.add("active");
      }
    });
  }
} catch (e) {
  console.error("Critical app startup error:", e);
  const loader = document.getElementById("auth-loading-overlay");
  if (loader) loader.style.display = "none";
  const loginOverlay = document.getElementById("login-overlay");
  if (loginOverlay) loginOverlay.classList.add("active");
}
