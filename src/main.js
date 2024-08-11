import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// import Antd from 'ant-design-vue';
import { Segmented, Card, Drawer, Input, Modal, Button, Tooltip,
  Progress, InputGroup, Dropdown, Menu, MenuItem, message } from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css';

const app = createApp(App)

app.use(Segmented).use(Drawer).use(Card).use(Input).use(InputGroup).use(Tooltip)
.use(Modal).use(Button).use(Progress).use(Dropdown).use(Menu).use(MenuItem)
.mount('#app')

app.config.globalProperties.$message = message