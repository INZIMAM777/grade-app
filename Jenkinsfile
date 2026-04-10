pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        DOCKER_HUB_USER = 'inzimam777'
        APP_NAME = 'grade-app'
        // Detects version (v1, v2, v3) based on branch name automatically
        IMAGE_TAG = "${env.BRANCH_NAME ?: 'latest'}"
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
                echo "📥 Cloning repository for branch: ${IMAGE_TAG}"
                checkout scm
            }
        }

        stage('Docker Login (Fix Auth)') {
            steps {
                echo "🔐 Authenticating with DockerHub..."
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                    docker logout || true
                    echo "${PASS}" | docker login -u "${USER}" --password-stdin
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image..."
                sh "docker build -t ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                echo "🚀 Pushing branch ${IMAGE_TAG} to DockerHub..."
                sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "☸️ Deploying ${IMAGE_TAG} to Kubernetes..."
                script {
                    def deployFile = "k8s/${IMAGE_TAG}-deployment.yaml"
                    def serviceFile = "k8s/${IMAGE_TAG}-service.yaml"
                    
                    if (fileExists(deployFile)) {
                        sh "kubectl apply -f ${deployFile}"
                        sh "kubectl apply -f ${serviceFile}"
                    } else {
                        error "❌ Kubernetes YAML for ${IMAGE_TAG} not found!"
                    }
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "🔍 Verifying pods for ${IMAGE_TAG}..."
                sh "kubectl get pods -l app=grade-${IMAGE_TAG}"
            }
        }
    }

    post {
        success {
            echo "🎉 SUCCESS: ${APP_NAME}:${IMAGE_TAG} is live!"
            sh "docker logout"
        }
        failure {
            echo "❌ ERROR: Pipeline failed. Check console output."
            sh "docker logout"
        }
        always {
            echo "✅ Pipeline session finished."
        }
    }
}