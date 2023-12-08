# Crypto APIs Benchmarking Tool 🚀

This tool is designed to benchmark and test the performance of various popular cryptocurrency APIs. It includes stress tests, caching behavior tests, and overall performance benchmarking.

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

  `[Insert Code Block of Sample Response Here]`

  ![Stress Test Output](path-to-image)

### Caching Test

- **Command**: `yarn dev caching-test`
- **Description**: Tests the caching behavior of the APIs over a short period.
- **Expected Output**: A sequence of data points showing time and Bitcoin/Ethereum price.

  `[Insert Code Block of Sample Response Here]`

  ![Caching Test Output](path-to-image)

### Benchmark

- **Command**: `yarn dev`
- **Description**: Runs a benchmark test for performance metrics of various APIs.
- **Expected Output**: Summary report detailing response time, Bitcoin price, assets, and blockchains covered.

  `[Insert Code Block of Sample Response Here]`

  ![Benchmark Test Output](path-to-image)

## Common Errors and Troubleshooting 🛠️

- **Error 429 (Rate Limit Exceeded)**: Occurs when request limits are surpassed. Retry after a suitable interval.
- **Network Errors**: Ensure a stable internet connection.
- **API Key Issues**: Check the validity and configuration of API keys.

## Getting Started 🌟

1. Clone the repository from GitHub.
2. Install dependencies using `yarn install`.
3. Run the desired test command.

## Usage 📊

Ideal for:

- Comparative analysis of cryptocurrency APIs.
- Evaluating API performance under stress.
- Understanding API caching mechanisms.
