export function track(event, payload = {}) {
  // сейчас — консоль
  // потом → GA / Plausible / Segment / Meta
  console.log(`[analytics] ${event}`, payload);
}
