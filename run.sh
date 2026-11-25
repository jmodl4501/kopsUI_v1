#!/usr/bin/env sh
set -eu
set -a
cd "$(dirname "$0")"
if [ -f /etc/egovframe/portal.env ]; then
    . /etc/egovframe/portal.env
fi
exec java ${JAVA_OPTS:--Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC} -jar target/egov-portal-1.0.0.jar
