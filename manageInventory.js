"use strict";
      
var NebPay = require("nebpay");
var nebPay = new NebPay();

var serialNumber;
var intervalQuery;

$('input[name=movement]').change(function() {
    if ($(this).val() == 'inbound') {
        $('#manage-text').text('Add your inventory.');
    }
    else {
        $('#manage-text').text('Move out your inventory.');
    }
});

$('#execute_inventory').click(function() {
    $('#adding_msg').text("Adding transaction. Please refresh the page to view result.").show();

    var part_number = $('#new_request_part_number').val();
    var part_name = $('#new_request_part_name').val();
    var qty = parseInt($('#new_request_qty').val());
    var supplier = $('#new_request_supplier').val();
    var location = $('#new_request_location').val();

    var movement = $('input[name=movement]:checked').val();

    if (movement == 'outbound') {
        qty *= -1;
    }

    serialNumber = nebPay.call(contract_address, 0, "addInventory", JSON.stringify([part_number, part_name, qty, supplier, location]));

    intervalQuery = setInterval(function() {
        funcIntervalQuery();
    }, 10000);
});

function funcIntervalQuery() {
nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
    .then(function (resp) {
        var respObject = JSON.parse(resp)
        if(respObject.code === 0 && respObject.data.status == 1){
            clearInterval(intervalQuery);
            console.log('should show only once');

            var searchObj = { from: contract_address, to: contract_address,
                value: 0, nonce: 0, gasPrice: gas_price, gasLimit: gas_limit,
                contract: {function: "getInventory"}
            };
            
            neb.api.call(searchObj)
            .then(function (resp) {
                $('#adding_msg').text('Successfully added!').delay(2000).fadeOut("slow");
                var response = JSON.parse(resp.result);
                var newlyAdded = response[response.length - 1];
                
                var date = new Date(0);
                date.setUTCSeconds(newlyAdded.ts);

                var coloredRow = '<tr>';

                if (newlyAdded.qty < 0) {
                    coloredRow = '<tr class="outbound">';
                }

                $('#table-body').append(coloredRow + '<th>' + (response.length) +'</th><td>' + newlyAdded.part_number + 
                '</td><td>' + newlyAdded.part_name + 
                '</td><td>' + newlyAdded.qty + 
                '</td><td>' + newlyAdded.supplier + 
                '</td><td>' + newlyAdded.location + 
                '</td><td>' + date + '</td></tr>');
            })
            .catch(function(err) {
                $('#adding_msg').text('Encountered an error, check console for details.');
                console.log('error: ' + err.message);
            });      

        }
    })
    .catch(function (err) {
        $('#adding_msg').text('Encountered an error, check console.');
        console.log(err);
    });
}

//check if the extension is installed
//if the extension is installed, var "webExtensionWallet" will be injected in to web page
if(typeof(webExtensionWallet) === "undefined"){
    alert ("Please install the Nebulas Wallet Chrome extension in order to use this application.");
}

$(document).ready(function() {
    initSearch("getInventory", null, false);
});