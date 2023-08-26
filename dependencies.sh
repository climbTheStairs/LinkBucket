#!/bin/sh

# Dependencies:
# - curl
# - unzip

# TODO:
# - better documentation

# shellcheck disable=SC2086
# Hopefully they fix this soon
# <https://github.com/koalaman/shellcheck/issues/2816>

main() (
	[ -e tmp ] &&
		err 'tmp already exists; move or remove it to prevent data loss'
	mkdir tmp
	cd tmp ||
		err 'mkdir or cd tmp failed'
	while IFS= read -r ln; do
		update_ck $ln || exit
	done < ../dependencies.txt
	debug 'cleaning up if possible'
	rmdir ../tmp 2> /dev/null || true
)

err() {
	printf '%s: %s\n' "$0" "$1" >&2
	exit 1
}

debug() {
	[ -n "$debug" ] &&
		printf 'debug: %s\n' "$1" >&2
}

# update_ck <repo_name> <repo_url> <files...>
# downloads $repo_name as ZIP of master branch from $repo_url
# and compares downloaded $files with those in lib/$repo_name,
# listing all changed files.
update_ck() (
	readonly repo_name=$1 repo_url=$2; shift 2
	readonly file_zip='repo.zip'
	readonly zip_root="$repo_name-master"

	debug "downloading from repo $repo_name from <$repo_url>"
	curl -sSLo "$file_zip" -- "$repo_url" ||
		err 'failed to download repo'

	debug 'unzipping downloaded archive'
	# shellcheck disable=SC2046
	# WARNING: `unzip` does not support `--`
	unzip -oq "$file_zip" $(prepend "$zip_root/" "$@") ||
		err 'failed to extract files from downloaded repo'
	rm -- "$file_zip"

	debug 'comparing unzipped files with lib/ and printing changed files'
	for f do
		if cmp -s "../lib/$repo_name/$f" "$zip_root/$f" 2> /dev/null; then
			rm -- "$zip_root/$f"
		else
			printf %s\\n "$repo_name/$f"
		fi
	done

	find "$zip_root" -type d -exec rmdir -p {} + 2> /dev/null || true
)

# prepend <substr> <args...>
# prepends $substr to each argument in $args.
prepend() (
	readonly substr=$1; shift
	for arg do
		printf %s%s\\n "$substr" "$arg"
	done
)

test "$1" = '-s'; debug=$?
main || exit

