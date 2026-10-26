# KC NEXUS Application Security Specification

## Phase 0: Data Invariants & Zero-Trust Threat Modeling

### Core Invariants
1. **Admin Authorization Invariant**: Only authenticated users whose UID exists in `/admins/{uid}` or whose verified email matches the bootstrapped owner `okoobenikelechisalvation@gmail.com` can create, update, or delete projects, categories, or manage admin accounts.
2. **Public Read Invariant**: Unauthenticated or non-admin visitors can ONLY read project documents where `status == 'published'`. Draft projects (`status == 'draft'`) MUST NEVER be readable or listable by non-admins.
3. **Contact Message Creation Invariant**: Anyone (including unauthenticated visitors) may submit a contact message into `/messages/{messageId}`, provided it matches strict schema boundaries (bounded length strings, status initialised to 'new'). No visitor may read, update, or delete messages.
4. **Category Read Invariant**: Portfolio categories are public readable so navigation and filter menus operate without authentication. Updates are restricted to admins.
5. **No Client Role Escalation**: Regular users cannot elevate themselves to admin or write into `/admins/{uid}`.

---

## The "Dirty Dozen" Threat Payloads

1. **Payload 1: Unauthenticated Project Creation**
   - Attempt: Anonymous visitor posts a new project into `/projects/p1`.
   - Expected: `PERMISSION_DENIED`.
2. **Payload 2: Public Read of Draft Projects**
   - Attempt: Anonymous or non-admin visitor issues `get()` or `list()` on a project with `status: 'draft'`.
   - Expected: `PERMISSION_DENIED`.
3. **Payload 3: Non-Admin Project Deletion**
   - Attempt: Non-admin signed-in user calls `deleteDoc(doc(db, 'projects', 'business-website'))`.
   - Expected: `PERMISSION_DENIED`.
4. **Payload 4: Self-Assigned Admin Role**
   - Attempt: Signed-in non-admin attempts `setDoc(doc(db, 'admins', request.auth.uid), { role: 'admin' })`.
   - Expected: `PERMISSION_DENIED`.
5. **Payload 5: Oversized Field Injection (Denial of Wallet)**
   - Attempt: Admin or attacker submits a project title exceeding 150 characters or description exceeding 5000 chars.
   - Expected: `PERMISSION_DENIED`.
6. **Payload 6: Shadow Field Injection in Project**
   - Attempt: Attacker adds ghost fields `{ isHacked: true, hiddenAdminToken: 'abc' }` to a project doc.
   - Expected: `PERMISSION_DENIED`.
7. **Payload 7: Invalid Status Transition**
   - Attempt: Attacker updates a project status to an invalid state like `'archived_hack'` outside the allowed `['published', 'draft']`.
   - Expected: `PERMISSION_DENIED`.
8. **Payload 8: Contact Message Public Reading**
   - Attempt: Unauthenticated or non-admin visitor attempts to list or get messages from `/messages`.
   - Expected: `PERMISSION_DENIED` (protecting client PII).
9. **Payload 9: Contact Message Status Spoofing on Submit**
   - Attempt: Visitor submits an inquiry directly setting `status: 'responded'` or `status: 'read'`.
   - Expected: `PERMISSION_DENIED` (inquiries on create must start with `status == 'new'`).
10. **Payload 10: Unverified Email Admin Spoofing**
    - Attempt: User signs up with `okoobenikelechisalvation@gmail.com` on an unverified provider with `email_verified == false`.
    - Expected: `PERMISSION_DENIED`.
11. **Payload 11: Malicious Document ID Poisoning**
    - Attempt: Write or read with path containing non-alphanumeric junk or excessive length (>128 chars).
    - Expected: `PERMISSION_DENIED`.
12. **Payload 12: Contact Message Modification / Tampering**
    - Attempt: Public visitor tries to update or delete existing inquiries in `/messages`.
    - Expected: `PERMISSION_DENIED`.
