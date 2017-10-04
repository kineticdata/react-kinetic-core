pipeline {
  agent any
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
        sh 'npm run test:ci'
        junit(testResults: 'test-report.xml', healthScaleFactor: 1)
      }
    }
  }
}