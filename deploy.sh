#! /bin/bash

echo -n 'Username: '
read USERNAME

echo -n 'Host: '
read HOST

lftp -e "set ftp:ssl-allow off && (rm -rf ./* || echo) && mirror -R _site/ . && exit" -u $USERNAME $HOST
