# License Activation Guide

Quick guide for activating your Gantt React license.

## 🚀 Quick Start

### Method 1: Global License Setup (Recommended)

Set your license once at the app level:

```tsx
import { setLicense } from 'gantt-react-arunacharya95';

// In your app's index.tsx or App.tsx
setLicense({
  key: 'PRO-YOUR-LICENSE-KEY-HERE',
  type: 'pro',
  email: 'your@email.com'
});
```

### Method 2: Component-Level License

Pass license in the config prop:

```tsx
import { GanttChart } from 'gantt-react-arunacharya95';

<GanttChart
  tasks={tasks}
  config={{
    license: {
      key: 'PRO-YOUR-LICENSE-KEY-HERE',
      type: 'pro'
    }
  }}
/>
```

---

## 📦 What You Get

### Pro License Features

✅ **Custom Colors**: Set individual task colors  
✅ **8 Color Palettes**: Vivid, Pastel, Warm, Cool, Earth, Ocean, Forest  
✅ **Status Colors**: Map statuses to colors  
✅ **Assignee Colors**: Team member color coding  
✅ **Export to PDF**: Download Gantt as PDF *(coming soon)*  
✅ **Export to Image**: Save as PNG/SVG *(coming soon)*  
✅ **Task Dependencies**: Visual dependency lines *(coming soon)*  
✅ **Email Support**: 48-hour response time  

### Enterprise License Features

All Pro features plus:

✅ **Multiple Timelines**: Show parallel projects  
✅ **Resource Management**: Track team capacity  
✅ **Custom Fields**: Add your own data fields  
✅ **API Access**: Programmatic control  
✅ **White-label**: Remove branding  
✅ **Priority Support**: 8-hour response time  
✅ **Dedicated Account Manager**: Personal support  

---

## 🎨 Example: Using Color Features (Pro)

```tsx
import { GanttChart, setLicense } from 'gantt-react-arunacharya95';

// Activate your Pro license
setLicense({
  key: 'PRO-YOUR-LICENSE-KEY',
  type: 'pro'
});

function MyGantt() {
  const tasks = [
    {
      id: '1',
      name: 'Design Phase',
      start: '2025-11-01',
      end: '2025-11-15',
      status: 'Done',
      assignedTo: 'Alice'
    },
    {
      id: '2',
      name: 'Development',
      start: '2025-11-16',
      end: '2025-12-10',
      status: 'In Progress',
      assignedTo: 'Bob'
    }
  ];

  return (
    <GanttChart
      tasks={tasks}
      config={{
        // Use ocean color palette
        colorPalette: { preset: 'ocean' },
        
        // Or use status-based colors
        statusColors: {
          'Done': '#22c55e',
          'In Progress': '#3b82f6',
          'Not Started': '#6b7280'
        },
        
        // Or use team colors
        assigneeColors: {
          'Alice': '#ef4444',
          'Bob': '#8b5cf6'
        }
      }}
    />
  );
}
```

---

## ❓ Troubleshooting

### "Premium Feature" Warning in Console

If you see warnings like this:

```
🔒 Premium Feature: Custom Colors
   Current License: FREE
   Required License: PRO
```

**Solution**: Make sure you've activated your license:

```tsx
import { setLicense } from 'gantt-react-arunacharya95';

setLicense({
  key: 'YOUR-LICENSE-KEY',
  type: 'pro'  // or 'enterprise'
});
```

### License Not Working

1. **Check the license key format**:
   - Should be: `PRO-XXXXX-YYYY-MM-DD`
   - Pro: `PRO-...`
   - Enterprise: `ENTERPRISE-...`

2. **Verify license is set before component renders**:
   ```tsx
   // ✅ Good - Set in index.tsx or App.tsx
   setLicense({ key: '...', type: 'pro' });
   
   // ❌ Bad - Set after component is rendered
   useEffect(() => {
     setLicense({ key: '...', type: 'pro' });
   }, []);
   ```

3. **Check license hasn't expired**:
   - License keys include expiry date
   - Format: `PRO-HASH-2026-12-31`
   - Renew before expiry date

### Feature Still Not Working

Contact support with:
- Your license key
- The feature you're trying to use
- Console error messages
- Package version

📧 Email: support@your-company.com

---

## 🔄 Upgrading Your License

### From Free to Pro

1. Purchase Pro license at: https://your-website.com/pricing
2. Receive license key via email
3. Add to your app:
   ```tsx
   setLicense({
     key: 'PRO-YOUR-NEW-KEY',
     type: 'pro'
   });
   ```

### From Pro to Enterprise

1. Contact sales: sales@your-company.com
2. Receive Enterprise license key
3. Update your app:
   ```tsx
   setLicense({
     key: 'ENTERPRISE-YOUR-NEW-KEY',
     type: 'enterprise'
   });
   ```

---

## 📋 License Information

Check your current license status:

```tsx
import { getLicenseInfo } from 'gantt-react-arunacharya95';

const info = getLicenseInfo();
console.log(info);
// {
//   type: 'pro',
//   features: { customColors: true, colorPalettes: true, ... }
// }
```

Check if a specific feature is available:

```tsx
import { hasFeature } from 'gantt-react-arunacharya95';

if (hasFeature('customColors')) {
  // Use custom colors
}
```

---

## 💳 Billing & Renewals

### Monthly Subscription
- Billed monthly
- Cancel anytime
- Access continues until end of billing period

### Annual Subscription
- Save 17% vs monthly
- Billed once per year
- Auto-renewal with email reminder 30 days before

### Manage Subscription
- Update payment method: https://your-website.com/account
- View invoices
- Cancel subscription

---

## 📞 Need Help?

### Free Tier
- GitHub Issues: https://github.com/arunacharya95/ganttchart/issues
- Documentation: https://your-website.com/docs
- Community Forum: https://community.your-site.com

### Pro Tier
- Email Support: support@your-company.com
- Response time: 48 hours
- Documentation: https://your-website.com/docs/pro

### Enterprise Tier
- Priority Email: enterprise@your-company.com
- Phone Support: +1-XXX-XXX-XXXX
- Dedicated Slack Channel
- Response time: 8 hours
- Account Manager: Your dedicated contact

---

## 📄 License Agreement

By using this software with a Pro or Enterprise license, you agree to:
- Use the license key only for authorized domains/projects
- Not share your license key publicly
- Comply with the terms of service
- Renew before expiration for continued access

Full EULA: https://your-website.com/eula

---

## 🎓 Resources

- 📖 **Documentation**: https://your-website.com/docs
- 🎨 **Color Guide**: See COLOR-CONFIGURATION-GUIDE.md
- 💼 **Licensing Details**: See LICENSING-STRATEGY.md
- 🚀 **Examples**: https://your-website.com/examples
- 📺 **Video Tutorials**: https://youtube.com/your-channel

---

## ✨ What's Next?

After activating your license:

1. ✅ Explore all 8 color palettes
2. ✅ Set up status-based colors for your workflow
3. ✅ Customize colors for team members
4. ✅ Check out advanced examples in docs
5. ✅ Join our community for tips & tricks

Happy coding! 🎉
