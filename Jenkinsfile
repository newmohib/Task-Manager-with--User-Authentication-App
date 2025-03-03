// pipeline {
//     agent any

//     stages {
//         stage('Build Docker Image') {
//             steps {
//                 script {
//                     sshagent(['aws-linux-server-2gb-ram']) {
//                         // Test SSH connection
//                         sh "ssh -o StrictHostKeyChecking=no ec2-user@18.143.98.4 'echo Connected successfully!'"
//                     }
//                 }
//             }
//         }
//     }
// }

pipeline {
    agent any
    tools {
        nodejs 'Nodejs-22.14.0'
    }

    // environment {
    //     IMAGE_NAME = "newmohib/task-manager-and-user-authentication"
    //     CONTAINER_NAME = "task-manager-and-user-authentication"
    //     MYSQL_URL = credentials('MYSQL_URL')
    //     APP_URL = credentials('APP_URL')
    //     ADMIN_APP_URL = credentials('ADMIN_APP_URL')
    //     SMTP_HOST = credentials('SMTP_HOST')
    //     SMTP_USER = credentials('SMTP_USER')
    //     SMTP_PASS = credentials('SMTP_PASS')
    //     PORT = credentials('TASK_MANGE_APP_PORT')
    //     ADMIN_END_PORT = credentials('ADMIN_END_PORT')
    // }

    stages {
        // stage('Checkout Code') {
        //     steps {
        //         git branch: 'main-jenkins', credentialsId: 'github-personal-credential-2', url: 'git@github.com:Task-Manager-with--User-Authentication-App.git.git'
        //     }
        // }

        stage('Build Docker Image') {
            steps {
                script {
                    //echo "building the docker image... ${env.MYSQL_URL}"
                    sh 'node -v && npm -v && docker -v && docker images && docker ps -a'
                    //sh "docker build -t newmohib/task-manager-and-user-authentication:jenkins-1.0.1 ."
                    sshagent(['aws-linux-server-2gb-ram']) {
                        // Test SSH connection
                        sh "ssh -o StrictHostKeyChecking=no ec2-user@18.143.98.4 'echo Connected successfully!'"
                    }
                }
            }
        }

        // stage('Push to Docker Hub') {
        //     steps {
        //         withCredentials([usernamePassword(credentialsId:'docker-hub-personal-credential',passwordVariable:'PASS', usernameVariable:'USER')]){
        //             script {
        //                 sh "echo $PASS | docker login -u $USER --password-stdin"
        //                 sh "docker tag ${env.IMAGE_NAME}:jenkins-1.0.1 ${env.IMAGE_NAME}:jenkins-1.0.1"
        //                 sh "docker push ${env.IMAGE_NAME}:jenkins-1.0.1"
        //             }
        //         }
        //     }
        // }

        // stage('Deploy Application') {
        //     steps {
        //             script {
                       
        //                 def _PORT = env.PORT ?: 8000
        //                 def _ADMIN_END_PORT = env.ADMIN_END_PORT ?: 4000
        //                 // Store the docker command in a variable
        //                 def dockerCmd = """
        //                     docker pull ${env.IMAGE_NAME}:jenkins-1.0.1
        //                     docker stop ${env.CONTAINER_NAME} || true
        //                     docker rm ${env.CONTAINER_NAME} || true
        //                     docker run -d --name ${env.CONTAINER_NAME} \\
        //                         -e MYSQL_URL=${env.MYSQL_URL} \\
        //                         -e APP_URL=${env.APP_URL} \\
        //                         -e ADMIN_APP_URL=${env.ADMIN_APP_URL} \\
        //                         -e SMTP_HOST=${env.SMTP_HOST} \\
        //                         -e SMTP_USER=${env.SMTP_USER} \\
        //                         -e SMTP_PASS=${env.SMTP_PASS} \\
        //                         -p ${_PORT}:8000 \\
        //                         -p ${_ADMIN_END_PORT}:4000 \\
        //                         ${env.IMAGE_NAME}:jenkins-1.0.1
        //                 """
        //                 // sh """
        //                 //     docker pull ${env.IMAGE_NAME}:jenkins-1.0.1
        //                 //     docker stop ${env.CONTAINER_NAME} || true
        //                 //     docker rm ${env.CONTAINER_NAME} || true
        //                 //     docker run -d --name ${env.CONTAINER_NAME} \\
        //                 //         -e MYSQL_URL=${env.MYSQL_URL} \\
        //                 //         -e APP_URL=${env.APP_URL} \\
        //                 //         -e ADMIN_APP_URL=${env.ADMIN_APP_URL} \\
        //                 //         -e SMTP_HOST=${env.SMTP_HOST} \\
        //                 //         -e SMTP_USER=${env.SMTP_USER} \\
        //                 //         -e SMTP_PASS=${env.SMTP_PASS} \\
        //                 //         -p ${_PORT}:8000 \\
        //                 //         -p ${_ADMIN_END_PORT}:4000 \\
        //                 //         ${env.IMAGE_NAME}:jenkins-1.0.1
        //                 // """

        //                 //\"${dockerCmd}\"
        //                 sshagent(['aws-linux-server-2gb-ram']) {
        //                      sh "ssh -vvv -i /path/to/private_key ec2-user@18.143.98.4"
        //                      sh "ssh -o StrictHostKeyChecking=no ec2-user@18.143.98.4"
        //                 }
        //             }
        //     }
        // }
    }
    post {
        success {
            echo "Deployment successful! 🚀"
        }
        failure {
            echo "Deployment failed. Check logs. "
        }
    }
}


