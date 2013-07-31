import sys

input = ['"'+i.rstrip()+'"' for i in sys.stdin]

print "[{0}]".format(",".join(input))
