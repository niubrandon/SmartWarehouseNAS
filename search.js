var is_mainnet = true;
var nebulas_chain_id, nebulas_domain; 
var gas_price = 1000000;
var gas_limit = 200000;

if(is_mainnet) {
    nebulas_chain_id = 1;
    nebulas_domain = "https://mainnet.nebulas.io";
} else {
    nebulas_chain_id = 1001;
    nebulas_domain = "https://testnet.nebulas.io";
}

// The nebulas API, used for signing transactions, etc
var nebulas = require("nebulas");
var neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(nebulas_domain));

var searchObj;

function initSearch(contractCall, searchParams, fromSearchPage) {
    var searchQty = 0;
    searchObj = { from: contract_address, to: contract_address,
        value: 0, nonce: 0, gasPrice: gas_price, gasLimit: gas_limit,
        contract: {function: contractCall, args: searchParams}
    };

    neb.api.call(searchObj)
    .then(function (resp) {
        var response = JSON.parse(resp.result);

        if (response.length == 0 && fromSearchPage) {
            $('.table').hide();
            $('#mini_title').hide();
            $('#loading_results').hide()
            $('#no_results').show();
            return;
        }

        for (var i=0; i<response.length; i++) {
            var date = new Date(0);
            date.setUTCSeconds(response[i].ts);

            var coloredRow = '<tr>';

            if (response[i].qty < 0) {
                coloredRow = '<tr class="outbound">';
            }

            if(fromSearchPage) {
                searchQty += response[i].qty;
            }
            
            $('#table-body')
            .append(
                coloredRow + '<th>' + (i+1) + '</th><td>' + response[i].part_number + 
                '</td><td>' + response[i].part_name + 
                '</td><td>' + response[i].qty + 
                '</td><td>' + response[i].supplier + 
                '</td><td>' + response[i].location + 
                '</td><td>' + date + '</td></tr>');
        }

        if (fromSearchPage) {
            $('#loading_results').hide();
            $('#balance').text('Total Quantity: ' + searchQty);

            if (searchQty < 0) {
                $('#balance').addClass('warning-qty').prepend('<i class="fas fa-exclamation-triangle"></i>');
            }
        }
    })
    .catch(function(err) {
        console.log('error: ' + err.message);
    });        
}

function searchPage() {
    if (response.length == 0) {
        $('.table').hide();
        $('#mini_title').hide();
        $('#no_results').show();
        return;
    }
}