import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CookiePolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit our website. 
                They help us improve your browsing experience and provide essential functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for various purposes, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Essential cookies for website functionality</li>
                <li>Analytics cookies to understand how visitors use our website</li>
                <li>Preference cookies to remember your settings</li>
                <li>Security cookies to maintain safe and secure services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Essential Cookies</h3>
                  <p>Required for basic site functionality. Cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Analytics Cookies</h3>
                  <p>Help us understand how visitors interact with our website.</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Preference Cookies</h3>
                  <p>Remember your settings and preferences for future visits.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
              <p className="mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View cookies stored on your computer</li>
                <li>Delete individual or all cookies</li>
                <li>Block cookies from being set</li>
                <li>Allow or block cookies from specific websites</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p>
                If you have any questions about our cookie policy, please contact us at{' '}
                <a 
                  href="mailto:shatamcare@gmail.com" 
                  className="text-warm-teal hover:text-warm-teal-600 underline"
                >
                  shatamcare@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Policy Updates</h2>
              <p>
                We may update this cookie policy from time to time. The latest version will always be posted on this page.
                Last updated: July 7, 2025
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicy;
