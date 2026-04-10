pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'inzimam777'
        APP_NAME = 'grade-app'
        IMAGE_TAG = "${env.BRANCH_NAME ?: 'latest'}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building image for version: ${IMAGE_TAG}"
                    sh "docker build -t ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
                        // Using your preferred stdin style but with secure masking
                        sh """
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u "${DOCKER_HUB_USERNAME}" --password-stdin
                        docker push "${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG}"
                        """
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def yamlFile = "k8s/${IMAGE_TAG}-deployment.yaml"
                    def serviceFile = "k8s/${IMAGE_TAG}-service.yaml"
                    
                    if (fileExists(yamlFile)) {
                        sh "kubectl apply -f ${yamlFile}"
                        sh "kubectl apply -f ${serviceFile}"
                    } else {
                        echo "Deployment file ${yamlFile} not found, skipping deploy stage."
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🎉 Successfully deployed ${APP_NAME}:${IMAGE_TAG}!"
        }
        failure {
            echo "❌ Deployment failed. Please check the logs."
        }
    }
}