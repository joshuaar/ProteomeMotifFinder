cd ${0%/*}
./listAll.sh|python parseList.py > ../ncbi_cache/bactAndVirList.json

