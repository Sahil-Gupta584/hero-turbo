// apps/creator/pages/privacy-policy.tsx (or use your routing structure)


const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy explains how we collect, use, and protect your information when you use our platform. Our
        goal is to provide a secure and efficient video collaboration system for content creators and editors.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li><strong>Account Information:</strong> Name, email, and other contact details during registration.</li>
        <li><strong>Uploaded Content:</strong> Videos, files, and metadata you upload or manage.</li>
        <li><strong>Usage Data:</strong> Logs, preferences, and interaction data within the platform.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>To enable video collaboration between creators and editors.</li>
        <li>To improve platform features, functionality, and user experience.</li>
        <li>To send notifications and important updates (only when needed).</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Sharing & Security</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>We do <strong>not</strong> sell or rent your data to third parties.</li>
        <li>Data is encrypted in transit and stored securely.</li>
        <li>Access to content is limited to your team and authorized collaborators only.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li>You can request deletion of your data at any time.</li>
        <li>You may update your personal information from your account settings.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy as our platform evolves. We encourage you to review it periodically.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact</h2>
      <p className="mb-4">
        If you have questions about this policy, contact us at <a href="mailto:guptas3067@gmail.com" className="text-blue-500 underline">guptas3067@gmail.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
