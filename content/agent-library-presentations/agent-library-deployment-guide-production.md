# Agent Library Deployment Guide (Production)

> Enterprise-grade production deployment for the Datacom Agent Library on Azure — WAF-compliant, VNet-peered, multi-database architecture.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062255105

---

## 🎯 Context

This guide provides comprehensive instructions for deploying the **enterprise-grade Datacom Agent Library** (8.5/10 WAF compliant) to production environments. Based on **proven UAT implementation** achieving **12ms response time** with **VNet peering architecture**. The template has been validated and is ready for production replication across Azure Australia East.

---

## 🔍 Problem

Deploying an enterprise-grade serverless application with multi-VNet networking, private endpoints, dual databases (Cosmos DB + MongoDB Atlas), and Azure AD integration requires many interdependent steps. Performing them out of order or incorrectly results in security gaps, connectivity failures, or broken deployments. A structured, scripted guide eliminates ambiguity and enables repeatable, auditable production rollouts.

---

## 📋 Observations

**1. Proven UAT Template Results**

WAF Compliance 8.5/10 (A- Grade). Performance 12ms response time (99.8% improvement). Security via multi-VNet architecture with private endpoints. Network VNet peering (172.21.0.0/16 ↔ 172.19.0.0/16). Template is production-ready for enterprise deployment.

**2. Azure Infrastructure Components**

Frontend: Static Web App (Client), Static Web App (Admin). Backend: Azure Functions App, API Management. Data: Cosmos DB, MongoDB Atlas, Blob Storage. External: Azure AD, Communication Services, Application Insights, Key Vault. Networking: Azure CDN, Azure Firewall, Network Security Groups.

**3. Environment Strategy**

Development: local development, local + cloud services, test data, developers. Staging: pre-production testing, Azure dev resources, production-like data, QA team. Production: live application, Azure prod resources, production data, end users.

**4. Prerequisites Checklist**

Azure Subscription active with sufficient quota. Azure AD Tenant configured with app registrations. Domain names registered and configured. SSL certificates valid for custom domains. Monitoring tools (Application Insights) set up. Backup strategy for database and files. Disaster recovery procedures documented.

**5. Required Permissions**

Azure Subscription Owner for resource creation and management. Azure AD Global Administrator for app registration and user management. Application Administrator for API permissions and secrets. Contributor Access for resource deployment and configuration.

**6. Infrastructure Setup Sequence**

Six setup steps: Resource Group → Key Vault (secrets) → Databases (CosmosDB + MongoDB Atlas M50+) → Azure Functions → Static Web Apps (client + admin) → Application Insights. All secrets stored in Key Vault and referenced via `@Microsoft.KeyVault(SecretUri=...)` — never plaintext.

**7. CI/CD Pipeline**

GitHub Actions triggered on pushes to `main`. Builds four packages (shared, client-app, admin-app, api). Deploys to Azure Functions and both Static Web Apps. Runs smoke tests and notifies Slack.

**8. Disaster Recovery**

RTO 4 hours, RPO 1 hour. Procedures for database restoration, application redeployment, DNS failover, monitoring verification.

---

## 💡 Proposal

The deployment approach follows **Infrastructure as Code principles** using Azure CLI scripts. Any engineer with correct permissions can provision a complete production environment from scratch. Secrets management via Key Vault, RBAC-based access, and automated CI/CD with smoke tests and Slack notifications ensure deployments are secure and observable. The guide is structured to be followed sequentially — each step produces outputs consumed by subsequent steps.

---

## ⚠️ Risks

**Azure permission coordination** Azure Subscription Owner and Azure AD Global Administrator are often held by different people, requiring coordination before deployment.

**MongoDB Atlas manual step** Cluster provisioning is not covered by Azure CLI; requires manual configuration in Atlas portal, introducing a non-automated step.

**GitHub secrets pre-configuration** Slack webhook and GitHub secrets (`AZURE_FUNCTIONAPP_PUBLISH_PROFILE`, `AZURE_STATIC_WEB_APPS_API_TOKEN_*`) must be pre-configured; missing secrets cause silent deployment failures.

**DR RTO assumptions** The 4-hour RTO assumes a well-practised team; without regular DR drills, actual recovery time may exceed the target.

**Resource quota limits** Azure subscription limits may be exceeded during provisioning; verify quota before starting.

---

## ✅ Next Steps

1. **Provision Key Vault first** — Create resource group and Key Vault, obtain secret URIs before configuring Function App settings.
2. **Configure GitHub secrets** — Set all CI/CD pipeline variables before merging to `main`.
3. **Schedule load test** — Validate performance meets 12ms response time target under production traffic.
4. **Document DR drills** — Schedule regular drills to validate 4-hour RTO is achievable.
5. **Verify CORS origins** — Update allowed origins with actual production Static Web App URLs after deployment.

---

## 🔑 Close

> The production deployment guide provides a **complete, scripted path from zero to a WAF-compliant, production-ready system**. The most critical prerequisite is ensuring Azure Key Vault is provisioned and all secrets are stored before any other services are configured.

---

## 🏗️ Flex: Production Architecture

**1. Overview**

Infrastructure spans Frontend Applications (Static Web App Client, Static Web App Admin), Backend Services (Azure Functions App, API Management), Data Storage (Cosmos DB, MongoDB Atlas, Blob Storage), External Services (Azure AD, Communication Services, Application Insights, Key Vault), and Networking (Azure CDN, Azure Firewall, Network Security Groups).

**2. Data Flow**

Users → CDN → Static Web Apps → API Management → Azure Functions → Cosmos DB, MongoDB, Blob Storage, Azure AD, Communication Services, Application Insights, Key Vault.

---

## 📦 Flex: Prerequisites & Permissions

**1. Prerequisites Checklist**

- Azure Subscription: active with sufficient quota
- Azure AD Tenant: configured with app registrations
- Domain names: registered and configured
- SSL certificates: valid for custom domains
- Monitoring tools: Application Insights setup
- Backup strategy: database and file backup procedures
- Disaster recovery: recovery procedures and documentation

**2. Required Permissions**

- Azure Subscription Owner: resource creation and management
- Azure AD Global Administrator: app registration and user management
- Application Administrator: API permissions and secrets
- Contributor Access: resource deployment and configuration

---

## 🚀 Flex: Step 1 — Resource Group Creation

**1. Create Resource Group**

```bash
# Create resource group
az group create \
  --name "rg-datacom-agent-library-prod" \
  --location "Australia East" \
  --tags "Environment=Production" "Project=AgentLibrary"

# Set default resource group
az config set defaults.group=rg-datacom-agent-library-prod
```

---

## 🔐 Flex: Step 2 — Azure Key Vault Setup

**1. Create Key Vault**

```bash
# Create Key Vault
az keyvault create \
  --name "kv-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --location "Australia East" \
  --sku "standard" \
  --enable-rbac-authorization true
```

**2. Store Secrets**

```bash
# Store secrets
az keyvault secret set \
  --vault-name "kv-datacom-agent-library-prod" \
  --name "MONGODB-URI" \
  --value "your-mongodb-connection-string"

az keyvault secret set \
  --vault-name "kv-datacom-agent-library-prod" \
  --name "COSMOS-DB-KEY" \
  --value "your-cosmos-db-key"

az keyvault secret set \
  --vault-name "kv-datacom-agent-library-prod" \
  --name "AZURE-AD-CLIENT-SECRET" \
  --value "your-client-secret"
```

---

## 🗄️ Flex: Step 3 — Database Setup

**1. Azure Cosmos DB — Create Account**

```bash
# Create Cosmos DB account
az cosmosdb create \
  --name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --locations regionName="Australia East" failoverPriority=0 isZoneRedundant=false \
  --capabilities EnableServerless \
  --default-consistency-level "Session"
```

**2. Cosmos DB — Create Database and Containers**

```bash
# Create database
az cosmosdb sql database create \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --name "AgentLibrary"

# Create containers
az cosmosdb sql container create \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --database-name "AgentLibrary" \
  --name "public-agents" \
  --partition-key-path "/id" \
  --throughput 400

az cosmosdb sql container create \
  --account-name "cosmos-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --database-name "AgentLibrary" \
  --name "public-prompts" \
  --partition-key-path "/id" \
  --throughput 400
```

**3. MongoDB Atlas Production Cluster**

- Cluster tier: M50 or higher
- Region: Australia (Sydney)
- Backup: enabled with 7-day retention
- Monitoring: advanced monitoring enabled
- Network access: IP whitelist (Azure Functions IP ranges), VPC peering if using Azure VNet
- Database user: `datacom-agent-library-prod`, strong password, ReadWrite on AgentLibrary database

---

## ⚡ Flex: Step 4 — Azure Functions Setup

**1. Storage Account and App Service Plan**

```bash
# Create Storage Account
az storage account create \
  --name "stagentlibraryprod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --location "Australia East" \
  --sku "Standard_LRS" \
  --kind "StorageV2"

# Create App Service Plan
az appservice plan create \
  --name "plan-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --location "Australia East" \
  --sku "P1v3" \
  --is-linux
```

**2. Create Function App**

```bash
# Create Function App
az functionapp create \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --plan "plan-datacom-agent-library-prod" \
  --storage-account "stagentlibraryprod" \
  --runtime "node" \
  --runtime-version "18" \
  --functions-version "4" \
  --os-type "Linux"
```

**3. Configure App Settings**

```bash
# Configure app settings
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings \
    NODE_ENV=production \
    AZURE_AD_TENANT_ID=your-tenant-id \
    AZURE_AD_CLIENT_ID=your-client-id \
    MONGODB_URI="@Microsoft.KeyVault(SecretUri=https://kv-datacom-agent-library-prod.vault.azure.net/secrets/MONGODB-URI/)" \
    COSMOS_DB_ENDPOINT=https://cosmos-datacom-agent-library-prod.documents.azure.com:443/ \
    COSMOS_DB_KEY="@Microsoft.KeyVault(SecretUri=https://kv-datacom-agent-library-prod.vault.azure.net/secrets/COSMOS-DB-KEY/)" \
    COSMOS_DB_DATABASE_NAME=AgentLibrary \
    AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING=your-connection-string \
    JWT_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0 \
    JWT_AUDIENCE=api://your-client-id/access_as_user
```

**4. Configure CORS**

```bash
# Configure CORS
az functionapp cors add \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --allowed-origins "https://your-client-app.azurewebsites.net" "https://your-admin-app.azurewebsites.net"
```

---

## 🌐 Flex: Step 5 — Static Web Apps Setup

**1. Client App**

```bash
# Create Static Web App
az staticwebapp create \
  --name "swa-datacom-agent-library-client-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --source "https://github.com/your-org/datacom-agent-library" \
  --branch "main" \
  --app-location "client-app" \
  --api-location "" \
  --output-location "dist" \
  --login-with-github

# Configure environment variables
az staticwebapp appsettings set \
  --name "swa-datacom-agent-library-client-prod" \
  --setting-names \
    VITE_AZURE_CLIENT_ID=your-client-id \
    VITE_AZURE_TENANT_ID=your-tenant-id \
    VITE_API_SCOPE=api://your-client-id/access_as_user \
    VITE_API_BASE_URL=/api \
    VITE_BACKEND_URL=https://func-datacom-agent-library-prod.azurewebsites.net \
    VITE_ENVIRONMENT=production
```

**2. Admin App**

```bash
# Create Static Web App
az staticwebapp create \
  --name "swa-datacom-agent-library-admin-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --source "https://github.com/your-org/datacom-agent-library" \
  --branch "main" \
  --app-location "admin-app" \
  --api-location "" \
  --output-location "dist" \
  --login-with-github

# Configure environment variables
az staticwebapp appsettings set \
  --name "swa-datacom-agent-library-admin-prod" \
  --setting-names \
    VITE_AZURE_CLIENT_ID=your-client-id \
    VITE_AZURE_TENANT_ID=your-tenant-id \
    VITE_API_SCOPE=api://your-client-id/access_as_user \
    VITE_API_BASE_URL=/api \
    VITE_BACKEND_URL=https://func-datacom-agent-library-prod.azurewebsites.net \
    VITE_ENVIRONMENT=production
```

---

## 📊 Flex: Step 6 — Application Insights Setup

**1. Create and Configure Application Insights**

```bash
# Create Application Insights
az monitor app-insights component create \
  --app "ai-datacom-agent-library-prod" \
  --location "Australia East" \
  --resource-group "rg-datacom-agent-library-prod" \
  --application-type "web" \
  --kind "web"

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app "ai-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --query "instrumentationKey" \
  --output tsv)

# Configure Function App with Application Insights
az functionapp config appsettings set \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --settings \
    APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY \
    APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=$INSTRUMENTATION_KEY"
```

---

## 🔄 Flex: CI/CD Pipeline Configuration

**1. GitHub Actions Workflow**

Production deployment workflow (`.github/workflows/deploy-prod.yml`):

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AZURE_FUNCTIONAPP_NAME: func-datacom-agent-library-prod
  AZURE_FUNCTIONAPP_PACKAGE_PATH: "api"
  NODE_VERSION: "18.x"

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: |
          npm ci
          cd client-app && npm ci && cd ..
          cd admin-app && npm ci && cd ..
          cd api && npm ci && cd ..
          cd shared && npm ci && cd ..

      - name: Build shared package
        run: |
          cd shared
          npm run build
          cd ..

      - name: Build client app
        run: |
          cd client-app
          npm run build:prod
          cd ..

      - name: Build admin app
        run: |
          cd admin-app
          npm run build:prod
          cd ..

      - name: Build API
        run: |
          cd api
          npm run build
          cd ..

      - name: Deploy to Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: ${{ env.AZURE_FUNCTIONAPP_NAME }}
          package: ${{ env.AZURE_FUNCTIONAPP_PACKAGE_PATH }}
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}

      - name: Deploy Client App to Static Web App
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_CLIENT }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "client-app"
          output_location: "dist"

      - name: Deploy Admin App to Static Web App
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "admin-app"
          output_location: "dist"

      - name: Run smoke tests
        run: |
          npm run test:smoke

      - name: Notify deployment status
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: "#deployments"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**2. Environment Secrets**

Configure in GitHub: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`, `AZURE_STATIC_WEB_APPS_API_TOKEN_CLIENT`, `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN`, `SLACK_WEBHOOK`, `MONGODB_URI`, `COSMOS_DB_KEY`, `AZURE_AD_CLIENT_SECRET`.

---

## 🔒 Flex: Security Configuration — Networking

**1. Azure Firewall Rules**

```bash
# Create Azure Firewall
az network firewall create \
  --name "fw-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --location "Australia East"

# Configure firewall rules
az network firewall network-rule create \
  --firewall-name "fw-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --collection-name "datacom-rules" \
  --name "allow-https" \
  --protocols "TCP" \
  --source-addresses "*" \
  --destination-addresses "*" \
  --destination-ports "443" \
  --action "Allow" \
  --priority "100"
```

**2. Network Security Groups**

```bash
# Create NSG for Function App
az network nsg create \
  --name "nsg-functions-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --location "Australia East"

# Allow HTTPS inbound
az network nsg rule create \
  --resource-group "rg-datacom-agent-library-prod" \
  --nsg-name "nsg-functions-prod" \
  --name "allow-https" \
  --protocol "Tcp" \
  --priority "100" \
  --destination-port-range "443" \
  --access "Allow"
```

---

## 🌍 Flex: DNS & Custom Domain Setup

**1. Custom Domain Configuration**

```bash
# Add custom domain to Function App
az functionapp config hostname add \
  --webapp-name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --hostname "api.yourdomain.com"

# Add custom domain to Static Web App
az staticwebapp hostname set \
  --name "swa-datacom-agent-library-client-prod" \
  --hostname "app.yourdomain.com"
```

**2. SSL Certificate Management**

```bash
# Upload SSL certificate to Key Vault
az keyvault certificate import \
  --vault-name "kv-datacom-agent-library-prod" \
  --name "ssl-certificate" \
  --file "certificate.pfx" \
  --password "certificate-password"

# Bind certificate to Function App
az functionapp config ssl bind \
  --certificate-thumbprint "thumbprint" \
  --ssl-type "SNI" \
  --name "func-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod"
```

---

## 📈 Flex: Monitoring & Alerting

**1. Application Insights Dashboard Metrics**

Performance: response time, throughput, error rate, availability. Business: active users, API usage, popular agents/prompts, approval workflow metrics. Infrastructure: CPU usage, memory usage, database performance, storage usage.

**2. Alerting Configuration**

```bash
# Create action group for alerts
az monitor action-group create \
  --name "ag-datacom-agent-library-prod" \
  --resource-group "rg-datacom-agent-library-prod" \
  --short-name "AgentLibraryAlerts" \
  --action email "admin@datacom.com" "Admin"

# Create alert rule for high error rate
az monitor metrics alert create \
  --name "High Error Rate Alert" \
  --resource-group "rg-datacom-agent-library-prod" \
  --scopes "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Web/sites/func-datacom-agent-library-prod" \
  --condition "avg Percentage Http5xx > 5" \
  --window-size "PT5M" \
  --evaluation-frequency "PT1M" \
  --action "/subscriptions/your-subscription-id/resourceGroups/rg-datacom-agent-library-prod/providers/Microsoft.Insights/actionGroups/ag-datacom-agent-library-prod"
```

---

## 🔄 Flex: Database Migration & Data Setup

**1. MongoDB Migration**

```bash
# Export data from development
mongodump --uri="mongodb://dev-connection-string" --db=DatacomChat --out=./backup

# Import data to production
mongorestore --uri="mongodb://prod-connection-string" --db=DatacomChat ./backup/DatacomChat
```

**2. Cosmos DB Data Migration**

Use Azure Data Factory or custom migration script. Example: `node scripts/migrate-to-cosmos.js`.

**3. Initial Data Setup**

```bash
# Run database seeding
npm run db:seed:prod

# Create initial admin user
node scripts/create-admin-user.js
```

---

## 🧪 Flex: Post-Deployment Verification & Health Checks

**1. Smoke Tests**

```bash
# Health check
curl -X GET "https://api.yourdomain.com/api/health"

# Authentication test
curl -X GET "https://api.yourdomain.com/api/agents" \
  -H "Authorization: Bearer valid-token"

# Public content test
curl -X GET "https://api.yourdomain.com/api/public-agents"
```

**2. Load Testing**

```bash
# Run load tests
npm run test:load

# Monitor performance during load test via Application Insights
```

**3. Security Testing**

```bash
# Run security scans
npm run test:security

# Check for vulnerabilities
npm audit

# Test authentication flows
npm run test:auth
```

---

## 💾 Flex: Backup & Disaster Recovery

**1. MongoDB Atlas Backup**

Automated: daily frequency, 7-day retention, point-in-time recovery enabled. Manual:

```bash
# Create manual backup
mongodump --uri="mongodb://prod-connection-string" --db=DatacomChat --out=./manual-backup

# Compress backup
tar -czf backup-$(date +%Y%m%d).tar.gz manual-backup/
```

**2. Cosmos DB Backup**

Automated: continuous backup mode, 7-day retention, geo-redundant. Manual export via `az cosmosdb sql database export` to Blob Storage.

**3. Disaster Recovery Plan**

RTO: 4 hours. RPO: 1 hour. Procedures: database restoration, application redeployment, DNS failover, monitoring verification.

---

## ⚙️ Flex: Performance Optimization

**1. Azure Functions host.json**

```json
{
  "version": "2.0",
  "functionTimeout": "00:05:00",
  "logging": {
    "applicationInsights": {
      "samplingSettings": {
        "isEnabled": true,
        "excludedTypes": "Request"
      }
    }
  },
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

**2. Static Web Apps staticwebapp.config.json**

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html"
    }
  }
}
```

---

## 🆘 Flex: Deployment Support & Common Issues

**1. Getting Help**

Check Azure Portal for resource health and metrics. Review Application Insights and Function App logs. Verify all endpoints respond correctly. Contact EAS team for technical assistance.

**2. Common Deployment Issues**

- Resource Quota Exceeded: check Azure subscription limits
- Authentication Errors: verify Azure AD configuration
- Database Connection Issues: check connection strings and network access
- Build Failures: review CI/CD pipeline logs
- Performance Issues: monitor Application Insights metrics

---

## 📚 Flex: Related Documentation

- **01-overview.md**: System overview and purpose
- **02-architecture.md**: Technical architecture
- **03-getting-started.md**: Development setup
- **04-authentication.md**: Authentication configuration
- **05-api-guide.md**: API reference and integration
- **07-operations-runbook.md**: Operations and maintenance
- **08-troubleshooting.md**: Common issues and solutions

---

📌 **Document Type:** Deployment Guide / Operations Guide
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40062255105
