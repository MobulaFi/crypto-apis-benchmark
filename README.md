# Crypto APIs Benchmarking Tool 🚀

This tool is designed to benchmark and test the performance of various popular cryptocurrency APIs: CoinMarketCap, CoinGecko, CoincAp, CoinLayer, Moralis, Mobula. It includes stress tests, caching behavior tests, and overall performance benchmarking.

## Goals 🎯

- Assess the performance of different cryptocurrency APIs.
- Compare response times, caching mechanisms, and data accuracy.
- Provide insights for users to select the most efficient API for their needs.

## APIs Compared 🌐

- CoinMarketCap
- CoinGecko
- CoinCap
- Mobula
- Moralis

## Commands 💻

### Stress Test

- **Command**: `yarn dev stress-test`
- **Description**: Executes a stress test on the selected cryptocurrency APIs.
- **Expected Output**: A detailed report showing total requests, successful responses, failed responses, and average response time.

  ![Stress Test Output](https://i.imgur.com/Vx7qUI2.png)

### Caching Test

- **Command**: `yarn dev caching-test`
- **Description**: Tests the caching behavior of the APIs over a short period.
- **Expected Output**: A sequence of data points showing time and Bitcoin/Ethereum price.

  ![Caching Test Output](https://i.imgur.com/Yg6ilyl.png)

### Benchmark

- **Command**: `yarn dev`
- **Description**: Runs a benchmark test for performance metrics of various APIs.
- **Expected Output**: Summary report detailing response time, Bitcoin price, assets, and blockchains covered.

  ![Benchmark Test Output](https://i.imgur.com/xE2lNgl.png)

## Common Errors and Troubleshooting 🛠️

- **Error 429 (Rate Limit Exceeded)**: Occurs when request limits are surpassed. Retry after a suitable interval.
- **API Key Issues**: Check the validity and configuration of API keys. (API keys are included)

## Getting Started 🌟

1. Clone the repository from GitHub.
2. Install dependencies using `yarn install`.
3. Run the desired test command.
