pipeline {
    agent any

    environment {
        IMAGE_NAME = "newmohib/task-manager-and-user-authentication"
        CONTAINER_NAME = "myapp"
        MYSQL_URL = credentials('MYSQL_URL')
        APP_URL = credentials('APP_URL')
        ADMIN_APP_URL = credentials('ADMIN_APP_URL')
        SMTP_HOST = credentials('SMTP_HOST')
        SMTP_USER = credentials('SMTP_USER')
        SMTP_PASS = credentials('SMTP_PASS')
        PORT = credentials('TASK_MANGE_APP_PORT')
        ADMIN_END_PORT = credentials('ADMIN_END_PORT')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'GIT_CREDENTIALS_ID', url: 'git@github.com:your-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:jenkins-1.0.1 ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'DOCKER_HUB_PASSWORD', variable: 'DOCKER_PASS')]) {
                    script {
                        sh "echo $DOCKER_PASS | docker login -u mydockerhubusername --password-stdin"
                        sh "docker tag ${IMAGE_NAME}:jenkins-1.0.1 ${IMAGE_NAME}:jenkins-1.0.1"
                        sh "docker push ${IMAGE_NAME}:jenkins-1.0.1"
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                withCredentials([
                    string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    script {
                        def _PORT = PORT ?: "8000"
                        def _ADMIN_END_PORT = ADMIN_END_PORT ?: "4000"
                        sh """
                            docker pull ${IMAGE_NAME}:jenkins-1.0.1
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                            docker run -d --name ${CONTAINER_NAME} \\
                                -e DATABASE_URL=${DATABASE_URL} \\
                                -e JWT_SECRET=${JWT_SECRET} \\
                                -p ${_PORT}:8000 \\
                                -p ${_ADMIN_END_PORT}:4000 \\
                                ${IMAGE_NAME}:jenkins-1.0.1
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful! 🚀"
        }
        failure {
            echo "Deployment failed. Check logs. ❌"
        }
    }
}
