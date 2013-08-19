cd ${0%/*}
ls ../ncbi_cache/OrgFastas|sed s/_/" "/g|python parseList.py > ../ncbi_cache/bactAndVirList.json

