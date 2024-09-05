describe('Scrollspy Plugin', () => {
  const INSTANT_DELAY_TIME = 50;
  const DELAY_TIME_FOR_SMOOTH_SCROLLSPY = 800;
  const fixture = `
<div id="scrollspyRoot" style="
        position: relative;
        top: 0;
        right: 0;
        padding: 0;
        margin: 0;
        width: 300px;
        height: 100%;
        overflow-y: auto;
        background-color: #f8f9fa;
        ">
    <header id="header" class="row" style="height: 100vh; margin: 0; padding: 0;"></header>
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
    </div>
    <footer id="footer" class="row" style="height: 100vh; margin: 0; padding: 0;"></footer>
</div>
`;
  let scrollspyInstances = [];

  beforeEach(() => {
    XloadHtml(fixture, { insertionType: 'prepend' });
    scrollObservers = [];
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, {
      behavior: 'smooth'
    });
  });

  afterEach(() => {
    // scrollspyInstances.forEach((value) => value.destroy());
    // XunloadFixtures();
  });

  function resetScrollspy(options) {
    options = options ? options : {};
    scrollspyInstances.forEach((value) => value.destroy());
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, options);
  }

  function clickLink(value) {
    document.querySelector(`a[href="#${value}"]`).click();
  }

  describe('Dummy cases', () => {
    it('qqq', (done) => {
      // resetScrollspy({ behavior: 'instant' });

      clickLink('options');
      setTimeout(() => {
        scrollspyInstances.forEach((value) => value.destroy());
        
        const elements = document.querySelectorAll('.scrollspy');
        scrollspyInstances = M.ScrollSpy.init(elements, {
          behavior: 'smooth'
        });
        // resetScrollspy({ behavior: 'smooth' });
      }, DELAY_TIME_FOR_SMOOTH_SCROLLSPY);
    });
  });

  // describe('Scrollspy behavior option test', () => {
  //   it('Test default behavior option is smooth', () => {
  //     resetScrollspy();
  //     expect(scrollspyInstances.length).toBe(3);
  //     expect(scrollspyInstances[0].options.behavior).toBe('smooth');
  //     expect(scrollspyInstances[1].options.behavior).toBe('smooth');
  //     expect(scrollspyInstances[2].options.behavior).toBe('smooth');
  //     expect(M.ScrollSpy.DEFAULT_BEHAVIOR).toBe('smooth');
  //   });

  //   it('Test set behavior option to smooth', () => {
  //     resetScrollspy({ behavior: 'smooth' });
  //     expect(scrollspyInstances.length).toBe(3);
  //     expect(scrollspyInstances[0].options.behavior).toBe('smooth');
  //     expect(scrollspyInstances[1].options.behavior).toBe('smooth');
  //     expect(scrollspyInstances[2].options.behavior).toBe('smooth');
  //   });

  //   it('Test set behavior option to instant', () => {
  //     resetScrollspy({ behavior: 'instant' });
  //     expect(scrollspyInstances.length).toBe(3);
  //     expect(scrollspyInstances[0].options.behavior).toBe('instant');
  //     expect(scrollspyInstances[1].options.behavior).toBe('instant');
  //     expect(scrollspyInstances[2].options.behavior).toBe('instant');
  //   });

  //   it('Test set behavior option to undocumented value should keep it as default', () => {
  //     resetScrollspy({ behavior: 'blahblah' });
  //     expect(scrollspyInstances.length).toBe(3);
  //     expect(scrollspyInstances[0].options.behavior).toBe(M.ScrollSpy.DEFAULT_BEHAVIOR);
  //     expect(scrollspyInstances[1].options.behavior).toBe(M.ScrollSpy.DEFAULT_BEHAVIOR);
  //     expect(scrollspyInstances[2].options.behavior).toBe(M.ScrollSpy.DEFAULT_BEHAVIOR);
  //   });

  //   it('Test smooth behavior positive case', (done) => {
  //     resetScrollspy({ behavior: 'smooth' });
  //     const viewportHeightPx = window.innerHeight;

  //     clickLink('options');
  //     setTimeout(() => {
  //       const scrollTop = window.scrollY;
  //       expect(scrollTop).toBe(viewportHeightPx * 3);
  //       done();
  //     }, DELAY_TIME_FOR_SMOOTH_SCROLLSPY);
  //   });

  //   it('Test smooth behavior negative case', (done) => {
  //     resetScrollspy({ behavior: 'smooth' });
  //     const viewportHeightPx = window.innerHeight;

  //     document.querySelector('a[href="#options"]').click();
  //     setTimeout(() => {
  //       const scrollTop = window.scrollY;
  //       expect(scrollTop)
  //         .withContext("Scroll animation shouldn't reach the element in the given time")
  //         .toBeLessThan(viewportHeightPx * 3);
  //       setTimeout(() => {
  //         done();
  //       }, DELAY_TIME_FOR_SMOOTH_SCROLLSPY);
  //     }, 5);
  //   });
  // });

  // describe('Scrollspy component cases', () => {
  //   function getClassListByQuerySelector(querySelector) {
  //     const element = document.querySelector(querySelector);
  //     expect(element).not.toBeNull();
  //     const classList = element.classList;
  //     return Array.from(classList);
  //   }

  //   it('Clicking on an item in the table of contents should scroll to the corresponding content section', (done) => {
  //     resetScrollspy({ behavior: 'instant' });

  //     document.querySelector('#scrollspyRoot').scrollTo(0, 0);
  //     window.scrollTo(0, 0);

  //     const viewportHeightPx = window.innerHeight;

  //     clickLink('introduction');
  //     setTimeout(() => {
  //       const scrollTop = window.scrollY;
  //       expect(scrollTop).toBe(viewportHeightPx);

  //       clickLink('initialization');
  //       setTimeout(() => {
  //         const scrollTop = window.scrollY;
  //         expect(scrollTop).toBe(viewportHeightPx * 2);

  //         clickLink('options');
  //         setTimeout(() => {
  //           const scrollTop = window.scrollY;
  //           expect(scrollTop).toBe(viewportHeightPx * 3);
  //           done();
  //         }, INSTANT_DELAY_TIME);
  //       }, INSTANT_DELAY_TIME);
  //     }, INSTANT_DELAY_TIME);
  //   });

  //   it('Clicking on an item in the table of contents should make item active', (done) => {
  //     resetScrollspy({ behavior: 'instant' });

  //     clickLink('introduction');
  //     setTimeout(() => {
  //       expect(getClassListByQuerySelector('a[href="#introduction"]')).toEqual(['active']);

  //       clickLink('options');
  //       setTimeout(() => {
  //         expect(getClassListByQuerySelector('a[href="#options"]')).toEqual(['active']);

  //         clickLink('initialization');
  //         setTimeout(() => {
  //           expect(getClassListByQuerySelector('a[href="#initialization"]')).toEqual(['active']);
  //           done();
  //         }, INSTANT_DELAY_TIME);
  //       }, INSTANT_DELAY_TIME);
  //     }, INSTANT_DELAY_TIME);
  //   });
  // });
});
