export const getDashboardData = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Fetch data from multiple tables to build dashboard summary
    const [clientsResponse, projectsResponse, tasksResponse, invoicesResponse] = await Promise.all([
      apperClient.fetchRecords("client", { 
        fields: [{ field: { Name: "Name" } }, { field: { Name: "status" } }] 
      }),
      apperClient.fetchRecords("project", { 
        fields: [{ field: { Name: "Name" } }, { field: { Name: "status" } }] 
      }),
      apperClient.fetchRecords("task", { 
        fields: [{ field: { Name: "Name" } }, { field: { Name: "status" } }] 
      }),
      apperClient.fetchRecords("app_invoice", { 
        fields: [{ field: { Name: "Name" } }, { field: { Name: "amount" } }, { field: { Name: "status" } }] 
      })
    ]);
    
    // Process the data to create dashboard summary
    const clients = clientsResponse.success ? clientsResponse.data : [];
    const projects = projectsResponse.success ? projectsResponse.data : [];
    const tasks = tasksResponse.success ? tasksResponse.data : [];
    const invoices = invoicesResponse.success ? invoicesResponse.data : [];
    
    const summary = {
      totalClients: clients.length,
      activeProjects: projects.filter(p => p.status === "active").length,
      pendingTasks: tasks.filter(t => t.status === "todo" || t.status === "in-progress").length,
      monthlyRevenue: invoices
        .filter(i => i.status === "paid")
        .reduce((sum, invoice) => sum + (invoice.amount || 0), 0),
      completedTasks: tasks.filter(t => t.status === "done").length,
      overdueItems: invoices.filter(i => i.status === "overdue").length
    };
    
    // Mock recent activity for now
    const recentActivity = [
      {
        id: 1,
        type: "project",
        title: "Project status updated",
        client: "Database Client",
        time: "2 hours ago",
        icon: "CheckCircle2"
      },
      {
        id: 2,
        type: "task",
        title: "New task created via database",
        client: "Database Project",
        time: "4 hours ago",
        icon: "Plus"
      },
      {
        id: 3,
        type: "invoice",
        title: "Invoice created from database",
        client: "Database Client",
        time: "6 hours ago",
        icon: "FileText"
      }
    ];
    
    const quickStats = {
      projectsThisWeek: projects.filter(p => p.status === "active").length,
      tasksCompleted: tasks.filter(t => t.status === "done").length,
      hoursTracked: 168, // Mock value
      invoicesSent: invoices.filter(i => i.status === "sent").length
    };
    
    return {
      summary,
      recentActivity,
      quickStats
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    
    // Return fallback data if database is not available
    return {
      summary: {
        totalClients: 0,
        activeProjects: 0,
        pendingTasks: 0,
        monthlyRevenue: 0,
        completedTasks: 0,
        overdueItems: 0
      },
      recentActivity: [],
      quickStats: {
        projectsThisWeek: 0,
        tasksCompleted: 0,
        hoursTracked: 0,
        invoicesSent: 0
      }
    };
  }
};