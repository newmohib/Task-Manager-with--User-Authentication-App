

pipeline {
    agent any
    tools {
        nodejs 'Nodejs-22.14.0'
    }
    stages {
        stage("init app") {
            steps {
                script {
                    echo 'Initializing application and loading script.groovy'
                    
                }
            }
        }
        stage("install package") {
            steps {
                script {
                    echo 'installing the application...'
                    sh 'node -v && npm i'
                }
            }
        }
        stage("test") {
            steps {
                script {  // Wrap inside script block
                    echo 'testing the application...'
                }
            }
        }
        stage("Build Image") {
            steps {
                script {
                    echo 'building the docker image...'
                    sh 'node -v && docker -v && docker images && docker ps -a'
                   // sh 'docker build -t newmohib/node-docker-nginx-sample-app:node-1.0.3 .'
                }
            }
        }
        stage("deploy") {
            steps {
                script {  // Wrap inside script block
                    echo 'deploying the application...'
                }
            }
        }
    }
}