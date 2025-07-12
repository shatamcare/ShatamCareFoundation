import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8 bg-white shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: January 2025</p>
          </div>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. What Are Cookies?</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide 
                you with a better browsing experience and allow us to analyze how our website is used.
              </p>
              <p className="mb-4">
                Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies 
                if you prefer. However, this may prevent you from taking full advantage of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Essential Cookies</h3>
                  <p className="mb-2">These cookies are necessary for our website to function properly and cannot be disabled.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Session management cookies</li>
                    <li>Security cookies to prevent fraud</li>
                    <li>Load balancing cookies for website performance</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Analytics Cookies</h3>
                  <p className="mb-2">These cookies help us understand how visitors interact with our website.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Google Analytics cookies to track website usage</li>
                    <li>Page view and visitor behavior tracking</li>
                    <li>Performance monitoring cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Functional Cookies</h3>
                  <p className="mb-2">These cookies enhance the functionality of our website and remember your preferences.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Language preference cookies</li>
                    <li>Form data storage cookies</li>
                    <li>User interface customization cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Marketing Cookies</h3>
                  <p className="mb-2">These cookies track your browsing habits to provide relevant advertisements.</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Social media integration cookies</li>
                    <li>Third-party advertising cookies</li>
                    <li>Conversion tracking cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Cookies</h2>
              <p className="mb-4">We use cookies for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>To ensure our website functions properly and securely</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze website traffic and improve user experience</li>
                <li>To provide personalized content and recommendations</li>
                <li>To measure the effectiveness of our campaigns</li>
                <li>To prevent fraud and enhance security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Third-Party Cookies</h2>
              <p className="mb-4">
                Our website may also use third-party cookies from trusted partners to enhance functionality:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Payment Processors:</strong> For secure donation processing</li>
                <li><strong>Social Media Platforms:</strong> For social sharing and integration</li>
                <li><strong>Email Marketing Services:</strong> For newsletter and communication preferences</li>
              </ul>
              <p className="mb-4">
                These third parties have their own privacy policies and cookie practices, which we encourage you to review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Managing Your Cookie Preferences</h2>
              <p className="mb-4">You have several options for managing cookies:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Browser Settings</h3>
                  <p className="mb-2">You can control cookies through your browser settings:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Block all cookies</li>
                    <li>Allow only first-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications before cookies are set</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Opt-Out Links</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out</a></li>
                    <li><a href="http://optout.aboutads.info/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Opt-out</a></li>
                    <li><a href="http://optout.networkadvertising.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative Opt-out</a></li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookie Retention</h2>
              <p className="mb-4">Different cookies have different retention periods:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 2 years)</li>
                <li><strong>Analytics Cookies:</strong> Usually retained for 26 months</li>
                <li><strong>Marketing Cookies:</strong> Typically retained for 13 months</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Impact of Disabling Cookies</h2>
              <p className="mb-4">
                If you choose to disable cookies, you may experience limitations in website functionality:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Inability to stay logged in</li>
                <li>Loss of personalized settings</li>
                <li>Reduced website performance</li>
                <li>Limited access to certain features</li>
                <li>Repeated requests for information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Updates to This Policy</h2>
              <p className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal 
                compliance. We will notify you of any significant changes by posting the updated policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Shatam Care Foundation</p>
                <p>Email: shatamcare@gmail.com</p>
                <p>Phone: +91 9158566665</p>
                <p>Address: Mumbai, India</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;
