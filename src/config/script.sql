// crear base de datos HandyShop
DROP DATABASE HandyShop;
CREATE DATABASE HandyShop;
\c HandyShop;

--borrar todas las tablas
DROP TABLE IF EXISTS favoritos;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS usuarios;



-- crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(250) NOT NULL,
    apellido VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE, -- Agregamos UNIQUE para hacer que el email sea único
    direccion VARCHAR(250) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(250) NOT NULL , -- Agregamos UNIQUE para hacer que el teléfono sea único
    rol VARCHAR(50) NOT NULL DEFAULT 'usuario',
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


--crear tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_servicio VARCHAR(250) NOT NULL,
    img_url VARCHAR(250) NOT NULL,
    categoria VARCHAR(250) NOT NULL,
    descripcion TEXT NOT NULL,
    monto INT NOT NULL,
    region VARCHAR(250) NOT NULL,
    comuna VARCHAR(250) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

--crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT,
    id_servicio INT,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
);
--crear tabla de compras si es que puedo comprar mas de un servicio  y quiero añadirlo en un registro de compras

CREATE TABLE compras (
  id_compra SERIAL PRIMARY KEY,
  id_usuario INT NOT NULL,
  fecha_compra TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--Tabla de compra_servicio relación muchos a muchos:

CREATE TABLE compra_servicio (
  id_compra INT,
  id_servicio INT,
  PRIMARY KEY (id_compra, id_servicio),
  FOREIGN KEY (id_compra) REFERENCES compras (id_compra) ON DELETE CASCADE,
  FOREIGN KEY (id_servicio) REFERENCES servicios (id_servicio) ON DELETE CASCADE
);

INSERT INTO usuarios (nombre, apellido, email, direccion, password, telefono, rol)
VALUES ('Diego', 'Carvajal', 'diego@example.com', '123 Calle Principal', 'contraseñasegura', '123456789', 'admin');
//crear 3 servicios de prueba




show tables;

{
        "nombre": "Diego",
        "apellido": "Carvajal",
        "email": "diego@gmail.com",
        "direccion": "Av. Siempre Viva 123",
        "password": "1234",
        "telefono": "912345678",
        "rol": "admin"
},
{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juanperez@example.com",
    "direccion": "Calle 123, Ciudad A",
    "password": "clave123",
    "telefono": "555-1234"
  },
  {
    "nombre": "María",
    "apellido": "Gómez",
    "email": "mariagomez@example.com",
    "direccion": "Avenida XYZ, Ciudad B",
    "password": "contraseña456",
    "telefono": "555-5678"
  },
  {
    "nombre": "Carlos",
    "apellido": "Rodríguez",
    "email": "carlosr@example.com",
    "direccion": "Calle ABC, Ciudad C",
    "password": "abc123xyz",
    "telefono": "555-9876"
  },
  {
    "nombre": "Laura",
    "apellido": "López",
    "email": "lauralopez@example.com",
    "direccion": "Avenida 456, Ciudad D",
    "password": "pass123",
    "telefono": "555-1111"
  },

SELECT * FROM usuarios;
SELECT * FROM servicios;
SELECT * FROM favoritos;
SELECT * FROM compras;
SELECT * FROM compra_servicio;

delete  from servicios;

INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (1, 'Electricista', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento eléctrico', '20000', 'Metropolitana', 'Santiago');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(3, 'Albañil', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Construcción y reparación de estructuras', '30000', 'Metropolitana', 'Cerrillos');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(3, 'Aseadora de casa', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Limpieza y organización del hogar', '15000', 'Metropolitana', 'Cerro Navia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(4, 'Plomero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento de tuberías', '25000', 'Metropolitana', 'Conchalí');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(1, 'Jardinero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Mantenimiento de jardines y áreas verdes', '18000', 'Metropolitana', 'El Bosque');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(3, 'Cerrajero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y cambio de cerraduras', '17000', 'Metropolitana', 'Estación Central');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(1, 'Pintor', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Pintura de interiores y exteriores', '22000', 'Metropolitana', 'Huechuraba');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(4, 'Reparación de electrodomésticos', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación de lavadoras, refrigeradores, etc.', '28000', 'Metropolitana', 'Independencia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(5, 'Fontanero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento de sistemas de agua', '27000', 'Metropolitana', 'La Cisterna');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(3, 'Organizador de espacios', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Optimización y organización de espacios', '19000', 'Metropolitana', 'La Florida');

INSERT INTO favoritos (id_servicio, id_usuario) VALUES (11, 1);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (14, 5);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (15, 3);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (14, 4);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (15, 1);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (16, 5);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (17, 3);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (18, 4);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (19, 1);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (20, 5);

DELETE FROM servicios WHERE id_servicio = 1 AND id_usuario = 1;


SELECT * from servicios;
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (1, 'Electricistista', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento eléctrico', '20000', 'Metropolitana', 'Santiago');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(2, 'Albañil', 'https://agusgarama.com/wp-content/uploads/2022/05/las-herramientas-de-trabajo-habituales-de-un-albanil-en-san-sebastian-scaled.jpeg', 'Hogar', 'Construcción y reparación de estructuras', '30000', 'Metropolitana', 'Cerrillos');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(3, 'Aseadora de casa', 'https://cloudfront-us-east-1.images.arcpublishing.com/semana/L3HRNR2OENEFRN5XJURSC7PEDA.jpg', 'Hogar', 'Limpieza y organización del hogar', '15000', 'Metropolitana', 'Cerro Navia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(4, 'Plomero', 'https://homesolution.net/blog/wp-content/uploads/2019/02/plomero_a_domicilio_teusaquillo_bogota_colombia.jpg', 'Hogar', 'Reparación y mantenimiento de tuberías', '25000', 'Metropolitana', 'Conchalí');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(5, 'Jardinero', 'https://cursos.com/wp-content/uploads/2020/12/funciones-de-un-jardinero.jpg', 'Hogar', 'Mantenimiento de jardines y áreas verdes', '18000', 'Metropolitana', 'El Bosque');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(1, 'Cerrajero', 'https://funcionactiva.com/imagenes/funciones-de-un-cerrajero.jpg', 'Hogar', 'Reparación y cambio de cerraduras', '17000', 'Metropolitana', 'Estación Central');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(2, 'Pintor', 'https://pinturashipopotamo.es/wp-content/uploads/2020/01/como-elegir-un-buen-pintor.jpg', 'Hogar', 'Pintura de interiores y exteriores', '22000', 'Metropolitana', 'Huechuraba');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(3, 'Reparación de electrodomésticos', 'https://funcionactiva.com/imagenes/que-y-donde-estudiar-reparacion-de-electrodomesticos-.jpg', 'Mano de Obra', 'Reparación de lavadoras, refrigeradores, etc.', '28000', 'Metropolitana', 'Independencia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(4, 'Fontanero', 'https://calderasgascalefaccionzaragoza.com/wp-content/uploads/2022/05/fontanero-profesional.jpg', 'Hogar', 'Reparación y mantenimiento de sistemas de agua', '27000', 'Metropolitana', 'La Cisterna');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES(5, 'Organizador de espacios', 'https://www.cesae.es/images/articulos/que-es-lo-que-hace-un-organizador-de-eventos2.jpg', 'Otros', 'Optimización y organización de espacios', '19000', 'Metropolitana', 'La Florida');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (1, 'Estilista', 'https://iprarm.cl/wp-content/uploads/2022/01/cabello-1160x675-1.png', 'Cuidado Personal', 'Servicios de corte y estilismo de cabello', '25000', 'Metropolitana', 'Providencia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (2, 'Paseador de Animales', 'https://kamouflage.dog/img/cms/paseadores%20de%20perros%202.png', 'Otros', 'Paseos y cuidados para mascotas', '15000', 'Valparaíso', 'Viña del Mar');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (3, 'Mecánico', 'https://www.mhochschild.cl/images/uploads/mecanico.jpg', 'Industrial', 'Reparación y mantenimiento de vehículos', '35000', 'Metropolitana', 'Maipú');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (4, 'Gasfiter', 'https://www.construccionescastro.cl/imagenes/reparacion-de-claefont.jpg', 'Mano de obra', 'Reparaciones y soluciones de plomería', '28000', 'Metropolitana', 'Ñuñoa');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (5, 'Limpiador de Piscina', 'https://www.somosfalabella.com/wp-content/uploads/2022/01/Hero-mobile-46.jpg', 'Industrial', 'Limpieza y mantenimiento de piscinas', '22000', 'Valparaíso', 'Quilpué');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (1, 'Peluquero Canino', 'https://cursos.com/wp-content/uploads/2023/06/como-ser-peluquero-canino.jpg', 'Otros', 'Corte y cuidado de mascotas', '18000', 'Metropolitana', 'Las Condes');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (2, 'Entrenador Personal', 'https://images.hola.com/imagenes/estar-bien/20200205159628/errores-que-evita-entrenador-personal/0-777-664/errores-entrenador-personal-t.jpg', 'Cuidado personal', 'Entrenamiento personalizado y asesoría fitness', '30000', 'Metropolitana', 'Vitacura');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (3, 'Cocinero Personal', 'https://noticiasdecruceros.com/wp-content/uploads/2019/05/Personal-de-Cocina-1-CX.jpg', 'Cuidado personal', 'Elaboración de comidas a medida', '25000', 'Metropolitana', 'La Reina');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (4, 'Sastre', 'https://s3.ppllstatics.com/elcomercio/www/multimedia/201904/08/media/cortadas/1414524828-kkSE--984x608@El%20Comercio.jpg', 'Cuidado personal', 'Confección y ajuste de prendas de vestir', '18000', 'Metropolitana', 'Providencia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (5, 'Conserje', 'https://media.sitioandino.com.ar/p/6052237c08b901226c39d26c317d98ea/adjuntos/335/imagenes/000/639/0000639440/790x0/smart/martin-rodriguez-conciergejpg.jpg', 'Hogar', 'Gestión de edificios y seguridad', '22000', 'Metropolitana', 'Ñuñoa');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (1, 'Escolta Personal', 'https://www.novaseguridad.com.co/wp-content/uploads/2020/07/escolta-de-personas-y-mercanc%C3%ADa.jpg', 'Otros', 'Acompañamiento y protección personal', '35000', 'Metropolitana', 'Las Condes');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (2, 'Profesor Particular', 'https://www.ceupe.com/images/easyblog_articles/3966/profesor-universitario.jpg', 'Otros', 'Clases particulares y asesorías', '20000', 'Metropolitana', 'La Florida');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (3, 'Fotógrafo', 'https://www.ucreativa.com/wp-content/uploads/fotografia-blog-ucreativa.jpg', 'Mano de obra', 'Sesiones fotográficas y edición de imágenes', '25000', 'Metropolitana', 'La Reina');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (4, 'Diseñador Gráfico', 'https://www.lifeder.com/wp-content/uploads/2022/11/Que-hace-un-disenador-grafico.jpg', 'Mano de obra', 'Diseño de logos, afiches, etc.', '30000', 'Metropolitana', 'Vitacura');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (5, 'Enfermera', 'https://www.medicosatudomicilio.cl/imagenes/servicios/enfermera-paciente.jpg', 'Cuidado personal', 'Cuidados y asistencia médica', '35000', 'Metropolitana', 'Maipú');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (1, 'Chofer', 'https://chofermadridplus.com/wp-content/uploads/chofera-chofer-choferes.jpg', 'Transporte', 'Traslados y viajes', '25000', 'Metropolitana', 'Providencia');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (2, 'Guardia de Seguridad', 'https://www.segurilatam.com/wp-content/uploads/sites/5/2023/03/guardia-de-seguridad-chile.jpg', 'Otros', 'Vigilancia y protección de bienes', '30000', 'Metropolitana', 'Ñuñoa');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (3, 'Masajista', 'https://www.cimformacion.com/blog/wp-content/uploads/2020/09/ser-masajista-profesional.jpg', 'Cuidado personal', 'Masajes de relajación y descontracturantes', '20000', 'Metropolitana', 'Las Condes');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (4, 'Carpintero', 'https://ecohabitar.org/wp-content/uploads/2019/12/original.jpg', 'Mano de obra', 'Fabricación y reparación de muebles', '25000', 'Metropolitana', 'La Reina');
INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, region, comuna)
VALUES (5, 'Tattoo Artist', 'https://rollandfeel.smokingpaper.com/wp-content/uploads/2021/08/mejores-tatuadores-chile.jpg', 'Otros', 'Diseño y realización de tatuajes', '30000', 'Metropolitana', 'Vitacura');