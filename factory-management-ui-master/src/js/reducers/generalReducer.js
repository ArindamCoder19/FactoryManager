import {
  SHOW_MODAL,
  CLOSE_MODAL,
  INITIAL_DATA,
  IS_FETCHING,
  IS_FETCHED,
  SHOW_DATA_UPDATING,
  SHOW_DATA_UPDATED,
  BADGE_COUNT,
  MODAL_ERROR,
  CLOSE_MODAL_ERROR,
  CURRENT_PAGE,
  CATEGORY_LIST,
  SUBCATEGORY_LIST,
  FC_LIST,
  PROJECT_LIST,
  INITIAL_LOADED,
  MANAGED_BY,
  PROJECT_TYPE,
  FS_STATUS,
  INITIAL_FS_DATA
} from '../actions/types/index';

export default function(state = {
  showmodal: false,
  modaldata: [],
  managedBy: [],
  projectType: [],
  fsStatus: [],
  isfetching: false,
  error: "",
  initialdataload: false,
  categories: [],
  subCategories: []
}, action) {
  switch(action.type) {
    case CURRENT_PAGE:
      return {
        ...state,
        currentpage: action.payload
      }
    case IS_FETCHING:
      return {
        ...state,
        showmodal: false,
        isfetching: true
      };

    case IS_FETCHED:
      return {
        ...state,
        isfetching: false
      };

    case INITIAL_DATA:
      return {
        ...state,
        categories: action.payload.categories,
        subCategories: action.payload.subCategories,
        projects: action.payload.projects,
        functionalConsultants: action.payload.functionalConsultants,
        error: "",
        initialdataload: true
      };

    case INITIAL_LOADED:
      return {
        ...state,
        initialdataload: true
      };

    case CATEGORY_LIST:
      return {
        ...state,
        categories: action.payload
      };

    case SUBCATEGORY_LIST:
      return {
        ...state,
        subCategories: action.payload
      };

    case FC_LIST:
      return {
        ...state,
        functionalConsultants: action.payload
      };


    case MANAGED_BY:
      return {
        ...state,
        managedBy: action.payload
      };
    case PROJECT_TYPE:
      return {
        ...state,
        projectType: action.payload
      };
    case FS_STATUS:
      return {
        ...state,
        fsStatus: action.payload
      };

    case INITIAL_FS_DATA:
    return {
      ...state,
      categories: action.payload.categories,
      subCategories: action.payload.subCategories,
      managedBy: action.payload.managedBy,
      projectType: action.payload.projectType,
      fsStatus: action.payload.fsStatus
    };

    case PROJECT_LIST:
      return {
        ...state,
        projects: action.payload
      };

    case SHOW_MODAL:
      return {
        ...state,
        showmodal: true,
        modaldata: action.payload.data,
        modalInfo: action.payload.info,
        isfetching: false,
        error: ""
      };

    case CLOSE_MODAL:
      return {
        ...state,
        showmodal: false,
        isfetching: false
      };

    case SHOW_DATA_UPDATING:
      return {
        ...state,
        showloading: true,
        error: ""
      };

    case SHOW_DATA_UPDATED:
      return {
        ...state,
        showloading: false
      };

    case BADGE_COUNT:
      return {
        ...state,
        taskcount: action.payload.taskcount,
        usercount: action.payload.usercount
      };

    case MODAL_ERROR:
      return {
        ...state,
        error: action.payload
      }

    case CLOSE_MODAL_ERROR:
      return {
        ...state,
        error: ""
      }

  }

  return state;
}
