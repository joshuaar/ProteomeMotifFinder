#!/usr/bin/expect
spawn ftp ftp.ncbi.nlm.nih.gov
expect "220 FTP Server ready."
send anonymous\r
expect "331 Anonymous login ok, send your complete email address as your password"
send "\r"
expect "ftp>"
set directory [lindex $argv 0]
send "cd genomes/$directory\r"
expect "ftp>"
send "ls\r"
set result $expect_out(buffer)
puts result
expect "ftp>"
send exit
