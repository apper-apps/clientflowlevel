export const getAllTasks = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "timeTracking" } },
        { field: { Name: "projectId" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const getTaskById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "title" } },
        { field: { Name: "priority" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "timeTracking" } },
        { field: { Name: "projectId" } }
      ]
    };
    
    const response = await apperClient.getRecordById("task", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error("Task not found");
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const filteredData = {
      Name: taskData.Name || taskData.title,
      title: taskData.title,
      priority: taskData.priority || "medium",
      status: taskData.status || "todo",
      dueDate: taskData.dueDate,
      timeTracking: taskData.timeTracking || "",
      projectId: parseInt(taskData.projectId)
    };
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create task");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (id, taskData) => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const filteredData = {
      Id: parseInt(id),
      Name: taskData.Name || taskData.title,
      title: taskData.title,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      timeTracking: taskData.timeTracking,
      projectId: parseInt(taskData.projectId)
    };
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to update task");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const filteredData = {
      Id: parseInt(id),
      status: status
    };
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to update task status");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord("task", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete task");
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

// Time tracking functions (simplified for database integration)
export const startTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For now, we'll use a simplified approach until time tracking tables are available
  const now = new Date().toISOString();
  
  const timerData = {
    Id: parseInt(id),
    startTime: now
  };
  
  return timerData;
};

export const stopTaskTimer = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // For now, we'll use a simplified approach until time tracking tables are available
  const now = new Date().toISOString();
  
  const timeLog = {
    Id: Date.now(), // Temporary ID generation
    startTime: new Date(Date.now() - 3600000).toISOString(), // Mock start time (1 hour ago)
    endTime: now,
    duration: 3600000, // 1 hour in milliseconds
    date: now.split('T')[0]
  };
  
  return timeLog;
};

export const getTaskTimeLogs = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // For now, return empty array until time tracking tables are available
  return [];
};