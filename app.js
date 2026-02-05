import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

/* Firebase */

const firebaseConfig = {
  apiKey: "AIzaSyCtaOb56D2Vr7tUiAFJ9SFIlQHpee5zJ_A",
  authDomain: "light-contorl-1.firebaseapp.com",
  databaseURL: "https://light-contorl-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "light-contorl-1",
  storageBucket: "light-contorl-1.firebasestorage.app",
  messagingSenderId: "629281372901",
  appId: "1:629281372901:web:b1e2e396ede5a6865b720c"
};

initializeApp(firebaseConfig);

const auth = getAuth();
const db = getDatabase();

/* 요소 */

const switchBtn = document.getElementById("main-switch");

/* 화면 */

const PASS = "1980";
const EMAIL = "sldpfy2@gmail.com";
const REAL_PASSWORD = "adminplus";

let code = "";

/* 뷰 전환 */

function switchView(from, to) {
  document.getElementById(from).setAttribute("data-hidden", "");
  document.getElementById(to).removeAttribute("data-hidden");
}

/* 키패드 */

document.querySelectorAll(".keypad-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const v = e.target.textContent;

    if (v === "←") code = code.slice(0, -1);
    else if (code.length < 4 && v) code += v;

    document.querySelectorAll(".passcode-dot").forEach((d, i) => {
      d.classList.toggle("filled", i < code.length);
    });

    if (code.length === 4) handleLogin();
  });
});

/* 로그인 */

function handleLogin() {
  if (code !== PASS) {
    resetDots();
    return;
  }

  setPersistence(auth, browserLocalPersistence)
    .then(() => signInWithEmailAndPassword(auth, EMAIL, REAL_PASSWORD))
    .then(() => {
      switchView("view-auth", "view-main");
      code = "";
      resetDots();
    });
}

function resetDots() {
  code = "";
  setTimeout(() => {
    document.querySelectorAll(".passcode-dot").forEach(d => d.classList.remove("filled"));
  }, 200);
}

/* 로그인 상태 */

onAuthStateChanged(auth, user => {
  if (!user) return;

  onValue(ref(db, "/switch"), snap => {
    const v = snap.val();
    switchBtn.classList.toggle("on", v === 1);
    switchBtn.textContent = v === 1 ? "ON" : "OFF";
  });
});

/* 스위치 */

switchBtn.addEventListener("click", () => {
  if (!auth.currentUser) return;

  const next = switchBtn.classList.contains("on") ? 0 : 1;
  set(ref(db, "/switch"), next);
});

/* 네비 */

document.getElementById("go-theory").onclick = () =>
  switchView("view-main", "view-theory");

document.getElementById("back-to-main").onclick = () =>
  switchView("view-theory", "view-main");
