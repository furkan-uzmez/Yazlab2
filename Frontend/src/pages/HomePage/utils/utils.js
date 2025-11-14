// Yardımcı fonksiyonlar

export const formatTimeAgo = (date) => {
  const now = new Date();
  const activityDate = new Date(date);
  const diffInSeconds = Math.floor((now - activityDate) / 1000);

  if (diffInSeconds < 60) return 'Az önce';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  return `${Math.floor(diffInSeconds / 604800)} hafta önce`;
};

export const truncateText = (text, maxLength = 200) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

