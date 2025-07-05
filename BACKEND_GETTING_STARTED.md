# Backend Development Getting Started Guide

## 🚀 **Quick Start Instructions**

### **Step 1: Create Backend Directory**
```bash
# Navigate to your project root
cd "c:\Users\adars\OneDrive - iimranchi.ac.in\Desktop\EHA(Internship)\ShatamCareFoundation"

# Create backend directory
mkdir backend
cd backend
```

### **Step 2: Initialize Node.js Project**
```bash
# Initialize npm project
npm init -y

# Install dependencies
npm install express mongoose cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install express-rate-limit express-validator multer
npm install razorpay nodemailer
npm install --save-dev nodemon @types/node typescript ts-node
npm install --save-dev @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
```

### **Step 3: Create Project Structure**
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── donationController.ts
│   │   ├── eventController.ts
│   │   ├── contactController.ts
│   │   └── adminController.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Donation.ts
│   │   ├── Event.ts
│   │   ├── Contact.ts
│   │   └── Testimonial.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── donations.ts
│   │   ├── events.ts
│   │   ├── contact.ts
│   │   └── admin.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── rateLimit.ts
│   ├── services/
│   │   ├── emailService.ts
│   │   ├── paymentService.ts
│   │   ├── receiptService.ts
│   │   └── notificationService.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── logger.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── config.ts
│   └── app.ts
├── uploads/
├── templates/
│   └── emails/
├── tests/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### **Step 4: Environment Setup**
Create `.env` file with:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shatamcare
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/shatamcare

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# File Upload
MAX_FILE_SIZE=5MB
UPLOAD_PATH=uploads/

# Frontend URL
FRONTEND_URL=http://localhost:8080
FRONTEND_URL_PROD=https://adarshalexbalmuchu.github.io/ShatamCareFoundation

# Organization Details
ORG_NAME=Shatam Care Foundation
ORG_EMAIL=shatamcare@gmail.com
ORG_PHONE=+91 9158566665
ORG_ADDRESS=Your Organization Address
```

## 📱 **Integration Strategy with Frontend**

### **Option 1: Separate Backend Server**
- Run backend on `localhost:5000`
- Frontend makes API calls to backend
- Deploy backend separately (Heroku, Railway, etc.)

### **Option 2: API Routes in Same Project**
- Add API routes to your Vite project
- Use Vite's proxy configuration
- Deploy as full-stack application

### **Recommendation: Option 1 (Separate Backend)**
This gives you more flexibility and follows microservices architecture.

## 🔧 **Development Workflow**

### **Phase 1: Authentication System (Week 1)**
1. Set up Express server with TypeScript
2. Connect to MongoDB
3. Create User model and authentication
4. Implement JWT-based auth
5. Create basic auth middleware

### **Phase 2: Contact Forms (Week 1)**
1. Create Contact model
2. Implement contact form API
3. Set up email service
4. Add form validation
5. Test email delivery

### **Phase 3: Donation System (Week 2)**
1. Integrate Razorpay payment gateway
2. Create Donation model
3. Implement payment verification
4. Set up webhook handling
5. Create receipt generation

### **Phase 4: Event Management (Week 2)**
1. Create Event and Registration models
2. Implement event registration API
3. Add email confirmations
4. Create admin event management
5. Add calendar integration

## 🔒 **Security Checklist**

- [ ] Environment variables for all secrets
- [ ] Input validation on all endpoints
- [ ] Rate limiting on APIs
- [ ] CORS configuration
- [ ] Helmet for security headers
- [ ] Password hashing with bcrypt
- [ ] JWT token expiration
- [ ] File upload restrictions
- [ ] Database query sanitization

## 📊 **Testing Strategy**

### **Unit Tests**
- Test individual functions
- Mock external services
- Test database operations

### **Integration Tests**
- Test API endpoints
- Test payment flows
- Test email delivery

### **End-to-End Tests**
- Complete user journeys
- Payment processing
- Form submissions

## 🚀 **Deployment Options**

### **Backend Deployment**
1. **Railway** (Recommended) - Easy Node.js deployment
2. **Heroku** - Traditional PaaS option
3. **DigitalOcean App Platform** - Simple and affordable
4. **AWS EC2** - More control, requires setup

### **Database Hosting**
1. **MongoDB Atlas** (Recommended) - Managed MongoDB
2. **Railway MongoDB** - If using Railway
3. **Self-hosted** - On your server

## 💡 **Quick Win Features**

Start with these high-impact, low-effort features:

1. **Contact Form Processing** ⭐⭐⭐
   - Replace mailto links with proper form
   - Auto-response emails
   - Admin notifications

2. **Newsletter Signup** ⭐⭐
   - Capture email addresses
   - Send welcome emails
   - Admin dashboard to view subscribers

3. **Testimonial Submission** ⭐⭐
   - Allow users to submit testimonials
   - Admin approval system
   - Display approved testimonials

4. **Event Registration** ⭐⭐⭐
   - Replace mailto with proper registration
   - Confirmation emails
   - Registration limits

## 🎯 **Next Immediate Steps**

1. **Review the backend plan** - Make sure it aligns with your vision
2. **Set up development environment** - Install Node.js, MongoDB
3. **Choose starting phase** - I recommend starting with Contact Forms
4. **Create backend directory structure** - Set up the project foundation

Would you like me to:
1. **Create the initial backend setup files** (package.json, tsconfig.json, etc.)
2. **Start with a specific feature** (contact forms, authentication, etc.)
3. **Set up the database models** first
4. **Begin with payment integration** (since it's high-value)

Let me know which approach you prefer, and I'll create the actual implementation files!
