import { Plane, Transform } from "ogl";
import GSAP from "gsap";

// import Media from "./Media";

// import map from "lodash/map";

export default class Home {
  constructor({ gl, scene, sizes }) {
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;
    this.createScene();

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.scrollCurrent = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      x: 0,
      y: 0,
    };

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1,
    };

    this.createGeometry();
    this.createGallery();

    this.onResize({
      sizes: this.sizes,
    });

    this.group.setParent(this.scene);

    this.show();
  }

  createScene() {
    this.group = new Transform();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20,
    });
  }

  createGallery() {
    // this.medias = map(this.mediaElements, (element, index) => {
    //   return new Media({
    //     index,
    //     element,
    //     gl: this.gl,
    //     scene: this.group,
    //     geometry: this.geometry,
    //     sizes: this.sizes,
    //   });
    // });
  }

  // Animations
  show() {
    // map(this.medias, (media) => media.show());
  }

  hide() {
    // map(this.medias, (media) => media.hide());
  }

  onTouchDown({ x, y }) {
    this.speed.target = 1;

    this.scrollCurrent.x = this.scroll.x;
    this.scrollCurrent.y = this.scroll.y;
  }

  onTouchMove({ x, y }) {
    const xDistance = x.start - x.end;
    const yDistance = y.start - y.end;

    this.x.target = this.scrollCurrent.x - xDistance;
    this.y.target = this.scrollCurrent.y - yDistance;
  }

  onTouchUp({ x, y }) {
    this.speed.target = 0;
  }

  onResize(event) {
    // this.galleryBounds = this.galleryElement.getBoundingClientRect();
    // this.sizes = event.sizes;
    // this.gallerySizes = {
    //   width: (this.galleryBounds.width / window.innerWidth) * this.sizes.width,
    //   height: (this.galleryBounds.height / window.innerHeight) * this.sizes.height, // prettier-ignore
    // };
    // this.scroll.x = this.x.target = 0;
    // this.scroll.y = this.y.target = 0;
    // map(this.medias, (media) => media.onResize(event, this.scroll));
  }

  onWheel({ pixelX, pixelY }) {
    this.x.target += pixelX;
    this.y.target += pixelY;
  }

  update() {
    this.speed.current = GSAP.utils.interpolate(
      this.speed.current,
      this.speed.target,
      this.speed.lerp,
    );

    this.x.current = GSAP.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp,
    );

    this.y.current = GSAP.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp,
    );

    if (this.scroll.x > this.x.current) {
      this.x.direction = "left";
    } else if (this.scroll.x < this.x.current) {
      this.x.direction = "right";
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = "top";
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = "bottom";
    }

    this.scroll.x = this.x.current;
    this.scroll.y = this.y.current;
  }

  destroy() {
    this.scene.removeChild(this.group);
  }
}
