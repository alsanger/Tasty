pipeline {
    agent any
    environment {
        IMAGE_NAME = "karasovvvvvv2/tasty"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_hub_credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                }
            }
        }

        stage('Build and Push Image') {
            steps {
                sh 'docker-compose build'
                sh 'docker-compose push'
            }
        }
    }
}
