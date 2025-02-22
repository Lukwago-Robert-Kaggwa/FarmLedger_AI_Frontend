<template>
  <div v-if="visible"
    :class="['alert-message', type === 'success' ? 'alert-success' : type === 'failure' ? 'alert-failure' : 'alert-info']">
    <p>{{ message }} </p>
    <button class="close-btn" @click="dismiss">×</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    autoDismiss: {
      type: Boolean,
      default: true,
    },
    dismissTimeout: {
      type: Number,
      default: 15000, // 5 seconds auto-dismiss
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    if (this.autoDismiss) {
      setTimeout(() => {
        this.dismiss();
      }, this.dismissTimeout);
    }
  },
  methods: {
    dismiss() {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
.alert-message {
  display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.3rem;
    margin: 0.3rem 0;
    border-radius: 5px;
    font-size: 1rem;
    color: white;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.alert-failure {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-info {
  color: #f4f9fa;
  background-color: #10c7f9;
  border-color: #10c7f9;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #000;
  margin-left: 5px;
  float: right;
}
</style>