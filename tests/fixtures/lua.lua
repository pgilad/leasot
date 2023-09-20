function foo()
    -- TODO: Support POST
    -- FIXME: Foobar print
    print("foobar")
    -- TODO: End function
end

function bar()
--[[ Multiline
comment
FIXME: maybe
TODO: fix this
]]
    return
end

function inlineCommentsTest()-- TODO inline comment (space: no, colon: no)
	local test = 123-- TODO: inline comment (space: no, colon: yes)
	print(test) -- TODO inline comment (space: yes, colon: no)
	return test -- TODO: inline comment (space: yes, colon: yes)
end