import sys
iin=""">gi|189485780|ref|YP_001956718.1| hypothetical protein TGRD_P3-1 [uncultured Termite group 1 bacterium phylotype Rs-D17]
MWNEIKTELTEKIPTIWLEPVKEESFKDDILMLNVPNRYYAEKYKTDFKELIQSVIKTKIGKDIGLQCQI
ELLPEPITKDKKPKTTSKTPLIKETKFNGKPYFESPAELTEISKEISQAKEIDVDNTKLTSMPVKYSIKD
VVSFSLLNSKMFTYPNDKRKKTKVEINIRFNNGTIKPLDLYRGQLDFNDEGYGQLTTTHAKIFLAITHIW
QKQGCKFANNSYLAVVDISIRELAKQLGYQKFSGADYKRLLRKTKELADFPMILADMYEAHTFTLLYDVS
NHKLKKSRNNKNMLRILINPFIAKQLYERKVILRNPQCYKIKNPTAIKFLICYDKRIIKGNNLRLNIFEI
ANDLEVNINNITSVAENLKNAFQELNGYELNDSYSLHVELIKENKEWIVVADRVLKEKQQSLKVNCRTDI
ECEA
>gi|189485781|ref|YP_001956719.1| hypothetical protein TGRD_P3-2 [uncultured Termite group 1 bacterium phylotype Rs-D17]
MLSLKDNKKSFFSLMCLFFLVVCGCHSAKEFRDGYITGLADGYALSVNEFKYNAELAKIKDEFDWSKVDF
KSEMKMYLDENKDIEKKVYDDYVKNGRKV
>gi|189485782|ref|YP_001956720.1| hypothetical protein TGRD_P3-3 [uncultured Termite group 1 bacterium phylotype Rs-D17]
MPTPTPPLTPASPEPASQDKLKKIALFCPPLTQLMFIYGLGLVEGAIQASLPYLFSSPTIISTLSIMFAN
MPIVGAMWFALFAYRSEVSTLSNVLDWSLPALLVFGEFLYFCGVGAVSPFSHWLWSIDPV
"""

iin = "".join([i for i in sys.stdin])

def stripStr(string,delim):
	return "".join(string.split(delim))

iin=[(i.split("\n")[0],"".join(i.split("\n")[1:])) for i in iin.split(">") if len(i) > 0]

out = []

for i in iin:
	out.append("{"+'"ID":"{0}","Seq":"{1}"'.format(i[0],i[1])+"}")

print "["+",".join(out)+"]"