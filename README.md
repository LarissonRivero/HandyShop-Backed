# Handyshop: Proyecto Final Backend
### Colaboradores
* Larison Rivero
* Diego Carvajal
* Carlos Velásquez
### Instalacion
Sigue estos pasos:
* Hacer un git clone al repositorio ...
* Ábrirlo en Visual Estudio Code.
* Ejecutar el comando npm install, asi instalamos las depencenciasque necesitamos.
* Ejecutar el comando node index.js, asi levantamos el proyecto
### Descripción del Backend:
El backend de nuestra tienda es la columna vertebral de la plataforma donde los usuarios pueden publicar y descubrir una amplia gama de servicios. Esta infraestructura está construida utilizando tecnologías modernas que permiten una interacción fluida y segura entre los usuarios y la plataforma.
### Dependencias Utilizadas:
* **Express:** Utilizamos el framework de Node.js Express para gestionar las rutas y controladores de manera eficiente. Express simplifica la creación de endpoints y el manejo de solicitudes y respuestas HTTP.
* **CORS:** La dependencia CORS se utiliza para gestionar la política de mismo origen en las solicitudes entre dominios, lo que habilita la comunicación segura entre el backend y posibles clientes en diferentes orígenes.
* **pg:** Utilizamos pg como un cliente de PostgreSQL para interactuar con nuestra base de datos. Esto nos permite almacenar y recuperar información sobre los servicios y usuarios de manera confiable.
* **jsonwebtoken:** Con la ayuda de jsonwebtoken, podemos implementar la autenticación y autorización segura. Los usuarios pueden iniciar sesión de manera segura y se les proporciona un token JWT que se utiliza para acceder a recursos protegidos.
* **dotenv:** Dotenv nos permite cargar configuraciones sensibles, como credenciales de la base de datos o claves secretas, desde un archivo .env. Esto mantiene la información confidencial fuera del código fuente.
* **Jest:** Jest es un marco de pruebas que nos permite escribir y ejecutar pruebas unitarias y de integración. Esto asegura que el backend funcione como se espera en diferentes situaciones y escenarios.
* **Supertest:** Supertest se combina con Jest para realizar pruebas de API. Nos permite simular solicitudes HTTP y verificar las respuestas para garantizar que los endpoints se comporten adecuadamente.
### Descripción de los Enpoint:
* **/user:** Este endpoint permite a los usuarios registrarse en la plataforma proporcionando la información necesaria. Los detalles de usuario se almacenan en la base de datos y se utilizan para autenticar futuras solicitudes.
* **/user/login:**  Aquí, los usuarios pueden iniciar sesión proporcionando sus credenciales. Si las credenciales son válidas, se genera un token JWT que se utiliza para autenticar las solicitudes posteriores.
* **/servicios:** En este endpoint, los usuarios pueden publicar nuevos servicios. Los detalles del servicio, como su descripción y categoría, se almacenan en la base de datos para que otros usuarios puedan descubrirlos.
* **/favoritos:**  Los usuarios pueden marcar servicios como favoritos en este endpoint. Esto les permite acceder rápidamente a los servicios que les interesan desde su perfil.
### Beneficios:
En conjunto, este backend robusto y bien construido permite a los usuarios interactuar de manera segura y sin problemas con los servicios que ofrecen, brindando una experiencia excepcional en la plataforma de nuestra tienda.
