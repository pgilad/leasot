REPORTERS := $(wildcard lib/reporters/*.js)

.PHONY: clean
clean:
	rm -rf docs

.PHONY: docs
docs: docs/REPORTERS.md

docs/REPORTERS.md: $(REPORTERS)
	mkdir -p $(@D)
	npx jsdoc2md --files $^ > $@
