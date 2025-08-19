
import React from 'react';
import FaqAccordion from '../FaqAccordion';

const Faq = () => {
  const faqs = [
    {
      question: "How does Coinomad work?",
      answer: "Coinomad simplifies crypto payroll by allowing you to set up recurring payments to your team members across multiple blockchains. You deposit funds in your preferred stablecoin, set up your team's wallet addresses and payment amounts, and our platform handles the rest automatically each month."
    },
    {
      question: "Can I pay across multiple blockchains?",
      answer: "Yes! Coinomad supports payments across 4 EVM chains including Ethereum, Polygon, Base, and Celo. You can pay different team members on different chains according to their preferences."
    },
    {
      question: "How secure is Coinomad?",
      answer: "Coinomad is built with security in mind. We use industry-standard encryption and security protocols to ensure your funds are safe and secure. We also have a robust audit and compliance program in place to ensure our platform is compliant with all relevant regulations."
    },
    {
      question: "What type of wallets does Coinomad use?",
      answer: "Coinomad wallets are powered by Pimlico smart accounts and use paymasters, meaning users never need native currency like ETH to send transactions. This eliminates the common friction of needing gas tokens for every transaction, making the payment process seamless for both senders and receivers."
    },
    {
      question: "Is Coinomad compliant?",
      answer: "Coinomad provides the tools for compliant crypto payroll, including comprehensive reporting for accounting and tax purposes. However, compliance requirements vary by jurisdiction, so we recommend consulting with your legal and tax advisors regarding your specific situation."
    },
    {
      question: "What are the fees?",
      answer: "Coinomad charges a tiny percentage per payment schedule with hidden fees."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-black">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-coinomad-textGray text-lg">
            Have questions about Coinomad? We've got answers.
          </p>
        </div>
        
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
};

export default Faq;
