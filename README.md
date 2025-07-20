# AI Website Builder 🚀

An intelligent web application that generates code and file structures through AI prompts, featuring live preview, user authentication, and payment processing.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Convex](https://img.shields.io/badge/Convex-Database-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)

## ✨ Features

- 🤖 **AI Code Generation** - Generate complete code structures from natural language prompts
- 📁 **File Structure Creation** - Automatically create organized project directories
- 👀 **Live Preview** - Real-time code preview with syntax highlighting
- 🔐 **Google Authentication** - Secure OAuth 2.0 login system
- 💳 **PayPal Integration** - Subscription and payment processing
- 📊 **Real-time Database** - Convex database for instant data synchronization
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Built on Next.js 15 with Turbopack

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features and Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library

### Backend & Database
- **Convex** - Real-time database and backend functions
- **NextAuth.js** - Authentication framework
- **Server Actions** - Form handling and data mutations

### Integrations
- **Google OAuth 2.0** - User authentication
- **PayPal SDK** - Payment processing
- **Google APIs** - Additional Google services
- **OpenAI API** - AI code generation (optional)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm
- Git

### 1. Clone Repository
git clone https://github.com/yourusername/ai-website-builder.git
cd ai-website-builder

text

### 2. Install Dependencies

npm install

or
yarn install

or
pnpm install

text

### 3. Environment Setup

Create `.env.local` file:

App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

Google Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=sandbox # or production

Convex Database
NEXT_PUBLIC_CONVEX_URL=your-convex-url
CONVEX_DEPLOY_KEY=your-convex-deploy-key

Google APIs
GOOGLE_API_KEY=your-google-api-key

AI Services (Optional)
OPENAI_API_KEY=your-openai-key

text

### 4. Database Setup

Initialize Convex:

npx convex dev

text

### 5. Run Development Server

npm run dev

text

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

ai-website-builder/
├── app/ # Next.js App Router
│ ├── (auth)/ # Authentication routes
│ ├── (dashboard)/ # Protected dashboard
│ ├── api/ # API routes
│ ├── components/ # React components
│ │ ├── ui/ # Shadcn/ui components
│ │ ├── auth/ # Auth components
│ │ ├── code-editor/ # Code editor components
│ │ └── payment/ # Payment components
│ ├── lib/ # Utility functions
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── convex/ # Convex backend
│ ├── _generated/ # Auto-generated files
│ ├── schema.ts # Database schema
│ ├── users.ts # User functions
│ ├── projects.ts # Project functions
│ └── payments.ts # Payment functions
├── public/ # Static assets
├── components.json # Shadcn/ui config
├── next.config.js # Next.js config
├── tailwind.config.js # Tailwind config
└── package.json

text

## 🔧 Configuration

### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### PayPal Setup

1. Create [PayPal Developer](https://developer.paypal.com) account
2. Create a REST API application
3. Copy Client ID and Secret
4. Configure webhook endpoints for payment notifications

### Convex Database Schema

// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
users: defineTable({
email: v.string(),
name: v.string(),
image: v.optional(v.string()),
googleId: v.string(),
subscription: v.optional(v.string()),
createdAt: v.number(),
}).index("by_email", ["email"]).index("by_googleId", ["googleId"]),

projects: defineTable({
userId: v.id("users"),
name: v.string(),
description: v.optional(v.string()),
code: v.string(),
fileStructure: v.object({
files: v.array(v.object({
name: v.string(),
content: v.string(),
type: v.string(),
})),
}),
isPublic: v.boolean(),
createdAt: v.number(),
updatedAt: v.number(),
}).index("by_user", ["userId"]),

payments: defineTable({
userId: v.id("users"),
paypalOrderId: v.string(),
amount: v.number(),
currency: v.string(),
status: v.string(),
createdAt: v.number(),
}).index("by_user", ["userId"]),
});

text

## 🎯 Core Features

### AI Code Generation

// Example usage
const generateProject = async (prompt: string) => {
const response = await fetch('/api/generate', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ prompt })
});

return await response.json();
};

text

### Real-time Database Operations

// convex/projects.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProject = mutation({
args: {
name: v.string(),
code: v.string(),
description: v.optional(v.string()),
},
handler: async (ctx, args) => {
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Not authenticated");

text
const user = await ctx.db
  .query("users")
  .filter((q) => q.eq(q.field("email"), identity.email))
  .first();

if (!user) throw new Error("User not found");

return await ctx.db.insert("projects", {
  userId: user._id,
  name: args.name,
  code: args.code,
  description: args.description,
  fileStructure: { files: [] },
  isPublic: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
},
});

text

### PayPal Integration

// components/PayPalButton.tsx
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export function PayPalCheckout({ amount }: { amount: number }) {
const [{ options, isPending }] = usePayPalScriptReducer();

return (
<PayPalButtons
style={{ layout: "vertical" }}
createOrder={async (data, actions) => {
const orderId = await fetch("/api/paypal/create-order", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ amount }),
}).then((res) => res.json());

text
    return orderId;
  }}
  onApprove={async (data, actions) => {
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderID: data.orderID }),
    });
    
    return response.json();
  }}
/>
);
}

text

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
npx vercel --prod

text

2. **Environment Variables**
- Add all environment variables in Vercel dashboard
- Ensure production URLs are used

3. **Custom Domain**
- Configure custom domain in Vercel
- Update OAuth redirect URLs

### Other Platforms

- **Railway**: `railway deploy`
- **Netlify**: Configure build settings
- **DigitalOcean**: Use App Platform

## 📝 API Documentation

### Authentication Endpoints

- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Project Management

- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### AI Generation

- `POST /api/generate` - Generate code from prompt
- `POST /api/generate/structure` - Generate file structure

### Payment Processing

- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture payment
- `GET /api/payments` - Get payment history

## 🧪 Testing

Run tests
npm run test

Run tests in watch mode
npm run test:watch

Run E2E tests
npm run test:e2e

text

## 🔍 Troubleshooting

### Common Issues

**Authentication Problems**
- Verify Google OAuth credentials
- Check redirect URLs match exactly
- Ensure NEXTAUTH_SECRET is set

**Database Connection**
- Run `npx convex dev` to start local development
- Check Convex deployment status
- Verify environment variables

**Payment Issues**
- Confirm PayPal sandbox/production settings
- Check webhook configurations
- Verify client ID matches environment

**Build Errors**
- Update to Node.js 18+
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org) for the amazing framework
- [Convex](https://convex.dev) for the real-time database
- [Vercel](https://vercel.com) for hosting and deployment
- [Shadcn/ui](https://ui.shadcn.com) for beautiful components

## 📞 Support

- 📧 Email: sa9451736205@gmail.com
- 🐛 Issues: [GitHub Issues]([https://github.com/yourusername/ai-website-builder](https://github.com/SatyamMauryakit/Website_Build/)/issues)

---

<div align="center">
  <p>Made with ❤️ by Your Name</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>

