describe('Scrollspy component', () => {
  const DELAY_IN_MS = 600;
  const fixture1 = `
      <div class="row">
          <div class="col m7">
              <div id="introduction" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: red;">
                  introduction
              </div>
              <div id="initialization" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: green;">
                  initialization
              </div>
              <div id="options" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;">
                  options
              </div>
          </div>
          <div class="col hide-on-small-only m5">
              <div class="toc-wrapper pinned" style="top: 0px;">
                  <div style="height: 1px">
                      <ul class="section table-of-contents">
                          <li>
                              <a href="#introduction" class="">Introduction</a>
                          </li>
                          <li>
                              <a href="#initialization" class="">Initialization</a>
                          </li>
                          <li>
                              <a href="#options" class="">Options</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
          <div id="testContainerId" style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;" />
      </div>
  `;
  const fixture2 = `
      <div class="row">
          <div class="col m7">
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
              <div id="introduction" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: red;">
                  introduction
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
              <div id="initialization" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: green;">
                  initialization
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
              <div id="options" class="section scrollspy"
                  style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;">
                  options
              </div>
              <div class="noScrollSpy" style="height: 200vh; margin: 0; padding: 0;  background-color: grey;"></div>
          </div>
          <div class="col hide-on-small-only m5">
              <div class="toc-wrapper pinned" style="top: 0px;">
                  <div style="height: 1px">
                      <ul class="section table-of-contents">
                          <li>
                              <a href="#introduction" class="">Introduction</a>
                          </li>
                          <li>
                              <a href="#initialization" class="">Initialization</a>
                          </li>
                          <li>
                              <a href="#options" class="">Options</a>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
          <div id="testContainerId" style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;" />
      </div>
  `;
  let scrollspyInstances = [];

  function resetScrollspy(options) {
    options = options ? options : {};
    scrollspyInstances.forEach((value) => value.destroy());
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, options);
  }

  function clickLink(value) {
    document.querySelector(`a[href="#${value}"]`).click();
  }

  function isItemActive(value, activeClassName) {
    activeClassName = activeClassName ? activeClassName : 'active';
    const element = document.querySelector(`a[href="#${value}"]`);
    return Array.from(element.classList).includes(activeClassName);
  }

  function getDistanceFromTop(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const distanceFromTop = rect.top + scrollTop;

    return distanceFromTop;
  }

  function smoothScrollTo(value) {
    window.scrollTo({
      top: value,
      behavior: 'smooth'
    });
  }

  describe('Scrollspy with keepTopElementActive flag test cases', () => {
    beforeEach(() => {
      XloadHtml(fixture2, { insertionType: 'prepend' });
      window.scrollTo(0, 0);
      const elements = document.querySelectorAll('.scrollspy');
      scrollspyInstances = M.ScrollSpy.init(elements, {});
    });

    afterEach(() => {
      scrollspyInstances.forEach((value) => value.destroy());
      XunloadFixtures();
    });

    it('Test first element is active on true keepTopElementActive even if the elements are much lower down on the page', () => {
      resetScrollspy({ keepTopElementActive: true });
      expect(isItemActive('introduction')).toBeTrue();
      expect(isItemActive('initialization')).toBeFalse();
      expect(isItemActive('options')).toBeFalse();
    });

    it('Test default keepTopElementActive value if false', () => {
      expect(isItemActive('introduction')).toBeFalse();
      expect(isItemActive('initialization')).toBeFalse();
      expect(isItemActive('options')).toBeFalse();
    });

    it('Test no active elements on false keepTopElementActive if the elements are much lower down on the page', () => {
      resetScrollspy({ keepTopElementActive: false });
      expect(isItemActive('introduction')).toBeFalse();
      expect(isItemActive('initialization')).toBeFalse();
      expect(isItemActive('options')).toBeFalse();
    });

    it('Test scroll to the bottom and to the top of the page should keep last and then first element active', (done) => {
      resetScrollspy({ keepTopElementActive: true });

      smoothScrollTo(document.body.scrollHeight);
      setTimeout(() => {
        expect(isItemActive('introduction')).toBeFalse();
        expect(isItemActive('initialization')).toBeFalse();
        expect(isItemActive('options')).toBeTrue();

        smoothScrollTo(0);
        setTimeout(() => {
          expect(isItemActive('introduction')).toBeTrue();
          expect(isItemActive('initialization')).toBeFalse();
          expect(isItemActive('options')).toBeFalse();
          done();
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });

    it('Test scroll to the noScrollSpy sections should keep nearest top element active on true keepTopElementActive', (done) => {
      resetScrollspy({ keepTopElementActive: true });

      const [, noScrollSpy2, noScrollSpy3, noScrollSpy4] =
        document.querySelectorAll('.noScrollSpy');

      smoothScrollTo(getDistanceFromTop(noScrollSpy2));
      setTimeout(() => {
        expect(isItemActive('introduction')).toBeTrue();
        expect(isItemActive('initialization')).toBeFalse();
        expect(isItemActive('options')).toBeFalse();

        smoothScrollTo(getDistanceFromTop(noScrollSpy3));
        setTimeout(() => {
          expect(isItemActive('introduction')).toBeFalse();
          expect(isItemActive('initialization')).toBeTrue();
          expect(isItemActive('options')).toBeFalse();

          smoothScrollTo(getDistanceFromTop(noScrollSpy4));
          setTimeout(() => {
            expect(isItemActive('introduction')).toBeFalse();
            expect(isItemActive('initialization')).toBeFalse();
            expect(isItemActive('options')).toBeTrue();
            done();
          }, DELAY_IN_MS);
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });

    it('Test on false keepTopElementActive scroll to the noScrollSpy should not make active elements', (done) => {
      resetScrollspy({ keepTopElementActive: false });

      const [, noScrollSpy2, noScrollSpy3, noScrollSpy4] =
        document.querySelectorAll('.noScrollSpy');

      smoothScrollTo(getDistanceFromTop(noScrollSpy2));
      setTimeout(() => {
        expect(isItemActive('introduction')).toBeFalse();
        expect(isItemActive('initialization')).toBeFalse();
        expect(isItemActive('options')).toBeFalse();

        smoothScrollTo(getDistanceFromTop(noScrollSpy3));
        setTimeout(() => {
          expect(isItemActive('introduction')).toBeFalse();
          expect(isItemActive('initialization')).toBeFalse();
          expect(isItemActive('options')).toBeFalse();

          smoothScrollTo(getDistanceFromTop(noScrollSpy4));
          setTimeout(() => {
            expect(isItemActive('introduction')).toBeFalse();
            expect(isItemActive('initialization')).toBeFalse();
            expect(isItemActive('options')).toBeFalse();
            done();
          }, DELAY_IN_MS);
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });
  });

  describe('Scrollspy basic test cases', () => {
    beforeEach(() => {
      XloadHtml(fixture1, { insertionType: 'prepend' });
      window.scrollTo(0, 0);
      const elements = document.querySelectorAll('.scrollspy');
      scrollspyInstances = M.ScrollSpy.init(elements, {});
    });

    afterEach(() => {
      scrollspyInstances.forEach((value) => value.destroy());
      XunloadFixtures();
    });

    it('Test scrollspy smooth behavior positive case', (done) => {
      const viewportHeightPx = window.innerHeight;

      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop).toBe(viewportHeightPx * 2);
        done();
      }, DELAY_IN_MS);
    });

    it('Test scrollspy smooth behavior negative case', (done) => {
      const viewportHeightPx = window.innerHeight;
      clickLink('options');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop)
          .withContext("Scroll animation shouldn't reach the element in the given time")
          .toBeLessThan(viewportHeightPx * 2);
        done();
      }, 5);
    });

    it('Test click on an item in the table of contents should make item active', (done) => {
      const viewportHeightPx = window.innerHeight;

      clickLink('introduction');
      setTimeout(() => {
        const scrollTop = window.scrollY;
        expect(scrollTop).toBe(viewportHeightPx * 0);
        expect(isItemActive('introduction')).toBeTrue();
        expect(isItemActive('initialization')).toBeFalse();
        expect(isItemActive('options')).toBeFalse();

        clickLink('initialization');
        setTimeout(() => {
          const scrollTop = window.scrollY;
          expect(scrollTop).toBe(viewportHeightPx * 1);
          expect(isItemActive('introduction')).toBeFalse();
          expect(isItemActive('initialization')).toBeTrue();
          expect(isItemActive('options')).toBeFalse();

          clickLink('options');
          setTimeout(() => {
            const scrollTop = window.scrollY;
            expect(scrollTop).toBe(viewportHeightPx * 2);
            expect(isItemActive('introduction')).toBeFalse();
            expect(isItemActive('initialization')).toBeFalse();
            expect(isItemActive('options')).toBeTrue();

            done();
          }, DELAY_IN_MS);
        }, DELAY_IN_MS);
      }, DELAY_IN_MS);
    });

    it('Test click on an item in the table of contents should make item active with explicit class', (done) => {
      resetScrollspy({ activeClass: 'otherActiveExample' });

      clickLink('options');
      setTimeout(() => {
        expect(isItemActive('introduction', 'active')).toBeFalse();
        expect(isItemActive('initialization', 'active')).toBeFalse();
        expect(isItemActive('options', 'active')).toBeFalse();

        expect(isItemActive('introduction', 'otherActiveExample')).toBeFalse();
        expect(isItemActive('initialization', 'otherActiveExample')).toBeFalse();
        expect(isItemActive('options', 'otherActiveExample')).toBeTrue();

        done();
      }, DELAY_IN_MS);
    });

    it('Test explicit getActiveElement implementation', (done) => {
      const customGetActiveElement = (id) => {
        const selector = 'div#testContainerId';
        const testDivElement = document.querySelector(selector);
        testDivElement.textContent = id;
        return selector;
      };
      resetScrollspy({ getActiveElement: customGetActiveElement });

      clickLink('options');
      setTimeout(() => {
        expect(isItemActive('introduction')).toBeFalse();
        expect(isItemActive('initialization')).toBeFalse();
        expect(isItemActive('options')).toBeFalse();

        const element = document.querySelector('div#testContainerId');

        expect(element.textContent).toBe('options');
        expect(Array.from(element.classList)).toEqual(['active']);
        done();
      }, DELAY_IN_MS);
    });
  });
});
