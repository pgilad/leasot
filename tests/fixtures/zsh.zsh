#!/usr/bin/zsh bash
# Disable sound
setopt NO_BEEP
# glob for dotfiles as well (hidden)
setopt GLOB_DOTS

[[ -f "$HOME/.exports" ]] && source "$HOME/.exports"

###############
#  Pre setup  #
###############
# create cache dir if it doesn't exist
if [[ ! -d "$CACHE_DIR" ]]; then
    mkdir -p "$CACHE_DIR"
fi

# TODO: complete file
