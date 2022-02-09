import execa from 'execa'

async function main() {
  const repoPath = __dirname
  
  if (process.env.GITHUB_REF_NAME === 'main') {
    console.log('Deploying cvi-interface version of origin/main to AWS S3:')
    console.log(`production: https://cvi.finance`)

    await execa.command(`deploy:production`, {
      cwd: repoPath,
      env: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
      },
      stdio: 'inherit',
    })

    return
  }
  else{
    console.log('Skipping deploying cvi-interface to AWS S3 because this branch is not origin/main.')
  }
}

if (require.main === module) {
  main()
}
