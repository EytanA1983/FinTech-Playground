# Banking‑X – Open‑Banking Playground
A demo Open‑Banking API with fraud detection powered by LSTM

## Purpose

Banking-X presents an innovative fintech solution for the Israeli market by combining:

- Open-Banking APIs for transaction data integration
- Machine Learning with an LSTM-based fraud risk score
- Online commercial services for real-time business automation

### Core Goals

- Build a modular microservice that can be deployed to Kubernetes and Serverless
- Integrate quickly with companies that already expose banking APIs
- Demonstrate an end-to-end transaction flow:
  1. Ingest transaction data
  2. Mark suspicious transactions as potential fraud
  3. Support successful reconciliation workflows

### Business Value

- Improve real-time fraud detection
- Reduce false positives in monitoring and controls
- Shorten operational and financial handling cycles
- Provide scalable infrastructure for additional fintech products

## Quick Demo (Local)

1. Start the ML service:
   - `cd ml_service`
   - `pip install -r requirements.txt`
   - `uvicorn app:app --host 0.0.0.0 --port 8000`

2. Start the API in another terminal:
   - `cd src/api`
   - `npm install`
   - `npm run start:dev`

3. Open in browser:
   - Health: `http://localhost:3000/health`
   - Demo token: `http://localhost:3000/api/auth/demo-token`
   - Demo transaction: `http://localhost:3000/api/transactions/demo`
   - Demo overview: `http://localhost:3000/api/demo/overview`

4. Optional UI app:
   - `cd src/web`
   - `npm install`
   - `npm run dev`
   - Open: `http://localhost:5188`

## Notes

- `DEMO_MODE=true` is the default in the API service for smoother demos.
- In demo mode, the API returns a stable mocked risk score (`0.83`) and does not depend on external banking APIs.
