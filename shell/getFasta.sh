#!/bin/bash
#Gets Fasta file from NCBI Cache directory. This directory is updated 
#periodically using another process

#Change to the directory where this script is located
cd ${0%/*}      

#Take the raw arg and convert it into file name
orgName=`echo $1|sed s/" "/_/g`

#Feed the org name plus the directory information to a python script that parses
#it all to json
python parseFASTA.py ../ncbi_cache/$orgName
