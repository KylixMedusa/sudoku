/**
 * Formats a given time (in seconds) into a string.
 * - If the time is less than one hour, returns "mm:ss"
 * - Otherwise, returns "hh:mm:ss"
 * @param totalSeconds - The total time in seconds.
 * @returns A formatted time string.
 */
export function formatTime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  // Pad minutes and seconds with leading zero
  const paddedMins = mins.toString().padStart(2, '0');
  const paddedSecs = secs.toString().padStart(2, '0');

  if (hrs > 0) {
    const paddedHrs = hrs.toString().padStart(2, '0');
    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
  } else {
    return `${paddedMins}:${paddedSecs}`;
  }
}
