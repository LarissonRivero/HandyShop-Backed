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
    telefono VARCHAR(250) NOT NULL UNIQUE, -- Agregamos UNIQUE para hacer que el teléfono sea único
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
//crear tabla de compras si es que puedo comprar mas de un servicio  y quiero añadirlo en un registro de compras

CREATE TABLE IF NOT EXISTS compras (
    id_compra SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_servicio INT NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);


INSERT INTO usuarios (nombre, apellido, email, direccion, password, telefono, rol)
VALUES ('Diego', 'Carvajal', 'diego@example.com', '123 Calle Principal', 'contraseñasegura', '123456789', 'admin');
//crear 3 servicios de prueba



SELECT * FROM usuarios;
SELECT * FROM servicios;
SELECT * FROM favoritos;
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