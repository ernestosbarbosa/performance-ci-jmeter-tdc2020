# Testes de Performance em CI com JMeter

Projeto com exemplo de uso de JMeter com Docker, Jenkins e/ou Github Actions para criação e execução de testes de performance em CI.

## Estrutura de pastas

📦performance-ci-jmeter-tdc2020  
 ┣ 📂.github  
 ┃ ┣ 📂actions  
 ┃ ┃ ┗ 📂tests  
 ┃ ┃ ┃ ┣ 📜action.yml  
 ┃ ┣ 📂workflows  
 ┃ ┃ ┣ 📜run.yml  
 ┣ 📜.gitignore  
 ┣ 📜Dockerfile  
 ┣ 📜Jenkinsfile  
 ┣ 📜launch.sh  
 ┣ 📜README.md 
 ┣ 📜run.sh  
 ┗ 📜TDC_SP_2020.jmx  

## Clonando o projeto

Para ter o projeto na sua máquina é necessário clonar ele usando o comando `git clone`. Siga os seguintes passos para clonar o projeto:
1. Abra o gitbash
2. Navegue até o local onde deseja que o projete fique
3. Cole o comando `git clone projeto.git`  
  
Pronto, o projeto agora está clonado.

### Execução por linha de comando

Para executar os testes pelo terminal pode utilizar o comando:

```shell
sh run.sh
```

