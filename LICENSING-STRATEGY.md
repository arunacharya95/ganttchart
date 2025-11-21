# Licensing Strategy & Implementation Guide

This document outlines the licensing strategy for the Gantt React component library.

## 📋 Table of Contents

1. [License Tiers](#license-tiers)
2. [Feature Matrix](#feature-matrix)
3. [Implementation Guide](#implementation-guide)
4. [Pricing Strategy](#pricing-strategy)
5. [License Key Generation](#license-key-generation)
6. [Usage Examples](#usage-examples)

---

## 🎯 License Tiers

### Free Tier
- **Cost**: $0
- **Target**: Individual developers, personal projects, open-source
- **Features**: Basic Gantt functionality
- **Support**: Community support (GitHub issues)

### Pro Tier
- **Cost**: $49/month or $490/year (save 17%)
- **Target**: Small teams, startups, commercial projects
- **Features**: All Free + Custom colors, palettes, export capabilities
- **Support**: Email support (48-hour response)

### Enterprise Tier
- **Cost**: Custom pricing (starts at $499/month)
- **Target**: Large organizations, mission-critical applications
- **Features**: All Pro + Advanced features, white-label, API access
- **Support**: Priority support (8-hour response), dedicated account manager

---

## 📊 Feature Matrix

| Feature | Free | Pro | Enterprise |
|---------|------|-----|-----------|
| **Core Features** |
| Basic Gantt Chart | ✅ | ✅ | ✅ |
| Task List View | ✅ | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ | ✅ |
| Resize Tasks | ✅ | ✅ | ✅ |
| **Customization** |
| Custom Colors | ❌ | ✅ | ✅ |
| Color Palettes (8 themes) | ❌ | ✅ | ✅ |
| Status-based Colors | ❌ | ✅ | ✅ |
| Assignee-based Colors | ❌ | ✅ | ✅ |
| **Advanced Features** |
| Export to PDF | ❌ | ✅ | ✅ |
| Export to Image | ❌ | ✅ | ✅ |
| Advanced Filtering | ❌ | ✅ | ✅ |
| Task Dependencies | ❌ | ✅ | ✅ |
| Milestones | ❌ | ✅ | ✅ |
| **Enterprise Features** |
| Multiple Timelines | ❌ | ❌ | ✅ |
| Resource Management | ❌ | ❌ | ✅ |
| Custom Fields | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| White-label | ❌ | ❌ | ✅ |
| **Support** |
| Community (GitHub) | ✅ | ✅ | ✅ |
| Email Support | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |
| Dedicated Account Manager | ❌ | ❌ | ✅ |

---

## 🛠️ Implementation Guide

### Step 1: User Registration & License Purchase

1. **Create Pricing Page**
   - Display all three tiers
   - Clear feature comparison
   - Call-to-action buttons
   - Testimonials/case studies

2. **Payment Integration**
   - Stripe for subscriptions
   - Support monthly/annual billing
   - Automatic renewals
   - Invoice generation

3. **License Key Generation**
   - Generate unique license keys on purchase
   - Store in database with user info
   - Send via email automatically

### Step 2: License Validation System

Create a backend API for license validation:

```typescript
// Backend API endpoint
POST /api/licenses/validate
{
  "licenseKey": "PRO-ABC123XYZ-2026-12-31",
  "domain": "example.com"
}

Response:
{
  "valid": true,
  "type": "pro",
  "expiresAt": "2026-12-31",
  "features": {...}
}
```

### Step 3: Client-Side Integration

Users add license to their app:

```tsx
import { GanttChart, setLicense } from 'gantt-react-arunacharya95';

// Initialize license (do this once at app startup)
setLicense({
  key: 'PRO-ABC123XYZ-2026-12-31',
  type: 'pro',
  email: 'user@company.com'
});

// Or pass in config
<GanttChart
  tasks={tasks}
  config={{
    license: {
      key: 'PRO-ABC123XYZ-2026-12-31',
      type: 'pro'
    },
    colorPalette: { preset: 'ocean' } // Pro feature
  }}
/>
```

### Step 4: Feature Gating

The library automatically gates features based on license:

```typescript
// In your component code
import { licenseManager } from 'gantt-react-arunacharya95';

// Check if feature is available
if (licenseManager.hasFeature('customColors')) {
  // Use custom colors
} else {
  // Show upgrade message
  console.warn('Custom colors require Pro license');
}
```

---

## 💰 Pricing Strategy

### Monthly Pricing

| Tier | Monthly | Annual | Savings |
|------|---------|--------|---------|
| Free | $0 | $0 | - |
| Pro | $49 | $490 | $98 (17%) |
| Enterprise | Custom | Custom | Negotiable |

### Volume Discounts (Enterprise)

- 10-50 developers: 10% off
- 51-100 developers: 20% off
- 100+ developers: 30% off

### Educational Discount

- 50% off Pro tier for students/educators
- Free Pro license for open-source projects (case-by-case)

---

## 🔑 License Key Generation

### Format

```
TYPE-HASH-EXPIRY

Examples:
PRO-A3F7B2C9E1-2026-12-31
ENTERPRISE-X9Y2Z8W4Q6-2027-06-30
```

### Generation Algorithm (Backend)

```typescript
import crypto from 'crypto';

function generateLicenseKey(
  type: 'pro' | 'enterprise',
  email: string,
  expiryDate: string
): string {
  // Create unique hash based on email, type, and secret
  const secret = process.env.LICENSE_SECRET;
  const data = `${email}-${type}-${expiryDate}`;
  const hash = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex')
    .substring(0, 10)
    .toUpperCase();
  
  return `${type.toUpperCase()}-${hash}-${expiryDate}`;
}

// Example usage
const key = generateLicenseKey(
  'pro',
  'user@company.com',
  '2026-12-31'
);
// Returns: PRO-A3F7B2C9E1-2026-12-31
```

### Validation (Backend)

```typescript
function validateLicenseKey(
  key: string,
  email: string
): { valid: boolean; type?: string; expiresAt?: string } {
  try {
    const [type, hash, expiry] = key.split('-');
    
    // Regenerate hash to verify
    const secret = process.env.LICENSE_SECRET;
    const data = `${email}-${type.toLowerCase()}-${expiry}`;
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex')
      .substring(0, 10)
      .toUpperCase();
    
    if (hash !== expectedHash) {
      return { valid: false };
    }
    
    // Check expiry
    if (new Date(expiry) < new Date()) {
      return { valid: false };
    }
    
    return {
      valid: true,
      type: type.toLowerCase(),
      expiresAt: expiry
    };
  } catch {
    return { valid: false };
  }
}
```

---

## 📚 Usage Examples

### Free Tier (Default)

```tsx
import { GanttChart } from 'gantt-react-arunacharya95';

function App() {
  return (
    <GanttChart
      tasks={tasks}
      // All basic features work
      // Color customization will show upgrade prompts
    />
  );
}
```

### Pro Tier

```tsx
import { GanttChart, setLicense } from 'gantt-react-arunacharya95';

// Set license at app initialization
setLicense({
  key: 'PRO-A3F7B2C9E1-2026-12-31',
  type: 'pro',
  email: 'user@company.com'
});

function App() {
  return (
    <GanttChart
      tasks={tasks}
      config={{
        // Pro features now work
        colorPalette: { preset: 'ocean' },
        statusColors: {
          'Done': '#22c55e',
          'In Progress': '#3b82f6'
        }
      }}
      getTaskColor={(task) => {
        // Custom color logic works
        return task.priority === 'high' ? '#ef4444' : '#3b82f6';
      }}
    />
  );
}
```

### Enterprise Tier

```tsx
import { GanttChart, setLicense } from 'gantt-react-arunacharya95';

setLicense({
  key: 'ENTERPRISE-X9Y2Z8W4Q6-2027-06-30',
  type: 'enterprise',
  email: 'admin@bigcorp.com',
  company: 'Big Corp Inc'
});

function App() {
  return (
    <GanttChart
      tasks={tasks}
      config={{
        // All features available
        colorPalette: { preset: 'vivid' },
        whiteLabel: true,
        customFields: ['budget', 'department']
      }}
    />
  );
}
```

---

## 🚀 Marketing & Sales Strategy

### 1. **Free Tier Marketing**

- Open-source GitHub repository
- NPM package freely available
- Clear documentation
- Community examples
- Blog posts & tutorials

### 2. **Pro Tier Conversion**

- In-console upgrade prompts (non-intrusive)
- "Unlock Premium Features" banner in docs
- Free 14-day Pro trial
- Case studies showing Pro benefits
- Email nurture campaigns

### 3. **Enterprise Sales**

- Direct sales team
- Custom demos
- Proof of concept projects
- White-glove onboarding
- Annual contracts

### 4. **Upgrade Prompts**

When users try to use premium features without a license:

```
🔒 Premium Feature: Custom Color Palettes
   Current License: FREE
   Required License: PRO

   Unlock 8 beautiful color palettes and more:
   👉 https://your-website.com/pricing

   ✨ Start your 14-day free trial today!
   Questions? Contact: sales@your-company.com
```

---

## 📧 Email Communication

### Purchase Confirmation Email

```
Subject: Welcome to Gantt React Pro! 🎉

Hi [Name],

Thank you for purchasing Gantt React Pro!

Your License Details:
- License Key: PRO-A3F7B2C9E1-2026-12-31
- Type: Pro
- Valid Until: December 31, 2026

Getting Started:
1. Install: npm install gantt-react-arunacharya95
2. Add your license key (see docs)
3. Unlock all Pro features!

Documentation: https://docs.your-site.com
Support: support@your-company.com

Best regards,
The Gantt React Team
```

### Renewal Reminder (30 days before expiry)

```
Subject: Your Gantt React Pro license expires in 30 days

Hi [Name],

Your Gantt React Pro license will expire on [Date].

Renew now to continue enjoying:
✅ Custom color palettes
✅ Export to PDF/Image
✅ Task dependencies
✅ Priority support

[Renew Now Button]

Questions? Reply to this email.
```

---

## 🎯 Success Metrics

Track these KPIs:

1. **Free to Pro conversion rate** (target: 2-5%)
2. **Pro to Enterprise conversion** (target: 10-15%)
3. **Churn rate** (target: <5% monthly)
4. **Average revenue per user (ARPU)**
5. **License activation rate** (paid licenses actually used)
6. **Support ticket volume by tier**

---

## 🔒 Security Considerations

1. **Never validate licenses only on client-side**
2. **Use HTTPS for all API calls**
3. **Implement rate limiting on validation endpoint**
4. **Log all validation attempts**
5. **Detect and ban pirated keys**
6. **Regular key rotation for enterprise customers**
7. **Domain verification for enterprise licenses**

---

## 📝 Legal Requirements

1. **Terms of Service**
2. **End User License Agreement (EULA)**
3. **Privacy Policy**
4. **Refund Policy** (e.g., 30-day money-back guarantee)
5. **License transfer policy**
6. **Compliance** (GDPR, CCPA, etc.)

---

## 🛠️ Implementation Checklist

### Backend
- [ ] License generation system
- [ ] License validation API
- [ ] Database schema for licenses
- [ ] Payment integration (Stripe)
- [ ] Email automation
- [ ] Admin dashboard for license management
- [ ] Analytics & reporting

### Frontend (Package)
- [ ] License manager implementation
- [ ] Feature gating logic
- [ ] Upgrade prompts
- [ ] Documentation
- [ ] TypeScript types
- [ ] Tests for license features

### Marketing
- [ ] Pricing page
- [ ] Feature comparison table
- [ ] Case studies
- [ ] Documentation site
- [ ] Blog content
- [ ] Email templates

### Legal
- [ ] Terms of Service
- [ ] EULA
- [ ] Privacy Policy
- [ ] Refund Policy

---

## 💡 Tips for Success

1. **Keep Free tier valuable** - Don't cripple it too much
2. **Make upgrading easy** - One-click process
3. **Clear value proposition** - Show ROI of paid tiers
4. **Excellent documentation** - For all tiers
5. **Responsive support** - Even for free users (community)
6. **Regular feature updates** - Show ongoing development
7. **Transparent pricing** - No hidden fees
8. **Trial period** - Let users test Pro features
9. **Volume discounts** - Encourage larger purchases
10. **Partner program** - Affiliates, resellers

---

## 📞 Support Channels

- **Free**: GitHub Issues, Stack Overflow
- **Pro**: Email support (support@your-company.com)
- **Enterprise**: Dedicated Slack channel, phone support

---

## 🎓 Next Steps

1. Set up Stripe account
2. Create backend API for licenses
3. Build pricing page
4. Write documentation
5. Create marketing materials
6. Launch beta program
7. Iterate based on feedback
8. Scale!
