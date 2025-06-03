import React from 'react'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto h-24 w-24 sm:h-32 sm:w-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-8"
        >
          <ApperIcon name="AlertTriangle" className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-6xl sm:text-8xl font-bold text-surface-900 dark:text-white mb-4"
        >
          404
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-2xl sm:text-3xl font-semibold text-surface-700 dark:text-surface-300 mb-4"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved to a different location.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ApperIcon name="Home" className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound