// CSS files imported via tsup esbuild loader — returns string for unsafeCSS()
declare module '*.css?raw' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: string
  export default content
}
