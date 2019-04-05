import {
  DASHBOARD_DATA,
  SWITCH_SELECTION,
  DASHBOARD_USERLIST,
  DB_DD_CHANGE,
  UNAUTH_USER
} from '../actions/types/index';


export default function (state={
  userList: [{label: "Overview", value: "all"}],
  ddSelected: {label: "Overview", value: "all"},
  isUser: true, //flag for switch (dropdown)
  dashboardData: {
    total: 0,
    availableHours: 0,
    dueToday: 0,
    dueWeek: 0,
    overDue: 0,
    taskPending: 0,
    taskCompleted: 0,
    openNotifications: 0,
    wot: 0,
    oot: 0,
    mot: 0,
    wit: 0,
    oit: 0,
    mit: 0,
    overallOT: 0,
    overallOTD: 0,
    lastMonthOT: 0,
    lastMonthOTD: 0,
    lastWeekOT: 0,
    lastWeekOTD: 0,
    overallIT: 0,
    overallITD: 0,
    lastMonthIT: 0,
    lastMonthITD: 0,
    lastWeekIT: 0,
    lastWeekITD: 0,
    oph: 0,
    lmph: 0,
    lwph: 0
  },
  pieChartData: [
    {name: 'inTake', value: 0},
    {name: 'cab', value: 0},
    {name: 'build', value: 0},
    {name: 'test', value: 0},
    {name: 'hold', value: 0}
  ],
  productiveData: [
    {name: "oph", value: "0.00", label: "Overall"},
    {name: "lmph", value: "0.00", label: "Last Month"},
    {name: "lwph", value: "0.00", label: "Last Week"}
  ],
  pieChartTotal: 0

}, action) {
    switch (action.type) {
      case DASHBOARD_DATA: {
        return {
          ...state,
          dashboardData: action.payload.data,
          pieChartData: action.payload.pieChartData,
          productiveData: action.payload.productiveData,
          pieChartTotal: action.payload.pieChartTotal,
          ddSelected: action.payload.ddSelected,
          isUser: action.payload.isUser
        }
      }

      case DASHBOARD_USERLIST: {
        return {
          ...state,
          userList: action.payload.userList
        }
      }

      default:
        return state;
    }
}
