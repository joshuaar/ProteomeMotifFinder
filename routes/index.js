spawn = require('child_process').spawn;
exports.index = function(req,res){
	console.log("Getting Bacteria")
	spawn('bash',['shell/listBact.sh']).stdout.on('data',function(data){
		console.log("Got Bacteria")
		var orgs = data.toString().split("\n")
		res.render("index",{Organisms:orgs})
	})
}
