import Layout from '@/layout'

export default {
  path: '/approvals',
  meta:{id:'approvals'},
  component: Layout,
  children: [{
    path: '',
    name: 'approvals',
    component: () => import('@/views/approvals/index'),
    meta: { title: '审批', icon: 'tree-table' }
  }]
}
