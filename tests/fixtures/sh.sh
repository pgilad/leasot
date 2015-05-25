#!/bin/sh
# renna: rename multiple files according to several rules
# written by felix hudson Jan - 2000

#first check for the various 'modes' that this program has
#if the first ($1) condition matches then we execute that portion of the
#program and then exit

# check for the prefix condition
if [ $1 = p ]; then

#we now get rid of the mode ($1) variable and prefix ($2)
prefix=$2 ; shift ; shift

# a quick check to see if any files were given
# if none then its better not to do anything than rename some non-existent
# files!!

if [$1 = ]; then
    echo "no files given"
    exit 0
fi

# this for loop iterates through all of the files that we gave the program
# it does one rename per file given
for file in $*
    do
    mv ${file} $prefix$file
done

# FIXME: we now exit the program
exit 0
fi
