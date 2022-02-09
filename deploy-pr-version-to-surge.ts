import execa from 'execa'
import path from 'node:path'

async function deploy({url,buildCommand,repoPath,buildDirPath}:{
  url:string,
  buildCommand:string,
  repoPath:string
  buildDirPath:string
}):Promise<void>{
  await execa.command(buildCommand, { cwd: repoPath, stdio: 'inherit' })
  await execa.command(`mv index.html 200.html`, { cwd: buildDirPath, stdio: 'inherit' })
  await execa.command(`yarn surge --project ${buildDirPath} --domain ${url}`, {
    cwd: repoPath,
    env: {
      SURGE_LOGIN: 'stav@coti.io',
      SURGE_TOKEN: '784a5c393d8542e6bf89b2cfafbc60b6',
    },
    stdio: 'inherit',
  })
}

async function main() {
  const repoPath = __dirname
  const packageToDeploy = 'cvi-interface'
  const buildDirPath = path.join(repoPath, 'build')

  const gitBranchName = await execa.command('git symbolic-ref --short HEAD',{
    stdio: 'pipe',
    cwd: repoPath,
  }).then(r=>r.stdout)
  
  if (process.env.GITHUB_REF_NAME === 'main') {
    console.log('Deploying cvi-interface version of origin/main to surge:')
    console.log(`staging: https://${packageToDeploy}-staging.surge.sh`)
  
    await deploy({
      buildCommand:`yarn build:staging`,
      url:`${packageToDeploy}-staging.surge.sh`,
      repoPath,
      buildDirPath
    })
    return
  }


  if(!gitBranchName){
    throw new Error(`pls checkout to a branch before publishing to surge...`)
  }
  
  const formattedGitBranchName = gitBranchName.replace('/','_')

  console.log('Deploying cvi-interface version of this branch to surge:')
  console.log(`staging: https://${packageToDeploy}-staging--branch-${formattedGitBranchName}.surge.sh`)
  console.log(`production: https://${packageToDeploy}-production--branch-${formattedGitBranchName}.surge.sh`)
  

  // deploy staging version:
  await deploy({
    buildCommand:`yarn build:staging`,
    url:`${packageToDeploy}-staging--branch-${formattedGitBranchName}.surge.sh`,
    repoPath,
    buildDirPath
  })

  // deploy production version:
  await deploy({
    buildCommand:`yarn build`,
    url:`${packageToDeploy}-production--branch-${formattedGitBranchName}.surge.sh`,
    repoPath,
    buildDirPath
  })
}

if (require.main === module) {
  main()
}
