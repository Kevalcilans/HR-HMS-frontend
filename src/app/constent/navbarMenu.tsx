import { GiOrganigram } from "react-icons/gi";
//for admin
export let  NavbarMenu = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', link: '/admindashboard' },
    { icon: 'fas fa-comment', label: 'Request', link: '/admindashboard/allRequest' },
    { icon: 'fas fa-users', label: 'Employee', link: '/admindashboard/Employee' },
    { icon: 'fa fa-building', label: 'Department', link: '/admindashboard/Department' },
  ]

// for employee
export let EmployeeMenu = [
  { icon: 'fas fa-tachometer-alt', label: 'Dashboard', link: '/employedashboard' },
  { icon: 'fas fa-comment', label: 'Request', link: '/employedashboard/Leaves' },
]