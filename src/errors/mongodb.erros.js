const notFoundError = (res) => {
    return res.status(404).send('Este dado não foi encntrado ')
}

const objectIdCastError = (res) => {
    return res.status(400).send('O formato do identificador fornecido é inválido.');
}



module.exports = { notFoundError, objectIdCastError }