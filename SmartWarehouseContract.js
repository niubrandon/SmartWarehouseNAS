var DecentralizedSmartWarehouseContract = function () {
  LocalContractStorage.defineProperty(this, "numTransactions");
  LocalContractStorage.defineMapProperty(this, "inventory_details");
}

DecentralizedSmartWarehouseContract.prototype = {
  init: function () {
    this.numTransactions = 0;
   },

  addInventory: function (part_number, part_name, qty, supplier, location) {
    if (Blockchain.transaction.value != 0) { // only pay the gas fee.
      throw new Error("Please enter 0.");
    }

    this.inventory_details.put(this.numTransactions, { part_number, part_name, qty, supplier, location, ts: Blockchain.transaction.timestamp });
    this.numTransactions++;
  },

  getNumTransactions: function() {
    return this.numTransactions;
  },

  getInventory: function() {
    var list = [];
    for (var i = 0; i < this.numTransactions; i++) {
      list.push(this.inventory_details.get(i));
    }

    return list;
  },

  getInventoryDesc: function() {
    var list = [];
    for (var i = this.numTransactions; i > 0; i--) {
      list.push(this.inventory_details.get(i));
    }

    return list;
  },

  getMostRecentInventory: function(n) {
    var list = [];
    for (var i = 0; i < n; i++) {
      list.push(this.inventory_details.get(i));
    }

    return list;
  },

  getMostRecentInventoryDesc: function(n) {
    var list = [];
    for (var i = n; i > 0; i--) {
      list.push(this.inventory_details.get(i));
    }

    return list;
  },

  searchInventory: function(search_term) {
    var list = [];
    for (var i = 0; i < this.numTransactions; i++) {
      var item = this.inventory_details.get(i);
      if (item.part_number == search_term) {
        list.push(item);
      }
    }

    return list;
  }
}

module.exports = DecentralizedSmartWarehouseContract
