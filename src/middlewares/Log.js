const middlewareGetData = async (req, res, next) => {
    try {
        const queryStrings = req.query;
        const url = req.url;
        console.log(`
    Se realizó una consulta a la base de datos
    Fecha: ${new Date().toLocaleString()}
    URL: ${url.split("?")[0]}
    queryStrings: ${JSON.stringify(queryStrings)}
    `);
        next();
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    middlewareGetData
};
