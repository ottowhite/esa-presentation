const puppeteer = require('puppeteer');

(async () => {
	// argv[0] is node, argv[1] is script path
	// argv[2] is optional output path (defaults to 'exported.pdf')
	const outputPath = process.argv[2] || 'exported.pdf';
	const host = process.env.REVEAL_HOST || 'localhost';
	const port = process.env.REVEAL_PORT || '8000';
	const url = `http://${host}:${port}/?print-pdf`;

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		console.log(`Loading ${url}...`);
		await page.goto(url, { waitUntil: 'networkidle0' });

		console.log(`Generating PDF to ${outputPath}...`);
		await page.pdf({ path: outputPath, format: 'A4' });

		await browser.close();
		console.log('Done.');
	} catch (err) {
		console.error('Error generating PDF:', err);
		process.exit(1);
	}
})();
