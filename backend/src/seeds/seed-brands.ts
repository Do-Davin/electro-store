import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { BrandsService } from '../modules/brands/brands.service';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const logger = new Logger('BrandSeeder');

/**
 * Brand seed data.
 * logoUrl & inventorImageUrl will be set after downloading images.
 */
const BRANDS_SEED = [
  {
    name: 'Apple',
    inventorName: 'Steve Jobs',
    logoFile: 'apple.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/195px-Apple_logo_black.svg.png',
    inventorFile: 'steve-jobs.jpg',
    inventorDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg/440px-Steve_Jobs_Headshot_2010-CROP_%28cropped_2%29.jpg',
  },
  {
    name: 'Samsung',
    inventorName: 'Lee Byung-chul',
    logoFile: 'samsung.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png',
    inventorFile: 'lee-byung-chul.jpg',
    inventorDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Lee_Byung-chull%2C_founder_of_Samsung.jpg/440px-Lee_Byung-chull%2C_founder_of_Samsung.jpg',
  },
  {
    name: 'Sony',
    inventorName: 'Akio Morita',
    logoFile: 'sony.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/512px-Sony_logo.svg.png',
    inventorFile: 'akio-morita.jpg',
    inventorDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Akio_Morita_1989.jpg/330px-Akio_Morita_1989.jpg',
  },
  {
    name: 'Dell',
    inventorName: 'Michael Dell',
    logoFile: 'dell.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/512px-Dell_Logo.svg.png',
    inventorFile: 'michael-dell.jpg',
    inventorDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Michael_Dell_2010.jpg/440px-Michael_Dell_2010.jpg',
  },
  {
    name: 'Lenovo',
    inventorName: 'Liu Chuanzhi',
    logoFile: 'lenovo.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/512px-Lenovo_logo_2015.svg.png',
    inventorFile: 'liu-chuanzhi.jpg',
    inventorDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Liu_Chuanzhi_2012.jpg/440px-Liu_Chuanzhi_2012.jpg',
  },
  {
    name: 'Microsoft',
    inventorName: 'Bill Gates',
    logoFile: 'microsoft.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/512px-Microsoft_logo_%282012%29.svg.png',
    inventorFile: 'bill-gates.jpg',
    inventorDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg',
  },
  {
    name: 'LG',
    inventorName: 'Koo In-hwoi',
    logoFile: 'lg.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/512px-LG_logo_%282015%29.svg.png',
    inventorFile: 'koo-in-hwoi.jpg',
    inventorDownload: null,
  },
  {
    name: 'HP',
    inventorName: 'Bill Hewlett & Dave Packard',
    logoFile: 'hp.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/480px-HP_logo_2012.svg.png',
    inventorFile: null,
    inventorDownload: null,
  },
  {
    name: 'Asus',
    inventorName: 'T.H. Tung',
    logoFile: 'asus.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/512px-ASUS_Logo.svg.png',
    inventorFile: null,
    inventorDownload: null,
  },
  {
    name: 'Razer',
    inventorName: 'Min-Liang Tan',
    logoFile: 'razer.png',
    logoDownload:
      'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Razer_snake_logo.svg/440px-Razer_snake_logo.svg.png',
    inventorFile: null,
    inventorDownload: null,
  },
];

/**
 * Download a file from a URL. Follows redirects once.
 */
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      logger.log(`  ↳ Already exists: ${path.basename(dest)}`);
      return resolve();
    }

    const get = url.startsWith('https') ? https.get : http.get;

    get(url, { headers: { 'User-Agent': 'ElectroStore-Seeder/1.0' } }, (res) => {
      // Follow one redirect
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Download failed (${res.statusCode}): ${url}`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        logger.log(`  ↳ Downloaded: ${path.basename(dest)}`);
        resolve();
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const brandsService = app.get(BrandsService);

  const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'brands');
  fs.mkdirSync(uploadsDir, { recursive: true });

  logger.log('=== Starting Brand Seed ===');
  logger.log(`Upload dir: ${uploadsDir}`);

  let created = 0;
  let skipped = 0;

  for (const brand of BRANDS_SEED) {
    logger.log(`\nProcessing: ${brand.name}`);

    // Download logo
    const logoDest = path.join(uploadsDir, brand.logoFile);
    try {
      await downloadFile(brand.logoDownload, logoDest);
    } catch (e) {
      logger.warn(`  ✗ Failed to download logo for ${brand.name}: ${(e as Error).message}`);
    }

    // Download inventor image (if available)
    let inventorImageUrl: string | null = null;
    if (brand.inventorFile && brand.inventorDownload) {
      const inventorDest = path.join(uploadsDir, brand.inventorFile);
      try {
        await downloadFile(brand.inventorDownload, inventorDest);
        inventorImageUrl = `/uploads/brands/${brand.inventorFile}`;
      } catch (e) {
        logger.warn(`  ✗ Failed to download inventor image for ${brand.name}: ${(e as Error).message}`);
      }
    }

    // Insert into DB via service (handles duplicate check)
    try {
      await brandsService.create({
        name: brand.name,
        inventorName: brand.inventorName,
        logoUrl: `/uploads/brands/${brand.logoFile}`,
        inventorImageUrl,
      });
      logger.log(`  ✓ Created: ${brand.name}`);
      created++;
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes('already exists')) {
        logger.log(`  ⊘ Skipped (already exists): ${brand.name}`);
        skipped++;
      } else {
        logger.error(`  ✗ Failed to create ${brand.name}: ${msg}`);
      }
    }
  }

  logger.log(`\n=== Seed Complete: ${created} created, ${skipped} skipped ===`);
  await app.close();
}

seed().catch((err) => {
  logger.error('Seed failed', err);
  process.exit(1);
});
