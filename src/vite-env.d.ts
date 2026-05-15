/// <reference types="vite/client" />

declare module '*.glb' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module 'meshline';

declare namespace JSX {
  interface IntrinsicElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}
