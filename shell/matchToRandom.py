"""
Find out how many regex matches 
exist per 10000 proteins using random sampling
Usage:
    python randomMatches.py <regex pattern>
"""

import sys
import json
import os
import random
#Change to the directory where the script is located
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)

def stripStr(string,delim):
	return "".join(string.split(delim))

baseDir = "../ncbi_cache/OrgFastas/"

bases=0
proteins=0
direct = os.listdir(baseDir)
outList=[]
while proteins < sys.argv[2]:
    orgDir = random.choice(direct)
    directOrg = baseDir+orgDir+"/"
    fasta = random.choice(os.listdir(directOrg))
    with open(directOrg+fasta) as f:
        curFasta=f.read()
        curFasta=curFasta.replace("\r\n","\n")
        curFasta=curFasta.replace("\r","\n")
        curFasta=[i for i in curFasta.split(">") if len(i) > 0]
        for k in curFasta:#for each protein in the current fasta file
            all=k.split("\n")
            header=all[0]#.split("|")
            seq="".join(all[1:])
            outList.append(seq)
            bases += len(seq)
            proteins +=1
import re
print len([1 for i in outList if not re.search(sys.argv[1],i)==None])
print bases


