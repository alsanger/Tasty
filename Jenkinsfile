pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "karasovvvvvv2"
    }

    stages {
        stage('Clone repo') {
            steps {
                sshagent(['github_ssh_key']) {
                    sh '''
                    rm -rf TeamPr
                    git clone git@github.com:Volodymyr189996/alsanger/TeamPr.git
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t $DOCKERHUB_USER/tasty_backend:latest ./TeamPr/backend/
                docker build -t $DOCKERHUB_USER/tasty_front



