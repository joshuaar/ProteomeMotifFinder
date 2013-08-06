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
exports.orgsShell = function(req,res){
    reqData="";
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
        //create session
        require("crypto").randomBytes(20,function(ex,buf){
            var sessID = buf.toString("hex");
            console.log(sessID)
            //now create the session with organism list
            sessions[sessID]={sessID:sessID,time:new Date().getTime(),orgs:orgList};
            console.log(sessions[sessID])
            //expire sessions after 1 hr
           // setTimeout(function(){
            //    delete sessions.sessID
             //   },1000*60*60)
            res.render("orgsShell",{session:sessions[sessID]});

        });
    }); 
};

exports.orgsData = function(req,res){
    //res.writeHead(200,{'Content-Type':'application/json'});
    //fuquit
    console.log("Getting Data for session: "+req.params.sessID)
    orgList = sessions[req.params.sessID].orgs;
    sendProteins(orgList,res);
};

//Go fetch the proteins from fasta files
//NCBI doesnt have a good API for this kind of thing, so we do this.
var sendProteins=function(orgList,res){
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
                res.send(JSON.stringify(parsedOutput))
            }
            })
        })(i)
    }
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
