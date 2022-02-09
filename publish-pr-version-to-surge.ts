import execa from 'execa'
import path from 'node:path'

async function main() {
  if (process.env.GITHUB_REF_NAME === 'main') {
    console.log('Skipping deploying cvi-interface to surge on branch origin/main')
    return
  }

  const repoPath = __dirname
  const packageToDeploy = 'cvi-interface'
  const buildDirPath = path.join(repoPath, 'build')

  const gitBranchName = await execa.command('git symbolic-ref --short HEAD',{
    stdio: 'pipe',
    cwd: repoPath,
  }).then(r=>r.stdout)

  if(!gitBranchName){
    throw new Error(`pls checkout to a branch before publishing to surge...`)
  }
  
  const formattedGitBranchName = gitBranchName.replace('/','_')

  console.log('Deploying cvi-interface version of this branch to surge:')
  console.log(`staging: https://${packageToDeploy}-staging--branch-${formattedGitBranchName}.surge.sh`)
  console.log(`production: https://${packageToDeploy}-production--branch-${formattedGitBranchName}.surge.sh`)
  

  // deploy staging version:
  await execa.command(`yarn build:staging`, { cwd: repoPath, stdio: 'inherit' })
  await execa.command(`mv build/index.html build/200.html`, { cwd: repoPath, stdio: 'inherit' })
  await execa.command(`yarn surge --project ${buildDirPath} --domain ${packageToDeploy}-staging--branch-${formattedGitBranchName}.surge.sh`, {
    cwd: repoPath,
    env: {
      SURGE_LOGIN: 'stav@coti.io',
      SURGE_TOKEN: '784a5c393d8542e6bf89b2cfafbc60b6',
    },
    stdio: 'inherit',
  })

  // deploy production version:
  await execa.command(`yarn build`, { cwd: repoPath, stdio: 'inherit' })
  await execa.command(`mv build/index.html build/200.html`, { cwd: repoPath, stdio: 'inherit' })
  await execa.command(`yarn surge --project ${buildDirPath} --domain ${packageToDeploy}-production--branch-${formattedGitBranchName}.surge.sh`, {
    cwd: repoPath,
    env: {
      SURGE_LOGIN: 'stav@coti.io',
      SURGE_TOKEN: '784a5c393d8542e6bf89b2cfafbc60b6',
    },
    stdio: 'inherit',
  })
}

if (require.main === module) {
  main()
}
