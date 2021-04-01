echo -n $1 | base64 -d | xxd | xxd -r > program.teal.tok
goal clerk compile -D program.teal.tok > program.teal
