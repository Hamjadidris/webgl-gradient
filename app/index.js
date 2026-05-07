import NormalizeWheel from "normalize-wheel";

import each from "lodash/each";
import Home from "pages/Home";

import Canvas from "components/Canvas";
import Preloader from "components/Preloader";

class App {
  constructor() {
    this.createContent();

    this.creaveCanvas();
    // this.createPreloader();

    this.createPages();
    this.addEventListeners();
    this.addLinkListeners();

    this.update();
  }

  createPreloader() {
    this.preloader = new Preloader({
      canvas: this.canvas,
    });

    this.preloader.once("completed", () => this.onPreloaded());
  }

  creaveCanvas() {
    this.canvas = new Canvas({
      template: this.template,
    });
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createPages() {
    this.pages = {
      home: new Home(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }

  onPreloaded() {
    this.canvas.onPreloaded();
    this.preloader.destroy();
    this.onResize();
    this.page.show();
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push = true }) {
    this.canvas.onChangeStart(this.template, url);

    await this.page.hide();

    const res = await window.fetch(url);

    if (res.status === 200) {
      const html = await res.text();
      const div = document.createElement("div");

      if (push) {
        window.history.pushState({}, "", url);
      }

      div.innerHTML = html;

      const divContent = div.querySelector(".content");

      console.log(div);

      this.template = divContent.getAttribute("data-template");
      this.content.innerHTML = divContent.innerHTML;

      this.canvas.onChangeEnd(this.template);

      this.page = this.pages[this.template];
      this.page.create();

      this.onResize();

      this.page.show();

      this.addLinkListeners();
    } else {
      console.error(`response status: ${res.status}`);
    }
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    window.requestAnimationFrame((_) => {
      if (this.canvas && this.canvas.onResize) {
        this.canvas.onResize();
      }
    });
  }

  onTouchDown(e) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(e);
    }
  }

  onTouchMove(e) {
    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(e);
    }
  }

  onTouchUp(e) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(e);
    }
  }

  onWheel(event) {
    const normalizedWheel = NormalizeWheel(event);

    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel(normalizedWheel);
    }

    if (this.page && this.page.onWheel) {
      this.page.onWheel(normalizedWheel);
    }
  }

  update() {
    if (this.page && this.page.update) {
      this.page.update();
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll);
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    window.addEventListener("mousewheel", this.onWheel.bind(this));

    window.addEventListener("popstate", this.onPopState.bind(this));
    window.addEventListener("mousedown", this.onTouchDown.bind(this));
    window.addEventListener("mousemove", this.onTouchMove.bind(this));
    window.addEventListener("mouseup", this.onTouchUp.bind(this));

    window.addEventListener("touchstart", this.onTouchDown.bind(this));
    window.addEventListener("touchmove", this.onTouchMove.bind(this));
    window.addEventListener("touchend", this.onTouchUp.bind(this));

    window.addEventListener("resize", this.onResize.bind(this));
  }

  addLinkListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault();

        const { href } = link;

        this.onChange({ url: href });
      };
    });
  }
}

new App();
