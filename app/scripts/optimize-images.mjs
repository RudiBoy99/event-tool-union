import sharp from 'sharp'
import { readdir, mkdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const APP_ROOT = resolve(__dirname, '..')
const SOURCE_DIR = resolve(APP_ROOT, '..', 'Bilder')
const TARGET_DIR = resolve(APP_ROOT, 'public', 'images', 'sports')

const FOLDER_TO_SLUG = {
  'Golf (Münchenstein)': 'golf',
  'Padel (Hafen + Münchenstein)': 'padel',
  'Pickle Ball (Wolf)': 'pball',
  'Tennis (Münchenstein)': 'tennis',
}

const MAX_DIM = 1600
const QUALITY = 80
const IMG_RE = /\.(jpe?g|png|webp)$/i

async function main() {
  await rm(TARGET_DIR, { recursive: true, force: true })
  await mkdir(TARGET_DIR, { recursive: true })

  let total = 0
  let totalBytes = 0

  for (const [folder, slug] of Object.entries(FOLDER_TO_SLUG)) {
    const srcPath = join(SOURCE_DIR, folder)
    let entries
    try {
      entries = (await readdir(srcPath)).filter((f) => IMG_RE.test(f))
    } catch {
      console.warn(`· skip missing folder: ${folder}`)
      continue
    }
    if (entries.length === 0) {
      console.warn(`· empty: ${folder}`)
      continue
    }
    entries.sort()
    const outDir = join(TARGET_DIR, slug)
    await mkdir(outDir, { recursive: true })

    for (let i = 0; i < entries.length; i++) {
      const file = entries[i]
      const inFile = join(srcPath, file)
      const name = `${slug}-${String(i + 1).padStart(2, '0')}.webp`
      const outFile = join(outDir, name)
      const info = await sharp(inFile)
        .rotate()
        .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outFile)
      total++
      totalBytes += info.size
      console.log(`✓ ${slug}/${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
    }
  }

  console.log(`\n${total} images, ${(totalBytes / 1024 / 1024).toFixed(2)} MB total`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
