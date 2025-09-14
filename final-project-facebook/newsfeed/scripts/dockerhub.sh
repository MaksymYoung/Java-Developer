#!/bin/bash


# Get the current version from the user or auto-increment based on the last version
read -p "Enter the new version tag (e.g., v4): " version

if [[ -z "$version" ]]; then
    echo "No version tag provided. Exiting..."
    exit 1
fi
docker build -t newsfeed-app:latest -f ../Dockerfile ..
echo "Images have been built and tagged successfully."
# Tag the Docker image
docker tag newsfeed-app:latest multihead/newsfeedms:$version

# Push the Docker image to Docker Hub
docker push multihead/newsfeedms:$version

# Also push the latest tag
docker tag newsfeed-app:latest multihead/newsfeedms:latest
docker push multihead/newsfeedms:latest

echo "Docker image pushed with tags: $version and latest."

docker rmi multihead/newsfeedms:latest;
docker rmi multihead/newsfeedms:$version;
docker rmi newsfeed-app:latest;


