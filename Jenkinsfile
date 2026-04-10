pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                // Assuming the repo URL will be set up later or passed as a parameter
                echo 'Cloning repository...'
                // git 'https://github.com/your-repo.git'
            }
        }

        stage('Build Docker') {
            steps {
                sh 'docker build -t grade-app:v1 .'
            }
        }

        stage('Push Docker') {
            steps {
                // sh 'docker push yourdockerhub/grade-app:v1'
                echo 'Pushing to DockerHub...'
            }
        }
    }
}
