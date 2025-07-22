function getNextJLPTDate() {
  const now = new Date();
  const year = now.getFullYear();

  // JLPT 通常在 7 月和 12 月的第一个星期日
  const getFirstSunday = (month) => {
    const date = new Date(year, month, 1);
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  const julyExam = getFirstSunday(6);
  const decemberExam = getFirstSunday(11);

  return now < julyExam ? julyExam : decemberExam;
}

function updateCountdown() {
  const examDate = getNextJLPTDate();
  const now = new Date();
  const timeDiff = examDate - now;

  if (timeDiff <= 0) {
    document.getElementById('countdown').textContent = '考试进行中！';
    return;
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((timeDiff / 1000) % 60);

  document.getElementById(
    'countdown'
  ).textContent = `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;

  setTimeout(updateCountdown, 1000);
}

document.addEventListener('DOMContentLoaded', updateCountdown);
