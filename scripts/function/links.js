document.addEventListener('DOMContentLoaded', () => {
  const linkList = document.getElementById('linkList');
  const iframe = document.getElementById('contentFrame');

  // 从 links.json 读取数据
  fetch('database/page_data/links.json')
    .then((res) => res.json())
    .then((links) => {
      if (!Array.isArray(links) || links.length === 0) return;

      links.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = 'javascript:void(0);';
        a.className = 'link-item';
        a.dataset.url = link.url;
        a.innerText = link.name;

        // 默认第一个链接为 active 并加载
        if (index === 0) {
          a.classList.add('active');
          iframe.src = link.url;
        }

        a.addEventListener('click', () => {
          // 清除其他active
          document
            .querySelectorAll('.link-item')
            .forEach((item) => item.classList.remove('active'));
          a.classList.add('active');
          iframe.src = link.url;
        });

        linkList.appendChild(a);
      });
    })
    .catch((err) => console.error('加载链接数据失败：', err));
});
