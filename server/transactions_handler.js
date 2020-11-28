const http = require("http");
const fs = require("fs");
const common_vars = require("./common_variables.json");
const token_handler = require("./token_handler.js");
const validate_info = require("./cred_validation.js");
const send_response = require("./respond_functions.js");

function transaction_info(data, res) {

    let is_valid = validate_info.validate_user_request(data.body.user_id, data.body.username, data.body.token, res);

    if (is_valid) {
        // get transaction info
        let file = __dirname + common_vars.transactionsdir;
        let content = JSON.parse(fs.readFileSync(file));
        let info = content[data.body.user_id][data.body.type].transactions;
   
        // return info
        let message = `Transaction info successful.`;
        let payload = {
            "status": "success",
            "transactions": info
        }
        send_response.respond_req(message, payload, res);

        return
    }

}


module.exports = {
    transaction_info
}