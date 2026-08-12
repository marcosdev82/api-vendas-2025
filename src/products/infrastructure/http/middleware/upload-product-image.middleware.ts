import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { mkdirSync } from 'node:fs'
import { BadRequestError } from '@/common/domain/errors/bad-request-error'

const uploadDirectory = resolve(process.cwd(), 'uploads', 'products')
mkdirSync(uploadDirectory, { recursive: true })

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']

const uploadProductImageMiddleware = multer({
  storage: multer.diskStorage({
    destination: (_request, _file, callback) => {
      callback(null, uploadDirectory)
    },
    filename: (_request, file, callback) => {
      const extension = extname(file.originalname).toLowerCase()
      callback(null, `${Date.now()}-${randomUUID()}${extension}`)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new BadRequestError('Invalid file type. Allowed formats: jpeg, png and webp'))
      return
    }

    callback(null, true)
  },
})

export { uploadProductImageMiddleware }