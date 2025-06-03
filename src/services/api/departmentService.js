import departmentData from '../mockData/departments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let departments = [...departmentData]

const departmentService = {
  async getAll() {
    await delay(200)
    return [...departments]
  },

  async getById(id) {
    await delay(150)
    const department = departments.find(dept => dept.id === id)
    return department ? { ...department } : null
  },

  async create(departmentData) {
    await delay(350)
    const newDepartment = {
      ...departmentData,
      id: Date.now().toString()
    }
    departments.push(newDepartment)
    return { ...newDepartment }
  },

  async update(id, updatedData) {
    await delay(300)
    const index = departments.findIndex(dept => dept.id === id)
    if (index !== -1) {
      departments[index] = { ...departments[index], ...updatedData }
      return { ...departments[index] }
    }
    throw new Error('Department not found')
  },

  async delete(id) {
    await delay(250)
    const index = departments.findIndex(dept => dept.id === id)
    if (index !== -1) {
      const deletedDepartment = departments.splice(index, 1)[0]
      return { ...deletedDepartment }
    }
    throw new Error('Department not found')
  },

  async getStaffingLevels() {
    await delay(300)
    return departments.map(dept => ({
      ...dept,
      staffingPercentage: Math.round((dept.currentStaffing / dept.minimumStaffing.total) * 100)
    }))
  }
}

export default departmentService