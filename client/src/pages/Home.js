import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaHeart, FaBaby, FaDog, FaUserMd } from 'react-icons/fa';
import homeImage from '../assets/1.jpeg';
import Button from '../Components/Button';
import Card from '../Components/Card';

function Home() {
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
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${homeImage})` }}
      >
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 font-heading leading-tight"
          >
            Welcome to <span className="text-primary-400">ServEase</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl mb-10 text-neutral-200"
          >
            Certified Home & Care Services - Professional, Reliable, Trusted
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to="/services">
              <Button size="lg" variant="primary" className="shadow-lg shadow-primary-900/20">
                Book a Service
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="shadow-lg shadow-secondary-900/20">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Services Overview */}
      <div className="py-24 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-neutral-900 font-heading">
              Our Services
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comprehensive care solutions tailored to your needs
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
              { icon: FaHome, title: "House Help", desc: "Professional cleaning and household maintenance services", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: FaBaby, title: "Childcare", desc: "Certified nannies and babysitters for your children", color: "text-pink-500", bg: "bg-pink-50" },
              { icon: FaHeart, title: "Elderly Care", desc: "Compassionate nurses and caregivers for seniors", color: "text-red-500", bg: "bg-red-50" },
              { icon: FaDog, title: "Pet Care", desc: "Reliable pet sitters and walkers for your furry friends", color: "text-orange-500", bg: "bg-orange-50" },
            ].map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full p-8 hover:border-primary-200 transition-colors">
                  <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center mb-6`}>
                    <service.icon className={`text-3xl ${service.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-900">{service.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{service.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-neutral-900 font-heading">
              Why Choose ServEase?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              We set the standard for quality home services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: FaUserMd, title: "Certified Staff", desc: "All our helpers are verified, trained, and certified" },
              { icon: FaHeart, title: "Reliable Service", desc: "Punctual, professional, and organized service delivery" },
              { icon: FaHome, title: "Easy Booking", desc: "Simple online booking and scheduling system" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <feature.icon className="text-4xl text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed max-w-sm mx-auto">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

