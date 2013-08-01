./ncbiListFiles.sh Bacteria/`echo $1|sed s/" "/_/g`|grep .faa|awk '{print $9}'

