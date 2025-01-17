var VanillaTilt = (function () {
  "use strict";
  var t = function (t, e) {
      if (!(t instanceof e))
        throw new TypeError("Cannot call a class as a function");
    },
    e = (function () {
      function e(i) {
        var s =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if ((t(this, e), !(i instanceof Node)))
          throw "Can't initialize VanillaTilt because " + i + " is not a Node.";
        (this.width = null),
          (this.height = null),
          (this.clientWidth = null),
          (this.clientHeight = null),
          (this.left = null),
          (this.top = null),
          (this.gammazero = null),
          (this.betazero = null),
          (this.lastgammazero = null),
          (this.lastbetazero = null),
          (this.transitionTimeout = null),
          (this.updateCall = null),
          (this.event = null),
          (this.updateBind = this.update.bind(this)),
          (this.resetBind = this.reset.bind(this)),
          (this.element = i),
          (this.settings = this.extendSettings(s)),
          (this.reverse = this.settings.reverse ? -1 : 1),
          (this.resetToStart = e.isSettingTrue(
            this.settings["reset-to-start"]
          )),
          (this.glare = e.isSettingTrue(this.settings.glare)),
          (this.glarePrerender = e.isSettingTrue(
            this.settings["glare-prerender"]
          )),
          (this.fullPageListening = e.isSettingTrue(
            this.settings["full-page-listening"]
          )),
          (this.gyroscope = e.isSettingTrue(this.settings.gyroscope)),
          (this.gyroscopeSamples = this.settings.gyroscopeSamples),
          (this.elementListener = this.getElementListener()),
          this.glare && this.prepareGlare(),
          this.fullPageListening && this.updateClientSize(),
          this.addEventListeners(),
          this.reset(),
          !1 === this.resetToStart &&
            ((this.settings.startX = 0), (this.settings.startY = 0));
      }
      return (
        (e.isSettingTrue = function (t) {
          return "" === t || !0 === t || 1 === t;
        }),
        (e.prototype.getElementListener = function () {
          if (this.fullPageListening) return window.document;
          if ("string" == typeof this.settings["mouse-event-element"]) {
            var t = document.querySelector(
              this.settings["mouse-event-element"]
            );
            if (t) return t;
          }
          return this.settings["mouse-event-element"] instanceof Node
            ? this.settings["mouse-event-element"]
            : this.element;
        }),
        (e.prototype.addEventListeners = function () {
          (this.onMouseEnterBind = this.onMouseEnter.bind(this)),
            (this.onMouseMoveBind = this.onMouseMove.bind(this)),
            (this.onMouseLeaveBind = this.onMouseLeave.bind(this)),
            (this.onWindowResizeBind = this.onWindowResize.bind(this)),
            (this.onDeviceOrientationBind =
              this.onDeviceOrientation.bind(this)),
            this.elementListener.addEventListener(
              "mouseenter",
              this.onMouseEnterBind
            ),
            this.elementListener.addEventListener(
              "mouseleave",
              this.onMouseLeaveBind
            ),
            this.elementListener.addEventListener(
              "mousemove",
              this.onMouseMoveBind
            ),
            (this.glare || this.fullPageListening) &&
              window.addEventListener("resize", this.onWindowResizeBind),
            this.gyroscope &&
              window.addEventListener(
                "deviceorientation",
                this.onDeviceOrientationBind
              );
        }),
        (e.prototype.removeEventListeners = function () {
          this.elementListener.removeEventListener(
            "mouseenter",
            this.onMouseEnterBind
          ),
            this.elementListener.removeEventListener(
              "mouseleave",
              this.onMouseLeaveBind
            ),
            this.elementListener.removeEventListener(
              "mousemove",
              this.onMouseMoveBind
            ),
            this.gyroscope &&
              window.removeEventListener(
                "deviceorientation",
                this.onDeviceOrientationBind
              ),
            (this.glare || this.fullPageListening) &&
              window.removeEventListener("resize", this.onWindowResizeBind);
        }),
        (e.prototype.destroy = function () {
          clearTimeout(this.transitionTimeout),
            null !== this.updateCall && cancelAnimationFrame(this.updateCall),
            (this.element.style.willChange = ""),
            (this.element.style.transition = ""),
            (this.element.style.transform = ""),
            this.resetGlare(),
            this.removeEventListeners(),
            (this.element.vanillaTilt = null),
            delete this.element.vanillaTilt,
            (this.element = null);
        }),
        (e.prototype.onDeviceOrientation = function (t) {
          if (null !== t.gamma && null !== t.beta) {
            this.updateElementPosition(),
              this.gyroscopeSamples > 0 &&
                ((this.lastgammazero = this.gammazero),
                (this.lastbetazero = this.betazero),
                null === this.gammazero
                  ? ((this.gammazero = t.gamma), (this.betazero = t.beta))
                  : ((this.gammazero = (t.gamma + this.lastgammazero) / 2),
                    (this.betazero = (t.beta + this.lastbetazero) / 2)),
                (this.gyroscopeSamples -= 1));
            var e =
                this.settings.gyroscopeMaxAngleX -
                this.settings.gyroscopeMinAngleX,
              i =
                this.settings.gyroscopeMaxAngleY -
                this.settings.gyroscopeMinAngleY,
              s = e / this.width,
              n = i / this.height,
              a =
                (t.gamma -
                  (this.settings.gyroscopeMinAngleX + this.gammazero)) /
                s,
              l =
                (t.beta - (this.settings.gyroscopeMinAngleY + this.betazero)) /
                n;
            null !== this.updateCall && cancelAnimationFrame(this.updateCall),
              (this.event = { clientX: a + this.left, clientY: l + this.top }),
              (this.updateCall = requestAnimationFrame(this.updateBind));
          }
        }),
        (e.prototype.onMouseEnter = function () {
          this.updateElementPosition(),
            (this.element.style.willChange = "transform"),
            this.setTransition();
        }),
        (e.prototype.onMouseMove = function (t) {
          null !== this.updateCall && cancelAnimationFrame(this.updateCall),
            (this.event = t),
            (this.updateCall = requestAnimationFrame(this.updateBind));
        }),
        (e.prototype.onMouseLeave = function () {
          this.setTransition(),
            this.settings.reset && requestAnimationFrame(this.resetBind);
        }),
        (e.prototype.reset = function () {
          this.onMouseEnter(),
            this.fullPageListening
              ? (this.event = {
                  clientX:
                    ((this.settings.startX + this.settings.max) /
                      (2 * this.settings.max)) *
                    this.clientWidth,
                  clientY:
                    ((this.settings.startY + this.settings.max) /
                      (2 * this.settings.max)) *
                    this.clientHeight,
                })
              : (this.event = {
                  clientX:
                    this.left +
                    ((this.settings.startX + this.settings.max) /
                      (2 * this.settings.max)) *
                      this.width,
                  clientY:
                    this.top +
                    ((this.settings.startY + this.settings.max) /
                      (2 * this.settings.max)) *
                      this.height,
                });
          var t = this.settings.scale;
          (this.settings.scale = 1),
            this.update(),
            (this.settings.scale = t),
            this.resetGlare();
        }),
        (e.prototype.resetGlare = function () {
          this.glare &&
            ((this.glareElement.style.transform =
              "rotate(180deg) translate(-50%, -50%)"),
            (this.glareElement.style.opacity = "0"));
        }),
        (e.prototype.getValues = function () {
          var t = void 0,
            e = void 0;
          return (
            this.fullPageListening
              ? ((t = this.event.clientX / this.clientWidth),
                (e = this.event.clientY / this.clientHeight))
              : ((t = (this.event.clientX - this.left) / this.width),
                (e = (this.event.clientY - this.top) / this.height)),
            (t = Math.min(Math.max(t, 0), 1)),
            (e = Math.min(Math.max(e, 0), 1)),
            {
              tiltX: (
                this.reverse *
                (this.settings.max - t * this.settings.max * 2)
              ).toFixed(2),
              tiltY: (
                this.reverse *
                (e * this.settings.max * 2 - this.settings.max)
              ).toFixed(2),
              percentageX: 100 * t,
              percentageY: 100 * e,
              angle:
                Math.atan2(
                  this.event.clientX - (this.left + this.width / 2),
                  -(this.event.clientY - (this.top + this.height / 2))
                ) *
                (180 / Math.PI),
            }
          );
        }),
        (e.prototype.updateElementPosition = function () {
          var t = this.element.getBoundingClientRect();
          (this.width = this.element.offsetWidth),
            (this.height = this.element.offsetHeight),
            (this.left = t.left),
            (this.top = t.top);
        }),
        (e.prototype.update = function () {
          var t = this.getValues();
          (this.element.style.transform =
            "perspective(" +
            this.settings.perspective +
            "px) rotateX(" +
            ("x" === this.settings.axis ? 0 : t.tiltY) +
            "deg) rotateY(" +
            ("y" === this.settings.axis ? 0 : t.tiltX) +
            "deg) scale3d(" +
            this.settings.scale +
            ", " +
            this.settings.scale +
            ", " +
            this.settings.scale +
            ")"),
            this.glare &&
              ((this.glareElement.style.transform =
                "rotate(" + t.angle + "deg) translate(-50%, -50%)"),
              (this.glareElement.style.opacity =
                "" + (t.percentageY * this.settings["max-glare"]) / 100)),
            this.element.dispatchEvent(
              new CustomEvent("tiltChange", { detail: t })
            ),
            (this.updateCall = null);
        }),
        (e.prototype.prepareGlare = function () {
          if (!this.glarePrerender) {
            var t = document.createElement("div");
            t.classList.add("js-tilt-glare");
            var e = document.createElement("div");
            e.classList.add("js-tilt-glare-inner"),
              t.appendChild(e),
              this.element.appendChild(t);
          }
          (this.glareElementWrapper =
            this.element.querySelector(".js-tilt-glare")),
            (this.glareElement = this.element.querySelector(
              ".js-tilt-glare-inner"
            )),
            this.glarePrerender ||
              (Object.assign(this.glareElementWrapper.style, {
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                "pointer-events": "none",
                "border-radius": "inherit",
              }),
              Object.assign(this.glareElement.style, {
                position: "absolute",
                top: "50%",
                left: "50%",
                "pointer-events": "none",
                "background-image":
                  "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
                transform: "rotate(180deg) translate(-50%, -50%)",
                "transform-origin": "0% 0%",
                opacity: "0",
              }),
              this.updateGlareSize());
        }),
        (e.prototype.updateGlareSize = function () {
          if (this.glare) {
            var t =
              2 *
              (this.element.offsetWidth > this.element.offsetHeight
                ? this.element.offsetWidth
                : this.element.offsetHeight);
            Object.assign(this.glareElement.style, {
              width: t + "px",
              height: t + "px",
            });
          }
        }),
        (e.prototype.updateClientSize = function () {
          (this.clientWidth =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth),
            (this.clientHeight =
              window.innerHeight ||
              document.documentElement.clientHeight ||
              document.body.clientHeight);
        }),
        (e.prototype.onWindowResize = function () {
          this.updateGlareSize(), this.updateClientSize();
        }),
        (e.prototype.setTransition = function () {
          var t = this;
          clearTimeout(this.transitionTimeout),
            (this.element.style.transition =
              this.settings.speed + "ms " + this.settings.easing),
            this.glare &&
              (this.glareElement.style.transition =
                "opacity " +
                this.settings.speed +
                "ms " +
                this.settings.easing),
            (this.transitionTimeout = setTimeout(function () {
              (t.element.style.transition = ""),
                t.glare && (t.glareElement.style.transition = "");
            }, this.settings.speed));
        }),
        (e.prototype.extendSettings = function (t) {
          var e = {
              reverse: !1,
              max: 15,
              startX: 0,
              startY: 0,
              perspective: 1e3,
              easing: "cubic-bezier(.03,.98,.52,.99)",
              scale: 1,
              speed: 300,
              transition: !0,
              axis: null,
              glare: !1,
              "max-glare": 1,
              "glare-prerender": !1,
              "full-page-listening": !1,
              "mouse-event-element": null,
              reset: !0,
              "reset-to-start": !0,
              gyroscope: !0,
              gyroscopeMinAngleX: -45,
              gyroscopeMaxAngleX: 45,
              gyroscopeMinAngleY: -45,
              gyroscopeMaxAngleY: 45,
              gyroscopeSamples: 10,
            },
            i = {};
          for (var s in e)
            if (s in t) i[s] = t[s];
            else if (this.element.hasAttribute("data-tilt-" + s)) {
              var n = this.element.getAttribute("data-tilt-" + s);
              try {
                i[s] = JSON.parse(n);
              } catch (t) {
                i[s] = n;
              }
            } else i[s] = e[s];
          return i;
        }),
        (e.init = function (t, i) {
          t instanceof Node && (t = [t]),
            t instanceof NodeList && (t = [].slice.call(t)),
            t instanceof Array &&
              t.forEach(function (t) {
                "vanillaTilt" in t || (t.vanillaTilt = new e(t, i));
              });
        }),
        e
      );
    })();
  return (
    "undefined" != typeof document &&
      ((window.VanillaTilt = e),
      e.init(document.querySelectorAll("[data-tilt]"))),
    e
  );
})();
