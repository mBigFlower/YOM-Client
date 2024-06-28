/*
 * @Date: 2023-02-12 16:02:31
 * @LastEditors: BigFlower
 * @LastEditTime: 2023-02-17 20:50:09
 * @FilePath: \web\src\router\index.js
 * @Description: Do not edit
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = import.meta.globEager('./routes/*.js')
const appRoutes = formatRoutes(routes)
function formatRoutes(_routes) {
  const result = []
  Object.keys(_routes).forEach((key) => {
    const defaultModule = _routes[key].default
    if (!defaultModule) return
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule]
    result.push(...moduleList)
  })
  return result
}

console.log('appRoutes', appRoutes)
// 3. 创建路由实例并传递 `routes` 配置
const router = createRouter({
  history: createWebHashHistory(),
  routes: [...appRoutes]
})


// router.beforeEach(async (to, from, next) => {
//   if (to.name === 'login') {
//     console.log('setupUserLoginInfoGuard name===login');
//     next();
//   }
  
//   const userStore = useUserStore();
//   if (userStore.userInfo?.username) {
//     next();
//     return;
//   }
//   console.log('setupUserLoginInfoGuard next(login)');
//   next({
//     name: 'login',
//     query: {
//       redirect: to.name,
//       ...to.query,
//     }
//   });
// });

export default router
