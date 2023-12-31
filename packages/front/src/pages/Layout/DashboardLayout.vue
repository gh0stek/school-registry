<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <sidebar-link to="/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/upload">
        <md-icon>upload</md-icon>
        <p>Upload File</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <fixed-plugin
        :color.sync="sidebarBackground"
        :image.sync="sidebarBackgroundImage"
      >
      </fixed-plugin>

      <dashboard-content> </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from './TopNavbar.vue'
import ContentFooter from './ContentFooter.vue'
import DashboardContent from './Content.vue'
import FixedPlugin from './Extra/FixedPlugin.vue'

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    FixedPlugin,
  },
  data() {
    return {
      sidebarBackground: 'green',
      sidebarBackgroundImage: require('@/assets/img/sidebar-2.jpg'),
    }
  },
}
</script>
