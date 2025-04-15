let japaneseWordsData = [];
let currentIndex = 0;

// 获取 HTML 元素
const inputField = document.getElementById('input');
const checkButton = document.getElementById('checkButton');
const romajiText = document.getElementById('romaji');

// 加载 CSV 数据
const loadCSVData = async () => {
  try {
    const response = await fetch('/database/words/scene.csv');
    const csvText = await response.text();
    japaneseWordsData = parseCSV(csvText);
    console.log('单词数据：', japaneseWordsData);

    displayWord(0);
  } catch (error) {
    console.error('加载 CSV 失败:', error);
  }
};

// 解析 CSV
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  return lines.slice(1).map((line) => {
    const columns = line.split(',');
    return {
      scene: columns[0], // 场景
      romaji: columns[1], // 罗马字
      kana: columns[2], // 假名
      chinese: columns[3], // 中文
      english: columns[4], // 英文
      example: columns[5], // 例句
      cn_meaning: columns[6], // 中文释义
      jp_meaning: columns[7], // 日语释义,
      kanji: columns[8], // 汉字
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

// 按下空格键时发音当前单词
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault(); // 防止页面滚动
    const word = japaneseWordsData[currentIndex];
    speakWord(word.kana);
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
  document.getElementById('kanji').textContent = `${word.kanji}`;
  document.getElementById('chinese').textContent = `中文: ${word.chinese}`;
  romajiText.textContent = `罗马字: ${word.romaji}`;
  romajiText.style.display = 'block'; // 每次切换单词时确保罗马字可见

  inputField.value = '';

  speakButton.style.display = 'inline-block'; // 确保按钮显示
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

// 查看数据库按钮
document.getElementById('viewDatabaseBtn').addEventListener('click', () => {
  window.location.href = 'database.html';
});

// 加载 CSV 数据
loadCSVData();
