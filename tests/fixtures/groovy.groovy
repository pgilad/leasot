import jenkins.model.*

pipeline {
    /*
        FIXME: Assign a real agent
    */
    agent any
    options {
        timeout(time: 1, unit: 'SECONDS')
    }
    stages {
        stage('Example') {
            steps {
                echo 'Hello World' // TODO: Add some real code
            }
        }
    }
}
