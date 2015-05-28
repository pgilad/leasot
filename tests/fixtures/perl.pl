#!/usr/bin/perl

#TODO: Refactor this
while (<stdin>) {
    if (/^\s*([0-9]+)/) {
 	#FIXME: fix the code below	
	$cmd = "$ARGV[0] $1 " . "$ARGV[1]";
	print STDERR "$cmd\n";
	system($cmd);
    }
}
