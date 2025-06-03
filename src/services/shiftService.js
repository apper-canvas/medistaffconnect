const { ApperClient } = window.ApperSDK

class ShiftService {
  constructor() {
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'shift'
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'date', 'start_time', 'end_time', 'required_staff', 'department', 'assigned_staff']
    this.updateableFields = ['Name', 'Tags', 'Owner', 'date', 'start_time', 'end_time', 'required_staff', 'department', 'assigned_staff']
  }

  async fetchAllShifts(params = {}) {
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
      console.error('Error fetching shifts:', error)
      throw new Error('Failed to fetch shifts')
    }
  }

  async getShiftById(id) {
    try {
      const params = { fields: this.allFields }
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching shift ${id}:`, error)
      throw new Error('Failed to fetch shift')
    }
  }

  async createShift(shiftData) {
    try {
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (shiftData[field] !== undefined) {
          // Ensure date is in YYYY-MM-DD format
          if (field === 'date' && shiftData[field]) {
            filteredData[field] = new Date(shiftData[field]).toISOString().split('T')[0]
          } else {
            filteredData[field] = shiftData[field]
          }
        }
      })

      const params = { records: [filteredData] }
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create shift')
      }
    } catch (error) {
      console.error('Error creating shift:', error)
      throw new Error('Failed to create shift')
    }
  }

  async updateShift(id, shiftData) {
    try {
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (shiftData[field] !== undefined) {
          if (field === 'date' && shiftData[field]) {
            filteredData[field] = new Date(shiftData[field]).toISOString().split('T')[0]
          } else {
            filteredData[field] = shiftData[field]
          }
        }
      })

      const params = { records: [filteredData] }
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update shift')
      }
    } catch (error) {
      console.error('Error updating shift:', error)
      throw new Error('Failed to update shift')
    }
  }

  async deleteShift(ids) {
    try {
      const params = {
        RecordIds: Array.isArray(ids) ? ids : [ids]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      return response?.success || false
    } catch (error) {
      console.error('Error deleting shift:', error)
      throw new Error('Failed to delete shift')
    }
  }

  async getShiftsByDate(date) {
    try {
      const params = {
        fields: this.allFields,
        where: [{
          fieldName: 'date',
          operator: 'ExactMatch',
          values: [date]
        }]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching shifts by date:', error)
      throw new Error('Failed to fetch shifts by date')
    }
  }

  async getShiftsByDepartment(departmentId) {
    try {
      const params = {
        fields: this.allFields,
        where: [{
          fieldName: 'department',
          operator: 'EqualTo',
          values: [departmentId]
        }]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching shifts by department:', error)
      throw new Error('Failed to fetch shifts by department')
    }
  }
}

export default new ShiftService()