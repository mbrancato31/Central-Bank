/*
 * Back-end for banking system made in NodeJS
 * Made by: Maurizio Brancato
 * Date: 09/24/2020
 * Version control in package.json
 * 
 * 
 */

const http = require("http");
const url = require("url");
const fs = require("fs");
const { parse } = require("querystring");
const validate = require("./cred_validation.js").validate;
const token_handler = require("./token_handler.js");
const dash_handler = require("./dashboard_handler.js");
const tran_handler = require("./transactions_handler.js");
const transfer_handler = require("./transfer_handler.js");

const server = http.createServer((req, res) => {
    // handle the request and send back a static file
    // from a folder called `database` inside the main folder
    // but for now until the database is ready, we will look into a fake db inside `fake_db`
    let parsedURL = url.parse(req.url, true);
    //remove the leading and trailing slashes
    let path = parsedURL.path.replace(/^\/+|\/+$/g, "");
    console.log(`Requested path ${path} `);

    let qs = parsedURL.query;
    let headers = req.headers;
    let method = req.method.toLowerCase();

    let body = '';
    req.on("data", chunk => {
        console.log("got some data");
        body += chunk.toString(); // convert buffer to string
    });
    req.on("end", function () {
        //request part is finished... we can send a response now
        body = parse(body);
        //we will use the standardized version of the path
        let route =
            typeof routes[path] !== "undefined" ? routes[path] : routes["index"];
        let data = {
            path: path,
            queryString: qs,
            headers: headers,
            method: method,
            body: body

        };
        //pass data incase we need info about the request
        //pass the response object because router is outside our scope
        route(data, res);
        console.log("send a response");
    });



});

server.listen(4000, "localhost", () => {
    console.log("Listening on port 4000");
})

let routes = {
    // index: function (data, res) {
    //     return_file(data.path + ".html", res);
    // },
    credentials: function (data, res) {
        validate(data, res);
    },
    token: function (data, res) {
        console.log(token_handler.update_token(data.body.token, data.body.username));
        res.end();
    },
    dashboardinfo: function (data, res) {
        dash_handler.dash_info(data, res);
    },
    transactionsinfo: function (data, res) {
        tran_handler.transaction_info(data, res);
    },
    transferinfo: function (data, res) {
        transfer_handler.transfer_info(data, res);
    }

};
