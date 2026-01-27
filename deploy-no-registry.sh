#!/bin/bash

################################################################################
# SOL Platform - Build & Deploy Script (ohne Registry)
# Baut Docker-Image lokal, transferiert es via save/load, deployt mit Helm
################################################################################

set -e

# Configuration
IMAGE_NAME="sol-plattform"
# Generate unique tag: git-sha-timestamp or use provided argument
if [ -z "$1" ]; then
    GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    IMAGE_TAG="${GIT_SHA}-${TIMESTAMP}"
else
    IMAGE_TAG="$1"
fi
REMOTE_HOST="mc-cluster-1"
DEPLOY_NAMESPACE="sol"
HELM_CHART="./helm/sol"
TMP_IMAGE="/tmp/sol-${IMAGE_TAG}.tar.gz"
REMOTE_KUBECONFIG="/tmp/k3s-kubeconfig-${RANDOM}.yaml"

echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}"
docker build --platform linux/amd64 -t "${IMAGE_NAME}:${IMAGE_TAG}" .
echo "✓ Image built"

echo "Exporting image..."
docker save "${IMAGE_NAME}:${IMAGE_TAG}" | gzip > "${TMP_IMAGE}"
echo "✓ Image exported"

echo "Uploading image to ${REMOTE_HOST}..."
scp "${TMP_IMAGE}" "${REMOTE_HOST}:/tmp/"
echo "✓ Image uploaded"

echo "Loading image into cluster..."
ssh "${REMOTE_HOST}" "sudo k3s ctr images import /tmp/$(basename ${TMP_IMAGE})"
echo "✓ Image loaded"

echo "Fetching kubeconfig from remote..."
# Get the actual IP address that SSH resolves to
REMOTE_IP=$(ssh -G "${REMOTE_HOST}" | awk '/^hostname / {print $2}')
ssh "${REMOTE_HOST}" "sudo cat /etc/rancher/k3s/k3s.yaml" | sed "s/127.0.0.1/${REMOTE_IP}/g" > "${REMOTE_KUBECONFIG}"
echo "✓ Kubeconfig fetched (using IP: ${REMOTE_IP})"

echo "Deploying with Helm..."
KUBECONFIG="${REMOTE_KUBECONFIG}" helm upgrade sol ${HELM_CHART} \
    --install \
    --namespace ${DEPLOY_NAMESPACE} \
    --create-namespace \
    --set image.repository=${IMAGE_NAME} \
    --set image.tag=${IMAGE_TAG} \
    --set image.pullPolicy=IfNotPresent \
    --set image.buildTimestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
    --wait \
    --timeout 5m \
    --atomic
echo "✓ Deployed successfully"

echo "Cleaning up..."
rm "${TMP_IMAGE}"
rm "${REMOTE_KUBECONFIG}"
ssh "${REMOTE_HOST}" "rm /tmp/$(basename ${TMP_IMAGE})"

# Clean up old local images (keep only last 3 versions)
echo "Cleaning up old local images..."
docker images "${IMAGE_NAME}" --format "{{.Tag}}" | grep -v "^${IMAGE_TAG}$" | tail -n +4 | xargs -r -I {} docker rmi "${IMAGE_NAME}:{}" 2>/dev/null || true

# Clean up old images on remote cluster (keep only last 3 versions)
echo "Cleaning up old images on cluster..."
ssh "${REMOTE_HOST}" "sudo k3s ctr images ls -q | grep '${IMAGE_NAME}' | grep -v '${IMAGE_TAG}' | tail -n +4 | xargs -r sudo k3s ctr images rm 2>/dev/null || true"

docker image prune -f
echo "✓ Cleanup complete"

echo ""
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
echo "Remote Host: ${REMOTE_HOST}"
echo "Image:       ${IMAGE_NAME}:${IMAGE_TAG}"
echo "Namespace:   ${DEPLOY_NAMESPACE}"
echo "=========================================="
