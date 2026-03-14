# Getting Started (Local and Azure Dev)

> Enterprise development environment setup for the Datacom Agent Library — local and Azure UAT workflows, multi-VNet connectivity, and Well-Architected Framework compliance.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061763856

---

## 🎯 Context

This guide provides comprehensive instructions for setting up the **Datacom Agent Library** development environment with enterprise-grade network connectivity and Well-Architected Framework compliance. The system demonstrates production-ready serverless architecture patterns that serve as a template for future enterprise projects.

The guide targets developers — both new and experienced — joining the Insights & Analytics team. It covers **local development** (running all three apps on localhost) and **enterprise Azure development** (connecting to the live UAT environment). Some setup steps require Azure network access or CLI permissions beyond standard developer onboarding.

---

## 🔍 Problem

Setting up a development environment for an enterprise serverless system with private network connectivity is significantly more complex than a standard web project. Developers must configure Azure AD authentication, connect to databases accessible only via VNet peering or private endpoints, and manage CORS and JWT bypass settings correctly — all before writing a single line of feature code.

---

## 📋 Observations

**1. Multi-Application Architecture**

Three concurrent applications must run simultaneously: API on port 7071 (Azure Functions), Client App on port 5174 (Vite), and Admin App on port 3000 (Vite). The command `npm run dev:all` starts all three.

**2. Dual Database Strategy**

MongoDB is used for personal/private data via VNet peering (172.21.0.0/16 ↔ 172.19.0.0/16). CosmosDB is used for public/shared data via private endpoint with private connectivity only.

**3. Prerequisites Stack**

Prerequisites include Node.js 18+, npm 10+, Azure Functions Core Tools v4, Azure CLI, Git, VS Code with Azure extensions, MongoDB Compass, Postman, and jq for JSON processing in health checks.

**4. Environment Configuration**

Environment configuration requires copying three example files (`env.dev.example`, `local.settings.example.json`) and populating Azure AD tenant/client IDs and database credentials from the EAS team.

**5. MongoDB Connectivity**

MongoDB is accessible only via VNet peering (private IP). Local developers either connect via Azure VPN/Bastion or run a local Docker MongoDB instance for development.

**6. CosmosDB Connectivity**

CosmosDB is only accessible via private endpoint. Local development against UAT CosmosDB requires VNet connectivity; a Windows-only CosmosDB emulator is the alternative.

**7. JWT Bypass for Local Development**

JWT validation can be bypassed locally via `BYPASS_JWT_VALIDATION=true` in `local.settings.json` — this must never be enabled in production.

**8. Azure Permissions Required**

Key Azure permissions required: Contributor, Network Contributor, Private DNS Zone Contributor, and Key Vault Contributor on the relevant resource groups.

**9. Health Monitoring**

A health check script and `watch` command are documented for monitoring API response time and database connectivity during development.

**10. Expected Health Response**

The health endpoint returns status OK with MongoDB and CosmosDB connected and response time around 12ms when fully operational.

---

## 💡 Proposal

The guide establishes a **tiered development approach**: developers can work entirely locally with Docker-based databases and JWT bypass for rapid iteration, or connect directly to the UAT environment for integration testing against live data and real Azure AD authentication. The comprehensive troubleshooting section (VNet peering verification, CORS configuration, JWT validation errors, CosmosDB DNS resolution) is designed to unblock common setup failures without requiring team support.

---

## ⚠️ Risks

**Local JWT bypass** Local development with `BYPASS_JWT_VALIDATION=true` means authentication bugs will only surface when testing against UAT, increasing the risk of auth regressions reaching integration environments.

**Docker MongoDB data model drift** The Docker MongoDB option is disconnected from the UAT data model and migration state, meaning locally developed features may behave differently against the real database schema.

**VPN/Bastion access barrier** Requiring VPN/Bastion for full-fidelity development creates an access barrier for contractors or remote developers without corporate network access.

**Elevated Azure permissions** Azure CLI permissions (Network Contributor, Private DNS Zone Contributor) are elevated and may not be available to all developers, blocking some setup verification steps.

---

## ✅ Next Steps

1. **Obtain Azure AD credentials** — Request app registration details from the EAS team before starting environment setup.
2. **Request network access** — Request Azure VPN or Bastion access if full UAT database connectivity is required.
3. **Run health check** — Execute the provided health check script (`dev-health-check.sh`) to validate the full stack before beginning feature work.
4. **Review architecture docs** — Read `02-architecture.md` and `04-authentication.md` to understand the system before making changes.
5. **Verify resource groups** — Confirm access to `rg-datacom-agent-library-uat` and `datacomchat-uat-rg-eastaus2`.

---

## 🔑 Close

> The most critical setup step is correctly configuring Azure AD credentials and database connectivity — once the health check reports MongoDB and CosmosDB as connected and response time at ~12ms, the development environment is fully operational.

This development environment demonstrates enterprise-grade serverless architecture patterns with 8.5/10 Well-Architected Framework compliance, suitable for production deployment and replication across new enterprise projects.

---

## 🛠️ What You'll Build

A complete enterprise serverless application featuring:

- **Multi-VNet network architecture** with secure VNet peering
- **Dual database connectivity** (MongoDB via VNet peering + CosmosDB via private endpoints)
- **Azure Well-Architected Framework compliance** (8.5/10 score)
- **Enterprise security patterns** with private endpoints and HTTPS-only communication
- **Production monitoring** with comprehensive health checks and Application Insights

---

## 📦 Prerequisites — Core Requirements

- **Node.js**: Version 18.x or higher (`node --version`)
- **npm**: Version 10.x or higher (`npm --version`)
- **Git**: Latest version for version control
- **Azure Functions Core Tools**: Version 4.x (`func --version`)
- **Azure CLI**: Required for enterprise deployment (`az --version`)

---

## 📦 Prerequisites — Enterprise Tools

- **Visual Studio Code**: Recommended IDE with Azure extensions
- **Azure CLI**: For resource management and deployment
- **MongoDB Compass**: For database management and monitoring
- **Postman**: For API testing with enterprise authentication
- **jq**: For JSON processing in health checks (`brew install jq`)

---

## 📦 Prerequisites — Azure Extensions for VS Code

```bash
# Install essential Azure extensions
code --install-extension ms-azuretools.vscode-azurefunctions
code --install-extension ms-azuretools.vscode-azureappservice
code --install-extension ms-vscode.azure-cli-tools
code --install-extension ms-vscode.vscode-json
```

---

## 📦 Prerequisites — System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 10GB free disk space
- **Network**: Stable internet connection for package downloads

---

## 📦 Prerequisites — Azure Account Setup

- **Azure Subscription**: Active subscription with WAF compliance capabilities
- **Azure AD Tenant**: Access to Datacom Azure AD tenant for authentication
- **Required Permissions**: Contributor access to resource groups; Network Contributor for VNet peering; Private DNS Zone Contributor for private endpoint DNS; Key Vault Contributor for secret management

**Required Resource Groups:**

- UAT Environment: `rg-datacom-agent-library-uat`
- MongoDB Environment: `datacomchat-uat-rg-eastaus2`
- Production Environment: `rg-datacom-agent-library-prod` (future)

**Network Prerequisites:**

- Function App VNet: `datacom-agent-library-uat-vnet-eastus2` (172.21.0.0/16)
- MongoDB VNet: `datacomchat-uat-mongodb-vm-linux-vnet` (172.19.0.0/16)
- VNet Peering: Configured for secure database connectivity

---

## 🚀 Installation — Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd datacom-agent-library

# Verify the structure
ls -la
```

Expected directory structure:

```
datacom-agent-library/
├── client-app/          # User-facing application
├── admin-app/           # Admin application
├── api/                 # Azure Functions backend
├── shared/              # Shared components
├── docs/                # Documentation
├── scripts/             # Utility scripts
└── README.md           # Project overview
```

---

## 🚀 Installation — Step 2: Install Dependencies

**Option A: Install All (Recommended)**

```bash
# Install all dependencies across all applications
npm run install:all
```

**Option B: Install Individually**

```bash
# Install root dependencies
npm install

# Install client app dependencies
cd client-app
npm install
cd ..

# Install admin app dependencies
cd admin-app
npm install
cd ..

# Install API dependencies
cd api
npm install
cd ..

# Install shared package dependencies
cd shared
npm install
cd ..
```

---

## 🚀 Installation — Step 3: Environment Configuration

**Create environment files from enterprise templates:**

```bash
cd client-app && cp env.dev.example .env.local && cd ..
cd admin-app && cp env.dev.example .env.local && cd ..
cd api && cp local.settings.example.json local.settings.json && cd ..
```

---

## 🚀 Installation — Enterprise Network Connectivity Check

```bash
# Verify Azure CLI authentication
az account show --query '{subscriptionId:id, tenantId:tenantId, name:name}'

# Check access to UAT resource groups
az group list --query "[?contains(name, 'datacom-agent-library')].{Name:name, Location:location}" --output table

# Verify VNet connectivity status
az network vnet peering list \
  --resource-group "rg-datacom-agent-library-uat" \
  --vnet-name "datacom-agent-library-uat-vnet-eastus2" \
  --query "[].{Name:name, PeeringState:peeringState, RemoteVNet:remoteVirtualNetwork.id}" \
  --output table
```

---

## 🚀 Installation — Configure Azure AD (Client App)

**Client App** (`client-app/.env.local`):

```bash
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_API_SCOPE=api://your-client-id/access_as_user

# API Configuration
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=

# Development Settings
VITE_DEBUG=true
VITE_ENVIRONMENT=development
```

---

## 🚀 Installation — Configure Azure AD (Admin App)

**Admin App** (`admin-app/.env.local`):

```bash
# Azure AD Configuration
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_API_SCOPE=api://your-client-id/access_as_user

# API Configuration
VITE_API_BASE_URL=/api
VITE_BACKEND_URL=

# Development Settings
VITE_DEBUG=true
VITE_ENVIRONMENT=development
```

---

## 🚀 Installation — Configure API (local.settings.json)

**API** (`api/local.settings.json`):

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",

    "AZURE_AD_TENANT_ID": "your-datacom-tenant-id",
    "AZURE_AD_CLIENT_ID": "your-client-id",

    "MONGODB_URI": "mongodb://10.0.0.5:27017/DatacomChat",
    "MONGODB_DATABASE_NAME": "DatacomChat",

    "COSMOS_DB_ENDPOINT": "https://datacom-agent-library-cosmos-uat.documents.azure.com:443/",
    "COSMOS_DB_KEY": "your-cosmos-db-key",
    "COSMOS_DB_DATABASE_NAME": "DatacomAgentLibraryDev",

    "AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING": "your-connection-string",

    "JWT_ISSUER": "https://login.microsoftonline.com/your-tenant-id/v2.0",
    "JWT_AUDIENCE": "api://your-client-id/access_as_user",

    "BYPASS_JWT_VALIDATION": "true",
    "DEBUG": "true"
  },
  "Host": {
    "CORS": "*",
    "CORSCredentials": true
  }
}
```

---

## 🔌 Enterprise Connection Patterns

**MongoDB (via VNet Peering):** Uses private IP within VNet peered network. Connection secured through NSG rules (port 27017). No public internet connectivity required.

**CosmosDB (via Private Endpoint):** Uses private endpoint DNS resolution. All traffic stays within Azure backbone. Public network access disabled for security.

---

## 🗄️ Database — MongoDB Setup (VNet Peering)

**Current UAT Configuration:**

- VM: `datacomchat-uat-mongodb-vm-linux-eastus2`
- Resource Group: `datacomchat-uat-rg-eastaus2`
- VNet: `datacomchat-uat-mongodb-vm-linux-vnet` (172.19.0.0/16)
- Connection: Private IP via VNet peering

```bash
# Verify MongoDB VNet peering status
az network vnet peering show \
  --resource-group "rg-datacom-agent-library-uat" \
  --vnet-name "datacom-agent-library-uat-vnet-eastus2" \
  --name "peer-to-mongodb-vnet" \
  --query '{PeeringState:peeringState, RemoteVNet:remoteVirtualNetwork.id}'

# Test MongoDB connectivity (requires VNet connection)
mongosh "mongodb://mongodb-private-ip:27017/DatacomChat" --eval "db.adminCommand('ping')"
```

---

## 🗄️ Database — CosmosDB Setup (Private Endpoint)

**Current UAT Configuration:**

- Account: `datacom-agent-library-cosmos-uat`
- Private Endpoint: `pe-datacom-agent-library-cosmos-uat`
- DNS Zone: `privatelink.documents.azure.com`
- Public Access: Disabled

```bash
# Verify CosmosDB private endpoint
az network private-endpoint show \
  --resource-group "rg-datacom-agent-library-uat" \
  --name "pe-datacom-agent-library-cosmos-uat" \
  --query '{State:provisioningState, PrivateIP:customDnsConfigurations[0].ipAddresses[0]}'

# Check private DNS resolution
nslookup datacom-agent-library-cosmos-uat.documents.azure.com
```

---

## 🗄️ Database — Local Development Options

**Option A: Connect to UAT Databases (Recommended for Enterprise)**

Requires Azure VPN or Azure Bastion for VNet access. MongoDB connects through VNet peering; CosmosDB connects through private endpoint.

**Option B: Local MongoDB for Development**

```bash
docker run -d --name mongodb-dev \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=dev \
  -e MONGO_INITDB_ROOT_PASSWORD=devpass123 \
  mongo:6.0
```

**CosmosDB Emulator:** Windows only — download from Microsoft docs.

---

## ✅ Verification — Core Tools

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 10.x or higher

# Check Azure Functions Core Tools
func --version  # Should be 4.x

# Check Azure CLI version and authentication
az version
az account show --query '{subscription:name, tenant:tenantId}'
```

---

## ✅ Verification — Network and Health

```bash
# Test Azure resource access
az group list --query "[?contains(name, 'datacom')].name" --output table

# Verify Function App status
az functionapp show \
  --name "datacom-agent-library-fa-uat" \
  --resource-group "rg-datacom-agent-library-uat" \
  --query '{State:state, DefaultHostName:defaultHostName}'

# Test API health endpoint
curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq '{status, services}'

# Full system health check
curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq '{
  status,
  services: {mongodb: .services.mongodb.connected, cosmosdb: .services.cosmosdb.connected},
  network: {responseTime: .responseTime}
}'
```

---

## ✅ Verification — Expected Health Response

```json
{
  "status": "OK",
  "services": {
    "mongodb": true,
    "cosmosdb": true
  },
  "network": {
    "responseTime": 12
  }
}
```

---

## 🏃 Running — Start All Applications

```bash
# Start all applications with a single command
npm run dev:all
```

This starts:

- **API**: http://localhost:7071 (Azure Functions runtime)
- **Client App**: http://localhost:5174 (Vite dev server)
- **Admin App**: http://localhost:3000 (Vite dev server)

---

## 🏃 Running — Start Individually

**Terminal 1 — API Backend:**

```bash
cd api
func start --cors * --port 7071
```

**Terminal 2 — Client App:**

```bash
cd client-app
npm run dev
```

**Terminal 3 — Admin App:**

```bash
cd admin-app
npm run dev
```

---

## 🏃 Running — Connect to UAT Environment

```bash
# Configure development to use UAT backend
export UAT_FUNCTION_APP="https://datacom-agent-library-fa-uat.azurewebsites.net"

# Test UAT connectivity
curl -s "$UAT_FUNCTION_APP/api/health" | jq '{status, environment: .environment, responseTime}'
```

**Manual configuration:** Update `VITE_BACKEND_URL` in `client-app/.env.dev` and `admin-app/.env.dev` to the Function App URL, then run `npm run dev:azure` in each app.

---

## 💻 VS Code — Enterprise Extensions Pack

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-azuretools.vscode-azurefunctions",
    "ms-azuretools.vscode-azureappservice",
    "ms-azuretools.vscode-azureresourcegroups",
    "ms-azuretools.vscode-cosmosdb",
    "mongodb.mongodb-vscode",
    "ms-vscode.azure-cli-tools",
    "ms-vscode.vscode-json",
    "ms-vscode.rest-client",
    "humao.rest-client"
  ]
}
```

---

## 💻 VS Code — Workspace Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

---

## 💻 VS Code — Debugging Configuration

**Client App (Chrome):**

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome against localhost",
  "url": "http://localhost:5174",
  "webRoot": "${workspaceFolder}/client-app/src"
}
```

**API (Attach to Azure Functions):**

```bash
cd api
func start --cors * --port 7071 --inspect
```

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Azure Functions",
  "port": 9229,
  "restart": true
}
```

---

## 🧪 Testing

```bash
# Test all applications
npm run test:all

# Test individual applications
cd client-app && npm test
cd admin-app && npm test
cd api && npm test
cd shared && npm test
```

**Test environment configuration:**

```bash
cd client-app && cp env.test.example .env.test && cd ..
cd admin-app && cp env.test.example .env.test && cd ..
cd api && cp .env.test.example .env.test && cd ..
```

---

## 🔧 Troubleshooting — MongoDB Connection

**Check VNet peering status:**

```bash
az network vnet peering list \
  --resource-group "rg-datacom-agent-library-uat" \
  --vnet-name "datacom-agent-library-uat-vnet-eastus2" \
  --query "[].{Name:name, State:peeringState, Connected:peeringState=='Connected'}" \
  --output table
```

**Test MongoDB VM connectivity:**

```bash
nc -zv 10.0.0.5 27017  # Replace with actual MongoDB private IP
```

**Check NSG rules:**

```bash
az network nsg rule list \
  --resource-group "datacomchat-uat-rg-eastaus2" \
  --nsg-name "datacomchat-uat-mongodb-vm-linux-nsg" \
  --query "[?destinationPortRange=='27017'].{Name:name, Access:access, Priority:priority}"
```

---

## 🔧 Troubleshooting — CosmosDB Private Endpoint

```bash
# Check private endpoint status
az network private-endpoint show \
  --resource-group "rg-datacom-agent-library-uat" \
  --name "pe-datacom-agent-library-cosmos-uat" \
  --query '{State:provisioningState, CustomDNS:customDnsConfigurations[0]}'

# Test private DNS resolution
nslookup datacom-agent-library-cosmos-uat.documents.azure.com

# Verify CosmosDB public access is disabled
az cosmosdb show \
  --name "datacom-agent-library-cosmos-uat" \
  --resource-group "rg-datacom-agent-library-uat" \
  --query '{PublicNetworkAccess:publicNetworkAccess, PrivateEndpoints:privateEndpointConnections[].id}'

# Test private endpoint connectivity
telnet datacom-agent-library-cosmos-uat.documents.azure.com 443

# Check private DNS zone configuration
az network private-dns zone show \
  --resource-group "rg-datacom-agent-library-uat" \
  --name "privatelink.documents.azure.com" \
  --query '{Name:name, RecordSets:numberOfRecordSets}'
```

---

## 🔧 Troubleshooting — Port Conflicts

```bash
# Check what's using the port
lsof -i :7071  # For API
lsof -i :5174  # For client app
lsof -i :3000  # For admin app

# Kill the process
kill -9 <PID>

# Alternative ports for development
export PORT=7072  # For Azure Functions
export VITE_DEV_PORT=5175  # For Vite dev server
```

---

## 🔧 Troubleshooting — CORS Configuration

```bash
# Check CORS configuration in Azure Functions
az functionapp cors show \
  --name "datacom-agent-library-fa-uat" \
  --resource-group "rg-datacom-agent-library-uat"

# Add allowed origins
az functionapp cors add \
  --name "datacom-agent-library-fa-uat" \
  --resource-group "rg-datacom-agent-library-uat" \
  --allowed-origins "http://localhost:5174" "http://localhost:3000"
```

**Update `api/host.json` for local development:**

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  },
  "cors": {
    "allowedOrigins": [
      "http://localhost:5174",
      "http://localhost:3000",
      "https://datacom-agent-library-fa-uat.azurewebsites.net"
    ],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization", "x-ms-request-id"]
  }
}
```

---

## 🔧 Troubleshooting — JWT and Azure AD

**Check Azure AD app registration:**

```bash
az ad app show --id your-client-id --query '{DisplayName:displayName, AppId:appId}'
az ad app show --id your-client-id --query 'web.redirectUris'
az ad app permission list --id your-client-id --query '[].{Resource:resourceDisplayName, Permission:scope}'
```

**Development authentication config** (in `api/local.settings.json`):

```json
{
  "Values": {
    "AZURE_AD_TENANT_ID": "your-datacom-tenant-id",
    "AZURE_AD_CLIENT_ID": "your-client-id",
    "JWT_ISSUER": "https://login.microsoftonline.com/your-tenant-id/v2.0",
    "JWT_AUDIENCE": "api://your-client-id/access_as_user",
    "BYPASS_JWT_VALIDATION": "true"
  }
}
```

**Azure AD app registration checks:**

```bash
az ad app list --display-name "Datacom Agent Library" --query '[].{AppId:appId, DisplayName:displayName}'
az ad app permission list --id your-client-id
az ad app permission admin-consent --id your-client-id  # Requires admin privileges
```

---

## 🔧 Troubleshooting — Node.js Version

```bash
# Check Node.js version
node --version

# Use nvm to switch versions
nvm use 22
nvm install 22
```

---

## 🔧 Troubleshooting — VNet Peering

```bash
# Test VNet peering connectivity
az network vnet peering show \
  --resource-group "rg-datacom-agent-library-uat" \
  --vnet-name "datacom-agent-library-uat-vnet-eastus2" \
  --name "peer-to-mongodb-vnet" \
  --query '{State:peeringState, AllowAccess:allowVirtualNetworkAccess}'

# Check reverse peering
az network vnet peering show \
  --resource-group "datacomchat-uat-rg-eastaus2" \
  --vnet-name "datacomchat-uat-mongodb-vm-linux-vnet" \
  --name "peer-to-function-app-vnet" \
  --query '{State:peeringState, AllowAccess:allowVirtualNetworkAccess}'

# Test MongoDB port accessibility
telnet mongodb-private-ip 27017

# Create peering if missing
az network vnet peering create \
  --resource-group "rg-datacom-agent-library-uat" \
  --vnet-name "datacom-agent-library-uat-vnet-eastus2" \
  --name "peer-to-mongodb-vnet" \
  --remote-vnet "/subscriptions/your-subscription/resourceGroups/datacomchat-uat-rg-eastaus2/providers/Microsoft.Network/virtualNetworks/datacomchat-uat-mongodb-vm-linux-vnet" \
  --allow-vnet-access true
```

---

## 📊 Health Check Script

```bash
cat > dev-health-check.sh << 'EOF'
#!/bin/bash
echo "=== Enterprise Development Health Check ==="
echo "Timestamp: $(date)"
echo ""

echo "1. Local Development Servers:"
curl -s -o /dev/null -w "API (localhost:7071): %{http_code}\n" "http://localhost:7071/api/health" || echo "API: Not running"
curl -s -o /dev/null -w "Client App (localhost:5174): %{http_code}\n" "http://localhost:5174" || echo "Client: Not running"
curl -s -o /dev/null -w "Admin App (localhost:3000): %{http_code}\n" "http://localhost:3000" || echo "Admin: Not running"

echo ""
echo "2. UAT Environment Connectivity:"
curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq -r '"Status: " + .status + ", Response Time: " + (.responseTime|tostring) + "ms"' 2>/dev/null || echo "UAT API: Connection failed"

echo ""
echo "3. Database Health:"
curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq '.services | to_entries[] | "\(.key): \(if .value.connected then "Connected" else "Disconnected" end)"' 2>/dev/null || echo "Database status: Unable to check"

echo ""
echo "=== Health Check Complete ==="
EOF

chmod +x dev-health-check.sh
./dev-health-check.sh
```

---

## 📊 Performance Monitoring

```bash
# Monitor API performance during development
watch -n 5 'curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq "{status: .status, responseTime: .responseTime, mongodb: .services.mongodb.connected, cosmosdb: .services.cosmosdb.connected}"'
```

---

## 📚 Common Commands Reference

```bash
# Development
npm run dev:all          # Start all applications
npm run build:all        # Build all applications
npm run lint:all         # Lint all applications
npm run check:all        # Type check and lint all

# Testing
npm run test:all         # Run all tests
npm run test:coverage    # Run tests with coverage

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data

# Deployment
npm run deploy:dev       # Deploy to development environment
npm run deploy:prod      # Deploy to production environment
```

---

## 🔗 Quick Links — UAT Environment

- **API Base**: https://datacom-agent-library-fa-uat.azurewebsites.net
- **Health Check**: https://datacom-agent-library-fa-uat.azurewebsites.net/api/health
- **API Documentation**: https://datacom-agent-library-fa-uat.azurewebsites.net/api/swagger

---

## 🔗 Quick Health Check Commands

```bash
# Overall system health
curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq '{status, responseTime, services: {mongodb: .services.mongodb.connected, cosmosdb: .services.cosmosdb.connected}}'

# Network connectivity verification
az network vnet peering list --resource-group "rg-datacom-agent-library-uat" --vnet-name "datacom-agent-library-uat-vnet-eastus2" --query "[].{Name:name, State:peeringState}" --output table

# Database health check
curl -s "https://datacom-agent-library-fa-uat.azurewebsites.net/api/health" | jq '.services | to_entries[] | "\(.key): \(if .value.connected then "✅ Connected" else "❌ Disconnected" end)"'
```

---

## 📚 Next Steps for New Enterprise Developers

1. **Understand the Architecture** — Read `01-overview.md`, `02-architecture.md`, `04-authentication.md`
2. **Master the APIs** — Read `05-api-guide.md`; use live Swagger at UAT `/api/swagger` and health at `/api/health`
3. **Learn Deployment Patterns** — Read `06-deployment-guide.md`, `07-operations-runbook.md`, `08-troubleshooting.md`
4. **Explore the Codebase** — Review `client-app/src/components`, `api/` endpoints, `shared/` components
5. **Run the Application** — Start all apps, navigate the UI, test endpoints with Swagger
6. **Make Your First Change** — Create feature branch, make small change, test, submit pull request

---

## 🔗 Quick Links — Essential Documentation

- **01-overview.md** — WAF compliance and business value
- **02-architecture.md** — Network design and database strategy
- **04-authentication.md** — Enterprise authentication
- **05-api-guide.md** — Complete API documentation
- **06-deployment-guide.md** — Infrastructure as Code
- **07-operations-runbook.md** — Monitoring and maintenance
- **08-troubleshooting.md** — VNet and connectivity issues

---

## 🆘 Getting Help

- **Technical Support**: Enterprise Application Services (EAS) Team
- **Email**: dipesh.trikam@datacom.com
- **Primary Documentation**: `docs/` folder
- **API Documentation**: http://localhost:7071/api/swagger
- **Component Library**: `shared/` package documentation

---

📌 **Document Type:** Developer Onboarding / Setup Guide
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061763856
