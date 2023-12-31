<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <upload-file-form data-background-color="blue"> </upload-file-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <md-button class="md-raised md-accent" @click="clearAll"
          >Clear all data</md-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import UploadFileForm from '@/pages/UploadFile/UploadFileForm.vue'
import axios from 'axios'

export default {
  components: {
    UploadFileForm,
  },
  methods: {
    clearAll() {
      axios
        .delete(`${this.$apiURL}/upload/all`)
        .then(() => {
          this.$notify({
            message:
              'Deleted all data successfully. Please upload a new file to continue.',
            icon: 'add_alert',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success',
          })
        })
        .catch(() => {
          this.$notify({
            message: 'An error occurred while deleting all data.',
            icon: 'error',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'danger',
          })
        })
    },
  },
}
</script>
