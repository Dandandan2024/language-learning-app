# Step by Step Family Law Website

A comprehensive platform to help Australians navigate family law matters with confidence through step-by-step guides, interactive tools, and community support.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── guides/            # Step-by-step guides
│   ├── tools/             # Interactive tools
│   ├── resources/         # Support resources
│   ├── about/             # About page
│   └── admin/             # Admin tools
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
└── lib/                  # Utility functions
```

## 🛠️ Content Migration from Notion

### Step 1: Export from Notion

1. Go to your Notion workspace
2. Navigate to the page you want to export
3. Click the "..." menu in the top right
4. Select "Export" from the dropdown
5. Choose "Markdown" format
6. Click "Export" to download the files

### Step 2: Use the Migration Tool

1. Navigate to `/admin/migrate` on your website
2. Download the migration guide
3. Upload your exported Markdown files
4. Process and review the content
5. Publish to the live website

### Step 3: Content Guidelines

#### Legal Disclaimers
Every guide must include:
- "This information is for educational purposes only"
- "Not a substitute for legal advice"
- "Consult a qualified legal professional"

#### Content Structure
```markdown
# Guide Title

## Overview
Brief description of what this guide covers

## Prerequisites
What users need before starting

## Step-by-Step Instructions
1. First step
2. Second step
3. etc.

## Important Notes
Any warnings or important information

## Related Resources
Links to other relevant content
```

## 🎨 Customization

### Colors
The website uses a blue and green color scheme. To customize:

1. Edit `tailwind.config.js`
2. Update the color palette
3. Rebuild the styles

### Content
- Guides: Add new guides in `/app/guides/`
- Tools: Add new tools in `/app/tools/`
- Resources: Update resources in `/app/resources/`

## 📱 Features

### Current Features
- ✅ Responsive design
- ✅ Step-by-step guides
- ✅ Interactive tools
- ✅ Resource directory
- ✅ Content migration tool
- ✅ SEO optimization
- ✅ Accessibility compliance

### Planned Features
- 🔄 User authentication
- 🔄 Progress tracking
- 🔄 Community forums
- 🔄 Premium content
- 🔄 Mobile app
- 🔄 Advanced calculators

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- AWS
- DigitalOcean

## 📊 Analytics

The website includes:
- Google Analytics 4
- Vercel Analytics
- User behavior tracking
- Content performance metrics

## 🔒 Legal Compliance

### Disclaimers
- Educational content only
- Not legal advice
- Consult professionals
- Terms of service
- Privacy policy

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- Email: support@stepbystepfamilylaw.com.au
- Phone: 1800 FAMILY LAW
- Community: /community

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Legal professionals who review content
- Community members who provide feedback
- Open source contributors
- Australian legal aid organizations

---

**Important:** This website provides general information only and does not constitute legal advice. Always consult with a qualified legal professional for advice specific to your situation.