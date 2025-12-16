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

		// Helper to capture current state
		async function captureCurrentState() {
			const screenshot = await page.screenshot({
				type: 'png',
				clip: { x: 0, y: 0, width: slideWidth, height: slideHeight }
			});
			const pngImage = await pdfDoc.embedPng(screenshot);
			const pdfPage = pdfDoc.addPage([slideWidth, slideHeight]);
			pdfPage.drawImage(pngImage, {
				x: 0,
				y: 0,
				width: slideWidth,
				height: slideHeight
			});
		}

		let pageCount = 0;

		// Get fragment counts for each slide
		const fragmentCounts = await page.evaluate(() => {
			return Reveal.getSlides().map(slide => {
				const fragments = slide.querySelectorAll('.fragment');
				// Get unique fragment indices (fragments can share indices for simultaneous reveal)
				const indices = new Set();
				fragments.forEach(f => {
					const index = f.getAttribute('data-fragment-index');
					indices.add(index !== null ? parseInt(index) : fragments.length);
				});
				return indices.size || (fragments.length > 0 ? fragments.length : 0);
			});
		});

		// Screenshot each slide and its fragments
		for (let i = 0; i < totalSlides; i++) {
			const fragmentCount = fragmentCounts[i];

			// Navigate to slide with all fragments hidden
			await page.evaluate((index) => {
				Reveal.slide(index);
			}, i);
			await new Promise(r => setTimeout(r, 100));

			// Hide all fragments initially
			await page.evaluate(() => {
				document.querySelectorAll('.present .fragment').forEach(f => {
					f.classList.remove('visible', 'current-fragment');
				});
			});
			await new Promise(r => setTimeout(r, 50));

			// Capture base state (no fragments)
			await captureCurrentState();
			pageCount++;
			console.log(`Captured slide ${i + 1}/${totalSlides} (base, ${fragmentCount} fragments)`);

			// Step through each fragment
			for (let f = 0; f < fragmentCount; f++) {
				await page.evaluate(() => Reveal.nextFragment());
				await new Promise(r => setTimeout(r, 250)); // Wait for animation

				await captureCurrentState();
				pageCount++;
				console.log(`Captured slide ${i + 1}/${totalSlides} (fragment ${f + 1}/${fragmentCount})`);
			}
		}

		console.log(`Total pages: ${pageCount}`);

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
