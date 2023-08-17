const request = require('supertest');
const app = require('../../index.js');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcmlhZ29tZXpAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTE2MDMzMDd9.vdkd3Eyw1UBz32xqterUJzZ9jh4kL4lQxKiRZ-2oVu8";

describe("Tests a rutas API REST", () => {
    it("POST /usuarios con datos invalidos devuelve error", async () => {
        const usuarios = {
            nombre: "nombre",
        };
        const response = await request(app).post("/usuarios").send(usuarios);
        const error = response.error;
        expect(error).toBeInstanceOf(Error);
    });

    it('POST /usuarios crea un nuevo usuario y devuelve status 200', async () => {
        const testUser = {
            email: 'test@example.com',
            nombre: 'Test',
            apellido: 'User',
            password: 'testpassword',
            direccion: 'Test Street',
            telefono: '123-456-7890',
        };
        const response = await request(app)
            .post('/usuarios')
            .send(testUser);
        const status = response.statusCode;
        expect(status).toBe(200);
    });

    it('Prueba para obtener el objeto con los datos de un usuario', async () => {
        const response = await request(app)
            .get('/usuarios')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.body).toBeInstanceOf(Object);
    })
});

describe('modificarUsuario', () => {
    it('debería modificar un usuario y devolver status 200 en caso de éxito', async () => {
        // Cambiar esto al ID válido de un usuario en tu base de datos
        const idUsuarioAModificar = 2;

        // Datos de prueba para modificar el usuario
        const datosUsuarioModificado = {
            nombre: 'NuevoNombres',
            apellido: 'NuevoApellido',
            direccion: 'NuevaDireccion',
            telefono: 'NuevoTelefono',
        };

        // Realizar la solicitud PUT para modificar el usuario
        const response = await request(app)
            .put(`/usuarios/${idUsuarioAModificar}`)
            .set('Authorization', `Bearer ${token}`) 
            .send(datosUsuarioModificado);

        // Verificar el código de estado de la respuesta
        expect(response.statusCode).toBe(200);

        // Agrega más expectativas según los datos que deseas verificar en la respuesta
        // Por ejemplo, si la respuesta tiene un mensaje específico
        expect(response.body.mensaje).toBe('Usuario modificado correctamente');
    });
});

describe('deleteUsuario', () => {
    it('debería eliminar un usuario y devolver status 200 en caso de éxito', async () => {
        // Cambiar esto al ID válido de un usuario en tu base de datos
        const idUsuarioAEliminar = 46;

        // Realizar la solicitud DELETE para eliminar el usuario
        const response = await request(app)
            .delete(`/usuarios/${idUsuarioAEliminar}`)
            .set('Authorization', `Bearer ${token}`)
        // Verificar el código de estado de la respuesta
        expect(response.statusCode).toBe(200);
        expect(response.body.mensaje).toBe('Usuario eliminado correctamente');
    });
    it("debería devolver un error al intentar eliminar un servicio con un ID no válido", async () => {
        // Preparación
        const invalidProductId = "invalid_id";

        // Realizar la solicitud DELETE con un ID no válido
        const response = await request(app)
            .delete(`/servicios/${invalidProductId}`)
            .set("Authorization", `Bearer ${token}`)
            .send();

        // Verificar el código de estado de la respuesta
        expect(response.statusCode).toBe(404); // Cambiar este valor si esperas un código de error diferente


    });

});

describe('login', () => {
    //login
    it('debería devolver un token y los datos del usuario en caso de credenciales válidas', async () => {
        // Datos de prueba
        const testUser = {
            email: 'diego@gmail.com',
            password: '1234',
        };

        // Realizar la solicitud POST de login
        const response = await request(app)
            .post('/usuarios/login')
            .set('Authorization', `Bearer ${token}`)
            .send(testUser);

        // Verificar el código de estado de la respuesta
        expect(response.statusCode).toBe(200);

        // Verificar que la respuesta tenga el token y los datos del usuario
        expect(response.body.token).toBeDefined();
        expect(response.body.usuario).toBeDefined();

        // Verificar los datos del usuario en la respuesta
        expect(response.body.usuario.email).toBe(testUser.email);

    });

    it('debería devolver un mensaje de error en caso de credenciales inválidas', async () => {
        // Datos de prueba con credenciales inválidas
        const invalidUser = {
            email: 'invalid@example.com',
            password: 'invalidpassword',
        };

        // Realizar la solicitud POST de login con credenciales inválidas
        const response = await request(app)
            .post('/usuarios/login')
            .send(invalidUser);

        // Verificar el código de estado de la respuesta
        expect(response.statusCode).toBe(404);
        // Verificar el mensaje de error en la respuesta
        expect(response.body).toBe('Usuario o contraseña incorrectos');
    });
});

/*describe('Eliminación de Servicios', () => {
    it('DELETE /servicios/:id_servicio/:id_usuario elimina un servicio y devuelve status 404', async () => {
        // Supongamos que tienes un id_servicio y un id_usuario válidos para realizar la eliminación
        const idServicioAEliminar = '1';
        const idUsuario = '2';

        const response = await request(app)
            .delete(`/servicios/${idServicioAEliminar}/${idUsuario}`)
            .set('Authorization', `Bearer ${token}`)
            .send();


        const status = response.statusCode;
        expect(status).toBe(404);
    });

});*/

describe('addServicio', () => {
    it('debería agregar un servicio y devolver status 200 en caso de éxito', async () => {

        const nuevoServicio = {
            nombre_servicio: 'Servicio de prueba',
            img_url: 'https://example.com/image.jpg',
            categoria: 'Categoría de prueba',
            descripcion: 'Descripción de prueba',
            monto: 100,
            region: 'Región de prueba',
            comuna: 'Comuna de prueba',
        };

        // Realizar la solicitud POST para agregar un servicio
        const response = await request(app)
            .post('/servicios')
            .set('Authorization', `Bearer ${token}`)
            .send(nuevoServicio);
        const status = response.statusCode;
        expect(status).toBe(200);
    });


    it('debería responder correctamente a una solicitud GET a /servicios', async () => {
        const response = await request(app).get('/servicios');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
    });
});

describe('favoritos', () => {
    it('debería obtener favoritos y devolver status 200 en caso de éxito', async () => {
        // Cambiar esto al ID válido de un usuario en tu base de datos
        const idUsuario = 3;

        // Realizar la solicitud GET para obtener favoritos
        const response = await request(app)
            .get(`/favoritos/${idUsuario}`)
            .set('Authorization', `Bearer ${token}`); // Cambiar esto al token válido para tus pruebas


        expect(response.statusCode).toBe(200);

        // Verificar que la respuesta tenga datos de favoritos
        expect(response.body).toBeDefined();

    })
});