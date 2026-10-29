export const useToast = () => ({
  toast: (opts: { title?: string; description?: string } = {}) => {
    if (typeof window !== 'undefined' && opts.title) {
      setTimeout(
        () =>
          void window.alert(
            opts.title + (opts.description ? `\n${opts.description}` : ''),
          ),
        0,
      )
    } else {
      console.log('toast', opts)
    }
  },
})
