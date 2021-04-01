APP_ID=$1
DATA=$2

CREATOR=$(goal app info --app-id $APP_ID -d $DATA | awk '/Creator:/ {print $2}')
echo $CREATOR
APPP=$(goal account dump -a $CREATOR -d $DATA | awk '$APP_ID {print $2}')
echo $APPP

# echo $PROGRAM | base64 -d | xxd | xxd -r > program.teal.tok
# goal clerk compile -D program.teal.tok > program.teal 