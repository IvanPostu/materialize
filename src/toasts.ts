import anim from "animejs";

let _defaults = {
    text: '',
    displayLength: 4000,
    inDuration: 300,
    outDuration: 375,
    classes: '',
    completeCallback: null,
    activationPercent: 0.8
  };

  export class Toast {
    static _toasts: Toast[];
    static _container: any;
    static _draggedToast: Toast;
    options: any;
    message: string;
    panning: boolean;
    timeRemaining: number;
    el: HTMLDivElement;
    counterInterval: NodeJS.Timeout;
    wasSwiped: any;
    startingXPos: number;
    xPos: any;
    time: number;
    deltaX: number;
    velocityX: number;

    constructor(options: any) {
      this.options = {...Toast.defaults, ...options};
      //this.htmlMessage = this.options.html;
      // Warn when using html
      // if (!!this.options.html)
      //   console.warn(
      //     'The html option is deprecated and will be removed in the future. See https://github.com/materializecss/materialize/pull/49'
      //   );
      // If the new unsafeHTML is used, prefer that
      // if (!!this.options.unsafeHTML) {
      //   this.htmlMessage = this.options.unsafeHTML;
      // }
      this.message = this.options.text;
      this.panning = false;
      this.timeRemaining = this.options.displayLength;
      if (Toast._toasts.length === 0) {
        Toast._createContainer();
      }
      // Create new toast
      Toast._toasts.push(this);
      let toastElement = this._createToast();
      (toastElement as any).M_Toast = this;
      this.el = toastElement;
      this._animateIn();
      this._setTimer();
    }

    static get defaults() {
      return _defaults;
    }

    static getInstance(el) {
      let domElem = !!el.jquery ? el[0] : el;
      return domElem.M_Toast;
    }

    static _createContainer() {
      const container = document.createElement('div');
      container.setAttribute('id', 'toast-container');
      // Add event handler
      container.addEventListener('touchstart', Toast._onDragStart);
      container.addEventListener('touchmove', Toast._onDragMove);
      container.addEventListener('touchend', Toast._onDragEnd);
      container.addEventListener('mousedown', Toast._onDragStart);
      document.addEventListener('mousemove', Toast._onDragMove);
      document.addEventListener('mouseup', Toast._onDragEnd);
      document.body.appendChild(container);
      Toast._container = container;
    }

    static _removeContainer() {
      document.removeEventListener('mousemove', Toast._onDragMove);
      document.removeEventListener('mouseup', Toast._onDragEnd);
      Toast._container.remove();
      Toast._container = null;
    }

    static _onDragStart(e) {
      if (e.target && (<HTMLElement>e.target).closest('.toast')) {
        const toastElem = (<HTMLElement>e.target).closest('.toast');
        const toast: Toast = (toastElem as any).M_Toast;
        toast.panning = true;
        Toast._draggedToast = toast;
        toast.el.classList.add('panning');
        toast.el.style.transition = '';
        toast.startingXPos = Toast._xPos(e);
        toast.time = Date.now();
        toast.xPos = Toast._xPos(e);
      }
    }

    static _onDragMove(e) {
      if (!!Toast._draggedToast) {
        e.preventDefault();
        const toast = Toast._draggedToast;
        toast.deltaX = Math.abs(toast.xPos - Toast._xPos(e));
        toast.xPos = Toast._xPos(e);
        toast.velocityX = toast.deltaX / (Date.now() - toast.time);
        toast.time = Date.now();

        const totalDeltaX = toast.xPos - toast.startingXPos;
        const activationDistance = toast.el.offsetWidth * toast.options.activationPercent;
        toast.el.style.transform = `translateX(${totalDeltaX}px)`;
        toast.el.style.opacity = (1 - Math.abs(totalDeltaX / activationDistance)).toString();
      }
    }

    static _onDragEnd() {
      if (!!Toast._draggedToast) {
        let toast = Toast._draggedToast;
        toast.panning = false;
        toast.el.classList.remove('panning');

        let totalDeltaX = toast.xPos - toast.startingXPos;
        let activationDistance = toast.el.offsetWidth * toast.options.activationPercent;
        let shouldBeDismissed = Math.abs(totalDeltaX) > activationDistance || toast.velocityX > 1;

        // Remove toast
        if (shouldBeDismissed) {
          toast.wasSwiped = true;
          toast.dismiss();
          // Animate toast back to original position
        }
        else {
          toast.el.style.transition = 'transform .2s, opacity .2s';
          toast.el.style.transform = '';
          toast.el.style.opacity = '';
        }
        Toast._draggedToast = null;
      }
    }

    static _xPos(e) {
      if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientX;
      }
      // mouse event
      return e.clientX;
    }

    static dismissAll() {
      for (let toastIndex in Toast._toasts) {
        Toast._toasts[toastIndex].dismiss();
      }
    }

    _createToast() {
      const toast = document.createElement('div');
      toast.classList.add('toast');
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'assertive');
      toast.setAttribute('aria-atomic', 'true');

      // Add custom classes onto toast
      if (this.options.classes.length > 0) {
        toast.classList.add(...this.options.classes.split(' '));
      }

      // Set safe text content
      toast.innerText = this.message;

      // if (
      //   typeof HTMLElement === 'object'
      //     ? this.htmlMessage instanceof HTMLElement
      //     : this.htmlMessage &&
      //       typeof this.htmlMessage === 'object' &&
      //       this.htmlMessage !== null &&
      //       this.htmlMessage.nodeType === 1 &&
      //       typeof this.htmlMessage.nodeName === 'string'
      // ) {
      //   //if the htmlMessage is an HTML node, append it directly
      //   toast.appendChild(this.htmlMessage);
      // }
      // else if (!!this.htmlMessage.jquery) {
      //   // Check if it is jQuery object, append the node
      //   $(toast).append(this.htmlMessage[0]);
      // }
      // else {
      //   // Append as unsanitized html;
      //   $(toast).append(this.htmlMessage);
      // }

      // Append toast
      Toast._container.appendChild(toast);
      return toast;
    }

    _animateIn() {
      // Animate toast in
      anim({
        targets: this.el,
        top: 0,
        opacity: 1,
        duration: this.options.inDuration,
        easing: 'easeOutCubic'
      });
    }

    /**
     * Create setInterval which automatically removes toast when timeRemaining >= 0
     * has been reached
     */
    _setTimer() {
      if (this.timeRemaining !== Infinity) {
        this.counterInterval = setInterval(() => {
          // If toast is not being dragged, decrease its time remaining
          if (!this.panning) {
            this.timeRemaining -= 20;
          }
          // Animate toast out
          if (this.timeRemaining <= 0) {
            this.dismiss();
          }
        }, 20);
      }
    }

    /**
     * Dismiss toast with animation
     */
    dismiss() {
      window.clearInterval(this.counterInterval);
      let activationDistance = this.el.offsetWidth * this.options.activationPercent;

      if (this.wasSwiped) {
        this.el.style.transition = 'transform .05s, opacity .05s';
        this.el.style.transform = `translateX(${activationDistance}px)`;
        this.el.style.opacity = '0';
      }

      anim({
        targets: this.el,
        opacity: 0,
        marginTop: -40,
        duration: this.options.outDuration,
        easing: 'easeOutExpo',
        complete: () => {
          // Call the optional callback
          if (typeof this.options.completeCallback === 'function') {
            this.options.completeCallback();
          }
          // Remove toast from DOM
          this.el.remove();
          Toast._toasts.splice(Toast._toasts.indexOf(this), 1);
          if (Toast._toasts.length === 0) {
            Toast._removeContainer();
          }
        }
      });
    }

    static {          
      Toast._toasts = [];
      Toast._container = null;
      Toast._draggedToast = null;
    }
  }