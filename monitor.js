var neo4j = require('neo4j-driver').v1;

function credentials(items) {
	return new Promise(function(resolve, reject) {
		var senditem = {};
		if(items.bolt && items.routing) {
			var driver = neo4j.driver(`bolt+routing://${items.ip}`, neo4j.auth.basic(items.user, items.password));
		}
		else if(items.bolt) {
			var driver = neo4j.driver(`bolt://${items.ip}`, neo4j.auth.basic(items.user, items.password));
		}
		else {
			var driver = neo4j.driver(`http://${items.ip}`, neo4j.auth.basic(items.user, items.password));
		}

		// Driver session defautl => write
		var session = driver.session();
		session.run('CALL dbms.cluster.role()')
		.then(res => {
			res.records.forEach(function (record) {
		      if(record.keys && record._fields) {
		      	senditem.clusterHealth = "Working";
		      	if(record._fields[0] == "LEADER") {
		      		senditem.clusterDefault = "Leader";
		      	}
		      }
		      else {
		      	senditem.clusterHealth = "Not working";
		      }
		    });
			session.readTransaction(tx => tx.run('CALL dbms.cluster.role()'))
			.then(res => {
				res.records.forEach(function (record) {
			      if(record.keys && record._fields) {
			      	senditem.clusterReadHealth = "Working";
			      	if(record._fields[0] == "FOLLOWER" || record._fields[0] == "READ_REPLICA") {
			      		senditem.clusteRead = "Working";
			      	}
			      	else senditem.clusteRead = "Not working";
			      }
			      else {
			      	senditem.clusterHealth1 = "Not working";
			      }
			    });
			    resolve(senditem);
			})
			.catch(err => {reject(err); return;})
		    
		})
		.catch(err => {reject(err); return; })

	});
}

module.exports = {credentials};