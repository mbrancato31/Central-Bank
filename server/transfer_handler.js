const http = require("http");
const fs = require("fs");
const common_vars = require("./common_variables.json");
const token_handler = require("./token_handler.js");
const validate_info = require("./cred_validation.js");
const send_response = require("./respond_functions.js");

function transfer_info(data, res) {

    let is_valid = validate_info.validate_user_request(data.body.user_id, data.body.username, data.body.token, res);
    if (is_valid) {
        // sender info
        let sender_id = data.body.user_id;
        let sender_username = data.body.username;
        let sender_token = data.body.token;
        let sender_type = data.body.type;
        let sender_amount = Number(data.body.amount);
        let sender_name;
        let sender_balance
        // receiver info
        let receiver_id;
        let receiver_type;
        let receiver_name;
        let receiver_balance
        let receiver_account = data.body.account_number;
        let receiver_routing = data.body.routing_number;
        // common info
        let current_date = token_handler.get_date().slice(0, 8);
        current_date = "".concat((Number(current_date.slice(4, 6)) + 1).toString(), "/", current_date.slice(6, 8), "/", current_date.slice(0, 4));

        // validate receivers account and routing
        let receiver_found = false;
        let file_account = __dirname + common_vars.accountdir;
        let content_account = JSON.parse(fs.readFileSync(file_account));
        for (let i = 0; i < content_account.length; i++) {
            for (let j = 0; j < 2; j++) {
                if (receiver_account == content_account[i][j].account_number &&
                    receiver_routing == content_account[i][j].routing_number) {
                    receiver_found = true;
                    receiver_id = content_account[i][j].user_id;
                    receiver_type = j;
                    receiver_balance = Number(content_account[i][j].balance);
                    break;
                }
            }
        }
        if (!receiver_found) {
            // return info: bad input
            let message = `Transfer info unsuccessful, wrong account or routing number.`;
            let payload = {
                "status": "wrong account or routing number",
            }
            send_response.respond_req(message, payload, res);
        } else {
            // validate correct amount
            sender_balance = content_account[sender_id][sender_type].balance;
            if (sender_amount < 1 || sender_amount > sender_balance) {
                let message = `Transfer info unsuccessful, amount greater than balance or smaller than 1.`;
                let payload = {
                    "status": "wrong amount",
                }
                send_response.respond_req(message, payload, res);
            } else {
                // everything correct, get rest of info
                let file_users = __dirname + common_vars.userdir;
                let content_users = JSON.parse(fs.readFileSync(file_users));
                sender_name = "".concat(content_users[sender_id].first_name, "-", content_users[sender_id].last_name);
                receiver_name = "".concat(content_users[receiver_id].first_name, "-", content_users[receiver_id].last_name);

                // console.log(sender_name, sender_balance, receiver_id, receiver_name, receiver_type, receiver_balance);

                // transfer money
                sender_balance -= sender_amount;
                receiver_balance += sender_amount;

                // create bill
                let transaction_id = Math.floor(Math.random() * 99999) + 10000;;
                // sender bill
                let sender_bill = {
                    "transaction_id": transaction_id,
                    "date": current_date,
                    "name": "Sent money to ".concat(receiver_name),
                    "amount": sender_amount,
                    "status": "complete"
                }
                // receiver bill
                let receiver_bill = {
                    "transaction_id": transaction_id,
                    "date": current_date,
                    "name": "Received money from ".concat(sender_name),
                    "amount": sender_amount,
                    "status": "complete"
                }
                // console.log(sender_bill);
                // console.log(receiver_bill);

                // update dbs
                // sender balance
                content_account[sender_id][sender_type].balance = sender_balance;
                // receiver balance
                content_account[receiver_id][receiver_type].balance = receiver_balance;

                fs.writeFileSync(file_account, JSON.stringify(content_account));
                console.log(`Database (${common_vars.accountdir}) updated successfully`);

                // transactions db
                let file_transfers = __dirname + common_vars.transactionsdir;
                let content_transfers = JSON.parse(fs.readFileSync(file_transfers));
                content_transfers[sender_id][sender_type].transactions.push(sender_bill);
                content_transfers[receiver_id][receiver_type].transactions.push(receiver_bill);
                
                fs.writeFileSync(file_transfers, JSON.stringify(content_transfers));
                console.log(`Database (${common_vars.transactionsdir}) updated successfully`);

                // respond success
                let message = `Transfer successful.`;
                let payload = {
                    "status": "success",
                    "bill": sender_bill
                }
                send_response.respond_req(message, payload, res);


            }
        }

        return
    }

}


module.exports = {
    transfer_info
}
