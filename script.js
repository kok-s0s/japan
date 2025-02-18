import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAH7f0zyP1nyYZ7M6U_0Ars5LewmHQB97o",
  authDomain: "pass-japan-n1.firebaseapp.com",
  projectId: "pass-japan-n1",
  storageBucket: "pass-japan-n1.firebasestorage.app",
  messagingSenderId: "591958034120",
  appId: "1:591958034120:web:9d452492fc1de7f94ac7fd",
  measurementId: "G-Z9VXGETXFS",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let japaneseWordsData = [];
let currentIndex = 0;

// 加载 CSV 数据
const loadCSVData = async () => {
  try {
    const response = await fetch("/tasks/words/vocab.csv");
    const csvText = await response.text();
    japaneseWordsData = parseCSV(csvText);
    console.log("单词数据：", japaneseWordsData);

    // 如果用户已登录，恢复进度
    if (auth.currentUser) {
      loadUserProgress(auth.currentUser.uid);
    } else {
      displayWord(0);
    }
  } catch (error) {
    console.error("加载 CSV 失败:", error);
  }
};

// 解析 CSV
const parseCSV = (csvText) => {
  const lines = csvText.trim().split("\n");
  return lines.slice(1).map((line) => {
    const [kana, japanese, chinese, romaji] = line.split(",");
    return { kana, japanese, chinese, romaji };
  });
};

// 显示单词
const displayWord = (index) => {
  if (index < 0 || index >= japaneseWordsData.length) return;

  const word = japaneseWordsData[index];
  document.getElementById("kana").textContent = `假名: ${word.kana}`;
  document.getElementById("japanese").textContent = `日语: ${word.japanese}`;
  document.getElementById("chinese").textContent = `中文: ${word.chinese}`;
  document.getElementById("romaji").textContent = `罗马字: ${word.romaji}`;

  // 如果用户已登录，保存进度
  if (auth.currentUser) {
    saveUserProgress(auth.currentUser.uid, index);
  }
};

// 切换单词
document.getElementById("prevButton").addEventListener("click", () => {
  currentIndex =
    (currentIndex - 1 + japaneseWordsData.length) % japaneseWordsData.length;
  displayWord(currentIndex);
});

document.getElementById("nextButton").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % japaneseWordsData.length;
  displayWord(currentIndex);
});

// 登录注册逻辑
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");
const logoutButton = document.getElementById("logoutButton");
const userStatus = document.getElementById("userStatus");

// 注册
registerButton.addEventListener("click", async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    alert("注册成功！");
  } catch (error) {
    alert(error.message);
  }
});

// 登录
loginButton.addEventListener("click", async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    alert("登录成功！");
  } catch (error) {
    alert(error.message);
  }
});

// 登出
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  alert("已登出！");
});

// 监听用户登录状态
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userStatus.textContent = `已登录: ${user.email}`;
    logoutButton.style.display = "block";
    loadUserProgress(user.uid);
  } else {
    userStatus.textContent = "未登录";
    logoutButton.style.display = "none";
  }
});

// 存储用户进度
const saveUserProgress = async (userId, index) => {
  await setDoc(
    doc(db, "users", userId),
    { lastWordIndex: index },
    { merge: true }
  );
};

// 读取用户进度
const loadUserProgress = async (userId) => {
  const docSnap = await getDoc(doc(db, "users", userId));
  if (docSnap.exists()) {
    currentIndex = docSnap.data().lastWordIndex || 0;
    displayWord(currentIndex);
  }
};

// 加载 CSV 数据
loadCSVData();
