pipeline {
    agent any
    environment {
        DOCKER_USERNAME = credentials('docker_hub_credentials').username
        DOCKER_PASSWORD = credentials('docker_hub_credentials').password
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Prepare .env file') {
            steps {
                script {
                    // Створення .env файлу з обліковими даними
                    sh '''
                        echo "DOCKER_USERNAME=${DOCKER_USERNAME}" > .env
                        echo "DOCKER_PASSWORD=${DOCKER_PASSWORD}" >> .env
                    '''
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                script {
                    // Вхід до Docker Hub
                    sh '''
                        echo "${DOCKER_PASSWORD}" | docker login -u ${DOCKER_USERNAME} --password-stdin
                    '''
                }
            }
        }
        
        stage('Build and Push Image') {
            steps {
                script {
                    // Побудова та пуш Docker образу
                    sh 'docker-compose build'
                    sh 'docker-compose push'
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                script {
                    // Видалення .env файлу після використання
                    sh 'rm -f .env'
                }
            }
        }
    }
    post {
        always {
            // Видалення .env файлу, навіть якщо пайплайн завершиться помилкою
            sh 'rm -f .env'
        }
    }
}
