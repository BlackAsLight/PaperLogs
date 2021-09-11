import * as fs from 'fs';
import * as zlib from 'zlib';

let args = process.argv;
args.shift();
args.shift();
console.log(`${args.length} Path${args.length == 1 ? 's' : ''} Provided.`);
(async () => {
	while (args.length) {
		const path = (() => {
			const arg = args.shift();
			if (arg.endsWith('/'))
				return arg;
			return arg + '/';
		})();
		if (!fs.existsSync(path)) {
			console.log(`Invalid Path: ${path}`);
			continue;
		}

		let files = fs.readdirSync(path).filter(x => x.endsWith('.log.gz')).sort();
		console.log(`Found ${files.length} logs.`);
		let days = {};

		const yesterday = new Date().getTime() - 86400000;
		while (files.length) {
			const file = files.shift();
			const date = file.slice(0, 10);
			if (new Date(date).getTime() < yesterday) {
				if (days[date] == null)
					days[date] = [];
				days[date].push(file);
			}
		}
		console.log(`Logs sorted into ${Object.keys(days).length} days.`);

		for (const day in days) {
			const count = days[day].length;
			console.log(`Day, ${day}, has ${count} logs.${count == 1 ? ' Skipping...' : ''}`);
			if (count == 1)
				continue;

			const writeStream = fs.createWriteStream(path + day + '.log');
			let hadError = false;
			for (const file of days[day]) {
				const response: boolean = await new Promise((resolve, reject) => fs.createReadStream(path + file)
					.pipe(zlib.createGunzip())
					.on('data', (chunk) => writeStream.write(chunk))
					.on('close', () => resolve(true))
					.on('error', () => reject(false)));
				if (!response) {
					console.log(`An unknown error occurred while processing file ${file}. Scraping Progress made for that day and moving on.`);
					writeStream.close();
					fs.rmSync(path + day + '.log');
					hadError = true;
					break;;
				}
			}

			if (!hadError) {
				for (const file of days[day])
					fs.rmSync(path + file);
				writeStream.close();
				const compressedStream = fs.createReadStream(path + day + '.log').pipe(zlib.createGzip()).pipe(fs.createWriteStream(path + day + '.log.gz'));
				compressedStream.on('close', () => {
					fs.rmSync(path + day + '.log');
				});
			}
		}
	}
})();