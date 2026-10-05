import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { getProject } from '@/data/portfolio'

const SITE = 'Ibrahim Zaki'
/** Must match the leave transition in main.css (.page-leave-active) so scrolling happens after the swap. */
const PAGE_SWAP_MS = 220

export function createAppRouter(
  history: RouterHistory = createWebHistory(import.meta.env.BASE_URL),
) {
  const router = createRouter({
    history,
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { title: `${SITE} | Network Engineer` },
      },
      {
        path: '/projects/:slug',
        name: 'project',
        // Lazy: the case-study page (diagram, code block…) is not part of the first load.
        component: () => import('@/views/ProjectDetailView.vue'),
        // Unknown slug → 404 instead of an empty page.
        beforeEnter: (to) =>
          getProject(String(to.params.slug))
            ? true
            : {
                name: 'not-found',
                params: { pathMatch: to.path.slice(1).split('/') },
                replace: true,
              },
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
        meta: { title: `Page not found | ${SITE}` },
      },
    ],
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition // browser back/forward

      const crossPage = to.path !== from.path
      const position = to.hash
        ? { el: to.hash, top: 88, behavior: crossPage ? ('auto' as const) : ('smooth' as const) }
        : { top: 0, behavior: 'auto' as const }

      // Wait for the page transition so we don't scroll the page that is fading out.
      return crossPage
        ? new Promise((resolve) => setTimeout(() => resolve(position), PAGE_SWAP_MS + 60))
        : position
    },
  })

  router.afterEach((to) => {
    if (typeof document === 'undefined') return
    if (to.name === 'project') {
      const project = getProject(String(to.params.slug))
      if (project) document.title = `${project.title} | ${SITE}`
    } else if (typeof to.meta.title === 'string') {
      document.title = to.meta.title
    }
  })

  return router
}

export default createAppRouter()
