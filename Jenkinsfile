pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = 'docker_hub_credentials'  // ID креденціалів у Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/alsanger/Tasty.git', branch: 'main'  // Клонування коду
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_HUB_CREDENTIALS) {
                        echo "Successfully logged in to Docker Hub"
                    }
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    sh '''
                        docker-compose build
                        docker-compose push
                    '''
                }
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker system prune -af'  // Видаляємо зайві образи
            }
        }
    }
}
