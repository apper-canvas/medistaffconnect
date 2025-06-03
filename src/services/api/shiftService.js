import shiftData from '../mockData/shifts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let shifts = [...shiftData]

const shiftService = {
  async getAll() {
    await delay(250)
    return [...shifts]
  },

  async getById(id) {
    await delay(200)
    const shift = shifts.find(s => s.id === id)
    return shift ? { ...shift } : null
  },

  async create(shiftData) {
    await delay(400)
    const newShift = {
      ...shiftData,
      id: Date.now().toString(),
      assignedStaff: shiftData.assignedStaff || []
    }
    shifts.push(newShift)
    return { ...newShift }
  },

  async update(id, updatedData) {
    await delay(350)
    const index = shifts.findIndex(s => s.id === id)
    if (index !== -1) {
      shifts[index] = { ...shifts[index], ...updatedData }
      return { ...shifts[index] }
    }
    throw new Error('Shift not found')
  },

  async delete(id) {
    await delay(300)
    const index = shifts.findIndex(s => s.id === id)
    if (index !== -1) {
      const deletedShift = shifts.splice(index, 1)[0]
      return { ...deletedShift }
    }
    throw new Error('Shift not found')
  },

  async getByDate(date) {
    await delay(250)
    return shifts.filter(s => s.date === date).map(s => ({ ...s }))
  },

  async getByDepartment(department) {
    await delay(250)
    return shifts.filter(s => s.department === department).map(s => ({ ...s }))
  },

  async assignStaff(shiftId, employeeId) {
    await delay(300)
    const shift = shifts.find(s => s.id === shiftId)
    if (shift) {
      if (!shift.assignedStaff) shift.assignedStaff = []
      if (!shift.assignedStaff.find(staff => staff.id === employeeId)) {
        // In a real app, you'd fetch employee details
        shift.assignedStaff.push({ id: employeeId })
      }
      return { ...shift }
    }
    throw new Error('Shift not found')
  }
}

export default shiftService