// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
apiKey: "AIzaSyCtaOb56D2Vr7tUiAFJ9SFIlQHpee5zJ_A",
  authDomain: "light-contorl-1.firebaseapp.com",
  databaseURL: "https://light-contorl-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "light-contorl-1",
  storageBucket: "light-contorl-1.firebasestorage.app",
  messagingSenderId: "629281372901",
  appId: "1:629281372901:web:b1e2e396ede5a6865b720c",
  measurementId: "G-3RMMV8GY81"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

// HTML 요소
const authBox = document.getElementById("authBox");
const controlBox = document.getElementById("controlBox");
const passwordField = document.getElementById("passwordField");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const switchBtn = document.getElementById("switchBtn");
const statusBadge = document.getElementById("statusBadge");

// 고정 이메일
const EMAIL = "eldotemp01@gmail.com";

// 로그인 함수
// 로그인 함수
function handleLogin() {
  const password = passwordField.value;
  if (!password) return alert("비밀번호를 입력하세요");

  setPersistence(auth, browserSessionPersistence)
    .then(() => signInWithEmailAndPassword(auth, EMAIL, password))
    .then(() => {
      alert("로그인 성공!");
      passwordField.value = ""; // 입력 초기화
      // 화면 전환은 onAuthStateChanged에서 자동 처리
    })
    .catch(err => {
      // 비밀번호 틀리면 alert
      alert("비밀번호가 틀렸습니다");
      console.error(err);
    });
}

// 로그인 상태 감지
onAuthStateChanged(auth, (user) => {
  if (user) {
    // 로그인 성공 시 UI 전환
    authBox.setAttribute("data-hidden", "");
    controlBox.removeAttribute("data-hidden");
    statusBadge.className = "status-badge online";
    statusBadge.textContent = "Online";

    // DB 값 읽어서 버튼 초기화
    onValue(ref(db, "/switch"), snapshot => {
      const val = snapshot.val();
      if (val === 1) {
        switchBtn.classList.add("on");
        switchBtn.textContent = "ON";
      } else {
        switchBtn.classList.remove("on");
        switchBtn.textContent = "OFF";
      }
    });

  } else {
    // 로그아웃 시 UI 초기화
    authBox.removeAttribute("data-hidden");
    controlBox.setAttribute("data-hidden", "");
    statusBadge.className = "status-badge offline";
    statusBadge.textContent = "Offline";
    switchBtn.classList.remove("on");
    switchBtn.textContent = "OFF";
  }
});


// 로그아웃 함수
function handleLogout() {
  signOut(auth)
    .then(() => {
      // 로그아웃 완료 후 UI 초기화
      authBox.removeAttribute("data-hidden");
      controlBox.setAttribute("data-hidden", "");
      statusBadge.className = "status-badge offline";
      statusBadge.textContent = "Offline";
      switchBtn.classList.remove("on");
      switchBtn.textContent = "OFF";
      passwordField.value = "";
    })
    .catch(err => alert("로그아웃 실패: " + err.message));
}

switchBtn.addEventListener("click", () => {
  console.log("switchBtn 클릭됨, currentUser:", auth.currentUser);
  if (!auth.currentUser) return alert("로그인 후 사용 가능합니다");

  const newState = switchBtn.classList.contains("on") ? 0 : 1;

  // UI 즉시 변경
  switchBtn.classList.toggle("on");
  switchBtn.textContent = newState ? "ON" : "OFF";

  // DB 쓰기
  set(ref(db, "/switch"), newState)
    .then(() => console.log("DB 값 변경됨:", newState))
    .catch(err => console.error(err));
});


loginBtn.addEventListener("click", handleLogin);
logoutBtn.addEventListener("click", handleLogout);


//

