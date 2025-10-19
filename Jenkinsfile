pipeline {
  agent any

  environment {
    NODE_ENV = "ci"
    BASE_URL = "http://localhost:9090"
  }

  tools {
    nodejs "node18"   // name from Global Tool Config
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Start ParaBank') {
      steps {
        script {
          // Start ParaBank container only if not running
          sh '''
            echo "Starting ParaBank..."
            if ! docker ps | grep -q parabank; then
              docker run -d --name parabank -p 9090:8080 dordoka/parabank
            else
              echo "ParaBank already running."
            fi
            echo "Waiting for ParaBank to become ready..."
            sleep 60
          '''
        }
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Run Playwright tests') {
      steps {
        sh 'npx playwright test --reporter=html'
      }
    }

    stage('Publish HTML Report') {
      steps {
        publishHTML(target: [
          reportDir: 'playwright-report',
          reportFiles: 'index.html',
          reportName: 'Playwright Report',
          keepAll: true,
          alwaysLinkToLastBuild: true,
          allowMissing: false
        ])
      }
    }
  }

  post {
    always {
      echo 'Stopping ParaBank container...'
      sh 'docker stop parabank || true'
      sh 'docker rm parabank || true'
    }
  }
}
