cd ${0%/*}
./ncbiListFiles.sh Bacteria|grep "2 ftp"|awk '{print $9}'
