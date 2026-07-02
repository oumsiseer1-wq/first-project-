import { SparklesIcon } from './ui/icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: ['Features', 'Pricing', 'Security', 'Roadmap'],
    company: ['About', 'Blog', 'Careers', 'Contact'],
    legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  };

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
              <span className="text-xl font-semibold text-zinc-900 dark:text-white">
                Mindful Spend
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm">
              AI-powered financial coaching to help you make intentional purchasing decisions and build better money habits.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            © {currentYear} Mindful Spend. All rights reserved.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Made with care for your financial future
          </p>
        </div>
      </div>
    </footer>
  );
}
