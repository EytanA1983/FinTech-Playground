import './style.css';

type ApiState = {
  status: string;
  body: unknown;
};

const API_BASE = 'http://localhost:3000';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
  throw new Error('Missing #app root');
}

app.innerHTML = `
  <main class="container">
    <header class="hero">
      <h1>Banking-X Demo UI</h1>
      <p class="muted">Product-style demo for transactions and fraud scoring.</p>
    </header>

    <section class="status-grid">
      <article class="status-card">
        <h3>API</h3>
        <span id="chip-api" class="chip chip-unknown">Unknown</span>
      </article>
      <article class="status-card">
        <h3>Database</h3>
        <span id="chip-db" class="chip chip-unknown">Unknown</span>
      </article>
      <article class="status-card">
        <h3>Redis</h3>
        <span id="chip-redis" class="chip chip-unknown">Unknown</span>
      </article>
      <article class="status-card">
        <h3>ML Service</h3>
        <span id="chip-ml" class="chip chip-unknown">Unknown</span>
      </article>
    </section>

    <section class="card">
      <div class="card-title-row">
        <h2>Service Overview</h2>
        <button id="btn-overview">Refresh Status</button>
      </div>
      <p id="overview-summary" class="muted">Click refresh to load service health.</p>
    </section>

    <section class="card">
      <div class="card-title-row">
        <h2>Authentication</h2>
        <button id="btn-token">Get Demo Token</button>
      </div>
      <p id="token-summary" class="muted">No token yet.</p>
    </section>

    <section class="card">
      <h2>Create Transaction</h2>
      <form id="tx-form" class="form">
        <label>Account ID <input id="accountId" value="demo-account-1" required /></label>
        <label>Amount <input id="amount" type="number" value="149.9" step="0.01" required /></label>
        <label>Currency <input id="currency" value="USD" required /></label>
        <button type="submit">Send Transaction</button>
      </form>
      <div id="tx-result" class="result-card hidden">
        <h3>Transaction Created</h3>
        <p><strong>Bank ID:</strong> <span id="result-bank-id">-</span></p>
        <p><strong>Amount:</strong> <span id="result-amount">-</span></p>
        <p><strong>Currency:</strong> <span id="result-currency">-</span></p>
        <p><strong>Risk Score:</strong> <span id="result-risk" class="risk-chip">-</span></p>
      </div>
      <p id="tx-summary" class="muted">Submit a transaction to see result.</p>
    </section>

    <section class="card">
      <details>
        <summary>Developer details (raw JSON)</summary>
        <h4>Overview</h4>
        <pre id="overview-output">No data</pre>
        <h4>Token</h4>
        <pre id="token-output">No data</pre>
        <h4>Transaction</h4>
        <pre id="tx-output">No data</pre>
      </details>
    </section>
  </main>
`;

const chipApi = document.querySelector<HTMLSpanElement>('#chip-api')!;
const chipDb = document.querySelector<HTMLSpanElement>('#chip-db')!;
const chipRedis = document.querySelector<HTMLSpanElement>('#chip-redis')!;
const chipMl = document.querySelector<HTMLSpanElement>('#chip-ml')!;

const overviewSummary = document.querySelector<HTMLParagraphElement>('#overview-summary')!;
const tokenSummary = document.querySelector<HTMLParagraphElement>('#token-summary')!;
const txSummary = document.querySelector<HTMLParagraphElement>('#tx-summary')!;

const overviewOutput = document.querySelector<HTMLPreElement>('#overview-output')!;
const tokenOutput = document.querySelector<HTMLPreElement>('#token-output')!;
const txOutput = document.querySelector<HTMLPreElement>('#tx-output')!;

const txResult = document.querySelector<HTMLDivElement>('#tx-result')!;
const resultBankId = document.querySelector<HTMLSpanElement>('#result-bank-id')!;
const resultAmount = document.querySelector<HTMLSpanElement>('#result-amount')!;
const resultCurrency = document.querySelector<HTMLSpanElement>('#result-currency')!;
const resultRisk = document.querySelector<HTMLSpanElement>('#result-risk')!;

const tokenStore = { value: '' };

function pretty(result: ApiState): string {
  return JSON.stringify(result, null, 2);
}

function setChip(el: HTMLSpanElement, status: string) {
  el.className = 'chip';
  if (status === 'ok') {
    el.classList.add('chip-ok');
    el.textContent = 'Healthy';
  } else if (status === 'error') {
    el.classList.add('chip-bad');
    el.textContent = 'Error';
  } else {
    el.classList.add('chip-unknown');
    el.textContent = 'Unknown';
  }
}

function riskLabel(score: number): { text: string; cls: string } {
  if (score < 0.35) return { text: `Low (${score.toFixed(2)})`, cls: 'risk-low' };
  if (score < 0.7) return { text: `Medium (${score.toFixed(2)})`, cls: 'risk-mid' };
  return { text: `High (${score.toFixed(2)})`, cls: 'risk-high' };
}

async function callApi(path: string, init?: RequestInit): Promise<ApiState> {
  try {
    const response = await fetch(`${API_BASE}${path}`, init);
    const body = await response.json();
    return {
      status: `${response.status} ${response.statusText}`,
      body,
    };
  } catch (error) {
    return {
      status: 'NETWORK_ERROR',
      body: {
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

document.querySelector<HTMLButtonElement>('#btn-overview')!.addEventListener('click', async () => {
  const result = await callApi('/api/demo/overview');
  overviewOutput.textContent = pretty(result);

  const body = result.body as {
    services?: {
      db?: { status?: string };
      redis?: { status?: string };
      ml?: { status?: string; riskScore?: number };
    };
  };

  setChip(chipApi, result.status.startsWith('200') ? 'ok' : 'error');
  setChip(chipDb, body.services?.db?.status ?? 'unknown');
  setChip(chipRedis, body.services?.redis?.status ?? 'unknown');
  setChip(chipMl, body.services?.ml?.status ?? 'unknown');

  overviewSummary.textContent = result.status.startsWith('200')
    ? 'All systems checked. Ready for demo.'
    : `Overview failed: ${result.status}`;
});

document.querySelector<HTMLButtonElement>('#btn-token')!.addEventListener('click', async () => {
  const result = await callApi('/api/auth/demo-token');
  const payload = result.body as { access_token?: string };
  tokenStore.value = payload.access_token ?? '';
  tokenOutput.textContent = pretty(result);
  tokenSummary.textContent = tokenStore.value
    ? `Token received (${tokenStore.value.slice(0, 18)}...)`
    : 'Failed to get token.';
});

document.querySelector<HTMLFormElement>('#tx-form')!.addEventListener('submit', async (event) => {
  event.preventDefault();
  const accountId = (document.querySelector<HTMLInputElement>('#accountId')!).value;
  const amount = Number((document.querySelector<HTMLInputElement>('#amount')!).value);
  const currency = (document.querySelector<HTMLInputElement>('#currency')!).value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (tokenStore.value) {
    headers.Authorization = `Bearer ${tokenStore.value}`;
  }

  const result = await callApi('/api/transactions', {
    method: 'POST',
    headers,
    body: JSON.stringify({ accountId, amount, currency }),
  });
  txOutput.textContent = pretty(result);

  const payload = result.body as {
    bankId?: string;
    amount?: number;
    currency?: string;
    riskScore?: number;
  };

  if (result.status.startsWith('200') || result.status.startsWith('201')) {
    txResult.classList.remove('hidden');
    resultBankId.textContent = payload.bankId ?? '-';
    resultAmount.textContent = String(payload.amount ?? amount);
    resultCurrency.textContent = payload.currency ?? currency;
    const score = Number(payload.riskScore ?? 0);
    const risk = riskLabel(score);
    resultRisk.className = `risk-chip ${risk.cls}`;
    resultRisk.textContent = risk.text;
    txSummary.textContent = 'Transaction completed successfully.';
  } else {
    txResult.classList.add('hidden');
    txSummary.textContent = `Transaction failed: ${result.status}`;
  }
});

// Load overview on first paint for instant dashboard
document.querySelector<HTMLButtonElement>('#btn-overview')!.click();
