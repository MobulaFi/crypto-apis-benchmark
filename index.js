const axios = require("axios");
const chalk = require("chalk");
const cliProgress = require("cli-progress");
const { table } = require("table");

// Mobula API setup
const mobulaAPI = axios.create({
  baseURL: "https://api.mobula.io/api/1",
  headers: { Authorization: "25442cb3-6bf2-479f-b8dc-fd1cde0ec7c8" },
});

// Moralis API setup
const moralisAPI = axios.create({
  baseURL: "https://deep-index.moralis.io/api/v2",
  headers: {
    "X-API-Key":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ijg3NDIwOWU3LTQ3ODAtNDkyYy04OWQxLWZhM2I2ZjVlYmUwYyIsIm9yZ0lkIjoiMzY3MjM5IiwidXNlcklkIjoiMzc3NDI5IiwidHlwZUlkIjoiZDg3MjE2NDItMDhmOS00NTdkLWE4NzktMjcxMzg0ZGQ2NWY3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDE5Mzk3MDgsImV4cCI6NDg1NzY5OTcwOH0.hrH_-hD2fEL58j4FAQo2on0M4F0YtT-mscrWnlNXvLY",
  },
});

// Coinlayer API setup
const coinlayerAPIs = axios.create({
  baseURL: "http://api.coinlayer.com/api",
  params: { access_key: "9f3eb40dc7070b961df9189ec005a771" },
});

// CoinMarketCap API setup
const coinMarketCapAPI = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com",
  headers: { "X-CMC_PRO_API_KEY": "55892887-ad66-4ca6-8a96-9bdcfdcc939d" },
});

// Code for benchmarking
// Enhanced function for Moralis API
async function getEnhancedMoralisData() {
  const startTime = Date.now();
  let ethPrice;
  try {
    const response = await moralisAPI.get(
      "/erc20/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/price"
    );
    ethPrice = response.data.usdPrice;
  } catch (error) {
    console.error("Error in Moralis API:", error.message);
    return;
  }
  const responseTime = Date.now() - startTime;
  const data = {
    "BTC Price": "not covered",
    "Assets Covered": "not specified",
    "Blockchains Covered": "15",
    "Response Time (ms)": responseTime,
  };
  displayBenchmarkResult("Moralis API", data);
}

// Enhanced function for Mobula API
async function getEnhancedMobulaData() {
  const startTime = Date.now();
  let btcPrice, assetsCount, blockchainCount;

  try {
    // Fetching BTC price and assets count from mobula.io
    const marketResponse = await mobulaAPI.get("/market/data", {
      params: { asset: "Bitcoin", blockchain: "Bitcoin", symbol: "BTC" },
    });
    btcPrice = marketResponse.data.data.price;

    const assetsResponse = await mobulaAPI.get("/all");
    assetsCount = assetsResponse.data.data.length;

    // Fetching number of blockchains covered from general-api-preprod
    const blockchainResponse = await axios.get(
      "https://api.mobula.io/api/1/blockchains"
    );
    blockchainCount = blockchainResponse.data.data
      ? blockchainResponse.data.data.length
      : 0;
  } catch (error) {
    console.error("Error in Mobula API:", error.message);
    return; // Exit the function if there's an error
  }

  const responseTime = Date.now() - startTime;

  // Data to be displayed
  const data = {
    "BTC Price": btcPrice || "Unavailable",
    "Assets Covered": assetsCount || "Unavailable",
    "Blockchains Covered": blockchainCount || "Unavailable",
    "Response Time (ms)": responseTime,
  };

  // Display the results using the new method
  displayBenchmarkResult("Mobula API", data);
}

// Enhanced function for CoinCap API
async function getEnhancedCoinCapData() {
  const startTime = Date.now();
  let btcPrice, assetsCount;

  try {
    const btcResponse = await axios.get(
      "https://api.coincap.io/v2/assets/bitcoin"
    );
    btcPrice = btcResponse.data.data.priceUsd;
    const assetsResponse = await axios.get("https://api.coincap.io/v2/assets");
    assetsCount = assetsResponse.data.data.length;
  } catch (error) {
    console.error("Error in CoinCap API:", error.message);
    return;
  }
  const responseTime = Date.now() - startTime;
  const data = {
    "BTC Price": btcPrice || "Unavailable",
    "Assets Covered": assetsCount || "Unavailable",
    "Blockchains Covered": "not specified",
    "Response Time (ms)": responseTime,
  };
  displayBenchmarkResult("CoinCap API", data);
}

// Enhanced function for Coinlayer API
async function getEnhancedCoinlayerData() {
  const startTime = Date.now();
  let btcPrice, assetsCount;
  try {
    const priceResponse = await axios.get("http://api.coinlayer.com/api/live", {
      params: {
        access_key: "9f3eb40dc7070b961df9189ec005a771",
        symbols: "BTC",
      },
    });
    btcPrice = priceResponse.data.rates.BTC;
    const listResponse = await axios.get("http://api.coinlayer.com/api/list", {
      params: { access_key: "9f3eb40dc7070b961df9189ec005a771" },
    });
    assetsCount = Object.keys(listResponse.data.crypto).length;
  } catch (error) {
    console.error("Error in Coinlayer API:", error.message);
    return;
  }

  const responseTime = Date.now() - startTime;

  // Data to be displayed
  const data = {
    "BTC Price": btcPrice || "Unavailable",
    "Assets Covered": assetsCount || "Unavailable",
    "Blockchains Covered": "not specified",
    "Response Time (ms)": responseTime,
  };

  // Display the results using the new method
  displayBenchmarkResult("Coinlayer API", data);
}
// Enhanced function for CoinGecko API
async function getEnhancedCoinGeckoData() {
  const startTime = Date.now();
  let btcPrice, assetsCount, blockchainCount;

  try {
    // Fetching BTC price
    const marketResponse = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin"
    );
    btcPrice = marketResponse.data[0].current_price;

    // Counting the number of crypto assets
    const listResponse = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    assetsCount = listResponse.data.length;

    // Fetching the number of blockchain platforms
    const blockchainResponse = await axios.get(
      "https://api.coingecko.com/api/v3/asset_platforms"
    );
    blockchainCount = blockchainResponse.data.length;
  } catch (error) {
    console.error("Error in CoinGecko API:", error.message);
    return; // Exit the function in case of an error
  }

  const responseTime = Date.now() - startTime;

  // Data to be displayed
  const data = {
    "BTC Price": btcPrice || "Unavailable",
    "Assets Covered": assetsCount || "Unavailable",
    "Blockchains Covered": blockchainCount || "Unavailable",
    "Response Time (ms)": responseTime,
  };

  // Display the results using the new method
  displayBenchmarkResult("CoinGecko API", data);
}

// Enhanced function for CoinMarketCap API
async function getEnhancedCoinMarketCapData() {
  const startTime = Date.now();
  let btcPrice, assetsCount;

  try {
    // Fetching BTC price
    const priceResponse = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "55892887-ad66-4ca6-8a96-9bdcfdcc939d",
        },
        params: { symbol: "BTC", convert: "USD" },
      }
    );
    btcPrice = priceResponse.data.data.BTC.quote.USD.price;

    // Counting the number of crypto assets
    const mapResponse = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "55892887-ad66-4ca6-8a96-9bdcfdcc939d",
        },
      }
    );
    assetsCount = mapResponse.data.data.length;
  } catch (error) {
    console.error("Error in CoinMarketCap API:", error.message);
    return; // Exit the function in case of an error
  }

  const responseTime = Date.now() - startTime;

  // Data to be displayed
  const data = {
    "BTC Price": btcPrice || "Unavailable",
    "Assets Covered": assetsCount || "Unavailable",
    "Blockchains Covered": "only listed assets",
    "Response Time (ms)": responseTime,
  };

  // Display the results using the new method
  displayBenchmarkResult("CoinMarketCap API", data);
}

// Function to create a formatted table for displaying benchmark results
const displayBenchmarkResult = (apiName, data) => {
  const dataWithHeaders = [
    ["Metric", "Value"],
    ...Object.entries(data).map(([key, value]) => [key, value.toString()]),
  ];

  const config = {
    columns: {
      0: { alignment: "left", width: 25 },
      1: { alignment: "right" },
    },
    border: {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,
      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,
      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,
      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`,
    },
  };

  console.log(chalk.bold.blue(`${apiName} Benchmark Results:`));
  console.log(table(dataWithHeaders, config));
};

// Enhanced function for benchmarking
async function benchmark() {
  console.log(chalk.yellow("Starting Benchmark Test..."));
  await getEnhancedMobulaData();
  await getEnhancedCoinCapData();
  await getEnhancedCoinlayerData();
  await getEnhancedCoinGeckoData();
  await getEnhancedMoralisData();
  await getEnhancedCoinMarketCapData();
}

// Code for caching tests
// Function to display results in a colored and formatted table layout
const displayResult = (apiName, data, isCaching) => {
  const cachingStatus = isCaching
    ? chalk.red("Caching On")
    : chalk.green("No Caching | Real-time data");

  console.log(chalk.bold(`${apiName} | ${cachingStatus}:\n`));

  data.forEach((item) => {
    console.log(`${chalk.bold("Time:")} ${item.timestamp}`);
    console.log(`${chalk.bold("BTC Price:")} ${item.btcPrice}\n`);
  });
};

// Function to test caching for Mobula API
async function testMobulaCache() {
  let data = [];
  console.log(chalk.yellow("Testing Mobula API cache...\n"));

  // Create a new progress bar instance
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(5, 0);

  const intervalId = setInterval(async () => {
    try {
      const response = await mobulaAPI.get("/market/data", {
        params: { asset: "Bitcoin", blockchain: "Bitcoin", symbol: "BTC" },
      });
      const btcPrice = response.data.data.price;
      data.push({
        timestamp: new Date().toLocaleTimeString(),
        btcPrice,
      });
    } catch (error) {
      console.error(chalk.red("Error fetching Mobula data:", error.message));
    }

    progressBar.increment();
  }, 5000);

  setTimeout(() => {
    clearInterval(intervalId);
    progressBar.stop(); // Stop the progress bar once the test is completed
    // Display the result in a table format
    displayResult("Mobula", data, false);
    console.log("\n");
  }, 30000);
}

// Function to test caching for CoinCap
async function testCoinCapCache() {
  let data = [];
  console.log(chalk.yellow("Testing CoinCap API cache..."));

  const intervalId = setInterval(async () => {
    try {
      const response = await axios.get(
        "https://api.coincap.io/v2/assets/bitcoin"
      );
      const btcPrice = response.data.data.priceUsd;
      data.push({
        timestamp: new Date().toLocaleTimeString(),
        btcPrice,
      });
    } catch (error) {
      console.error("Error fetching CoinCap data:", error.message);
    }
  }, 5000);

  setTimeout(() => {
    clearInterval(intervalId);
    // Display the result in a table format
    displayResult("CoinCap", data, true);
    console.log("\n");
  }, 30000);
}

// Function to test caching for Coinlayer
async function testCoinlayerCache() {
  let data = [];
  console.log(chalk.yellow("Testing Coinlayer API cache..."));

  const intervalId = setInterval(async () => {
    try {
      const response = await axios.get("http://api.coinlayer.com/api/live", {
        params: {
          access_key: "9f3eb40dc7070b961df9189ec005a771",
          symbols: "BTC",
        },
      });
      const btcPrice = response.data.rates.BTC;
      data.push({
        timestamp: new Date().toLocaleTimeString(),
        btcPrice,
      });
    } catch (error) {
      console.error("Error fetching Coinlayer data:", error.message);
    }
  }, 5000);

  setTimeout(() => {
    clearInterval(intervalId);
    // Display the result in a table format
    displayResult("Coinlayer", data, true);
    console.log("\n");
  }, 30000);
}

// Function to test caching for CoinGecko
async function testCoinGeckoCache() {
  let data = [];
  console.log(chalk.yellow("Testing CoinGecko API cache..."));

  const intervalId = setInterval(async () => {
    try {
      const url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin&x_cg_demo_api_key=CG-487diuceKHutmnDaBNHTfQ3u";
      const response = await axios.get(url);

      if (response.data && response.data.length > 0) {
        const btcData = response.data[0];
        const btcPrice = btcData.current_price;
        data.push({
          timestamp: new Date().toLocaleTimeString(),
          btcPrice,
        });
      } else {
        console.error(
          "Received empty response or data array is empty from CoinGecko"
        );
      }
    } catch (error) {
      console.error(`Error fetching CoinGecko data: ${error.message}`);
    }
  }, 4000);

  setTimeout(() => {
    clearInterval(intervalId);
    if (data.length > 0) {
      displayResult("CoinGecko", data, true);
    } else {
      console.log(chalk.red("No data retrieved from CoinGecko API"));
    }
    console.log("\n");
  }, 40000);
}

// Function to test caching for CoinMarketCap
async function testCoinMarketCapCache() {
  let data = [];
  console.log(chalk.yellow("Testing CoinMarketCap API cache..."));

  const intervalId = setInterval(async () => {
    try {
      const response = await axios.get(
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
        {
          headers: {
            "X-CMC_PRO_API_KEY": "55892887-ad66-4ca6-8a96-9bdcfdcc939d",
          },
          params: { symbol: "BTC", convert: "USD" },
        }
      );
      const btcPrice = response.data.data.BTC.quote.USD.price;
      data.push({
        timestamp: new Date().toLocaleTimeString(),
        btcPrice,
      });
    } catch (error) {
      console.error("Error fetching CoinMarketCap data:", error.message);
    }
  }, 4000);

  setTimeout(() => {
    clearInterval(intervalId);
    // Display the result in a table format
    console.log("\n");
    displayResult("CoinMarketCap", data, true);
    console.log("\n");
  }, 30000);
}

// Function to run cache tests sequentially
async function runCacheTests() {
  await testCoinMarketCapCache();
  await testCoinCapCache();
  await testCoinlayerCache();
  await testCoinGeckoCache();
  await testMobulaCache();
}

// Code for stress testing
async function sendBatchRequests(apiFunction) {
  const requests = [];
  for (let i = 0; i < 10; i++) {
    requests.push(apiFunction());
  }
  return Promise.allSettled(requests);
}

async function stressTestAPI(apiFunction, apiName) {
  // Initialize progress bar
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  let totalRequests = 0;
  let successfulResponses = 0;
  let failedResponses = 0;
  let totalResponseTime = 0;

  console.log(chalk.yellow(`Starting Stress Test for ${apiName}...`));
  progressBar.start(20, 0); // Start progress bar (10 requests x 2 iterations = 20 total)

  for (let i = 0; i < 2; i++) {
    const startTime = Date.now();
    const responses = await sendBatchRequests(apiFunction);
    const endTime = Date.now();
    totalResponseTime += endTime - startTime;

    responses.forEach((response) => {
      if (response.status === "fulfilled") {
        successfulResponses++;
      } else {
        failedResponses++;
      }
      progressBar.increment(); // Increment progress bar after each batch request
    });

    totalRequests += 10;
    if (i < 1) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  progressBar.stop(); // Stop progress bar after completion
  const averageResponseTime = totalResponseTime / 2;
  // Prepare data for the table
  const data = [
    ["Metric", "Value"],
    ["Total Requests", totalRequests.toString()],
    ["Successful Responses", successfulResponses.toString()],
    ["Failed Responses", failedResponses.toString()],
    ["Average Response Time", `${averageResponseTime.toFixed(2)} ms`],
  ];

  // Configure table options
  const config = {
    columns: {
      0: { alignment: "left", width: 25 },
      1: { alignment: "right" },
    },
    border: {
      topBody: `─`,
      topJoin: `┬`,
      topLeft: `┌`,
      topRight: `┐`,

      bottomBody: `─`,
      bottomJoin: `┴`,
      bottomLeft: `└`,
      bottomRight: `┘`,

      bodyLeft: `│`,
      bodyRight: `│`,
      bodyJoin: `│`,

      joinBody: `─`,
      joinLeft: `├`,
      joinRight: `┤`,
      joinJoin: `┼`,
    },
    drawHorizontalLine: (index, size) => {
      return index === 0 || index === 1 || index === size;
    },
  };

  console.log(chalk.bold.blue(`${apiName} Stress Test Results:`));
  console.log(table(data, config));
}

// Mobula API for stress testing
async function requestMobulaAPI() {
  return mobulaAPI.get("/market/data", {
    params: { asset: "Bitcoin", blockchain: "Bitcoin", symbol: "BTC" },
  });
}

// Moralis API for stress testing
async function requestMoralisAPI() {
  return moralisAPIs.get(
    "/erc20/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/price"
  );
}

// CoinCap API for stress testing
async function requestCoinCapAPI() {
  return axios.get("https://api.coincap.io/v2/assets/bitcoin");
}

// Coinlayer API for stress testing
async function requestCoinlayerAPI() {
  return coinlayerAPI.get("/live", { params: { symbols: "BTC" } });
}

// CoinGecko API for stress testing
async function requestCoinGeckoAPI() {
  return axios.get("https://api.coingecko.com/api/v3/coins/bitcoin");
}

// CoinMarketCap API for stress testing
async function requestCoinMarketCapAPI() {
  return coinMarketCapAPI.get("/v1/cryptocurrency/quotes/latest", {
    params: { symbol: "BTC", convert: "USD" },
  });
}

async function runStressTests() {
  await stressTestAPI(requestMobulaAPI, "Mobula API");
  await stressTestAPI(requestMoralisAPI, "Moralis API");
  await stressTestAPI(requestCoinCapAPI, "CoinCap API");
  await stressTestAPI(requestCoinlayerAPI, "Coinlayer API");
  await stressTestAPI(requestCoinGeckoAPI, "CoinGecko API");
  await stressTestAPI(requestCoinMarketCapAPI, "CoinMarketCap API");
}

// Main function to execute based on command line arguments
async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "caching-test") {
    await runCacheTests();
  } else if (args[0] === "stress-test") {
    await runStressTests();
  } else {
    await benchmark();
  }
}

main();
