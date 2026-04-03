const ftp = require("basic-ftp")
const path = require("path")

async function deploy() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        console.log("Connecting to FTP...")
        await client.access({
            host: "serwer2693025.home.pl",
            user: "admin@lendigo.online",
            password: "REDACTED_FTP_PASSWORD",
            secure: false
        })
        console.log("Connected successfully.")

        // Upload build output
        // Note: For Next.js to work on cPanel/home.pl, it usually requires node_modules + package.json + .next etc.
        // We will upload a minimal set of necessary files and directories
        const dirsToUpload = ["app", "components", "lib", "prisma", "public"]
        const filesToUpload = ["package.json", "package-lock.json", "next.config.mjs", "tailwind.config.ts", "tsconfig.json", "postcss.config.js"]

        const remoteDir = "/public_html" // Default root for many home.pl hostings, change as needed

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

        console.log("Upload completed successfully!")
    }
    catch (err) {
        console.log("FTP Deployment Error:", err)
    }
    client.close()
}

deploy()

