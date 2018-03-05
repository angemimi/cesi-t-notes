import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/containers/Login'
import BasicLayout from '@/containers/BasicLayout'
import EmptyLayout from '@/containers/EmptyLayout'

import ManageClasses from '@/containers/Admin/ManageClasses'
import ManageModules from '@/containers/Admin/ManageModules'
import NewModule from '@/containers/Admin/NewModule'

import MyModules from '@/containers/Teacher/ManageModules'


import store from '@/store';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '',
      name: 'Application',
      component: BasicLayout,
      meta: { roles: ['admin', 'teacher', 'student'] },
      children: [
        {
          path: 'classes',
          name: 'AdminManageClasses',
          component: ManageClasses,
          meta: { roles: ['admin'] }
        },
        {
          path: 'modules',
          component: EmptyLayout,
          meta: { roles: ['admin'] },
          children: [
            {
              path: '',
              name: 'AdminManageModules',
              component: ManageModules,
            },
            {
              path: 'new',
              name: 'AdminNewModule',
              component: NewModule,
            },
          ]
        },

        {
          path: 'mymodules',
          component: EmptyLayout,
          meta: { roles: ['teacher'] },
          children: [
            {
              path: '',
              name: 'TeacherMyModules',
              component: MyModules,
            },
          ]
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const hasToBeChecked = to.matched.find(m => m.meta.roles)
  if (hasToBeChecked) {
    if (store.getters.isAllowed(hasToBeChecked.meta.roles)) {
      return next()
    } else {
      return next({ path: 'login' })
    }
  } else {
    return next()
  }
});

export default router;
