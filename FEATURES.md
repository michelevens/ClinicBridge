# ClinicBridge - Feature Tracker

## Status Legend
- [x] Planned and scoped
- [ ] Not yet started

---

## Phase 1: Core Practice Management (MVP - Weeks 1-8)

### Authentication & Users
- [ ] Email/password registration and login
- [ ] Role-based access (Provider, Patient, Front Desk, Biller, Practice Admin, Admin)
- [ ] Practice profile setup (specialty, NPI, address, hours)
- [ ] Staff invitation and onboarding
- [ ] MFA/2FA (HIPAA requirement)
- [ ] Session timeout and security policies

### Patient Management
- [ ] Patient registration (demographics, insurance, emergency contacts)
- [ ] Patient search and directory
- [ ] Patient chart/profile page
- [ ] Insurance information management (primary, secondary)
- [ ] Patient document upload and storage
- [ ] Patient photo capture
- [ ] Family/household linking
- [ ] Patient merge (duplicate detection)

### Scheduling
- [ ] Provider calendar (day, week, month views)
- [ ] Appointment types with configurable durations
- [ ] Online self-scheduling for patients
- [ ] Drag-and-drop rescheduling
- [ ] Multi-provider calendar view
- [ ] Recurring appointments
- [ ] Waitlist management
- [ ] Automated reminders (SMS + email, 24hr and 1hr before)
- [ ] No-show tracking and follow-up
- [ ] Room/resource scheduling

### Clinical Notes
- [ ] SOAP note template
- [ ] Specialty-specific templates (dermatology, cardiology, therapy, etc.)
- [ ] Free-text with smart formatting
- [ ] Problem list management
- [ ] Medication list
- [ ] Allergy tracking
- [ ] Vital signs entry
- [ ] Note signing and co-signing
- [ ] Amendment/addendum workflow
- [ ] Note templates library (customizable)

### Dashboard
- [ ] Today's schedule at a glance
- [ ] Patient check-in queue
- [ ] Pending tasks (unsigned notes, lab results, messages)
- [ ] Practice metrics (patients seen today, revenue, no-shows)
- [ ] Quick actions (new patient, new appointment, message)

---

## Phase 2: Telehealth & Patient Portal (Weeks 9-16)

### Telehealth / Video Visits
- [ ] HD video consultation (Twilio Video / Daily.co)
- [ ] Virtual waiting room with queue management
- [ ] Screen sharing (share test results, images)
- [ ] In-visit chat
- [ ] Session recording (with consent)
- [ ] Auto-generate visit note from telehealth
- [ ] Technical check before visit (camera, mic, connection)
- [ ] Multi-participant (caregiver, interpreter)
- [ ] Bandwidth-adaptive video quality

### Patient Portal
- [ ] Patient login and dashboard
- [ ] Upcoming appointments and self-scheduling
- [ ] Visit history and clinical summaries
- [ ] Secure messaging with providers
- [ ] Lab/test results viewing
- [ ] Prescription refill requests
- [ ] Bill viewing and online payment
- [ ] Health questionnaire/intake forms (pre-visit)
- [ ] Care instructions and educational materials
- [ ] Consent form e-signatures

### Messaging
- [ ] Provider ↔ Patient secure messaging
- [ ] Staff ↔ Staff messaging
- [ ] Message categorization (clinical, billing, admin)
- [ ] Auto-routing to appropriate staff
- [ ] Attachment support
- [ ] Read receipts
- [ ] Urgent message flagging

### Forms & Intake
- [ ] Customizable intake forms
- [ ] Pre-visit questionnaires sent via email/text
- [ ] Consent forms with e-signature
- [ ] Form builder (drag-and-drop)
- [ ] Conditional logic in forms
- [ ] Auto-populate chart from completed forms

---

## Phase 3: Billing & Prescribing (Weeks 17-24)

### Insurance Billing
- [ ] Insurance eligibility verification (real-time)
- [ ] CPT/ICD-10 code search and entry
- [ ] Claim creation from encounter
- [ ] Electronic claim submission (via clearinghouse)
- [ ] ERA/EOB auto-posting
- [ ] Claim status tracking
- [ ] Denial management workflow
- [ ] Appeals tracking
- [ ] Secondary/tertiary claim submission
- [ ] Batch claim submission

### Patient Billing
- [ ] Patient statement generation
- [ ] Online payment (credit card, ACH via Stripe)
- [ ] Payment plan setup
- [ ] Copay/coinsurance collection at check-in
- [ ] Outstanding balance tracking
- [ ] Payment receipts
- [ ] Superbill generation for out-of-network

### e-Prescribing
- [ ] Medication search (drug database)
- [ ] New prescription creation
- [ ] Drug interaction and allergy checking
- [ ] Pharmacy selection and electronic routing
- [ ] Prescription renewal workflow
- [ ] Controlled substance prescribing (EPCS-certified)
- [ ] Medication history import
- [ ] Prior authorization tracking

### Lab & Imaging Orders
- [ ] Lab order creation
- [ ] Common lab panel templates
- [ ] Electronic lab order transmission
- [ ] Result import and review workflow
- [ ] Abnormal result flagging
- [ ] Result-to-patient notification
- [ ] Imaging order management

---

## Phase 4: Analytics & Advanced (Weeks 25+)

### Practice Analytics
- [ ] Revenue dashboard (daily, weekly, monthly, YTD)
- [ ] Revenue by provider, payer, service type
- [ ] Claim denial rate and top denial reasons
- [ ] Days in AR (accounts receivable) aging
- [ ] Patient volume trends
- [ ] No-show and cancellation rates
- [ ] Provider productivity metrics
- [ ] Payer mix analysis

### HIPAA Compliance
- [ ] Complete audit logging (who accessed what, when)
- [ ] Role-based access controls (granular)
- [ ] Data encryption at rest and in transit
- [ ] BAA management for all integrations
- [ ] Security incident reporting
- [ ] Annual security risk assessment tools
- [ ] Employee access reviews

### Quality Reporting
- [ ] MIPS/MACRA quality measure tracking
- [ ] Clinical quality measure dashboards
- [ ] Improvement activities documentation
- [ ] Promoting interoperability measures
- [ ] Annual submission preparation

### Integrations
- [ ] Health Information Exchange (HIE) connectivity
- [ ] Lab interface (Quest, LabCorp)
- [ ] Pharmacy network (Surescripts)
- [ ] Imaging center connectivity
- [ ] Accounting (QuickBooks, Xero)
- [ ] Referral management

### Mobile App
- [ ] Provider app (schedule, messages, quick charting)
- [ ] Patient app (appointments, telehealth, messages, payments)
- [ ] Push notifications
