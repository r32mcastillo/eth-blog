<div align="right">
  <img src="https://raw.githubusercontent.com/r32mcastillo/reactpractico/main/src/assets/logos/log-2.png" alt="logo" width="50" height="auto" />
</div>


<!-- About the Project -->
## :star2: Blog creado en solidity


### :bangbang: Prerrequisitos
**Ambiente de desarrollo.**
- node v16.17.0
- yarn 1.22.19

### :gear: 
**Comandos al crear el proyecto.**
```
npx create-react-app .
yarn add @web3-react/core web3-react
yarn add @web3-react/injected-connector
yarn add web3
```



**Comandos gh-pages.**
[guia-para-usar-github-pages](https://platzi.com/tutoriales/1548-react/4065-guia-para-usar-github-pages-en-tus-proyectos-de-reactjs/)
```
yarn add gh-pages -D 
yarn run predeploy 
yarn run deploy  
```
Se agrego en package.json 
```
"homepage": "https://r32mcastillo.github.io/eth-blog",
"scripts": {
    "predeploy": "yarn run build", 
    "deploy": "gh-pages -b gh-pages -d build" 
```

**Recursos.**
- [Platzi - Curso de Dapps: Introducción al Desarrollo de Aplicaciones Descentralizadas](https://platzi.com/cursos/intro-dapps/)
- [Platzi - Curso de Desarrollo Frontend de Aplicaciones Descentralizadas con Web3.Js](https://platzi.com/cursos/frontend-dapps/)
- [Platzi - Curso de Arquitectura de Aplicaciones Descentralizadas en Ethereum](https://platzi.com/cursos/arquitectura-dapps/)
- [React-toastify](https://fkhadra.github.io/react-toastify/introduction)
