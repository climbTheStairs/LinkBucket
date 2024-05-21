#!/bin/sh
alias p='printf %s\\n'
fail() { p "$0: $1" >&2; exit 1; }
debug() { [ -n "$DEBUG" ] && p "debug: $1" >&2; }

# Dependencies:
# - curl
# - unzip

# TODO: better documentation

main() (
	mkdir tmp && cd tmp ||
		fail 'mkdir or cd tmp failed'
	while IFS= read -r ln; do
		# shellcheck disable=SC2086
		update_ck $ln || exit
	done < ../dependencies.txt
	rmdir ../tmp
)

# update_ck <repo_name> <repo_url> <files...>
# downloads $repo_name as ZIP of master branch from $repo_url
# and compares downloaded $files with those in lib/$repo_name,
# listing all changed files.
update_ck() (
	readonly repo_name="$1" repo_url="$2"; shift 2
	readonly file_zip='repo.zip'
	readonly zip_root="$repo_name-master"

	debug "downloading from repo $repo_name from <$repo_url>"
	curl -sSLo "$file_zip" -- "$repo_url" ||
		fail 'failed to download repo'

	debug 'unzipping downloaded archive'
	# shellcheck disable=SC2046
	# WARNING: `unzip` does not support `--`
	unzip -oq "$file_zip" $(prepend "$zip_root/" "$@") ||
		fail 'failed to extract files from downloaded repo'

	debug 'comparing unzipped files with lib/, applying changes, and printing changed files'
	for f do
		cmp -s -- "../lib/$repo_name/$f" "$zip_root/$f" 2> /dev/null &&
			continue
		mkdir -p "$(dirname "../lib/$repo_name/$f")" &&
			mv -f -- "$zip_root/$f" "../lib/$repo_name/$f" ||
			fail 'mkdir or mv failed; idk why'
		p "$repo_name/$f"
	done

	rm -r -- "$file_zip" "$zip_root"
)

# prepend <substr> <args...>
# prepends $substr to each argument in $args.
prepend() (
	readonly substr="$1"; shift
	for arg do
		p "$substr$arg"
	done
)

main || exit

