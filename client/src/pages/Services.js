import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaBaby, FaHeart, FaDog, FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaTimes } from 'react-icons/fa';
import servicesImage from '../assets/3.jpeg';
import { servicesAPI } from '../utils/api';
import Button from '../Components/Button';
import Card from '../Components/Card';

// Icon mapping
const iconMap = {
  FaHome,
  FaBaby,
  FaHeart,
  FaDog,
};

function Services() {
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll();
      if (response.success) {
        // Map icon strings to actual icon components
        const servicesWithIcons = response.services.map(service => ({
          ...service,
          icon: iconMap[service.icon] || FaHome,
        }));
        setServices(servicesWithIcons);
      }
    } catch (err) {
      setError(err.message || 'Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${servicesImage})` }}
      >
        <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 font-heading"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-neutral-200 max-w-2xl mx-auto"
          >
            Choose from our range of certified home and care services, delivered by professionals you can trust.
          </motion.p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <Button onClick={fetchServices} variant="primary">
                Retry
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            >
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.div key={service.id} variants={itemVariants}>
                    <Card
                      className="h-full flex flex-col p-6 cursor-pointer hover:border-primary-300 transition-all duration-300 group"
                      onClick={() => setSelectedService(service)}
                    >
                      <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                        <Icon className="text-3xl text-primary-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-neutral-900 font-heading group-hover:text-primary-600 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-neutral-600 mb-6 flex-grow line-clamp-3">
                        {service.description}
                      </p>
                      <div className="mt-auto">
                        <p className="text-2xl font-bold text-primary-600 mb-4">{service.price}</p>
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Service Details Modal */}
          <AnimatePresence>
            {selectedService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedService(null)}
                  className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                ></motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-neutral-900 font-heading mb-2">
                        {selectedService.name}
                      </h2>
                      <p className="text-primary-600 font-semibold text-xl">
                        {selectedService.price}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedService(null)}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 hover:bg-neutral-100 rounded-full"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  <div className="prose prose-neutral max-w-none mb-8">
                    <p className="text-lg text-neutral-600 leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-bold mb-4 text-neutral-900 flex items-center gap-2">
                      <FaCheckCircle className="text-primary-600" />
                      What's Included
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-neutral-700">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4 flex-col sm:flex-row">
                    <Link
                      to="/booking"
                      state={{
                        service: {
                          id: selectedService.id,
                          name: selectedService.name,
                          description: selectedService.description,
                          price: selectedService.price,
                          basePrice: selectedService.basePrice,
                          features: selectedService.features
                        }
                      }}
                      className="flex-1"
                    >
                      <Button size="lg" className="w-full shadow-lg shadow-primary-900/20">
                        Book This Service
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => setSelectedService(null)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900 font-heading">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Simple steps to get the care you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-neutral-100 -z-10 transform -translate-y-1/2"></div>

            {[
              { step: "1", title: "Choose Service", desc: "Select from our range of certified services" },
              { step: "2", title: "Book & Schedule", desc: "Pick your preferred date and time" },
              { step: "3", title: "Get Assigned", desc: "We assign a verified professional" },
              { step: "4", title: "Enjoy Service", desc: "Receive quality service and provide feedback" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center bg-white"
              >
                <div className="bg-white inline-block p-2 rounded-full mb-6">
                  <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center shadow-sm border-4 border-white">
                    <span className="text-3xl font-bold text-primary-600 font-heading">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900">{item.title}</h3>
                <p className="text-neutral-600 leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;

