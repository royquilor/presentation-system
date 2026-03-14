# Authentication and Authorisation

> A security configuration reference covering Azure AD integration, JWT validation, RBAC implementation, MSAL.js setup, and security best practices for the Datacom Agent Library.

**Author:** Dipesh Trikam
**Date:** 13 September 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061698297

---

## 🎯 Context

The Datacom Agent Library uses **Azure Active Directory (Azure AD)** for enterprise-grade authentication and authorisation, achieving **9/10 Security pillar score** in Azure Well-Architected Framework assessment. This system provides secure, single sign-on (SSO) access with role-based access control (RBAC) and comprehensive audit logging across the client app, admin app, and shared Azure Functions API.

---

## 🔍 Problem

An enterprise AI platform handling personal user data, approval workflows, and role-sensitive administrative functions requires robust, auditable authentication and fine-grained authorisation. Without a well-defined security model, the risk of privilege escalation, token misuse, or unauthorised content modification is significant. The system needed a consistent auth pattern across two separate frontend apps and a shared serverless API.

---

## 📋 Observations

**1. Security Achievement**

The system achieved 9/10 (A- Grade) WAF Security Score with Azure AD JWT validation, private endpoints, VNet integration, sub-12ms authentication validation, and UAT production status at `datacom-agent-library-fa-uat.azurewebsites.net`.

**2. Authentication Flow**

End user accesses the application; client redirects to Azure AD; user enters credentials; Azure AD returns authorisation code; client exchanges code for tokens; client sends API requests with JWT; API validates token and processes with user context.

**3. Token Types**

Access Token: API authentication, 1-hour lifetime, memory only. Refresh Token: Token renewal, 14-day lifetime, secure storage. ID Token: User information, 1-hour lifetime, memory only.

**4. Azure AD App Registration**

Create app with `az ad app create`, configure redirect URIs for localhost and production, enable implicit grant for access and ID tokens, set Microsoft Graph permissions (User.Read, User.ReadBasic.All) and custom API scope (access_as_user).

**5. Environment Configuration**

Frontend uses VITE_ prefixed vars for client ID, tenant ID, API scope; backend uses AZURE_AD_*, JWT_ISSUER, JWT_AUDIENCE; client secret stored via Key Vault reference; UAT hostname is datacom-agent-library-fa-uat.azurewebsites.net.

**6. JWT Validation Performance**

Current UAT metrics: sub-12ms JWT validation, Azure Key Vault integration for token security, greater than 99.9% authentication success rate, live health endpoint at `/api/health`.

**7. Frontend MSAL Configuration**

MSAL.js uses sessionStorage (not localStorage), suppresses PII in logger callbacks, configures authority from tenant ID, and uses login popup for user interaction.

**8. Role-Based Authorisation**

Two middleware functions: `requireRole(roles[])` for endpoint-level access; `requireOwnership(resourceType)` for resource-level access; admins bypass ownership checks.

**9. Development Bypass**

`BYPASS_JWT_VALIDATION=true` in development injects mock admin user; must never be enabled in staging or production.

**10. Audit Logging**

Authentication events (login success/failure, token refresh, logout) logged with timestamp, userId, email, IP, and user agent for audit purposes.

---

## 💡 Proposal

The security model is implemented as two reusable middleware modules (`auth.js` for JWT validation, `authorization.js` for RBAC), applied consistently to every Azure Functions route. The frontend uses a `useAuth` custom hook and a `ProtectedRoute` component to enforce authentication and role checks declaratively at the React router level. Secrets are stored in Azure Key Vault and referenced via Key Vault references in Function App settings — never hardcoded or in environment files.

---

## ⚠️ Risks

**BYPASS_JWT_VALIDATION exposure** If accidentally enabled in staging or production, would expose all endpoints without authentication.

**Token refresh failure** Access token lifetime (1 hour) requires robust silent token refresh; failure to handle `InteractionRequiredAuthError` will result in users being silently logged out.

**CORS misconfiguration** Allowlist must be explicitly maintained as new deployment URLs are added; misconfiguration could block legitimate clients or open the API to unintended origins.

**Client secret expiry** Not tracked in this document; an unmonitored secret expiry would cause 100% authentication failure in production.

---

## ✅ Next Steps

1. **Key Vault alerts** — Configure Azure Key Vault secret expiry alerts to avoid undetected client secret expiration.
2. **Bypass audit** — Audit all deployment environments to confirm `BYPASS_JWT_VALIDATION` is `false` in non-local configurations.
3. **Auth test automation** — Implement automated tests for authentication failure cases (missing token, expired token, wrong role) using documented Postman and cURL patterns.
4. **Token refresh handling** — Review `useAuth` hook to ensure `InteractionRequiredAuthError` triggers a graceful re-login prompt rather than silent failure.

---

## 🔐 Authentication Architecture

**1. Sequence Flow**

User → Client → Azure AD (redirect to login) → User enters credentials → Azure AD returns authorisation code → Client exchanges code for tokens → Client sends API request with JWT → API validates token → API processes with user context → Returns response.

**2. Token Type Summary**

- Access Token: API authentication, 1 hour, memory only
- Refresh Token: Token renewal, 14 days, secure storage
- ID Token: User information, 1 hour, memory only

---

## 🏗️ Azure AD Configuration

**1. Create App Registration**

```bash
# Using Azure CLI
az ad app create \
  --display-name "Datacom Agent Library" \
  --identifier-uris "api://datacom-agent-library" \
  --sign-in-audience "AzureADMyOrg"
```

**2. Redirect URIs**

- `http://localhost:5174` (Client App - Development)
- `http://localhost:3000` (Admin App - Development)
- `https://your-client-app.azurewebsites.net` (Client App - Production)
- `https://your-admin-app.azurewebsites.net` (Admin App - Production)

**3. Implicit Grant**

- Access tokens enabled
- ID tokens enabled

**4. API Permissions**

Microsoft Graph: `User.Read`, `User.ReadBasic.All`. Custom API: `access_as_user`.

**5. Create Client Secret**

```bash
# Create client secret
az ad app credential reset \
  --id "your-app-id" \
  --append
```

---

## ⚙️ Environment Configuration

**1. Client App** (`client-app/.env.local`)

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

**2. Admin App** (`admin-app/.env.local`)

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

**3. API** (`api/local.settings.json` - UAT Environment)

```json
# Azure AD Configuration (Current Production Values)
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=@Microsoft.KeyVault(SecretUri=...)

# JWT Configuration (Enterprise Setup)
JWT_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0
JWT_AUDIENCE=api://your-client-id/access_as_user

# Production Environment Settings
NODE_ENV=production
WEBSITE_HOSTNAME=datacom-agent-library-fa-uat.azurewebsites.net
```

---

## 🖥️ Frontend Authentication Implementation

**1. MSAL.js Configuration** (`client-app/src/config/auth.ts`)

```typescript
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_AZURE_TENANT_ID
    }`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 0:
            console.error(message);
            break;
          case 1:
            console.warn(message);
            break;
          case 2:
            console.info(message);
            break;
          case 3:
            console.debug(message);
            break;
          default:
            console.log(message);
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE],
};

export const msalInstance = new PublicClientApplication(msalConfig);
```

**2. Authentication Hook** (`client-app/src/hooks/useAuth.ts`)

```typescript
import { useMsal } from "@azure/msal-react";
import { useCallback, useEffect, useState } from "react";
import { loginRequest } from "../config/auth";

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export const useAuth = () => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [instance]);

  const logout = useCallback(async () => {
    try {
      await instance.logoutPopup();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, [instance]);

  const getAccessToken = useCallback(async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.error("Token acquisition failed:", error);
      throw error;
    }
  }, [instance, accounts]);

  useEffect(() => {
    const loadUser = async () => {
      if (accounts.length > 0) {
        try {
          const token = await getAccessToken();
          const userInfo = await fetchUserInfo(token);
          setUser(userInfo);
        } catch (error) {
          console.error("Failed to load user:", error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [accounts, getAccessToken]);

  return {
    user,
    loading,
    login,
    logout,
    getAccessToken,
    isAuthenticated: !!user,
  };
};
```

**3. Protected Route Component** (`client-app/src/components/ProtectedRoute.tsx`)

```typescript
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
```

---

## 🔧 Backend Authentication Implementation

**1. JWT Validation Middleware** (`api/shared/auth.js`)

```javascript
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/discovery/v2.0/keys`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const validateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
};

const authMiddleware = async (req, res, next) => {
  try {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.BYPASS_JWT_VALIDATION === "true"
    ) {
      req.user = {
        oid: "dev-user-id",
        email: "dev@datacom.com",
        name: "Development User",
        roles: ["user", "admin"],
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTHENTICATION_ERROR",
          message: "Missing or invalid authorization header",
        },
      });
    }

    const token = authHeader.substring(7);
    const decoded = await validateToken(token);

    req.user = {
      oid: decoded.oid,
      email: decoded.email || decoded.preferred_username,
      name: decoded.name,
      roles: decoded.roles || ["user"],
    };

    next();
  } catch (error) {
    console.error("JWT validation error:", error);
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTHENTICATION_ERROR",
        message: "Invalid or expired token",
      },
    });
  }
};

module.exports = { authMiddleware, validateToken };
```

**2. Role-Based Authorization** (`api/shared/authorization.js`)

```javascript
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "AUTHENTICATION_ERROR",
          message: "User not authenticated",
        },
      });
    }

    const userRoles = req.user.roles || [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: "AUTHORIZATION_ERROR",
          message: "Insufficient permissions",
        },
      });
    }

    next();
  };
};

const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.oid;

      if (req.user.roles.includes("admin")) {
        return next();
      }

      const resource = await getResource(resourceType, resourceId);
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Resource not found",
          },
        });
      }

      if (resource.author !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: "AUTHORIZATION_ERROR",
            message: "Access denied to this resource",
          },
        });
      }

      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Internal server error",
        },
      });
    }
  };
};

module.exports = { requireRole, requireOwnership };
```

**3. API Route Protection** (`api/agents/index.js`)

```javascript
const { authMiddleware } = require("../shared/auth");
const { requireRole, requireOwnership } = require("../shared/authorization");

module.exports = async function (context, req) {
  await authMiddleware(req, context.res, () => {});

  switch (req.method) {
    case "GET":
      return await getAgents(context, req);

    case "POST":
      requireRole(["user", "admin"])(req, context.res, () => {});
      return await createAgent(context, req);

    case "PUT":
      requireOwnership("agent")(req, context.res, () => {});
      return await updateAgent(context, req);

    case "DELETE":
      requireOwnership("agent")(req, context.res, () => {});
      return await deleteAgent(context, req);

    default:
      context.res = {
        status: 405,
        body: {
          success: false,
          error: {
            code: "METHOD_NOT_ALLOWED",
            message: "Method not allowed",
          },
        },
      };
  }
};
```

---

## 🛡️ Security Best Practices

**1. Token Security**

```javascript
// ❌ Don't store tokens in localStorage
localStorage.setItem("token", accessToken);

// ✅ Store in memory or secure storage
sessionStorage.setItem("token", accessToken);
// Or use secure HTTP-only cookies
```

**2. Token Refresh**

```javascript
const refreshToken = async () => {
  try {
    const response = await instance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    await login();
  }
};
```

**3. Token Validation**

```javascript
const validateToken = (token) => {
  return jwt.verify(token, publicKey, {
    audience: expectedAudience,
    issuer: expectedIssuer,
    algorithms: ["RS256"],
  });
};
```

**4. Input Sanitization**

```javascript
const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};
```

**5. Request Validation**

```javascript
const validateAgentData = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(1000).required(),
    category: Joi.string().required(),
    instructions: Joi.string().max(5000).required(),
  });

  return schema.validate(data);
};
```

**6. CORS Configuration** (`api/host.json`)

```json
{
  "version": "2.0",
  "cors": {
    "allowedOrigins": [
      "http://localhost:5174",
      "http://localhost:3000",
      "https://your-client-app.azurewebsites.net",
      "https://your-admin-app.azurewebsites.net"
    ],
    "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "exposedHeaders": ["Content-Length"],
    "maxAge": 86400
  }
}
```

---

## 🧪 Testing Authentication

**1. JWT Bypass for Development**

```bash
# Enable JWT bypass in development
BYPASS_JWT_VALIDATION=true
```

**2. Test with Postman / cURL**

```bash
# Get test token
curl -X POST "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret&scope=api://your-client-id/access_as_user"

# Use token in requests
curl -X GET "http://localhost:7071/api/agents" \
  -H "Authorization: Bearer your-token"
```

**3. Test Different Roles**

```javascript
// Test admin access
req.user = {
  oid: "admin-user-id",
  roles: ["admin"],
};

// Test user access
req.user = {
  oid: "user-id",
  roles: ["user"],
};
```

**4. Production Health Check**

```bash
curl -X GET "https://your-api.azurewebsites.net/api/health"
```

**5. Production Auth Test**

```bash
# Test without token (should return 401)
curl -X GET "https://your-api.azurewebsites.net/api/agents"

# Test with valid token (should return 200)
curl -X GET "https://your-api.azurewebsites.net/api/agents" \
  -H "Authorization: Bearer valid-token"
```

---

## 📊 Monitoring & Auditing

**1. Authentication Logging**

```javascript
const logAuthEvent = (event, user, details) => {
  console.log({
    timestamp: new Date().toISOString(),
    event,
    userId: user?.oid,
    userEmail: user?.email,
    details,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
};

logAuthEvent("LOGIN_SUCCESS", user, { method: "popup" });
logAuthEvent("LOGIN_FAILURE", null, { error: "Invalid credentials" });
logAuthEvent("TOKEN_REFRESH", user, { method: "silent" });
logAuthEvent("LOGOUT", user, { method: "popup" });
```

**2. Security Monitoring**

Track failed login attempts, implement rate limiting, send alerts for suspicious activity. Track API usage patterns, monitor for unusual activity, generate usage reports.

---

## 🚨 Troubleshooting

**1. CORS Errors**

Check CORS configuration, verify allowed origins, ensure preflight requests are handled.

**2. Token Expiration**

Implement automatic token refresh, handle token expiration gracefully, redirect to login when refresh fails.

**3. Permission Denied**

Check user roles, verify resource ownership, review authorization logic.

**4. Azure AD Configuration**

Verify app registration, check redirect URIs, validate API permissions, confirm client secret.

**5. Debug Mode**

```bash
# Frontend debug
VITE_DEBUG=true

# Backend debug
DEBUG=msal:*,jwt:*
```

---

## 🔗 Common Commands

```bash
# Check Azure AD app registration
az ad app show --id your-app-id

# List app permissions
az ad app permission list --id your-app-id

# Create new client secret
az ad app credential reset --id your-app-id --append

# Test token validation
curl -X POST "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret&scope=api://your-client-id/access_as_user"
```

---

## 🔑 Close

> The authentication and authorisation system achieves enterprise-grade security (9/10 WAF score) through a combination of **Azure AD JWT validation, role-based and ownership-based middleware, and Key Vault secret management** — but the `BYPASS_JWT_VALIDATION` flag must be rigorously guarded against accidental production exposure.

The Datacom Agent Library security model delivers SSO via Azure AD, RS256 JWT validation with JWKS, RBAC via `requireRole` and `requireOwnership`, MSAL.js frontend integration, and comprehensive audit logging. Developers must ensure Key Vault secret expiry is monitored and token refresh handles `InteractionRequiredAuthError` gracefully.

---

📌 **Document Type:** Security Configuration Reference
📅 **Last Updated:** 13 September 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40061698297
