import sys
import json
import os

#Change to the directory where the script is located
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

def stripStr(string,delim):
	return "".join(string.split(delim))

baseDir = "../ncbi_cache/OrgFastas/"+sys.argv[1].replace(" ","_")+"/"
#print baseDir
fastas=os.listdir(baseDir)
outList=[]
for j in fastas:
    with open(baseDir+j) as f:
        curFasta=f.read()
        curFasta=curFasta.replace("\r\n","\n")
        curFasta=curFasta.replace("\r","\n")
        curFasta=[i for i in curFasta.split(">") if len(i) > 0]
        for k in curFasta:#for each protein in the current fasta file
            all=k.split("\n")
            header=all[0]#.split("|")
            seq="".join(all[1:])
            dictRepr = {"header":header,"seq":seq}
            outList.append(dictRepr)

#Turn fastas to json and print it to standard out.
print json.dumps(outList)





