cd ${0%/*}
./listAll.sh|sed s/_/" "/g|python parseList.py > ../ncbi_cache/bactAndVirList.json

