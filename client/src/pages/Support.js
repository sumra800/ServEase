import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaQrcode, FaUniversity, FaMobileAlt, FaCopy, FaCheck } from 'react-icons/fa';
import Card from '../Components/Card';

function Support() {
  const [copied, setCopied] = useState('');

  const paymentMethods = [
    {
      name: 'Easypaisa',
      type: 'Mobile Wallet',
      number: '0300-1234567',
      accountName: 'ServEase Platform',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Easypaisa:03001234567',
      color: 'bg-green-500',
    },
    {
      name: 'JazzCash',
      type: 'Mobile Wallet',
      number: '0300-1234567',
      accountName: 'ServEase Platform',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=JazzCash:03001234567',
      color: 'bg-red-500',
    },
    {
      name: 'Bank Transfer',
      type: 'Bank Account',
      bankName: 'Meezan Bank',
      accountNumber: 'PK12MEZN0001234567890123',
      accountTitle: 'ServEase Platform',
      iban: 'PK12MEZN0001234567890123',
      color: 'bg-primary-600',
    },
  ];

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <FaHeart className="text-primary-600 text-4xl animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-6 font-heading">Support ServEase</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Your support helps us continue providing exceptional home and care services.
            Every contribution makes a difference!
          </p>
        </motion.div>

        {/* Why Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="p-10 border-t-4 border-t-primary-500">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center font-heading">Why Support Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "🚀", title: "Innovation", desc: "Help us develop new features and improve our platform" },
                { icon: "💝", title: "Community", desc: "Support our mission to connect people with quality services" },
                { icon: "⭐", title: "Quality", desc: "Enable us to maintain high standards and certified services" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 hover:bg-primary-100 transition-colors cursor-default">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-neutral-900 text-center mb-10 font-heading">Payment Methods</h2>

          {/* Mobile Wallets */}
          {paymentMethods.filter(m => m.type === 'Mobile Wallet').map((method, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 hover:border-primary-300 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 ${method.name === 'Easypaisa' ? 'bg-green-100' : 'bg-red-100'} rounded-2xl flex items-center justify-center`}>
                        <FaMobileAlt className={`${method.name === 'Easypaisa' ? 'text-green-600' : 'text-red-600'} text-3xl`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900">{method.name}</h3>
                        <p className="text-neutral-500 font-medium">{method.type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                        <p className="text-sm text-neutral-500 mb-1 font-medium uppercase tracking-wider">Account Number</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold text-neutral-900 font-mono">{method.number}</p>
                          <button
                            onClick={() => copyToClipboard(method.number, `mobile-${index}`)}
                            className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-neutral-200"
                            title="Copy"
                          >
                            <AnimatePresence mode='wait'>
                              {copied === `mobile-${index}` ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <FaCheck className="text-green-600" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <FaCopy className="text-neutral-400 hover:text-primary-600" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                        <p className="text-sm text-neutral-500 mb-1 font-medium uppercase tracking-wider">Account Name</p>
                        <p className="text-xl font-bold text-neutral-900">{method.accountName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                    <div className="text-center">
                      <FaQrcode className="text-4xl text-neutral-300 mb-4 mx-auto" />
                      <img
                        src={method.qrCode}
                        alt={`${method.name} QR Code`}
                        className="w-48 h-48 mx-auto rounded-lg mb-2"
                      />
                      <p className="text-sm text-neutral-500 font-medium">Scan to Pay</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Bank Transfer */}
          {paymentMethods.filter(m => m.type === 'Bank Account').map((method, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 hover:border-primary-300 transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <FaUniversity className="text-primary-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">{method.name}</h3>
                    <p className="text-neutral-500 font-medium">{method.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                      <p className="text-sm text-neutral-500 mb-1 font-medium uppercase tracking-wider">Bank Name</p>
                      <p className="text-xl font-bold text-neutral-900">{method.bankName}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                      <p className="text-sm text-neutral-500 mb-1 font-medium uppercase tracking-wider">Account Title</p>
                      <p className="text-xl font-bold text-neutral-900">{method.accountTitle}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { label: "Account Number", value: method.accountNumber, id: `account-${index}` },
                      { label: "IBAN", value: method.iban, id: `iban-${index}` }
                    ].map((field, idx) => (
                      <div key={idx} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">{field.label}</p>
                          <button
                            onClick={() => copyToClipboard(field.value, field.id)}
                            className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-neutral-200"
                            title="Copy"
                          >
                            <AnimatePresence mode='wait'>
                              {copied === field.id ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <FaCheck className="text-green-600" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <FaCopy className="text-neutral-400 hover:text-primary-600" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                        <p className="text-lg font-bold text-neutral-900 font-mono break-all">{field.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-10 shadow-xl text-white">
            <h3 className="text-3xl font-bold mb-4">Thank You for Your Support!</h3>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              Your contribution helps us maintain and improve ServEase. We appreciate your generosity and trust in our platform.
            </p>
            <p className="text-white/80">
              Questions? Contact us at{' '}
              <a href="mailto:support@servease.com" className="text-white font-bold hover:underline decoration-2 underline-offset-4">
                support@servease.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Support;

