var fs = require('fs')
var querystring = require('querystring');
exports.index = function(req,res){
	console.log("Getting Organism List")
    fs.readFile("ncbi_cache/bactAndVirList.json","utf-8",function(er,contents){
            res.render("index",{Organisms:JSON.parse(contents)})
            })
}

exports.orgs = function(req,res){
    console.log("Getting Fasta Files")
    reqData=""
    req.on('data',function(chunk){
        reqData+=chunk.toString()
    })
    req.on('end',function(){
        var orgObj = querystring.parse(reqData)
        var orgList = []
        for(i in orgObj){
            orgList.push(orgObj[i])
        }
        res.send(orgList)        
    })
};
