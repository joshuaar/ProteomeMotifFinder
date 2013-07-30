cd ${0%/*}
./ncbiListFiles.sh Viruses|grep "2 ftp"|awk '{print $9}'
