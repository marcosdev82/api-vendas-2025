import fs from 'node:fs'
import path from 'node:path'

const logDirectory = path.resolve(process.cwd(), 'logs')

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true })
}

export function writeLog(entry: unknown) {
  const line = `${new Date().toISOString()} ${JSON.stringify(entry)}\n`
  fs.appendFileSync(path.join(logDirectory, 'app.log'), line, 'utf8')
}
