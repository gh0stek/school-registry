<template>
  <form @submit.prevent="submit">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Upload File</h4>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>CSV File</label>
              <md-file
                v-model="fileName"
                accept=".csv"
                @md-change="handleUpload"
              ></md-file>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button
              class="md-raised md-success"
              type="submit"
              :disabled="!file"
              >Upload File</md-button
            >
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
import axios from 'axios'
import { StatusCodes } from 'http-status-codes'

export default {
  name: 'edit-profile-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      fileName: null,
      file: null,
    }
  },
  methods: {
    submit() {
      const formData = new FormData()
      formData.append('file', this.file)
      axios
        .post(`${this.$apiURL}/upload/csv`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          this.$notify({
            message:
              'File uploaded successfully. You can now view the data in the dashboard.',
            icon: 'add_alert',
            horizontalAlign: 'center',
            verticalAlign: 'top',
            type: 'success',
          })
        })
        .catch((error) => {
          if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
            this.$notify({
              message: error.response.data.message,
              icon: 'error',
              horizontalAlign: 'center',
              verticalAlign: 'top',
              type: 'danger',
            })
          } else {
            this.$notify({
              message: 'An error occurred while uploading the file.',
              icon: 'error',
              horizontalAlign: 'center',
              verticalAlign: 'top',
              type: 'danger',
            })
          }
        })
    },
    handleUpload(files) {
      this.file = files[0]
    },
  },
}
</script>
