import { Mesh, Plane, Program, Color } from "ogl";

import fragment from "shaders/background-fragment.glsl";
import vertex from "shaders/background-vertex.glsl";

export default class Background {
  constructor({ gl, scene, sizes, url }) {
    this.gl = gl;
    this.url = url;
    this.scene = scene;
    this.sizes = sizes;

    this.extra = {
      x: 0,
      y: 0,
    };

    this.geometry = new Plane(this.gl);
    this.createProgram();
    this.createMesh();
    this.createEvents();
  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uBlur: { value: 130.0 },
        uValue: { value: 0.1 },
        uSpeed: { value: 0.12 },
        uFlow: { value: 0.043 },
        uLength: { value: 0.0005 },
        uFrequency: { value: 5.0 },
        uBrightness: { value: 0.5 },
        uAmplitude: { value: 40.0 },
        uColorA: { value: new Float32Array([0, 0, 0, 1]) },
        uColorB: { value: new Float32Array([0, 0, 0, 0]) },
        uColorC: { value: new Float32Array([0, 0, 0, 0]) },
        uContainerWidth: { value: window.innerWidth },
        uContainerHeight: { value: window.innerHeight },
      },
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.mesh.scale.x = this.sizes.width;
    this.mesh.scale.y = this.sizes.height;
    this.mesh.position.z = -0.0001;
    this.mesh.setParent(this.scene);
  }

  update(scroll) {
    this.program.uniforms.uTime.value += 0.01;
  }

  onResize({ sizes }) {
    this.sizes = sizes;

    this.mesh.scale.x = this.sizes.width;
    this.mesh.scale.y = this.sizes.height;
  }

  createEvents() {
    const formBtn = document.querySelector("#formBtn");
    const fillInput1 = document.querySelector("#fillColor1");
    const fillInput2 = document.querySelector("#fillColor2");
    const fillInput3 = document.querySelector("#fillColor3");
    const formContainer = document.querySelector("#formContainer");

    formBtn.addEventListener("click", () => {
      formContainer.classList.toggle("opened");
    });

    fillInput1.addEventListener("input", (e) => {
      let value = e.target.value;
      this.program.uniforms.uColorA.value = this.hexToVec4(value);
    });

    fillInput2.addEventListener("input", (e) => {
      let value = e.target.value;
      this.program.uniforms.uColorB.value = this.hexToVec4(value);
    });

    fillInput3.addEventListener("input", (e) => {
      let value = e.target.value;
      this.program.uniforms.uColorC.value = this.hexToVec4(value);
    });
  }

  hexToVec4(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return new Float32Array([r, g, b, a]);
    // return `vec4(${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)}, ${a.toFixed(4)})`;
  }
}
