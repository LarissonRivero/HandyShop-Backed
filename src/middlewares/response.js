const enviarRespuestaExitosa = (res, mensaje) => {
    res.status(200).json({ mensaje });
};

const enviarRespuestaError = (res, mensaje, estado = 500) => {
    res.status(estado).json({ mensaje });
};

const enviarRespuestaNoEncontrado = (res, mensaje) => {
    enviarRespuestaError(res, mensaje, 404);
};

module.exports = {
    enviarRespuestaExitosa,
    enviarRespuestaError,
    enviarRespuestaNoEncontrado
};
