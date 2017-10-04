pipeline {
  agent {
    docker {
      image 'node'
      args 'latest'
    }
    
  }
  stages {
    stage('Prepare Environment') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
  }
}