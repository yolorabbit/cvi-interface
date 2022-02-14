import axios from 'axios'
import execa from 'execa'
import { Octokit } from 'octokit';
import path from 'path'

const slackAxios = axios.create({
  baseURL: "https://hooks.slack.com",
  headers: {
    "Content-type": "application/json"
  }
});

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
  const buildDirPath = path.join(repoPath, 'build');

  const gitBranchName = await execa.command('git symbolic-ref --short HEAD',{
    stdio: 'pipe',
    cwd: repoPath,
  }).then(r=>r.stdout);

  if (process.env.GITHUB_REF_NAME === 'main') {
    console.log('Deploying cvi-interface version of origin/main to surge:')
    console.log(`staging: https://staging-cvi.surge.sh`)
    console.log(`silent: https://silent-cvi.surge.sh`)
  
    await deploy({
      buildCommand:`yarn build:staging`,
      url:`staging-cvi.surge.sh`,
      repoPath,
      buildDirPath
    })
    await deploy({
      buildCommand:`yarn build`,
      url:`silent-cvi.surge.sh`,
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
  console.log(`staging: https://staging-cvi-branch-${formattedGitBranchName}.surge.sh`)
  console.log(`silent: https://silent-cvi-branch-${formattedGitBranchName}.surge.sh`)
  
  // deploy staging version:
  await deploy({
    buildCommand:`yarn build:staging`,
    url:`staging-cvi-branch-${formattedGitBranchName}.surge.sh`,
    repoPath,
    buildDirPath
  })

  // deploy production version:
  await deploy({
    buildCommand:`yarn build`,
    url:`silent-cvi-branch-${formattedGitBranchName}.surge.sh`,
    repoPath,
    buildDirPath
  });

  
  let pullRequestUrl;
  const github_access_token = process.env.BOT_GITHUB_ACCESS_TOKEN; // Add your access token
 
  if(github_access_token) {
    try {
      const octokit = new Octokit({
        auth: github_access_token 
      });
      const { data } = await octokit.request("GET /repos/cotitech-io/cvi-interface/pulls?state=open&sort=updated&per_page=100");
      const { html_url, number} = data?.find((pullRequest: any) => pullRequest?.head?.ref?.includes(gitBranchName.toLowerCase())) || {};
      if(!html_url) throw new Error("Failed to find pull request");

      pullRequestUrl = html_url;

      await octokit.request(`POST /repos/cotitech-io/cvi-interface/issues/${number}/comments`, { // add a comment to pull request
        body: `\
[staging-${formattedGitBranchName}](https://staging-cvi-branch-${formattedGitBranchName}.surge.sh)\r\n
[silent-${formattedGitBranchName}](https://silent-cvi-branch-${formattedGitBranchName}.surge.sh)\r\n\
`
      });

    } catch(error) {
      console.log(error);
    }
  }

  const response = await slackAxios.post("/services/T017MPE6VM5/B032GT2LMRR/C9Zf1gzUrCdEpRwl4opN3m6R", {
    text: `
      \r\n\r\n
      =================== ${formattedGitBranchName} ===================
      CVI-interface version of this branch has been deployed to surge:\r\n
      *deploy time:* ${new Date().toLocaleString()}\r\n
      *staging:* <https://staging-cvi-branch-${formattedGitBranchName}.surge.sh>\r\n
      *silent:* <https://silent-cvi-branch-${formattedGitBranchName}.surge.sh>\r\n
      *Pull request url:* ${pullRequestUrl ? `<${pullRequestUrl}>` : 'None'}
      \r\n\r\n
    `
  });
  console.log(response.data);
}

if (require.main === module) {
  main()
}
