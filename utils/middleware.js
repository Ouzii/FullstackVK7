const tokenExtractor = (request, response, next) => {
    var token

    if (request.headers && request.headers.authorization) {
        var parts = request.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
    }
    request['token'] = token;
    next()

}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
    tokenExtractor,
    error
}