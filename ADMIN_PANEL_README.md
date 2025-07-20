# Admin Panel Documentation

The Shatam Care Foundation website now includes a comprehensive admin panel for managing all aspects of the site.

## 🌟 Features

### Dashboard

- **Real-time Statistics**: View total contacts, newsletter subscribers, events, and registrations
- **Recent Activity**: See latest submissions and interactions
- **Quick Actions**: Export data and access key functions
- **Performance Metrics**: Track growth with 24-hour indicators

### Events Management

- **Create Events**: Add new events with date, time, location, and capacity
- **Edit Events**: Update event details and manage availability
- **View Registrations**: See who has registered for each event
- **Event Status**: Track past, current, and upcoming events
- **Registration Details**: View participant information, medical conditions, and dietary requirements

### Contacts & Communications

- **Contact Messages**: View and manage contact form submissions
- **Newsletter Subscribers**: Manage email subscriptions
- **Event Registrations**: Detailed registration management
- **Search & Filter**: Find specific contacts or registrations
- **Export Data**: Download data as CSV files
- **Delete Management**: Remove unwanted entries

### Media Library

- **File Upload**: Upload images and documents
- **Category Organization**: Organize files by category (Brain Kit, Caregivers, Media, Team, Users, etc.)
- **File Management**: View, copy URLs, and delete files
- **Grid/List View**: Switch between viewing modes
- **Search Files**: Find files by name or category
- **Storage Stats**: Track file counts and storage usage

### Content Management

- **Page Content**: Manage text content for different pages
- **Section Management**: Update specific page sections
- **Draft/Published**: Control content visibility
- **Content Types**: Manage pages, sections, and components
- **Version Control**: Track content updates and creation dates

### Settings

- **General Settings**: Site name, description, contact information
- **Admin Users**: Add/remove admin access for users
- **Email Configuration**: Set up email settings
- **Feature Toggles**: Enable/disable site features
- **Database Management**: Test connections and export data
- **Social Media**: Configure social media links

## 🔐 Access & Security

### Authentication

- **Supabase Auth**: Secure authentication system
- **Role-Based Access**: Only users in `admin_users` table can access
- **Session Management**: Automatic login/logout handling
- **Security Checks**: Verify admin status on each request

### How to Access the Admin Panel

**Method 1: Navigation Link (Recommended)**

1. Go to your website (e.g., `http://localhost:5174`)
2. Look for the "Admin" link in the top navigation bar
3. Click "Admin" to go to the login page
4. Sign in with your admin credentials

**Method 2: Direct URL Access**

You can also access the admin panel directly via URL:
```
http://localhost:5174/admin/login
```
(or your production domain + `/admin/login`)

**Security Note**: The admin link is visible to all users but only authenticated admin users can actually access the admin panel after logging in.

### Setup Admin Access

1. **Create Account**: First sign up normally through Supabase Auth
2. **Add Admin Rights**: Use the SQL commands in `database/admin_setup.sql`
3. **Login**: Go to `/admin/login` and sign in with your credentials

```sql
-- Replace with your email
SELECT add_admin_by_email('your-email@example.com');
```

## 🎨 User Interface

### Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Updates**: Live data refreshing
- **Loading States**: Smooth loading animations
- **Error Handling**: Clear error messages and recovery

### Navigation

- **Sidebar Menu**: Quick access to all sections
- **User Profile**: Shows current user info and logout option
- **Quick Actions**: Fast access to common tasks
- **Mobile-Friendly**: Responsive sidebar for mobile devices

## 📊 Data Management

### Supported Data Types

- **Contacts**: Name, email, phone, message, timestamps
- **Newsletters**: Email, name, source, subscription date
- **Events**: Title, description, date, time, location, capacity
- **Registrations**: Participant details, medical info, dietary requirements
- **Media Files**: Images, documents with categorization
- **Content**: Page text, sections, status management

### Export Features

- **CSV Export**: Download all data types as CSV files
- **Bulk Export**: Export all data as JSON backup
- **Filtered Export**: Export specific categories or date ranges

## 🔧 Technical Details

### Built With

- **React 18**: Modern React with hooks and TypeScript
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Supabase**: Backend and authentication
- **Vite**: Fast build system
- **React Router**: Client-side routing

### File Structure

```text
src/components/admin/
├── AdminLayout.tsx          # Main layout with sidebar
├── AdminLoginPage.tsx       # Login page
├── DashboardPage.tsx        # Main dashboard
├── EventsPage.tsx           # Events management
├── ContactsPage.tsx         # Contacts & communications
├── MediaPage.tsx            # Media library
├── ContentPage.tsx          # Content management
└── SettingsPage.tsx         # Admin settings
```

### Key Features

- **Real-time Data**: Live updates from Supabase
- **Optimistic Updates**: Fast UI responses
- **Error Boundaries**: Graceful error handling
- **Accessible**: WCAG compliant design
- **SEO-Friendly**: Proper meta tags and structure

## 🚀 Getting Started

### For Developers

1. **Install Dependencies**: `npm install`
2. **Set Environment**: Configure Supabase credentials
3. **Run Development**: `npm run dev`
4. **Access Admin**: Navigate to `/admin/login`

### For Admins

1. **Get Access**: Contact developer to add your email as admin
2. **Login**: Go to `yoursite.com/admin/login`
3. **Explore**: Use the dashboard to manage your site
4. **Get Help**: Contact support if needed

## 📝 Usage Examples

### Creating an Event

1. Go to Events → Create Event
2. Fill in event details (title, date, time, location)
3. Set capacity and save
4. Event appears on public website and admin can track registrations

### Managing Contacts

1. Go to Contacts → View contact messages
2. Read full messages, export data if needed
3. Delete spam or unwanted messages
4. Track response patterns in dashboard

### Uploading Media

1. Go to Media → Upload Files
2. Select category (Brain Kit, Team, etc.)
3. Upload images or documents
4. Copy URLs to use in content

### Content Updates

1. Go to Content → Find page section
2. Edit text content
3. Publish or save as draft
4. Changes appear on website immediately

## 🛠️ Maintenance

### Regular Tasks

- **Monitor Dashboard**: Check for new submissions daily
- **Update Events**: Keep event calendar current
- **Review Contacts**: Respond to contact messages
- **Backup Data**: Export data regularly
- **User Management**: Add/remove admin users as needed

### Security Best Practices

- **Regular Backups**: Export data weekly
- **Access Review**: Audit admin users monthly
- **Strong Passwords**: Use secure passwords
- **Session Management**: Log out when finished
- **Monitor Activity**: Check for unusual patterns

## 💡 Tips & Tricks

### Efficiency Tips

- **Use Search**: Filter large datasets quickly
- **Bulk Actions**: Export multiple data types at once
- **Keyboard Shortcuts**: Navigate faster with keyboard
- **Mobile Access**: Use mobile for quick checks
- **Regular Updates**: Keep content fresh

### Troubleshooting

- **Login Issues**: Check email spelling and password
- **Data Not Loading**: Refresh page or check connection
- **Upload Problems**: Check file size and format
- **Permission Errors**: Verify admin status in database
- **Performance**: Clear browser cache if slow

## 📞 Support

### Getting Help

- **Documentation**: Check this README first
- **Database Issues**: Run admin_setup.sql commands
- **Technical Problems**: Contact the development team
- **Feature Requests**: Submit through admin feedback

### Contact Information

- **Development Team**: [Contact developer]
- **System Admin**: Check admin users list
- **Emergency**: Use database direct access if needed

---

**Last Updated**: January 2024  
**Version**: 1.0  
**Status**: Production Ready
