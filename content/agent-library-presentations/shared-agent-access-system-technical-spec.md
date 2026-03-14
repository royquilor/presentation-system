# Shared Agent Access System — Technical Specification

> A comprehensive technical blueprint for implementing proper distinction between owned agents and shared agents, request-based access for global agents, and a unified "Shared with Me" experience.

**Author:** Dipesh Trikam
**Date:** 26 August 2025
**Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40063139947

---

## Table of Contents

1. Overview — Purpose and Goals
2. Current System Analysis
3. High-Level Architecture Diagram
4. Agent Access States Diagram
5. MongoDB Collection: agents — Schema
6. MongoDB Collection: agent_requests — Enhanced Schema
7. MongoDB Collection: aclentries — Enhanced Schema
8. Cosmos DB Container: PublicAgents
9. API: GET /api/agent-requests — Enhanced
10. API: PUT /api/agent-requests/:id — Enhanced Process
11. API: POST /api/agent-requests/global-access — New Endpoint
12. API: GET /api/shared-with-me — Enhanced Response
13. API: PUT /api/approvals/:id/approve — Enhanced Logic
14. Client: Agent Directory — Filter State and UI
15. Client: AgentAccessState Enum and Logic
16. Client: Agent Card — Visual Indicators
17. Client: AccessRequestModal — Component Interface
18. Admin: Agent Management — Tab Integration
19. Admin: AccessRequestManagement — Component
20. Access Control Matrix
21. Permission Levels — ACL System
22. Security Validations
23. API Security Middleware
24–26. Workflows (Specific, Global, Shared with Me)
27–31. Implementation Phases 1–5
32–35. Migration Strategy
36–39. Testing Strategy
40–44. Monitoring and Observability
45–48. Success Criteria

---

## 🎯 Context

This specification defines the implementation of a comprehensive shared agent access system for the Agent Library platform within Datacom's Insights & Analytics team. The system provides proper distinction between owned agents and shared agents, implements request-based access for global agents, and creates a unified "Shared with Me" experience. The approach follows an extend-don't-replace philosophy, building on existing MongoDB and Cosmos DB infrastructure rather than creating parallel systems.

---

## 🔍 Problem

The current system has several critical shortcomings. Cloned agents appear as "My Agents" instead of "Shared with Me," making owned and shared agents visually identical. Global agents are automatically accessible to all users in the Agent Library but not in DatacomChat, creating inconsistent access patterns. There is no clear distinction between owned versus shared access, and the system lacks a proper audit trail for sharing and access grants. These issues create user confusion, compliance gaps, and inconsistent behaviour between specific-person and organisation-wide sharing.

---

## 📋 Observations

**1. Dual database architecture**

MongoDB holds personal agents, user data, ACL entries, and agent requests. Cosmos DB remains the source of truth for publicly shared agents. The proposed changes add new fields to MongoDB without modifying Cosmos DB schema. The existing Cosmos DB ↔ MongoDB reference patterns are preserved throughout.

**2. Five agent access states**

The system defines five distinct states: Agent Created (Private), User Shares Agent, Admin Reviews Submission, Approved for Specific Users (Direct Access Granted / Cloned), Approved for Global Discovery (Request-Based Access Required), and Rejected. Global agents require users to request access before receiving a cloned copy.

**3. New MongoDB fields on agents collection**

The `agents` collection gains `isSharedAccess`, `shareType`, `sharedBy`, `accessGrantedAt`, `accessGrantedBy`, and `accessRequestId`. These fields cleanly separate owned agents from access-granted copies and support both specific-individual and global-request sharing types.

**4. Enhanced agent_requests collection**

The `agent_requests` collection is extended with `requestType`, `agentName`, `agentAuthor`, `agentCategory`, `requestReason`, `businessJustification`, `reviewDate`, `reviewedBy`, `adminNotes`, `createdAgentId`, and `isActive`. This unifies sharing approvals and global access requests into a single admin workflow.

**5. Enhanced aclentries for audit trail**

New fields include `accessType`, `sourceRequestId`, `grantedBy`, `expiresAt`, `isActive`, and `accessHistory`. These support complete tracking of all sharing and access grants with full audit capability.

**6. New API endpoint for global access requests**

`POST /api/agent-requests/global-access` allows users to explicitly request access to global agents. The enhanced `PUT /api/agent-requests/:id` handles clone creation, ACL entry creation, and email notification on approval.

**7. Modified approval logic for global agents**

When an agent is approved for "All Datacom," the system approves in Cosmos DB for discovery but does not create automatic access. Users must request access via the new endpoint. A notification is sent when the agent becomes available for request.

**8. Client UI enhancements**

The agent directory gains filtering for "All Agents," "My Agents," "Shared with Me," "Available to Request," and "My Access Requests." Agent cards display visual indicators (badges, buttons) based on access state. A new `AccessRequestModal` component captures reason and business justification.

**9. Admin UI integration**

A new "Access Requests" tab is added to Agent Management alongside Agent Submissions. The `AccessRequestManagement` component provides stats cards, search, status filtering, and review modal for approving or rejecting requests.

**10. Implementation phased over 10 weeks**

Phase 1 (Week 1–2): Database foundation. Phase 2 (Week 3–4): API enhancement. Phase 3 (Week 5–6): Admin interface. Phase 4 (Week 7–8): Client interface. Phase 5 (Week 9–10): Testing and migration.

**11. Migration strategy for existing data**

A migration script identifies cloned agents via `clonedFrom` or `originalAgentId`, sets `isSharedAccess: true` and `shareType: "specific_individual"`, and creates corresponding ACL entries. Validation and rollback scripts are provided.

**12. Success criteria defined**

Functional, performance, security, and user experience requirements are documented with checklists. Targets include sub-1-second shared-with-me queries, 10,000+ agent directory filtering, and 100+ concurrent admin approval requests.

---

## 💡 Proposal

Extend the existing system with new database fields, enhanced API endpoints, and a new "Shared with Me" UI section rather than rebuilding from scratch. Global agents will require explicit request and approval for access, with all sharing and access events flowing through a unified admin dashboard. The solution preserves the existing approval workflow while adding global access request management alongside it. All changes maintain references between Cosmos DB and MongoDB and follow established UI patterns.

---

## ⚠️ Risks

**Data migration complexity** — Existing cloned agents in users' "My Agents" must be migrated to the new `isSharedAccess` pattern without breaking existing access or workflows. The migration script assumes legacy agents were specific-individual shares.

**Race conditions** — Concurrent approval and access requests against the same agent could create duplicate ACL entries or inconsistent database state. Explicit prevention strategies such as optimistic locking or transaction boundaries are needed.

**Cosmos DB ↔ MongoDB consistency** — The dual-database pattern introduces potential for reference drift if a Cosmos DB agent is deleted while MongoDB `agent_requests` or cloned agents still reference it. Orphaned references require handling.

**Performance at scale untested** — The 10,000+ agent directory filter target is aspirational. Real-world indexing strategy for MongoDB queries needs validation under load.

**Admin workflow burden** — Global agents will generate additional access requests for admin review. High-volume scenarios may require bulk operations and SLA expectations.

---

## ✅ Next Steps

1. **Database schema implementation** — Add new fields to `agents`, `agent_requests`, and `aclentries` collections. Create migration scripts and performance indexes.

2. **API development** — Implement enhanced `GET /api/agent-requests`, `PUT /api/agent-requests/:id`, new `POST /api/agent-requests/global-access`, and enhanced `GET /api/shared-with-me`. Modify `PUT /api/approvals/:id/approve` logic.

3. **Admin interface** — Add Access Requests tab to Agent Management. Build `AccessRequestManagement` and `AccessRequestReviewModal` components.

4. **Client interface** — Add share filter dropdown, `AgentAccessState` logic, enhanced agent cards with badges, and `AccessRequestModal` component.

5. **Migration execution** — Run data migration for existing cloned agents. Validate migration completeness. Prepare rollback plan.

6. **Testing and validation** — Execute unit, integration, and performance tests. Validate all success criteria before deployment.

---

## 🔑 Close

> This specification provides a comprehensive blueprint for implementing the shared agent access system. Each section can be used as a reference during implementation to ensure all requirements are met and the system is built according to the planned architecture.

The solution delivers clear UX distinction between owned, shared, and global agents while maintaining full audit traceability and backward compatibility. It extends rather than replaces existing infrastructure, preserving the established Cosmos DB ↔ MongoDB reference patterns and admin approval workflows.

---

## 1. Overview — Purpose and Goals

**1. Purpose**

This specification defines the implementation of a comprehensive shared agent access system that provides proper distinction between owned agents and shared agents, implements request-based access for global agents, and creates a unified "Shared with Me" experience.

**2. Goals**

- Clear Access Distinction: Users can distinguish between agents they own vs. agents shared with them.
- Controlled Global Access: Global agents require explicit request and approval for access.
- Unified Admin Experience: Global access requests integrated into existing admin approval workflow.
- Proper Data Architecture: Clean separation between personal and shared agent access using established patterns.
- Audit Trail: Complete tracking of all sharing and access grants.

**3. Key Principles**

- Extend, Don't Replace: Build on existing systems rather than creating parallel infrastructure.
- Maintain References: Preserve existing Cosmos DB ↔ MongoDB reference patterns.
- Consistent UX: Follow established UI patterns for admin and user interfaces.
- Data Integrity: Ensure consistency between databases and prevent race conditions.

---

## 2. Current System Analysis

**1. Existing data flow**

User Creates Agent → MongoDB agents collection. User Shares Agent → POST /api/public-agents → Cosmos DB PublicAgents. Admin Approves → Agent available globally + Cloned to recipients (for specific sharing).

**2. Current database architecture**

- MongoDB: Personal agents, user data, ACL entries, agent requests.
- Cosmos DB: Public shared agents (source of truth for shared content).

**3. Current issues**

- Cloned agents appear as "My Agents" instead of "Shared with Me."
- Global agents automatically accessible to all users in agent library but not DatacomChat.
- No clear distinction between owned vs. shared access.
- Inconsistent access patterns between specific and global sharing.

---

## 3. High-Level Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Client   │    │  Admin Client   │    │   APIs          │
│                 │    │                 │    │                 │
│ • Agent Directory│    │ • Submissions   │    │ • /agents       │
│ • Shared w/ Me  │    │ • Access Reqs   │    │ • /approvals    │
│ • Request Access│    │ • Approval Flow │    │ • /agent-reqs   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Cosmos DB     │    │   ACL System    │
│                 │    │                 │    │                 │
│ • agents        │    │ • PublicAgents  │    │ • aclentries    │
│ • agent_requests│    │ (source of      │    │ • permissions   │
│ • users         │    │  truth)         │    │ • audit trail   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 4. Agent Access States Diagram

```
┌─────────────────┐
│ Agent Created   │
│ (Private)       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐      ┌─────────────────┐
│ User Shares     │ ────▶│ Admin Reviews   │
│ Agent           │      │ Submission      │
└─────────────────┘      └─────────┬───────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Approved for    │      │ Approved for    │      │ Rejected        │
│ Specific Users  │      │ Global Discovery│      │                 │
└─────────┬───────┘      └─────────┬───────┘      └─────────────────┘
          │                        │
          ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│ Direct Access   │      │ Request-Based   │
│ Granted         │      │ Access Required │
│ (Cloned)        │      │                 │
└─────────────────┘      └─────────┬───────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ User Requests   │
                         │ Access          │
                         └─────────┬───────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ Admin Approves  │
                         │ Access Request  │
                         └─────────┬───────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ Access Granted  │
                         │ (Cloned)        │
                         └─────────────────┘
```

---

## 5. MongoDB Collection: agents — Schema

**1. Full schema with new fields**

```javascript
{
  // === EXISTING FIELDS (unchanged) ===
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  type: String,
  author: String,
  authorId: String,
  instructions: String,
  provider: String,
  model: String,
  tools: Array,
  agent_ids: Array,
  sharing: String,                   // "Private" | "All Datacom" | "Specific Individuals"
  specificIndividuals: Array,
  createdAt: Date,
  updatedAt: Date,

  // === EXISTING SHARING FIELDS (keep for compatibility) ===
  publicAgentId: String,             // Reference to Cosmos DB agent
  originalAgentId: String,           // Reference to source agent
  clonedFrom: String,                // Legacy cloning reference
  clonedBy: String,                  // Who cloned this agent
  clonedAt: Date,                    // When cloned

  // === NEW FIELDS ===
  isSharedAccess: Boolean,           // true if this is shared access (not owned)
  shareType: String,                 // "specific_individual" | "global_request"
  sharedBy: String,                  // Email of person who originally shared
  accessGrantedAt: Date,             // When access was granted
  accessGrantedBy: String,           // Admin who granted access (for global requests)
  accessRequestId: String,           // Reference to agent_requests entry (for global)

  // === ENHANCED FIELDS ===
  compliance: {
    noCredentials: Boolean,
    noSensitiveData: Boolean
  },
  rating: {
    average: Number,
    count: Number,
    userRatings: Object
  }
}
```

**2. Indexes required**

```javascript
// New indexes for performance
db.agents.createIndex({ isSharedAccess: 1, author: 1 });
db.agents.createIndex({ shareType: 1, accessGrantedAt: -1 });
db.agents.createIndex({ publicAgentId: 1 });
db.agents.createIndex({ originalAgentId: 1 });
```

---

## 6. MongoDB Collection: agent_requests — Enhanced Schema

```javascript
{
  // === EXISTING FIELDS ===
  _id: ObjectId,
  requesterId: String,               // User ID requesting access
  requesterEmail: String,            // User email
  originalAgentId: String,           // Reference to source agent (Cosmos DB)
  status: String,                    // "pending" | "approved" | "rejected"
  requestDate: Date,

  // === NEW FIELDS ===
  requestType: String,               // "access_request" | "global_access"
  agentName: String,                 // Display name for admin UI
  agentAuthor: String,               // Original agent creator
  agentCategory: String,             // For filtering/display
  requestReason: String,             // Why user needs access
  businessJustification: String,     // Business case for access

  // === ADMIN WORKFLOW FIELDS ===
  reviewDate: Date,                  // When reviewed by admin
  reviewedBy: String,                // Admin who reviewed
  adminNotes: String,                // Admin's decision notes

  // === TRACKING FIELDS ===
  createdAgentId: String,            // MongoDB agent created when approved
  isActive: Boolean,                 // For soft deletion

  // === METADATA ===
  userAgent: String,                 // Browser/client info
  ipAddress: String,                 // Request origin
}
```

---

## 7. MongoDB Collection: aclentries — Enhanced Schema

```javascript
{
  // === EXISTING FIELDS ===
  _id: ObjectId,
  resourceId: String,                // Agent ID being accessed
  principalId: String,               // User ID with access
  permBits: Number,                  // Permission bits
  createdAt: Date,
  updatedAt: Date,

  // === NEW FIELDS ===
  accessType: String,                // "direct_share" | "global_request" | "cloned_access"
  sourceRequestId: String,           // Reference to agent_requests if applicable
  grantedBy: String,                 // Admin who granted access
  expiresAt: Date,                   // Optional access expiration
  isActive: Boolean,                 // Active status

  // === AUDIT FIELDS ===
  accessHistory: Array               // Track access patterns
}
```

---

## 8. Cosmos DB Container: PublicAgents

**1. No schema changes**

This remains the source of truth for shared agents. No schema changes required — existing pattern works.

```javascript
{
  id: String,                        // Unique agent ID
  name: String,
  description: String,
  // ... all existing fields remain unchanged
  status: String,                    // "pending" | "approved" | "rejected"
  sharing: String,                   // "All Datacom" | "Specific Individuals"
}
```

---

## 9. API: GET /api/agent-requests — Enhanced

**1. Query parameters**

```http
GET /api/agent-requests?type=global_access&status=pending&limit=50
```

**2. Response schema**

```json
{
  "success": true,
  "data": [
    {
      "id": "req_123",
      "requestType": "global_access",
      "requesterEmail": "user@datacom.com",
      "requesterName": "John Doe",
      "agentName": "Customer Support Bot",
      "agentAuthor": "jane.smith@datacom.com",
      "agentCategory": "Customer Support",
      "requestReason": "Need for handling customer inquiries",
      "businessJustification": "Will reduce response time by 40%",
      "requestDate": "2024-01-15T10:30:00Z",
      "status": "pending"
    }
  ],
  "count": 1,
  "totalCount": 25
}
```

---

## 10. API: PUT /api/agent-requests/:id — Enhanced Process

**1. Request body**

```json
PUT /api/agent-requests/req_123
{
  "status": "approved",
  "adminNotes": "Approved for customer support team use",
  "processedBy": "admin@datacom.com"
}
```

**2. Enhanced approval process**

1. Get source agent from Cosmos DB.
2. Clone agent to MongoDB with new sharing fields.
3. Create ACL entry for access tracking.
4. Send notification to requester.
5. Update request status.

---

## 11. API: POST /api/agent-requests/global-access — New Endpoint

**1. Request schema**

```json
POST /api/agent-requests/global-access
{
  "agentId": "cosmos_agent_123",
  "requestReason": "Need for customer support automation",
  "businessJustification": "Will improve response time by 50%"
}
```

**2. Response schema**

```json
{
  "success": true,
  "data": {
    "requestId": "req_456",
    "status": "pending",
    "estimatedReviewTime": "2-3 business days"
  },
  "message": "Access request submitted successfully"
}
```

---

## 12. API: GET /api/shared-with-me — Enhanced Response

```json
{
  "success": true,
  "data": [
    {
      "id": "agent_789",
      "name": "Customer Support Bot",
      "description": "Automated customer inquiry handler",
      "itemType": "agent",
      "author": "jane.smith@datacom.com",
      "sharedBy": "jane.smith@datacom.com",
      "receivedAt": "2024-01-15T14:30:00Z",
      "shareType": "specific_individual",
      "accessMethod": "direct_share",
      "originalAgentId": "cosmos_agent_123"
    },
    {
      "id": "agent_790",
      "name": "Data Analysis Helper",
      "description": "SQL query assistance tool",
      "itemType": "agent",
      "author": "bob.wilson@datacom.com",
      "sharedBy": "bob.wilson@datacom.com",
      "receivedAt": "2024-01-14T09:15:00Z",
      "shareType": "global_request",
      "accessMethod": "requested_access",
      "originalAgentId": "cosmos_agent_124",
      "accessGrantedBy": "admin@datacom.com"
    }
  ],
  "count": 2
}
```

---

## 13. API: PUT /api/approvals/:id/approve — Enhanced Logic

**1. Specific Individuals sharing (unchanged)**

```javascript
if (agent.sharing === "Specific Individuals") {
  // 1. Approve in Cosmos DB
  await publicAgentsService.approveAgent(id, approvedBy);

  // 2. Create cloned access for each recipient
  for (const userEmail of targetUserEmails) {
    const clonedAgent = await createSharedAccess({
      originalAgentId: agent.id,
      recipientEmail: userEmail,
      shareType: "specific_individual",
      sharedBy: agent.submittedBy,
      accessGrantedBy: approvedBy,
    });
  }
}
```

**2. All Datacom sharing (NEW behaviour)**

```javascript
if (agent.sharing === "All Datacom") {
  // 1. Approve in Cosmos DB for discovery
  await publicAgentsService.approveAgent(id, approvedBy);

  // 2. DO NOT create automatic access
  // 3. Users must request access via /api/agent-requests/global-access

  // 4. Send notification about availability
  await emailService.sendGlobalAgentAvailableNotification({
    agentName: agent.name,
    agentAuthor: agent.submittedBy,
  });
}
```

---

## 14. Client: Agent Directory — Filter State and UI

**1. Enhanced filter state**

```typescript
const [shareFilter, setShareFilter] = useState<
  "all" | "owned" | "shared-with-me" | "available-to-request" | "my-requests"
>("all");
```

**2. Filter UI component**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      <FilterIcon className="w-4 h-4 mr-2" />
      Access Type: {shareFilter}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => setShareFilter("all")}>
      All Agents
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setShareFilter("owned")}>
      My Agents
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setShareFilter("shared-with-me")}>
      Shared with Me
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setShareFilter("available-to-request")}>
      Available to Request
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setShareFilter("my-requests")}>
      My Access Requests
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 15. Client: AgentAccessState Enum and Logic

**1. Enum definition**

```typescript
enum AgentAccessState {
  OWNED = "owned",                   // User created this agent
  ACCESSIBLE = "accessible",         // User has access (in "Shared with Me")
  REQUEST_REQUIRED = "request_required", // Global agent, needs request
  REQUESTED = "requested",           // User requested access, pending
  SPECIFIC_PENDING = "specific_pending", // Specifically shared, pending admin approval
}
```

**2. State determination logic**

```typescript
const determineAgentAccessState = (agent: Agent, currentUserEmail: string) => {
  if (
    agent.author === currentUserEmail ||
    agent.authorContact === currentUserEmail
  ) {
    return AgentAccessState.OWNED;
  }

  if (agent.isSharedAccess) {
    return AgentAccessState.ACCESSIBLE;
  }

  if (agent.sharing === "All Datacom" && agent.status === "approved") {
    if (hasPendingRequest(agent.id, currentUserEmail)) {
      return AgentAccessState.REQUESTED;
    }
    return AgentAccessState.REQUEST_REQUIRED;
  }

  if (agent.sharing === "Specific Individuals" && agent.status === "pending") {
    if (agent.specificIndividuals?.includes(currentUserEmail)) {
      return AgentAccessState.SPECIFIC_PENDING;
    }
  }

  return AgentAccessState.REQUEST_REQUIRED;
};
```

---

## 16. Client: Agent Card — Visual Indicators

**1. Accessible state badges**

```tsx
{
  agentAccessState === AgentAccessState.ACCESSIBLE && (
    <Badge variant="secondary" className="mb-2">
      {agent.shareType === "global_request" && (
        <>
          <Globe className="w-3 h-3 mr-1" />
          Global Access
        </>
      )}
      {agent.shareType === "specific_individual" && (
        <>
          <Users className="w-3 h-3 mr-1" />
          Shared by {agent.sharedBy}
        </>
      )}
    </Badge>
  );
}
```

**2. Request required button**

```tsx
{
  agentAccessState === AgentAccessState.REQUEST_REQUIRED && (
    <Button
      variant="outline"
      size="sm"
      onClick={() => openAccessRequestModal(agent)}
      className="w-full"
    >
      <Key className="w-4 h-4 mr-2" />
      Request Access
    </Button>
  );
}
```

**3. Requested state badge**

```tsx
{
  agentAccessState === AgentAccessState.REQUESTED && (
    <Badge variant="yellow" className="mb-2">
      <Clock className="w-3 h-3 mr-1" />
      Access Requested
    </Badge>
  );
}
```

---

## 17. Client: AccessRequestModal — Component Interface

```typescript
interface AccessRequestModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccessRequestData) => Promise<void>;
}

interface AccessRequestData {
  agentId: string;
  requestReason: string;
  businessJustification: string;
}

export function AccessRequestModal({
  agent,
  isOpen,
  onClose,
  onSubmit,
}: AccessRequestModalProps) {
  const [requestReason, setRequestReason] = useState("");
  const [businessJustification, setBusinessJustification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Access to {agent.name}</DialogTitle>
          <DialogDescription>
            Please provide information about why you need access to this agent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">
              Why do you need access to this agent?
            </Label>
            <Textarea
              id="reason"
              placeholder="Describe how you plan to use this agent..."
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="justification">Business Justification</Label>
            <Textarea
              id="justification"
              placeholder="Explain the business value or impact..."
              value={businessJustification}
              onChange={(e) => setBusinessJustification(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onSubmit({
                agentId: agent.id,
                requestReason,
                businessJustification,
              })
            }
            disabled={
              !requestReason.trim() ||
              !businessJustification.trim() ||
              isSubmitting
            }
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 18. Admin: Agent Management — Tab Integration

```tsx
<Tabs value={selectedTab} onValueChange={setSelectedTab}>
  <TabsList>
    <TabsTrigger value="submissions">
      Agent Submissions
      {pendingSubmissions > 0 && (
        <Badge variant="secondary" className="ml-2">
          {pendingSubmissions}
        </Badge>
      )}
    </TabsTrigger>
    <TabsTrigger value="access-requests">
      Access Requests
      {pendingAccessRequests > 0 && (
        <Badge variant="secondary" className="ml-2">
          {pendingAccessRequests}
        </Badge>
      )}
    </TabsTrigger>
  </TabsList>

  <TabsContent value="submissions">
    {/* Existing agent submission management */}
  </TabsContent>

  <TabsContent value="access-requests">
    <AccessRequestManagement />
  </TabsContent>
</Tabs>
```

---

## 19. Admin: AccessRequestManagement — Component

```typescript
interface AccessRequest {
  id: string;
  requestType: "global_access";
  requesterEmail: string;
  requesterName: string;
  agentName: string;
  agentAuthor: string;
  agentCategory: string;
  requestReason: string;
  businessJustification: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

export function AccessRequestManagement() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
    null
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Additional stat cards... */}
      </div>

      {/* Request List */}
      <Card>
        <CardHeader>
          <CardTitle>Access Requests</CardTitle>
          <div className="flex space-x-2">
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <AccessRequestCard
                key={request.id}
                request={request}
                onReview={(request) => {
                  setSelectedRequest(request);
                  setIsReviewModalOpen(true);
                }}
                onQuickApprove={(requestId) => handleQuickApprove(requestId)}
                onQuickReject={(requestId) => handleQuickReject(requestId)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <AccessRequestReviewModal
        request={selectedRequest}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onApprove={(requestId, notes) => handleApprove(requestId, notes)}
        onReject={(requestId, reason) => handleReject(requestId, reason)}
      />
    </div>
  );
}
```

---

## 20. Access Control Matrix (Converted to Bullets)

**User roles and permissions**

- Regular User: Personal Agents — Full Access. Shared Agents (Specific) — Read/Execute. Global Agents — Request Required. Admin Functions — None.
- Agent Creator: Personal Agents — Full Access. Shared Agents (Specific) — Manage Sharing. Global Agents — Request Required. Admin Functions — None.
- Admin: Personal Agents — View Only. Shared Agents (Specific) — Full Management. Global Agents — Full Management. Admin Functions — All Functions.

---

## 21. Permission Levels — ACL System

```javascript
const AGENT_PERMISSIONS = {
  READ: 1,      // Can view agent details
  EXECUTE: 2,   // Can use agent
  MODIFY: 4,    // Can edit agent (owner only)
  SHARE: 8,     // Can share agent (owner only)
  DELETE: 16,   // Can delete agent (owner only)
  ADMIN: 32,    // Admin operations
};
```

---

## 22. Security Validations

**1. Authentication required**

All API endpoints require valid JWT token. Token validation includes user email and permissions.

**2. Authorization checks**

Agent access validated against ACL entries. Sharing permissions verified before granting access. Admin operations require admin role.

**3. Data validation**

All input sanitized and validated. File upload security for agent attachments. Rate limiting on access requests.

**4. Audit trail**

All access grants logged to ACL entries. Admin actions tracked with user ID and timestamp. Failed access attempts logged for security monitoring.

---

## 23. API Security Middleware — validateAgentAccess

```javascript
const validateAgentAccess = async (req, res, next) => {
  const { agentId } = req.params;
  const userEmail = req.user.email;

  // Check if user owns the agent
  const ownedAgent = await agentService.getAgentById(agentId, userEmail);
  if (ownedAgent) {
    req.agentAccess = { level: "owner", agent: ownedAgent };
    return next();
  }

  // Check ACL entries for shared access
  const aclEntry = await aclService.getUserAgentAccess(userEmail, agentId);
  if (aclEntry && aclEntry.isActive) {
    req.agentAccess = { level: "shared", permissions: aclEntry.permBits };
    return next();
  }

  // No access
  return res.status(403).json({ error: "Insufficient permissions" });
};
```

---

## 24. Workflow 1: Specific Individual Sharing

```
┌─────────────────┐
│ User Shares     │
│ Agent with      │
│ Specific Users  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Agent Submitted │
│ to Cosmos DB    │
│ (via /api/      │
│ public-agents)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Admin Reviews   │
│ Submission      │
│ (existing UI)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐      ┌─────────────────┐
│ Admin Approves  │ ────▶│ For Each        │
│ Submission      │      │ Target User:    │
└─────────────────┘      └─────────┬───────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ Clone Agent to  │
                         │ MongoDB with:   │
                         │ • isSharedAccess│
                         │ • shareType     │
                         │ • sharedBy      │
                         └─────────┬───────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ Create ACL      │
                         │ Entry for       │
                         │ Access Tracking │
                         └─────────┬───────┘
                                   │
                                   ▼
                         ┌─────────────────┐
                         │ Send            │
                         │ Notification    │
                         │ to User         │
                         └─────────────────┘
```

---

## 25. Workflow 2: Global Agent Access Request

```
┌─────────────────┐
│ User Shares     │
│ Agent Globally  │
│ ("All Datacom") │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Agent Submitted │
│ to Cosmos DB    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Admin Approves  │
│ for Discovery   │
│ (NOT access)    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Agent Visible   │
│ in Directory    │
│ with "Request   │
│ Access" Button  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Clicks     │
│ "Request Access"│
│ Button          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Access Request  │
│ Modal Opens     │
│ (reason +       │
│ justification)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ POST /api/agent-│
│ requests/global-│
│ access          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Request Added   │
│ to Admin        │
│ "Access Reqs"   │
│ Tab             │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐      ┌─────────────────┐
│ Admin Reviews   │ ────▶│ Admin Rejects   │
│ in Enhanced     │      │ Request         │
│ Admin UI        │      └─────────────────┘
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Admin Approves  │
│ Request         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Clone Agent to  │
│ MongoDB with:   │
│ • isSharedAccess│
│ • shareType:    │
│   "global_req"  │
│ • accessReqId   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Create ACL      │
│ Entry           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Send Approval   │
│ Notification    │
│ to User         │
└─────────────────┘
```

---

## 26. Workflow 3: Shared with Me Display

```
┌─────────────────┐
│ User Navigates  │
│ to Directory    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ User Selects    │
│ "Shared with Me"│
│ Filter          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ GET /api/       │
│ shared-with-me  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ API Queries:    │
│ • MongoDB agents│
│   with          │
│   isSharedAccess│
│ • Filters by    │
│   current user  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Returns Agents  │
│ with Metadata:  │
│ • shareType     │
│ • sharedBy      │
│ • accessMethod  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ UI Displays     │
│ with Visual     │
│ Indicators:     │
│ • Share badges  │
│ • Source info   │
└─────────────────┘
```

---

## 27. Implementation Phase 1 — Database Foundation (Week 1–2)

**Objectives**

Set up enhanced database schema. Create migration scripts. Implement new data models.

**Deliverables**

- Enhanced MongoDB collections with new fields.
- Database migration scripts.
- Enhanced ACL service methods.
- Data validation schemas.
- Performance indexes.

**Technical tasks**

1. Add new fields to `agents` collection.
2. Enhance `agent_requests` collection schema.
3. Create database migration script for existing data.
4. Add performance indexes.
5. Update data models and validation schemas.

---

## 28. Implementation Phase 2 — API Enhancement (Week 3–4)

**Objectives**

Extend existing API endpoints. Implement new access request endpoints. Enhance admin approval workflow.

**Deliverables**

- Enhanced `/api/agent-requests` endpoints.
- New `/api/agent-requests/global-access` endpoint.
- Modified approval logic in `/api/approvals`.
- Enhanced `/api/shared-with-me` endpoint.
- Updated API documentation.

**Technical tasks**

1. Extend existing agent-requests API.
2. Create global access request endpoint.
3. Modify approval workflow for global agents.
4. Enhance shared-with-me endpoint response.
5. Add comprehensive API testing.

---

## 29. Implementation Phase 3 — Admin Interface (Week 5–6)

**Objectives**

Integrate access request management into existing admin UI. Create unified approval workflow. Add monitoring and analytics.

**Deliverables**

- Enhanced Agent Management page with new tab.
- Access request review interface.
- Bulk approval operations.
- Admin analytics dashboard.
- Email notification templates.

**Technical tasks**

1. Add "Access Requests" tab to Agent Management.
2. Create access request review components.
3. Implement bulk operations.
4. Add email notification system.
5. Create admin analytics views.

---

## 30. Implementation Phase 4 — Client Interface (Week 7–8)

**Objectives**

Add "Shared with Me" filtering to directory. Implement access request flow. Enhance agent display with sharing indicators.

**Deliverables**

- Enhanced agent directory with sharing filters.
- Access request modal and flow.
- Enhanced agent cards with sharing indicators.
- User dashboard for tracking requests.
- Mobile-responsive design updates.

**Technical tasks**

1. Add filtering options to agent directory.
2. Create access request modal component.
3. Enhance agent cards with sharing badges.
4. Add request tracking for users.
5. Implement responsive design improvements.

---

## 31. Implementation Phase 5 — Testing and Migration (Week 9–10)

**Objectives**

Comprehensive testing of all functionality. Data migration from existing system. Performance optimization.

**Deliverables**

- Complete test suite (unit, integration, e2e).
- Data migration execution.
- Performance optimization.
- Security audit.
- User acceptance testing.

**Technical tasks**

1. Create comprehensive test suite.
2. Execute data migration.
3. Performance testing and optimization.
4. Security audit and penetration testing.
5. User acceptance testing with stakeholders.

---

## 32. Migration — Step 1: Existing Data Analysis

```sql
-- Identify existing cloned agents
SELECT
  _id, name, author, clonedFrom, clonedBy, clonedAt,
  originalAgentId, publicAgentId
FROM agents
WHERE clonedFrom IS NOT NULL OR originalAgentId IS NOT NULL;

-- Count affected records
SELECT
  COUNT(*) as total_cloned_agents,
  COUNT(DISTINCT clonedFrom) as unique_source_agents
FROM agents
WHERE clonedFrom IS NOT NULL;
```

---

## 33. Migration — Step 2: Migration Script

```javascript
async function migrateExistingSharedAgents() {
  const clonedAgents = await db
    .collection("agents")
    .find({
      $or: [
        { clonedFrom: { $exists: true } },
        { originalAgentId: { $exists: true } },
      ],
    })
    .toArray();

  for (const agent of clonedAgents) {
    await db.collection("agents").updateOne(
      { _id: agent._id },
      {
        $set: {
          isSharedAccess: true,
          shareType: "specific_individual",
          sharedBy: agent.clonedBy || "system",
          accessGrantedAt: agent.clonedAt || agent.createdAt,
          accessGrantedBy: "migration-script",
        },
      }
    );

    await db.collection("aclentries").insertOne({
      resourceId: agent.originalAgentId || agent.clonedFrom,
      principalId: agent.authorId,
      permBits: PERMISSIONS.READ_EXECUTE,
      accessType: "migrated_access",
      createdAt: new Date(),
      isActive: true,
    });
  }
}
```

---

## 34. Migration — Step 3: Validation Script

```javascript
async function validateMigration() {
  const unmigrated = await db
    .collection("agents")
    .find({
      $and: [
        {
          $or: [
            { clonedFrom: { $exists: true } },
            { originalAgentId: { $exists: true } },
          ],
        },
        { isSharedAccess: { $ne: true } },
      ],
    })
    .count();

  if (unmigrated > 0) {
    throw new Error(`Migration incomplete: ${unmigrated} agents not migrated`);
  }

  const aclCount = await db
    .collection("aclentries")
    .find({
      accessType: "migrated_access",
    })
    .count();

  console.log(`✅ Migration successful: ${aclCount} ACL entries created`);
}
```

---

## 35. Migration — Rollback Plan

```javascript
async function rollbackMigration() {
  await db.collection("agents").updateMany(
    { isSharedAccess: true },
    {
      $unset: {
        isSharedAccess: 1,
        shareType: 1,
        sharedBy: 1,
        accessGrantedAt: 1,
        accessGrantedBy: 1,
        accessRequestId: 1,
      },
    }
  );

  await db.collection("aclentries").deleteMany({
    accessType: "migrated_access",
  });

  console.log("✅ Migration rolled back successfully");
}
```

---

## 36. Unit Tests — Database Layer

```javascript
describe("Enhanced Agent Service", () => {
  test("should create shared access agent", async () => {
    const sharedAgent = await agentService.createSharedAccess({
      originalAgentId: "cosmos_123",
      recipientEmail: "user@datacom.com",
      shareType: "specific_individual",
      sharedBy: "owner@datacom.com",
    });

    expect(sharedAgent.isSharedAccess).toBe(true);
    expect(sharedAgent.shareType).toBe("specific_individual");
    expect(sharedAgent.originalAgentId).toBe("cosmos_123");
  });

  test("should filter shared agents correctly", async () => {
    const sharedAgents = await agentService.getSharedWithUser(
      "user@datacom.com"
    );

    sharedAgents.forEach((agent) => {
      expect(agent.isSharedAccess).toBe(true);
    });
  });
});
```

---

## 37. Unit Tests — API Layer

```javascript
describe("Access Request API", () => {
  test("should create global access request", async () => {
    const response = await request(app)
      .post("/api/agent-requests/global-access")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        agentId: "cosmos_123",
        requestReason: "Testing purposes",
        businessJustification: "Quality assurance",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.requestId).toBeDefined();
  });

  test("should approve access request and create agent", async () => {
    const requestId = "req_123";

    const response = await request(app)
      .put(`/api/agent-requests/${requestId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        status: "approved",
        adminNotes: "Approved for testing",
      });

    expect(response.status).toBe(200);

    const createdAgent = await agentService.getAgentById(
      response.body.data.createdAgentId
    );
    expect(createdAgent.isSharedAccess).toBe(true);
    expect(createdAgent.shareType).toBe("global_request");
  });
});
```

---

## 38. Integration Tests — E2E Flow

```javascript
describe("Shared Agent E2E Flows", () => {
  test("complete global access request flow", async () => {
    const directory = await userClient.getAgentDirectory();
    const globalAgent = directory.find(
      (a) => a.sharing === "All Datacom" && !a.isSharedAccess
    );

    const accessRequest = await userClient.requestGlobalAccess({
      agentId: globalAgent.id,
      requestReason: "E2E testing",
      businessJustification: "Testing workflow",
    });

    const approval = await adminClient.approveAccessRequest(
      accessRequest.requestId,
      {
        adminNotes: "Approved for testing",
      }
    );

    const sharedAgents = await userClient.getSharedWithMe();
    const grantedAgent = sharedAgents.find(
      (a) => a.originalAgentId === globalAgent.id
    );

    expect(grantedAgent).toBeDefined();
    expect(grantedAgent.shareType).toBe("global_request");
  });
});
```

---

## 39. Performance Tests

```javascript
describe("Performance Tests", () => {
  test("concurrent access requests", async () => {
    const promises = Array(100)
      .fill()
      .map((_, i) =>
        request(app)
          .post("/api/agent-requests/global-access")
          .set("Authorization", `Bearer ${userTokens[i]}`)
          .send({
            agentId: "cosmos_123",
            requestReason: `Load test ${i}`,
            businessJustification: "Performance testing",
          })
      );

    const responses = await Promise.all(promises);
    const successfulRequests = responses.filter((r) => r.status === 200);

    expect(successfulRequests.length).toBe(100);
  });

  test("shared-with-me query performance", async () => {
    const startTime = Date.now();

    await request(app)
      .get("/api/shared-with-me")
      .set("Authorization", `Bearer ${userToken}`);

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(1000);
  });
});
```

---

## 40. Monitoring — Key Metrics

**Business metrics**

- Access Request Volume: Number of global access requests per day/week.
- Approval Rate: Percentage of access requests approved.
- Time to Approval: Average time from request to admin decision.
- Shared Agent Usage: Usage patterns of shared vs. owned agents.
- User Adoption: Number of users using shared agents.

**Technical metrics**

- API Response Times: Latency for all sharing-related endpoints.
- Database Performance: Query performance for shared agent lookups.
- Error Rates: Failed requests and their causes.
- System Load: Resource usage during peak sharing activity.

---

## 41. Logging Strategy

**1. Application logs**

```javascript
logger.info("Global access request created", {
  requestId: req.id,
  userId: req.user.id,
  agentId: req.body.agentId,
  timestamp: new Date().toISOString(),
  source: "global-access-request",
});

logger.info("Access request approved", {
  requestId: req.params.id,
  adminId: req.user.id,
  grantedUserId: request.requesterId,
  agentId: request.originalAgentId,
  processingTime: Date.now() - request.requestDate,
  timestamp: new Date().toISOString(),
  source: "access-approval",
});
```

**2. Audit logging**

```javascript
const auditLog = {
  action: "AGENT_ACCESS_GRANTED",
  userId: grantedUserId,
  resourceType: "agent",
  resourceId: agentId,
  permissions: permissionBits,
  grantedBy: adminId,
  method: "global_request",
  timestamp: new Date().toISOString(),
  ipAddress: req.ip,
  userAgent: req.get("User-Agent"),
};

await db.collection("audit_logs").insertOne(auditLog);
```

---

## 42. Alerting Rules

**Critical alerts**

- High Error Rate: > 5% error rate for sharing APIs.
- Slow Response Times: > 2 second response time for shared-with-me endpoint.
- Failed Database Connections: Any database connection failures.
- Security Events: Unusual access patterns or permission escalations.

**Warning alerts**

- High Request Volume: > 100 access requests per hour.
- Long Approval Times: Requests pending > 5 business days.
- Low Approval Rate: < 70% approval rate.
- Resource Usage: High CPU/memory usage on sharing services.

---

## 43. Admin Dashboard Design

```
┌─────────────────────────────────────────────────────────────┐
│ SHARED AGENT ACCESS MANAGEMENT DASHBOARD                    │
├─────────────────────────────────────────────────────────────┤
│ OVERVIEW METRICS                                           │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ Pending Reqs │ │ Approval Rate│ │ Avg Response │         │
│ │     24       │ │     87%      │ │   1.2 days   │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
├─────────────────────────────────────────────────────────────┤
│ REQUEST TRENDS (Last 30 Days)                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │    📈 Request Volume Graph                              │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ TOP REQUESTED AGENTS                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 1. Customer Support Bot (12 requests)                  │ │
│ │ 2. Data Analysis Helper (8 requests)                   │ │
│ │ 3. Code Review Assistant (6 requests)                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 44. System Health Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ SYSTEM HEALTH - SHARING SERVICES                           │
├─────────────────────────────────────────────────────────────┤
│ API PERFORMANCE                                            │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│ │ /shared-with-me │ │ /agent-requests │ │ /approvals      │ │
│ │   125ms avg     │ │   89ms avg      │ │   156ms avg     │ │
│ │   ✅ Healthy    │ │   ✅ Healthy    │ │   ✅ Healthy    │ │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ DATABASE PERFORMANCE                                        │
│ ┌─────────────────┐ ┌─────────────────┐                   │
│ │ MongoDB         │ │ Cosmos DB       │                   │
│ │ 🟢 Connected    │ │ 🟢 Connected    │                   │
│ │ 45ms avg query  │ │ 78ms avg query  │                   │
│ └─────────────────┘ └─────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 45. Success Criteria — Functional Requirements

- Users can clearly distinguish between owned and shared agents.
- Global agents require explicit access requests.
- Admin can manage all access requests in unified interface.
- Shared agents appear in dedicated "Shared with Me" section.
- Complete audit trail of all sharing and access activities.

---

## 46. Success Criteria — Performance Requirements

- Shared-with-me queries respond within 1 second.
- Directory filtering performs well with 10,000+ agents.
- Access request creation completes within 500ms.
- Admin approval workflow handles 100+ concurrent requests.

---

## 47. Success Criteria — Security Requirements

- All access properly validated through ACL system.
- No unauthorized access to shared agents.
- Complete audit logging of all sharing activities.
- Secure handling of personal and agent data.

---

## 48. Success Criteria — User Experience Requirements

- Intuitive interface for requesting agent access.
- Clear visual indicators for different agent states.
- Seamless integration with existing workflows.
- Mobile-responsive design for all new interfaces.

---

📌 **Document Type:** Technical Specification
📅 **Last Updated:** 26 August 2025
🔗 **Source:** https://datacomgroup.atlassian.net/wiki/spaces/IA/pages/40063139947
