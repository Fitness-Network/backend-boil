// Global Environment
switch(env.BRANCH_NAME) {
    case "cicd":
        // Secret
        env.SECRET_FILE_ID = '2f2049e1-3c8e-469e-92a1-37fde77a4b18'
        // Server
        env.SERVER_CREDENTIALS = '5e7982bd-6f22-4cb5-961d-3c18032ed467'
        env.SERVER_USERNAME = 'ubuntu'
        withCredentials([string(credentialsId: 'e70f3be8-17f1-48db-b141-51e4b3c80de8', variable: 'ADDRESS')]) {
            env.SERVER_ADDRESS = "${ADDRESS}"
        }
        env.SERVER_PATH = '/home/ubuntu/liem/cicd/tonic-backend'
        break
    // case "dev":
    case "ignore":
        // Secret
        env.SECRET_FILE_ID = 'c9249f4b-0271-437d-b3ff-792069351f26'
        // Server
        env.SERVER_CREDENTIALS = '5e7982bd-6f22-4cb5-961d-3c18032ed467'
        env.SERVER_USERNAME = 'ubuntu'
        withCredentials([string(credentialsId: 'e70f3be8-17f1-48db-b141-51e4b3c80de8', variable: 'ADDRESS')]) {
            env.SERVER_ADDRESS = "${ADDRESS}"
        }
        env.SERVER_PATH = '/home/ubuntu/dev/tonic-backend'
        break
    case "staging":
        // Secret
        env.SECRET_FILE_ID = 'a7aeb338-03ce-4617-928d-acdbaca6baee'
        // Server
        env.SERVER_CREDENTIALS = '5e7982bd-6f22-4cb5-961d-3c18032ed467'
        env.SERVER_USERNAME = 'ubuntu'
        withCredentials([string(credentialsId: 'e70f3be8-17f1-48db-b141-51e4b3c80de8', variable: 'ADDRESS')]) {
            env.SERVER_ADDRESS = "${ADDRESS}"
        }
        env.SERVER_PATH = '/home/ubuntu/staging/tonic-backend'
        break
    case "production":
        // Secret
        env.SECRET_FILE_ID = '3f365dfe-0822-4c63-8f21-d10bf68c04ee'
        // Server
        break
    default:
        break
}

pipeline {
    agent any
    environment {
        // Github
        GITHUB_URL = 'https://github.com/playgroundvina/tonic-backend.git'
        REPO_NAME = 'tonic-backend'
        GITHUB_CREDENTIAL_ID = '8c967275-cc57-45ba-809b-e04c15877539'
        // Dockerhub
        DOCKER_URL = 'https://hub.playgroundvina.com/'
        DOCKER_HUB_CREDENTIALS_ID = 'eeaa327e-4f33-4f7d-bfda-016f138a659d'
        // Telegram configuration
        TOKEN = credentials('b4a49b21-4caa-4f7a-834b-ffa7d6b9c41e')
        CHAT_ID = credentials('69503db3-8106-40c6-8bd0-876b2eb2adb7')
    }
    stages {
        stage('Notification') {
            steps {
                sh "make notify_start JOB_NAME=${env.JOB_NAME} BUILD_NUMBER=${env.BUILD_NUMBER} CHAT_ID=${env.CHAT_ID} TOKEN=${env.TOKEN}"
            }
        }
        stage('Checkout code') {
            steps {
                git branch: "${env.BRANCH_NAME}", url: "${GITHUB_URL}", credentialsId: "${GITHUB_CREDENTIAL_ID}"
            }
        }
        stage('Build & Push Docker Image') {
            steps {
                withDockerRegistry([url: "${DOCKER_URL}", credentialsId: "${DOCKER_HUB_CREDENTIALS_ID}"]) {
                    sh "make push repo_name=${env.REPO_NAME} branch_name=${env.BRANCH_NAME}"
                    sh "make clean repo_name=${env.REPO_NAME} branch_name=${env.BRANCH_NAME}"
                }
            }
        }
        stage('Deploying...') {
            when {
                anyOf {
                    branch 'cicd'
                    branch 'dev'
                    branch 'staging'
                }
            }
            steps {
                script {
                    echo "Deploying to '${env.BRANCH_NAME}'..."
                    withCredentials([file(credentialsId: env.SECRET_FILE_ID, variable: 'SECRET_FILE')]) {
                        sshagent([env.SERVER_CREDENTIALS]) {
                            def commands = """
                            cd ${env.SERVER_PATH}
                            git checkout ${env.BRANCH_NAME}
                            git pull
                            sudo make deploy repo_name=${env.REPO_NAME} branch_name=${env.BRANCH_NAME}
                            """
                            // Copy .env
                            sh "scp -o StrictHostKeyChecking=no $SECRET_FILE ${env.SERVER_USERNAME}@${env.SERVER_ADDRESS}:${env.SERVER_PATH}/.env"
                            // Start
                            sh "ssh -o StrictHostKeyChecking=no -l ${env.SERVER_USERNAME} ${env.SERVER_ADDRESS} '${commands}'"
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            script {
                def status = currentBuild.result ?: 'SUCCESS'
                sh "make notify_${status.toLowerCase()} JOB_NAME=${env.JOB_NAME} BUILD_NUMBER=${env.BUILD_NUMBER} CHAT_ID=${env.CHAT_ID} TOKEN=${env.TOKEN}"
                sh "rm -rf ./* ./.??*"
            }
        }
    }
}
