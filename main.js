import { crawlPage, printReport } from "./crawl.js";

async function main() {
    if (process.argv.length < 3) {
        console.log('Please include a website address as a command line argument to crawl');
        return;
    }
    if (process.argv.length > 3) {
        console.log('Webcrawler can only accept one command line argument');
        return;
    }
    const baseURL = process.argv[2];
    console.log(`Starting crawler at base URL: ${baseURL}`);
    const pages = await crawlPage(baseURL);
    printReport(pages);
}

main()