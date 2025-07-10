export const getAllInvoices = async () => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "paymentDate" } },
        { field: { Name: "clientId" } },
        { field: { Name: "projectId" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

export const getInvoiceById = async (id) => {
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
        { field: { Name: "amount" } },
        { field: { Name: "status" } },
        { field: { Name: "dueDate" } },
        { field: { Name: "paymentDate" } },
        { field: { Name: "clientId" } },
        { field: { Name: "projectId" } }
      ]
    };
    
    const response = await apperClient.getRecordById("app_invoice", parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error("Invoice not found");
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

export const createInvoice = async (invoiceData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Validate required fields
  if (!invoiceData.projectId) {
    throw new Error("Project ID is required");
  }
  if (!invoiceData.amount || invoiceData.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  if (!invoiceData.dueDate) {
    throw new Error("Due date is required");
  }
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const filteredData = {
      Name: `Invoice ${Date.now()}`,
      amount: parseFloat(invoiceData.amount),
      status: invoiceData.status || "draft",
      dueDate: invoiceData.dueDate,
      clientId: parseInt(invoiceData.clientId),
      projectId: parseInt(invoiceData.projectId)
    };
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.createRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to create invoice");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id, invoiceData) => {
  await new Promise(resolve => setTimeout(resolve, 250));
  
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid invoice ID");
  }
  
  // Validate data if provided
  if (invoiceData.amount !== undefined && invoiceData.amount <= 0) {
    throw new Error("Amount must be greater than 0");
  }
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Only include Updateable fields
    const filteredData = {
      Id: parsedId,
      Name: invoiceData.Name,
      amount: invoiceData.amount !== undefined ? parseFloat(invoiceData.amount) : undefined,
      status: invoiceData.status,
      dueDate: invoiceData.dueDate,
      paymentDate: invoiceData.paymentDate,
      clientId: invoiceData.clientId ? parseInt(invoiceData.clientId) : undefined,
      projectId: invoiceData.projectId ? parseInt(invoiceData.projectId) : undefined
    };
    
    // Remove undefined fields
    Object.keys(filteredData).forEach(key => {
      if (filteredData[key] === undefined) {
        delete filteredData[key];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await apperClient.updateRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        throw new Error("Failed to update invoice");
      }
      
      return successfulRecords[0]?.data;
    }
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const markInvoiceAsSent = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid invoice ID");
  }
  
  try {
    return await updateInvoice(id, { status: "sent" });
  } catch (error) {
    console.error("Error marking invoice as sent:", error);
    throw error;
  }
};

export const markInvoiceAsPaid = async (id, paymentDate) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new Error("Invalid invoice ID");
  }
  
  if (!paymentDate) {
    throw new Error("Payment date is required");
  }
  
  try {
    return await updateInvoice(id, { 
      status: "paid",
      paymentDate: new Date(paymentDate).toISOString()
    });
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    throw error;
  }
};

export const deleteInvoice = async (id) => {
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
    
    const response = await apperClient.deleteRecord("app_invoice", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        throw new Error("Failed to delete invoice");
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};