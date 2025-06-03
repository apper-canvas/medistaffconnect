import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import employeeService from '../services/api/employeeService'
import shiftService from '../services/api/shiftService'
import departmentService from '../services/api/departmentService'

const MainFeature = () => {
  const [employees, setEmployees] = useState([])
  const [shifts, setShifts] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'calendar'
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [draggedEmployee, setDraggedEmployee] = useState(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [employeesData, shiftsData, departmentsData] = await Promise.all([
          employeeService.getAll(),
          shiftService.getAll(),
          departmentService.getAll()
        ])
        setEmployees(employeesData || [])
        setShifts(shiftsData || [])
        setDepartments(departmentsData || [])
      } catch (err) {
        setError(err.message)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter shifts by selected date and department
  const filteredShifts = shifts.filter(shift => {
    const matchesDate = shift?.date === selectedDate
    const matchesDepartment = selectedDepartment === 'all' || shift?.department === selectedDepartment
    return matchesDate && matchesDepartment
  })

  // Get available employees for assignment
  const getAvailableEmployees = (targetShift) => {
    return employees.filter(emp => {
      if (!emp || !targetShift) return false
      
      // Check if employee is in the same department or has cross-training
      const sameDepart = emp.department === targetShift.department
      const crossTrained = emp.certifications?.includes(targetShift.department)
      
      // Check if employee is already assigned to this shift
      const alreadyAssigned = targetShift.assignedStaff?.some(staff => staff.id === emp.id)
      
      return (sameDepart || crossTrained) && !alreadyAssigned
    })
  }

  // Handle drag and drop
  const handleDragStart = (e, employee) => {
    setDraggedEmployee(employee)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, shift) => {
    e.preventDefault()
    if (!draggedEmployee || !shift) return

    try {
      // Check if employee can be assigned
      const availableEmployees = getAvailableEmployees(shift)
      if (!availableEmployees.find(emp => emp.id === draggedEmployee.id)) {
        toast.error("Employee cannot be assigned to this shift")
        return
      }

      // Add employee to shift
      const updatedAssignedStaff = [...(shift.assignedStaff || []), draggedEmployee]
      const updatedShift = {
        ...shift,
        assignedStaff: updatedAssignedStaff
      }

      await shiftService.update(shift.id, updatedShift)
      
      // Update local state
      setShifts(shifts.map(s => s.id === shift.id ? updatedShift : s))
      
      toast.success(`${draggedEmployee.name} assigned to ${shift.department} shift`)
    } catch (err) {
      toast.error("Failed to assign employee")
    } finally {
      setDraggedEmployee(null)
    }
  }

  // Handle employee removal from shift
  const handleRemoveEmployee = async (shift, employeeToRemove) => {
    try {
      const updatedAssignedStaff = shift.assignedStaff?.filter(emp => emp.id !== employeeToRemove.id) || []
      const updatedShift = {
        ...shift,
        assignedStaff: updatedAssignedStaff
      }

      await shiftService.update(shift.id, updatedShift)
      setShifts(shifts.map(s => s.id === shift.id ? updatedShift : s))
      
      toast.success(`${employeeToRemove.name} removed from shift`)
    } catch (err) {
      toast.error("Failed to remove employee")
    }
  }

  // Get shift status
  const getShiftStatus = (shift) => {
    const assigned = shift?.assignedStaff?.length || 0
    const required = shift?.requiredStaff || 0
    
    if (assigned === 0) return { status: 'empty', color: 'bg-gray-100 border-gray-300' }
    if (assigned < required) return { status: 'understaffed', color: 'bg-red-50 border-red-300' }
    if (assigned === required) return { status: 'full', color: 'bg-green-50 border-green-300' }
    return { status: 'overstaffed', color: 'bg-blue-50 border-blue-300' }
  }

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
          <span className="ml-3 text-surface-600 dark:text-surface-400">Loading staff data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          <ApperIcon name="AlertCircle" className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading data: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white mb-2">
              Interactive Shift Scheduler
            </h2>
            <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
              Drag and drop employees to assign shifts, or click to manage manually
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Date Selector */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field text-sm py-2"
              />
            </div>
            
            {/* Department Filter */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-field text-sm py-2"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1">
                View
              </label>
              <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-md text-xs transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm' 
                      : 'text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded-md text-xs transition-all ${
                    viewMode === 'calendar' 
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm' 
                      : 'text-surface-600 dark:text-surface-400'
                  }`}
                >
                  <ApperIcon name="Calendar" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Available Staff Panel */}
        <div className="xl:col-span-1">
          <div className="card p-4 sm:p-6 h-fit xl:sticky xl:top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-surface-900 dark:text-white">Available Staff</h3>
              <span className="text-xs text-surface-500 dark:text-surface-400">
                {employees.length} total
              </span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
              {employees.map(employee => (
                <motion.div
                  key={employee.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, employee)}
                  className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg cursor-move hover:shadow-sm transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon name="User" className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                        {employee.name}
                      </p>
                      <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                        {employee.role} • {employee.department}
                      </p>
                    </div>
                    <ApperIcon 
                      name="GripVertical" 
                      className="h-4 w-4 text-surface-400 group-hover:text-surface-600 transition-colors" 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Shifts Grid */}
        <div className="xl:col-span-3">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-surface-900 dark:text-white">
                Shifts for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              <span className="text-xs text-surface-500 dark:text-surface-400">
                {filteredShifts.length} shifts
              </span>
            </div>

            {filteredShifts.length === 0 ? (
              <div className="text-center py-12 text-surface-500 dark:text-surface-400">
                <ApperIcon name="Calendar" className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No shifts scheduled for this date</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{filteredShifts.map(shift => {
                  const shiftStatus = getShiftStatus(shift)
                  const assignedCount = shift?.assigned_staff?.length || 0
                  const requiredCount = shift?.required_staff || 0
                  
                  return (
                    <motion.div
                      key={shift.Id}
                      className={`p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:shadow-md ${shiftStatus.color}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, shift)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-surface-900 dark:text-white">
                          {shift.department}
                        </h4>
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          {shift.start_time} - {shift.end_time}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3 text-sm">
                        <span className="text-surface-600 dark:text-surface-400">
                          Staff: {assignedCount}/{requiredCount}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${
                          assignedCount >= requiredCount ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      </div>

                      {/* Assigned Staff */}
                      <div className="space-y-2 mb-3">
                        <AnimatePresence>
                          {shift?.assigned_staff?.map(staff => (
                            <motion.div
                              key={staff.Id || staff.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center justify-between p-2 bg-white dark:bg-surface-600 rounded-lg"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                  <ApperIcon name="User" className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-xs font-medium text-surface-900 dark:text-white">
                                  {staff.Name || staff.name}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemoveEmployee(shift, staff)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <ApperIcon name="X" className="h-3 w-3" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {/* Drop Zone */}
                      {assignedCount < requiredCount && (
                        <div className="border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg p-3 text-center text-xs text-surface-500 dark:text-surface-400">
                          Drop staff here to assign
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature