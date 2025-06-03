const { ApperClient } = window.ApperSDK

class DepartmentService {
  constructor() {
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'department'
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'required', 'status']
    this.updateableFields = ['Name', 'Tags', 'Owner', 'required', 'status']
  }

  async fetchAllDepartments(params = {}) {
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
      console.error('Error fetching departments:', error)
      throw new Error('Failed to fetch departments')
    }
  }

  async getDepartmentById(id) {
    try {
      const params = { fields: this.allFields }
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error)
      throw new Error('Failed to fetch department')
    }
  }

  async createDepartment(departmentData) {
    try {
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (departmentData[field] !== undefined) {
          filteredData[field] = departmentData[field]
        }
      })

      const params = { records: [filteredData] }
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create department')
      }
    } catch (error) {
      console.error('Error creating department:', error)
      throw new Error('Failed to create department')
    }
  }

  async updateDepartment(id, departmentData) {
    try {
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (departmentData[field] !== undefined) {
          filteredData[field] = departmentData[field]
        }
      })

      const params = { records: [filteredData] }
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update department')
      }
    } catch (error) {
      console.error('Error updating department:', error)
      throw new Error('Failed to update department')
    }
  }

  async deleteDepartment(ids) {
    try {
      const params = {
        RecordIds: Array.isArray(ids) ? ids : [ids]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      return response?.success || false
    } catch (error) {
      console.error('Error deleting department:', error)
      throw new Error('Failed to delete department')
    }
  }
}

export default new DepartmentService()