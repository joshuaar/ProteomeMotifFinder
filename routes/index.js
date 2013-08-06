var fs = require('fs')
var spawn = require("child_process").spawn
var querystring = require('querystring');
var sessions = {}
exports.index = function(req,res){
	console.log("Getting Organism List")
    fs.readFile("ncbi_cache/bactAndVirList.json","utf-8",function(er,contents){
            res.render("index",{Organisms:JSON.parse(contents)})
            })
}

//Gets session for list of organisms
exports.getSession = function(req,res){
    var sessID = require("crypto").randomBytes(20,function(ex,buf){console.log(buf.toString("hex"))});
    console.log("Registering session "+sessID);
    reqData="";
    console.log("Getting Fasta Files")
    reqData=""
    req.on('data',function(chunk){
        reqData+=chunk.toString()
    });
    req.on('end',function(){
        var orgObj = querystring.parse(reqData)
        var orgList = []
        console.log(orgObj)
        for(i in orgObj){
            orgList.push(orgObj[i])
        }
        console.log(orgList)

        //now create the session with organism list
        sessions[sessID]={time:new Date().getTime(),orgs:orgList};
        res.send(sessions[sessID]);
    }); 
};

//Handle post request to /orgs
exports.orgs = function(req,res){
    console.log("Getting Fasta Files")
    reqData=""
    req.on('data',function(chunk){
        reqData+=chunk.toString()
    })
    req.on('end',function(){
        var orgObj = querystring.parse(reqData)
        var orgList = []
        console.log(orgObj)
        for(i in orgObj){
            orgList.push(orgObj[i])
        }
        console.log(orgList)
        input={}
        parsedOutput=[]
        nParsed=0
        for(i in orgList){
            (function(i){
             console.log("executing"+orgList[i])
            input[i]=""
            fastas = spawn('python',["shell/grabFasta.py",orgList[i]])
            fastas.stdout.on("data",function(data){
                input[i] += data
                })
            fastas.on("close",function(code){
                input[i]=JSON.parse(input[i])
                parsedOutput=parsedOutput.concat(input[i])
                nParsed += 1
                console.log(orgList[i])
                if(nParsed == orgList.length){
                    console.log("Sending")
                    res.render("orgs",{proteins:parsedOutput})
                }
                })
            })(i)
        }
    })
};
