#!/bin/bash
SRCD="/home/"
TGTD="/var/backups/"
OF=home-$(date +%Y%m%d).tgz
# TODO: wrap variables in quotes
tar -cZf $TGTD$OF $SRCD
