import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="bg-neutral-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-heading font-bold text-white mb-4 block">
                            ServEase
                        </Link>
                        <p className="text-neutral-400 mb-6">
                            Your trusted partner for home services. Professional, reliable, and convenient.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors text-xl">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors text-xl">
                                <FaTwitter />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors text-xl">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors text-xl">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
                        <ul className="space-y-2">
                            <li><Link to="/services" className="text-neutral-400 hover:text-white transition-colors">House Help</Link></li>
                            <li><Link to="/services" className="text-neutral-400 hover:text-white transition-colors">Childcare</Link></li>
                            <li><Link to="/services" className="text-neutral-400 hover:text-white transition-colors">Elderly Care</Link></li>
                            <li><Link to="/services" className="text-neutral-400 hover:text-white transition-colors">Pet Care</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
                        <ul className="space-y-2">
                            <li className="text-neutral-400">123 Service Street</li>
                            <li className="text-neutral-400">FAST NUCES Lahore, ST 12</li>
                            <li className="text-neutral-400">support@servease.com</li>
                            <li className="text-neutral-400">+92 300 1234567</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 text-center text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} ServEase. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
