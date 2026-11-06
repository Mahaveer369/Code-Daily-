import React, { useState } from 'react';

export type LegalTab = 'terms' | 'privacy';

interface Props {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

const LegalCenterModal: React.FC<Props> = ({ isOpen, initialTab = 'terms', onClose }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="legal-center-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-fadeIn select-none"
    >
      <div className="bg-[#0e1525] border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#0b101b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              §
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Code It Out — Terms of Service &amp; Privacy Policy
              </h2>
              <p className="text-xs text-slate-400">
                Official Legal Terms of Use &amp; Data Privacy Notice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#131c2e] p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'terms'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === 'privacy'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Privacy Policy
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Scrollable Legal Document Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'terms' && (
            <article className="space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Effective Date: November 6, 2026
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">
                  Terms of Service (Terms of Use)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Applicable to Code It Out (&quot;Website&quot;) and all associated courses,
                  interactive tools, and services (&quot;Services&quot;).
                </p>
              </div>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">1. Introduction</h3>
                <p>
                  Welcome to <strong>Code It Out</strong>. By visiting our Website or using our
                  products and services (&quot;Services&quot;), you agree to these terms and
                  conditions (hereafter referred to as the &quot;Terms&quot;). The Terms apply to
                  everyone using the Website, including without limitation, visitors, students,
                  educators, customers, supporters, and content contributors.
                </p>
                <p>
                  Please read the Terms carefully before using the Website or the Services. By
                  accessing any part of the Website, you agree to be bound by the Terms. If you
                  don&apos;t agree with the Terms, you shouldn&apos;t access the Website or use our
                  Services.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">2. Overview</h3>
                <p>
                  The Website is operated and managed by <strong>Code It Out</strong>. Code It Out
                  provides the Website including all educational content, tutorials, information,
                  interactive code sandboxes, visualizers, challenges, learning path tracking,
                  certificates, and supporter billing systems.
                </p>
                <p>
                  Any new features or tools added to the Website shall be subject to the Terms. You
                  can review the most current version of the Terms at any time on this page. We
                  reserve the right to update, change, or replace parts of the Terms by posting
                  updates or changes at the Website. Please check this page periodically for
                  changes. Your continued use of or access to the Website after posting any changes
                  constitutes acceptance of such changes.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  3. Use of the Website and the Services
                </h3>
                <p>
                  Our Service is generally not intended for users under the age of 16. We do not
                  knowingly collect personal information from anyone under the age of 13 in ways not
                  allowed by the Children&apos;s Online Privacy Protection Act (COPPA). If you are a
                  parent or legal guardian and believe that your child has shared personal
                  information in a way that is not allowed by law, please contact us at{' '}
                  <span className="text-emerald-400 font-mono">codeitout156@gmail.com</span>. We will
                  look into it and delete the information as required by law.
                </p>
                <p>
                  When a school or educational institution uses our Services in an educational
                  setting, it is the school&apos;s responsibility to ensure it has the legal right
                  to share student information with us. This includes getting parental consent where
                  the law requires it, such as under COPPA. By using our Services on behalf of
                  students, the school confirms that it has obtained or holds all the necessary
                  permissions.
                </p>
                <p>
                  Some parts of the Services require you to create an account. When you register, we
                  collect information about you, like your name and email address. Your account
                  information and how we use your data are detailed in our Privacy Policy.
                </p>
                <p>
                  You agree not to use our products for illegal or unauthorized purposes. You must
                  comply with all laws, rules, and regulations, including copyright laws. Do not
                  transmit any viruses, worms, or harmful code through the Services.
                </p>
                <p>
                  If you breach our Terms, we may terminate your access to the Services immediately.
                  At our sole discretion, we reserve the right to remove or restrict your account
                  and any content you&apos;ve created.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  4. Intellectual Property Rights and Fair Use
                </h3>
                <p>
                  All content provided by Code It Out, including text, graphics, diagrams, logos,
                  images, and software, is owned by Code It Out. Any use, reproduction, extraction,
                  or redistribution beyond what is specifically allowed under these Terms is strictly
                  forbidden under applicable copyright laws.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#0b101b] border border-emerald-800/50 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 uppercase">
                      Permitted Fair Use
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                      <li>Research, news reporting, citations, and commentary</li>
                      <li>Linking to Code It Out and including references in search engines</li>
                      <li>Studying interactive examples for personal or classroom learning</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0b101b] border border-rose-800/50 space-y-2">
                    <div className="text-xs font-bold text-rose-400 uppercase">
                      Not Permitted Use
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                      <li>Copying for profitable or commercial use</li>
                      <li>Mass or verbatim copying, scraping, or automated extraction</li>
                      <li>Copying large portions of curriculum material</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">5. Privacy and Cookies</h3>
                <p>
                  Code It Out collects, uses, and processes personal data as described in our
                  Privacy Policy, which explains the legal basis we rely on for each purpose. Users
                  have certain rights regarding their data. For more information on these rights and
                  how to exercise them, please see our Privacy Policy. We use essential cookies and
                  local storage technologies to improve user experience and maintain session state.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  6. Products, Services, and Modifications
                </h3>
                <p>
                  To keep our offerings current, product descriptions, courses, and prices are
                  subject to change at any time without prior notice. Without warning, we can
                  discontinue the supply of any Services if our rules and guidelines or applicable
                  laws are violated. We are not liable to you or any third party for any loss
                  suffered due to modifications to the Website, price adjustments, suspension, or
                  discontinuation of the Service.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  7. Accuracy and Completeness of Information
                </h3>
                <p>
                  We do our best to provide accurate and current information. However, we cannot
                  guarantee that everything on the Website is complete or always up to date. Please
                  do not rely solely on the material at the Website when making important decisions.
                  You are using the information on the Website at your own risk. If you find any
                  errors, please let us know at{' '}
                  <span className="text-emerald-400 font-mono">codeitout156@gmail.com</span> so we can
                  correct them.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  8. Refund Policy &amp; Billing Information
                </h3>
                <p>
                  We reserve the right to refuse or cancel any order placed with us. You agree to
                  provide current, complete, and accurate purchase and account information for all
                  transactions made through our Website. Voluntary supporter contributions (&quot;Buy
                  Me a Coffee&quot;) and digital plans are non-refundable once processed, except as
                  required by applicable law.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  9. Optional Tools and Third-Party Links
                </h3>
                <p>
                  We sometimes provide access to third-party tools or links we do not develop,
                  monitor, or control. These tools are offered &quot;as is&quot; and &quot;as
                  available,&quot; without warranties, endorsements, or promises. We are not
                  responsible for any issues or damages that arise from your use of third-party
                  tools or websites.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">10. Prohibited Use</h3>
                <p>
                  In addition to other restrictions described in these Terms, the following
                  activities are forbidden when using the Website or its content:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                  <li>Engaging in any unlawful activity or encouraging others to do so</li>
                  <li>Violating international, national, regional, or local laws, regulations, or rules</li>
                  <li>Infringing upon our intellectual property rights or those of others</li>
                  <li>Harassing, abusing, insulting, harming, defaming, or discriminating against any individual or group</li>
                  <li>Providing false or misleading information</li>
                  <li>Uploading or transmitting viruses, malicious code, or harmful elements</li>
                  <li>Collecting or tracking personal information about others without authorization</li>
                  <li>Engaging in spamming, phishing, spidering, crawling, copying, or scraping</li>
                  <li>Interfering with or attempting to bypass the security features of the Service</li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  11. Disclaimer of Warranties and Limitation of Liability
                </h3>
                <p>
                  We do not guarantee that using the Service will be uninterrupted, timely, secure,
                  or error-free. By using the Service, you accept that you do so at your own risk.
                  Unless otherwise stated, we offer the Website and the Services &quot;as is&quot;
                  and &quot;as available&quot; without express or implied warranties. Under no
                  circumstances shall Code It Out, its directors, officers, employees, affiliates,
                  agents, contractors, or licensors be held liable for any injury, loss, claim, or
                  any direct, indirect, incidental, punitive, special, or consequential damages of
                  any kind.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  12. Indemnification, Entire Agreement &amp; Governing Law
                </h3>
                <p>
                  By using our Services, you agree that Code It Out and its related parties are not
                  responsible for any third-party claims or lawsuits arising from your violation of
                  these Terms. These Terms and any policies on the Website make up the entire
                  agreement between you and Code It Out. You acknowledge that these Terms form a
                  binding contract between you and Code It Out.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">13. Contact Information</h3>
                <p>
                  If you have any questions or concerns about these Terms, please contact us at{' '}
                  <span className="text-emerald-400 font-mono">codeitout156@gmail.com</span>.
                </p>
              </section>
            </article>
          )}

          {activeTab === 'privacy' && (
            <article className="space-y-6 max-w-4xl mx-auto">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Last Updated: November 6, 2026
                </div>
                <h1 className="text-2xl font-extrabold text-white mt-1">Privacy Policy</h1>
                <p className="text-xs text-slate-400 mt-1">
                  How Code It Out collects, uses, and protects your personal information when you
                  use our Website and Services.
                </p>
              </div>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">1. Introduction</h3>
                <p>
                  This Privacy Policy explains how <strong>Code It Out</strong> collects, uses, and
                  shares your personal information when you use our Website and Services. We
                  categorize our users as either &quot;Customers / Supporters&quot; or &quot;Free
                  Users&quot;. When we refer to &quot;Users&quot; without specifying, we mean both
                  groups.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">2. About Code It Out</h3>
                <p>
                  Code It Out is an online platform for learning software engineering, computer
                  science, and programming skills, offering interactive tutorials, courses,
                  visualizers, practice challenges, and certifications. Our educational resources
                  and interactive tools enable users to learn programming languages, build projects,
                  track their progress, and practice coding through exercises and quizzes.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">3. Information We Collect</h3>
                <p>
                  We collect information about you based on how you interact with us, your choices,
                  and the products and features you use, in accordance with applicable laws:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                  <li>
                    <strong>Contact &amp; Account Information:</strong> When you register, sign in,
                    or seek support, we collect your full name and email address to create and
                    manage your account.
                  </li>
                  <li>
                    <strong>Transactional Information:</strong> When you make a purchase or supporter
                    contribution, our payment processor collects encrypted transaction details. We
                    never store your full payment card details or banking credentials.
                  </li>
                  <li>
                    <strong>Usage &amp; Telemetry Information:</strong> We track how you interact
                    with the Website and Services, including completed modules, quiz scores, earned
                    certificates, bookmarks, device type, browser settings, and error diagnostics to
                    maintain and improve the platform.
                  </li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  4. How We Use and Share Information
                </h3>
                <p>
                  We use your information to operate, deliver, monitor, and maintain the Website and
                  Services, administer your account, synchronize your learning progress, provide
                  customer support, ensure platform security, and comply with legal obligations.
                </p>
                <p>
                  To deliver the Website and Services, we work with trusted service providers under
                  strict confidentiality and data-protection obligations for cloud hosting,
                  authentication, payment processing, and security monitoring. We also disclose
                  information when required to comply with applicable laws, enforce our Terms of
                  Service, or protect the rights, property, or safety of Code It Out and our Users.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  5. Your Privacy Rights &amp; Data Deletion
                </h3>
                <p>
                  You have choices and rights regarding how we collect and use your information,
                  including the Right of Access, Right to Rectification, Right to Erasure (Deletion),
                  Right to Data Portability, and Right to Object under applicable data privacy laws
                  (including GDPR, UK GDPR, DPDP, and CCPA):
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                  <li>
                    <strong>Data Portability:</strong> You can export a structured JSON copy of your
                    profile, progress, bookmarks, and certificates at any time from your Account
                    settings.
                  </li>
                  <li>
                    <strong>Account &amp; Data Deletion:</strong> You can permanently delete your
                    account and associated learning data directly from your Account settings or by
                    contacting us at{' '}
                    <span className="text-emerald-400 font-mono">codeitout156@gmail.com</span>.
                  </li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="text-base font-bold text-white">
                  6. Data Security, Retention &amp; Contact Us
                </h3>
                <p>
                  We use administrative, technical, and physical safeguards to protect your
                  information from unauthorized access, alteration, or disclosure, and retain your
                  information only for the minimum period necessary to provide the Services and
                  fulfill our legal obligations. If you have any questions about this Privacy
                  Policy, please contact us at{' '}
                  <span className="text-emerald-400 font-mono">codeitout156@gmail.com</span>.
                </p>
              </section>
            </article>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0b101b] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Code It Out. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className="hover:text-white underline underline-offset-4"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className="hover:text-white underline underline-offset-4"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              I Understand &amp; Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalCenterModal;
