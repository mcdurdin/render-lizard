#!/usr/bin/env bash
## START STANDARD SITE BUILD SCRIPT INCLUDE
readonly THIS_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
readonly BOOTSTRAP="$(dirname "$THIS_SCRIPT")/resources/bootstrap.inc.sh"
readonly BOOTSTRAP_VERSION=chore/v0.4
[ -f "$BOOTSTRAP" ] && source "$BOOTSTRAP" || source <(curl -fs https://raw.githubusercontent.com/keymanapp/shared-sites/$BOOTSTRAP_VERSION/bootstrap.inc.sh)
## END STANDARD SITE BUILD SCRIPT INCLUDE

readonly RENDER_LIZARD_CONTAINER_NAME=render-lizard-website
readonly RENDER_LIZARD_CONTAINER_DESC=render-lizard-com-app
readonly RENDER_LIZARD_IMAGE_NAME=render-lizard-website
readonly HOST_RENDER_LIZARD_COM=render-lizard.com.localhost
readonly PORT_RENDER_LIZARD_COM=8060

source _common/keyman-local-ports.inc.sh
source _common/docker.inc.sh

################################ Main script ################################

builder_describe \
  "Setup render-lizard site to run via Docker." \
  configure \
  clean \
  build \
  start \
  stop \
  test \

builder_parse "$@"

function test_docker_container() {
  # TODO: lint tests
  echo "TIER_TEST" > tier.txt
  echo "---- Testing links ----"
  set +e;
  set +o pipefail;
  npx broken-link-checker http://localhost:${PORT_RENDER_LIZARD_COM} --recursive --ordered ---host-requests 50 -e --filter-level 3 | \
    grep -E "BROKEN|Getting links from" | \
    grep -B 1 "BROKEN";

  echo "Done checking links"
  rm tier.txt
}

builder_run_action configure  bootstrap_configure
builder_run_action clean      clean_docker_container $RENDER_LIZARD_IMAGE_NAME $RENDER_LIZARD_CONTAINER_NAME
builder_run_action stop       stop_docker_container  $RENDER_LIZARD_IMAGE_NAME $RENDER_LIZARD_CONTAINER_NAME
builder_run_action build      build_docker_container $RENDER_LIZARD_IMAGE_NAME $RENDER_LIZARD_CONTAINER_NAME
builder_run_action start      start_docker_container $RENDER_LIZARD_IMAGE_NAME $RENDER_LIZARD_CONTAINER_NAME $RENDER_LIZARD_CONTAINER_DESC $HOST_RENDER_LIZARD_COM $PORT_RENDER_LIZARD_COM

builder_run_action test       test_docker_container
