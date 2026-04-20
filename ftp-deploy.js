const ftp = require("basic-ftp")
const path = require("path")

async function deploy() {
    const host = process.env.FTP_HOST
    const user = process.env.FTP_USER
    const password = process.env.FTP_PASSWORD
    const remoteDir = process.env.FTP_REMOTE_DIR || "/public_html"

    if (!host || !user || !password) {
        console.error("FTP_HOST, FTP_USER, FTP_PASSWORD must be set in environment")
        process.exit(1)
    }

    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        console.log("Connecting to FTP (FTPS)...")
        await client.access({
            host,
            user,
            password,
            secure: true,
        })
        console.log("Connected successfully.")

        const dirsToUpload = ["app", "components", "lib", "prisma", "public"]
        const filesToUpload = ["package.json", "package-lock.json", "next.config.mjs", "tailwind.config.ts", "tsconfig.json", "postcss.config.js"]

        console.log(`Ensuring remote directory: ${remoteDir}`)
        await client.ensureDir(remoteDir)
        await client.clearWorkingDir()

        for (const file of filesToUpload) {
            console.log(`Uploading file: ${file}`)
            await client.uploadFrom(path.join(__dirname, file), file)
        }

        for (const dir of dirsToUpload) {
            console.log(`Uploading directory: ${dir}`)
            await client.uploadFromDir(path.join(__dirname, dir), dir)
        }

        console.log("Deployment complete.")
    } catch (err) {
        console.error("FTP deployment failed:", err)
        process.exitCode = 1
    }
    client.close()
}

deploy()
