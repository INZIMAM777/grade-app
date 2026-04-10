pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        DOCKER_HUB_USER = 'inzimam777'
        APP_NAME = 'grade-app'
        IMAGE_TAG = 'v3'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                echo "📥 Cloning repository..."
                sh '''
                git clone -b v3 https://github.com/INZIMAM777/grade-app.git .
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh """
                docker build -t ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo "🚀 Pushing image to DockerHub..."
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo "$PASS" | docker login -u "$USER" --password-stdin
                    docker push inzimam777/grade-app:v3
                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "☸️ Deploying to Kubernetes..."

                sh '''
                if [ -f k8s/v3-deployment.yaml ]; then
                    kubectl apply -f k8s/v3-deployment.yaml
                    kubectl apply -f k8s/v3-service.yaml
                else
                    echo "❌ Kubernetes YAML not found!"
                    exit 1
                fi
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔍 Verifying deployment..."

                sh '''
                kubectl get pods
                kubectl get services
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 SUCCESS: ${APP_NAME}:${IMAGE_TAG} deployed!"
        }
        failure {
            echo "❌ ERROR: Pipeline failed. Check logs."
        }
        always {
            echo "✅ Pipeline finished."
        }
    }
}