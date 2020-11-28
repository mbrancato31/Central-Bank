

function respond_req(log, payload, res) {
    console.log(log);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.end(JSON.stringify(payload));
    return
}

module.exports = {
    respond_req
}