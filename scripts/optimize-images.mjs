/**
 * Генерация WebP вариантов под srcset.
 * Запуск: node scripts/optimize-images.mjs
 *
 * Для каждого фото в public/images/** создаёт:
 *   <name>-480w.webp, <name>-960w.webp, <name>-1600w.webp
 * Источники: .jpg / .jpeg / .png / .webp (фото, не логотипы)
 * Skip: logo-*, hero-radde-desktop.webp, hero-radde-mobile.webp (см. ниже),
 *        иконки, всё что не фото.
 *
 * Hero ART-direction (hero-radde-desktop.webp / hero-radde-mobile.webp) обрабатываются
 * отдельно — генерируются масштабированные варианты под их собственный набор ширин.
 *
 * Идемпотентно: если выходной файл новее источника, пропускает.
 */
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG_DIR = path.join(__dirname, '..', 'public', 'images')

const QUALITY = 80
const QUALITY_HERO = 78

const STANDARD_WIDTHS = [480, 960, 1600]
const HERO_DESKTOP_WIDTHS = [1280, 1600, 1920]
const HERO_MOBILE_WIDTHS = [480, 768, 1024]

const SKIP_BASENAMES = new Set([
  'logo-color.png',
  'logo-white.png',
  'hero-radde.png',
])

const HERO_ART_DESKTOP = 'hero-radde-desktop.webp'
const HERO_ART_MOBILE = 'hero-radde-mobile.webp'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f)
    const st = fs.statSync(fp)
    if (st.isDirectory()) walk(fp, out)
    else out.push(fp)
  }
  return out
}

function isPhoto(file) {
  return /\.(jpe?g|png|webp)$/i.test(file)
}

function isResponsiveVariant(file) {
  return /-\d+w\.webp$/i.test(path.basename(file))
}

function variantPath(srcFile, width) {
  const dir = path.dirname(srcFile)
  const name = path.basename(srcFile).replace(/\.(jpe?g|png|webp)$/i, '')
  return path.join(dir, `${name}-${width}w.webp`)
}

async function generateVariant(srcFile, width, quality) {
  const outFile = variantPath(srcFile, width)
  if (fs.existsSync(outFile)) {
    const srcMtime = fs.statSync(srcFile).mtimeMs
    const outMtime = fs.statSync(outFile).mtimeMs
    if (outMtime >= srcMtime) return { outFile, skipped: true, size: fs.statSync(outFile).size }
  }
  const buf = await sharp(srcFile, { failOn: 'none' })
    .rotate() // honour EXIF orientation
    .resize(width, null, { withoutEnlargement: true, fit: 'inside' })
    .webp({ quality })
    .toBuffer()
  fs.writeFileSync(outFile, buf)
  return { outFile, skipped: false, size: buf.length }
}

async function processStandard(file) {
  let originalBytes = fs.statSync(file).size
  let outputBytes = 0
  const results = []
  for (const w of STANDARD_WIDTHS) {
    const r = await generateVariant(file, w, QUALITY)
    results.push({ width: w, ...r })
    outputBytes += r.size
  }
  return { file, originalBytes, outputBytes, results }
}

async function processHero(file, widths) {
  let originalBytes = fs.statSync(file).size
  let outputBytes = 0
  const results = []
  for (const w of widths) {
    const r = await generateVariant(file, w, QUALITY_HERO)
    results.push({ width: w, ...r })
    outputBytes += r.size
  }
  return { file, originalBytes, outputBytes, results }
}

async function main() {
  const all = walk(IMG_DIR).filter(isPhoto).filter(f => !isResponsiveVariant(f))

  let totalOriginal = 0
  let totalOutput = 0
  let processed = 0

  for (const file of all) {
    const base = path.basename(file)
    if (SKIP_BASENAMES.has(base)) {
      console.log(`SKIP ${path.relative(IMG_DIR, file)} (logo/og)`)
      continue
    }

    let result
    if (base === HERO_ART_DESKTOP) {
      result = await processHero(file, HERO_DESKTOP_WIDTHS)
    } else if (base === HERO_ART_MOBILE) {
      result = await processHero(file, HERO_MOBILE_WIDTHS)
    } else {
      result = await processStandard(file)
    }

    totalOriginal += result.originalBytes
    totalOutput += result.outputBytes
    processed += 1

    const rel = path.relative(IMG_DIR, file)
    const variants = result.results.map(r => `${r.width}w:${(r.size / 1024).toFixed(0)}KB${r.skipped ? '*' : ''}`).join(' ')
    console.log(`${rel.padEnd(45)} src=${(result.originalBytes / 1024).toFixed(0)}KB → ${variants}`)
  }

  console.log(`\nОбработано фото: ${processed}`)
  console.log(`Сумма источников: ${(totalOriginal / 1024 / 1024).toFixed(2)} МБ`)
  console.log(`Сумма variants:   ${(totalOutput / 1024 / 1024).toFixed(2)} МБ`)
  console.log(`(* — пропущено как не изменённое)`)
}

main().catch((e) => { console.error(e); process.exit(1) })
