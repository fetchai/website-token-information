#!/bin/bash

VERSION=$(git describe --always --dirty=-WIP)
docker build -t token-info-frontend:$VERSION .

while true; do
  read -p "Please choose and BUILDENV - Sandbox or Prod: " sp
  case $sp in
    [Ss]* )
    REGISTRY="gcr.io/fetch-ai-sandbox/"
    break
    ;;
    [Pp]* )
    REGISTRY="gcr.io/fetch-ai-images/"
    break
    ;;
    * ) echo "Please answer Sandbox or Prod.";;
  esac
done

docker tag token-info-frontend:$VERSION ${REGISTRY}token-info-frontend:$VERSION
docker push ${REGISTRY}token-info-frontend:$VERSION