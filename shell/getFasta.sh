wget --quiet ftp://ftp.ncbi.nlm.nih.gov/genomes/$1 -P ../ncbi_cache > /dev/null
#fName=$1 | awk -F"/" '{print $NF}'
fName=`echo $1|awk -F"/" '{print $NF}'`
cat ../ncbi_cache/$fName|python parseFASTA.py
