#!/usr/bin/env bash
#
# The tests. Node and one dependency, fetched here the first time and never
# committed: jsdom, which is what makes it possible to mount a fake edit page
# — toolbar, contenteditable, reference boxes and all — and drive the script
# through it with real clicks and real keys.
#
#   ./tools/test/run.sh
#
# Nothing here touches the network. The one answer from radiopaedia.work is a
# saved one, `cite-23079405.html`, so the citation parser is tested against the
# real thing rather than against a hand-written idea of it.
#
set -euo pipefail
cd "$(dirname "$0")"

SCRIPT="${SCRIPT:-$(cd ../.. && pwd)/radiopaedia-cite.user.js}"
export SCRIPT

node --check "$SCRIPT"

if [ ! -d node_modules/jsdom ]; then
  echo "· fetching jsdom (once)"
  npm install --silent --no-audit --no-fund --no-package-lock jsdom
fi

status=0
for test in *.test.js; do
  echo
  echo "— $test"
  node "./$test" || status=1
done
echo
[ $status -eq 0 ] && echo "all good" || echo "something failed"
exit $status
