const Jimp = require('jimp');
const path = require('path');

async function processFavicon() {
  const logoPath = path.join(__dirname, '../public/logo.png');
  const image = await Jimp.read(logoPath);

  // 1. Auto-crop transparent boundaries if any, or find actual content
  image.autocrop();

  const width = image.bitmap.width;
  const height = image.bitmap.height;
  console.log(`Cropped content dimensions: ${width}x${height}`);

  // 2. Create a square transparent canvas (512x512)
  const size = 512;
  const canvas = new Jimp(size, size, 0x00000000); // completely transparent

  // 3. Scale image to fit inside 512x512 with a slight padding (e.g. 460x460 max) while maintaining EXACT aspect ratio
  const maxContentSize = 460;
  image.contain(maxContentSize, maxContentSize);

  // 4. Center the image onto the square canvas
  const x = Math.floor((size - image.bitmap.width) / 2);
  const y = Math.floor((size - image.bitmap.height) / 2);
  canvas.composite(image, x, y);

  // 5. Write to src/app/icon.png, src/app/apple-icon.png, public/favicon.ico, and public/logo-square.png
  await canvas.writeAsync(path.join(__dirname, '../src/app/icon.png'));
  await canvas.writeAsync(path.join(__dirname, '../src/app/apple-icon.png'));
  await canvas.writeAsync(path.join(__dirname, '../public/favicon.ico'));
  await canvas.writeAsync(path.join(__dirname, '../public/icon.png'));

  // Also create a 32x32 and 48x48 version
  const canvas32 = canvas.clone().resize(32, 32);
  await canvas32.writeAsync(path.join(__dirname, '../public/favicon-32x32.png'));

  console.log('Successfully generated square, proportional, high-res favicons and icons!');
}

processFavicon().catch(err => {
  console.error(err);
  process.exit(1);
});
