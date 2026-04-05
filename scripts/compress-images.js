/**
 * Сжатие изображений в public/images
 * Запуск: node scripts/compress-images.js
 *
 * - Сжимает все JPG/PNG до 1600px по ширине
 * - НЕ меняет ориентацию (без rotate)
 * - Убирает EXIF-данные ориентации чтобы браузер не переворачивал
 * - Качество 82% (mozjpeg)
 * - Пропускает файлы меньше 100KB
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const IMG_DIR = path.join(__dirname, '..', 'public', 'images')
const MAX_WIDTH = 1600
const QUALITY = 82
const MIN_SIZE = 100_000 // 100KB

function findImages(dir) {
  let results = []
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f)
    if (fs.statSync(fp).isDirectory()) {
      results = results.concat(findImages(fp))
    } else if (/\.(jpg|jpeg|png)$/i.test(f)) {
      results.push(fp)
    }
  }
  return results
}

async function compress() {
  const files = findImages(IMG_DIR)
  let totalSaved = 0
  let count = 0

  for (const file of files) {
    const stat = fs.statSync(file)
    if (stat.size < MIN_SIZE) continue
    // Не сжимать логотипы (PNG с прозрачностью)
    if (/logo/i.test(path.basename(file))) { console.log(`SKIP ${path.basename(file)} (logo)`); continue }

    try {
      const buf = fs.readFileSync(file)
      const out = await sharp(buf, { failOn: 'none' })
        .resize(MAX_WIDTH, null, { withoutEnlargement: true })
        .withMetadata({ orientation: undefined })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer()

      const outFile = file.replace(/\.(jpeg|png)$/i, '.jpg')
      fs.writeFileSync(outFile, out)
      if (outFile !== file) fs.unlinkSync(file)

      totalSaved += stat.size - out.length
      count++
      console.log(`${path.basename(file)}: ${(stat.size / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`)
    } catch (e) {
      console.log(`ERR ${path.basename(file)}: ${e.message}`)
    }
  }

  console.log(`\nСжато ${count} файлов, сэкономлено ${(totalSaved / 1024 / 1024).toFixed(1)} МБ`)
}

compress()
