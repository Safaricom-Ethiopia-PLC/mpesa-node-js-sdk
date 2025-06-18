import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center text-center space-y-16">
      {/* Hero Section */}
      <section className="mt-16">
        <code className="text-4xl font-bold">Integrate M-Pesa Payments</code>
        <p className="mt-4 text-lg text-gray-600">
          Simplify M-Pesa integration, accelerate development, and enhance your user experience.
        </p>
        <div className="mt-6">
          <Link href="/docs" className="px-8 py-3 text-white rounded-full border hover:bg-white hover:text-black transition-all">
            Get Started
          </Link>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="w-full max-w-4xl">
        <code className="text-2xl font-semibold">Key Features</code>
        <ul className="mt-6 space-y-4 text-left ml-6">
          <li>✔️ Secure Authentication</li>
          <li>✔️ Initiate M-Pesa Payments (STK Push)</li>
          <li>✔️ Receive Customer Payments (C2B)</li>
          <li>✔️ Send Business Payments (B2C)</li>
          <li>✔️ Robust Error Handling</li>
          <li>✔️ Automatic Retries</li>
          <li>✔️ Configurable Logging</li>
          <li>✔️ Efficient Pagination Support</li>
        </ul>
      </section>

      {/* Benefits Section */}
      <section className="w-full max-w-4xl">
        <code className="text-2xl font-semibold">Benefits</code>
        <p className="mt-4 text-gray-600">
          Save time and effort with our SDK. Enjoy:
        </p>
        <ul className="mt-4 space-y-4 text-left ml-6">
          <li>🚀 Reduced development time and effort</li>
          <li>💡 Increased efficiency and reliability</li>
          <li>🎨 Improved user experience</li>
          <li>🔒 Enhanced security</li>
          <li>🌍 Access to M-Pesa's vast user base</li>
        </ul>
      </section>

      {/* Getting Started Section */}
      <section className="w-full max-w-4xl ml-6">
        <code className="text-2xl font-semibold">Getting Started</code>
        <p className="mt-4 text-gray-600">
          Follow these steps to get started:
        </p>
        <ol className="mt-4 space-y-4 list-decimal text-left ml-6">
          <li>Download or install the SDK using <code>npm install @safaricom-et/mpesa-node-js-sdk</code>.</li>
          <li>Configure the SDK with your credentials and environment.</li>
          <li>Refer to our <Link href="/docs" className="text-blue-600 underline">Documentation</Link> for tutorials and examples.</li>
        </ol>
      </section>

      {/* Community and Support Section */}
      <section className="w-full max-w-4xl">
        <code className="text-2xl font-semibold">Community and Support</code>
        <p className="mt-4 text-gray-600">
          Join our community of developers to get help and share your experiences:
        </p>
        <ul className="mt-4 space-y-4 text-left ml-6">
          <li>📚 Comprehensive <Link href="/docs" className="text-blue-600 underline">Documentation</Link></li>
          <li>🤝 <Link href='https://developer.safaricom.et/forums' className="text-blue-600 underline">Community forums </Link>and support channels</li>
          <li>📧 <Link href="mailto:m-pesadeveloperportalsupport@safaricom.et" className="text-blue-600 underline">Email</Link> support for critical issues</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-sm text-gray-500 border-t">
        <p>© {new Date().getFullYear()} M-Pesa SDK. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
        </div>
      </footer>
    </main>
  );
}
