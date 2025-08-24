export function generateTime(): { timestamp: string[]; current: number[] } {
  const now = new Date();
  return {
    timestamp: [
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Jakarta',
      }),
      now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      }),
    ],
    current: [now.getFullYear(), now.getMonth() + 1, now.getDate()],
  };
}

export function generateTimestamp(at: string | Date): string[] {
  const date = new Date(at);
  const formatDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
  });

  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return [`${time}`, `${formatDate}`];
}