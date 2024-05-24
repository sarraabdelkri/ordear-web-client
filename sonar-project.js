const sonarqubeScanner = require ('sonarqube-scanner');

sonarqubeScanner({
    serverUrl : 'http://185.192.96.18:31265/',
    options : {
        'sonar.projectDescription': 'Ordear Sonar Analysis Frontend',
        'sonar.projectName':'ordear-web-client',
        'sonar.projectKey':'ordear-web-client',
        'sonar.login':'sqp_b7acb1baabaa61757bc61cd418e225fa0f6495f0',
        'sonar.projectVersion':'1.0',
        'sonar.language':'js',
        'sonar.sourceEncoding':'UTF-8',
        'sonar.sources':'.',
    }
},()=>{});
