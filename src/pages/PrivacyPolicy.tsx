import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Introduction</h2>
              <p className="mb-4">
                Shatam Care Foundation ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The types of information we collect from you or that you may provide when you visit our website</li>
                <li>Our practices for collecting, using, maintaining, protecting, and disclosing that information</li>
                <li>Your rights regarding the information we hold about you</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <p className="mb-4">We collect several types of information from and about users of our website, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identification information (Name, email address, phone number)</li>
                <li>Demographic information (City, state, preferences)</li>
                <li>Usage data (How you interact with our website)</li>
                <li>Donation history and preferences (if applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect about you to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide you with information about our services and programs</li>
                <li>Process your donations and provide receipts</li>
                <li>Send you newsletters and updates (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure. We strive to 
                protect your personal information but cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Withdraw consent for communications</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="mb-4">
                For questions about this Privacy Policy, please contact us at:{' '}
                <a 
                  href="mailto:shatamcare@gmail.com" 
                  className="text-warm-teal hover:text-warm-teal-600 underline"
                >
                  shatamcare@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Updates to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. The latest version will always 
                be posted on this page with the effective date.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Last updated: July 7, 2025
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
