def getGitBranchName() { 
                return scm.branches[0].name 
            }
def branchName
def targetBranch

pipeline{
    agent any
    environment {
       DOCKERHUB_USERNAME = "samarcherni"
       DEV_TAG = "${DOCKERHUB_USERNAME}/ordearwebclient:v1.0.0-dev"
       STAGING_TAG = "${DOCKERHUB_USERNAME}/ordearwebclient:v1.0.0-staging"
       PROD_TAG = "${DOCKERHUB_USERNAME}/ordearwebclient:v1.0.11-prod"
  }
     parameters {
       string(name: 'BRANCH_NAME', defaultValue: "${scm.branches[0].name}", description: 'Git branch name')
       string(name: 'CHANGE_ID', defaultValue: '', description: 'Git change ID for merge requests')
       string(name: 'CHANGE_TARGET', defaultValue: '', description: 'Git change ID for the target merge requests')
  }
    stages{

      stage('branch name') {
      steps {
        script {
          branchName = params.BRANCH_NAME
          echo "Current branch name: ${branchName}"
        }
      }
    }

    stage('target branch') {
      steps {
        script {
          targetBranch = branchName
          echo "Target branch name: ${targetBranch}"
        }
      }
    }
        stage('Git Checkout'){
            steps{
                git branch: 'main', credentialsId: 'a4035d41-d262-465f-ad06-0fc3e4fa4e01', url: 'https://github.com/ipactconsult/ordear-web-client.git'            }
        }
        
        stage('Clean Build'){
            steps{
                sh 'rm -rf node_modules'
            }
        }

        stage('Install dependencies'){
            steps{
                nodejs('nodeJSInstallationName'){
                    sh 'npm install --legacy-peer-deps'
                    sh 'npm install webpack'
                    
                }
            }
        }
	   // stage('Static Test with Sonar') {
	   //   when {
		  //   expression {
			 //   (params.CHANGE_ID != null) && ((targetBranch == 'develop') || (targetBranch == 'main') || (targetBranch == 'staging'))
		  // }
	   //   }
		  //  steps{
		  //   nodejs('nodeJSInstallationName'){
			 //    sh 'node sonar-project.js'
		  //   }
		  //  }
	   // }

 
      stage('Build Docker') {
    when {
        expression {
            (params.CHANGE_ID != null) && ((targetBranch == 'develop') || (targetBranch == 'main') || (targetBranch == 'staging'))
        }
    }
    steps {
        script {
            if (targetBranch == 'staging') {
                sh "docker build -t ${STAGING_TAG} ."
            } else if (targetBranch == 'main') {
                sh "docker build -t ${PROD_TAG} ."
            } else if (targetBranch == 'develop') {
                sh "docker build -t ${DEV_TAG} ."
            }
    }
}
      }
        
        
        stage('Docker Login'){
          when {
        expression {
          (params.CHANGE_ID != null) && ((targetBranch == 'develop') || (targetBranch == 'main') || (targetBranch == 'staging'))
        }
      }
        steps{
            withCredentials([usernamePassword(credentialsId: 'f18ff6f7-97db-4dbe-9f50-5cf7bfa5657d', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
            sh "docker login -u ${DOCKERHUB_USERNAME} -p ${DOCKERHUB_PASSWORD}"
            }
        }
        }
        stage('Docker Push'){
          when {
        expression {
          (params.CHANGE_ID != null) && ((targetBranch == 'develop') || (targetBranch == 'main') || (targetBranch == 'staging'))
        }
          }
            steps{
              sh "docker push $DOCKERHUB_USERNAME/ordearwebclient --all-tags"
            }
        }

      stage('Remove Containers') {
		when {
        expression {
          (params.CHANGE_ID != null) && ((targetBranch == 'develop') || (targetBranch == 'main') || (targetBranch == 'staging'))
        }
    }
    steps {
        sh '''
        container_ids=$(docker ps -q --filter "publish=4048/tcp")
        if [ -n "$container_ids" ]; then
            echo "Stopping and removing containers..."
            docker stop $container_ids
            docker rm $container_ids
        else
            echo "No containers found using port 4048."
        fi
        '''
    }
}

	    stage('Deploy to Prod') {
            when {
                expression { 
			(params.CHANGE_ID != null)  && (targetBranch == 'main')
		}
            }
           steps {  
		   sh "sudo ansible-playbook ansible/k8s.yml -i ansible/inventory/host.yml"
	   } 
	}

	    stage('Deploy to Dev') {
      when {
        expression {
          (params.CHANGE_ID != null) && (targetBranch == 'develop')
        }
      }
      steps {
	      sh "sudo ansible-playbook ansible/k8s.yml -i ansible/inventory/host.yml"
      }
    }

	    stage('Deploy to Staging') {
      when {
        expression {
          (params.CHANGE_ID != null) && (targetBranch == 'staging')
        }
      }
      steps {
	      sh "sudo ansible-playbook ansible/k8s.yml -i ansible/inventory/host.yml"
      }
    }
    }
}
