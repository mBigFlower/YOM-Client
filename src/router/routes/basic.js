import Console from '@/views/console/console.vue'
import Network from '@/views/network/network.vue'
import Media from '@/views/media/media.vue'
import FileSelect from '@/views/file-select/file-select.vue'
import AllInOne from '@/views/all-in-one/all-in-one.vue'

const BASIC = [{
  path: '/',
  redirect: '/file-select',
}, {
  path: '/file-select',
  name: 'file-select',
  component: FileSelect,
  meta: {
    order: 1
  }
}, {
  path: '/console',
  name: 'console',
  component: Console,
  meta: {
    order: 2
  }
}, {
  path: '/network',
  name: 'network',
  component: Network,
  meta: {
    order: 3
  }
}, {
  path: '/media',
  name: 'media',
  component: Media,
  meta: {
    order: 4
  }
}, {
  path: '/all-in-one',
  name: 'all-in-one',
  component: AllInOne,
  meta: {
    order: 5
  }
}]

export default BASIC
