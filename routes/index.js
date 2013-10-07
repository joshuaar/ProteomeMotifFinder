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

//interface for protomapper
exports.protomapper=function(req,res){
	res.render("protomapper")	
}

//API for searching patterns. Returns json or fasta formatted results
//format: .../protomap?level=orgs|prots&seqs=seq1%seq2%seq3
exports.protomap=function(req,res){
	output="";
        (function(seqs,level,format){
            console.log("Query:"+seqs)
	//Get results from engine
        fastas = spawn('python',["/root/RegExDBSearch/Protmap.py","/root/ixCompress/",seqs, level])
	console.log("protomatch instance spawned")
        fastas.stdout.on("data",function(data){
	    console.log(data)
            output += data
            })
        fastas.on("close",function(code){
	    console.log(output)
	    output = output.split("__JSONSTART__")
 	    if(output.length > 1){
		console.log("output"+output[1])
		console.log("len"+output[1].length)
            	output=JSON.parse(output[1])
	    } else {
		output=JSON.parse([])
	    }
            console.log("Sending")
	    if(format=="fasta"){
		for(i in output){
			res.write(">gi|"+output[i].gi+"|"+output[i].desc+"\n")
			res.write(output[i].seq+"\n")
		}
		res.end()
	    }
            else{
		res.send(JSON.stringify(output))
	    }
            })
        })(req.query.seqs,req.query.level,req.query.format)
    

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
