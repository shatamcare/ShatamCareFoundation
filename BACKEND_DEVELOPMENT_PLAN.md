# Shatam Care Foundation - Backend Development Plan

## 🎯 **Overview**
This document outlines the complete backend development strategy for the Shatam Care Foundation website, transforming it from a static site to a dynamic platform with payment processing, user management, and content management capabilities.

## 📋 **Current State Analysis**

### **Frontend Features Requiring Backend:**
1. **Contact Forms** - Currently using `mailto:` links
2. **Donation System** - Static display, no payment processing
3. **Event Registration** - Manual email-based registration
4. **Impact Statistics** - Static numbers, no dynamic updates
5. **Testimonials** - Hardcoded content
6. **Newsletter Signup** - No email list management
7. **Volunteer Applications** - Manual email handling

## 🏗️ **Recommended Technology Stack**

### **Backend Framework:**
- **Node.js + Express.js** - Fast, scalable, JavaScript ecosystem
- **TypeScript** - Type safety and better development experience

### **Database:**
- **MongoDB** - Flexible schema for NGO data, good for analytics
- **Mongoose** - Object modeling for MongoDB

### **Payment Integration:**
- **Razorpay** - Indian payment gateway with UPI, cards, netbanking
- **PayU** - Alternative payment processor
- **80G Tax Receipt Generation** - Automated PDF generation

### **Email Services:**
- **SendGrid** or **AWS SES** - Transactional emails
- **Mailchimp** - Newsletter and email marketing

### **Authentication & Security:**
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **Rate limiting** - API protection
- **CORS** - Cross-origin security

### **File Storage:**
- **AWS S3** or **Cloudinary** - Image and document storage
- **Multer** - File upload handling

### **Additional Services:**
- **SMS Gateway** (TextLocal/Twilio) - SMS notifications
- **WhatsApp Business API** - Direct communication
- **Google Analytics API** - Enhanced tracking

## 🗃️ **Database Schema Design**

### **Core Collections:**

#### **Users Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  phone: String,
  role: ['donor', 'volunteer', 'caregiver', 'admin'],
  isVerified: Boolean,
  profile: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    panCard: String, // For 80G receipts
  },
  preferences: {
    newsletter: Boolean,
    smsUpdates: Boolean,
    donationReminders: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **Donations Collection**
```javascript
{
  _id: ObjectId,
  donorId: ObjectId, // Reference to Users
  amount: Number,
  currency: 'INR',
  purpose: String, // 'caregiver-training', 'brain-kit', etc.
  paymentMethod: String,
  paymentGateway: 'razorpay' | 'payu',
  transactionId: String,
  gatewayTransactionId: String,
  status: 'pending' | 'completed' | 'failed' | 'refunded',
  receiptNumber: String, // For 80G receipts
  receiptGenerated: Boolean,
  receiptUrl: String,
  isRecurring: Boolean,
  recurringPlan: String,
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: String // 'website', 'social', etc.
  },
  createdAt: Date,
  completedAt: Date
}
```

#### **Events Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  date: Date,
  time: String,
  location: String,
  type: 'workshop' | 'support-group' | 'training' | 'awareness',
  capacity: Number,
  registeredCount: Number,
  registrationFee: Number,
  isActive: Boolean,
  images: [String], // URLs to event images
  facilitators: [String],
  requirements: [String],
  agenda: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Event Registrations Collection**
```javascript
{
  _id: ObjectId,
  eventId: ObjectId,
  userId: ObjectId,
  name: String,
  email: String,
  phone: String,
  emergencyContact: String,
  medicalConditions: String,
  dietaryRequirements: String,
  experience: String, // Previous caregiving experience
  motivation: String, // Why they want to attend
  status: 'registered' | 'confirmed' | 'attended' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'waived',
  registrationDate: Date,
  confirmationSent: Boolean,
  remindersSent: Number
}
```

#### **Contact Messages Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  type: 'general' | 'partnership' | 'volunteer' | 'media',
  priority: 'low' | 'medium' | 'high',
  status: 'new' | 'in-progress' | 'resolved' | 'closed',
  assignedTo: ObjectId, // Admin user
  responses: [{
    responderId: ObjectId,
    message: String,
    sentAt: Date,
    method: 'email' | 'phone' | 'whatsapp'
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **Testimonials Collection**
```javascript
{
  _id: ObjectId,
  name: String,
  role: String, // 'caregiver', 'family-member', 'healthcare-professional'
  content: String,
  rating: Number, // 1-5 stars
  isApproved: Boolean,
  isVisible: Boolean,
  image: String, // Optional profile image
  location: String, // City/State
  programAttended: String,
  dateOfExperience: Date,
  submittedAt: Date,
  approvedAt: Date,
  approvedBy: ObjectId
}
```

#### **Newsletter Subscribers Collection**
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  subscriptionDate: Date,
  isActive: Boolean,
  source: String, // 'website', 'event', 'social'
  preferences: {
    weeklyUpdates: Boolean,
    eventNotifications: Boolean,
    impactReports: Boolean
  },
  unsubscribedAt: Date,
  unsubscribeReason: String
}
```

#### **Impact Statistics Collection**
```javascript
{
  _id: ObjectId,
  metric: String, // 'caregivers-trained', 'families-helped', etc.
  value: Number,
  description: String,
  lastUpdated: Date,
  updatedBy: ObjectId,
  isVisible: Boolean,
  order: Number // For display ordering
}
```

## 🔗 **API Endpoints Design**

### **Authentication Endpoints**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-token
```

### **User Management**
```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/upload-avatar
DELETE /api/users/account
```

### **Donation Endpoints**
```
POST   /api/donations/create
POST   /api/donations/verify-payment
GET    /api/donations/user/:userId
GET    /api/donations/:id/receipt
POST   /api/donations/recurring/create
PUT    /api/donations/recurring/:id/pause
DELETE /api/donations/recurring/:id/cancel
```

### **Event Management**
```
GET    /api/events
GET    /api/events/:id
POST   /api/events/:id/register
GET    /api/events/user/:userId/registrations
PUT    /api/events/registration/:id/cancel
```

### **Contact & Communication**
```
POST   /api/contact/send
GET    /api/contact/messages (Admin only)
PUT    /api/contact/messages/:id/respond
```

### **Newsletter**
```
POST   /api/newsletter/subscribe
DELETE /api/newsletter/unsubscribe/:token
```

### **Testimonials**
```
GET    /api/testimonials/approved
POST   /api/testimonials/submit
GET    /api/testimonials/pending (Admin only)
PUT    /api/testimonials/:id/approve
```

### **Impact Statistics**
```
GET    /api/impact/statistics
PUT    /api/impact/statistics/:id (Admin only)
```

## 💳 **Payment Integration Strategy**

### **Razorpay Integration**
```javascript
// Payment flow
1. Frontend creates donation request
2. Backend creates Razorpay order
3. Frontend handles payment UI
4. Backend verifies payment signature
5. Update donation status
6. Generate 80G receipt
7. Send confirmation email
```

### **80G Tax Receipt Generation**
- Automatic PDF generation using PDFKit
- Sequential receipt numbering
- Digital signature integration
- Email delivery with receipt attachment

## 📧 **Email System Architecture**

### **Email Templates**
1. **Welcome Email** - New user registration
2. **Donation Confirmation** - Payment successful
3. **80G Receipt** - Tax receipt delivery
4. **Event Registration** - Confirmation and details
5. **Event Reminder** - 1 day before event
6. **Monthly Newsletter** - Impact updates
7. **Thank You** - Post-event follow-up

### **Email Automation**
- Welcome series for new donors
- Birthday wishes for registered users
- Anniversary emails for long-term supporters
- Re-engagement campaigns for inactive users

## 👑 **Admin Dashboard Features**

### **Dashboard Overview**
- Total donations (daily/monthly/yearly)
- Event registrations count
- New contact messages
- Newsletter subscription growth
- Top donation purposes

### **Donation Management**
- Transaction history with filters
- Failed payment retry
- Refund processing
- Receipt re-generation
- Donor analytics

### **Event Management**
- Create/edit events
- View registrations
- Send bulk communications
- Attendance tracking
- Feedback collection

### **Content Management**
- Update impact statistics
- Manage testimonials
- Newsletter composition
- Image gallery management

### **User Management**
- View all users
- Role management
- Account verification
- Communication history

## 🔐 **Security Implementation**

### **API Security**
- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting (100 requests/hour for unauthenticated)
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### **Payment Security**
- PCI DSS compliance
- Encrypted payment data storage
- Secure webhook verification
- Transaction logging

### **Data Protection**
- GDPR compliance for user data
- Data encryption at rest
- Secure file uploads
- Regular security audits

## 📊 **Analytics & Monitoring**

### **Key Metrics to Track**
- Donation conversion rates
- Event registration completion rates
- Email open/click rates
- Website engagement metrics
- User retention rates

### **Monitoring Tools**
- Application performance monitoring
- Error tracking (Sentry)
- Database performance monitoring
- API response time tracking

## 🚀 **Deployment Strategy**

### **Development Environment**
- Local MongoDB instance
- Environment variables for API keys
- Git workflow with feature branches

### **Staging Environment**
- MongoDB Atlas (free tier)
- Heroku or Railway deployment
- Test payment gateway integration

### **Production Environment**
- MongoDB Atlas (production cluster)
- AWS EC2 or DigitalOcean
- Load balancer setup
- CDN for static assets
- Automated backups

## 📈 **Implementation Roadmap**

### **Phase 1: Foundation (Weeks 1-2)**
- ✅ Project setup with Express + MongoDB
- ✅ User authentication system
- ✅ Contact form processing
- ✅ Basic email integration

### **Phase 2: Core Features (Weeks 3-4)**
- ✅ Donation system with Razorpay
- ✅ Event registration system
- ✅ Admin dashboard basics
- ✅ Email templates

### **Phase 3: Enhancement (Weeks 5-6)**
- ✅ 80G receipt generation
- ✅ Newsletter system
- ✅ Testimonial management
- ✅ Impact statistics API

### **Phase 4: Advanced Features (Weeks 7-8)**
- ✅ WhatsApp integration
- ✅ SMS notifications
- ✅ Advanced analytics
- ✅ Performance optimization

### **Phase 5: Production (Week 9)**
- ✅ Security audit
- ✅ Performance testing
- ✅ Production deployment
- ✅ Monitoring setup

## 💰 **Cost Estimation**

### **Monthly Operating Costs**
- **MongoDB Atlas**: ₹1,500/month (M2 cluster)
- **SendGrid**: ₹1,000/month (40,000 emails)
- **Razorpay**: 2% + ₹2 per transaction
- **AWS S3**: ₹500/month (file storage)
- **Server Hosting**: ₹2,000/month (DigitalOcean)
- **Total**: ~₹5,000/month

### **Development Costs**
- **Initial Development**: 8-10 weeks
- **Maintenance**: 20-30 hours/month
- **Feature Updates**: As needed

## 🤝 **Integration with Current Frontend**

### **Minimal Frontend Changes Required**
1. Replace `mailto:` links with API calls
2. Add payment gateway components
3. Create admin login/dashboard routes
4. Update contact forms to API endpoints
5. Add loading states and error handling

### **Progressive Enhancement**
- Current static site continues to work
- Backend features added incrementally
- Fallback to email for any failures
- No breaking changes to existing functionality

## 📞 **Next Steps**

1. **Approve this backend architecture**
2. **Set up development environment**
3. **Create project repository structure**
4. **Begin Phase 1 implementation**
5. **Integrate with existing frontend**

This comprehensive backend will transform your Shatam Care Foundation website into a powerful platform for donor management, event coordination, and impact tracking while maintaining the excellent user experience of your current frontend.

---

**Ready to begin backend development?** Let me know which phase you'd like to start with!
