import { ShaderMaterial, DoubleSide } from "three"

export class Shader extends ShaderMaterial {
  constructor(params) {
    super({
      side: DoubleSide,
      transparent: true,

      uniforms: {
        tSurface: { value: null },
        tUV: { value: null },
      },

      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main()
        {
          vec3 newPosition = position;

          vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;

          vUv = uv;
        }
      `,

      fragmentShader: /* glsl */ `
        uniform sampler2D tSurface;
        uniform sampler2D tUV;

        varying vec2 vUv;

        void main() {
          vec4 uvColor = texture2D(tUV, vec2(vUv.x, 1.0 - vUv.y));
          vec4 surfColor = texture2D(tSurface, vec2(uvColor.x, uvColor.y));

          if (uvColor.a < 0.01) discard;

          gl_FragColor = vec4(surfColor.rgb, 1.0);
        }
      `
    });

    this.setValues(params);
  }
}
