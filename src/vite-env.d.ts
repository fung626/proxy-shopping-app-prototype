/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;
  export default ReactComponent;
}
