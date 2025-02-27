
def installPackage(){
  echo 'installing the application...'
  sh 'node -v && npm i'
}

def testApp(){
  echo 'testing the application...'
}

def buildImage(){
  echo 'building the docker image...'
  sh 'node -v && npm i && docker -v && docker images && docker ps -a'
  sh 'docker build -t newmohib/task-manager-and-user-authentication:node-1.0.2 .'
}

def pushToDockerHub(){
  echo 'Pushing the docker image to docker hub...'
  // withCredentials([usernamePassword(credentialsId:'docker-hub-personal-credential',passwordVariable:'PASS', usernameVariable:'USER')]){
  //   sh 'echo $PASS | docker login -u $USER --password-stdin'
  //   sh 'docker push newmohib/task-manager-and-user-authentication:node-1.0.2'
  // }
}

def deployApp(){
  echo 'deploying the application...'
}

// with check

// check build iamge with git hash id into git
def buildImageWithCheckExistes(){
  echo 'building the docker image...'
  sh 'node -v && npm i && docker -v && docker images && docker ps -a'

  // Generate a unique tag using the latest Git commit hash
  def imageTag = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
  
    // Print the image tag to verify its value
  echo "Generated image tag: ${imageTag}"

  // Ensure the tag is not empty
  if (!imageTag?.trim()) {
    // error "Failed to generate a valid image tag."
    echo "Failed to generate a valid image tag."
  }
  
  env.IMAGE_TAG = imageTag

  // Build the Docker image
  sh "docker build -t newmohib/node-docker-nginx-sample-app:${imageTag} ."
}

// push image to docker hub with check exist

def pushToDockerHubWithCheckExistes(){
  echo 'Checking if the image exists on Docker Hub...'

  def imageExists = sh(script: """
    docker pull newmohib/node-docker-nginx-sample-app:\$IMAGE_TAG > /dev/null 2>&1 && echo 'exists' || echo 'not exists'
  """, returnStdout: true).trim()

  if (imageExists == 'exists') {
    echo "Image already exists on Docker Hub. Skipping push."
  } else {
    echo "Pushing the new Docker image to Docker Hub..."
    withCredentials([usernamePassword(credentialsId:'docker-hub-personal-credential', passwordVariable:'PASS', usernameVariable:'USER')]) {
      sh 'echo $PASS | docker login -u $USER --password-stdin'
      sh "docker push newmohib/node-docker-nginx-sample-app:\$IMAGE_TAG"
    }
  }
}



return this