pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'INZIMAM777' // Changed from placeholder to your username
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
                    echo "Building image for branch: ${env.BRANCH_NAME}"
                    sh "docker build -t ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    // Requires 'docker-hub-credentials' ID in Jenkins Credentials
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_HUB_PASSWORD', usernameVariable: 'DOCKER_HUB_USERNAME')]) {
                        sh "echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin"
                        sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Deploy the version that matches the current branch
                    def yamlFile = "k8s/${IMAGE_TAG}-deployment.yaml"
                    def serviceFile = "k8s/${IMAGE_TAG}-service.yaml"
                    
                    if (fileExists(yamlFile)) {
                        sh "kubectl apply -f ${yamlFile}"
                        sh "kubectl apply -f ${serviceFile}"
                    } else {
                        echo "No specific YAML found for ${IMAGE_TAG}, skipping K8s deploy."
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
