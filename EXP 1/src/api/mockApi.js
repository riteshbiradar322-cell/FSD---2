// Conceptual / mock API layer.
// Simulates network latency and a chance of failure so the UI's loading,
// error, retry and toast logic has something real to react to.

const FAIL_RATE = 0.3; // 30% simulated failure, so retry logic is exercised

function simulateNetwork(payload, { forceFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = forceFail || Math.random() < FAIL_RATE;
      if (!payload?.content?.trim()) {
        reject({ error: "Invalid data: content is empty" });
        return;
      }
      if (shouldFail) {
        reject({ error: "Network error: failed to reach server" });
        return;
      }
      resolve({ success: true, id: payload.id ?? Date.now().toString() });
    }, 800);
  });
}

export function saveDraftMock(draft) {
  return simulateNetwork(draft);
}

export function updateDraftMock(draft) {
  return simulateNetwork(draft);
}

// Generic retry wrapper with a fixed retry budget.
// Retries only the async operation itself; UI state is managed by the caller.
export async function retry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) return retry(fn, retries - 1);
    throw err;
  }
}
