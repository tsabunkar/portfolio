CMDS := login authorizer costExplorer githubContributions
BIN_DIR := bin
GOOS := linux
GOARCH := amd64

.PHONY: all clean $(CMDS)

all: $(CMDS)

$(CMDS):
	@echo "Building $@..."
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=0 \
		go build -o $(BIN_DIR)/$@/bootstrap ./cmd/$@
	cd $(BIN_DIR)/$@ && zip -r ../../$@.zip bootstrap
	@echo "  -> $@.zip"

clean:
	rm -rf $(BIN_DIR)/* *.zip
