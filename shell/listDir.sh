esc=$(echo $1 | sed 's/\//\\\//g')
#tosed='s/^/'$esc/g
#echo $esc
#echo $tosed
./ncbiListFiles.sh $1|grep "[0-9] ftp"|awk '{print $9}'
#|sed $tosed
