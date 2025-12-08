import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUsers, FaAward, FaShieldAlt } from 'react-icons/fa';
import aboutImage from '../assets/2.jpeg';
import Card from '../Components/Card';

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${aboutImage})` }}
      >
        <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 font-heading"
          >
            About <span className="text-primary-400">ServEase</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-neutral-200"
          >
            Professionalizing Home & Care Services
          </motion.p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-neutral-900 font-heading">Our Mission</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                ServEase is a web-based SaaS platform designed to connect households with
                certified, uniformed, and reliable domestic and care service providers.
                We bridge the gap between families seeking trustworthy home assistance
                and verified professionals.
              </p>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Our goal is to modernize and dignify domestic labor by providing a
                structured, safe, and transparent digital ecosystem for both clients
                and service providers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-primary-50 p-10 rounded-3xl"
            >
              <h3 className="text-2xl font-bold mb-6 text-neutral-900 font-heading">What We Offer</h3>
              <ul className="space-y-4">
                {[
                  "Verified and certified service providers",
                  "Pre-booked and organized services",
                  "Quality-controlled service delivery",
                  "Transparent pricing and ratings"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="mt-1">
                      <FaCheckCircle className="text-primary-600 text-xl" />
                    </div>
                    <span className="text-neutral-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-neutral-900 font-heading mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              The principles that drive our commitment to excellence
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: FaShieldAlt, title: "Trust & Safety", desc: "Background checks and verification for all staff" },
              { icon: FaAward, title: "Quality", desc: "High standards and continuous improvement" },
              { icon: FaUsers, title: "Professionalism", desc: "Uniformed, trained, and certified professionals" },
              { icon: FaCheckCircle, title: "Reliability", desc: "Punctual and dependable service delivery" },
            ].map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-8 h-full hover:border-primary-200">
                  <div className="bg-primary-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <value.icon className="text-4xl text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">{value.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{value.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-neutral-900 font-heading">
              The Problem We Solve
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-red-50 border-l-4 border-red-500 p-8 rounded-r-xl shadow-sm"
          >
            <p className="text-xl text-neutral-800 mb-6 font-medium">
              Finding reliable and verified home help remains a persistent issue for many families.
              The current unstructured hiring system creates several problems:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Lack of verification or certification for helpers",
                "Frequent absenteeism and poor reliability",
                "No standard mechanism for replacement or refunds",
                "Limited options for emergency or short-term assistance",
                "Safety and trust concerns, especially for children and elderly care"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-2 w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-neutral-700">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;

