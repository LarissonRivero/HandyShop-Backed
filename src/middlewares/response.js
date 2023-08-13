const enviarRespuestaExitosa = (res, mensaje) => {
    res.status(200).json({ mensaje });
};

const enviarRespuestaError = (res, mensaje) => {
    res.status(500).json({ mensaje });
};

const enviarRespuestaNoEncontrado = (res, mensaje) => {
    res.status(404).json({ mensaje });
};

module.exports = {
    enviarRespuestaExitosa,
    enviarRespuestaError,
    enviarRespuestaNoEncontrado
};
