const wordsPerPage = 8; // 每页显示 8 个单词
let japaneseWordsData = []; // 存储单词数据
let currentPage = 1;
let filteredData = []; // 过滤后的数据

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
      jp_meaning: columns[7], // 日语释义
    };
  });
};

// 加载 CSV 数据
const loadCSVData = async () => {
  try {
    const response = await fetch('/database/words/scene.csv');
    const csvText = await response.text();
    japaneseWordsData = parseCSV(csvText);
    filteredData = japaneseWordsData; // 初始时不过滤
    displayWords();
  } catch (error) {
    console.error('加载 CSV 失败:', error);
  }
};

// 显示单词
const displayWords = () => {
  const tableBody = document.getElementById('wordsTable');
  tableBody.innerHTML = ''; // 清空表格

  const startIndex = (currentPage - 1) * wordsPerPage;
  const pageData = filteredData.slice(startIndex, startIndex + wordsPerPage);

  pageData.forEach((word, index) => {
    const rowNumber = startIndex + index + 1; // 计算全局序号
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${rowNumber}</td>
      <td>${word.scene}</td>
      <td>${word.romaji}</td>
      <td>${word.kana}</td>
      <td>${word.chinese}</td>
      <td>${word.english}</td>
      <td>${word.example}</td>
      <td>${word.cn_meaning}</td>
      <td>${word.jp_meaning}</td>
    `;
    tableBody.appendChild(row);
  });

  updatePaginationInfo();
};

// 更新翻页信息
const updatePaginationInfo = () => {
  const pageInfo = document.getElementById('pageInfo');
  const totalPages = Math.ceil(filteredData.length / wordsPerPage);
  pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;

  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
};

// 处理翻页按钮点击
document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    displayWords();
  }
});

document.getElementById('nextPage').addEventListener('click', () => {
  const totalPages = Math.ceil(filteredData.length / wordsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayWords();
  }
});

// 处理搜索
document.getElementById('searchBox').addEventListener('input', (event) => {
  const keyword = event.target.value.trim().toLowerCase();
  filteredData = japaneseWordsData.filter(
    (word) =>
      word.japanese.includes(keyword) ||
      word.kana.includes(keyword) ||
      word.chinese.includes(keyword) ||
      word.romaji.includes(keyword)
  );
  currentPage = 1;
  displayWords();
});

// 返回主页按钮
document.getElementById('backHomePageBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// 加载 CSV
loadCSVData();
