declare module '*.astro' {
  declare const component: (props: Record<string, unknown>) => unknown
  export default component
}
