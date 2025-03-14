pipeline {
    agent any
    environment {
        // Використовуємо облікові дані для Docker Hub
        DOCKER_USERNAME = credentials('docker_hub_credentials') // автоматично підтягується username
        DOCKER_PASSWORD = credentials('docker_hub_credentials') // автоматично підтягується password
    }
    stages {
        stage('Prepare .env file') {
            steps {
                script {
                    // Створення .env файлу
                    writeFile file: '.env', text: """
                    # Docker Hub credentials
                    DOCKER_USERNAME=$DOCKER_USERNAME
                    DOCKER_PASSWORD=$DOCKER_PASSWORD
                    """
                }
            }
        }
        stage('Login to Docker Hub') {
            steps {
                script {
                    // Логін в Docker Hub
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
            }
        }
        stage('Build and Push Image') {
            steps {
                script {
                    // Створення образу за допомогою Docker Compose
                    sh 'docker-compose build'

                    // Тегування і публікація образу в Docker Hub
                    sh 'docker tag your_image_name your_dockerhub_username/your_image_name:latest'
                    sh 'docker push your_dockerhub_username/your_image_name:latest'
                }
            }
        }
    }
    post {
        always {
            // Видалити .env файл після завершення
            sh 'rm -f .env'
        }
    }
}
