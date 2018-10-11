#!/usr/bin/env bash

SENTRY_CLI=./node_modules/.bin/sentry-cli
VERSION=$(${SENTRY_CLI} releases propose-version)

# Create a release
${SENTRY_CLI} releases new -p redirector ${VERSION}

# Associate commits with the release
${SENTRY_CLI} releases set-commits --auto ${VERSION}