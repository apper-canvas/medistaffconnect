import employeeData from '../mockData/employees.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let employees = [...employeeData]

const employeeService = {
  async getAll() {
    await delay(300)
    return [...employees]
  },

  async getById(id) {
    await delay(200)
    const employee = employees.find(emp => emp.id === id)
    return employee ? { ...employee } : null
  },

  async create(employeeData) {
    await delay(400)
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString()
    }
    employees.push(newEmployee)
    return { ...newEmployee }
  },

  async update(id, updatedData) {
    await delay(350)
    const index = employees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      employees[index] = { ...employees[index], ...updatedData }
      return { ...employees[index] }
    }
    throw new Error('Employee not found')
  },

  async delete(id) {
    await delay(300)
    const index = employees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      const deletedEmployee = employees.splice(index, 1)[0]
      return { ...deletedEmployee }
    }
    throw new Error('Employee not found')
  },

  async getByDepartment(department) {
    await delay(250)
    return employees.filter(emp => emp.department === department).map(emp => ({ ...emp }))
  },

  async getAvailableStaff(date, timeSlot) {
    await delay(300)
    // Filter based on availability
    return employees.filter(emp => {
      const availability = emp.availability?.[date]
      return availability && availability.includes(timeSlot)
    }).map(emp => ({ ...emp }))
  }
}

export default employeeService