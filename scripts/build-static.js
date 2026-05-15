#!/usr/bin/env node
// Builds a static export by temporarily hiding app/api (unsupported with output: export).
// Restores app/api in the finally block regardless of build outcome.
// Uses EncodedCommand for Windows paths with Unicode characters.
const { execSync } = require('child_process')
const os = require('os')
const fs = require('fs')
const path = require('path')

const apiDir = path.join(__dirname, '..', 'app', 'api')
const apiBak = path.join(os.tmpdir(), 'ssuew_api_bak_' + Date.now())
const isWin = process.platform === 'win32'

function psEncode(cmd) {
  return Buffer.from(cmd, 'utf16le').toString('base64')
}

function moveDir(src, dest) {
  if (isWin) {
    const cmd = `Move-Item -LiteralPath '${src}' -Destination '${dest}' -Force`
    execSync(`powershell -EncodedCommand ${psEncode(cmd)}`, { stdio: 'pipe' })
  } else {
    fs.renameSync(src, dest)
  }
}

let moved = false
try {
  if (fs.existsSync(apiDir)) {
    moveDir(apiDir, apiBak)
    moved = true
    console.log('→ app/api hidden for static export')
  }
  execSync('npm run build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_STATIC_EXPORT: 'true' },
  })
} finally {
  if (moved && fs.existsSync(apiBak)) {
    if (!fs.existsSync(apiDir)) {
      moveDir(apiBak, apiDir)
    } else {
      if (isWin) {
        const rm = `Remove-Item -LiteralPath '${apiBak}' -Recurse -Force`
        execSync(`powershell -EncodedCommand ${psEncode(rm)}`, { stdio: 'pipe' })
      } else {
        fs.rmSync(apiBak, { recursive: true, force: true })
      }
    }
    console.log('→ app/api restored')
  }
}
