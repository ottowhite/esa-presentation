const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

(async () => {
	const outputPath = process.argv[2] || 'exported.pdf';
	const host = process.env.REVEAL_HOST || 'localhost';
	const port = process.env.REVEAL_PORT || '8000';
	const baseUrl = `http://${host}:${port}`;

	// Slide dimensions (must match reveal.js config)
	const slideWidth = 1920;
	const slideHeight = 1080;

	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		// Set viewport to exact slide dimensions
		await page.setViewport({
			width: slideWidth,
			height: slideHeight,
			deviceScaleFactor: 1
		});

		console.log(`Loading ${baseUrl}...`);
		await page.goto(baseUrl, { waitUntil: 'networkidle0' });

		// Get total slide count
		const totalSlides = await page.evaluate(() => {
			return Reveal.getTotalSlides();
		});
		console.log(`Found ${totalSlides} slides`);

		// Create PDF document
		const pdfDoc = await PDFDocument.create();

		// Screenshot each slide and add to PDF
		for (let i = 0; i < totalSlides; i++) {
			// Navigate to slide
			await page.evaluate((index) => {
				Reveal.slide(index);
			}, i);
			await new Promise(r => setTimeout(r, 100)); // Wait for transition

			// Take screenshot
			const screenshot = await page.screenshot({
				type: 'png',
				clip: { x: 0, y: 0, width: slideWidth, height: slideHeight }
			});

			// Add page to PDF (convert px to points: 1px = 0.75pt at 96dpi)
			const pngImage = await pdfDoc.embedPng(screenshot);
			const pdfPage = pdfDoc.addPage([slideWidth, slideHeight]);
			pdfPage.drawImage(pngImage, {
				x: 0,
				y: 0,
				width: slideWidth,
				height: slideHeight
			});

			console.log(`Captured slide ${i + 1}/${totalSlides}`);
		}

		// Save PDF
		const pdfBytes = await pdfDoc.save();
		fs.writeFileSync(outputPath, pdfBytes);

		await browser.close();
		console.log(`Done. PDF saved to ${outputPath}`);
	} catch (err) {
		console.error('Error generating PDF:', err);
		process.exit(1);
	}
})();
