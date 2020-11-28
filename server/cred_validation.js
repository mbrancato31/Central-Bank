// everything associated with user validation

const http = require("http");
const fs = require("fs");
const token_handler = require("./token_handler.js");
const common_vars = require("./common_variables.json");
const bcrypt = require('bcrypt');
const send_response = require('./respond_functions.js');

function validate(data, res) {
    let file = __dirname + common_vars.credentialsdir;
    try {
        let content = fs.readFileSync(file);
        let creds = JSON.parse(content);
        let user_creds;
        user_creds = creds[data.body.username];

        if (user_creds != undefined && data.body.username == user_creds.username && bcrypt.compareSync(data.body.password, user_creds.password)) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200);
            let payload = {
                "status": "success",
                "token": create_token(user_creds, creds),
                "id": user_creds.user_id
            }
            res.end(JSON.stringify(payload));
        } else {
            console.log(`Login unsuccessful, wrong username or password.`);
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200);
            let payload = {
                "status": "failure"
            }
            res.end(JSON.stringify(payload));
        }
    } catch (err) {
        console.log(`Login unsuccessful`);
        console.log(err);
        res.writeHead(404);
        res.end();
    }

}

function create_token(user_creds, creds) {
    let token = Math.floor((Math.random() * 10000000000 - 1) + 1000000000);
    token = token.toString();
    token += (Number(token_handler.get_date()) + 2).toString();
    console.log(`Token created for ${user_creds.username}`);


    // update token in credential db
    creds[user_creds.username].token = token;
    let file = __dirname + common_vars.credentialsdir;
    fs.writeFile(file, JSON.stringify(creds), (err) => {
        if (err) {
            console.log("Error, problem in token creation");
            console.log(err);
        } else {
            console.log(`File ${common_vars.credentialsdir} written successfully, created token`);
        }
    });


    return token;
}

function validate_user_request(id, username, token, res) {
    let file_creds = __dirname + common_vars.credentialsdir;
    let content_creds = JSON.parse(fs.readFileSync(file_creds));

    // validate username
    if (content_creds[username] == undefined) {
        // return info
        let m = `Username validation unsuccessful, wrong Username.`;
        let payload = {
            "status": "wrong_username"
        }
        send_response.respond_req(m, payload, res);
        return false;
    }

    // validate token
    let token_creds = content_creds[username].token;
    if (!token_handler.token_valid(token, token_creds)) {
        let m = `Token validation unsuccessful, wrong token.`;
        let payload = {
            "status": "wrong_token"
        }
        send_response.respond_req(m, payload, res);
        return false;
    }

    // validate id
    if (id != content_creds[username].user_id) {
        let m = `Id validation unsuccessful, wrong id.`;
        let payload = {
            "status": "wrong_id"
        }
        send_response.respond_req(m, payload, res);
        return false;
    }

    return true;
}

module.exports = {
    validate,
    validate_user_request
}