import React, { Component } from 'react';

import PageHeader from './PageHeader';
import PageRoutes from './PageRoutes';

/**
 * Parent: AppLayout
 * Desc: Page Content => Search Bar
 *                          +
 *                      PageRoutes (Dashboard, Tasks, Timesheet, Vacation & Training Plan, System Improvements, Users)
 */


 export default class PageContent extends Component {
   componentDidMount() {
     console.log("Page content mounted");
     
   }
   render() {
       return (
         <div id="pg-content-wrapper" >
           <PageHeader toggle={this.props.toggle}/>
           <PageRoutes />
         </div>
       )
     }
 }
