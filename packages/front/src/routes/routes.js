import DashboardLayout from '@/pages/Layout/DashboardLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import UploadFile from '@/pages/UploadFile.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'upload',
        name: 'Upload File',
        component: UploadFile,
      },
    ],
  },
]

export default routes
