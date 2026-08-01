import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, "../data/antispam_state.json");

const spamMap = new Map();

if (!fs.existsSync(path.join(__dirname, "../data"))) {
  fs.mkdirSync(path.join(__dirname, "../data"), { recursive: true });
}

export function isAntispamEnabled() {
  if (!fs.existsSync(STATE_FILE)) return true; 
  try {
    const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
    return state.enabled !== false;
  } catch {
    return true;
  }
}

export function setFeature(featureName, isEnabled) {
  
  let state = {};
  if (fs.existsSync(STATE_FILE)) {
    try { state = JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")); } catch {}
  }
  state.enabled = isEnabled;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

export function checkSpam(userId, limit = 5, intervalMs = 2000) {
  if (!isAntispamEnabled()) return false;

  const now = Date.now();
  if (!spamMap.has(userId)) spamMap.set(userId, []);
  
  const timestamps = spamMap.get(userId).filter(t => now - t < intervalMs);
  timestamps.push(now);
  spamMap.set(userId, timestamps);
  
  return timestamps.length > limit;
}
