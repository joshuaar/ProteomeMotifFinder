spawn = require('child_process').spawn;
exports.index = function(req,res){
	console.log("Getting Bacteria")
	var ps = spawn('bash',['shell/listBact.sh'])
	var orgs = []
	ps.stdout.on('data',function(data){
		console.log("Got Bacteria")
		orgs=orgs.concat(data.toString().split("\n"))
	})
	ps.on('close',function(code){
		res.render("index",{Organisms:orgs})
})
}
