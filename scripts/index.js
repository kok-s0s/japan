import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js';

// Firebase 配置
const firebaseConfig = {
  apiKey: 'AIzaSyAH7f0zyP1nyYZ7M6U_0Ars5LewmHQB97o',
  authDomain: 'pass-japan-n1.firebaseapp.com',
  projectId: 'pass-japan-n1',
  storageBucket: 'pass-japan-n1.firebasestorage.app',
  messagingSenderId: '591958034120',
  appId: '1:591958034120:web:9d452492fc1de7f94ac7fd',
  measurementId: 'G-Z9VXGETXFS',
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let japaneseWordsData = [];
let currentIndex = 0;

// 获取 HTML 元素
const inputField = document.getElementById('input');
const checkButton = document.getElementById('checkButton');
const romajiText = document.getElementById('romaji');

// 加载 CSV 数据
const loadCSVData = async () => {
  try {
    const response = await fetch('/database/words/vocab.csv');
    const csvText = await response.text();
    japaneseWordsData = parseCSV(csvText);
    console.log('单词数据：', japaneseWordsData);

    // 如果用户已登录，恢复进度
    if (auth.currentUser) {
      loadUserProgress(auth.currentUser.uid);
    } else {
      displayWord(0);
    }
  } catch (error) {
    console.error('加载 CSV 失败:', error);
  }
};

// 解析 CSV
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  return lines.slice(1).map((line) => {
    const [kana, japanese, chinese, romaji] = line.split(',');
    return { kana, japanese, chinese, romaji };
  });
};

// 获取发音按钮
const speakButton = document.getElementById('speakButton');

// 点击发音按钮时发音当前单词
speakButton.addEventListener('click', () => {
  const word = japaneseWordsData[currentIndex];
  speakWord(word.japanese); // 发音日语单词
});

// 按下空格键时发音当前单词
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // 防止页面滚动
    const word = japaneseWordsData[currentIndex];
    speakWord(word.japanese);
  }
});

// 发音功能函数
const speakWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'ja-JP'; // 设置为日语
  utterance.rate = 0.5; // 语速
  utterance.pitch = 0.8; // 音调

  // 调用浏览器的语音合成功能
  window.speechSynthesis.speak(utterance);
};

// 显示单词时，确保发音按钮可见
const displayWord = (index) => {
  if (index < 0 || index >= japaneseWordsData.length) return;

  const word = japaneseWordsData[index];
  document.getElementById('kana').textContent = `假名: ${word.kana}`;
  document.getElementById('japanese').textContent = `日语: ${word.japanese}`;
  document.getElementById('chinese').textContent = `中文: ${word.chinese}`;
  romajiText.textContent = `罗马字: ${word.romaji}`;
  romajiText.style.display = 'block'; // 每次切换单词时确保罗马字可见

  inputField.value = '';

  speakButton.style.display = 'inline-block'; // 确保按钮显示

  if (auth.currentUser) {
    saveUserProgress(auth.currentUser.uid, index);
  }
};

// 输入框聚焦时隐藏罗马字
inputField.addEventListener('focus', () => {
  romajiText.style.display = 'none';
});

// 用户输入时也隐藏罗马字
inputField.addEventListener('input', () => {
  romajiText.style.display = 'none';
});

// 输入框失焦时显示罗马字
inputField.addEventListener('blur', () => {
  romajiText.style.display = 'block';
});

// 监听输入框按键事件
inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // 防止回车触发默认行为（如表单提交）
    checkButton.click(); // 触发检查按钮点击
  }
});

// **点击检查按钮**
checkButton.addEventListener('click', async () => {
  const word = japaneseWordsData[currentIndex];
  const userInput = inputField.value.trim();
  const userId = auth.currentUser ? auth.currentUser.uid : 'guest';

  let isCorrect = userInput === word.japanese || userInput === word.kana;

  // **显示弹窗**
  Swal.fire({
    title: isCorrect ? '正确！🎉' : '错误！❌',
    text: isCorrect
      ? '回答正确，继续下一个单词！'
      : `正确答案是：${word.japanese} (${word.kana})`,
    icon: isCorrect ? 'success' : 'error',
    confirmButtonText: '确定',
  }).then(() => {
    if (isCorrect) {
      // **用户点击“确定”后跳转到下一个单词**
      currentIndex = (currentIndex + 1) % japaneseWordsData.length;
      displayWord(currentIndex);
      // **清空输入框**
      inputField.value = '';
    }
  });

  // **更新 Firestore 词语统计**
  await updateWordStats(userId, word.japanese, isCorrect);
});

// **更新 Firestore 统计数据**
const updateWordStats = async (userId, word, isCorrect) => {
  try {
    const wordRef = doc(db, 'word_stats', userId);
    const docSnap = await getDoc(wordRef);

    if (docSnap.exists()) {
      // 词语已存在，更新统计
      let data = docSnap.data();
      if (!data[word]) {
        data[word] = { right: 0, wrong: 0 };
      }
      if (isCorrect) {
        data[word].right += 1;
      } else {
        data[word].wrong += 1;
      }
      await setDoc(wordRef, data, { merge: true });
    } else {
      // 新建用户统计数据
      await setDoc(wordRef, {
        [word]: { right: isCorrect ? 1 : 0, wrong: isCorrect ? 0 : 1 },
      });
    }

    console.log(`单词 "${word}" 统计已更新`);
  } catch (error) {
    console.error('更新单词统计失败:', error);
  }
};

// 切换单词
document.getElementById('prevButton').addEventListener('click', () => {
  currentIndex =
    (currentIndex - 1 + japaneseWordsData.length) % japaneseWordsData.length;
  displayWord(currentIndex);
});

document.getElementById('nextButton').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % japaneseWordsData.length;
  displayWord(currentIndex);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    // 按下左方向键，切换到上一个单词
    document.getElementById('prevButton').click();
  } else if (event.key === 'ArrowRight') {
    // 按下右方向键，切换到下一个单词
    document.getElementById('nextButton').click();
  }
});

// 登录注册逻辑
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const logoutButton = document.getElementById('logoutButton');
const userStatus = document.getElementById('userStatus');

// 注册
registerButton.addEventListener('click', async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    alert('注册成功！');
  } catch (error) {
    alert(error.message);
  }
});

// 登录
loginButton.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );
    alert('登录成功！');
  } catch (error) {
    alert(error.message);
  }
});

// 登出
logoutButton.addEventListener('click', async () => {
  await signOut(auth);
  alert('已登出！');
});

// 监听用户登录状态
onAuthStateChanged(auth, async (user) => {
  const userStatus = document.getElementById('userStatus');
  const authContainer = document.querySelector('.auth-container');

  if (user) {
    // 设置为可点击的邮箱链接
    userStatus.innerHTML = `<a href="/user-settings" id="userEmailLink">${user.email}</a>`;
    const userEmailLink = document.getElementById('userEmailLink');
    userEmailLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/special.html';
    });

    // 显示登出按钮，隐藏登录相关输入
    logoutButton.style.display = 'block';
    emailInput.style.display = 'none';
    passwordInput.style.display = 'none';
    loginButton.style.display = 'none';
    registerButton.style.display = 'none';
    loadUserProgress(user.uid);

    // 用户登录后，移除 flex-direction: column;
    authContainer.style.flexDirection = 'row';
  } else {
    userStatus.textContent = '未登录';
    logoutButton.style.display = 'none';
    emailInput.style.display = 'inline-block';
    passwordInput.style.display = 'inline-block';
    loginButton.style.display = 'inline-block';
    registerButton.style.display = 'inline-block';
  }
});

// 存储用户进度
const saveUserProgress = async (userId, index) => {
  await setDoc(
    doc(db, 'users', userId),
    { lastWordIndex: index },
    { merge: true }
  );
};

// 读取用户进度
const loadUserProgress = async (userId) => {
  const docSnap = await getDoc(doc(db, 'users', userId));
  if (docSnap.exists()) {
    currentIndex = docSnap.data().lastWordIndex || 0;
    displayWord(currentIndex);
  }
};

// 查看数据库按钮
document.getElementById('viewDatabaseBtn').addEventListener('click', () => {
  window.location.href = 'database.html';
});

// 加载 CSV 数据
loadCSVData();
