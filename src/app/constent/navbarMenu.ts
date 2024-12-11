//for admin
export let  NavbarMenu = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', link: '/admindashboard' },
    { icon: 'fas fa-users', label: 'Request', link: '/admindashboard/allRequest' },
    { icon: 'fas fa-users', label: 'Employee', link: '/admindashboard/Employee' },
    { icon: 'fas fa-chart-line', label: 'Department', link: '/admindashboard/Department' },
  ]

// for employee
export let EmployeeMenu = [
  { icon: 'fas fa-tachometer-alt', label: 'Dashboard', link: '/employedashboard' },
  { icon: 'fas fa-users', label: 'Request', link: '/employedashboard/Leaves' },
  { icon: 'fas fa-users', label: 'Unpaid Leave', link: '/employedashboard/unpaidLeave' },
]