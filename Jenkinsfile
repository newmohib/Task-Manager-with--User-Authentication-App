pipeline {
    agent any
    tools {
        nodejs 'Nodejs-22.14.0'
    }
    environment {
        IMAGE_NAME = "newmohib/task-manager-and-user-authentication"
        CONTAINER_NAME = "task-manager-and-user-authentication"
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
        // stage('Checkout Code') {
        //     steps {
        //         git branch: 'main-jenkins', credentialsId: 'github-personal-credential-2', url: 'git@github.com:Task-Manager-with--User-Authentication-App.git.git'
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "building the docker image... ${MYSQL_URL}"
                    sh 'node -v && docker -v && docker images && docker ps -a'
                    sh "docker build -t ${IMAGE_NAME}:jenkins-1.0.1 ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId:'docker-hub-personal-credential',passwordVariable:'PASS', usernameVariable:'USER')]){
                    script {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker tag ${IMAGE_NAME}:jenkins-1.0.1 ${IMAGE_NAME}:jenkins-1.0.1"
                        sh "docker push ${IMAGE_NAME}:jenkins-1.0.1"
                    }
                }
            }
        }

        // stage('Deploy Application') {
        //     steps {
        //         // withCredentials([
        //         //     string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
        //         //     string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET'),
        //         // ]) {
        //             script {
        //                 def _PORT = PORT ?: "8000"
        //                 def _ADMIN_END_PORT = ADMIN_END_PORT ?: "4000"
        //                 sh """
        //                     docker pull ${IMAGE_NAME}:jenkins-1.0.1
        //                     docker stop ${CONTAINER_NAME} || true
        //                     docker rm ${CONTAINER_NAME} || true
        //                     docker run -d --name ${CONTAINER_NAME} \\
        //                         -e MYSQL_URL=${MYSQL_URL} \\
        //                         -e APP_URL=${APP_URL} \\
        //                         -e ADMIN_APP_URL=${ADMIN_APP_URL} \\
        //                         -e SMTP_HOST=${SMTP_HOST} \\
        //                         -e SMTP_USER=${SMTP_USER} \\
        //                         -e SMTP_PASS=${SMTP_PASS} \\
        //                         -p ${_PORT}:8000 \\
        //                         -p ${_ADMIN_END_PORT}:4000 \\
        //                         ${IMAGE_NAME}:jenkins-1.0.1
        //                 """
        //             }
        //         //}
        //     }
        // }
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
