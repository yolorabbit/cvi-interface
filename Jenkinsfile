node {
  try {
    def version = null;
    def tag = null;
    def gitCommit = null;
    def imageName = null;
    def app;
    // This displays colors using the 'xterm' ansi color map.
    stage ('Checkout') {
      slackSend(message: ":male_mage:  Starting build  ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL}console)")
      checkout scm
      //sh 'env';
      def major = readFile('major_version.txt').trim()
      gitCommit = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
      tag = "${env.BRANCH_NAME}.${major}.${env.BUILD_NUMBER}.${gitCommit}"
      version = "${major}.${env.BUILD_NUMBER}"
      sh "echo VERSION = \\'${version}\\' > version.js";
      sh "echo TAG = \\'${tag}\\' >> version.js";
      sh "echo BRANCH = \\'${env.BRANCH_NAME}\\' >> version.js";
      sh "echo GIT_COMMIT = \\'${gitCommit}\\' >> version.js";

      def version_in_file = readFile 'version.js'
      echo version_in_file
    }

    stage ('Build docker image') {
      imageName = "nexus.coti.io/repository/docker/cvi-v2:${tag}"

      def cotipay_url = "https://pay-dev.coti.io";
      def coti_url = "https://dev.coti.io";
      def host = "https://api-v2.cvi.finance";
      def node_env = "development";
      def chain_id = "1337";
      def generate_sourcemap = false;
      def network_url = "https://eth-mainnet.alchemyapi.io/v2/KhQWOrbOeWZoTIkwRt4a4aXPPxx5wj5J";

      if (env.BRANCH_NAME == "master" || env.BRANCH_NAME == "master-cvi" || env.BRANCH_NAME == "master-platform" ){
        chain_id = "1";
        node_env = "production";
        host = "https://api.cvi.finance";
        cotipay_url = "https://pay.coti.io";
        coti_url = "https://coti.io";
        // network_url = "https://eth-mainnet.alchemyapi.io/v2/KhQWOrbOeWZoTIkwRt4a4aXPPxx5wj5J"
      }

      if (env.BRANCH_NAME == "staging"){
        // network_url = "https://eth-mainnet.alchemyapi.io/v2/KhQWOrbOeWZoTIkwRt4a4aXPPxx5wj5J"
        chain_id = "31337";
        node_env = "staging";
        cotipay_url = "https://pay.coti.io";
        coti_url = "https://coti.io";
        generate_sourcemap = true;
        
      }

      if(env.BRANCH_NAME == "dev-testnet") {
        // network_url = "https://eth-mainnet.alchemyapi.io/v2/KhQWOrbOeWZoTIkwRt4a4aXPPxx5wj5J"
        node_env = "dev-testnet";
        chain_id = "42";
      }

      if(env.BRANCH_NAME == "dev-platform") {
        generate_sourcemap = true;
      }
      if (env.BRANCH_NAME == "staging"){
        app = docker.build(imageName, "--build-arg REACT_APP_NETWORK_URL=${network_url} --build-arg GENERATE_SOURCEMAP=${generate_sourcemap} --build-arg REACT_APP_HOST=${host} --build-arg REACT_APP_ENVIRONMENT=${node_env} --build-arg REACT_APP_COTI_URL=${coti_url} --build-arg REACT_APP_COTIPAY_URL=${cotipay_url} --build-arg REACT_APP_CHAIN_ID=${chain_id} .")
      } else {
        return
      }
    }
    
    stage ("Test"){
        slackSend(color: 'danger', message: "Test not yet implemented")
    }
    stage ('Push Docker image') {
      docker.withRegistry('https://nexus.coti.io', 'nexus') {
        app.push()
        app.push("latest-${env.BRANCH_NAME}")
      }
    }
    stage ('Deploy') {
      if (env.BRANCH_NAME == "master"){
          // manual deploy
      }
      else if (env.BRANCH_NAME == "dev"){
         sh "~/scripts/upgrade_dev.sh ";
      }
    }
    stage ('cleanup') {
      echo 'Cleanup:';
      sh "docker rmi -f ${imageName}";
    }

    stage('notify'){
      echo "sending notification to slack";
      slackSend( message: ":racing_motorcycle: build : ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL}console)");
    }
  } catch (e) {
    slackSend(color: 'danger', message: ":dizzy_face: FAILED: ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL}console)")
    throw e
    //simple test if build works automatically
  }

}
