#!/bin/bash

# Generate JWT key pairs for API and Admin services separately
# This script creates separate RSA key pairs for enhanced security

echo "🔐 Generating separate JWT RSA key pairs for API and Admin services..."

# Create keys directory if it doesn't exist
mkdir -p keys

# Generate API JWT keys (2048-bit RSA)
echo "📝 Generating API JWT keys..."
openssl genrsa -out jwt-api-private.pem 2048
openssl rsa -in jwt-api-private.pem -pubout -out jwt-api-public.pem

# Generate Admin JWT keys (2048-bit RSA)
echo "📝 Generating Admin JWT keys..."
openssl genrsa -out jwt-admin-private.pem 2048
openssl rsa -in jwt-admin-private.pem -pubout -out jwt-admin-public.pem

# Set appropriate permissions
chmod 600 jwt-*-private.pem
chmod 644 jwt-*-public.pem

echo "✅ JWT key pairs generated successfully!"
echo ""
echo "📁 Generated files:"
echo "  - jwt-api-private.pem (API private key)"
echo "  - jwt-api-public.pem (API public key)"
echo "  - jwt-admin-private.pem (Admin private key)"
echo "  - jwt-admin-public.pem (Admin public key)"
echo ""
echo "🔒 Security Notes:"
echo "  - Private keys have restricted permissions (600)"
echo "  - Keep private keys secure and never commit to version control"
echo "  - Use different keys for production environments"
echo "  - Consider using key management services for production"
echo ""
echo "🔧 Next steps:"
echo "  - Update your .env file with the new key paths"
echo "  - Restart your application to use the new keys"