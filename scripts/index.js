let japaneseWordsData = [];
let currentIndex = 0;

// 获取 HTML 元素
const inputField = document.getElementById('input');
const checkButton = document.getElementById('checkButton');
const romajiContainer = document.getElementById('romaji-container');
const romajiText = document.getElementById('romaji');

// 加载 CSV 数据
const loadMultipleCSV = async (fileList) => {
  try {
    // 并发加载所有 CSV
    const fetchPromises = fileList.map((file) =>
      fetch(`/database/words/${file}`).then((res) => res.text())
    );

    const contents = await Promise.all(fetchPromises);

    // 合并解析后的数据
    japaneseWordsData = contents.flatMap(parseCSV);

    console.log('所有场景的单词数据：', japaneseWordsData);

    loadUserProgress(); // 接着加载用户进度
  } catch (error) {
    console.error('加载多个 CSV 失败:', error);
  }
};

// 解析 CSV
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  return lines.slice(1).map((line) => {
    const columns = line.split(',');
    return {
      romaji: columns[0], // 罗马字
      kana: columns[1], // 假名
      kanji: columns[2], // 汉字
      chinese: columns[3], // 中文
      english: columns[4], // 英文
      example: columns[5], // 例句
      cn_meaning: columns[6], // 中文释义
      jp_meaning: columns[7], // 日语释义
      scene: columns[8], // 场景
    };
  });
};

// 获取发音按钮
const speakButton = document.getElementById('speakButton');

// 点击发音按钮时发音当前单词
speakButton.addEventListener('click', () => {
  const word = japaneseWordsData[currentIndex];
  speakWord(word.kana); // 发音日语单词
});

const speakWord = (word) => {
  window.speechSynthesis.cancel(); // 先清空之前的语音
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'ja-JP'; // 设置为日语
  utterance.rate = 0.4; // 语速
  utterance.pitch = 0.8; // 音调

  // 等待语音合成引擎准备就绪再说
  setTimeout(() => {
    window.speechSynthesis.speak(utterance);
  }, 200); // 延时 200ms，有助于解决吞音问题
};

// 显示单词时，确保发音按钮可见
const displayWord = (index) => {
  if (index < 0 || index >= japaneseWordsData.length) return;

  const word = japaneseWordsData[index];
  document.getElementById('kana').textContent = `假名: ${word.kana}`;
  document.getElementById('kanji').textContent = `${word.kanji}`;
  document.getElementById('chinese').textContent = `中文: ${word.chinese}`;
  document.getElementById('english').textContent = `英文: ${word.english}`;
  romajiText.textContent = `罗马字: ${word.romaji}`;
  romajiText.style.display = 'block'; // 每次切换单词时确保罗马字可见

  inputField.value = '';

  speakButton.style.display = 'flex'; // 确保按钮显示
};

// 输入框聚焦时隐藏罗马字
inputField.addEventListener('focus', () => {
  romajiContainer.style.backgroundColor = '#5e4b8b'; // 输入框背景颜色
  romajiText.style.color = 'transparent'; // 隐藏罗马字
});

// 用户输入时也隐藏罗马字
inputField.addEventListener('input', () => {
  romajiContainer.style.backgroundColor = '#5e4b8b'; // 输入框背景颜色
  romajiText.style.color = 'transparent'; // 隐藏罗马字
});

// 输入框失焦时显示罗马字
inputField.addEventListener('blur', () => {
  romajiContainer.style.backgroundColor = 'transparent'; // 输入框背景颜色
  romajiText.style.color = '#ddd'; // 显示罗马字
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
  let isCorrect = userInput === word.kanji || userInput === word.kana;

  // **显示弹窗**
  Swal.fire({
    title: isCorrect ? '正确！🎉' : '错误！❌',
    text: isCorrect
      ? '回答正确，继续下一个单词！'
      : `正确答案是：${word.kanji} (${word.kana})`,
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
});

// 切换单词
document.getElementById('prevButton').addEventListener('click', () => {
  currentIndex =
    (currentIndex - 1 + japaneseWordsData.length) % japaneseWordsData.length;
  displayWord(currentIndex);
  saveUserProgress(currentIndex);
});

document.getElementById('nextButton').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % japaneseWordsData.length;
  displayWord(currentIndex);
  saveUserProgress(currentIndex);
});

// 存储用户进度
const saveUserProgress = (index) => {
  // 将当前单词索引保存在 localStorage 中
  localStorage.setItem('lastWordIndex', index);
};

// 读取用户进度
const loadUserProgress = () => {
  // 从 localStorage 获取存储的进度（即最后的单词索引）
  const savedIndex = localStorage.getItem('lastWordIndex');
  if (savedIndex !== null) {
    currentIndex = parseInt(savedIndex, 10); // 确保是整数
  } else {
    currentIndex = 0; // 如果没有存储过进度，从第一个单词开始
  }
  displayWord(currentIndex);
};

// 加载 CSV 数据
const csvFiles = ['scene.csv', 'N1_words.csv'];
loadMultipleCSV(csvFiles);

// 手写板逻辑
const canvas = document.getElementById('handwritingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    // 延迟一点再设置，保证 DOM 有尺寸
    requestAnimationFrame(resizeCanvas);
    return;
  }
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
}

window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas(); // 确保DOM渲染后执行
});

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

canvas.addEventListener('pointerdown', (e) => {
  drawing = true;
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  const { x, y } = getPos(e);
  ctx.lineTo(x, y);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2 * (e.pressure || 1);
  ctx.lineCap = 'round';
  ctx.stroke();
});

canvas.addEventListener('pointerup', () => {
  drawing = false;
  ctx.closePath();
});

canvas.addEventListener('pointerleave', () => {
  drawing = false;
  ctx.closePath();
});

document.getElementById('clearCanvas').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Tabs 切换逻辑
const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');
buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach((b) => b.classList.remove('active'));
    contents.forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (event) => {
    // 1. 空格发音
    if (event.code === 'Space') {
      event.preventDefault(); // 阻止页面滚动
      if (window.japaneseWordsData && typeof currentIndex !== 'undefined') {
        const word = japaneseWordsData[currentIndex];
        if (word && word.kana) {
          speakWord(word.kana);
        }
      }
    }

    // 2. Alt + I 聚焦输入框
    if (event.altKey && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      const input = document.getElementById('input');
      if (input) input.focus();
    }

    // 3. Alt + J 跳转词库
    if (event.altKey && event.key.toLowerCase() === 'j') {
      event.preventDefault();
      const link = document.querySelector('a[href="/database.html"]');
      if (link) link.click();
    }

    // 4. ← 上一个单词
    if (event.key === 'ArrowLeft') {
      const prevBtn = document.getElementById('prevButton');
      if (prevBtn) prevBtn.click();
    }

    // 5. → 下一个单词
    if (event.key === 'ArrowRight') {
      const nextBtn = document.getElementById('nextButton');
      if (nextBtn) nextBtn.click();
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initKeyboardShortcuts();
});

const links = document.querySelectorAll('.link-list .link-item');
const iframe = document.getElementById('contentFrame');

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // 去掉所有按钮的激活样式
    links.forEach((l) => l.classList.remove('active'));
    // 当前按钮加上激活样式
    link.classList.add('active');

    // 切换iframe地址
    const url = link.getAttribute('data-url');
    iframe.src = url;
  });
});
