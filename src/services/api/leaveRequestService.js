import leaveRequestData from '../mockData/leaveRequests.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let leaveRequests = [...leaveRequestData]

const leaveRequestService = {
  async getAll() {
    await delay(250)
    return [...leaveRequests]
  },

  async getById(id) {
    await delay(200)
    const request = leaveRequests.find(req => req.id === id)
    return request ? { ...request } : null
  },

  async create(requestData) {
    await delay(400)
    const newRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0]
    }
    leaveRequests.push(newRequest)
    return { ...newRequest }
  },

  async update(id, updatedData) {
    await delay(350)
    const index = leaveRequests.findIndex(req => req.id === id)
    if (index !== -1) {
      leaveRequests[index] = { ...leaveRequests[index], ...updatedData }
      return { ...leaveRequests[index] }
    }
    throw new Error('Leave request not found')
  },

  async delete(id) {
    await delay(300)
    const index = leaveRequests.findIndex(req => req.id === id)
    if (index !== -1) {
      const deletedRequest = leaveRequests.splice(index, 1)[0]
      return { ...deletedRequest }
    }
    throw new Error('Leave request not found')
  },

  async approve(id, approverId) {
    await delay(300)
    return this.update(id, { status: 'approved', approver: approverId, approvedDate: new Date().toISOString().split('T')[0] })
  },

  async reject(id, approverId, reason) {
    await delay(300)
    return this.update(id, { status: 'rejected', approver: approverId, rejectionReason: reason })
  },

  async getByEmployee(employeeId) {
    await delay(250)
    return leaveRequests.filter(req => req.employeeId === employeeId).map(req => ({ ...req }))
  },

  async getPending() {
    await delay(200)
    return leaveRequests.filter(req => req.status === 'pending').map(req => ({ ...req }))
  }
}

export default leaveRequestService