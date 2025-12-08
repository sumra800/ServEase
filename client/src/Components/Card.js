import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, ...props }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' } : {}}
            className={twMerge(clsx('bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden', className))}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
