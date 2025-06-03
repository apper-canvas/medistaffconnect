const { ApperClient } = window.ApperSDK

class EmployeeService {
  constructor() {
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'employee'
    // All fields from the employee table
    this.allFields = ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'role', 'certifications', 'availability', 'department']
    // Only Updateable fields for create/update operations
    this.updateableFields = ['Name', 'Tags', 'Owner', 'role', 'certifications', 'availability', 'department']
  }

  async fetchAllEmployees(params = {}) {
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
      console.error('Error fetching employees:', error)
      throw new Error('Failed to fetch employees')
    }
  }

  async getEmployeeById(id) {
    try {
      const params = {
        fields: this.allFields
      }
      const response = await this.apperClient.getRecordById(this.tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching employee ${id}:`, error)
      throw new Error('Failed to fetch employee')
    }
  }

  async createEmployee(employeeData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      this.updateableFields.forEach(field => {
        if (employeeData[field] !== undefined) {
          filteredData[field] = employeeData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create employee')
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      throw new Error('Failed to create employee')
    }
  }

  async updateEmployee(id, employeeData) {
    try {
      // Filter to only include updateable fields, plus Id
      const filteredData = { Id: id }
      this.updateableFields.forEach(field => {
        if (employeeData[field] !== undefined) {
          filteredData[field] = employeeData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update employee')
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      throw new Error('Failed to update employee')
    }
  }

  async deleteEmployee(ids) {
    try {
      const params = {
        RecordIds: Array.isArray(ids) ? ids : [ids]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      return response?.success || false
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw new Error('Failed to delete employee')
    }
  }

  async getEmployeesByDepartment(departmentId) {
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
      console.error('Error fetching employees by department:', error)
      throw new Error('Failed to fetch employees by department')
    }
  }
}

export default new EmployeeService()