import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    activeModal: null as string | null,
    modalProps: {} as any
  }),
  actions: {
    // Modal'ı açma
    open(modalId: string, props: any = {}) {
      this.activeModal = modalId
      this.modalProps = props
    },
    
    // Modal'ı kapatma
    close() {
      this.activeModal = null
      this.modalProps = {}
    }
  }
})