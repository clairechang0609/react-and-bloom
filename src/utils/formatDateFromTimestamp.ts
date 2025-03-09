// 轉換時間戳記
export const formatDateFromTimestamp = (timestamp: number) => {
  const convertedDate = new Date(timestamp * 1000); // 轉換為毫秒

  // 轉換為台灣時區 (UTC+8)
  const taiwanDate = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  }).format(convertedDate);

  // 轉換為 yyyy-mm-dd 格式
  return taiwanDate.replace(/\//g, '-');
}
