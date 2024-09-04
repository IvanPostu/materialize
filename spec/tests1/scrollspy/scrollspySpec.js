describe('Scrollspy Plugin', () => {
  const DELAY_TIME = 600;
  const fixture = `
<div class="container">
    <div id="heading" class="row" style="height: 100vh; margin: 0; padding: 0;"></div>
    <div class="row">
        <div class="col m7">
            <div id="introduction" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0;  background-color: red;">
                introduction
            </div>
            <div id="initialization" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0;  background-color: green;">
                initialization
            </div>
            <div id="options" class="section scrollspy" style="height: 100vh; margin: 0; padding: 0;  background-color: yellow;">
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
    <div id="footer" class="row" style="height: 100vh; margin: 0; padding: 0;"></div>
</div>
`;
  let scrollspyInstances = [];

  beforeEach(() => {
    XloadHtml(fixture);
    window.scrollTo(0, 0);
    scrollObservers = [];
    const elements = document.querySelectorAll('.scrollspy');
    scrollspyInstances = M.ScrollSpy.init(elements, {});
  });

  afterEach(() => {
    scrollspyInstances.forEach((value) => value.destroy());
    XunloadFixtures();
  });

  describe('Scrollspy table of contents manipulations', () => {
    function getClassListByQuerySelector(querySelector) {
      const element = document.querySelector(querySelector);
      expect(element).not.toBeNull();
      const classList = element.classList;
      return Array.from(classList);
    }

    it('Clicking on an item in the table of contents should scroll to the corresponding content section', (done) => {
      const introductionElement = document.querySelector('#introduction');

      const viewportHeightPx = window.innerHeight;
      const distanceToTopInPixels =
        introductionElement.getBoundingClientRect().top - viewportHeightPx;

      document.querySelector('a[href="#introduction"]').click();
      setTimeout(() => {
        const scrollTop = window.scrollY;
        console.log(viewportHeightPx, )
        expect(scrollTop).toBe(viewportHeightPx + distanceToTopInPixels);
        document.querySelector('a[href="#initialization"]').click();
        setTimeout(() => {
          const scrollTop = window.scrollY;
          expect(scrollTop).toBe(2 * viewportHeightPx + distanceToTopInPixels);

          document.querySelector('a[href="#options"]').click();
          setTimeout(() => {
            const scrollTop = window.scrollY;
            expect(scrollTop).toBe(3 * viewportHeightPx + distanceToTopInPixels);

            done();
          }, DELAY_TIME);
        }, DELAY_TIME);
      }, DELAY_TIME);
    });

    it('Clicking on an item in the table of contents should make item active', (done) => {
      document.querySelector('a[href="#introduction"]').click();
      setTimeout(() => {
        expect(getClassListByQuerySelector('a[href="#introduction"]')).toEqual(['active']);

        document.querySelector('a[href="#options"]').click();
        setTimeout(() => {
          expect(getClassListByQuerySelector('a[href="#options"]')).toEqual(['active']);

          document.querySelector('a[href="#initialization"]').click();
          setTimeout(() => {
            expect(getClassListByQuerySelector('a[href="#initialization"]')).toEqual(['active']);

            done();
          }, DELAY_TIME);
        }, DELAY_TIME);
      }, DELAY_TIME);
    });
  });
});
