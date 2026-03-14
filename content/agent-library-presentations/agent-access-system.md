# Agent Access System
> ACL entry patterns, UX design, and access control for owned, shared, and global agents

**Author:** Dipesh Trikam — Insights & Analytics
**Date:** 28 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40070512927

---

## 🎯 Context

This document defines the correct user experience and ACL entry patterns for the agent access system. It ensures clear separation between owned agents, shared agents, and global agent access while maintaining automatic accessibility for global agents. The system serves the Datacom Agent Library within the Insights & Analytics space, providing enterprise-grade access control with full audit capabilities.

---

## 🔍 Problem

Agent libraries require clear user understanding of what they own versus what is shared versus what is globally available. Without proper separation, users struggle to understand access boundaries, sharing attribution becomes unclear, and audit trails for compliance are incomplete. Global agents must remain automatically accessible without request barriers, yet all access must be tracked in ACL entries for audit purposes.

---

## 📋 Observations

**1. Key principles**

Four principles guide the design: global agents remain automatically accessible with no request barriers for "All Datacom" agents; ACL entries track all access including automatic global access for audit; clear UX separation so users understand owned vs shared vs global; proper attribution so we always know who shared what with whom.

**2. Three-tab structure (recommended)**

Option A uses three tabs: "My Agents" (agents you created or own, plus global agents with "Global Access" badge), "Shared with Me" (agents specifically shared by individuals or global agents you explicitly requested), and "Directory" (browse all global agents, request specific access to track usage, discovery and exploration).

**3. Two-tab alternative**

Option B combines "My Agents & Shared" (all accessible agents with sections: "Created by Me", "Shared with Me", "Global Access") and "Directory" (browse and discover global agents, request tracked access).

**4. Owned agents (personal)**

Agents created and owned by the current user (original versions). Full permissions: read, execute, modify, share, delete. Display: "My Agents" with "Owner" badge. ACL entry uses `permBits: 15`, `shareType: 'owner'`, `accessMethod: 'creation'`, and optional `hasSharedDuplicate: true` if user has shared this agent.

**5. Admin-owned shared agents**

Duplicate agents created from user originals, owned by admin for sharing. Admin has full permissions, managed by system. Not visible to original creator (they see their original). ACL entry uses `shareType: 'admin_managed_duplicate'`, `accessMethod: 'duplication_for_sharing'`, with `originalAgentId` and `originalOwnerId` references.

**6. Specifically shared agents**

Admin-owned duplicate agents shared with you via "Specific Individuals". Read and execute permissions only. Display: "Shared with Me" with original creator's name. ACL entry uses `permBits: 1`, `shareType: 'specific_individual'`, `accessMethod: 'admin_duplicate_share'`, with `originalOwnerId` and `sharedDuplicateId` references.

**7. Global agents (automatic access)**

"All Datacom" agents automatically accessible. Read and execute permissions. Display: "My Agents" with "Global Access" badge. ACL entry created when user first accesses, using `shareType: 'global_automatic'`, `accessMethod: 'automatic_global_access'`, with `accessedAt` timestamp.

**8. Global agents (requested access)**

Global agents where user explicitly requested tracked access. Read and execute permissions. Display: "Shared with Me" with "Global Request" badge. ACL entry created when admin approves, using `shareType: 'global_request'`, `accessMethod: 'requested_global_access'`, with `requestId` and `approvedAt`.

**9. Enhanced ACL schema**

Schema includes `principalType`, `resourceType`, `resourceId`, `principalId`, `permBits`, `roleId`, `grantedBy`, `grantedAt`, plus new sharing metadata: `shareType`, `accessMethod`, `sourceAgentId`, `requestId`, `accessedAt`, `hasSharedDuplicate`, `isAdminDuplicate`, `originalAgentId`, `originalOwnerId`, `sharedDuplicateId`.

**10. ACL creation triggers**

Six triggers: agent creation (owner ACL), agent duplication for sharing (update original with `hasSharedDuplicate`, create admin ACL, link metadata), specific individual approval (shared ACL entries), global agent first access (automatic global ACL), global access request approval (requested global ACL), asset migration (copy assets to admin duplicate).

---

## 💡 Proposal

Implement the three-tab UX structure with enhanced ACL system supporting all five access types. Use admin-owned duplicates for sharing workflow with clear user education via sharing modal. Track all access in ACL entries for audit compliance. Maintain automatic global access while enabling optional tracked requests.

---

## ⚠️ Risks

**ACL schema migration** — Extending ACL with new fields requires migration of existing entries and validation of backward compatibility across all access paths.

**Admin ownership transfer** — Duplicate ownership transfer to admin creates single point of management; admin availability and permissions must be carefully managed.

**Asset copying complexity** — Migrating files and resources from original to admin-owned duplicate may fail partially; requires idempotent retry and validation.

**User confusion on duplication** — Users may not understand that shared version is a duplicate; original creator keeps original but changes do not propagate to shared users without resubmission.

**Performance at scale** — ACL queries for large agent libraries with multiple access types may require indexing optimization and query consolidation.

**Legacy shared agent migration** — Existing shared agents must be converted to admin-owned duplicate model; data consistency and rollback procedures are critical.

---

## ✅ Next Steps

1. **Phase 1: ACL foundation** — Implement enhanced ACL service with `shareType`, `accessMethod`, duplication tracking fields, admin ownership management, and performance indexes.

2. **Phase 2: Duplication system** — Create AgentDuplicationService, admin ownership transfer, duplicate metadata tracking, asset copying hooks, and audit trail.

3. **Phase 3: Sharing modal** — Build SharingWarningModal with duplication messaging, update sharing forms, add confirmation workflow and progress indicators.

4. **Phase 4: API updates** — Update POST /api/public-agents for duplication, enhance PUT /api/approvals/:id/approve for admin-owned duplicates, add duplicate management endpoints.

5. **Phase 5: Admin interface** — Update admin approval components, add duplicate indicators and relationship views, create duplication history dashboard.

6. **Phase 6: Tab structure** — Implement 3-tab structure (My Agents | Shared with Me | Directory), badge components, filtering, mobile-responsive design.

7. **Phase 7: Asset integration** — Integrate asset copying script, file reference management, asset versioning, cleanup tools.

8. **Phase 8: Data migration** — Migrate legacy shared agents, convert cloned agents, validate consistency, create rollback procedures.

9. **Phase 9: Testing** — Integration tests for duplication workflows, performance benchmarks, security audit, UAT for sharing UX.

10. **Phase 10: Production** — Blue-green deployment, monitoring for admin ownership transfers, operational runbooks, team training.

---

## 🔑 Close

> This specification ensures we maintain the automatic accessibility of global agents while providing proper tracking, clear user experience, and comprehensive audit capabilities through the ACL system.

The agent access system delivers clear separation between owned, shared, and global agents with full ACL audit trail. Users understand access boundaries, admins manage distribution via owned duplicates, and compliance requirements are met through consistent ACL entry patterns.

---

## 📐 Access Control Models

**1. Owned agents (personal)**

Definition: Agents created and owned by the current user (original versions). Access: full permissions (read, execute, modify, share, delete). Display: "My Agents" with "Owner" badge.

ACL entry pattern:

```javascript
{
  permBits: 15,
  roleId: ObjectId('68a26cfa7eed3bcd740b08d0'), // Owner role
  grantedBy: [self],
  resourceType: 'agent',
  shareType: 'owner',
  accessMethod: 'creation',
  hasSharedDuplicate: false // or true if user has shared this agent
}
```

**2. Admin-owned shared agents (for distribution)**

Definition: Duplicate agents created from user originals, owned by admin for sharing. Access: admin has full permissions, managed by system. Display: not visible to original creator (they see their original).

ACL entry pattern (for admin ownership):

```javascript
{
  permBits: 15,
  roleId: ObjectId('68a26cfa7eed3bcd740b08d0'), // Admin owner role
  grantedBy: [system],
  resourceType: 'agent',
  shareType: 'admin_managed_duplicate',
  accessMethod: 'duplication_for_sharing',
  originalAgentId: ObjectId(), // Reference to user's original
  originalOwnerId: ObjectId() // Reference to original creator
}
```

**3. Specifically shared agents (from admin-owned duplicates)**

Definition: Admin-owned duplicate agents shared with you via "Specific Individuals". Access: read and execute permissions. Display: "Shared with Me" with original creator's name.

ACL entry pattern:

```javascript
{
  permBits: 1,
  roleId: ObjectId('68a26cf972d35c2c3a0f4d10'), // Shared user role
  grantedBy: [admin_id], // Admin who approved sharing
  resourceType: 'agent',
  shareType: 'specific_individual',
  accessMethod: 'admin_duplicate_share',
  originalOwnerId: ObjectId(), // Reference to original creator
  sharedDuplicateId: ObjectId() // Reference to admin-owned duplicate
}
```

**4. Global agents (automatic access)**

Definition: "All Datacom" agents that are automatically accessible. Access: read and execute permissions. Display: "My Agents" with "Global Access" badge. ACL entry created when user first accesses the agent.

ACL entry pattern:

```javascript
{
  permBits: 1,
  roleId: ObjectId('68a26cf972d35c2c3a0f4d10'),
  grantedBy: [system_or_admin],
  resourceType: 'agent',
  shareType: 'global_automatic',
  accessMethod: 'automatic_global_access',
  accessedAt: Date // When user first accessed
}
```

**5. Global agents (requested access)**

Definition: Global agents where user explicitly requested tracked access. Access: read and execute permissions. Display: "Shared with Me" with "Global Request" badge. ACL entry created when admin approves request.

ACL entry pattern:

```javascript
{
  permBits: 1,
  roleId: ObjectId('68a26cf972d35c2c3a0f4d10'),
  grantedBy: [admin_id],
  resourceType: 'agent',
  shareType: 'global_request',
  accessMethod: 'requested_global_access',
  requestId: ObjectId(), // Reference to request
  approvedAt: Date
}
```

---

## 🗂️ Enhanced ACL Schema

Full schema definition:

```javascript
{
  _id: ObjectId(),
  principalType: 'user',
  resourceType: 'agent', // or 'promptGroup'
  resourceId: ObjectId(), // MongoDB agent _id
  principalId: ObjectId(), // User _id
  principalModel: 'User',

  // PERMISSIONS
  permBits: Number, // 15=owner, 1=shared
  roleId: ObjectId(), // Role-based permissions

  // GRANTING INFO
  grantedBy: ObjectId(), // Who granted permission
  grantedAt: Date,

  // SHARING METADATA (NEW)
  shareType: String, // 'owner' | 'admin_managed_duplicate' | 'specific_individual' | 'global_automatic' | 'global_request'
  accessMethod: String, // 'creation' | 'duplication_for_sharing' | 'admin_duplicate_share' | 'automatic_global_access' | 'requested_global_access'

  // TRACKING (NEW)
  sourceAgentId: String, // Original Cosmos DB agent ID (for shared/global)
  requestId: ObjectId(), // Reference to request (for requested access)
  accessedAt: Date, // When first accessed (for automatic global)

  // DUPLICATION TRACKING (NEW)
  hasSharedDuplicate: Boolean, // true if user has shared this agent (creates duplicate)
  isAdminDuplicate: Boolean, // true if this is an admin-owned duplicate for sharing
  originalAgentId: ObjectId(), // Reference to user's original (for admin duplicates)
  originalOwnerId: ObjectId(), // Reference to original creator (for duplicates and shared access)
  sharedDuplicateId: ObjectId(), // Reference to admin-owned duplicate (for shared access)

  // STANDARD FIELDS
  createdAt: Date,
  updatedAt: Date,
  __v: 0
}
```

---

## 🔄 User Experience Flows

**1. User views "My Agents"**

```javascript
// Get user's accessible agents
const ownedAgents = await getOwnedAgents(userId);
const globalAccessAgents = await getGlobalAccessAgents(userId);

// Display with badges
const myAgentsView = [
  ...ownedAgents.map((agent) => ({
    ...agent,
    accessType: "owned",
    badge: "Owner",
    canModify: true,
  })),
  ...globalAccessAgents.map((agent) => ({
    ...agent,
    accessType: "global",
    badge: "Global Access",
    canModify: false,
  })),
];
```

**2. User views "Shared with Me"**

```javascript
// Get specifically shared agents
const specificShares = await getSpecificSharedAgents(userId);
const requestedGlobal = await getRequestedGlobalAgents(userId);

const sharedWithMeView = [
  ...specificShares.map((agent) => ({
    ...agent,
    accessType: "specific_share",
    badge: `Shared by ${agent.sharedBy}`,
    shareMethod: "Direct Share",
  })),
  ...requestedGlobal.map((agent) => ({
    ...agent,
    accessType: "global_request",
    badge: "Global Request",
    shareMethod: "Requested Access",
  })),
];
```

**3. User accesses global agent**

```javascript
// When user clicks on global agent from directory
async function accessGlobalAgent(agentId, userId) {
  // 1. Check if user already has ACL entry
  const existingAccess = await checkACLEntry(agentId, userId);

  if (!existingAccess) {
    // 2. Create automatic global access ACL entry
    await createACLEntry({
      resourceId: agentId,
      principalId: userId,
      permBits: 1,
      roleId: "68a26cf972d35c2c3a0f4d10",
      grantedBy: "system",
      shareType: "global_automatic",
      accessMethod: "automatic_global_access",
      accessedAt: new Date(),
    });
  }

  // 3. Grant access to agent
  return agent;
}
```

**4. User requests tracked global access**

```javascript
// When user wants to formally request global agent access
async function requestGlobalAgentAccess(agentId, userId, reason) {
  // 1. Create request in agent_requests collection
  const request = await createAccessRequest({
    agentId: agentId,
    requesterId: userId,
    requestType: "global_tracked_access",
    reason: reason,
    status: "pending",
  });

  // 2. Admin reviews and approves
  // 3. Create ACL entry with request reference
  await createACLEntry({
    resourceId: agentId,
    principalId: userId,
    permBits: 1,
    roleId: "68a26cf972d35c2c3a0f4d10",
    grantedBy: adminId,
    shareType: "global_request",
    accessMethod: "requested_global_access",
    requestId: request._id,
    approvedAt: new Date(),
  });
}
```

---

## 🛣️ API Endpoints

**Filter endpoints**

- `GET /api/agents?filter=owned` — Returns only agents user owns (created)
- `GET /api/agents?filter=shared` — Returns agents specifically shared with user plus requested global agents
- `GET /api/agents?filter=global-access` — Returns global agents user has automatic access to
- `GET /api/agents?filter=directory` — Returns all global agents available for discovery

**Access endpoints**

- `POST /api/agents/:id/access` — Create automatic global access ACL entry. Body: `{ "accessType": "automatic" }` or `{ "accessType": "tracked_request" }`
- `POST /api/agents/:id/request-access` — Request formal tracked access to global agent. Body: `{ "reason": "Need for customer support automation", "businessJustification": "Will improve response time" }`

**Response enhancements**

Agent response includes access metadata:

```javascript
{
  "id": "agent_123",
  "name": "Customer Support Bot",
  // ... standard fields

  // ACCESS METADATA
  "accessInfo": {
    "userAccessType": "global_automatic", // 'owned' | 'specific_share' | 'global_automatic' | 'global_request'
    "accessMethod": "automatic_global_access",
    "canModify": false,
    "canShare": false,
    "sharedBy": null, // or email if specifically shared
    "accessGrantedAt": "2025-01-15T10:30:00Z",
    "badge": "Global Access"
  }
}
```

---

## 🔄 Agent Sharing Process

**1. Sharing modal warning**

User sees confirmation about duplication. The duplicated one will be shared and they will lose access to it. They can continue using the original but changes won't show for shared people; it will need to be resubmitted.

**2. Agent duplication**

Original is duplicated. Owner continues using the original.

**3. Duplicate submitted**

Duplicate agent submitted for approval to Cosmos DB.

**4. Admin ownership transfer**

Duplicate agent's ownership changes to admin and ACL entries for duplicate go to all admins.

**5. ACL entries created**

All sharing ACL entries point to the admin-owned duplicate.

**6. Asset migration**

Files and resources copied from original to duplicate.

**Flow diagram**

```
User Clicks "Share Agent"
    ↓
Modal Warning: "Duplicate will be shared. You keep original but changes won't affect shared version"
    ↓
User Confirms Sharing
    ↓
1. Create Duplicate Agent
    ↓
2. Submit Duplicate to Cosmos DB for Approval
    ↓
3. Copy Files/Assets from Original to Duplicate
    ↓
4. Admin Reviews Duplicate
    ↓
5. Transfer Duplicate Ownership to Admin
    ↓
6. Create ACL Entries for Admin-Owned Duplicate
    ↓
7. Share Access to Duplicate with Target Users
```

---

## 📋 Implementation Phases — Phase 1: ACL Foundation

**Objectives**

Implement enhanced ACL system with admin-owned duplicate tracking. Establish proper permission management for all access types. Create foundation for duplication workflow.

**Deliverables**

- Enhanced ACL service with new `shareType` and `accessMethod` fields
- Admin ownership management for duplicated agents
- ACL entry linking between originals and duplicates
- Performance optimization for ACL queries

**Technical tasks**

1. Extend ACL service with new duplication tracking fields
2. Implement admin ownership assignment for duplicated agents
3. Add ACL relationship tracking between originals and duplicates
4. Create indexes for performance optimization
5. Add comprehensive ACL validation and testing

---

## 📋 Implementation Phases — Phase 2: Duplication System

**Objectives**

Implement agent duplication process for sharing. Create admin ownership transfer mechanism. Establish duplicate agent management infrastructure.

**Deliverables**

- Agent duplication service for sharing workflow
- Admin ownership transfer system
- Duplicate agent metadata tracking
- Asset copying integration framework

**Technical tasks**

1. Create AgentDuplicationService for sharing workflow
2. Implement admin ownership transfer during approval
3. Add duplicate agent metadata and relationship tracking
4. Create asset copying hooks (ready for provided script integration)
5. Implement duplication audit trail and logging

---

## 📋 Implementation Phases — Phase 3: Sharing Modal

**Objectives**

Create user-facing sharing modal with clear duplication warnings. Implement new sharing workflow with proper user education. Update sharing UI to reflect admin-owned duplicate concept.

**Deliverables**

- Sharing warning modal explaining duplication and ownership transfer
- Updated sharing workflow with clear user messaging
- Enhanced agent sharing forms with duplication warnings
- User education about original vs shared duplicate relationships

**Technical tasks**

1. Create SharingWarningModal with clear duplication messaging
2. Update sharing forms to explain admin ownership transfer
3. Add confirmation workflow with detailed explanations
4. Implement progress indicators for duplication and approval process
5. Add comprehensive error handling and user feedback

---

## 📋 Implementation Phases — Phase 4: API Updates

**Objectives**

Update sharing APIs to handle duplication and admin ownership. Implement admin ownership transfer during approval. Create APIs for duplicate agent management.

**Deliverables**

- Updated sharing API endpoints for duplication workflow
- Admin ownership transfer API methods
- Duplicate agent management endpoints
- Enhanced approval workflow for admin-owned duplicates

**Technical tasks**

1. Update POST /api/public-agents to create duplicates and transfer ownership
2. Enhance PUT /api/approvals/:id/approve for admin-owned duplicates
3. Create duplicate tracking and management endpoints
4. Add API validation for admin ownership transfers
5. Implement comprehensive testing for new duplication APIs

---

## 📋 Implementation Phases — Phase 5: Admin Interface

**Objectives**

Update admin interfaces to manage admin-owned duplicates. Enhance approval workflow for duplication and ownership transfer. Create tools for tracking original-duplicate relationships.

**Deliverables**

- Admin interface updates for duplicate agent management
- Enhanced approval queue showing duplication workflow
- Original-duplicate relationship tracking dashboard
- Admin tools for managing duplicated agents and ownership

**Technical tasks**

1. Update admin approval components for duplication workflow
2. Add duplicate agent indicators and relationship views in admin UI
3. Create duplication history and ownership tracking views
4. Implement admin tools for managing admin-owned duplicates
5. Add analytics for tracking sharing patterns and duplicate usage

---

## 📋 Implementation Phases — Phase 6: Tab Structure

**Objectives**

Implement enhanced tab structure with clear access type separation. Add proper badges showing original vs shared duplicate relationships. Create intuitive navigation between personal and shared agents.

**Deliverables**

- Updated 3-tab structure (My Agents | Shared with Me | Directory)
- Clear badges distinguishing personal vs shared duplicates
- Enhanced filtering and sorting for different access types
- Mobile-responsive design for new workflow

**Technical tasks**

1. Implement 3-tab structure with proper access type filtering
2. Create badge components showing original owner and sharing status
3. Add filtering for personal originals vs admin-owned shared duplicates
4. Update mobile responsive design for new sharing concepts
5. Implement user preference storage for tab and filter preferences

---

## 📋 Implementation Phases — Phase 7: Asset Integration

**Objectives**

Integrate provided asset copying script for original-to-duplicate transfer. Implement file management for admin-owned duplicates. Handle asset versioning and reference tracking.

**Deliverables**

- Asset copying script integration (original → admin duplicate)
- File reference management for admin-owned duplicates
- Asset versioning system for shared duplicates
- Asset cleanup and maintenance tools

**Technical tasks**

1. Integrate provided asset copying script for duplication workflow
2. Update file reference tracking for admin-owned duplicates
3. Implement asset versioning and backup for shared agents
4. Create asset cleanup procedures for orphaned duplicates
5. Add asset management monitoring and maintenance

---

## 📋 Implementation Phases — Phase 8: Data Migration

**Objectives**

Migrate existing shared agents to new admin-owned duplicate system. Convert legacy cloned agents to new workflow. Ensure data consistency between old and new sharing systems.

**Deliverables**

- Migration scripts for converting legacy shared agents
- Legacy cloned agent conversion to admin-owned duplicates
- Data consistency validation across all systems
- Migration rollback and recovery procedures

**Technical tasks**

1. Create migration scripts for existing legacy shared agents
2. Convert legacy cloned agents to admin-owned duplicate model
3. Implement data validation and consistency checks
4. Create rollback procedures for failed migrations
5. Implement comprehensive post-migration validation

---

## 📋 Implementation Phases — Phase 9: Testing

**Objectives**

Test all duplication and admin ownership workflows. Validate performance under load with duplicate creation. Security audit of admin ownership and ACL systems.

**Deliverables**

- Complete test suite for duplication and sharing workflows
- Performance benchmarks for admin duplicate creation
- Security audit of admin ownership transfer and ACL systems
- User acceptance testing for new sharing UX

**Technical tasks**

1. Create integration tests for duplication and admin ownership workflows
2. Implement performance testing for duplicate creation and asset copying
3. Conduct security audit of admin ownership transfer and ACL relationships
4. Execute user acceptance testing with new sharing modal and workflow
5. Create validation procedures for original-duplicate relationship integrity

---

## 📋 Implementation Phases — Phase 10: Production

**Objectives**

Deploy admin-owned duplicate system to production. Implement monitoring for duplication workflows. Create operational procedures for admin duplicate management.

**Deliverables**

- Zero-downtime deployment procedures for duplication system
- Monitoring and alerting for admin ownership workflows
- Operational runbooks for duplicate agent management
- Performance baselines and SLAs for new sharing system

**Technical tasks**

1. Create blue-green deployment procedures for duplication system
2. Implement monitoring for admin ownership transfers and duplicate creation
3. Create operational runbooks for managing admin-owned duplicates
4. Establish performance baselines for duplication and sharing workflows
5. Train operations and admin teams on new duplicate management system

---

## ✅ Success Criteria

**User experience**

- Users can clearly see what they own vs what's shared vs what's global
- Global agents remain automatically accessible
- Clear visual indicators for different access types
- Intuitive navigation between owned, shared, and global agents

**Technical implementation**

- All agent access tracked in ACL entries
- Consistent ACL entry format across all access types
- Proper audit trail for compliance
- Performance optimized for large agent libraries

**Data integrity**

- No loss of existing functionality
- Backward compatibility maintained
- Complete migration of existing shared agents
- Consistent database state

---

## 📐 Tab Structure Options

**Option A: Three-tab structure (recommended)**

```
┌─────────────┬─────────────┬─────────────┐
│ My Agents   │ Shared      │ Directory   │
│             │ with Me     │             │
└─────────────┴─────────────┴─────────────┘
```

Tab descriptions:

- **My Agents**: Agents you created or own; global agents you have access to (shows as "Global Access"); clear distinction between owned vs global access
- **Shared with Me**: Agents specifically shared with you by individuals; global agents you explicitly requested access to; shows sharing source and method
- **Directory**: Browse all global agents; request specific access to track usage; discovery and exploration

**Option B: Two-tab structure**

```
┌─────────────────────────┬─────────────┐
│ My Agents & Shared      │ Directory   │
│                         │             │
└─────────────────────────┴─────────────┘
```

Tab descriptions:

- **My Agents & Shared**: All accessible agents with clear visual indicators; sections: "Created by Me", "Shared with Me", "Global Access"
- **Directory**: Browse and discover global agents; request tracked access

---

## 📊 Permission Types

**Permission bits**

- `permBits: 15` — Owner: full permissions (read, execute, modify, share, delete)
- `permBits: 1` — Shared: read and execute only

**Share types**

- `owner` — Personal ownership
- `admin_managed_duplicate` — Admin-owned duplicate for distribution
- `specific_individual` — Direct share from admin duplicate
- `global_automatic` — Automatic access to "All Datacom" agents
- `global_request` — Requested and approved global access

**Access methods**

- `creation` — User created the agent
- `duplication_for_sharing` — Admin created duplicate for sharing
- `admin_duplicate_share` — Admin shared duplicate with user
- `automatic_global_access` — User accessed global agent (first access creates ACL)
- `requested_global_access` — Admin approved user's request for global agent

---

## 🔗 ACL Creation Triggers Summary

- **Agent creation** → Create owner ACL entry for user's original agent
- **Agent duplication for sharing** → Update original owner ACL with `hasSharedDuplicate: true`; create admin owner ACL entry for duplicate; link original and duplicate in ACL metadata
- **Specific individual approval** → Create shared ACL entries pointing to admin-owned duplicate
- **Global agent first access** → Create automatic global ACL entry
- **Global access request approval** → Create requested global ACL entry
- **Asset migration** → Copy assets from original to admin-owned duplicate

---

## 📦 Data Models

**ACL entry model**

```javascript
{
  _id: ObjectId(),
  principalType: 'user',
  resourceType: 'agent',
  resourceId: ObjectId(),
  principalId: ObjectId(),
  principalModel: 'User',
  permBits: Number,
  roleId: ObjectId(),
  grantedBy: ObjectId(),
  grantedAt: Date,
  shareType: String,
  accessMethod: String,
  sourceAgentId: String,
  requestId: ObjectId(),
  accessedAt: Date,
  hasSharedDuplicate: Boolean,
  isAdminDuplicate: Boolean,
  originalAgentId: ObjectId(),
  originalOwnerId: ObjectId(),
  sharedDuplicateId: ObjectId(),
  createdAt: Date,
  updatedAt: Date
}
```

**Access request model**

```javascript
{
  _id: ObjectId(),
  agentId: ObjectId(),
  requesterId: ObjectId(),
  requestType: 'global_tracked_access',
  reason: String,
  businessJustification: String,
  status: 'pending' | 'approved' | 'rejected',
  approvedBy: ObjectId(),
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Agent access info (response model)**

```javascript
{
  userAccessType: 'owned' | 'specific_share' | 'global_automatic' | 'global_request',
  accessMethod: String,
  canModify: Boolean,
  canShare: Boolean,
  sharedBy: String | null,
  accessGrantedAt: Date,
  badge: String
}
```

---

## 🔐 Role Identifiers

- **Owner role**: `ObjectId('68a26cfa7eed3bcd740b08d0')` — Full permissions, `permBits: 15`
- **Shared user role**: `ObjectId('68a26cf972d35c2c3a0f4d10')` — Read and execute, `permBits: 1`

---

## 👥 Team Access Patterns

**1. Individual sharing**

When an admin shares an agent with specific individuals, each recipient receives an ACL entry with `shareType: 'specific_individual'`. The `sharedDuplicateId` links to the admin-owned duplicate. The `originalOwnerId` preserves attribution to the original creator for display purposes.

**2. Global discovery**

Users browse the Directory tab to discover all global agents. First access creates an automatic ACL entry. No approval required. Optional: user may request tracked access via `POST /api/agents/:id/request-access` for formal audit trail.

**3. Resubmission workflow**

Original creator modifies their agent. Changes do not propagate to the admin-owned duplicate. Creator must resubmit for approval; admin reviews and updates the duplicate. Shared users receive the updated version after admin approval.

**4. Admin duplicate lifecycle**

Admin-owned duplicate is created when user shares. Duplicate is submitted to Cosmos DB. Admin reviews and approves. Ownership transfers to admin. ACL entries created for target users. Assets copied from original. Original creator retains their original; duplicate is invisible to them.

---

## 🗄️ Database Indexes

Recommended indexes for ACL performance:

- `{ principalId: 1, resourceType: 1 }` — User's agents by type
- `{ principalId: 1, shareType: 1 }` — Filter by access type (My Agents vs Shared with Me)
- `{ resourceId: 1, principalId: 1 }` — Check user access to specific agent
- `{ originalAgentId: 1 }` — Find duplicates of an original
- `{ sharedDuplicateId: 1 }` — Find users with access to a duplicate
- `{ grantedAt: -1 }` — Audit trail chronological queries

---

## 📝 Badge Display Rules

**My Agents tab badges**

- **Owner** — Shown for agents the user created; `shareType: 'owner'`; `canModify: true`
- **Global Access** — Shown for automatically accessible global agents; `shareType: 'global_automatic'`; `canModify: false`

**Shared with Me tab badges**

- **Shared by [name]** — Shown for specifically shared agents; `shareType: 'specific_individual'`; displays `originalOwnerId` or `sharedBy` email
- **Global Request** — Shown for requested and approved global access; `shareType: 'global_request'`; indicates formal tracked access

**Directory tab**

No badges; displays all global agents available for discovery. Users can request tracked access from this view.

---

## 🔄 Migration Checklist

- Backfill `shareType` and `accessMethod` on existing ACL entries
- Map legacy cloned agents to admin-owned duplicate model
- Validate `originalOwnerId` and `sharedDuplicateId` references
- Run consistency checks across MongoDB and Cosmos DB
- Document rollback procedure for failed migrations
- Execute post-migration validation suite
- Verify no orphaned ACL entries reference deleted agents
- Confirm audit trail completeness for compliance review

---

## 📌 Document Footer

📌 **Document Type:** Presentation — Agent Access System
📅 **Last Updated:** 28 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40070512927
