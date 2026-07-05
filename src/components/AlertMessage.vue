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
  padding: var(--space-sm) var(--space-md);
  margin: var(--space-sm) 0;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-sm);
}

.alert-success {
  color: #155724;
  background-color: var(--color-success-surface);
  border-color: #c3e6cb;
}

.alert-failure {
  color: #721c24;
  background-color: var(--color-danger-surface);
  border-color: #f5c6cb;
}

.alert-info {
  color: #0c4a5c;
  background-color: var(--color-info-surface);
  border-color: #b7e4f0;
}

.alert-message p {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  margin-left: var(--space-sm);
}

.close-btn:hover {
  opacity: 1;
}
</style>