pipeline {
  agent any
 
  environment {
    IMAGE_NAME = "aniruddhhhhh/rms_frontend"
    IMAGE_TAG  = "build-${BUILD_NUMBER}"
    CONTAINER  = "reactapp"
    PORT_MAP   = "80:80"
  }
 
  options {
    skipDefaultCheckout(true)
    timestamps()
  }
 
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
 
    stage('Build & Push Docker image') {
      steps {
        script {
          docker.withRegistry('', 'dockerhub-creds') {
            def img = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
            img.push()
            sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
            sh "docker push ${IMAGE_NAME}:latest"
          }
        }
      }
    }
 
    stage('Deploy on EC2') {
      steps {
        sh """
          docker rm -f ${CONTAINER} || true
          docker pull ${IMAGE_NAME}:latest
          docker run -d --name ${CONTAINER} -p ${PORT_MAP} --restart unless-stopped ${IMAGE_NAME}:latest
        """
      }
    }
  }
 
  post {
    always { cleanWs() }
  }
}