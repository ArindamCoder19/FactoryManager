//Comment

/* USER FILTER Contants */
export const USER_DDMENU = [
  {name: "Active", id: "active", default: true},
  {name: "Inactive", id: "inactive", default: false}
];

export const USER_CATEGORY =  [
  {name: "All Roles", id: "ALL", default: true},
  {name: "Developers", id: "DEVELOPER", default: false},
  {name: "Leads", id: "LEAD", default: false},
  {name: "Managers", id: "MANAGER", default: false},
  {name: "Guests", id: "GUEST", default: false},
  {name: "Admin", id: "ADMIN", default: false}
];

export const USER_SUBCATEGORY =  [
  {name: "Select All", id: "ALL", default: false},
  {name: "Internal", id: "internal", default: false},
  {name: "External", id: "external", default: false}
];

/*Task filters*/
export const TASK_DDMENU_DEV = [
  {name: "All Tasks", id: "ALL", default: false},
  {name: "My Tasks", id: "assignedTo", default: true},
  {name: "Tasks I Review", id: "review", default: false}
];

export const TASK_DDMENU_LEAD = [
  {name: "All Tasks", id: "ALL", default: false},
  {name: "My Tasks", id: "assignedTo", default: false},
  {name: "Tasks I Lead", id: "lead", default: true},
  {name: "Tasks I Review", id: "review", default: false}
];

export const TASK_DDMENU_MANAGER = [
  {name: "All Tasks", id: "ALL", default: true}
];

export const TASK_DDMENU_ADMIN = [
  {name: "All Tasks", id: "ALL", default: true}
];

export const TASK_SUB_DDMENU = [
  {name: "Select All", id: "ALL", default: false},
  {name: "In-progress", id: "incompleted", default: true},
  {name: "Completed", id: "completed", default: false}
]

export const TASK_PRIORITY = [
  {name: "HIGH", id: "HIGH"},
  {name: "MEDIUM", id: "MEDIUM"},
  {name: "LOW", id: "LOW"},
]

export const TASK_COMPLEXITY = [
  {name: "VERY LOW", id: "VERY-LOW"},
  {name: "LOW", id: "LOW"},
  {name: "MEDIUM", id: "MEDIUM"},
  {name: "HIGH", id: "HIGH"},
  {name: "VERY HIGH", id: "VERY-HIGH"},
]

export const TASK_WRICEF = [
  {name: "REPORT", id: "REPORT"},
  {name: "ENHANCEMENT", id: "ENHANCEMENT"},
  {name: "INTERFACE", id: "INTERFACE"},
  {name: "FORM", id: "FORM"},
  {name: "WORKFLOW", id: "WORK-FLOW"},
  {name: "CONVERSION", id: "CONVERSION"},
  {name: "FIORI", id: "FIORI"},
  {name: "ODATA", id: "ODATA"},
  {name: "DELL BOOMI", id: "DELL-BOOMI"},
]
export const TASK_STATUS = [
  {name: "NOT STARTED", id: "NOT-STARTED"},
  {name: "DELIVERED", id: "DELIVERED"},
  {name: "CANCELLED", id: "CANCELLED"},
  {name: "ESTIMATION IN PROGRESS", id: "ESTIMATION-IN-PROGRESS"},
  {name: "WAITING FOR CAB APPROVAL", id: "WAITING-FOR-CAB-APPROVAL"},
  {name: "TS IN PROGRESS", id: "TS-IN-PROGRESS"},
  {name: "DEV IN PROGRESS", id: "DEV-IN-PROGRESS"},
  {name: "DEV ON HOLD", id: "DEV-ON-HOLD"},
  {name: "TEST ON HOLD", id: "TEST-ON-HOLD"},
  {name: "FUT IN PROGRESS", id: "FUT-IN-PROGRESS"},
  {name: "TESTING IN PROGRESS", id: "TESTING-IN-PROGRESS"}
]

//Sub-categories for which projects need to be mentioned.
//lower-case important
export const TASK_PROJECT_SUB = ['projects', 'bundled rfcs'];


/* Timesheet Constants */

export const NON_PRODUCTIVE_ITEMS = [
  {label: "Training", value: "training", isProductive: false},
  {label: "Co-ordination", value: "co-ordination", isProductive: false},
  {label: "Meeting", value: "meeting", isProductive: false},
  {label: "Vacation", value: "vacation", isProductive: false},
  {label: "Holiday", value: "holiday", isProductive: false},
  {label: "Time Available", value: "time-available", isProductive: false}
]

/* Dashboard Constants */

export const LIST_DEVELOPER_COUNTER = [
  {label: "Tasks Due Today", value: "dueToday"},
  {label: "Tasks Due this Week", value: "dueWeek"},
  {label: "Overdue Tasks", value: "overDue"},
  {label: "Tasks Completed", value: "taskCompleted"},
  {label: "Open Notifications", value: "openNotifications"}
]

export const LIST_LEAD_COUNTER = [
  {label: "Tasks I Lead", value: "taskILead"},
  {label: "Tasks Due Today", value: "dueToday"},
  {label: "Tasks Due this Week", value: "dueWeek"},
  {label: "Overdue Tasks", value: "overDue"},
  {label: "Tasks Completed", value: "taskCompleted"},
  {label: "Open Notifications", value: "openNotifications"}
]

export const LIST_MANAGER_COUNTER = [
  {label: "Tasks Due Today", value: "dueToday"},
  {label: "Tasks Due this Week", value: "dueWeek"},
  {label: "Overdue Tasks", value: "overDue"},
  {label: "Tasks Completed", value: "taskCompleted"},
  {label: "Open Notifications", value: "openNotifications"}
]

export const LIST_DNC_COUNTER = [
  {label: "Developers", value: "developers"},
  {label: "Leads", value: "leads"},
  {label: "Tasks In-Progress", value: "taskInProgress"}
]

/* SIDE BAR Constants */
export const MENU_ITEMS = [
    {
      id: 'm1',
      name: 'Dashboard',
      routeTo: '/dashboard',
      showBadge: false,
      className: 'm1-img',
      roles: ['ADMIN', 'MANAGER', 'LEAD', 'DEVELOPER', 'GUEST'],
      subMenu: [],
      navSubMenu: []
    },
    {
      id: 'm2',
      name: 'Tasks',
      routeTo: '/tasks',
      showBadge: true,
      className: 'm2-img',
      roles: ['ADMIN', 'MANAGER', 'LEAD', 'DEVELOPER', 'GUEST'],
      subMenu: [{
        name: 'Add Category',
        id: 'cat',
        payload: {
          addApi: 'api/category',
          listApi: 'api/categories',
          title: "Tasks  |  Categories",
          payloadName: "category",
          storeName: "CATEGORY_LIST"
        }
      },{
        name: 'Add Sub Category',
        id: 'sub',
        payload: {
          addApi: 'api/subCategory',
          listApi: 'api/subCategories',
          title: "Tasks  |  Sub Categories",
          payloadName: "subCategory",
          storeName: "SUBCATEGORY_LIST"
        }
      },
      {
        name: 'Add Functional Consultant',
        id: 'fc',
        payload: {
          addApi: 'api/functionalconsultant',
          listApi: 'api/search-fc',
          title: "Tasks  |  Functional Consultant",
          payloadName: "functionalConsultant",
          storeName: "FC_LIST"
        }
      }],
      navSubMenu: []
    },
    {
      id: 'm3',
      name: 'Timesheet',
      routeTo: '/timesheet',
      roles: ['ADMIN', 'MANAGER', 'LEAD', 'DEVELOPER'],
      showBadge: false,
      className: 'm3-img',
      subMenu: [],
      navSubMenu: []
    },{
      id: 'm4',
      name: 'Future Scope',
      routeTo: '/future-scope',
      showBadge: true,
      className: 'm1-img',
      roles: ['ADMIN', 'MANAGER', 'LEAD', 'DEVELOPER', 'GUEST'],
      subMenu: [{
        name: 'Add Managed By',
        id: 'fsManage',
        payload: {
          addApi: 'api/managedBy',
          listApi: 'api/managedBy',
          title: "Future Scope  |  Managed By",
          payloadName: "managedBy",
          storeName: "MANAGED_BY"
        }
      },{
        name: 'Add Status',
        id: 'fsStat',
        payload: {
          addApi: 'api/statusFS',
          listApi: 'api/statusFS',
          title: "Future Scope  |  Status",
          payloadName: "status",
          storeName: "FS_STATUS"
        }
      },{
        name: 'Add Project Type',
        id: 'fsProj',
        payload: {
          addApi: 'api/projectType',
          listApi: 'api/projectType',
          title: "Future Scope  |  Project Type",
          payloadName: "projectType",
          storeName: "PROJECT_TYPE"
        }
      }],
      navSubMenu: []
    }
  ];

  export const REPORT_ITEMS = [
      {
        id: 'm10',
        name: 'Demand & Capacity',
        routeTo: '/dnc',
        showBadge: false,
        className: 'm1-img',
        roles: ['ADMIN', 'MANAGER', 'LEAD', 'GUEST'],
        subMenu: [],
        navSubMenu: []
      }
      ,
      {
        id: 'm11',
        name: 'Productivity',
        routeTo: '/productivity',
        roles: ['ADMIN', 'MANAGER', 'LEAD', 'DEVELOPER'],
        showBadge: false,
        className: 'm1-img',
        subMenu: [],
        navSubMenu: []
      }
    ];


export const ADMIN_MENU = [
    {
      id: 'm6',
      name: 'Users',
      routeTo: '/users',
      showBadge: true,
      className: 'm6-img',
      subMenu: [],
      roles: ['ADMIN'],
      navSubMenu: [{
        name: 'User Requests',
        routeTo: '/users/userReq',
        id: 0
      }]
    }
];

export const PROD_COLORS = {
  productive: "#2196F3",
  coordination: "#4D4D4F",
  training: "#607D8B",
  meeting: "#E91E63",
  idleTime: "#FFCA00",
  vacation: "#CDDC39"
}
