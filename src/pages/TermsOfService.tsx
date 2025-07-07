import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using this website, you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to abide by these terms, please do 
                not use this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Use License</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Permission is granted to temporarily access the materials on Shatam Care Foundation's website</li>
                <li>This is the grant of a license, not a transfer of title</li>
                <li>Under this license, you may not:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Remove any copyright or proprietary notations from the materials</li>
                  </ul>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Description</h2>
              <p className="mb-4">
                Shatam Care Foundation provides various services related to elderly care, dementia support, 
                and caregiver training. While we strive to ensure all information is accurate and up-to-date, 
                we make no guarantees about the completeness or reliability of this information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Donations and Payments</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All donations are final and non-refundable</li>
                <li>We use secure payment processing systems</li>
                <li>Tax receipts will be provided as per applicable laws</li>
                <li>Recurring donations can be canceled at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Responsibilities</h2>
              <p className="mb-4">Users of our website agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of their account information</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Use the website in a lawful and respectful manner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
              <p className="mb-4">
                The materials on this website are provided on an 'as is' basis. Shatam Care Foundation 
                makes no warranties, expressed or implied, and hereby disclaims and negates all other 
                warranties including, without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or other 
                violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Limitations</h2>
              <p className="mb-4">
                In no event shall Shatam Care Foundation be liable for any damages arising out of the 
                use or inability to use the materials on our website. This limitation applies even if 
                Shatam Care Foundation has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Modifications</h2>
              <p className="mb-4">
                Shatam Care Foundation may revise these terms of service at any time without notice. 
                By using this website, you agree to be bound by the current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:{' '}
                <a 
                  href="mailto:shatamcare@gmail.com" 
                  className="text-warm-teal hover:text-warm-teal-600 underline"
                >
                  shatamcare@gmail.com
                </a>
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

export default TermsOfService;
