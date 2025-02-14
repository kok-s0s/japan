let japaneseWordsData = [];

let currentIndex = 0; // 当前显示的单词索引

// 读取 CSV 文件并解析
const loadCSVData = async () => {
  try {
    const response = await fetch("/tasks/words/vocab.csv"); // 假设CSV文件在项目的data目录下
    const csvText = await response.text();

    // 解析 CSV 数据
    japaneseWordsData = parseCSV(csvText);
    console.log(japaneseWordsData); // 打印数据，验证加载成功

    // 数据加载完成后，展示第一个单词
    displayWord(currentIndex);
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
};

// 解析 CSV 数据
const parseCSV = (csvText) => {
  const lines = csvText.trim().split("\n"); // 按行分割
  const data = lines.slice(1).map((line) => {
    const [kana, japanese, chinese, romaji] = line.split(",");
    return { kana, japanese, chinese, romaji };
  });
  return data;
};

// 显示当前单词
const displayWord = (index) => {
  if (index < 0 || index >= japaneseWordsData.length) return;

  const word = japaneseWordsData[index];

  // 更新卡片内容
  document.getElementById("kana").textContent = `假名: ${word.kana}`;
  document.getElementById("japanese").textContent = `日语: ${word.japanese}`;
  document.getElementById("chinese").textContent = `中文: ${word.chinese}`;
  document.getElementById("romaji").textContent = `罗马字: ${word.romaji}`;
};

// 监听切换按钮
document.getElementById("prevButton").addEventListener("click", () => {
  // 使用求余计算来实现循环切换
  currentIndex =
    (currentIndex - 1 + japaneseWordsData.length) % japaneseWordsData.length;
  displayWord(currentIndex);
});

document.getElementById("nextButton").addEventListener("click", () => {
  // 使用求余计算来实现循环切换
  currentIndex = (currentIndex + 1) % japaneseWordsData.length;
  displayWord(currentIndex);
});

// 调用加载数据的函数
loadCSVData();
