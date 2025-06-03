const { ApperClient } = window.ApperSDK

class LeaveRequestService {
  constructor() {
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'leave_request'
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'start_date', 'end_date', 'reason', 'status', 'submitted_date', 'approved_date', 'rejection_reason', 'employee_id', 'approver']
    this.updateableFields = ['Name', 'Tags', 'Owner', 'start_date', 'end_date', 'reason', 'status', 'submitted_date', 'approved_date', 'rejection_reason', 'employee_id', 'approver']
  }

  async fetchAllLeaveRequests(params = {}) {
    try {
      const queryParams = {
        fields: this.allFields,
        pagingInfo: {
          limit: params.limit || 50,
          offset: params.offset || 0
        },
        ...params
      }

      const response = await this.apperClient.fetchRecords(this.tableName, queryParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      throw new Error('Failed to fetch leave requests')
    }
  }

  async getLeaveRequestById(id) {
    try {
      const params = { fields: this.allFields }
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching leave request ${id}:`, error)
      throw new Error('Failed to fetch leave request')
    }
  }

  async createLeaveRequest(requestData) {
    try {
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (requestData[field] !== undefined) {
          // Ensure dates are in YYYY-MM-DD format
          if (['start_date', 'end_date', 'submitted_date', 'approved_date'].includes(field) && requestData[field]) {
            filteredData[field] = new Date(requestData[field]).toISOString().split('T')[0]
          } else {
            filteredData[field] = requestData[field]
          }
        }
      })

      // Set default values
      filteredData.status = filteredData.status || 'pending'
      filteredData.submitted_date = filteredData.submitted_date || new Date().toISOString().split('T')[0]

      const params = { records: [filteredData] }
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create leave request')
      }
    } catch (error) {
      console.error('Error creating leave request:', error)
      throw new Error('Failed to create leave request')
    }
  }

  async updateLeaveRequest(id, requestData) {
    try {
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (requestData[field] !== undefined) {
          if (['start_date', 'end_date', 'submitted_date', 'approved_date'].includes(field) && requestData[field]) {
            filteredData[field] = new Date(requestData[field]).toISOString().split('T')[0]
          } else {
            filteredData[field] = requestData[field]
          }
        }
      })

      const params = { records: [filteredData] }
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update leave request')
      }
    } catch (error) {
      console.error('Error updating leave request:', error)
      throw new Error('Failed to update leave request')
    }
  }

  async deleteLeaveRequest(ids) {
    try {
      const params = {
        RecordIds: Array.isArray(ids) ? ids : [ids]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      return response?.success || false
    } catch (error) {
      console.error('Error deleting leave request:', error)
      throw new Error('Failed to delete leave request')
    }
  }

  async approveLeaveRequest(id, approverId) {
    try {
      return await this.updateLeaveRequest(id, {
        status: 'approved',
        approver: approverId,
        approved_date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error approving leave request:', error)
      throw new Error('Failed to approve leave request')
    }
  }

  async rejectLeaveRequest(id, approverId, reason) {
    try {
      return await this.updateLeaveRequest(id, {
        status: 'rejected',
        approver: approverId,
        rejection_reason: reason
      })
    } catch (error) {
      console.error('Error rejecting leave request:', error)
      throw new Error('Failed to reject leave request')
    }
  }

  async getLeaveRequestsByEmployee(employeeId) {
    try {
      const params = {
        fields: this.allFields,
        where: [{
          fieldName: 'employee_id',
          operator: 'EqualTo',
          values: [employeeId]
        }]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching leave requests by employee:', error)
      throw new Error('Failed to fetch leave requests by employee')
    }
  }

  async getPendingLeaveRequests() {
    try {
      const params = {
        fields: this.allFields,
        where: [{
          fieldName: 'status',
          operator: 'ExactMatch',
          values: ['pending']
        }]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching pending leave requests:', error)
      throw new Error('Failed to fetch pending leave requests')
    }
  }
}

export default new LeaveRequestService()