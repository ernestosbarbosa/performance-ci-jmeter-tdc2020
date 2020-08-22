//Script com exemplos utilizados na talk
node {
    stage('Run Performance Tests') {
        bzt 'TDC_SP_2020.jmx'
    }
    stage('Run Blazemeter Performance Tests') {
        blazeMeterTest credentialsId: '<credentialsId>', getJtl: true, getJunit: true, testId: '<testId>', workspaceId: '<workspaceId>'
    }
}
