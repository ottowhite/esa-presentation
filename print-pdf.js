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
		// Use 2560x1440 CSS pixels to get 1920x1080 PDF points (96/72 DPI conversion)
		await page.pdf({
			path: outputPath,
			width: '2560px',
			height: '1440px',
			printBackground: true,
			margin: { top: 0, right: 0, bottom: 0, left: 0 }
		});

		await browser.close();
		console.log('Done.');
	} catch (err) {
		console.error('Error generating PDF:', err);
		process.exit(1);
	}
})();
