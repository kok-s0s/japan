const wordsPerPage = 10; // 每页显示 10 个单词
let japaneseWordsData = []; // 存储单词数据
let currentPage = 1;
let filteredData = []; // 过滤后的数据

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

    filteredData = japaneseWordsData; // 初始时不过滤

    displayWords();
  } catch (error) {
    console.error('加载多个 CSV 失败:', error);
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
      <td>${word.romaji}</td>
      <td>${word.kana}</td>
      <td>${word.kanji}</td>
      <td>${word.chinese}</td>
      <td>${word.english}</td>
    `;
    tableBody.appendChild(row);
  });

  updatePaginationInfo();
};

// 根据假名查找单词
const findWordByKana = (kana) => {
  return japaneseWordsData.find((word) => word.kana === kana);
};

const table = document.getElementById('table');
const tooltip = document.getElementById('tooltip');
let timer;

table.addEventListener('mouseover', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  timer = setTimeout(() => {
    const tds = row.querySelectorAll('td');
    const kana = tds[2].textContent;
    console.log(kana);
    const detail = findWordByKana(kana);

    tooltip.innerHTML = `
      <div style="padding: 8px; max-width: 300px;">
        <div><strong>场景：</strong><br>${detail.scene}</div>
        <div style="margin-top: 6px;"><strong>例句：</strong><br>${detail.example}</div>
        <div style="margin-top: 6px;"><strong>中文释义：</strong><br>${detail.cn_meaning}</div>
        <div style="margin-top: 6px;"><strong>日文释义：</strong><br>${detail.jp_meaning}</div>
      </div>
    `;
    tooltip.style.display = 'block';
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY + 10 + 'px';
  }, 800); // 800ms 延迟
});

table.addEventListener('mousemove', (e) => {
  tooltip.style.left = e.pageX + 10 + 'px';
  tooltip.style.top = e.pageY + 10 + 'px';
});

table.addEventListener('mouseout', () => {
  clearTimeout(timer);
  tooltip.style.display = 'none';
});

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
      word.scene.toLowerCase().includes(keyword) ||
      word.romaji.toLowerCase().includes(keyword) ||
      word.kana.includes(keyword) ||
      word.chinese.includes(keyword) ||
      word.english.toLowerCase().includes(keyword) ||
      word.example.toLowerCase().includes(keyword) ||
      word.cn_meaning.includes(keyword) ||
      word.jp_meaning.includes(keyword)
  );
  currentPage = 1;
  displayWords();
});

const jumpPageInputField = document.getElementById('jumpPageInput');
const jumpPageButton = document.getElementById('jumpPageBtn');

// 监听页码输入框按键事件
jumpPageInputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // 防止回车触发默认行为（如表单提交）
    jumpPageButton.click(); // 触发检查按钮点击
  }
});

document.getElementById('jumpPageBtn').addEventListener('click', () => {
  const input = document.getElementById('jumpPageInput');
  const page = parseInt(input.value, 10);
  const totalPages = Math.ceil(filteredData.length / wordsPerPage);

  if (!isNaN(page) && page >= 1 && page <= totalPages) {
    currentPage = page;
    displayWords();
    input.value = '';
  } else {
    alert(`请输入 1 到 ${totalPages} 之间的页码`);
  }
});

// 加载 CSV 数据
const csvFiles = ['scene.csv', 'N1_words.csv'];
loadMultipleCSV(csvFiles);
