import React from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const Home = () => {
  const stats = [
    { icon: "Users", label: "Active Staff", value: "247", color: "text-primary" },
    { icon: "Calendar", label: "Shifts Today", value: "89", color: "text-secondary" },
    { icon: "Clock", label: "Coverage Rate", value: "94%", color: "text-medical-success" },
    { icon: "AlertTriangle", label: "Open Shifts", value: "12", color: "text-medical-warning" }
  ]

  const departments = [
    { name: "Emergency", staff: 24, required: 28, status: "understaffed" },
    { name: "ICU", staff: 18, required: 18, status: "adequate" },
    { name: "Surgery", staff: 15, required: 12, status: "overstaffed" },
    { name: "Cardiology", staff: 8, required: 10, status: "understaffed" },
    { name: "Pediatrics", staff: 12, required: 12, status: "adequate" },
    { name: "Orthopedics", staff: 9, required: 8, status: "overstaffed" }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'understaffed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'adequate': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'overstaffed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200'
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full"></div>
          <h1 className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Hospital Workforce
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Management System
            </span>
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto leading-relaxed">
          Streamline staff scheduling, track certifications, and ensure optimal coverage across all departments with real-time insights.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="neo-card rounded-xl p-4 sm:p-6 text-center hover:shadow-medical transition-all duration-300"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 mb-3`}>
              <ApperIcon name={stat.icon} className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-400">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8 sm:mb-12"
      >
        <MainFeature />
      </motion.div>

      {/* Department Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card p-6 sm:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-2 sm:mb-0">
            Department Staffing Overview
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-surface-600 dark:text-surface-400">Live Status</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="group p-4 sm:p-5 bg-surface-50 dark:bg-surface-700/50 rounded-xl hover:shadow-soft transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-surface-900 dark:text-white group-hover:text-primary transition-colors">
                  {dept.name}
                </h3>
                <span className={`status-indicator ${getStatusColor(dept.status)}`}>
                  {dept.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-surface-600 dark:text-surface-400 mb-2">
                <span>Current: {dept.staff}</span>
                <span>Required: {dept.required}</span>
              </div>
              
              <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    dept.staff >= dept.required ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((dept.staff / dept.required) * 100, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between mt-3 text-xs text-surface-500 dark:text-surface-400">
                <span>{Math.round((dept.staff / dept.required) * 100)}% Staffed</span>
                <ApperIcon name="TrendingUp" className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 sm:mt-12"
      >
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: "Plus", label: "Add Staff", color: "bg-primary" },
              { icon: "Calendar", label: "Schedule Shift", color: "bg-secondary" },
              { icon: "FileText", label: "Leave Request", color: "bg-accent" },
              { icon: "Bell", label: "Send Alert", color: "bg-medical-emergency" }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className={`${action.color} hover:opacity-90 text-white p-4 sm:p-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 group`}
              >
                <ApperIcon name={action.icon} className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs sm:text-sm">{action.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home