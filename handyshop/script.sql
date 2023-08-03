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
    email VARCHAR(250) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(250) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'usuario', -- Columna de rol con valor por defecto 'usuario'
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--crear tabla de servicios
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_servicio VARCHAR(250) NOT NULL,
    img_url VARCHAR(250) NOT NULL,
    categoria VARCHAR(250) NOT NULL,
    descripcion VARCHAR(250) NOT NULL,
    monto INT NOT NULL,
    ubicacion VARCHAR(250) NOT NULL,
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


INSERT INTO servicios (id_usuario, nombre_servicio, img_url, categoria, descripcion, monto, ubicacion)
VALUES
  (1, 'Electricista', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento eléctrico', '200', 'San Miguel'),
  (2, 'Albañil', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Construcción y reparación de estructuras', '300', 'Miraflores'),
  (3, 'Aseadora de casa', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Limpieza y organización del hogar', '150', 'Surco'),
  (4, 'Plomero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento de tuberías', '250', 'San Isidro'),
  (1, 'Jardinero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Mantenimiento de jardines y áreas verdes', '180', 'Lince'),
  (3, 'Cerrajero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y cambio de cerraduras', '170', 'Barranco'),
  (2, 'Pintor', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Pintura de interiores y exteriores', '220', 'Magdalena'),
  (4, 'Reparación de electrodomésticos', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación de lavadoras, refrigeradores, etc.', '280', 'San Borja'),
  (2, 'Fontanero', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Reparación y mantenimiento de sistemas de agua', '270', 'San Miguel'),
  (3, 'Organizador de espacios', 'https://rittalnet.cl/wp-content/uploads/2022/11/que-es-un-tablero-electrico.jpg', 'Hogar', 'Optimización y organización de espacios', '190', 'La Molina');

INSERT INTO favoritos (id_servicio, id_usuario) VALUES (1, 1);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (2, 2);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (3, 3);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (4, 4);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (5, 1);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (6, 2);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (7, 3);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (8, 4);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (9, 1);
INSERT INTO favoritos (id_servicio, id_usuario) VALUES (10, 2);

DELETE FROM servicios WHERE id_servicio = 1 AND id_usuario = 1;