% TODO: re-write this 
-module(module_name). 
% FIXME: something useful 
-compile(export_all).

hello() ->
  io:format("~s~n", ["Hello world!"]).
