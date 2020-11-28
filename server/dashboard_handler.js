const http = require("http");
const fs = require("fs");
const common_vars = require("./common_variables.json");
const token_handler = require("./token_handler.js");
const validate_info = require("./cred_validation.js");
const send_response = require("./respond_functions.js");

function dash_info(data, res) {

    let is_valid = validate_info.validate_user_request(data.body.user_id, data.body.username, data.body.token, res);

    if (is_valid) {
        // get user name
        let file_users = __dirname + common_vars.userdir;
        let content_users = JSON.parse(fs.readFileSync(file_users));
        let user_info = content_users[data.body.user_id];
        // get accounts
        let file_accounts = __dirname + common_vars.accountdir;
        let content_accounts = JSON.parse(fs.readFileSync(file_accounts));
        let accounts_info = content_accounts[data.body.user_id];
        // return info
        let message = `Dash info successful.`;
        let payload = {
            "status": "success",
            "user_info": user_info,
            "accounts_info": accounts_info
        }
        send_response.respond_req(message, payload, res);

        return
    }

}


module.exports = {
    dash_info
}