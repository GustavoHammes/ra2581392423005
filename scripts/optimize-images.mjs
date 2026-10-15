import sharp from "sharp";
import { stat } from "node:fs/promises";

const images = [
  ["public/Gustavo.JPG", "public/portrait.webp", 960],
  ["public/projects/nlw-agents.png", "public/projects/nlw-agents.webp", 1100],
];
for (const [source, output, width] of images) {
  await sharp(source)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  const original = await stat(source);
  const optimized = await stat(output);
  console.log(
    `${output}: ${(optimized.size / 1024).toFixed(0)} KB (${Math.round((1 - optimized.size / original.size) * 100)}% menor)`,
  );
}
